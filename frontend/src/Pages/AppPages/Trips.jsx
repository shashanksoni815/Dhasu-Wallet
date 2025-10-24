import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
// import { useTrip } from '../../context/TripContext';
// import TripForm from '../../components/Trips/TripForm';
// import TripList from '../../components/Trips/TripList';
import { useTrip } from '../../Context/TripContext';
import TripForm from '../../Components/Trips/TripForm';
import TripList from '../../Components/Trips/TripList';

const Trips = () => {
  const {
    trips,
    loading,
    fetchTrips,
    createTrip,
    updateTrip,
    deleteTrip
  } = useTrip();

  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleCreateTrip = async (tripData) => {
    const result = await createTrip(tripData);
    if (result.success) {
      setShowForm(false);
    }
    return result;
  };

  const handleUpdateTrip = async (tripData) => {
    const result = await updateTrip(editingTrip._id, tripData);
    if (result.success) {
      setEditingTrip(null);
      setShowForm(false);
    }
    return result;
  };

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip? All associated expenses will also be deleted.')) {
      await deleteTrip(tripId);
    }
  };

  const handleEditTrip = (trip) => {
    setEditingTrip(trip);
    setShowForm(true);
  };

  const handleViewTrip = (tripId) => {
    navigate(`/app/trips/${tripId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trip Management</h1>
          <p className="text-gray-600 mt-1">
            Create and manage trips with shared expense tracking
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4" />
          <span>Create Trip</span>
        </button>
      </div>

      {/* Trip List */}
      <TripList
        trips={trips}
        loading={loading}
        onEdit={handleEditTrip}
        onDelete={handleDeleteTrip}
        onView={handleViewTrip}
      />

      {/* Trip Form Modal */}
      <TripForm
        trip={editingTrip}
        onSave={editingTrip ? handleUpdateTrip : handleCreateTrip}
        onCancel={() => {
          setShowForm(false);
          setEditingTrip(null);
        }}
        isOpen={showForm}
      />
    </div>
  );
};

export default Trips;