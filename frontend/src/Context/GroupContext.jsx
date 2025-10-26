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
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search users by email (can reuse from TripContext or define here)
  const searchUsers = async (email) => {
    try {
      const response = await axios.get(`https://dhasu-wallet-backend-route.onrender.com/api/users/search?email=${email}`);
      return response.data.data.users;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  };

  // Get group members from database
  const fetchGroupMembers = async (groupId) => {
    try {
      const response = await axios.get(`https://dhasu-wallet-backend-route.onrender.com/api/groups/${groupId}/members`);
      setGroupMembers(response.data.data.members);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching group members:', error);
      throw error;
    }
  };

  // Add member to group
  // const addMemberByEmail = async (groupId, email) => {
  //   try {
  //     const response = await axios.post(`https://dhasu-wallet-backend-route.onrender.com/api/groups/${groupId}/members`, { email });
  //     setGroupMembers(response.data.data.members);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error adding member:', error);
  //     throw error;
  //   }
  // };

  // In your GroupContext - update the addMemberByEmail method:
  const addMemberByEmail = async (groupId, email) => {
    try {
      const response = await axios.post(`https://dhasu-wallet-backend-route.onrender.com/api/groups/${groupId}/members`, { 
        email: email.trim().toLowerCase() 
      });
      
      // Update both groupMembers and currentGroup if needed
      if (response.data.data?.members) {
        setGroupMembers(response.data.data.members);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error adding member:', error);
      
      let errorMessage = 'Failed to add member';
      if (error.response?.status === 404) {
        errorMessage = 'User not found with this email';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid request';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to add members';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      throw new Error(errorMessage);
    }
  };

  // Remove member from group
  const removeMember = async (groupId, memberId) => {
    try {
      const response = await axios.delete(`https://dhasu-wallet-backend-route.onrender.com/api/groups/${groupId}/members/${memberId}`);
      setGroupMembers(response.data.data.members);
      return response.data;
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  };

  // Create expense with auto-split
  const createAutoSplitExpense = async (groupId, expenseData) => {
    try {
      const response = await axios.post(`https://dhasu-wallet-backend-route.onrender.com/api/groups/${groupId}/expenses/auto-split`, expenseData);
      setGroupExpenses(prev => [response.data.data.expense, ...prev]);
      return { success: true, data: response.data.data.expense };
    } catch (error) {
      console.error('Error creating auto-split expense:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create expense' 
      };
    }
  };

  // Get settlements
  const fetchSettlements = async (groupId) => {
    try {
      const response = await axios.get(`https://dhasu-wallet-backend-route.onrender.com/api/groups/${groupId}/settlements`);
      setSettlements(response.data.data.settlements);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching settlements:', error);
      throw error;
    }
  };

  // Existing methods (keep these from your current GroupContext)
  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://dhasu-wallet-backend-route.onrender.com/api/groups');
      setGroups(response.data.data.groups);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupById = async (groupId) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://dhasu-wallet-backend-route.onrender.com/api/groups/${groupId}`);
      setCurrentGroup(response.data.data.group);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching group:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (groupData) => {
    try {
      const response = await axios.post('https://dhasu-wallet-backend-route.onrender.com/api/groups', groupData);
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

  const updateGroup = async (groupId, groupData) => {
    try {
      const response = await axios.put(`https://dhasu-wallet-backend-route.onrender.com/api/groups/${groupId}`, groupData);
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

  const deleteGroup = async (groupId) => {
    try {
      await axios.delete(`https://dhasu-wallet-backend-route.onrender.com/api/groups/${groupId}`);
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

  const fetchGroupExpenses = async (groupId) => {
    try {
      const response = await axios.get(`https://dhasu-wallet-backend-route.onrender.com/api/groups/${groupId}/expenses`);
      setGroupExpenses(response.data.data.expenses);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching group expenses:', error);
      throw error;
    }
  };

  const createGroupExpense = async (groupId, expenseData) => {
    try {
      const response = await axios.post(`https://dhasu-wallet-backend-route.onrender.com/api/groups/${groupId}/expenses`, expenseData);
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
      const response = await axios.put(`https://dhasu-wallet-backend-route.onrender.com/api/groups/${groupId}/expenses/${expenseId}`, expenseData);
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
      await axios.delete(`https://dhasu-wallet-backend-route.onrender.com/api/groups/${groupId}/expenses/${expenseId}`);
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

    expenses.forEach(expense => {
      balances[expense.paidBy._id].balance += expense.amount;
      
      expense.splitBetween.forEach(split => {
        balances[split.userId._id].balance -= split.share;
      });
    });

    const balanceArray = Object.values(balances).filter(b => Math.abs(b.balance) > 0.01);
    
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
    groupMembers,
    groupExpenses,
    settlements,
    loading,
    fetchGroups,
    fetchGroupById,
    fetchGroupMembers,
    createGroup,
    updateGroup,
    deleteGroup,
    fetchGroupExpenses,
    createGroupExpense,
    updateGroupExpense,
    deleteGroupExpense,
    searchUsers,
    addMemberByEmail,
    removeMember,
    createAutoSplitExpense,
    fetchSettlements,
    calculateSettlements
  };

  return (
    <GroupContext.Provider value={value}>
      {children}
    </GroupContext.Provider>
  );
};


