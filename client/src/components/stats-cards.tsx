import { useQuery } from "@tanstack/react-query";
import { Link, MousePointer, TrendingUp, Percent } from "lucide-react";
import { config } from "@/lib/config";

interface Stats {
  totalLinks: number;
  totalClicks: number;
  monthlyClicks: number;
}

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
    queryFn: async () => {
      const response = await fetch(`${config.apiBaseUrl}/api/stats`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6 animate-pulse">
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
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6 transform hover:scale-105 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-600">Total Links</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.totalLinks || 0}</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
            <Link className="text-white h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6 transform hover:scale-105 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-600">Total Clicks</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.totalClicks || 0}</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            <MousePointer className="text-white h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6 transform hover:scale-105 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-600">This Month</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.monthlyClicks || 0}</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <TrendingUp className="text-white h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6 transform hover:scale-105 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-600">Avg. CTR</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{ctr}%</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            <Percent className="text-white h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
