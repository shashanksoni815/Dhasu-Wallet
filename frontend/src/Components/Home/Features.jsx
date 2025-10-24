import React from 'react';
import { Users, Plane, PieChart, Bell, Lock, Smartphone } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: PieChart,
      title: 'Smart Expense Tracking',
      description: 'Automatically categorize expenses and get insights into your spending patterns with beautiful charts.',
      color: 'text-blue-600'
    },
    {
      icon: Users,
      title: 'Group Expense Splitting',
      description: 'Split bills with friends, roommates, or colleagues effortlessly. No more awkward money conversations.',
      color: 'text-green-600'
    },
    {
      icon: Plane,
      title: 'Trip Budget Management',
      description: 'Plan trip budgets, track shared expenses, and settle up easily with travel companions.',
      color: 'text-purple-600'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Get alerts for upcoming bills, budget limits, and settlement reminders.',
      color: 'text-yellow-600'
    },
    {
      icon: Lock,
      title: 'Bank-Level Security',
      description: 'Your financial data is encrypted and secure. We never share your information.',
      color: 'text-red-600'
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Access your finances anywhere with our responsive design that works perfectly on all devices.',
      color: 'text-indigo-600'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Master Your Finances
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features designed to make expense tracking simple, social, and insightful.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105">
                <div className={`w-12 h-12 ${feature.color} bg-opacity-10 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;