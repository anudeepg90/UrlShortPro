import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link as RouterLink } from "wouter";
import PublicShortenForm from "@/components/public-shorten-form";
import { Button } from "@/components/ui/button";
import { Link, BarChart3, Shield, Zap, Users, Crown, QrCode, Star, CheckCircle, ArrowRight, Sparkles, Globe, TrendingUp } from "lucide-react";
import { 
  adSenseConfig, 
  loadAdSenseScript, 
  pushAdToAdSense, 
  trackAdImpression, 
  trackAdClick,
  getAdBreakpoint,
  preloadAdSense,
  shouldShowAds 
} from "@/lib/adsense";

// TypeScript declarations for AdSense
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// AdSense Component with enhanced features
const AdSenseAd = ({ 
  adSlot, 
  adFormat = "auto", 
  className = "", 
  style = {},
  responsive = true,
  trackPerformance = true
}: {
  adSlot: string;
  adFormat?: string;
  className?: string;
  style?: React.CSSProperties;
  responsive?: boolean;
  trackPerformance?: boolean;
}) => {
  useEffect(() => {
    if (!adSenseConfig.enabled) return;

    // Load AdSense script
    loadAdSenseScript();
    
    // Push ad to AdSense
    pushAdToAdSense();
    
    // Track impression
    if (trackPerformance) {
      trackAdImpression(adSlot);
    }
  }, [adSlot, trackPerformance]);

  const handleAdClick = () => {
    if (trackPerformance) {
      trackAdClick(adSlot);
    }
  };

  if (!adSenseConfig.enabled) {
    return (
      <div className={`${className} bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm`} style={style}>
        <div className="text-center">
          <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-2">
            <BarChart3 className="h-4 w-4 text-gray-400" />
          </div>
          <p>Ad Space</p>
          <p className="text-xs">AdSense Disabled</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`adsense-container ${className}`} style={style} onClick={handleAdClick}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adSenseConfig.publisherId}
        data-ad-slot={adSlot.split('/')[1] || adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

export default function HomePage() {
  const { user } = useAuth();
  const [showSidebarAd, setShowSidebarAd] = useState(false);
  const [adBreakpoint, setAdBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Check if ads should be shown
  const showAds = shouldShowAds(user);

  // Preload AdSense script for better performance
  useEffect(() => {
    if (adSenseConfig.enabled && showAds) {
      preloadAdSense();
    }
  }, [showAds]);

  // Responsive ad management
  useEffect(() => {
    const handleResize = () => {
      const breakpoint = getAdBreakpoint();
      setAdBreakpoint(breakpoint);
      setShowSidebarAd(window.innerWidth >= 1200 && showAds);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showAds]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                <Link className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">LinkVault</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <span className="hidden sm:block text-sm text-gray-600">{user.email}</span>
                  {user.isPremium && (
                    <div className="flex items-center space-x-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium shadow-sm">
                      <Crown className="h-3 w-3" />
                      <span className="hidden sm:inline">PREMIUM</span>
                      <span className="sm:hidden">PRO</span>
                    </div>
                  )}
                  <RouterLink href="/dashboard">
                    <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200">Dashboard</Button>
                  </RouterLink>
                </div>
              ) : (
                <RouterLink href="/auth">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all duration-200">Sign In</Button>
                </RouterLink>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Header Banner Ad - Above the fold, high visibility */}
      {showAds && (
        <div className="w-full bg-white/90 backdrop-blur-sm border-b border-gray-200 py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AdSenseAd 
              adSlot={adSenseConfig.adSlots.headerBanner}
              adFormat="auto"
              className="w-full h-[90px] flex items-center justify-center bg-gray-50 rounded-lg"
              style={{ minHeight: '90px' }}
            />
          </div>
        </div>
      )}

      {/* Main Content with Sidebar Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Free QR Codes Included</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Shorten URLs, Share
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Anywhere</span>
              </h1>
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Create short, memorable links for free. Track clicks, generate QR codes, and manage your URLs with our powerful platform.
              </p>
            </div>

            {/* URL Shortener Form */}
            <div className="max-w-2xl mx-auto mb-20">
              <PublicShortenForm />
            </div>

            {/* Inline Ad - After form, before stats */}
            {showAds && (
              <div className="mb-16">
                <AdSenseAd 
                  adSlot={adSenseConfig.adSlots.inlineAfterForm}
                  adFormat="auto"
                  className="w-full h-[250px] flex items-center justify-center bg-gray-50 rounded-xl shadow-sm"
                  style={{ minHeight: '250px' }}
                />
              </div>
            )}

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 text-center transform hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Link className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">10M+</h3>
                <p className="text-gray-600 font-medium">Links Shortened</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 text-center transform hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <QrCode className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free QR</h3>
                <p className="text-gray-600 font-medium">Codes Generated</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 text-center transform hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">99.9%</h3>
                <p className="text-gray-600 font-medium">Uptime Guarantee</p>
              </div>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 text-center transform hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-md">
                  <Link className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Free URL Shortening</h3>
                <p className="text-gray-600 leading-relaxed">
                  Shorten any URL instantly and share it anywhere. No account required, no hidden fees.
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 text-center transform hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-md">
                  <QrCode className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">QR Code Generation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Generate QR codes for your shortened links instantly. Perfect for print materials and offline sharing.
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 text-center transform hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-md">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Track Performance</h3>
                <p className="text-gray-600 leading-relaxed">
                  See how your links perform with detailed analytics and insights. Know what works.
                </p>
              </div>
            </div>

            {/* Mid-content Ad */}
            {showAds && (
              <div className="mb-20">
                <AdSenseAd 
                  adSlot={adSenseConfig.adSlots.midContent}
                  adFormat="auto"
                  className="w-full h-[200px] flex items-center justify-center bg-gray-50 rounded-xl shadow-sm"
                  style={{ minHeight: '200px' }}
                />
              </div>
            )}

            {/* Testimonials Section */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Thousands</h2>
                <p className="text-gray-600 text-lg">See what our users are saying</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "LinkVault has transformed how we share links. The QR code feature is a game-changer for our marketing campaigns!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      SM
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Sarah Mitchell</p>
                      <p className="text-sm text-gray-600">Marketing Director</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "The analytics are incredible! I can see exactly how my links are performing. The bulk shortening feature saves me hours."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      DJ
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">David Johnson</p>
                      <p className="text-sm text-gray-600">Content Creator</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "Clean, fast, and reliable. The custom aliases feature is perfect for our brand. Highly recommend!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      AL
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Alex Lee</p>
                      <p className="text-sm text-gray-600">Startup Founder</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Features CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 shadow-2xl text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-700/20"></div>
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">
                    Unlock Premium Features
                  </h2>
                  <p className="text-blue-100 text-lg">
                    Get advanced tools for power users and businesses
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Zap className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white">Custom Aliases</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white">Advanced Analytics</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white">Bulk Operations</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white">Priority Support</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white">No Ads</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <QrCode className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white">QR Code Generation</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <RouterLink href="/auth">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg transition-all duration-200 group">
                      Get Premium Access
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Ads - Only on large screens */}
          {showSidebarAd && (
            <div className="w-80 space-y-6">
              {/* Sidebar Ad 1 */}
              <div className="sticky top-24">
                <AdSenseAd 
                  adSlot={adSenseConfig.adSlots.sidebar1}
                  adFormat="auto"
                  className="w-full h-[600px] flex items-center justify-center bg-gray-50 rounded-xl shadow-sm"
                  style={{ minHeight: '600px' }}
                />
              </div>
              
              {/* Sidebar Ad 2 */}
              <div className="sticky top-24 mt-6">
                <AdSenseAd 
                  adSlot={adSenseConfig.adSlots.sidebar2}
                  adFormat="auto"
                  className="w-full h-[300px] flex items-center justify-center bg-gray-50 rounded-xl shadow-sm"
                  style={{ minHeight: '300px' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Banner Ad */}
      {showAds && (
        <div className="w-full bg-white/90 backdrop-blur-sm border-t border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AdSenseAd 
              adSlot={adSenseConfig.adSlots.footerBanner}
              adFormat="auto"
              className="w-full h-[90px] flex items-center justify-center bg-gray-50 rounded-lg"
              style={{ minHeight: '90px' }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Link className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold">LinkVault</span>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The simple and powerful URL shortener for everyone. Create, track, and share your links with confidence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Free URL Shortening</li>
                <li>QR Code Generation</li>
                <li>Click Analytics</li>
                <li>Custom Aliases</li>
                <li>No Ads (Premium)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">For Business</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Bulk URL Shortening</li>
                <li>Advanced Analytics</li>
                <li>Priority Support</li>
                <li>API Access</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LinkVault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
