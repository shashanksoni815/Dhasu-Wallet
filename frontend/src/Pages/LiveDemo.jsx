// src/pages/LiveDemo.jsx
import React, { useState } from 'react';
import { Play, Pause, RotateCcw, DollarSign, Users, PieChart, ArrowRight } from 'lucide-react';
import Navbar from '../Components/Layout/Navbar';
import Footer from '../Components/Layout/Footer';

const LiveDemo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: 'Add Your First Expense',
      description: 'Start by adding an expense with our simple form.',
      action: 'Expense added: "Dinner with friends" - $120.00',
      screenshot: '💰'
    },
    {
      title: 'Split with Friends',
      description: 'Automatically split the expense equally among participants.',
      action: 'Split among 3 friends: $40.00 each',
      screenshot: '👥'
    },
    {
      title: 'Track Settlements',
      description: 'See who owes whom and track payment status.',
      action: 'Settlement calculated: Friend A owes you $40.00',
      screenshot: '💸'
    },
    {
      title: 'View Analytics',
      description: 'Get insights into your spending patterns.',
      action: 'Monthly report generated: 30% savings identified',
      screenshot: '📊'
    }
  ];

  const features = [
    {
      icon: '⚡',
      title: 'Instant Setup',
      description: 'Get started in under 5 minutes with our intuitive interface.'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and never shared.'
    },
    {
      icon: '📱',
      title: 'Mobile Ready',
      description: 'Works perfectly on all your devices, anywhere.'
    },
    {
      icon: '🌍',
      title: 'Multi-Currency',
      description: 'Support for all major currencies and automatic conversions.'
    }
  ];

  const startDemo = () => {
    setIsPlaying(true);
    let step = 0;
    const interval = setInterval(() => {
      setCurrentStep(step);
      step++;
      if (step >= demoSteps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsPlaying(false);
          setCurrentStep(0);
        }, 3000);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Experience ExpenseTracker
              <span className="text-orange-600"> Live</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              See how ExpenseTracker works in real-time. No signup required - explore all features right here.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Demo Controls */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Interactive Demo
                </h2>
                <p className="text-xl text-gray-600">
                  Watch ExpenseTracker in action. See how easy it is to manage your finances.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Demo Controls</h3>
                  <div className="flex items-center space-x-2">
                    {isPlaying ? (
                      <span className="text-green-600 text-sm font-medium flex items-center">
                        <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></div>
                        Playing
                      </span>
                    ) : (
                      <span className="text-gray-600 text-sm">Ready</span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={startDemo}
                    disabled={isPlaying}
                    className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors font-semibold flex items-center justify-center space-x-2"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-5 w-5" />
                        <span>Demo Running...</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5" />
                        <span>Start Live Demo</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStep(0);
                    }}
                    className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center justify-center space-x-2"
                  >
                    <RotateCcw className="h-5 w-5" />
                    <span>Reset Demo</span>
                  </button>
                </div>

                {/* Progress */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{currentStep + 1} / {demoSteps.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Current Step Info */}
              {isPlaying && (
                <div className="bg-blue-50 rounded-2xl p-6">
                  <h4 className="font-semibold text-blue-900 mb-2">Current Action:</h4>
                  <p className="text-blue-800">{demoSteps[currentStep]?.action}</p>
                </div>
              )}
            </div>

            {/* Demo Display */}
            <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl">
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 min-h-[400px]">
                {isPlaying ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-6">
                    <div className="text-6xl mb-4">{demoSteps[currentStep]?.screenshot}</div>
                    <h3 className="text-2xl font-bold text-gray-900 text-center">
                      {demoSteps[currentStep]?.title}
                    </h3>
                    <p className="text-gray-600 text-center">
                      {demoSteps[currentStep]?.description}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full space-y-6 text-center">
                    <div className="text-6xl">📊</div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Ready to Explore?
                    </h3>
                    <p className="text-gray-600">
                      Click "Start Live Demo" to see ExpenseTracker in action
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span>Expense Tracking</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span>Group Splitting</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <PieChart className="h-4 w-4 text-purple-500" />
                        <span>Analytics</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ExpenseTracker?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the features that make us the best choice for expense management.
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their financial management with ExpenseTracker.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 px-8 py-4 rounded-lg hover:bg-orange-50 transition-colors font-semibold text-lg flex items-center justify-center space-x-2">
              <span>Start Free Trial</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-orange-600 transition-colors font-semibold text-lg">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LiveDemo;