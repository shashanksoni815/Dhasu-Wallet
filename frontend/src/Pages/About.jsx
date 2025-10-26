// src/pages/About.jsx
import React from 'react';
import { Heart, Target, Users, Globe, Award, TrendingUp } from 'lucide-react';
import Navbar from '../Components/Layout/Navbar';
import Footer from '../Components/Layout/Footer';

const About = () => {
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'Former financial analyst with 10+ years in fintech.',
      image: '👩‍💼'
    },
    {
      name: 'Mike Chen',
      role: 'CTO',
      bio: 'Full-stack developer passionate about building scalable solutions.',
      image: '👨‍💻'
    },
    {
      name: 'Emily Davis',
      role: 'Product Designer',
      bio: 'UX specialist focused on creating intuitive financial interfaces.',
      image: '👩‍🎨'
    },
    {
      name: 'David Kim',
      role: 'Growth Manager',
      bio: 'Marketing expert dedicated to helping users achieve financial freedom.',
      image: '👨‍💼'
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'User-First',
      description: 'We prioritize our users needs above everything else.'
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for excellence in every feature we build.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'We believe in the power of teamwork and shared success.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'We aim to help people worldwide achieve financial wellness.'
    }
  ];

  const milestones = [
    {
      year: '2022',
      event: 'Company Founded',
      description: 'Started with a vision to simplify expense management.'
    },
    {
      year: '2023',
      event: 'First 1,000 Users',
      description: 'Reached our first major user milestone.'
    },
    {
      year: '2024',
      event: 'Mobile App Launch',
      description: 'Expanded to iOS and Android platforms.'
    },
    {
      year: '2024',
      event: '10,000+ Users',
      description: 'Helping thousands achieve financial control.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 to-purple-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Our Mission: Financial
              <span className="text-indigo-600"> Freedom for All</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              We believe that everyone deserves to have control over their finances, 
              without complexity or stress. That's why we built ExpenseTracker.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                ExpenseTracker was born from a simple observation: managing money shouldn't be complicated. 
                After years of struggling with spreadsheets, forgotten receipts, and awkward money conversations, 
                our founder Sarah decided there had to be a better way.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                What started as a personal project to track expenses with roommates quickly evolved into 
                a comprehensive platform that helps individuals, groups, and teams take control of their finances.
              </p>
              <p className="text-lg text-gray-600">
                Today, we're proud to serve thousands of users worldwide, helping them save time, 
                reduce financial stress, and build better money habits.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                  <div className="text-gray-600">User Rating</div>
                </div>
                <div className="text-center">
                  <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-gray-900">10K+</div>
                  <div className="text-gray-600">Active Users</div>
                </div>
                <div className="text-center">
                  <Globe className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-gray-900">50+</div>
                  <div className="text-gray-600">Countries</div>
                </div>
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-gray-900">30%</div>
                  <div className="text-gray-600">Avg. Savings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do at ExpenseTracker.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate individuals dedicated to making financial management accessible to everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{member.image}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              From humble beginnings to helping thousands worldwide.
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {milestone.year}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.event}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Be part of the movement to make financial management simple and accessible for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-indigo-600 px-8 py-4 rounded-lg hover:bg-indigo-50 transition-colors font-semibold text-lg">
              Start Free Today
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-indigo-600 transition-colors font-semibold text-lg">
              View Open Positions
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;