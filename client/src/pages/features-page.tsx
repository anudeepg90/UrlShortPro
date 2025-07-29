import React from 'react';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap, BarChart3, Shield, Users, Globe, QrCode, Link, Star, Crown, Clock, CheckCircle } from 'lucide-react';
import { Link as RouterLink } from 'wouter';

export default function FeaturesPage() {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for Every Need
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From simple URL shortening to advanced analytics, TinyYOUrl provides everything you need 
            to manage and track your links effectively.
          </p>
        </div>

        {/* Core Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant URL Shortening</h3>
              <p className="text-gray-600 mb-4">
                Create short, memorable URLs instantly. No registration required for basic use.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Lightning fast processing
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  No account needed
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Works on all devices
                </li>
              </ul>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Advanced Analytics</h3>
              <p className="text-gray-600 mb-4">
                Track clicks, analyze performance, and understand your audience with detailed insights.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Click tracking
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Geographic data
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Device breakdown
                </li>
              </ul>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Reliable</h3>
              <p className="text-gray-600 mb-4">
                Enterprise-grade security with 99.9% uptime guarantee for your peace of mind.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  SSL encryption
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Malware protection
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  High availability
                </li>
              </ul>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <QrCode className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">QR Code Generation</h3>
              <p className="text-gray-600 mb-4">
                Generate QR codes for your shortened URLs instantly. Perfect for print and digital media.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  High-quality QR codes
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Downloadable formats
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Customizable sizes
                </li>
              </ul>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">User Management</h3>
              <p className="text-gray-600 mb-4">
                Create accounts to manage your links, access analytics, and organize your URLs.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Link organization
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Custom aliases
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Bulk operations
                </li>
              </ul>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Global CDN</h3>
              <p className="text-gray-600 mb-4">
                Fast loading times worldwide with our distributed content delivery network.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Global reach
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Low latency
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  High performance
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Premium Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Premium Features</h2>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Unlock Premium Features</h3>
              <p className="text-lg opacity-90">
                Get access to advanced features designed for power users and businesses.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-lg p-6">
                <h4 className="font-semibold mb-3">Bulk URL Shortening</h4>
                <p className="text-sm opacity-90">
                  Shorten multiple URLs at once with our bulk processing feature.
                </p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-6">
                <h4 className="font-semibold mb-3">Custom Domains</h4>
                <p className="text-sm opacity-90">
                  Use your own domain for shortened URLs to build brand recognition.
                </p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-6">
                <h4 className="font-semibold mb-3">Advanced Analytics</h4>
                <p className="text-sm opacity-90">
                  Detailed reports, export capabilities, and real-time tracking.
                </p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-6">
                <h4 className="font-semibold mb-3">API Access</h4>
                <p className="text-sm opacity-90">
                  Integrate URL shortening into your applications with our REST API.
                </p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-6">
                <h4 className="font-semibold mb-3">Priority Support</h4>
                <p className="text-sm opacity-90">
                  Get faster response times and dedicated support for your needs.
                </p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-6">
                <h4 className="font-semibold mb-3">Team Management</h4>
                <p className="text-sm opacity-90">
                  Manage multiple users and collaborate on link campaigns.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Plan Comparison</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Free</h3>
                <p className="text-3xl font-bold text-gray-900">$0</p>
                <p className="text-gray-600">Forever</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Unlimited URL shortening
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Basic analytics
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  QR code generation
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Link management
                </li>
              </ul>
              <RouterLink href="/">
                <Button variant="outline" className="w-full">
                  Get Started Free
                </Button>
              </RouterLink>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <p className="text-3xl font-bold">$9</p>
                <p className="opacity-90">per month</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-white mr-2" />
                  Everything in Free
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-white mr-2" />
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-white mr-2" />
                  Custom aliases
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-white mr-2" />
                  Bulk URL shortening
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-white mr-2" />
                  API access
                </li>
              </ul>
              <Button variant="secondary" className="w-full">
                Upgrade to Pro
              </Button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-3xl font-bold text-gray-900">Custom</p>
                <p className="text-gray-600">Contact us</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Everything in Pro
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Custom domains
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Team management
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Priority support
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  SLA guarantee
                </li>
              </ul>
              <RouterLink href="/contact">
                <Button variant="outline" className="w-full">
                  Contact Sales
                </Button>
              </RouterLink>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of users who trust TinyYOUrl for their link shortening needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <RouterLink href="/">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3">
                Start Shortening URLs
              </Button>
            </RouterLink>
            <RouterLink href="/contact">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Contact Us
              </Button>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  );
} 