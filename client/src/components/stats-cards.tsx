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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Links</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.totalLinks || 0}</p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Link className="text-primary" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Clicks</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.totalClicks || 0}</p>
          </div>
          <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
            <MousePointer className="text-secondary" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">This Month</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.monthlyClicks || 0}</p>
          </div>
          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
            <TrendingUp className="text-accent" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg. CTR</p>
            <p className="text-2xl font-bold text-gray-900">{ctr}%</p>
          </div>
          <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
            <Percent className="text-success" />
          </div>
        </div>
      </div>
    </div>
  );
}
