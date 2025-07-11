import { useState } from "react";
import DashboardHeader from "@/components/dashboard-header";
import StatsCards from "@/components/stats-cards";
import UrlTable from "@/components/url-table";
import ShortenModal from "@/components/shorten-modal";
import BulkModal from "@/components/bulk-modal";
import AnalyticsModal from "@/components/analytics-modal";

export default function HomePage() {
  const [showShortenModal, setShowShortenModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedUrlId, setSelectedUrlId] = useState<number | null>(null);

  const handleShowAnalytics = (urlId: number) => {
    setSelectedUrlId(urlId);
    setShowAnalyticsModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your shortened URLs and track performance</p>
        </div>

        <StatsCards />

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button 
            onClick={() => setShowShortenModal(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <span>+</span>
            <span>Shorten URL</span>
          </button>
          
          <button 
            onClick={() => setShowBulkModal(true)}
            className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-600 transition-colors flex items-center space-x-2"
          >
            <span>≡</span>
            <span>Bulk Shorten</span>
            <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded">PRO</span>
          </button>
        </div>

        <UrlTable onShowAnalytics={handleShowAnalytics} />
      </div>

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
