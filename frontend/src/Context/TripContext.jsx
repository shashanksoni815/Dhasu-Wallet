import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const TripContext = createContext();

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within an TripProvider');
  }
  return context;
};

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [tripMembers, setTripMembers] = useState([]);
  const [tripExpenses, setTripExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [settlements, setSettlements] = useState([]);

  // Search users by email
  const searchUsers = async (email) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/search?email=${email}`);
      return response.data.data.users;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  };


  // Get trip members from database
  const fetchTripMembers = async (tripId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/trips/${tripId}/members`);
      setTripMembers(response.data.data.members);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching trip members:', error);
      throw error;
    }
  }; 

  // Add member to trip by email
  const addMemberByEmail = async (tripId, email) => {
    try {
      const response = await axios.post(`http://localhost:8080/api/trips/${tripId}/members/email`, { email });
      setTripMembers(response.data.data.members);
      return response.data;
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  };

  // Remove member from trip
  const removeMember = async (tripId, memberId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/trips/${tripId}/members/${memberId}`);
      setTripMembers(response.data.data.members);
      return response.data;
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  };

  // Create expense with auto-split
  const createAutoSplitExpense = async (tripId, expenseData) => {
    try {
      const response = await axios.post(`http://localhost:8080/api/trips/${tripId}/expenses/auto-split`, expenseData);
      setTripExpenses(prev => [response.data.data.expense, ...prev]);
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
  const fetchSettlements = async (tripId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/trips/${tripId}/settlements`);
      setSettlements(response.data.data.settlements);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching settlements:', error);
      throw error;
    }
  }

  // Fetch all trips for user
  const fetchTrips = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/trips');
      setTrips(response.data.data.trips);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching trips:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch single trip details
  const fetchTripById = async (tripId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/trips/${tripId}`);
      setCurrentTrip(response.data.data.trip);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching trip:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create new trip
  const createTrip = async (tripData) => {
    try {
      const response = await axios.post('http://localhost:8080/api/trips', tripData);
      setTrips(prev => [response.data.data.trip, ...prev]);
      return { success: true, data: response.data.data.trip };
    } catch (error) {
      console.error('Error creating trip:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create trip' 
      };
    }
  };

  // Update trip
  const updateTrip = async (tripId, tripData) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/trips/${tripId}`, tripData);
      setTrips(prev => prev.map(trip => 
        trip._id === tripId ? response.data.data.trip : trip
      ));
      if (currentTrip && currentTrip._id === tripId) {
        setCurrentTrip(response.data.data.trip);
      }
      return { success: true, data: response.data.data.trip };
    } catch (error) {
      console.error('Error updating trip:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update trip' 
      };
    }
  };

  // Delete trip
  const deleteTrip = async (tripId) => {
    try {
      await axios.delete(`http://localhost:8080/api/trips/${tripId}`);
      setTrips(prev => prev.filter(trip => trip._id !== tripId));
      if (currentTrip && currentTrip._id === tripId) {
        setCurrentTrip(null);
      }
      return { success: true };
    } catch (error) {
      console.error('Error deleting trip:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete trip' 
      };
    }
  };

  // Trip Expenses Management
  const fetchTripExpenses = async (tripId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/trips/${tripId}/expenses`);
      setTripExpenses(response.data.data.expenses);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching trip expenses:', error);
      throw error;
    }
  };

  const createTripExpense = async (tripId, expenseData) => {
    try {
      const response = await axios.post(`http://localhost:8080/api/trips/${tripId}/expenses`, expenseData);
      setTripExpenses(prev => [response.data.data.expense, ...prev]);
      return { success: true, data: response.data.data.expense };
    } catch (error) {
      console.error('Error creating trip expense:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create trip expense' 
      };
    }
  };

  const updateTripExpense = async (tripId, expenseId, expenseData) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/trips/${tripId}/expenses/${expenseId}`, expenseData);
      setTripExpenses(prev => prev.map(exp => 
        exp._id === expenseId ? response.data.data.expense : exp
      ));
      return { success: true, data: response.data.data.expense };
    } catch (error) {
      console.error('Error updating trip expense:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update trip expense' 
      };
    }
  };

  const deleteTripExpense = async (tripId, expenseId) => {
    try {
      await axios.delete(`http://localhost:8080/api/trips/${tripId}/expenses/${expenseId}`);
      setTripExpenses(prev => prev.filter(exp => exp._id !== expenseId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting trip expense:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete trip expense' 
      };
    }
  };

  // Calculate settlements
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
    trips,
    currentTrip,
    tripMembers,
    tripExpenses,
    settlements,
    loading,
    fetchTrips,
    fetchTripById,
    fetchTripMembers,
    createTrip,
    updateTrip,
    deleteTrip,
    fetchTripExpenses,
    createTripExpense,
    updateTripExpense,
    deleteTripExpense,
    searchUsers,
    addMemberByEmail,
    removeMember,
    createAutoSplitExpense,
    fetchSettlements,
    calculateSettlements
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
};