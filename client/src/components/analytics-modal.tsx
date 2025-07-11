import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { X, TrendingUp, Users, MousePointer, BarChart3 } from "lucide-react";

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  urlId: number | null;
}

export default function AnalyticsModal({ isOpen, onClose, urlId }: AnalyticsModalProps) {
  const { user } = useAuth();

  // Show premium upgrade prompt for non-premium users
  if (!user?.isPremium) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>Upgrade to Premium</span>
              <Badge className="bg-accent text-white">PRO</Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="text-accent text-2xl" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Unlock Advanced Analytics</h4>
            <p className="text-gray-600 mb-6">
              Detailed analytics and insights are available for premium users only.
            </p>
            
            <div className="space-y-3 mb-6 text-left">
              <div className="flex items-center space-x-3">
                <span className="text-green-500">✓</span>
                <span className="text-sm text-gray-700">Click-through rates and trends</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500">✓</span>
                <span className="text-sm text-gray-700">Geographic and device analytics</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500">✓</span>
                <span className="text-sm text-gray-700">Referrer tracking and insights</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500">✓</span>
                <span className="text-sm text-gray-700">Historical data and reports</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Maybe Later
            </Button>
            <Button className="bg-accent hover:bg-amber-600">
              Upgrade Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Link Analytics</DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                Detailed performance metrics for your shortened URL
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <MousePointer className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
              <p className="text-xs text-green-600 mt-1">+12% from last week</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-secondary" />
                <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">892</p>
              <p className="text-xs text-green-600 mt-1">+8% from last week</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                <p className="text-sm font-medium text-gray-600">Click-through Rate</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">71.5%</p>
              <p className="text-xs text-green-600 mt-1">+3% from last week</p>
            </div>
          </div>
          
          {/* Chart Placeholder */}
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Click Analytics Chart</p>
            <p className="text-sm text-gray-500 mt-2">
              Interactive charts will be implemented with a charting library like Chart.js or Recharts
            </p>
          </div>
          
          {/* Recent Activity */}
          <div className="border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900">Recent Activity</h4>
            </div>
            
            <div className="divide-y divide-gray-200">
              {[
                {
                  type: "Social Media",
                  referrer: "twitter.com",
                  time: "2 minutes ago",
                  location: "San Francisco, CA",
                  device: "Chrome on Desktop"
                },
                {
                  type: "Direct Click",
                  referrer: "No referrer",
                  time: "15 minutes ago",
                  location: "New York, NY",
                  device: "Safari on Mobile"
                },
                {
                  type: "Email",
                  referrer: "gmail.com",
                  time: "1 hour ago",
                  location: "London, UK",
                  device: "Firefox on Desktop"
                }
              ].map((activity, index) => (
                <div key={index} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Click from {activity.type}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.referrer} referrer • {activity.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{activity.location}</p>
                    <p className="text-xs text-gray-500">{activity.device}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
