import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  twitterImage?: string;
  noIndex?: boolean;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = "TinyYOUrl - Free URL Shortener with QR Codes & Analytics",
  description = "Create short, memorable links for free. Track clicks, generate QR codes, and manage your URLs with our powerful platform. Perfect for social media, marketing, and business use.",
  keywords = "URL shortener, link shortener, QR code generator, link analytics, social media links, marketing tools, business links, tinyyourl",
  canonical,
  ogImage = "https://tinyyourl.com/og-image.png",
  twitterImage = "https://tinyyourl.com/twitter-image.png",
  noIndex = false
}) => {
  const [location] = useLocation();
  const currentUrl = `https://tinyyourl.com${location}`;
  const canonicalUrl = canonical || currentUrl;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updatePropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Update basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Update Open Graph tags
    updatePropertyTag('og:title', title);
    updatePropertyTag('og:description', description);
    updatePropertyTag('og:url', canonicalUrl);
    updatePropertyTag('og:image', ogImage);
    updatePropertyTag('og:type', 'website');
    updatePropertyTag('og:site_name', 'TinyYOUrl');

    // Update Twitter Card tags
    updatePropertyTag('twitter:card', 'summary_large_image');
    updatePropertyTag('twitter:title', title);
    updatePropertyTag('twitter:description', description);
    updatePropertyTag('twitter:image', twitterImage);

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

  }, [title, description, keywords, canonicalUrl, ogImage, twitterImage, noIndex]);

  return null; // This component doesn't render anything
};

// Predefined SEO configurations for different pages
export const seoConfigs = {
  home: {
    title: "TinyYOUrl - Free URL Shortener with QR Codes & Analytics",
    description: "Create short, memorable links for free. Track clicks, generate QR codes, and manage your URLs with our powerful platform. Perfect for social media, marketing, and business use.",
    keywords: "URL shortener, link shortener, QR code generator, link analytics, social media links, marketing tools, business links, tinyyourl"
  },
  features: {
    title: "Features - TinyYOUrl URL Shortener",
    description: "Discover powerful features including bulk URL shortening, advanced analytics, QR code generation, custom aliases, and more. Perfect for businesses and power users.",
    keywords: "URL shortener features, bulk URL shortening, link analytics, QR codes, custom aliases, business tools"
  },
  howItWorks: {
    title: "How It Works - TinyYOUrl URL Shortener",
    description: "Learn how to use TinyYOUrl to create short links, generate QR codes, and track your link performance. Simple step-by-step guide.",
    keywords: "how to shorten URLs, QR code generation, link tracking, URL shortener tutorial"
  },
  about: {
    title: "About Us - TinyYOUrl URL Shortener",
    description: "Learn about TinyYOUrl, our mission to provide the best URL shortening service with advanced analytics and QR code generation.",
    keywords: "about TinyYOUrl, URL shortener company, link management platform"
  },
  contact: {
    title: "Contact Us - TinyYOUrl URL Shortener",
    description: "Get in touch with the TinyYOUrl team. We're here to help with your URL shortening needs and provide support.",
    keywords: "contact TinyYOUrl, URL shortener support, customer service"
  },
  faq: {
    title: "FAQ - TinyYOUrl URL Shortener",
    description: "Frequently asked questions about TinyYOUrl URL shortener. Find answers about features, pricing, and how to use our platform.",
    keywords: "TinyYOUrl FAQ, URL shortener questions, link shortening help"
  },
  terms: {
    title: "Terms of Service - TinyYOUrl",
    description: "Terms of Service for TinyYOUrl URL shortener. Read our terms and conditions for using our platform.",
    keywords: "TinyYOUrl terms, URL shortener terms of service, legal"
  },
  privacy: {
    title: "Privacy Policy - TinyYOUrl",
    description: "Privacy Policy for TinyYOUrl URL shortener. Learn how we protect your data and privacy.",
    keywords: "TinyYOUrl privacy, URL shortener privacy policy, data protection"
  },
  auth: {
    title: "Sign In - TinyYOUrl URL Shortener",
    description: "Sign in to your TinyYOUrl account to manage your shortened URLs, view analytics, and access premium features.",
    keywords: "TinyYOUrl login, URL shortener account, sign in"
  },
  sitemap: {
    title: "Sitemap - TinyYOUrl",
    description: "Complete sitemap of TinyYOUrl URL shortener. Find all pages and resources on our platform.",
    keywords: "TinyYOUrl sitemap, URL shortener pages, site navigation"
  },
  dmca: {
    title: "DMCA & Report Abuse - TinyYOUrl",
    description: "Report copyright violations, abuse, or inappropriate content. TinyYOUrl's DMCA and abuse reporting page for URL shortener service.",
    keywords: "DMCA, copyright, abuse report, TinyYOUrl, URL shortener legal"
  }
}; 