import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { appConfig } from '@/lib/config';

export default function ShortUrlRedirect() {
  const [location] = useLocation();

  // Extract shortId from the URL path
  const shortId = location.slice(1); // Remove leading slash

  useEffect(() => {
    const redirectToUrl = async () => {
      if (!shortId) {
        // Invalid short URL - redirect to homepage
        window.location.href = '/';
        return;
      }

      // Skip if it's a known route or asset
      const knownRoutes = ['auth', 'dashboard', 'src', 'assets', 'favicon', 'manifest'];
      const isKnownRoute = knownRoutes.some(route => shortId.startsWith(route));
      const isAsset = shortId.includes('.') || shortId.startsWith('@');
      
      if (isKnownRoute || isAsset) {
        // Known route - redirect to homepage
        window.location.href = '/';
        return;
      }

      try {
        // Fetch the URL from the backend
        const response = await fetch(`${appConfig.apiBaseUrl}/api/url/${shortId}`);
        
        if (!response.ok) {
          // URL not found - redirect to homepage
          window.location.href = '/';
          return;
        }

        const urlData = await response.json();
        
        // Track the click in the background (don't wait for it)
        fetch(`${appConfig.apiBaseUrl}/api/url/${shortId}/click`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ip: '', // Will be detected by server
            userAgent: navigator.userAgent,
            referrer: document.referrer,
          }),
        }).catch(() => {
          // Ignore tracking errors - don't fail the redirect
        });

        // Redirect immediately to the long URL
        window.location.href = urlData.longUrl;
      } catch (err) {
        // Any error - redirect to homepage
        window.location.href = '/';
      }
    };

    redirectToUrl();
  }, [shortId]);

  // Return null to avoid rendering anything
  // This prevents any flash of content before redirect
  return null;
} 