// src/pages/PrivacyPolicy.jsx
import React from 'react';
import { Shield, Lock, Eye, User } from 'lucide-react';
import Navbar from '../Components/Layout/Navbar';
import Footer from '../Components/Layout/Footer';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: User,
      title: 'Information We Collect',
      content: `We collect information you provide directly to us, such as when you create an account, update your profile, or contact us for support. This may include:
      
• Personal information (name, email address)
• Financial information (expenses, income data)
• Profile information (currency preferences, budget settings)
• Communication data (support requests, feedback)`
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: `We use the information we collect to:
      
• Provide, maintain, and improve our services
• Process transactions and send related information
• Send you technical notices and support messages
• Respond to your comments and questions
• Detect, investigate, and prevent fraudulent transactions
• Personalize your experience and provide content recommendations`
    },
    {
      icon: Shield,
      title: 'Data Security',
      content: `We implement appropriate technical and organizational security measures designed to protect your personal data. These include:
      
• Encryption of data in transit and at rest
• Regular security assessments and testing
• Access controls and authentication
• Secure data storage and backup procedures
• Employee training on data protection`
    },
    {
      icon: Lock,
      title: 'Your Rights',
      content: `You have certain rights regarding your personal information:
      
• Access and receive a copy of your personal data
• Correct inaccurate or incomplete information
• Delete or restrict processing of your data
• Object to processing of your personal data
• Data portability
• Withdraw consent at any time`
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Last updated: December 2024. We are committed to protecting your privacy and being transparent about how we handle your data.
            </p>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="mb-12">
              <p className="text-lg text-gray-600 mb-6">
                At Dhasu Wallet, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
              </p>
            </div>

            {/* Policy Sections */}
            <div className="space-y-12">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <div key={index} className="border-l-4 border-blue-500 pl-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                    </div>
                    <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                      {section.content}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional Legal Info */}
            <div className="mt-16 bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="space-y-2 text-gray-600">
                <p>Email: privacy@Dhasu Wallet.com</p>
                <p>Address: 123 Financial District, San Francisco, CA 94105</p>
                <p>Phone: +1 (555) 123-4567</p>
              </div>
            </div>

            <div className="mt-8 text-sm text-gray-500">
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;