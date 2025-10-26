// src/pages/Pricing.jsx
import React, { useState } from 'react';
import { Check, Star, Zap, Crown } from 'lucide-react';
// import Navbar from '../components/Layout/Navbar';
// import Footer from '../components/Layout/Footer';
import Navbar from '../Components/Layout/Navbar';
import Footer from '../Components/Layout/Footer';


const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for individuals getting started',
      price: {
        monthly: '$0',
        yearly: '$0'
      },
      popular: false,
      features: [
        'Up to 50 expenses per month',
        'Basic expense tracking',
        'Manual expense categorization',
        'Email support',
        '1 active trip/group',
        'Basic reports'
      ],
      cta: 'Get Started Free',
      color: 'gray'
    },
    {
      name: 'Pro',
      description: 'Best for power users and small groups',
      price: {
        monthly: '$9',
        yearly: '$90'
      },
      popular: true,
      features: [
        'Unlimited expenses',
        'Auto-expense categorization',
        'Advanced splitting options',
        'Priority support',
        '5 active trips/groups',
        'Advanced analytics',
        'CSV export',
        'Multi-currency support'
      ],
      cta: 'Start Free Trial',
      color: 'blue'
    },
    {
      name: 'Business',
      description: 'For teams and organizations',
      price: {
        monthly: '$29',
        yearly: '$290'
      },
      popular: false,
      features: [
        'Everything in Pro',
        'Team management',
        'Admin dashboard',
        'Custom categories',
        'Unlimited trips/groups',
        'API access',
        'White-label options',
        'Dedicated account manager'
      ],
      cta: 'Contact Sales',
      color: 'purple'
    }
  ];

  const faqs = [
    {
      question: 'Can I change plans later?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, all paid plans come with a 14-day free trial. No credit card required.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, you can cancel your subscription at any time. No questions asked.'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      gray: 'bg-gray-500 text-white',
      blue: 'bg-blue-500 text-white',
      purple: 'bg-purple-500 text-white'
    };
    return colors[color] || colors.blue;
  };

  const getBorderColor = (color) => {
    const colors = {
      gray: 'border-gray-300',
      blue: 'border-blue-300',
      purple: 'border-purple-300'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Simple, Transparent
              <span className="text-purple-600"> Pricing</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Choose the plan that works best for you. All plans include core features to help you 
              take control of your finances.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  billingPeriod === 'monthly'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  billingPeriod === 'yearly'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly <span className="text-green-500 text-sm ml-1">Save 16%</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white -mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl border-2 ${
                  plan.popular 
                    ? 'border-purple-500 shadow-xl transform scale-105' 
                    : getBorderColor(plan.color)
                } bg-white p-8 hover:shadow-lg transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-current" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {plan.name === 'Pro' && <Zap className="h-5 w-5 text-yellow-500" />}
                    {plan.name === 'Business' && <Crown className="h-5 w-5 text-purple-500" />}
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price[billingPeriod]}
                    </span>
                    {plan.price.monthly !== '$0' && (
                      <span className="text-gray-600">
                        /{billingPeriod === 'monthly' ? 'month' : 'year'}
                      </span>
                    )}
                  </div>

                  {billingPeriod === 'yearly' && plan.price.monthly !== '$0' && (
                    <p className="text-green-600 text-sm font-medium">
                      Save ${(parseInt(plan.price.monthly.slice(1)) * 12 - parseInt(plan.price.yearly.slice(1)))} per year
                    </p>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : plan.name === 'Free'
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Compare Plans
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our plans stack up against each other
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-6 text-left font-semibold text-gray-900">Feature</th>
                  {plans.map((plan, index) => (
                    <th key={index} className="py-4 px-6 text-center font-semibold text-gray-900">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 text-gray-600">Expense Limit</td>
                  <td className="py-4 px-6 text-center">50/month</td>
                  <td className="py-4 px-6 text-center">Unlimited</td>
                  <td className="py-4 px-6 text-center">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 text-gray-600">Active Trips/Groups</td>
                  <td className="py-4 px-6 text-center">1</td>
                  <td className="py-4 px-6 text-center">5</td>
                  <td className="py-4 px-6 text-center">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 text-gray-600">Auto-categorization</td>
                  <td className="py-4 px-6 text-center">-</td>
                  <td className="py-4 px-6 text-center">✓</td>
                  <td className="py-4 px-6 text-center">✓</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 text-gray-600">Advanced Analytics</td>
                  <td className="py-4 px-6 text-center">-</td>
                  <td className="py-4 px-6 text-center">✓</td>
                  <td className="py-4 px-6 text-center">✓</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 text-gray-600">Team Management</td>
                  <td className="py-4 px-6 text-center">-</td>
                  <td className="py-4 px-6 text-center">-</td>
                  <td className="py-4 px-6 text-center">✓</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-600">Priority Support</td>
                  <td className="py-4 px-6 text-center">-</td>
                  <td className="py-4 px-6 text-center">✓</td>
                  <td className="py-4 px-6 text-center">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their financial management with ExpenseTracker.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-lg hover:bg-purple-50 transition-colors font-semibold text-lg">
              Start Free Today
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-purple-600 transition-colors font-semibold text-lg">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;