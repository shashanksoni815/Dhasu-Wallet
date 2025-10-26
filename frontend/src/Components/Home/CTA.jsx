import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const CTA = () => {
  const features = [
    'Free forever for basic features',
    'No credit card required',
    'Setup in under 5 minutes',
    'Bank-level security',
    '24/7 customer support'
  ];

  return (
    <section className="py-20 bg-gradient from-blue-600 to-purple-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-blue-500">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Financial Life?
          </h2>
          <p className="text-xl text-blue-500 mb-8 max-w-3xl mx-auto">
            Join thousands of users who have saved time, money, and relationships with ExpenseTracker.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Features List */}
            <div className="text-left">
              <h3 className="text-2xl font-semibold mb-6">What You Get:</h3>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                    <span className="text-blue-100">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Card */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Your Journey Today</h3>
              <p className="text-gray-800 mb-6">
                Create your free account and experience the difference in just 5 minutes.
              </p>
              
              <div className="space-y-4">
                <Link 
                  to="/register" 
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 font-semibold text-lg flex items-center justify-center space-x-2"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-center space-x-6 text-sm text-gray-500">
                  <span>🔒 SSL Secure</span>
                  <span>⭐ 4.9/5 Rating</span>
                  <span>👥 10K+ Users</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;