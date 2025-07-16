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
    setShowBulkModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Welcome back, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{user?.username}</span>!
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage your shortened URLs and track their performance
              </p>
            </div>
            {user?.isPremium && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 sm:px-4 py-2 rounded-lg flex-shrink-0 shadow-md">
                <Crown className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-medium text-sm sm:text-base">PREMIUM</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 sm:mb-8">
          <StatsCards />
        </div>

        {/* Action Buttons */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                onClick={() => setShowShortenModal(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center justify-center gap-2 w-full sm:w-auto shadow-md transition-all duration-200"
                size="lg"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Shorten URL</span>
              </Button>
              
              <Button 
                onClick={handleBulkShorten}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center justify-center gap-2 w-full sm:w-auto shadow-md transition-all duration-200"
                size="lg"
              >
                <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Bulk Shorten</span>
                {user?.isPremium && (
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded">
                    PREMIUM
                  </span>
                )}
              </Button>
            </div>
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