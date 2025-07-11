import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Edit, X, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const editUrlSchema = z.object({
  customAlias: z.string().optional(),
  tags: z.string().optional(),
});

type EditUrlData = z.infer<typeof editUrlSchema>;

interface EditUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: {
    id: number;
    longUrl: string;
    shortId: string;
    customAlias?: string;
    title?: string;
    tags?: string[];
  } | null;
}

export default function EditUrlModal({ isOpen, onClose, url }: EditUrlModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const form = useForm<EditUrlData>({
    resolver: zodResolver(editUrlSchema),
    defaultValues: {
      customAlias: "",
      tags: "",
    },
  });

  useEffect(() => {
    if (url) {
      form.setValue("customAlias", url.customAlias || "");
      setTags(url.tags || []);
    }
  }, [url, form]);

  const editUrlMutation = useMutation({
    mutationFn: async (data: EditUrlData) => {
      if (!url) throw new Error("No URL selected");
      
      const res = await apiRequest("PUT", `/api/url/${url.id}`, {
        customAlias: data.customAlias || null,
        tags: tags,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/urls"] });
      toast({
        title: "URL updated",
        description: "Your URL has been successfully updated.",
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EditUrlData) => {
    if (!user?.isPremium) {
      toast({
        title: "Premium required",
        description: "Editing URLs is a premium feature. Please upgrade your account.",
        variant: "destructive",
      });
      return;
    }
    editUrlMutation.mutate(data);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  if (!url) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Edit className="h-5 w-5" />
            <span>Edit URL</span>
            {!user?.isPremium && (
              <Crown className="h-4 w-4 text-accent" />
            )}
          </DialogTitle>
        </DialogHeader>

        {!user?.isPremium && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Premium Feature:</strong> URL editing requires a premium subscription. 
              Upgrade to customize aliases and manage tags.
            </p>
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Original URL Info */}
          <div className="space-y-2">
            <Label>Original URL</Label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 truncate">{url.longUrl}</p>
            </div>
          </div>

          {/* Current Short URL */}
          <div className="space-y-2">
            <Label>Current Short URL</Label>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-mono text-blue-800">
                {window.location.origin}/{url.customAlias || url.shortId}
              </p>
            </div>
          </div>

          {/* Custom Alias */}
          <div className="space-y-2">
            <Label htmlFor="customAlias">
              Custom Alias {!user?.isPremium && <span className="text-accent">(Premium)</span>}
            </Label>
            <div className="flex">
              <div className="flex items-center px-3 bg-gray-100 border border-r-0 rounded-l-md text-sm text-gray-600">
                {window.location.origin}/
              </div>
              <Input
                id="customAlias"
                {...form.register("customAlias")}
                disabled={!user?.isPremium || editUrlMutation.isPending}
                placeholder="my-custom-link"
                className="rounded-l-none"
              />
            </div>
            {form.formState.errors.customAlias && (
              <p className="text-sm text-red-600">{form.formState.errors.customAlias.message}</p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>
              Tags {!user?.isPremium && <span className="text-accent">(Premium)</span>}
            </Label>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    {user?.isPremium && (
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex space-x-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!user?.isPremium}
                placeholder="Add a tag"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addTag}
                disabled={!user?.isPremium || !newTag.trim()}
                variant="outline"
                size="sm"
              >
                Add
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!user?.isPremium || editUrlMutation.isPending}
            >
              {editUrlMutation.isPending ? "Updating..." : "Update URL"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}