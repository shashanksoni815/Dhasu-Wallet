import React from 'react';
import { Edit2, Trash2, Users, MessageSquare, ArrowRight, User } from 'lucide-react';

const GroupList = ({ groups, loading, onEdit, onDelete, onView }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">👥</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No groups found</h3>
        <p className="text-gray-600">
          Create your first group to start tracking shared expenses
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => (
        <div key={group._id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg mb-1">{group.name}</h3>
              {group.description && (
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  <span className="line-clamp-1">{group.description}</span>
                </div>
              )}
            </div>
            <div className="flex space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(group);
                }}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title="Edit group"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(group._id);
                }}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete group"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Members */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Members</span>
              <span className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {group.members.length}
              </span>
            </div>
            <div className="flex -space-x-2">
              {group.members.slice(0, 5).map((member, index) => (
                <div
                  key={member.userId._id}
                  className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center border-2 border-white"
                  title={member.userId.name}
                >
                  <User className="h-4 w-4 text-blue-600" />
                </div>
              ))}
              {group.members.length > 5 && (
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white text-xs font-medium text-gray-600">
                  +{group.members.length - 5}
                </div>
              )}
            </div>
          </div>

          {/* Member Roles */}
          <div className="space-y-1 mb-4">
            {group.members.slice(0, 3).map((member) => (
              <div key={member.userId._id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{member.userId.name}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  member.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {member.role}
                </span>
              </div>
            ))}
            {group.members.length > 3 && (
              <div className="text-xs text-gray-500 text-center">
                and {group.members.length - 3} more members
              </div>
            )}
          </div>

          {/* View Details Button */}
          <button
            onClick={() => onView(group._id)}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default GroupList;