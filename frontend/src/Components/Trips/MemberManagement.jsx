// src/components/Trips/MemberManagement.jsx
import React, { useEffect, useState } from 'react';
import { useTrip } from '../../Context/TripContext';
import { useAuth } from '../../Context/AuthContext';
import { UserPlus, UserMinus, Search, X, Crown, RefreshCw, User, AlertCircle } from 'lucide-react'; // Changed Users to User

const MemberManagement = ({ trip, onMembersUpdated }) => {
  const { 
    tripMembers, 
    fetchTripMembers, 
    searchUsers, 
    addMemberByEmail, 
    removeMember,
    loading 
  } = useTrip();
  
  const { user: currentUser } = useAuth();
  
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState('member');
  const [membersLoading, setMembersLoading] = useState(true);
  const [error, setError] = useState('');

  // Load members when component mounts
  useEffect(() => {
    if (trip?._id) {
      loadMembers();
    }
  }, [trip?._id]);

  const loadMembers = async () => {
    try {
      setMembersLoading(true);
      setError('');
      const data = await fetchTripMembers(trip._id);
      setCurrentUserRole(data.currentUserRole);
    } catch (error) {
      console.error('Error loading members:', error);
      setError('Failed to load members');
    } finally {
      setMembersLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchEmail.trim()) return;
    
    setSearchLoading(true);
    try {
      const users = await searchUsers(searchEmail);
      setSearchResults(users);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setError('Failed to search users');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddMember = async (user) => {
    try {
      setError('');
      await addMemberByEmail(trip._id, user.email);
      setSearchEmail('');
      setSearchResults([]);
      setShowSearch(false);
      onMembersUpdated();
    } catch (error) {
      console.error('Add member error:', error);
      setError(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    
    try {
      setError('');
      await removeMember(trip._id, memberId);
      onMembersUpdated();
    } catch (error) {
      console.error('Remove member error:', error);
      setError(error.response?.data?.message || 'Failed to remove member');
    }
  };

  const isAdmin = currentUserRole === 'admin';

  // Loading state
  if (membersLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !tripMembers) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load members</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadMembers}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Safe access to tripMembers with fallback
  const members = tripMembers || [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={() => setError('')}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-900">Trip Members</h3>
          <button
            onClick={loadMembers}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Refresh members"
            disabled={membersLoading}
          >
            <RefreshCw className={`h-4 w-4 ${membersLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={membersLoading}
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Member</span>
          </button>
        )}
      </div>

      {/* Search Section */}
      {showSearch && isAdmin && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex space-x-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="Search users by email..."
                className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                disabled={searchLoading}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={searchLoading || !searchEmail.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {searchLoading ? 'Searching...' : 'Search'}
            </button>
            <button
              onClick={() => {
                setShowSearch(false);
                setSearchEmail('');
                setSearchResults([]);
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Search Results:</h4>
              {searchResults.map(user => (
                <div key={user._id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserPlus className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddMember(user)}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 text-sm"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}

          {searchResults.length === 0 && searchEmail && !searchLoading && (
            <div className="text-center py-4 text-gray-500">
              <User className="h-8 w-8 mx-auto mb-2 text-gray-400" /> {/* Fixed: Users to User */}
              <p>No users found with this email</p>
            </div>
          )}
        </div>
      )}

      {/* Members List */}
      <div className="space-y-3">
        {members.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <User className="h-12 w-12 mx-auto mb-3 text-gray-400" /> {/* Fixed: Users to User */}
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Members</h4>
            <p>Add members to start tracking shared expenses</p>
          </div>
        ) : (
          members.map((member) => (
            <div key={member.userId._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  {member.role === 'admin' ? (
                    <Crown className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <UserPlus className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-900">{member.userId.name}</p>
                    {member.role === 'admin' && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Admin</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{member.userId.email}</p>
                  {member.joinedAt && (
                    <p className="text-xs text-gray-400">
                      Joined: {new Date(member.joinedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              
              {isAdmin && member.role !== 'admin' && (
                <button
                  onClick={() => handleRemoveMember(member.userId._id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Remove member"
                  disabled={membersLoading}
                >
                  <UserMinus className="h-4 w-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MemberManagement;

// const MemberManagement = ({ trip, onMembersUpdated }) => {
//   const { 
//     tripMembers, 
//     fetchTripMembers, 
//     searchUsers, 
//     addMemberByEmail, 
//     removeMember,
//     loading
//   } = useTrip();

//   const { user: currentUser } = useAuth();
  
//   const [searchEmail, setSearchEmail] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [showSearch, setShowSearch] = useState(false);
//   const [currentUserRole, setCurrentUserRole] = useState('member');
//   const [membersLoading, setMembersLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (trip?._id) {
//       loadMembers();
//     }
//   }, [trip?._id]);

//   const loadMembers = async () => {
//     try {
//       setMembersLoading(true);
//       setError('');
//       const data = await fetchTripMembers(trip._id);
//       setCurrentUserRole(data.currentUserRole);
//     } catch (error) {
//       console.error('Error loading members:', error);
//       setError('Failed to load members');
//     } finally {
//       setMembersLoading(false);
//     }
//   };


//   const handleSearch = async () => {
//     if (!searchEmail.trim()) return;
    
//     setSearchLoading(true);
//     try {
//       const user = await searchUsers(searchEmail);
//       setSearchResults(user);
//     } catch (error) {
//       console.error('Search error:', error);
//       setSearchResults([]);
//       setError('Failed to search users');
//     } finally {
//       setSearchLoading(false);
//     };
//   }
//   const handleAddMember = async (user) => {
//     try {
//       setError('');
//       await addMemberByEmail(trip._id, user.email);
//       setSearchEmail('');
//       setSearchResults([]);
//       setShowSearch(false);
//       onMembersUpdated();
//     } catch (error) {
//       console.error('Add member error:', error);
//       setError(error.response?.data?.message || 'Failed to add member');
//     }
//   };

//   const handleRemoveMember = async (memberId) => {
//     if (!window.confirm('Are you sure you want to remove this member?')) return;
    
//     try {
//       setError('')
//       await removeMember(trip._id, memberId);
//       onMembersUpdated();
//     } catch (error) {
//       console.error('Remove member error:', error);
//       setError(error.response?.data?.message || 'Failed to remove member');
//     }
//   };

//   const isAdmin = currentUserRole === 'admin';

//   // Loading state
//   if (membersLoading) {
//     return (
//       <div className="bg-white rounded-lg border border-gray-200 p-6">
//         <div className="flex items-center justify-center h-32">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error && !tripMembers) {
//     return (
//       <div className="bg-white rounded-lg border border-gray-200 p-6">
//         <div className="text-center py-8">
//           <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load members</h3>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={loadMembers}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Safe access to tripMembers with fallback
//   const members = tripMembers || [];

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 p-6">
//       {/* Error Message */}
//       {error && (
//         <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
//           <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
//           <p className="text-sm text-red-600">{error}</p>
//           <button
//             onClick={() => setError('')}
//             className="ml-auto text-red-600 hover:text-red-800"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//       )}

//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center space-x-3">
//           <h3 className="text-lg font-semibold text-gray-900">Trip Members</h3>
//           <button
//             onClick={loadMembers}
//             className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
//             title="Refresh members"
//             disabled={membersLoading}
//           >
//             <RefreshCw className={`h-4 w-4 ${membersLoading ? 'animate-spin' : ''}`} />
//           </button>
//         </div>
//         {isAdmin && (
//           <button
//             onClick={() => setShowSearch(!showSearch)}
//             className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
//             disabled={membersLoading}
//           >
//             <UserPlus className="h-4 w-4" />
//             <span>Add Member</span>
//           </button>
//         )}
//       </div>

//       {/* Search Section */}
//       {showSearch && isAdmin && (
//         <div className="mb-6 p-4 bg-gray-50 rounded-lg">
//           <div className="flex space-x-2 mb-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <input
//                 type="email"
//                 value={searchEmail}
//                 onChange={(e) => setSearchEmail(e.target.value)}
//                 placeholder="Search users by email..."
//                 className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//                 disabled={searchLoading}
//               />
//             </div>
//             <button
//               onClick={handleSearch}
//               disabled={searchLoading || !searchEmail.trim()}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
//             >
//               {searchLoading ? 'Searching...' : 'Search'}
//             </button>
//             <button
//               onClick={() => {
//                 setShowSearch(false);
//                 setSearchEmail('');
//                 setSearchResults([]);
//               }}
//               className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
//             >
//               <X className="h-4 w-4" />
//             </button>
//           </div>

//           {/* Search Results */}
//           {searchResults.length > 0 && (
//             <div className="space-y-2">
//               <h4 className="font-medium text-gray-700">Search Results:</h4>
//               {searchResults.map(user => (
//                 <div key={user._id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                       <UserPlus className="h-4 w-4 text-blue-600" />
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">{user.name}</p>
//                       <p className="text-sm text-gray-500">{user.email}</p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => handleAddMember(user)}
//                     className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 text-sm"
//                   >
//                     Add
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}

//           {searchResults.length === 0 && searchEmail && !searchLoading && (
//             <div className="text-center py-4 text-gray-500">
//               <User className="h-8 w-8 mx-auto mb-2 text-gray-400" />
//               <p>No users found with this email</p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Members List */}
//       <div className="space-y-3">
//         {members.length === 0 ? (
//           <div className="text-center py-8 text-gray-500">
//             <User className="h-12 w-12 mx-auto mb-3 text-gray-400" />
//             <h4 className="text-lg font-semibold text-gray-900 mb-2">No Members</h4>
//             <p>Add members to start tracking shared expenses</p>
//           </div>
//         ) : (
//           members.map((member) => (
//             <div key={member.userId._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                   {member.role === 'admin' ? (
//                     <Crown className="h-5 w-5 text-yellow-600" />
//                   ) : (
//                     <UserPlus className="h-5 w-5 text-blue-600" />
//                   )}
//                 </div>
//                 <div>
//                   <div className="flex items-center space-x-2">
//                     <p className="font-medium text-gray-900">{member.userId.name}</p>
//                     {member.role === 'admin' && (
//                       <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Admin</span>
//                     )}
//                   </div>
//                   <p className="text-sm text-gray-500">{member.userId.email}</p>
//                   {member.joinedAt && (
//                     <p className="text-xs text-gray-400">
//                       Joined: {new Date(member.joinedAt).toLocaleDateString()}
//                     </p>
//                   )}
//                 </div>
//               </div>
              
//               {isAdmin && member.role !== 'admin' && (
//                 <button
//                   onClick={() => handleRemoveMember(member.userId._id)}
//                   className="p-2 text-gray-400 hover:text-red-600 transition-colors"
//                   title="Remove member"
//                   disabled={membersLoading}
//                 >
//                   <UserMinus className="h-4 w-4" />
//                 </button>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default MemberManagement;