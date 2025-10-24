import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useGroup } from '../../Context/GroupContext';
import GroupForm from '../../Components/Groups/GroupForm';
import GroupList from '../../Components/Groups/GroupList';

const Groups = () => {
  const {
    groups,
    loading,
    fetchGroups,
    createGroup,
    updateGroup,
    deleteGroup
  } = useGroup();

  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async (groupData) => {
    const result = await createGroup(groupData);
    if (result.success) {
      setShowForm(false);
    }
    return result;
  };

  const handleUpdateGroup = async (groupData) => {
    const result = await updateGroup(editingGroup._id, groupData);
    if (result.success) {
      setEditingGroup(null);
      setShowForm(false);
    }
    return result;
  };

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm('Are you sure you want to delete this group? All associated expenses will also be deleted.')) {
      await deleteGroup(groupId);
    }
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setShowForm(true);
  };

  const handleViewGroup = (groupId) => {
    navigate(`/app/groups/${groupId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Group Management</h1>
          <p className="text-gray-600 mt-1">
            Create and manage groups for shared expense tracking
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4" />
          <span>Create Group</span>
        </button>
      </div>

      {/* Group List */}
      <GroupList
        groups={groups}
        loading={loading}
        onEdit={handleEditGroup}
        onDelete={handleDeleteGroup}
        onView={handleViewGroup}
      />

      {/* Group Form Modal */}
      <GroupForm
        group={editingGroup}
        onSave={editingGroup ? handleUpdateGroup : handleCreateGroup}
        onCancel={() => {
          setShowForm(false);
          setEditingGroup(null);
        }}
        isOpen={showForm}
      />
    </div>
  );
};

export default Groups;