import React, { useEffect, useRef } from 'react';

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: string;
  className?: string;
  style?: React.CSSProperties;
  responsive?: boolean;
}

export const AdSenseAd: React.FC<AdSenseAdProps> = ({
  adSlot,
  adFormat = "auto",
  className = "",
  style = {},
  responsive = true
}) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure adsbygoogle array exists
    if (typeof window !== 'undefined') {
      window.adsbygoogle = window.adsbygoogle || [];
      
      // Wait for the container to be properly sized
      const timer = setTimeout(() => {
        if (adRef.current) {
          const container = adRef.current;
          const rect = container.getBoundingClientRect();
          
          // Only load ad if container has proper dimensions
          if (rect.width > 0 && rect.height > 0) {
            try {
              window.adsbygoogle.push({});
            } catch (error) {
              // Silently handle AdSense errors
              console.warn('AdSense loading error:', error);
            }
          }
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [adSlot]);

  return (
    <div 
      ref={adRef}
      className={`adsense-container ${className}`} 
      style={{
        minWidth: '320px',
        minHeight: '100px',
        ...style
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ 
          display: 'block',
          minWidth: '320px',
          minHeight: '100px'
        }}
        data-ad-client={adSlot.split('/')[0]}
        data-ad-slot={adSlot.split('/')[1]}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

export default AdSenseAd; 