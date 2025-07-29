import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MousePointer, 
  Calendar, 
  Globe, 
  Smartphone, 
  Tablet, 
  Monitor,
  ExternalLink,
  Copy,
  Check,
  X,
  MapPin
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { appConfig } from "@/lib/config";

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  urlId: number | null;
}

interface AnalyticsData {
  url: {
    id: number;
    shortId: string;
    customAlias?: string;
    longUrl: string;
    title?: string;
    clickCount: number;
    createdAt: string;
  };
  totalClicks: number;
  uniqueVisitors: number;
  clickThroughRate: number;
  recentClicks: Array<{
    id: number;
    ip: string;
    userAgent: string;
    referrer: string;
    createdAt: string;
  }>;
  clicksByDay: Array<{
    date: string;
    clicks: number;
  }>;
  topReferrers: Array<{
    referrer: string;
    clicks: number;
  }>;
  deviceBreakdown: Array<{
    device: string;
    clicks: number;
  }>;
}

export default function AnalyticsModal({ isOpen, onClose, urlId }: AnalyticsModalProps) {
  const { user } = useAuth();

  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['urlAnalytics', urlId],
    queryFn: async (): Promise<AnalyticsData> => {
      if (!urlId) throw new Error('No URL ID provided');
      const response = await apiRequest("GET", `/api/url/${urlId}/analytics`);
      return response.json();
    },
    enabled: isOpen && !!urlId,
  });

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'tablet':
        return <Tablet className="h-4 w-4" />;
      case 'desktop':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getReferrerDisplay = (referrer: string) => {
    if (referrer === 'Direct' || !referrer) return 'Direct';
    try {
      const url = new URL(referrer);
      return url.hostname.replace('www.', '');
    } catch {
      return referrer;
    }
  };

  const getShortUrl = () => {
    if (!analytics?.url) return '';
    return `https://${appConfig.shortUrlDomain}/${analytics.url.customAlias || analytics.url.shortId}`;
  };

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Link Analytics</DialogTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Analytics</h3>
            <p className="text-gray-600">Failed to load analytics data. Please try again.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <span>Link Analytics</span>
                {user?.isPremium && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">PREMIUM</Badge>
                )}
              </DialogTitle>
              {analytics && (
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-sm text-gray-600">
                    {analytics.url.title || "Shortened Link"}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(getShortUrl())}
                    className="h-6 px-2 text-xs"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="h-12 w-12 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
            </div>
          </div>
        ) : analytics ? (
          <div className="space-y-6">
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <MousePointer className="h-4 w-4 text-blue-600" />
                  <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalClicks}</p>
                <p className="text-xs text-blue-600 mt-1">All time clicks</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{analytics.uniqueVisitors}</p>
                <p className="text-xs text-green-600 mt-1">Based on IP addresses</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <p className="text-sm font-medium text-gray-600">Click-through Rate</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{analytics.clickThroughRate}%</p>
                <p className="text-xs text-purple-600 mt-1">Engagement rate</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Clicks by Day Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Clicks by Day (Last 30 Days)
                </h4>
                {analytics.clicksByDay.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.clicksByDay.slice(-7).map((day) => (
                      <div key={day.date} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${Math.min((day.clicks / Math.max(...analytics.clicksByDay.map(d => d.clicks))) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8 text-right">{day.clicks}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No click data available</p>
                  </div>
                )}
              </div>

              {/* Device Breakdown */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-600" />
                  Device Breakdown
                </h4>
                {analytics.deviceBreakdown.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.deviceBreakdown.map((device) => (
                      <div key={device.device} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(device.device)}
                          <span className="text-sm text-gray-700">{device.device}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${(device.clicks / analytics.totalClicks) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8 text-right">{device.clicks}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Globe className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No device data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Top Referrers */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-purple-600" />
                Top Referrers
              </h4>
              {analytics.topReferrers.length > 0 ? (
                <div className="space-y-3">
                  {analytics.topReferrers.map((referrer) => (
                    <div key={referrer.referrer} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{getReferrerDisplay(referrer.referrer)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${(referrer.clicks / analytics.totalClicks) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8 text-right">{referrer.clicks}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ExternalLink className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No referrer data available</p>
                </div>
              )}
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-600" />
                  Recent Activity
                </h4>
              </div>
              
              <div className="divide-y divide-gray-200">
                {analytics.recentClicks.length > 0 ? (
                  analytics.recentClicks.map((click) => (
                    <div key={click.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Click from {getReferrerDisplay(click.referrer)}
                          </p>
                          <p className="text-xs text-gray-500">
                            IP: {click.ip} • {formatDate(click.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {click.userAgent.includes('Mobile') ? 'Mobile' : 
                             click.userAgent.includes('Tablet') ? 'Tablet' : 'Desktop'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {click.userAgent.split(' ')[0] || 'Unknown Browser'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
