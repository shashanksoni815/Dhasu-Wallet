import React from 'react';
import { Edit2, Trash2, ArrowUpRight, ArrowDownLeft, Calendar, CreditCard } from 'lucide-react';

const ExpenseList = ({ expenses, loading, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Food & Dining': 'bg-orange-100 text-orange-800',
      'Transportation': 'bg-blue-100 text-blue-800',
      'Shopping': 'bg-purple-100 text-purple-800',
      'Entertainment': 'bg-pink-100 text-pink-800',
      'Bills & Utilities': 'bg-red-100 text-red-800',
      'Healthcare': 'bg-green-100 text-green-800',
      'Travel': 'bg-indigo-100 text-indigo-800',
      'Education': 'bg-yellow-100 text-yellow-800',
      'Groceries': 'bg-lime-100 text-lime-800',
      'Personal Care': 'bg-cyan-100 text-cyan-800',
      'Gifts & Donations': 'bg-rose-100 text-rose-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['Other'];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💸</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No expenses found</h3>
        <p className="text-gray-600">Get started by adding your first expense</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <div key={expense._id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              {/* Type Icon */}
              <div className={`p-3 rounded-full ${
                expense.type === 'income' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {expense.type === 'income' ? (
                  <ArrowDownLeft className="h-5 w-5" />
                ) : (
                  <ArrowUpRight className="h-5 w-5" />
                )}
              </div>

              {/* Expense Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-1">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {expense.description}
                  </h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(expense.category)}`}>
                    {expense.category}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatDate(expense.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="h-3 w-3 mr-1" />
                    <span>{expense.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Amount and Actions */}
            <div className="flex items-center space-x-3">
              <span className={`text-lg font-semibold ${
                expense.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {expense.type === 'income' ? '+' : '-'}₹{expense.amount}
              </span>
              
              <div className="flex space-x-1">
                <button
                  onClick={() => onEdit(expense)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit expense"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(expense._id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete expense"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">
            Showing {expenses.length} transaction{expenses.length !== 1 ? 's' : ''}
          </span>
          <div className="flex space-x-4">
            <span className="text-green-600 font-medium">
              Income: ₹{expenses.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
            </span>
            <span className="text-red-600 font-medium">
              Expenses: ₹{expenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;