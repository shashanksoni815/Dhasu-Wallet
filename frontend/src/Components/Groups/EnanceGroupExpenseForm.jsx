// src/components/Groups/EnhancedGroupExpenseForm.jsx
import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, User, Calculator } from 'lucide-react';

const EnhancedGroupExpenseForm = ({ group, expense, onSave, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'Other',
    date: new Date().toISOString().split('T')[0],
    paidBy: ''
  });

  const categories = [
    'Food & Dining', 'Transportation', 'Utilities', 'Rent', 'Entertainment',
    'Groceries', 'Household', 'Gifts', 'Travel', 'Other'
  ];

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount.toString(),
        description: expense.description,
        category: expense.category,
        date: new Date(expense.date).toISOString().split('T')[0],
        paidBy: expense.paidBy._id
      });
    } else if (group) {
      setFormData({
        amount: '',
        description: '',
        category: 'Other',
        date: new Date().toISOString().split('T')[0],
        paidBy: group.members[0]?.userId._id || ''
      });
    }
  }, [group, expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  // Calculate equal split details
  const amount = parseFloat(formData.amount) || 0;
  const memberCount = group?.members.length || 1;
  const sharePerPerson = amount / memberCount;
  const percentagePerPerson = (1 / memberCount) * 100;

  if (!isOpen || !group) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {expense ? 'Edit Expense' : 'Add Group Expense (Auto-Split)'}
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
              Amount ($)
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
                {group.members.map(member => (
                  <option key={member.userId._id} value={member.userId._id}>
                    {member.userId.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Split Preview */}
          {amount > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Calculator className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">Auto-Split Preview</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-700 font-medium">Each member pays:</p>
                  <p className="text-blue-900 text-lg font-bold">
                    ${sharePerPerson.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-blue-700 font-medium">Split percentage:</p>
                  <p className="text-blue-900 text-lg font-bold">
                    {percentagePerPerson.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-blue-700 text-sm">
                  This expense will be split equally among all {memberCount} members
                </p>
              </div>
            </div>
          )}

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
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              {expense ? 'Update Expense' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedGroupExpenseForm;