import React from 'react';
import { Edit2, Trash2, Users, Calendar, MapPin, ArrowRight } from 'lucide-react';

const TripList = ({ trips, loading, onEdit, onDelete, onView }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTripStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today < start) {
      return { status: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
    } else if (today > end) {
      return { status: 'Completed', color: 'bg-gray-100 text-gray-800' };
    } else {
      return { status: 'Active', color: 'bg-green-100 text-green-800' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">✈️</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No trips found</h3>
        <p className="text-gray-600">
          Create your first trip to start tracking group expenses
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips.map((trip) => {
        const status = getTripStatus(trip.startDate, trip.endDate);
        
        return (
          <div key={trip._id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">{trip.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                  {status.status}
                </span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(trip);
                  }}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit trip"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(trip._id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete trip"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            {trip.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{trip.description}</p>
            )}

            {/* Dates */}
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
            </div>

            {/* Members & Currency */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span>{trip.members.length} member{trip.members.length !== 1 ? 's' : ''}</span>
              </div>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {trip.currency}
              </span>
            </div>

            {/* View Details Button */}
            <button
              onClick={() => onView(trip._id)}
              className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
            >
              <span>View Details</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default TripList;