import React, { useState, useEffect } from 'react';
import { Plus, Filter, Download } from 'lucide-react';
// import { useExpense } from '../../context/ExpenseContext';
// import ExpenseForm from '../../components/Expenses/ExpenseForm';
// import ExpenseList from '../../components/Expenses/ExpenseList';
// import ExpenseFilter from '../../components/Expenses/ExpenseFilter';
import { useExpense } from '../../Context/ExpenceContext';
import ExpenseForm from '../../Components/Expense/ExpensesForm';
import ExpenseList from '../../Components/Expense/ExpensesList';
import ExpenseFilter from '../../Components/Expense/ExpensesFilter';

const Expenses = () => {
  const {
    expenses,
    loading,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense
  } = useExpense();

  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchExpenses(filters);
  }, [filters]);

  const handleCreateExpense = async (expenseData) => {
    const result = await createExpense(expenseData);
    if (result.success) {
      setShowForm(false);
    }
    return result;
  };

  const handleUpdateExpense = async (expenseData) => {
    const result = await updateExpense(editingExpense._id, expenseData);
    if (result.success) {
      setEditingExpense(null);
      setShowForm(false);
    }
    return result;
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(expenseId);
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      type: '',
      category: '',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-gray-600 mt-1">
            Track and manage your income and expenses
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
          <button className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <ExpenseFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* Expense List */}
      <ExpenseList
        expenses={expenses}
        loading={loading}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
      />

      {/* Expense Form Modal */}
      <ExpenseForm
        expense={editingExpense}
        onSave={editingExpense ? handleUpdateExpense : handleCreateExpense}
        onCancel={() => {
          setShowForm(false);
          setEditingExpense(null);
        }}
        isOpen={showForm}
      />
    </div>
  );
};

export default Expenses;