import React, { useState } from 'react';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle, Link, QrCode, BarChart3, Shield, Users, Globe } from 'lucide-react';
import { Link as RouterLink } from 'wouter';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is TinyYOUrl?",
    answer: "TinyYOUrl is a free URL shortening service that helps you create short, memorable links from long URLs. It's perfect for sharing links on social media, in emails, or anywhere you need a shorter URL.",
    category: "General"
  },
  {
    question: "Is TinyYOUrl really free?",
    answer: "Yes! TinyYOUrl is completely free to use. You can shorten unlimited URLs without creating an account. However, creating a free account gives you access to additional features like analytics and custom aliases.",
    category: "General"
  },
  {
    question: "Do I need to create an account?",
    answer: "No, you don't need an account to shorten URLs. You can use our service immediately without any registration. However, creating an account gives you access to features like click tracking, custom aliases, and link management.",
    category: "Account"
  },
  {
    question: "How do I shorten a URL?",
    answer: "Simply paste your long URL into the input field on our homepage and click 'Shorten URL'. Your short link will be generated instantly and ready to share.",
    category: "Usage"
  },
  {
    question: "Are my shortened URLs permanent?",
    answer: "Yes, your shortened URLs are permanent and will continue to work as long as our service is active. We have a 99.9% uptime guarantee to ensure your links remain accessible.",
    category: "Usage"
  },
  {
    question: "Can I track clicks on my shortened URLs?",
    answer: "Yes! If you create a free account, you can track clicks, analyze performance, and see detailed analytics for all your shortened URLs.",
    category: "Analytics"
  },
  {
    question: "What analytics are available?",
    answer: "Our analytics include click counts, geographic data, device information, referrer tracking, and detailed performance insights to help you understand how your links are performing.",
    category: "Analytics"
  },
  {
    question: "Can I create custom short URLs?",
    answer: "Yes! With a free account, you can create custom aliases for your shortened URLs, making them more memorable and branded to your needs.",
    category: "Features"
  },
  {
    question: "Do you generate QR codes?",
    answer: "Yes! Every shortened URL comes with a free QR code that you can download and use for print materials, business cards, or any offline sharing needs.",
    category: "Features"
  },
  {
    question: "Is TinyYOUrl secure?",
    answer: "Absolutely! We use enterprise-grade security measures including SSL encryption, malware protection, and secure data handling to keep your links and data safe.",
    category: "Security"
  },
  {
    question: "What happens if I lose my short URL?",
    answer: "If you have an account, you can access all your shortened URLs in your dashboard. If you don't have an account, you'll need to shorten the URL again.",
    category: "Account"
  },
  {
    question: "Can I edit my shortened URLs?",
    answer: "Yes! If you have an account, you can edit the destination URL, custom alias, and other settings for your shortened links from your dashboard.",
    category: "Features"
  },
  {
    question: "Do you support bulk URL shortening?",
    answer: "Yes! Premium users can shorten multiple URLs at once using our bulk URL shortening feature, perfect for businesses and power users.",
    category: "Features"
  },
  {
    question: "What's the difference between free and premium?",
    answer: "Free accounts get basic analytics and custom aliases. Premium accounts get advanced analytics, bulk shortening, API access, priority support, and no ads.",
    category: "Pricing"
  },
  {
    question: "Can I use TinyYOUrl for business?",
    answer: "Absolutely! Many businesses use TinyYOUrl for marketing campaigns, social media, and internal link management. Our premium plans are specifically designed for business needs.",
    category: "Business"
  },
  {
    question: "Do you have an API?",
    answer: "Yes! Premium users get access to our REST API, allowing you to integrate URL shortening directly into your applications and workflows.",
    category: "Features"
  },
  {
    question: "What if my original URL changes?",
    answer: "If you have an account, you can update the destination URL for your shortened links from your dashboard. The short URL will remain the same but redirect to the new destination.",
    category: "Usage"
  },
  {
    question: "Are there any usage limits?",
    answer: "Free users can shorten unlimited URLs. Premium users get additional features and higher API rate limits for business use.",
    category: "Usage"
  },
  {
    question: "How do I contact support?",
    answer: "You can contact us through our Contact page, email us at support@tinyyourl.com, or use the contact form on our website. We typically respond within 24 hours.",
    category: "Support"
  },
  {
    question: "Can I delete my shortened URLs?",
    answer: "Yes! If you have an account, you can delete any of your shortened URLs from your dashboard. Deleted URLs will no longer work.",
    category: "Account"
  }
];

const categories = ["All", "General", "Account", "Usage", "Analytics", "Features", "Security", "Pricing", "Business", "Support"];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const filteredFAQs = selectedCategory === "All" 
    ? faqData 
    : faqData.filter(faq => faq.category === selectedCategory);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 sm:p-8 lg:p-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Find answers to the most common questions about TinyYOUrl. 
              Can't find what you're looking for? <RouterLink href="/contact" className="text-blue-600 hover:underline">Contact us</RouterLink>.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  {openItems.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {openItems.includes(index) && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Still Need Help?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <RouterLink href="/how-it-works">
                <div className="bg-blue-50 rounded-lg p-6 text-center hover:bg-blue-100 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Link className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">How It Works</h3>
                  <p className="text-sm text-gray-600">
                    Learn how to use TinyYOUrl step by step
                  </p>
                </div>
              </RouterLink>

              <RouterLink href="/contact">
                <div className="bg-green-50 rounded-lg p-6 text-center hover:bg-green-100 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
                  <p className="text-sm text-gray-600">
                    Get in touch with our support team
                  </p>
                </div>
              </RouterLink>

              <RouterLink href="/features">
                <div className="bg-purple-50 rounded-lg p-6 text-center hover:bg-purple-100 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">View Features</h3>
                  <p className="text-sm text-gray-600">
                    Explore all our features and plans
                  </p>
                </div>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 