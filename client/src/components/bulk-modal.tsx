import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BulkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BulkModal({ isOpen, onClose }: BulkModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [urls, setUrls] = useState("");
  const [activeTab, setActiveTab] = useState("textarea");

  const bulkShortenMutation = useMutation({
    mutationFn: async (urlList: any[]) => {
      const response = await apiRequest("POST", "/api/shorten/bulk", { urls: urlList });
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/urls"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      
      const { results } = data;
      const successCount = results.filter((r: any) => !r.error).length;
      const errorCount = results.filter((r: any) => r.error).length;
      
      toast({
        title: "Bulk operation completed",
        description: `${successCount} URLs shortened successfully${errorCount ? `, ${errorCount} failed` : ""}.`,
      });
      
      setUrls("");
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Bulk operation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    const urlList = urls
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(url => ({ longUrl: url }));

    if (urlList.length === 0) {
      toast({
        title: "No URLs provided",
        description: "Please enter at least one URL.",
        variant: "destructive",
      });
      return;
    }

    if (urlList.length > 100) {
      toast({
        title: "Too many URLs",
        description: "Maximum 100 URLs per batch.",
        variant: "destructive",
      });
      return;
    }

    bulkShortenMutation.mutate(urlList);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Bulk Shorten URLs</span>
            {user?.isPremium && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">PREMIUM</Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="textarea" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Paste URLs</span>
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Upload CSV</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="textarea" className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  URLs (one per line)
                </label>
                <Textarea
                  rows={8}
                  placeholder="https://example.com/page1&#10;https://example.com/page2&#10;https://example.com/page3"
                  value={urls}
                  onChange={(e) => setUrls(e.target.value)}
                  disabled={bulkShortenMutation.isPending}
                />
                <p className="text-xs text-gray-500">
                  Enter each URL on a new line. Up to 100 URLs per batch.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="text-3xl text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">CSV upload coming soon</p>
                <p className="text-xs text-gray-500">
                  This feature will be available in the next update
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">CSV Format Requirements:</h4>
            <p className="text-xs text-blue-700">Headers: <code>url,alias,tags</code></p>
            <p className="text-xs text-blue-700">Example: <code>https://example.com,my-alias,marketing,social</code></p>
          </div>
        </div>
        
        <div className="flex space-x-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={bulkShortenMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={bulkShortenMutation.isPending || (activeTab === "textarea" && !urls.trim())}
            className="bg-primary hover:bg-primary/90 flex items-center space-x-2"
          >
            <List className="h-4 w-4" />
            <span>{bulkShortenMutation.isPending ? "Processing..." : "Process URLs"}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
