// src/pages/TermsOfService.jsx
import React from 'react';
import { FileText, Scale, AlertTriangle, CheckCircle } from 'lucide-react';
import Navbar from '../Components/Layout/Navbar';
import Footer from '../Components/Layout/Footer';

const TermsOfService = () => {
  const sections = [
    {
      icon: CheckCircle,
      title: 'Acceptance of Terms',
      content: `By accessing and using ExpenseTracker, you accept and agree to be bound by the terms and provision of this agreement.`
    },
    {
      icon: Scale,
      title: 'User Responsibilities',
      content: `You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account.`
    },
    {
      icon: AlertTriangle,
      title: 'Prohibited Uses',
      content: `You may not use our service for any illegal or unauthorized purpose. You must not, in the use of the service, violate any laws in your jurisdiction.`
    },
    {
      icon: FileText,
      title: 'Termination',
      content: `We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.`
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <section className="bg-gradient-to-br from-gray-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Last updated: December 2024. Please read these terms carefully before using our service.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="space-y-12">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <div key={index}>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-purple-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{section.content}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsOfService;