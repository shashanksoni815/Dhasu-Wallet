// src/pages/HowItWorks.jsx
import React from 'react';
import { UserPlus, TrendingUp, Users, CheckCircle, ArrowRight, Play } from 'lucide-react';
// import Navbar from '../components/Layout/Navbar';
// import Footer from '../components/Layout/Footer';
import Navbar from '../Components/Layout/Navbar';
import Footer from '../Components/Layout/Footer';


const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      icon: UserPlus,
      title: 'Sign Up in Seconds',
      description: 'Create your free account with just your email. No credit card required.',
      details: ['30-second setup', 'No commitment', 'Free forever plan']
    },
    {
      step: '02',
      icon: TrendingUp,
      title: 'Add Your Expenses',
      description: 'Start tracking your daily expenses or import existing data from your bank.',
      details: ['Manual entry', 'CSV import', 'Auto-categorization']
    },
    {
      step: '03',
      icon: Users,
      title: 'Invite & Collaborate',
      description: 'Add friends to groups or trips for shared expense tracking.',
      details: ['Email invitations', 'Real-time updates', 'Role management']
    },
    {
      step: '04',
      icon: CheckCircle,
      title: 'Get Insights & Save',
      description: 'Use our analytics to identify savings opportunities and grow your wealth.',
      details: ['Smart reports', 'Budget alerts', 'Settlement tracking']
    }
  ];

  const features = [
    {
      title: 'Smart Expense Capture',
      description: 'Easily add expenses on the go with our mobile-friendly interface.',
      icon: '📱'
    },
    {
      title: 'Automatic Splitting',
      description: 'Split bills equally or custom amounts with automatic calculations.',
      icon: '🎯'
    },
    {
      title: 'Real-time Settlements',
      description: 'See who owes whom and settle up with built-in payment tracking.',
      icon: '💸'
    },
    {
      title: 'Beautiful Reports',
      description: 'Visualize your spending with interactive charts and insights.',
      icon: '📊'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Simple, Fast, and
              <span className="text-green-600"> Effective</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Get started in minutes and see the difference in your financial health immediately. 
              Here's how Dhasu Wallet makes money management effortless.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works in 4 Easy Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From signup to savings, we guide you every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Steps List */}
            <div className="space-y-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="flex space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      <ul className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Visual Demo */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Live Demo Preview</h3>
                  <div className="flex items-center space-x-2 text-green-600">
                    <Play className="h-4 w-4" />
                    <span className="text-sm font-medium">Active</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm">💰</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Dinner with Friends</p>
                        <p className="text-sm text-gray-500">Food & Dining</p>
                      </div>
                    </div>
                    <span className="text-red-600 font-semibold">-$120.00</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">💼</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Freelance Payment</p>
                        <p className="text-sm text-gray-500">Income</p>
                      </div>
                    </div>
                    <span className="text-green-600 font-semibold">+$500.00</span>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-blue-700">Split with 3 friends</span>
                      <span className="text-sm font-medium text-blue-700">$40 each</span>
                    </div>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((num) => (
                        <div key={num} className="w-8 h-8 bg-blue-200 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-blue-600 text-xs">U{num}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center space-x-2">
                  <span>Try Interactive Demo</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Users Love Dhasu Wallet
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the features that make expense tracking enjoyable and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">30%</div>
              <p className="text-gray-600">Average savings increase</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">15min</div>
              <p className="text-gray-600">Weekly time savings</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
              <p className="text-gray-600">User satisfaction rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start Your Financial Journey Today
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their financial lives with Dhasu Wallet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-4 rounded-lg hover:bg-green-50 transition-colors font-semibold text-lg">
              Get Started Free
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-green-600 transition-colors font-semibold text-lg">
              Watch Tutorial
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;