// src/pages/Features.jsx
import React from 'react';
import { 
  PieChart, Users, Plane, Bell, Shield, Smartphone, 
  DollarSign, Target, Zap, Lock, BarChart3, Share2 
} from 'lucide-react';
// import Navbar from '../components/Layout/Navbar';
// import Footer from '../components/Layout/Footer';
import Navbar from '../Components/Layout/Navbar';
import Footer from '../Components/Layout/Footer';


const Features = () => {
  const features = [
    {
      icon: PieChart,
      title: 'Smart Expense Tracking',
      description: 'Automatically categorize expenses and get insights into your spending patterns with beautiful, interactive charts.',
      benefits: ['Auto-categorization', 'Spending insights', 'Visual reports']
    },
    {
      icon: Users,
      title: 'Group Expense Splitting',
      description: 'Split bills with friends, roommates, or colleagues effortlessly. No more awkward money conversations.',
      benefits: ['Equal splitting', 'Custom amounts', 'Automatic settlements']
    },
    {
      icon: Plane,
      title: 'Trip Budget Management',
      description: 'Plan trip budgets, track shared expenses, and settle up easily with travel companions.',
      benefits: ['Multi-currency support', 'Travel categories', 'Trip summaries']
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Get alerts for upcoming bills, budget limits, and settlement reminders to stay on top of your finances.',
      benefits: ['Budget alerts', 'Settlement reminders', 'Bill due dates']
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Your financial data is encrypted and secure. We never share your information with third parties.',
      benefits: ['256-bit encryption', 'Data privacy', 'Secure backups']
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Access your finances anywhere with our responsive design that works perfectly on all devices.',
      benefits: ['Responsive design', 'Mobile app ready', 'Offline support']
    },
    {
      icon: DollarSign,
      title: 'Income Tracking',
      description: 'Track all your income sources alongside expenses for complete financial visibility.',
      benefits: ['Multiple income sources', 'Net worth tracking', 'Savings goals']
    },
    {
      icon: Target,
      title: 'Budget Planning',
      description: 'Set monthly budgets and get real-time updates on your spending against your goals.',
      benefits: ['Custom budgets', 'Progress tracking', 'Goal setting']
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Deep dive into your financial data with advanced reports and trend analysis.',
      benefits: ['Trend analysis', 'Custom reports', 'Export capabilities']
    }
  ];

  const useCases = [
    {
      title: 'For Individuals',
      description: 'Perfect for personal finance management and tracking daily expenses.',
      features: ['Personal budgets', 'Bill tracking', 'Savings goals']
    },
    {
      title: 'For Roommates',
      description: 'Split rent, utilities, and shared expenses without the headache.',
      features: ['Recurring splits', 'Payment tracking', 'Expense history']
    },
    {
      title: 'For Travelers',
      description: 'Manage trip expenses and split costs with travel companions easily.',
      features: ['Multi-currency', 'Trip budgets', 'Settlement calculations']
    },
    {
      title: 'For Small Teams',
      description: 'Track team expenses and manage project budgets efficiently.',
      features: ['Team management', 'Project tracking', 'Approval workflows']
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Powerful Features for
              <span className="text-blue-600"> Smart Money Management</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Everything you need to take control of your finances, whether you're managing personal expenses, 
              splitting costs with friends, or tracking team budgets.
            </p>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Financial Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Designed to make expense tracking simple, social, and insightful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <Zap className="h-4 w-4 text-green-500 mr-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perfect For Everyone
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're managing personal finances or coordinating with others, we've got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{useCase.title}</h3>
                <p className="text-gray-600 mb-4">{useCase.description}</p>
                <div className="flex flex-wrap gap-2">
                  {useCase.features.map((feature, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Financial Life?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have saved time, money, and relationships with Dhasu Wallet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg">
              Start Free Today
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold text-lg">
              See Live Demo
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;