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
  Search
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

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

  const { data: urls, isLoading } = useQuery<Url[]>({
    queryKey: ["/api/urls", { page, search: searchQuery }],
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

  const filteredUrls = urls?.filter(url => 
    url.longUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
    url.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    url.customAlias?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search URLs, aliases, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* URLs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Links</h3>
        </div>
        
        {filteredUrls.length === 0 ? (
          <div className="p-8 text-center">
            <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No URLs found</h3>
            <p className="text-gray-600">
              {searchQuery ? "No URLs match your search criteria." : "Create your first shortened URL to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>Short Link</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUrls.map((url) => (
                  <TableRow key={url.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Globe className="text-gray-500 h-4 w-4" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {url.title || "Shortened Link"}
                          </p>
                          <p className="text-sm text-gray-500 truncate">{url.longUrl}</p>
                          {url.tags && url.tags.length > 0 && (
                            <div className="flex items-center space-x-1 mt-1">
                              {url.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm text-primary font-mono">
                          {url.customAlias || url.shortId}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(getShortUrl(url))}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {url.clickCount}
                        </span>
                        {user?.isPremium && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onShowAnalytics(url.id)}
                            className="h-6 w-6 p-0"
                          >
                            <BarChart3 className="h-3 w-3 text-primary" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {format(new Date(url.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {user?.isPremium && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            title="Edit Alias"
                          >
                            <Edit className="h-3 w-3 text-primary" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(url.id)}
                          className="h-6 w-6 p-0"
                          title="Delete"
                          disabled={deleteUrlMutation.isPending}
                        >
                          <Trash2 className="h-3 w-3 text-red-600" />
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
    </div>
  );
}
