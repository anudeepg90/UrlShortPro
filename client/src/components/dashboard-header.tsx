import { useAuth } from "@/hooks/use-auth";
import { Link, LogOut } from "lucide-react";

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
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm text-gray-600">{user?.email}</span>
              {user?.isPremium && (
                <span className="bg-accent text-white text-xs px-2 py-1 rounded-full font-medium">
                  PREMIUM
                </span>
              )}
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 transition-colors"
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
