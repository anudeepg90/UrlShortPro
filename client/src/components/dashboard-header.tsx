import { useAuth } from "@/hooks/use-auth";
import { LogOut, Crown } from "lucide-react";
import Logo from "./logo";

export default function DashboardHeader() {
  const { user, logout, isLogoutLoading } = useAuth();

  const handleLogout = () => logout();

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Logo size="md" />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <span className="hidden sm:block text-sm text-gray-600">{user?.email}</span>
              {user?.isPremium && (
                <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium shadow-md">
                  <Crown className="h-3 w-3" />
                  <span className="hidden sm:inline">PREMIUM</span>
                  <span className="sm:hidden">PRO</span>
                </div>
              )}
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
              disabled={isLogoutLoading}
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
