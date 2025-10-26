// src/components/Groups/GroupSettlementsDisplay.jsx
import React, { useState, useEffect } from 'react';
import { useGroup } from '../../Context/GroupContext';
import { TrendingUp, TrendingDown, Calculator, RefreshCw } from 'lucide-react';

const GroupSettlementsDisplay = ({ group }) => {
  const { settlements, fetchSettlements, loading } = useGroup();
  const [balanceSummary, setBalanceSummary] = useState([]);

  const loadSettlements = async () => {
    try {
      const data = await fetchSettlements(group._id);
      setBalanceSummary(data.balanceSummary || []);
    } catch (error) {
      console.error('Error loading settlements:', error);
    }
  };

  useEffect(() => {
    if (group) {
      loadSettlements();
    }
  }, [group]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Settlements</h3>
        <button
          onClick={loadSettlements}
          className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Balance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {balanceSummary.map((balance) => (
          <div key={balance.user.id} className={`p-4 rounded-lg border ${
            balance.balance > 0 
              ? 'bg-green-50 border-green-200' 
              : balance.balance < 0 
              ? 'bg-red-50 border-red-200' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                balance.balance > 0 
                  ? 'bg-green-100 text-green-600' 
                  : balance.balance < 0 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {balance.balance > 0 ? (
                  <TrendingUp className="h-5 w-5" />
                ) : balance.balance < 0 ? (
                  <TrendingDown className="h-5 w-5" />
                ) : (
                  <Calculator className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{balance.user.name}</p>
                <p className={`text-lg font-bold ${
                  balance.balance > 0 
                    ? 'text-green-600' 
                    : balance.balance < 0 
                    ? 'text-red-600' 
                    : 'text-gray-600'
                }`}>
                  ${Math.abs(balance.balance).toFixed(2)}
                  {balance.balance > 0 ? ' (owed)' : balance.balance < 0 ? ' (owes)' : ' (settled)'}
                </p>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 space-y-1">
              <p>Paid: ${balance.totalPaid.toFixed(2)}</p>
              <p>Owed: ${balance.totalOwed.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Settlements Needed */}
      {settlements.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h4 className="font-semibold text-yellow-900 mb-4 flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Settlements Needed
          </h4>
          <div className="space-y-3">
            {settlements.map((settlement, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-300">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  </div>
                  <span className="font-medium text-gray-900">{settlement.from.name}</span>
                  <span className="text-gray-400">→</span>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-900">{settlement.to.name}</span>
                </div>
                <span className="font-bold text-yellow-700">
                  ${settlement.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {settlements.length === 0 && balanceSummary.length > 0 && (
        <div className="text-center py-8 bg-green-50 rounded-lg border border-green-200">
          <Calculator className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-green-800 mb-2">All Settled Up! 🎉</h4>
          <p className="text-green-600">No settlements needed at this time.</p>
        </div>
      )}
    </div>
  );
};

export default GroupSettlementsDisplay;