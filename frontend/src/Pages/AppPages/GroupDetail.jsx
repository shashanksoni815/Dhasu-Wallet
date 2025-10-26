// import GroupExpenseForm from '../../Components/Groups/GroupExpenseForm';
// src/pages/App/GroupDetail.jsx (Updated)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Users, DollarSign, Calculator, UserPlus } from 'lucide-react';
import { useGroup } from '../../Context/GroupContext';
import ExpenseList from '../../Components/Expense/ExpensesList';
import EnhancedGroupExpenseForm from '../../Components/Groups/EnanceGroupExpenseForm';
import GroupMemberManagement from '../../Components/Groups/GroupMemberManagement';
import GroupSettlementsDisplay from '../../Components/Groups/GroupSettlementDisplay';

const GroupDetail = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const {
    currentGroup,
    groupExpenses,
    loading,
    fetchGroupById,
    fetchGroupExpenses,
    createAutoSplitExpense,
    updateGroupExpense,
    deleteGroupExpense
  } = useGroup();

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [activeTab, setActiveTab] = useState('expenses');

  useEffect(() => {
    if (groupId) {
      fetchGroupById(groupId);
      fetchGroupExpenses(groupId);
    }
  }, [groupId]);

  const handleCreateExpense = async (expenseData) => {
    const result = await createAutoSplitExpense(groupId, expenseData);
    if (result.success) {
      setShowExpenseForm(false);
      fetchGroupExpenses(groupId);
    }
    return result;
  };

  const handleUpdateExpense = async (expenseData) => {
    const result = await updateGroupExpense(groupId, editingExpense._id, expenseData);
    if (result.success) {
      setEditingExpense(null);
      setShowExpenseForm(false);
      fetchGroupExpenses(groupId);
    }
    return result;
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await deleteGroupExpense(groupId, expenseId);
      fetchGroupExpenses(groupId);
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleMembersUpdated = () => {
    fetchGroupById(groupId);
    fetchGroupExpenses(groupId);
  };

  const totalExpenses = groupExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentGroup) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Group not found</h2>
        <button onClick={() => navigate('/app/groups')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Back to Groups
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/app/groups')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentGroup.name}</h1>
            <p className="text-gray-600">{currentGroup.description}</p>
          </div>
        </div>
        <button
          onClick={() => setShowExpenseForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Group Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Members</p>
              <p className="text-2xl font-bold text-gray-900">{currentGroup.members.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">${totalExpenses.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <Calculator className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Expenses Count</p>
              <p className="text-2xl font-bold text-gray-900">{groupExpenses.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Settlements</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentGroup.settlements?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['expenses', 'members', 'settlements'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'expenses' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Expenses</h3>
            <ExpenseList
              expenses={groupExpenses}
              loading={loading}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          </div>
        )}

        {activeTab === 'members' && (
          <GroupMemberManagement 
            group={currentGroup} 
            onMembersUpdated={handleMembersUpdated} 
          />
        )}

        {activeTab === 'settlements' && (
          <GroupSettlementsDisplay group={currentGroup} />
        )}
      </div>

      {/* Expense Form Modal */}
      <EnhancedGroupExpenseForm
        group={currentGroup}
        expense={editingExpense}
        onSave={editingExpense ? handleUpdateExpense : handleCreateExpense}
        onCancel={() => {
          setShowExpenseForm(false);
          setEditingExpense(null);
        }}
        isOpen={showExpenseForm}
      />
    </div>
  );
};

export default GroupDetail;




// const GroupDetail = () => {
//   const { groupId } = useParams();
//   const navigate = useNavigate();
//   const {
//     currentGroup,
//     groupExpenses,
//     loading,
//     fetchGroupById,
//     fetchGroupExpenses,
//     createGroupExpense,
//     updateGroupExpense,
//     deleteGroupExpense,
//     calculateSettlements
//   } = useGroup();

//   const [showExpenseForm, setShowExpenseForm] = useState(false);
//   const [editingExpense, setEditingExpense] = useState(null);
//   const [settlements, setSettlements] = useState([]);

//   useEffect(() => {
//     if (groupId) {
//       fetchGroupById(groupId);
//       fetchGroupExpenses(groupId);
//     }
//   }, [groupId]);

//   useEffect(() => {
//     if (groupExpenses.length > 0) {
//       const calculatedSettlements = calculateSettlements(groupExpenses);
//       setSettlements(calculatedSettlements);
//     } else {
//       setSettlements([]);
//     }
//   }, [groupExpenses]);

//   const handleCreateExpense = async (expenseData) => {
//     const result = await createGroupExpense(groupId, expenseData);
//     return result;
//   };

//   const handleUpdateExpense = async (expenseData) => {
//     const result = await updateGroupExpense(groupId, editingExpense._id, expenseData);
//     if (result.success) {
//       setEditingExpense(null);
//     }
//     return result;
//   };

//   const handleDeleteExpense = async (expenseId) => {
//     if (window.confirm('Are you sure you want to delete this expense?')) {
//       await deleteGroupExpense(groupId, expenseId);
//     }
//   };

//   const handleEditExpense = (expense) => {
//     setEditingExpense(expense);
//     setShowExpenseForm(true);
//   };

//   const totalExpenses = groupExpenses.reduce((sum, exp) => sum + exp.amount, 0);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (!currentGroup) {
//     return (
//       <div className="text-center py-12">
//         <h2 className="text-xl font-semibold text-gray-900 mb-2">Group not found</h2>
//         <button onClick={() => navigate('/app/groups')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
//           Back to Groups
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={() => navigate('/app/groups')}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <ArrowLeft className="h-5 w-5" />
//           </button>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">{currentGroup.name}</h1>
//             <p className="text-gray-600">{currentGroup.description}</p>
//           </div>
//         </div>
//         <div className="flex space-x-3">
//           <button className="flex items-center space-x-2 bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300">
//             <UserPlus className="h-4 w-4" />
//             <span>Add Member</span>
//           </button>
//           <button
//             onClick={() => setShowExpenseForm(true)}
//             className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//           >
//             <Plus className="h-4 w-4" />
//             <span>Add Expense</span>
//           </button>
//         </div>
//       </div>

//       {/* Group Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <div className="flex items-center space-x-3">
//             <Users className="h-8 w-8 text-blue-600" />
//             <div>
//               <p className="text-sm font-medium text-gray-600">Members</p>
//               <p className="text-2xl font-bold text-gray-900">{currentGroup.members.length}</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <div className="flex items-center space-x-3">
//             <DollarSign className="h-8 w-8 text-green-600" />
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Expenses</p>
//               <p className="text-2xl font-bold text-gray-900">${totalExpenses.toFixed(2)}</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <div className="flex items-center space-x-3">
//             <Calculator className="h-8 w-8 text-purple-600" />
//             <div>
//               <p className="text-sm font-medium text-gray-600">Expenses Count</p>
//               <p className="text-2xl font-bold text-gray-900">{groupExpenses.length}</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <div className="flex items-center space-x-3">
//             <Users className="h-8 w-8 text-blue-600" />
//             <div>
//               <p className="text-sm font-medium text-gray-600">Settlements</p>
//               <p className="text-2xl font-bold text-gray-900">{settlements.length}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Members List */}
//       <div className="bg-white rounded-lg border border-gray-200 p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Members</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {currentGroup.members.map((member) => (
//             <div key={member.userId._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                   <Users className="h-5 w-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-900">{member.userId.name}</p>
//                   <p className="text-sm text-gray-500">{member.userId.email}</p>
//                 </div>
//               </div>
//               <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                 member.role === 'admin' 
//                   ? 'bg-purple-100 text-purple-800' 
//                   : 'bg-gray-100 text-gray-600'
//               }`}>
//                 {member.role}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Settlements */}
//       {settlements.length > 0 && (
//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Settlements Needed</h3>
//           <div className="space-y-3">
//             {settlements.map((settlement, index) => (
//               <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//                 <div className="flex items-center space-x-3">
//                   <span className="font-medium text-gray-900">{settlement.from.name}</span>
//                   <span className="text-gray-500">→</span>
//                   <span className="font-medium text-gray-900">{settlement.to.name}</span>
//                 </div>
//                 <span className="font-bold text-yellow-700">
//                   ${settlement.amount.toFixed(2)}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Expenses List */}
//       <div>
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Expenses</h3>
//         <ExpenseList
//           expenses={groupExpenses}
//           loading={loading}
//           onEdit={handleEditExpense}
//           onDelete={handleDeleteExpense}
//         />
//       </div>

//       {/* Expense Form Modal */}
//       <GroupExpenseForm
//         group={currentGroup}
//         expense={editingExpense}
//         onSave={editingExpense ? handleUpdateExpense : handleCreateExpense}
//         onCancel={() => {
//           setShowExpenseForm(false);
//           setEditingExpense(null);
//         }}
//         isOpen={showExpenseForm}
//       />
//     </div>
//   );
// };

// export default GroupDetail;


