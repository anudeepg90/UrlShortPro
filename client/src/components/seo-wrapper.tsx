import { useLocation } from 'wouter';
import { SEOHead, seoConfigs } from './seo-head';

interface SEOWrapperProps {
  children: React.ReactNode;
}

export const SEOWrapper: React.FC<SEOWrapperProps> = ({ children }) => {
  const [location] = useLocation();

  const getSEOConfig = () => {
    switch (location) {
      case '/':
        return seoConfigs.home;
      case '/features':
        return seoConfigs.features;
      case '/how-it-works':
        return seoConfigs.howItWorks;
      case '/about':
        return seoConfigs.about;
      case '/contact':
        return seoConfigs.contact;
      case '/faq':
        return seoConfigs.faq;
      case '/terms':
        return seoConfigs.terms;
      case '/privacy':
        return seoConfigs.privacy;
      case '/auth':
        return seoConfigs.auth;
      case '/sitemap':
        return seoConfigs.sitemap;
      case '/dmca':
        return seoConfigs.dmca;
      case '/dashboard':
        return {
          ...seoConfigs.home,
          noIndex: true // Don't index dashboard
        };
      default:
        // For short URLs, use a generic config
        if (location.length > 1 && !location.includes('/')) {
          return {
            title: "Redirecting - TinyYOUrl",
            description: "Redirecting to your destination...",
            noIndex: true
          };
        }
        return seoConfigs.home;
    }
  };

  return (
    <>
      <SEOHead {...getSEOConfig()} />
      {children}
    </>
  );
}; 