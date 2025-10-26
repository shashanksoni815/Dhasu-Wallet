import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const ExpenseContext = createContext();

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async (filters = {}) => {
    setLoading(true);
    try {
      const response = await axios.get('https://dhasu-wallet-backend-route.onrender.com/api/expenses', { 
        params: filters 
      });
      setExpenses(response.data.data.expenses);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createExpense = async (expenseData) => {
    try {
      const response = await axios.post('https://dhasu-wallet-backend-route.onrender.com/api/expenses', expenseData);
      setExpenses(prev => [response.data.data.expense, ...prev]);
      return { success: true, data: response.data.data.expense };
    } catch (error) {
      console.error('Error creating expense:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create expense' 
      };
    }
  };

  const updateExpense = async (id, expenseData) => {
    try {
      const response = await axios.put(`https://dhasu-wallet-backend-route.onrender.com/api/expenses/${id}`, expenseData);
      setExpenses(prev => prev.map(exp => 
        exp._id === id ? response.data.data.expense : exp
      ));
      return { success: true, data: response.data.data.expense };
    } catch (error) {
      console.error('Error updating expense:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update expense' 
      };
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`https://dhasu-wallet-backend-route.onrender.com/api/expenses/${id}`);
      setExpenses(prev => prev.filter(exp => exp._id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting expense:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete expense' 
      };
    }
  };

  const value = {
    expenses,
    loading,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};