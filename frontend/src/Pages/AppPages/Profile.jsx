import React from 'react';
// import { useAuth } from '../../context/AuthContext';
import { useAuth } from '../../Context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-lg text-gray-900">{user?.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-lg text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Monthly Budget</label>
            <p className="mt-1 text-lg text-gray-900">${user?.monthlyBudget || '0'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Currency</label>
            <p className="mt-1 text-lg text-gray-900">{user?.currency}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;