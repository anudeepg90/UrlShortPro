import React from 'react';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Shield, AlertTriangle } from 'lucide-react';
import { Link } from 'wouter';

export default function DMCAPage() {
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
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              DMCA & Report Abuse
            </h1>
            <p className="text-gray-600 text-lg">
              Report copyright violations, abuse, or inappropriate content
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Digital Millennium Copyright Act (DMCA)</h2>
              <p className="text-gray-700 mb-4">
                TinyYOUrl respects intellectual property rights and complies with the Digital Millennium Copyright Act (DMCA). 
                If you believe that content accessible through our service infringes your copyright, please submit a DMCA takedown notice.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">DMCA Takedown Notice Requirements</h3>
                <p className="text-gray-700 mb-4">Your notice must include:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Your contact information (name, address, phone, email)</li>
                  <li>Description of the copyrighted work being infringed</li>
                  <li>Description of where the infringing material is located on our service</li>
                  <li>Statement that you have a good faith belief the use is not authorized</li>
                  <li>Statement that the information is accurate and you are authorized to act</li>
                  <li>Your physical or electronic signature</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Report Abuse</h2>
              <p className="text-gray-700 mb-4">
                We take abuse reports seriously. If you encounter inappropriate content, spam, or violations of our terms of service, 
                please report it to us immediately.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Types of Abuse We Address</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Malicious or phishing links</li>
                  <li>Spam or misleading content</li>
                  <li>Violations of our Terms of Service</li>
                  <li>Inappropriate or offensive content</li>
                  <li>Copyright violations</li>
                  <li>Security threats or malware</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Report</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Mail className="h-6 w-6 text-blue-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Email Report</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Send detailed reports to our abuse team:
                  </p>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-sm font-mono text-gray-800">abuse@tinyyourl.com</p>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Contact Form</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Use our contact form for general abuse reports:
                  </p>
                  <Link href="/contact">
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      Report Abuse
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Response Time</h2>
              <p className="text-gray-700 mb-4">
                We aim to respond to all reports within 24-48 hours. For urgent security threats or copyright violations, 
                we may respond more quickly.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What Happens After You Report</h3>
                <ol className="list-decimal list-inside text-gray-700 space-y-2">
                  <li>We review your report within 24 hours</li>
                  <li>We investigate the reported content</li>
                  <li>We take appropriate action (removal, warning, etc.)</li>
                  <li>We notify you of the outcome</li>
                  <li>We may report serious violations to authorities</li>
                </ol>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Counter-Notification</h2>
              <p className="text-gray-700 mb-4">
                If you believe your content was removed in error, you may submit a counter-notification. 
                This must include your contact information and a statement under penalty of perjury that you have a good faith belief the material was removed by mistake.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Legal Information</h2>
              <p className="text-gray-700 mb-4">
                This page is for informational purposes only and does not constitute legal advice. 
                For legal matters, please consult with an attorney.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Information</h3>
                <p className="text-gray-700 mb-2">
                  <strong>DMCA Agent:</strong> abuse@tinyyourl.com
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>General Inquiries:</strong> support@tinyyourl.com
                </p>
                <p className="text-gray-700">
                  <strong>Response Time:</strong> 24-48 hours
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 