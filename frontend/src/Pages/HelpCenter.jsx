// src/pages/HelpCenter.jsx
import React, { useState } from 'react';
import { Search, Book, Video, MessageCircle, ChevronRight, Play } from 'lucide-react';
import Navbar from '../Components/Layout/Navbar';
import Footer from '../Components/Layout/Footer';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');

  const categories = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      description: 'New to Dhasu Wallet? Start here.',
      icon: '🚀',
      articles: [
        { title: 'Creating Your First Expense', views: '1.2k' },
        { title: 'Setting Up Your Profile', views: '890' },
        { title: 'Understanding the Dashboard', views: '756' },
        { title: 'Mobile App Setup Guide', views: '643' }
      ]
    },
    {
      id: 'expenses',
      name: 'Expenses & Tracking',
      description: 'Learn how to track and manage expenses.',
      icon: '💰',
      articles: [
        { title: 'Adding Manual Expenses', views: '2.1k' },
        { title: 'Importing from Bank Statements', views: '1.5k' },
        { title: 'Setting Up Recurring Expenses', views: '987' },
        { title: 'Expense Categorization Tips', views: '832' }
      ]
    },
    {
      id: 'groups',
      name: 'Groups & Splitting',
      description: 'Managing shared expenses with others.',
      icon: '👥',
      articles: [
        { title: 'Creating Your First Group', views: '1.8k' },
        { title: 'Adding Members to Groups', views: '1.4k' },
        { title: 'Splitting Expenses Equally', views: '1.2k' },
        { title: 'Custom Split Calculations', views: '945' }
      ]
    },
    {
      id: 'trips',
      name: 'Trip Management',
      description: 'Tracking expenses for travel and trips.',
      icon: '✈️',
      articles: [
        { title: 'Setting Up a Trip Budget', views: '1.1k' },
        { title: 'Multi-Currency Support', views: '876' },
        { title: 'Trip Expense Reports', views: '765' },
        { title: 'Settling Trip Expenses', views: '698' }
      ]
    },
    {
      id: 'billing',
      name: 'Billing & Accounts',
      description: 'Manage your subscription and account.',
      icon: '💳',
      articles: [
        { title: 'Upgrading Your Plan', views: '543' },
        { title: 'Payment Method Management', views: '432' },
        { title: 'Canceling Your Subscription', views: '387' },
        { title: 'Account Security Settings', views: '321' }
      ]
    },
    {
      id: 'troubleshooting',
      name: 'Troubleshooting',
      description: 'Common issues and solutions.',
      icon: '🔧',
      articles: [
        { title: 'Login Issues', views: '654' },
        { title: 'Sync Problems', views: '543' },
        { title: 'Mobile App Not Working', views: '432' },
        { title: 'Data Import Errors', views: '321' }
      ]
    }
  ];

  const videoTutorials = [
    {
      title: 'Getting Started in 5 Minutes',
      duration: '5:23',
      thumbnail: '🎬',
      views: '12.4k'
    },
    {
      title: 'Group Expense Splitting',
      duration: '7:45',
      thumbnail: '👥',
      views: '8.7k'
    },
    {
      title: 'Advanced Analytics Guide',
      duration: '12:18',
      thumbnail: '📊',
      views: '6.2k'
    },
    {
      title: 'Mobile App Tour',
      duration: '4:56',
      thumbnail: '📱',
      views: '15.1k'
    }
  ];

  const popularArticles = [
    { title: 'How to Split Expenses with Roommates', views: '15.2k' },
    { title: 'Setting Up Monthly Budgets', views: '12.8k' },
    { title: 'Travel Expense Tracking Guide', views: '11.3k' },
    { title: 'Understanding Settlement Calculations', views: '9.7k' },
    { title: 'Exporting Your Data', views: '8.4k' }
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.articles.some(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              How Can We
              <span className="text-green-600"> Help You?</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Find answers to common questions, watch tutorials, and get the most out of Dhasu Wallet.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help articles, tutorials, and more..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Help Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-green-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <Book className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Knowledge Base</h3>
              <p className="text-gray-600 mb-4">Browse our comprehensive documentation and guides</p>
              <button className="text-green-600 font-semibold hover:text-green-700">
                Explore Articles →
              </button>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <Video className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Video Tutorials</h3>
              <p className="text-gray-600 mb-4">Watch step-by-step guides and feature walkthroughs</p>
              <button className="text-blue-600 font-semibold hover:text-blue-700">
                Watch Videos →
              </button>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <MessageCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact Support</h3>
              <p className="text-gray-600 mb-4">Get help from our support team 24/7</p>
              <button className="text-purple-600 font-semibold hover:text-purple-700">
                Get Help →
              </button>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-green-500"
                  onClick={() => setActiveCategory(category.id)}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-2xl">{category.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-gray-600 text-sm">{category.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {category.articles.slice(0, 3).map((article, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 hover:text-green-600 cursor-pointer">
                          {article.title}
                        </span>
                        <span className="text-gray-500 text-xs">{article.views} views</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 text-green-600 font-semibold hover:text-green-700 flex items-center justify-center space-x-1">
                    <span>View All</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Video Tutorials */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Video Tutorials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {videoTutorials.map((video, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="relative mb-4">
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center text-4xl group-hover:bg-gray-300 transition-colors">
                      {video.thumbnail}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="h-5 w-5 text-white fill-current" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                      {video.duration}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{video.views} views</p>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Articles */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Articles</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="space-y-4">
                {popularArticles.map((article, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="text-gray-900 group-hover:text-green-600 transition-colors">
                        {article.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-500 text-sm">{article.views} views</span>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Still Need Help?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Our support team is here to help you get the most out of Dhasu Wallet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-4 rounded-lg hover:bg-green-50 transition-colors font-semibold text-lg">
              Contact Support
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-green-600 transition-colors font-semibold text-lg">
              Schedule a Call
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HelpCenter;