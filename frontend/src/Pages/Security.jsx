// src/pages/Security.jsx
import React from 'react';
import { Shield, Lock, Eye, Key, Server, CheckCircle } from 'lucide-react';
import Navbar from '../Components/Layout/Navbar';
import Footer from '../Components/Layout/Footer';

const Security = () => {
  const securityFeatures = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All your financial data is encrypted both in transit and at rest using AES-256 encryption.',
      features: ['SSL/TLS encryption', 'Database encryption', 'Secure key management']
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'We adhere to the same security standards trusted by financial institutions worldwide.',
      features: ['SOC 2 compliance', 'Regular security audits', 'Penetration testing']
    },
    {
      icon: Key,
      title: 'Secure Authentication',
      description: 'Multi-layered authentication system to protect your account from unauthorized access.',
      features: ['JWT tokens', 'Secure session management', 'Password hashing']
    },
    {
      icon: Eye,
      title: 'Privacy First',
      description: 'Your data belongs to you. We never sell your information to third parties.',
      features: ['Data anonymization', 'Privacy by design', 'GDPR compliance']
    },
    {
      icon: Server,
      title: 'Infrastructure Security',
      description: 'Our infrastructure is built on secure, compliant cloud platforms with 24/7 monitoring.',
      features: ['DDoS protection', 'Web application firewall', 'Real-time monitoring']
    },
    {
      icon: CheckCircle,
      title: 'Compliance & Certifications',
      description: 'We maintain the highest standards of security compliance and certifications.',
      features: ['ISO 27001 certified', 'Regular compliance audits', 'Security certifications']
    }
  ];

  const securityPractices = [
    {
      title: 'Data Encryption',
      description: 'All sensitive data is encrypted using industry-standard algorithms before storage.'
    },
    {
      title: 'Access Controls',
      description: 'Role-based access controls ensure only authorized personnel can access specific data.'
    },
    {
      title: 'Regular Backups',
      description: 'Automated daily backups with multiple redundancy layers protect against data loss.'
    },
    {
      title: 'Security Monitoring',
      description: '24/7 security monitoring and alerting for suspicious activities and potential threats.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-orange-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Security & Trust
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your financial data's security is our top priority. We employ enterprise-grade security measures to protect your information.
            </p>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Security
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple layers of security protect your financial information at every step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Security Practices
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Continuous security practices that keep your data protected around the clock.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {securityPractices.map((practice, index) => (
              <div key={index} className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{practice.title}</h3>
                <p className="text-gray-600">{practice.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 rounded-2xl p-8 text-center">
            <Shield className="h-16 w-16 text-red-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join over 10,000 users who trust us with their financial data every day.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 mb-2">99.9%</div>
                <div className="text-gray-600">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 mb-2">0</div>
                <div className="text-gray-600">Security Breaches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 mb-2">24/7</div>
                <div className="text-gray-600">Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started Securely?
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust us with their financial data. Your security is our commitment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-red-600 px-8 py-4 rounded-lg hover:bg-red-50 transition-colors font-semibold text-lg">
              Start Free Today
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-red-600 transition-colors font-semibold text-lg">
              Security Whitepaper
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Security;