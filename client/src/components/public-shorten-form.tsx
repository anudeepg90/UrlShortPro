import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link, Copy, Check, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QRCodeCanvas } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { config } from "@/lib/config";

const shortenSchema = z.object({
  longUrl: z.string().url("Please enter a valid URL"),
});

type ShortenData = z.infer<typeof shortenSchema>;

interface ShortenedUrl {
  id: number;
  shortId: string;
  longUrl: string;
  title?: string;
}

export default function PublicShortenForm() {
  const { toast } = useToast();
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedUrl | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const form = useForm<ShortenData>({
    resolver: zodResolver(shortenSchema),
    defaultValues: {
      longUrl: "",
    },
  });

  const onSubmit = async (data: ShortenData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/shorten/public`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to shorten URL");
      }

      const result = await response.json();
      setShortenedUrl(result);
      form.reset();
      
      toast({
        title: "URL shortened successfully!",
        description: "Your shortened URL is ready to share.",
      });
    } catch (error) {
      console.error("Shorten error:", error);
      toast({
        title: "Failed to shorten URL",
        description: error instanceof Error ? error.message : "Please try again or check if the URL is valid.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getShortUrl = (url: ShortenedUrl) => {
    return `${config.apiBaseUrl}/${url.shortId}`;
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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
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

  const handleNewUrl = () => {
    setShortenedUrl(null);
    form.reset();
  };

  if (shortenedUrl) {
    return (
      <Card className="bg-white shadow-lg border border-gray-200">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">URL Shortened Successfully!</h3>
            <p className="text-gray-600">Your new short URL is ready to share</p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original URL
              </label>
              <p className="text-sm text-gray-600 truncate">{shortenedUrl.longUrl}</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shortened URL
              </label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 text-primary font-mono font-medium">
                  {getShortUrl(shortenedUrl)}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex items-center space-x-1"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="text-xs">{copied ? "Copied!" : "Copy"}</span>
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

          <Dialog open={showQr} onOpenChange={setShowQr}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>QR Code for Short URL</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-4">
                <QRCodeCanvas
                  id="qr-code-canvas"
                  value={getShortUrl(shortenedUrl)}
                  size={2048}
                  level="H"
                  includeMargin={true}
                  style={{ width: '100%', height: 'auto', maxWidth: '400px', background: 'white' }}
                />
                <Button onClick={downloadQrCode} className="w-full bg-primary text-white">
                  Download as JPG (4K)
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex justify-center mt-6">
            <Button onClick={handleNewUrl} variant="outline">
              Shorten Another URL
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-lg border border-gray-200">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Link className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Shorten Your URL</h3>
          <p className="text-gray-600">Paste your long URL below and get a short link instantly</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Input
              type="url"
              placeholder="https://example.com/your-very-long-url"
              {...form.register("longUrl")}
              disabled={isLoading}
              className="text-center text-lg py-6"
            />
            {form.formState.errors.longUrl && (
              <p className="text-sm text-red-600 text-center">
                {form.formState.errors.longUrl.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-blue-600 text-white py-6 text-lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Shortening...
              </>
            ) : (
              <>
                <Link className="h-5 w-5 mr-2" />
                Shorten URL
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            No account required • Free forever • Get analytics with premium
          </p>
        </div>
      </CardContent>
    </Card>
  );
}