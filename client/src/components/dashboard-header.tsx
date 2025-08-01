import { useAuth } from "@/hooks/use-auth";
import { Link, LogOut, Crown } from "lucide-react";

export default function DashboardHeader() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Link className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold text-gray-900">LinkVault</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <span className="hidden sm:block text-sm text-gray-600">{user?.email}</span>
              {user?.isPremium && (
                <div className="flex items-center space-x-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium shadow-sm">
                  <Crown className="h-3 w-3" />
                  <span className="hidden sm:inline">PREMIUM</span>
                  <span className="sm:hidden">PRO</span>
                </div>
              )}
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
