import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link as RouterLink } from "wouter";
import PublicShortenForm from "@/components/public-shorten-form";
import { Button } from "@/components/ui/button";
import { Link, BarChart3, Shield, Zap, Users, Crown } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Link className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold text-gray-900">LinkVault</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <span className="hidden sm:block text-sm text-gray-600">{user.email}</span>
                  {user.isPremium && (
                    <div className="flex items-center space-x-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium shadow-sm">
                      <Crown className="h-3 w-3" />
                      <span className="hidden sm:inline">PREMIUM</span>
                      <span className="sm:hidden">PRO</span>
                    </div>
                  )}
                  <RouterLink href="/dashboard">
                    <Button variant="outline" size="sm">Dashboard</Button>
                  </RouterLink>
                </div>
              ) : (
                <RouterLink href="/auth">
                  <Button size="sm">Sign In</Button>
                </RouterLink>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Shorten URLs, Share Anywhere
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Create short, memorable links for free. Track clicks and manage your URLs with our powerful platform.
          </p>
        </div>

        {/* URL Shortener Form */}
        <div className="max-w-2xl mx-auto mb-20">
          <PublicShortenForm />
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Link className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Free URL Shortening</h3>
            <p className="text-gray-600">
              Shorten any URL instantly and share it anywhere. No account required.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
            <p className="text-gray-600">
              Your links are safe with us. Enterprise-grade security and 99.9% uptime.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Performance</h3>
            <p className="text-gray-600">
              See how your links perform with detailed analytics and insights.
            </p>
          </div>
        </div>

        {/* Premium Features CTA */}
        <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Unlock Premium Features
            </h2>
            <p className="text-gray-600 text-lg">
              Get advanced tools for power users and businesses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-gray-700">Custom Aliases</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-secondary" />
              </div>
              <span className="text-sm font-medium text-gray-700">Advanced Analytics</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-accent" />
              </div>
              <span className="text-sm font-medium text-gray-700">Bulk Operations</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-gray-700">Priority Support</span>
            </div>
          </div>
          
          <div className="text-center">
            <RouterLink href="/auth">
              <Button size="lg" className="bg-accent hover:bg-amber-600 text-white">
                Get Premium Access
              </Button>
            </RouterLink>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Link className="text-white text-sm" />
            </div>
            <span className="text-xl font-bold">LinkVault</span>
          </div>
          <p className="text-gray-400">
            The simple and powerful URL shortener for everyone.
          </p>
        </div>
      </footer>
    </div>
  );
}
