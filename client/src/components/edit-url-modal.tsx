import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Edit, Crown, Globe, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { config } from "@/lib/config";
import { useAuth } from "@/hooks/use-auth";

const editUrlSchema = z.object({
  longUrl: z.string().url("Please enter a valid URL"),
  customAlias: z.string().optional(),
  title: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type EditUrlData = z.infer<typeof editUrlSchema>;

interface Url {
  id: number;
  shortId: string;
  longUrl: string;
  customAlias?: string;
  title?: string;
  tags?: string[];
  clickCount: number;
  createdAt: string;
}

interface EditUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: Url | null;
}

export default function EditUrlModal({ isOpen, onClose, url }: EditUrlModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isCheckingAlias, setIsCheckingAlias] = useState(false);
  const [aliasAvailable, setAliasAvailable] = useState<boolean | null>(null);

  const form = useForm<EditUrlData>({
    resolver: zodResolver(editUrlSchema),
    defaultValues: {
      longUrl: "",
      customAlias: "",
      title: "",
      tags: [],
    },
  });

  useEffect(() => {
    if (url) {
      const urlTags: string[] = url.tags || [];
      setTags(urlTags);
      form.reset({
        longUrl: url.longUrl,
        customAlias: url.customAlias || "",
        title: url.title || "",
        tags: urlTags,
      });
    }
  }, [url, form]);

  const updateUrlMutation = useMutation({
    mutationFn: async (data: EditUrlData) => {
      const response = await fetch(`${config.apiBaseUrl}/api/url/${url?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...data,
          tags: tags, // Use the local tags state
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update URL");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "URL updated successfully!",
        description: "Your URL has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update URL",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EditUrlData) => {
    updateUrlMutation.mutate({
      ...data,
      tags: tags, // Use the local tags state
    });
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

  const validateCustomAlias = async (alias: string) => {
    if (!alias || alias === url?.customAlias) return null;
    
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/url/${alias}`, {
        method: 'HEAD'
      });
      if (response.ok) {
        return "This custom alias is already taken";
      }
    } catch (error) {
      // If error, alias is available
    }
    return null;
  };

  if (!url) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Edit className="h-4 w-4 text-white" />
            </div>
            <span>Edit URL</span>
            {user?.isPremium && (
              <Crown className="h-5 w-5 text-amber-500" />
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Original URL Info */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Original URL</Label>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-start gap-3">
                <Globe className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700 break-all leading-relaxed flex-1">
                  {url.longUrl}
                </p>
              </div>
            </div>
          </div>

          {/* Current Short URL */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Current Short URL</Label>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <ExternalLink className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-mono text-blue-800 break-all flex-1">
                  {config.apiBaseUrl}/{url.customAlias || url.shortId}
                </p>
              </div>
            </div>
          </div>

          {/* Custom Alias */}
          <div className="space-y-3">
            <Label htmlFor="customAlias" className="text-sm font-medium text-gray-700">
              Custom Alias 
              {user?.isPremium && (
                <span className="text-amber-600 ml-1">(Premium)</span>
              )}
            </Label>
            <div className="flex flex-col sm:flex-row gap-0">
              <div className="flex items-center px-4 py-3 bg-gray-100 border border-gray-300 rounded-l-xl text-sm text-gray-600 font-mono flex-shrink-0">
                {config.apiBaseUrl}/
              </div>
              <Input
                id="customAlias"
                {...form.register("customAlias")}
                disabled={updateUrlMutation.isPending ?? false}
                placeholder="my-custom-link"
                className="rounded-l-none sm:rounded-l-none border-l-0 focus:border-blue-500 focus:ring-blue-500 flex-1"
              />
            </div>
            {form.formState.errors.customAlias && (
              <p className="text-sm text-red-600">{form.formState.errors.customAlias.message}</p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Tags 
              {user?.isPremium && (
                <span className="text-amber-600 ml-1">(Premium)</span>
              )}
            </Label>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                    <span className="text-sm">{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addTag}
                disabled={!newTag.trim()}
                variant="outline"
                size="sm"
                className="px-4 sm:w-auto w-full"
              >
                Add
              </Button>
            </div>
          </div>

          <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateUrlMutation.isPending ?? false}
              className="px-6 w-full sm:w-auto"
            >
              {updateUrlMutation.isPending ?? false ? "Updating..." : "Update URL"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}