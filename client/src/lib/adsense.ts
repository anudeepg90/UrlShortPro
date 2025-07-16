// AdSense Configuration and Utilities

// TypeScript declarations for global objects
declare global {
  interface Window {
    adsbygoogle: any[];
    gtag: (...args: any[]) => void;
  }
}

export interface AdSenseConfig {
  publisherId: string;
  adSlots: {
    headerBanner: string;
    inlineAfterForm: string;
    midContent: string;
    sidebar1: string;
    sidebar2: string;
    footerBanner: string;
  };
  enabled: boolean;
  lazyLoading: boolean;
  performanceTracking: boolean;
  abTesting: boolean;
}

// Default configuration - replace with your actual AdSense details
export const adSenseConfig: AdSenseConfig = {
  publisherId: "ca-pub-YOUR_PUBLISHER_ID", // Replace with your actual publisher ID
  adSlots: {
    headerBanner: "1234567890", // Replace with your actual ad slot IDs
    inlineAfterForm: "1234567891",
    midContent: "1234567892",
    sidebar1: "1234567893",
    sidebar2: "1234567894",
    footerBanner: "1234567895",
  },
  enabled: true, // Set to false to disable ads during development
  lazyLoading: true, // Enable lazy loading for better performance
  performanceTracking: true, // Track ad performance metrics
  abTesting: false, // Enable A/B testing for ad placements
};

// Check if user is premium and should see ads
export const shouldShowAds = (user?: { isPremium?: boolean } | null): boolean => {
  // Don't show ads for premium users
  if (user?.isPremium) {
    return false;
  }
  
  // Don't show ads if AdSense is disabled
  if (!adSenseConfig.enabled) {
    return false;
  }
  
  return true;
};

// Performance metrics tracking
export interface AdPerformanceMetrics {
  impressions: number;
  clicks: number;
  revenue: number;
  ctr: number;
  rpm: number;
}

const performanceMetrics: Record<string, AdPerformanceMetrics> = {};

// AdSense utility functions
export const loadAdSenseScript = (): void => {
  if (typeof window === 'undefined') return;
  
  if (!window.adsbygoogle) {
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }
};

export const pushAdToAdSense = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (error) {
    console.log('AdSense error:', error);
  }
};

// Enhanced ad performance tracking
export const trackAdImpression = (adSlot: string): void => {
  if (typeof window === 'undefined') return;
  
  // Initialize metrics for this ad slot
  if (!performanceMetrics[adSlot]) {
    performanceMetrics[adSlot] = {
      impressions: 0,
      clicks: 0,
      revenue: 0,
      ctr: 0,
      rpm: 0,
    };
  }
  
  performanceMetrics[adSlot].impressions++;
  
  // Calculate CTR
  performanceMetrics[adSlot].ctr = 
    (performanceMetrics[adSlot].clicks / performanceMetrics[adSlot].impressions) * 100;
  
  // Send to analytics if available
  if (window.gtag) {
    window.gtag('event', 'ad_impression', {
      'ad_slot': adSlot,
      'value': performanceMetrics[adSlot].revenue
    });
  }
  
  console.log(`Ad impression: ${adSlot}`, performanceMetrics[adSlot]);
};

export const trackAdClick = (adSlot: string): void => {
  if (typeof window === 'undefined') return;
  
  if (!performanceMetrics[adSlot]) {
    performanceMetrics[adSlot] = {
      impressions: 0,
      clicks: 0,
      revenue: 0,
      ctr: 0,
      rpm: 0,
    };
  }
  
  performanceMetrics[adSlot].clicks++;
  
  // Calculate CTR
  performanceMetrics[adSlot].ctr = 
    (performanceMetrics[adSlot].clicks / performanceMetrics[adSlot].impressions) * 100;
  
  // Send to analytics if available
  if (window.gtag) {
    window.gtag('event', 'ad_click', {
      'ad_slot': adSlot,
      'value': performanceMetrics[adSlot].revenue
    });
  }
  
  console.log(`Ad click: ${adSlot}`, performanceMetrics[adSlot]);
};

// Get performance metrics
export const getAdPerformance = (adSlot?: string): Record<string, AdPerformanceMetrics> | AdPerformanceMetrics | null => {
  if (adSlot) {
    return performanceMetrics[adSlot] || null;
  }
  return performanceMetrics;
};

// Responsive ad breakpoints
export const getAdBreakpoint = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Ad loading optimization
export const preloadAdSense = (): void => {
  if (typeof window === 'undefined') return;
  
  // Preload AdSense script for better performance
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'script';
  link.href = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
  document.head.appendChild(link);
};

// Lazy loading for ads
export const lazyLoadAd = (adSlot: string, callback?: () => void): void => {
  if (!adSenseConfig.lazyLoading) {
    pushAdToAdSense();
    if (callback) callback();
    return;
  }

  // Use Intersection Observer for lazy loading
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          pushAdToAdSense();
          trackAdImpression(adSlot);
          if (callback) callback();
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px', // Load ads 50px before they come into view
      threshold: 0.1
    });

    // Find the ad container and observe it
    const adContainer = document.querySelector(`[data-ad-slot="${adSlot}"]`);
    if (adContainer) {
      observer.observe(adContainer);
    }
  } else {
    // Fallback for older browsers
    pushAdToAdSense();
    trackAdImpression(adSlot);
    if (callback) callback();
  }
};

// A/B testing for ad placements
export const getABTestVariant = (testName: string): 'A' | 'B' => {
  if (!adSenseConfig.abTesting) return 'A';
  
  // Simple A/B test based on user session
  const sessionKey = `ab_test_${testName}`;
  let variant = sessionStorage.getItem(sessionKey);
  
  if (!variant) {
    variant = Math.random() > 0.5 ? 'A' : 'B';
    sessionStorage.setItem(sessionKey, variant);
  }
  
  return variant as 'A' | 'B';
};

// Ad placement optimization
export const getOptimalAdPlacements = (): string[] => {
  const breakpoint = getAdBreakpoint();
  const variant = getABTestVariant('ad_placement');
  
  const placements = {
    mobile: ['headerBanner', 'inlineAfterForm', 'footerBanner'],
    tablet: ['headerBanner', 'inlineAfterForm', 'midContent', 'footerBanner'],
    desktop: {
      A: ['headerBanner', 'inlineAfterForm', 'sidebar1', 'sidebar2', 'footerBanner'],
      B: ['headerBanner', 'midContent', 'sidebar1', 'footerBanner']
    }
  };
  
  if (breakpoint === 'mobile') return placements.mobile;
  if (breakpoint === 'tablet') return placements.tablet;
  return placements.desktop[variant];
};

// Revenue estimation (rough estimates)
export const estimateAdRevenue = (impressions: number, ctr: number = 0.02, cpc: number = 0.5): number => {
  const clicks = impressions * ctr;
  return clicks * cpc;
};

// Performance monitoring
export const monitorAdPerformance = (): void => {
  if (!adSenseConfig.performanceTracking) return;
  
  setInterval(() => {
    const metrics = getAdPerformance();
    if (metrics && typeof metrics === 'object') {
      console.log('Ad Performance Summary:', metrics);
      
      // Send to analytics
      if (window.gtag) {
        Object.entries(metrics).forEach(([slot, data]) => {
          window.gtag('event', 'ad_performance', {
            'ad_slot': slot,
            'impressions': data.impressions,
            'clicks': data.clicks,
            'ctr': data.ctr,
            'revenue': data.revenue
          });
        });
      }
    }
  }, 60000); // Log every minute
};

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  monitorAdPerformance();
} 