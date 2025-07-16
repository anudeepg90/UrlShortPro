import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Copy, 
  Edit, 
  Trash2, 
  BarChart3, 
  Globe,
  Search,
  Crown,
  ExternalLink,
  QrCode
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import EditUrlModal from "@/components/edit-url-modal";
import { QRCodeCanvas } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Url {
  id: number;
  longUrl: string;
  shortId: string;
  customAlias?: string;
  title?: string;
  tags?: string[];
  clickCount: number;
  createdAt: string;
  lastAccessedAt?: string;
}

interface UrlTableProps {
  onShowAnalytics: (urlId: number) => void;
}

export default function UrlTable({ onShowAnalytics }: UrlTableProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<Url | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrUrl, setQrUrl] = useState<string>("");

  const { data: urls, isLoading } = useQuery<Url[]>({
    queryKey: ["/api/urls"],
    queryFn: async () => {
      const response = await fetch(`/api/urls?page=${page}&limit=10`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch URLs");
      }
      const data = await response.json();
      return data;
    },
  });

  const deleteUrlMutation = useMutation({
    mutationFn: async (urlId: number) => {
      await apiRequest("DELETE", `/api/url/${urlId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/urls"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "URL deleted",
        description: "The URL has been successfully deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Short URL has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy URL to clipboard.",
        variant: "destructive",
      });
    }
  };

  const getShortUrl = (url: Url) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/${url.customAlias || url.shortId}`;
  };

  const handleDelete = (urlId: number) => {
    if (confirm("Are you sure you want to delete this URL? This action cannot be undone.")) {
      deleteUrlMutation.mutate(urlId);
    }
  };

  const handleEdit = (url: Url) => {
    setSelectedUrl(url);
    setShowEditModal(true);
  };

  const handleShowQr = (url: Url) => {
    setQrUrl(getShortUrl(url));
    setShowQrModal(true);
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

  const filteredUrls = urls?.filter(url => 
    url.longUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
    url.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    url.customAlias?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    url.shortId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    url.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded-lg w-1/3"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search URLs, aliases, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* URLs Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Globe className="h-5 w-5 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent" />
            Your Links
            <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              {filteredUrls.length}
            </Badge>
          </h3>
        </div>
        
        {filteredUrls.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No URLs found</h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              {searchQuery ? "No URLs match your search criteria." : "Create your first shortened URL to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-gray-100 bg-gradient-to-r from-blue-50/30 to-indigo-50/30">
                  <TableHead className="font-semibold text-gray-700 py-4 px-6 w-[35%]">Original URL</TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4 px-6 w-[25%]">Short Link</TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4 px-6 w-[15%] text-center">Clicks</TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4 px-6 w-[15%]">Created</TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4 px-6 w-[10%] text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUrls.map((url) => (
                  <TableRow key={url.id} className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30 transition-all duration-200 border-b border-gray-100">
                    <TableCell className="py-6 px-6 align-top">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                            <ExternalLink className="text-white h-5 w-5" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900 mb-2">
                              {url.title || "Shortened Link"}
                            </p>
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <p className="text-sm text-gray-600 break-all leading-relaxed">
                                {url.longUrl}
                              </p>
                            </div>
                          </div>
                          {url.tags && url.tags.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                              {url.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs px-2 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200">
                                  {tag}
                                </Badge>
                              ))}
                              {url.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs px-2 py-1 border-blue-200 text-blue-600">
                                  +{url.tags.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-6 px-6 align-top">
                      <div className="flex items-start gap-3">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-3 py-2 flex-1 min-w-0">
                          <code className="text-sm font-mono text-blue-700 break-all block">
                            {url.customAlias || url.shortId}
                          </code>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(getShortUrl(url))}
                          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors flex-shrink-0"
                          title="Copy to clipboard"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="py-6 px-6 align-top">
                      <div className="flex items-center justify-center gap-2">
                        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full px-3 py-1 border border-blue-200">
                          <span className="text-sm font-semibold text-blue-700">
                            {url.clickCount}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onShowAnalytics(url.id)}
                          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title="View analytics"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="py-6 px-6 align-top">
                      <div className="text-sm text-gray-600">
                        {format(new Date(url.createdAt), "MMM dd, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell className="py-6 px-6 align-top">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(url)}
                          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors relative"
                          title="Edit URL"
                        >
                          <Edit className="h-4 w-4" />
                          {user?.isPremium && (
                            <Crown className="h-3 w-3 text-blue-600 absolute -top-1 -right-1" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShowQr(url)}
                          className="h-8 w-8 p-0 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          title="Show QR Code"
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(url.id)}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete URL"
                          disabled={deleteUrlMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <EditUrlModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        url={selectedUrl}
      />

      {/* QR Code Modal */}
      <Dialog open={showQrModal} onOpenChange={setShowQrModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>QR Code for Short URL</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <QRCodeCanvas
              id="qr-code-canvas"
              value={qrUrl}
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
                onClick={() => setShowQrModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
