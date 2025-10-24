import React from 'react';
import { UserPlus, TrendingUp, Users, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      icon: UserPlus,
      title: 'Sign Up in Seconds',
      description: 'Create your free account with just your email. No credit card required.',
      color: 'bg-blue-500'
    },
    {
      step: '02',
      icon: TrendingUp,
      title: 'Add Your Expenses',
      description: 'Start tracking your daily expenses or import existing data.',
      color: 'bg-green-500'
    },
    {
      step: '03',
      icon: Users,
      title: 'Invite & Collaborate',
      description: 'Add friends to groups or trips for shared expense tracking.',
      color: 'bg-purple-500'
    },
    {
      step: '04',
      icon: CheckCircle,
      title: 'Get Insights & Save',
      description: 'Use our analytics to identify savings opportunities and grow your wealth.',
      color: 'bg-yellow-500'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Fast, and Effective
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started in minutes and see the difference in your financial health immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto text-white text-xl font-bold`}>
                    {step.step}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                    <Icon className="h-6 w-6 text-gray-700" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* Benefits */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">30%</div>
              <p className="text-gray-600">Average savings increase</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">15min</div>
              <p className="text-gray-600">Weekly time savings</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
              <p className="text-gray-600">User satisfaction rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;