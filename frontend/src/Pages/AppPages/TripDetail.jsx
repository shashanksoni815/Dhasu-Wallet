import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Users, DollarSign, Calculator } from 'lucide-react';
import { useTrip } from '../../Context/TripContext';
// import TripExpenseForm from '../../components/Trips/TripExpenseForm';
// import ExpenseList from '../../components/Expenses/ExpenseList';
import TripExpenseForm from '../../Components/Trips/TripExpenses';
import ExpenseList from '../../Components/Expense/ExpensesList';

const TripDetail = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const {
    currentTrip,
    tripExpenses,
    loading,
    fetchTripById,
    fetchTripExpenses,
    createTripExpense,
    updateTripExpense,
    deleteTripExpense,
    calculateSettlements
  } = useTrip();

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [settlements, setSettlements] = useState([]);

  useEffect(() => {
    if (tripId) {
      fetchTripById(tripId);
      fetchTripExpenses(tripId);
    }
  }, [tripId]);

  useEffect(() => {
    if (tripExpenses.length > 0) {
      const calculatedSettlements = calculateSettlements(tripExpenses);
      setSettlements(calculatedSettlements);
    } else {
      setSettlements([]);
    }
  }, [tripExpenses]);

  const handleCreateExpense = async (expenseData) => {
    const result = await createTripExpense(tripId, expenseData);
    return result;
  };

  const handleUpdateExpense = async (expenseData) => {
    const result = await updateTripExpense(tripId, editingExpense._id, expenseData);
    if (result.success) {
      setEditingExpense(null);
    }
    return result;
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await deleteTripExpense(tripId, expenseId);
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const totalExpenses = tripExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentTrip) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Trip not found</h2>
        <button onClick={() => navigate('/app/trips')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Back to Trips
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
            onClick={() => navigate('/app/trips')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentTrip.name}</h1>
            <p className="text-gray-600">{currentTrip.description}</p>
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

      {/* Trip Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Members</p>
              <p className="text-2xl font-bold text-gray-900">{currentTrip.members.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentTrip.currency} {totalExpenses.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <Calculator className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Expenses Count</p>
              <p className="text-2xl font-bold text-gray-900">{tripExpenses.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Settlements</p>
              <p className="text-2xl font-bold text-gray-900">{settlements.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settlements */}
      {settlements.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Settlements Needed</h3>
          <div className="space-y-3">
            {settlements.map((settlement, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-900">{settlement.from.name}</span>
                  <span className="text-gray-500">→</span>
                  <span className="font-medium text-gray-900">{settlement.to.name}</span>
                </div>
                <span className="font-bold text-yellow-700">
                  {currentTrip.currency} {settlement.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expenses List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Expenses</h3>
        <ExpenseList
          expenses={tripExpenses}
          loading={loading}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
        />
      </div>

      {/* Expense Form Modal */}
      <TripExpenseForm
        trip={currentTrip}
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

export default TripDetail;