import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'wouter';
import { X, Menu, Home, Zap, HelpCircle, Users, Mail, FileText, Shield, Info, Map } from 'lucide-react';
import Logo from './logo';
import { navigateWithScrollTop } from '@/lib/navigation';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  hasPage: boolean;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
    hasPage: true,
    description: 'URL shortening service'
  },
  {
    name: 'Features',
    href: '/features',
    icon: Zap,
    hasPage: true,
    description: 'All features and plans'
  },
  {
    name: 'How It Works',
    href: '/how-it-works',
    icon: HelpCircle,
    hasPage: true,
    description: 'Step-by-step guide'
  },
  {
    name: 'About Us',
    href: '/about',
    icon: Info,
    hasPage: true,
    description: 'Company information'
  },
  {
    name: 'Contact Us',
    href: '/contact',
    icon: Mail,
    hasPage: true,
    description: 'Support and inquiries'
  },
  {
    name: 'FAQ',
    href: '/faq',
    icon: HelpCircle,
    hasPage: true,
    description: 'Frequently asked questions'
  },
  {
    name: 'Terms & Conditions',
    href: '/terms',
    icon: FileText,
    hasPage: true,
    description: 'Service terms'
  },
  {
    name: 'Privacy Policy',
    href: '/privacy',
    icon: Shield,
    hasPage: true,
    description: 'Data protection'
  },
  {
    name: 'Sitemap',
    href: '/sitemap',
    icon: Map,
    hasPage: true,
    description: 'Site navigation'
  }
];

interface MobileNavProps {
  user?: any;
}

export default function MobileNav({ user }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && !target.closest('.mobile-nav')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, []);

  const handleNavigation = (href: string) => {
    setIsOpen(false);
    // Use proper navigation with scroll-to-top behavior
    navigateWithScrollTop(href);
  };

  return (
    <div className="mobile-nav">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors border border-gray-200 bg-white shadow-sm"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Side Panel */}
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-gray-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <Logo size="sm" />
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Close navigation menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto py-4 bg-white">
              <nav className="space-y-1 px-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <RouterLink 
                      key={item.name} 
                      href={item.href}
                      onClick={() => handleNavigation(item.href)}
                    >
                      <div className={`
                        flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer
                        ${item.hasPage 
                          ? 'text-gray-900 hover:text-blue-600 hover:bg-blue-50' 
                          : 'text-gray-400 cursor-not-allowed'
                        }
                      `}>
                        <div className={`
                          w-10 h-10 rounded-lg flex items-center justify-center
                          ${item.hasPage 
                            ? 'bg-gray-100 text-gray-700 group-hover:bg-blue-100 group-hover:text-blue-600' 
                            : 'bg-gray-50 text-gray-400'
                          }
                        `}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-sm text-gray-900">{item.name}</span>
                            {!item.hasPage && (
                              <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                                Coming Soon
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-700 mt-1">{item.description}</p>
                        </div>
                      </div>
                    </RouterLink>
                  );
                })}
              </nav>

              {/* User Section - Only show if user is logged in */}
              {user && (
                <div className="mt-8 px-4">
                  <div className="border-t border-gray-200 pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-50">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-900 truncate">{user.username}</p>
                          <p className="text-xs text-gray-600 truncate">{user.email}</p>
                        </div>
                      </div>
                      <RouterLink href="/dashboard" onClick={() => handleNavigation('/dashboard')}>
                        <div className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-900 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Zap className="h-5 w-5" />
                          </div>
                          <span className="font-semibold text-sm">Dashboard</span>
                        </div>
                      </RouterLink>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 