import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import DashboardHeader from "@/components/dashboard-header";
import StatsCards from "@/components/stats-cards";
import UrlTable from "@/components/url-table";
import ShortenModal from "@/components/shorten-modal";
import BulkModal from "@/components/bulk-modal";
import AnalyticsModal from "@/components/analytics-modal";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Crown } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [showShortenModal, setShowShortenModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedUrlId, setSelectedUrlId] = useState<number | null>(null);

  const handleShowAnalytics = (urlId: number) => {
    setSelectedUrlId(urlId);
    setShowAnalyticsModal(true);
  };

  const handleBulkShorten = () => {
    if (!user?.isPremium) {
      // Show upgrade prompt for non-premium users
      alert("Bulk shortening is a premium feature. Please upgrade your account to access this feature.");
      return;
    }
    setShowBulkModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.username}!
              </h1>
              <p className="text-gray-600">
                Manage your shortened URLs and track their performance
              </p>
            </div>
            {user?.isPremium && (
              <div className="flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-lg">
                <Crown className="h-5 w-5" />
                <span className="font-medium">PREMIUM</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards />
        </div>

        {/* Action Buttons */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => setShowShortenModal(true)}
                className="bg-primary hover:bg-blue-600 text-white flex items-center space-x-2"
                size="lg"
              >
                <Plus className="h-5 w-5" />
                <span>Shorten URL</span>
              </Button>
              
              <Button 
                onClick={handleBulkShorten}
                variant={user?.isPremium ? "default" : "outline"}
                className={`flex items-center space-x-2 ${
                  user?.isPremium 
                    ? "bg-accent hover:bg-amber-600 text-white" 
                    : "border-accent text-accent hover:bg-accent hover:text-white"
                }`}
                size="lg"
              >
                <Upload className="h-5 w-5" />
                <span>Bulk Shorten</span>
                {!user?.isPremium && (
                  <span className="bg-accent text-white text-xs px-1.5 py-0.5 rounded ml-2">
                    PRO
                  </span>
                )}
              </Button>
            </div>
            
            {!user?.isPremium && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Upgrade to Premium</strong> to unlock bulk operations, custom aliases, advanced analytics, and more!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* URL Management */}
        <UrlTable onShowAnalytics={handleShowAnalytics} />
      </div>

      {/* Modals */}
      <ShortenModal 
        isOpen={showShortenModal} 
        onClose={() => setShowShortenModal(false)} 
      />
      
      <BulkModal 
        isOpen={showBulkModal} 
        onClose={() => setShowBulkModal(false)} 
      />
      
      <AnalyticsModal 
        isOpen={showAnalyticsModal} 
        onClose={() => setShowAnalyticsModal(false)}
        urlId={selectedUrlId}
      />
    </div>
  );
}