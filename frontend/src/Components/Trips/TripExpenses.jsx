import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, User, Users } from 'lucide-react';

const TripExpenseForm = ({ trip, expense, onSave, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'Other',
    date: new Date().toISOString().split('T')[0],
    paidBy: '',
    splitBetween: []
  });

  const categories = [
    'Accommodation', 'Transportation', 'Food & Dining', 'Activities', 
    'Shopping', 'Sightseeing', 'Emergency', 'Other'
  ];

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount.toString(),
        description: expense.description,
        category: expense.category,
        date: new Date(expense.date).toISOString().split('T')[0],
        paidBy: expense.paidBy._id,
        splitBetween: expense.splitBetween.map(split => ({
          userId: split.userId._id,
          share: split.share
        }))
      });
    } else if (trip) {
      const defaultSplit = trip.members.map(member => ({
        userId: member.userId._id,
        share: 0
      }));

      setFormData({
        amount: '',
        description: '',
        category: 'Other',
        date: new Date().toISOString().split('T')[0],
        paidBy: trip.members[0]?.userId._id || '',
        splitBetween: defaultSplit
      });
    }
  }, [trip, expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Recalculate splits when amount changes
    if (name === 'amount' && value && trip) {
      const amount = parseFloat(value);
      const sharePerPerson = amount / trip.members.length;
      setFormData(prev => ({
        ...prev,
        splitBetween: trip.members.map(member => ({
          userId: member.userId._id,
          share: sharePerPerson
        }))
      }));
    }
  };

  const handleSplitChange = (userId, share) => {
    setFormData(prev => ({
      ...prev,
      splitBetween: prev.splitBetween.map(split => 
        split.userId === userId 
          ? { ...split, share: parseFloat(share) || 0 }
          : split
      )
    }));
  };

  const handleEqualSplit = () => {
    const amount = parseFloat(formData.amount);
    if (amount && trip) {
      const sharePerPerson = amount / trip.members.length;
      setFormData(prev => ({
        ...prev,
        splitBetween: trip.members.map(member => ({
          userId: member.userId._id,
          share: sharePerPerson
        }))
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      amount: parseFloat(formData.amount),
      splitBetween: formData.splitBetween.map(split => ({
        userId: split.userId,
        share: parseFloat(split.share)
      }))
    });
  };

  const totalSplit = formData.splitBetween.reduce((sum, split) => sum + parseFloat(split.share || 0), 0);
  const amount = parseFloat(formData.amount) || 0;
  const isSplitValid = Math.abs(totalSplit - amount) < 0.01;

  if (!isOpen || !trip) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {expense ? 'Edit Expense' : 'Add Trip Expense'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount ({trip.currency})
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="amount"
                id="amount"
                required
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={handleChange}
                className="pl-7 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="description"
                id="description"
                required
                value={formData.description}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="What was this expense for?"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <div className="mt-1 relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
                className="pl-10 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <div className="mt-1 relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                name="date"
                id="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="pl-10 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Paid By */}
          <div>
            <label htmlFor="paidBy" className="block text-sm font-medium text-gray-700">
              Paid By
            </label>
            <div className="mt-1 relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                name="paidBy"
                id="paidBy"
                required
                value={formData.paidBy}
                onChange={handleChange}
                className="pl-10 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {trip.members.map(member => (
                  <option key={member.userId._id} value={member.userId._id}>
                    {member.userId.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Split Between */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Split Between
              </label>
              <button
                type="button"
                onClick={handleEqualSplit}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Split Equally
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {trip.members.map((member) => {
                const split = formData.splitBetween.find(s => s.userId === member.userId._id);
                return (
                  <div key={member.userId._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{member.userId.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{trip.currency}</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={split?.share || 0}
                        onChange={(e) => handleSplitChange(member.userId._id, e.target.value)}
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Split Validation */}
            <div className={`mt-2 text-sm ${
              isSplitValid ? 'text-green-600' : 'text-red-600'
            }`}>
              Total: {totalSplit.toFixed(2)} {trip.currency} • 
              {isSplitValid ? ' ✓ Split is valid' : ' ✗ Split does not match total'}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-900 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isSplitValid}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {expense ? 'Update Expense' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripExpenseForm;