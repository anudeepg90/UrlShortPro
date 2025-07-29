// Navigation utility for proper routing behavior

export const navigateWithScrollTop = (href: string) => {
  // Navigate to the new route
  window.location.href = href;
  
  // Scroll to top after a short delay to ensure the page has loaded
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
};

// Custom RouterLink component wrapper for consistent behavior
export const createRouterLinkWithScroll = (href: string, onClick?: () => void) => {
  return {
    href,
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      if (onClick) onClick();
      navigateWithScrollTop(href);
    }
  };
};

// Check if current route is active
export const isActiveRoute = (currentPath: string, routePath: string): boolean => {
  if (routePath === '/') {
    return currentPath === '/';
  }
  return currentPath.startsWith(routePath);
}; 