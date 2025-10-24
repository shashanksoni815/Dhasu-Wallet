import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const GroupContext = createContext();

export const useGroup = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error('useGroup must be used within an GroupProvider');
  }
  return context;
};

export const GroupProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all groups for user
  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/groups');
      setGroups(response.data.data.groups);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch single group details
  const fetchGroupById = async (groupId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/groups/${groupId}`);
      setCurrentGroup(response.data.data.group);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching group:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create new group
  const createGroup = async (groupData) => {
    try {
      const response = await axios.post('http://localhost:8080/api/groups', groupData);
      setGroups(prev => [response.data.data.group, ...prev]);
      return { success: true, data: response.data.data.group };
    } catch (error) {
      console.error('Error creating group:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create group' 
      };
    }
  };

  // Update group
  const updateGroup = async (groupId, groupData) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/groups/${groupId}`, groupData);
      setGroups(prev => prev.map(group => 
        group._id === groupId ? response.data.data.group : group
      ));
      if (currentGroup && currentGroup._id === groupId) {
        setCurrentGroup(response.data.data.group);
      }
      return { success: true, data: response.data.data.group };
    } catch (error) {
      console.error('Error updating group:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update group' 
      };
    }
  };

  // Delete group
  const deleteGroup = async (groupId) => {
    try {
      await axios.delete(`http://localhost:8080/api/groups/${groupId}`);
      setGroups(prev => prev.filter(group => group._id !== groupId));
      if (currentGroup && currentGroup._id === groupId) {
        setCurrentGroup(null);
      }
      return { success: true };
    } catch (error) {
      console.error('Error deleting group:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete group' 
      };
    }
  };

  // Group Expenses Management
  const fetchGroupExpenses = async (groupId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/groups/${groupId}/expenses`);
      setGroupExpenses(response.data.data.expenses);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching group expenses:', error);
      throw error;
    }
  };

  const createGroupExpense = async (groupId, expenseData) => {
    try {
      const response = await axios.post(`http://localhost:8080/api/groups/${groupId}/expenses`, expenseData);
      setGroupExpenses(prev => [response.data.data.expense, ...prev]);
      return { success: true, data: response.data.data.expense };
    } catch (error) {
      console.error('Error creating group expense:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create group expense' 
      };
    }
  };

  const updateGroupExpense = async (groupId, expenseId, expenseData) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/groups/${groupId}/expenses/${expenseId}`, expenseData);
      setGroupExpenses(prev => prev.map(exp => 
        exp._id === expenseId ? response.data.data.expense : exp
      ));
      return { success: true, data: response.data.data.expense };
    } catch (error) {
      console.error('Error updating group expense:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update group expense' 
      };
    }
  };

  const deleteGroupExpense = async (groupId, expenseId) => {
    try {
      await axios.delete(`http://localhost:8080/api/groups/${groupId}/expenses/${expenseId}`);
      setGroupExpenses(prev => prev.filter(exp => exp._id !== expenseId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting group expense:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete group expense' 
      };
    }
  };

  // Calculate settlements (same logic as trips)
  const calculateSettlements = (expenses) => {
    if (!expenses || expenses.length === 0) return [];

    const balances = {};
    
    // Initialize balances for all members
    expenses.forEach(expense => {
      if (!balances[expense.paidBy._id]) {
        balances[expense.paidBy._id] = { user: expense.paidBy, balance: 0 };
      }
      
      expense.splitBetween.forEach(split => {
        if (!balances[split.userId._id]) {
          balances[split.userId._id] = { user: split.userId, balance: 0 };
        }
      });
    });

    // Calculate net balances
    expenses.forEach(expense => {
      // Person who paid gets positive balance
      balances[expense.paidBy._id].balance += expense.amount;
      
      // People who owe get negative balance
      expense.splitBetween.forEach(split => {
        balances[split.userId._id].balance -= split.share;
      });
    });

    // Convert to array and filter out zero balances
    const balanceArray = Object.values(balances).filter(b => Math.abs(b.balance) > 0.01);
    
    // Simplify settlements
    const settlements = [];
    const creditors = balanceArray.filter(b => b.balance > 0).sort((a, b) => b.balance - a.balance);
    const debtors = balanceArray.filter(b => b.balance < 0).sort((a, b) => a.balance - b.balance);

    creditors.forEach(creditor => {
      debtors.forEach(debtor => {
        if (Math.abs(debtor.balance) > 0.01 && creditor.balance > 0.01) {
          const amount = Math.min(creditor.balance, Math.abs(debtor.balance));
          settlements.push({
            from: debtor.user,
            to: creditor.user,
            amount: parseFloat(amount.toFixed(2))
          });
          creditor.balance -= amount;
          debtor.balance += amount;
        }
      });
    });

    return settlements;
  };

  const value = {
    groups,
    currentGroup,
    groupExpenses,
    loading,
    fetchGroups,
    fetchGroupById,
    createGroup,
    updateGroup,
    deleteGroup,
    fetchGroupExpenses,
    createGroupExpense,
    updateGroupExpense,
    deleteGroupExpense,
    calculateSettlements
  };

  return (
    <GroupContext.Provider value={value}>
      {children}
    </GroupContext.Provider>
  );
};