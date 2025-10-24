import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Freelance Designer',
      image: '👩‍💻',
      content: 'As a freelancer, tracking expenses was a nightmare. ExpenseTracker made it so simple! I saved 20% more this year.',
      rating: 5
    },
    {
      name: 'Mike Rodriguez',
      role: 'Travel Enthusiast',
      image: '✈️',
      content: 'The trip expense feature is a game-changer! No more spreadsheets for group trips. Settlements are automatic and fair.',
      rating: 5
    },
    {
      name: 'Emily & James',
      role: 'Young Couple',
      image: '👫',
      content: 'Perfect for managing shared household expenses. We finally stopped arguing about money!',
      rating: 5
    }
  ];

  const StarRating = ({ rating }) => {
    return (
      <div className="flex justify-center space-x-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i}
            className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Loved by Thousands of Users
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how ExpenseTracker is helping people take control of their finances and build better relationships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <StarRating rating={testimonial.rating} />
              <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
              <div className="flex items-center">
                <div className="text-2xl mr-4">{testimonial.image}</div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;