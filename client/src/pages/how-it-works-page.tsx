import React from 'react';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Copy, ExternalLink, QrCode, BarChart3, CheckCircle, Link, MousePointer, Globe, Smartphone } from 'lucide-react';
import { Link as RouterLink } from 'wouter';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <RouterLink href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <Logo size="sm" />
              </div>
            </RouterLink>
            <RouterLink href="/">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
            </RouterLink>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn how to use TinyYOUrl in just a few simple steps. 
            It's so easy, you'll be shortening URLs in seconds!
          </p>
        </div>

        {/* Step-by-Step Guide */}
        <div className="space-y-16 mb-20">
          {/* Step 1 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-blue-600">1</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Paste Your Long URL</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Start by copying your long URL from anywhere - social media, email, or any website. 
                  Then paste it into our URL shortening form on the homepage.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Copy any long URL</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Paste it in our form</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">No registration required</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <MousePointer className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">URL Input Form</h3>
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="text-sm text-gray-500 mb-2">Paste your long URL here:</div>
                    <div className="bg-gray-100 rounded px-3 py-2 text-sm text-gray-600">
                      https://example.com/very-long-url-that-needs-shortening
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <Link className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Shorten Button</h3>
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-4 text-white">
                      <div className="flex items-center justify-center">
                        <Link className="h-5 w-5 mr-2" />
                        <span>Shorten URL</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-green-600">2</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Click Shorten</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Simply click the "Shorten URL" button and watch the magic happen! 
                  Our system will instantly generate a short, memorable link for you.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">One-click shortening</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Instant processing</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Secure and reliable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-purple-600">3</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Get Your Short URL</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Your short URL is ready! Copy it, share it, or use our built-in tools to test it 
                  and generate a QR code for easy sharing.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Copy with one click</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Test the link instantly</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Generate QR codes</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <Globe className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Short URL Result</h3>
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="text-sm text-gray-500 mb-2">Your shortened URL:</div>
                    <div className="bg-blue-50 rounded px-3 py-2 text-sm text-blue-600 font-mono mb-3">
                      tinyyourl.com/ABC123
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-gray-100 rounded px-3 py-1 text-xs flex items-center justify-center">
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </button>
                      <button className="flex-1 bg-gray-100 rounded px-3 py-1 text-xs flex items-center justify-center">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Test
                      </button>
                      <button className="flex-1 bg-gray-100 rounded px-3 py-1 text-xs flex items-center justify-center">
                        <QrCode className="h-3 w-3 mr-1" />
                        QR
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <Smartphone className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Share Everywhere</h3>
                    <div className="space-y-2">
                      <div className="bg-white rounded px-3 py-2 text-sm border">
                        📱 Social Media
                      </div>
                      <div className="bg-white rounded px-3 py-2 text-sm border">
                        📧 Email
                      </div>
                      <div className="bg-white rounded px-3 py-2 text-sm border">
                        💬 Messaging Apps
                      </div>
                      <div className="bg-white rounded px-3 py-2 text-sm border">
                        🖨️ Print Materials
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-orange-600">4</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Share & Track</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Share your short URL anywhere - social media, email, messaging apps, or print materials. 
                  If you're registered, you can also track clicks and analyze performance.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Works on all platforms</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Track clicks (registered users)</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Analyze performance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Additional Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Create an account to access detailed analytics, track clicks, and understand your audience.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <QrCode className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">QR Code Generation</h3>
              <p className="text-gray-600">
                Generate QR codes for your shortened URLs. Perfect for business cards, posters, and print materials.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Link className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Custom Aliases</h3>
              <p className="text-gray-600">
                Create custom, branded short URLs that are easy to remember and share.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Now that you know how it works, try it yourself! It only takes a few seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <RouterLink href="/">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3">
                Start Shortening URLs
              </Button>
            </RouterLink>
            <RouterLink href="/features">
              <Button variant="outline" size="lg" className="px-8 py-3">
                View All Features
              </Button>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  );
} 