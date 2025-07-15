import { useQuery } from "@tanstack/react-query";
import { Link, MousePointer, TrendingUp, Percent } from "lucide-react";

interface Stats {
  totalLinks: number;
  totalClicks: number;
  monthlyClicks: number;
}

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20 mb-2"></div>
                <div className="h-6 sm:h-8 bg-gray-200 rounded w-12 sm:w-16"></div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const ctr = stats?.totalLinks && stats?.totalClicks 
    ? ((stats.totalClicks / stats.totalLinks) * 100).toFixed(1) 
    : "0.0";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-600">Total Links</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.totalLinks || 0}</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Link className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-600">Total Clicks</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.totalClicks || 0}</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
            <MousePointer className="text-secondary h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-600">This Month</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.monthlyClicks || 0}</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-lg flex items-center justify-center">
            <TrendingUp className="text-accent h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-600">Avg. CTR</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{ctr}%</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-success/10 rounded-lg flex items-center justify-center">
            <Percent className="text-success h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
