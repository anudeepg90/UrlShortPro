import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link, Copy, Check, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  const form = useForm<ShortenData>({
    resolver: zodResolver(shortenSchema),
    defaultValues: {
      longUrl: "",
    },
  });

  const onSubmit = async (data: ShortenData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/shorten/public", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }

      const result = await response.json();
      setShortenedUrl(result);
      form.reset();
      
      toast({
        title: "URL shortened successfully!",
        description: "Your shortened URL is ready to share.",
      });
    } catch (error) {
      toast({
        title: "Failed to shorten URL",
        description: "Please try again or check if the URL is valid.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getShortUrl = (url: ShortenedUrl) => {
    return `${window.location.origin}/${url.shortId}`;
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
              </div>
            </div>
          </div>

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