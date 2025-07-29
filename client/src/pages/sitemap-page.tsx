import React from 'react';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, FileText, Shield, Users, Settings, HelpCircle, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <Logo size="sm" />
              </div>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 sm:p-8 lg:p-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Sitemap
            </h1>
            <p className="text-gray-600 text-lg">
              Find everything you need on TinyYOUrl
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Main Pages */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Home className="h-6 w-6 mr-2 text-blue-600" />
                Main Pages
              </h2>
              <div className="space-y-4">
                <Link href="/">
                  <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Home className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Home</h3>
                      <p className="text-sm text-gray-600">URL shortening service homepage</p>
                    </div>
                  </div>
                </Link>

                <Link href="/features">
                  <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <Settings className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Features</h3>
                      <p className="text-sm text-gray-600">Explore all our features and plans</p>
                    </div>
                  </div>
                </Link>

                <Link href="/how-it-works">
                  <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <HelpCircle className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">How It Works</h3>
                      <p className="text-sm text-gray-600">Step-by-step guide to using our service</p>
                    </div>
                  </div>
                </Link>

                <Link href="/about">
                  <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <Users className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">About Us</h3>
                      <p className="text-sm text-gray-600">Learn about TinyYOUrl and our mission</p>
                    </div>
                  </div>
                </Link>

                <Link href="/contact">
                  <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                      <ExternalLink className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Contact Us</h3>
                      <p className="text-sm text-gray-600">Get in touch with our support team</p>
                    </div>
                  </div>
                </Link>

                <Link href="/faq">
                  <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                      <HelpCircle className="h-4 w-4 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">FAQ</h3>
                      <p className="text-sm text-gray-600">Frequently asked questions and answers</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Legal & Support */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-indigo-600" />
                Legal & Support
              </h2>
              <div className="space-y-4">
                <Link href="/terms">
                  <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                      <FileText className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Terms & Conditions</h3>
                      <p className="text-sm text-gray-600">Our terms of service and usage policies</p>
                    </div>
                  </div>
                </Link>

                <Link href="/privacy">
                  <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                      <Shield className="h-4 w-4 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Privacy Policy</h3>
                      <p className="text-sm text-gray-600">How we protect and handle your data</p>
                    </div>
                  </div>
                </Link>

                <div className="flex items-center p-3 rounded-lg bg-gray-50">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                    <Settings className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Dashboard</h3>
                    <p className="text-sm text-gray-600">User dashboard (requires login)</p>
                  </div>
                </div>

                <div className="flex items-center p-3 rounded-lg bg-gray-50">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                    <Users className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Authentication</h3>
                    <p className="text-sm text-gray-600">Login and registration pages</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">API Endpoints</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• POST /api/shorten - Create short URLs</li>
                  <li>• GET /api/urls - Get user's URLs</li>
                  <li>• GET /api/stats - Get user statistics</li>
                  <li>• GET /:shortId - Redirect to original URL</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• <Link href="/" className="text-blue-600 hover:underline">Start shortening URLs</Link></li>
                  <li>• <Link href="/features" className="text-blue-600 hover:underline">View all features</Link></li>
                  <li>• <Link href="/contact" className="text-blue-600 hover:underline">Get support</Link></li>
                  <li>• <Link href="/about" className="text-blue-600 hover:underline">Learn about us</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* XML Sitemap Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              For search engines and developers, you can also access our XML sitemap:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 inline-block">
              <code className="text-sm text-gray-700">
                https://tinyyourl.com/sitemap.xml
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 