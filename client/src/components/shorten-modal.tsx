import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUrlSchema } from "@shared/schema";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const shortenSchema = insertUrlSchema.extend({
  longUrl: z.string().url("Please enter a valid URL"),
});

type ShortenData = z.infer<typeof shortenSchema>;

interface ShortenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShortenModal({ isOpen, onClose }: ShortenModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<ShortenData>({
    resolver: zodResolver(shortenSchema),
    defaultValues: {
      longUrl: "",
      customAlias: "",
      title: "",
      tags: [],
    },
  });

  const shortenMutation = useMutation({
    mutationFn: async (data: ShortenData) => {
      const response = await apiRequest("POST", "/api/shorten", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/urls"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "URL shortened successfully",
        description: "Your shortened URL has been created.",
      });
      form.reset();
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to shorten URL",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ShortenData) => {
    const tagsArray = data.tags && typeof data.tags === 'string' 
      ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      : data.tags || [];
    
    shortenMutation.mutate({
      ...data,
      tags: tagsArray,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Shorten URL</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="longUrl">Long URL</Label>
            <Input
              id="longUrl"
              type="url"
              placeholder="https://example.com/very-long-url"
              {...form.register("longUrl")}
              disabled={shortenMutation.isPending}
            />
            {form.formState.errors.longUrl && (
              <p className="text-sm text-red-600">{form.formState.errors.longUrl.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title (Optional)</Label>
            <Input
              id="title"
              placeholder="Page title or description"
              {...form.register("title")}
              disabled={shortenMutation.isPending}
            />
          </div>
          
          {user?.isPremium && (
            <>
              <div className="space-y-2">
                <Label htmlFor="customAlias" className="flex items-center space-x-2">
                  <span>Custom Alias</span>
                  <Badge variant="secondary" className="text-xs">PRO</Badge>
                </Label>
                <Input
                  id="customAlias"
                  placeholder="my-custom-alias"
                  {...form.register("customAlias")}
                  disabled={shortenMutation.isPending}
                />
                <p className="text-xs text-gray-500">
                  Will create: {window.location.origin}/my-custom-alias
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="marketing, campaign, social"
                  {...form.register("tags")}
                  disabled={shortenMutation.isPending}
                />
                <p className="text-xs text-gray-500">
                  Comma-separated tags for organization
                </p>
              </div>
            </>
          )}
          
          <div className="flex space-x-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={shortenMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={shortenMutation.isPending}
              className="flex items-center space-x-2"
            >
              <Link className="h-4 w-4" />
              <span>{shortenMutation.isPending ? "Shortening..." : "Shorten URL"}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
