import React, { useEffect } from 'react';

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
  useEffect(() => {
    // Ensure adsbygoogle array exists
    if (typeof window !== 'undefined') {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    }
  }, [adSlot]);

  return (
    <div className={`adsense-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adSlot.split('/')[0]}
        data-ad-slot={adSlot.split('/')[1]}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

export default AdSenseAd; 