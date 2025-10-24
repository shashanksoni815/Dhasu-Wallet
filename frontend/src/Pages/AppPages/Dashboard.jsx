import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Users, Plane, RefreshCw } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/dashboard/summary');
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const summaryCards = [
    {
      title: 'Total Expenses',
      value: `$${dashboardData?.summary?.totalExpenses || 0}`,
      icon: DollarSign,
      trend: 'neutral',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Monthly Budget',
      value: `$${dashboardData?.summary?.budget || 0}`,
      icon: Target,
      trend: 'neutral',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Net Savings',
      value: `$${dashboardData?.summary?.netSavings || 0}`,
      icon: dashboardData?.summary?.netSavings >= 0 ? TrendingUp : TrendingDown,
      trend: dashboardData?.summary?.netSavings >= 0 ? 'up' : 'down',
      color: dashboardData?.summary?.netSavings >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: dashboardData?.summary?.netSavings >= 0 ? 'bg-green-50' : 'bg-red-50'
    },
    {
      title: 'Active Trips',
      value: dashboardData?.activeTrips?.length || 0,
      icon: Plane,
      trend: 'neutral',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's your financial overview.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 mt-4 sm:mt-0"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className={`text-2xl font-bold mt-2 ${card.color}`}>
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {dashboardData?.recentTransactions?.length > 0 ? (
            dashboardData.recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.category}</p>
                  </div>
                </div>
                <div className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent transactions</p>
              <p className="text-sm mt-1">Your recent expenses will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Trips */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Trips</h3>
          <div className="space-y-3">
            {dashboardData?.activeTrips?.length > 0 ? (
              dashboardData.activeTrips.slice(0, 3).map((trip, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Plane className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">{trip.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{trip.members.length} members</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No active trips</p>
            )}
          </div>
        </div>

        {/* Active Groups */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Groups</h3>
          <div className="space-y-3">
            {dashboardData?.activeGroups?.length > 0 ? (
              dashboardData.activeGroups.slice(0, 3).map((group, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900">{group.name}</p>
                      <p className="text-sm text-gray-500">{group.description}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{group.members.length} members</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No active groups</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;