import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUrlSchema } from "@shared/schema";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Link, Copy, Check, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QRCodeCanvas } from 'qrcode.react';
import { useState } from "react";
import { appConfig } from "@/lib/config";


const shortenSchema = insertUrlSchema.extend({
  longUrl: z.string().url("Please enter a valid URL"),
}).omit({
  shortId: true, // Remove shortId as it's generated on server
  userId: true,   // Remove userId as it's set on server
});

type ShortenData = z.infer<typeof shortenSchema>;

interface ShortenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShortenModal({ isOpen, onClose }: ShortenModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showQr, setShowQr] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState<any>(null);

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
      const result = await response.json();
      return result;
    },
    onSuccess: (data) => {
      // Invalidate all URL-related queries to refresh the table
      queryClient.invalidateQueries({ queryKey: ["/api/urls"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      // Force refetch the URLs to show the new URL immediately
      queryClient.refetchQueries({ queryKey: ["/api/urls"] });
      setShortenedUrl(data);
      toast({
        title: "URL shortened successfully",
        description: "Your shortened URL has been created.",
      });
    },
    onError: (error: Error) => {
      console.error("Error shortening URL:", error);
      toast({
        title: "Failed to shorten URL",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getShortUrl = (url: any) => {
    const shortUrl = `https://${appConfig.shortUrlDomain}/${url.customAlias || url.shortId}`;
    return shortUrl;
  };

  const downloadQrCode = () => {
    const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const image = canvas.toDataURL('image/jpeg', 1.0);
    const link = document.createElement('a');
    link.href = image;
    link.download = 'short-url-qr.jpg';
    link.click();
  };

  const copyToClipboard = async () => {
    if (!shortenedUrl) return;
    
    try {
      await navigator.clipboard.writeText(getShortUrl(shortenedUrl));
      toast({
        title: "Copied to clipboard!",
        description: "The shortened URL is now in your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the URL manually.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: ShortenData) => {
    // Handle tags - they can be either string array or comma-separated string
    let tagsArray: string[] = [];
    if (data.tags) {
      if (Array.isArray(data.tags)) {
        tagsArray = data.tags;
      } else if (typeof data.tags === 'string') {
        tagsArray = (data.tags as string).split(',').map((tag: string) => tag.trim()).filter(Boolean);
      }
    }
    
    const finalData = {
      ...data,
      tags: tagsArray,
    };
    
    shortenMutation.mutate(finalData);
  };

  const handleClose = () => {
    setShortenedUrl(null);
    form.reset();
    onClose();
  };

  // Show success state with QR code
  if (shortenedUrl) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>URL Shortened Successfully!</DialogTitle>
            <DialogDescription>
              Your shortened URL is ready to share and use.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original URL
              </label>
              <p className="text-sm text-gray-600 break-all">{shortenedUrl.longUrl}</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shortened URL
              </label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 text-primary font-mono font-medium text-sm break-all">
                  {getShortUrl(shortenedUrl)}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex items-center space-x-1"
                >
                  <Copy className="h-4 w-4" />
                  <span className="text-xs">Copy</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(getShortUrl(shortenedUrl), '_blank')}
                  className="flex items-center space-x-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="text-xs">Test</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQr(true)}
                  className="flex items-center space-x-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" /></svg>
                  <span className="text-xs">QR</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={() => {
                setShortenedUrl(null);
                form.reset();
              }}
              className="flex items-center space-x-2"
            >
              <Link className="h-4 w-4" />
              <span>Shorten Another</span>
            </Button>
          </div>

          <Dialog open={showQr} onOpenChange={setShowQr}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>QR Code for Short URL</DialogTitle>
                <DialogDescription>
                  Scan this QR code to access your shortened URL.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-4">
                <QRCodeCanvas
                  id="qr-code-canvas"
                  value={getShortUrl(shortenedUrl)}
                  size={200}
                  level="M"
                  includeMargin={true}
                />
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={downloadQrCode}
                    className="flex items-center space-x-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <span>Download</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowQr(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Shorten URL</span>
            {user?.isPremium && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">PREMIUM</Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Create a shortened URL for easy sharing and tracking.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="longUrl">Long URL *</Label>
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
            <Label htmlFor="customAlias">Custom Alias (Optional)</Label>
            <Input
              id="customAlias"
              placeholder="my-custom-alias"
              {...form.register("customAlias")}
              disabled={shortenMutation.isPending}
            />
            <p className="text-xs text-gray-500">
              Leave empty for auto-generated short ID
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title (Optional)</Label>
            <Input
              id="title"
              placeholder="My shortened link"
              {...form.register("title")}
              disabled={shortenMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (Optional)</Label>
            <Input
              id="tags"
              placeholder="marketing, social, campaign"
              {...form.register("tags")}
              disabled={shortenMutation.isPending}
            />
            <p className="text-xs text-gray-500">
              Separate tags with commas
            </p>
          </div>

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
              disabled={shortenMutation.isPending || !form.formState.isValid}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-300"
            >
              <Link className="h-4 w-4" />
              <span>{shortenMutation.isPending ? "Creating..." : "Shorten URL"}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
