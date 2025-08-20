import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaEye, FaPlus, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import UserModal from './Component/UserModal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/signup');
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleView = (user) => {
    setCurrentUser(user);
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:8000/api/signup/${userId}`);
        fetchUsers();
        alert('User deleted successfully');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleAddUser = () => {
    setCurrentUser(null);
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleSubmit = async (userData) => {
    try {
      if (isEditing && currentUser) {
        const updateData = { ...userData };
        if (!updateData.password) {
          delete updateData.password;
          delete updateData.password_confirmation;
        }
        await axios.put(`http://localhost:8000/api/signup/${currentUser.id}`, updateData);
        alert('User updated successfully!');
      } else {
        if (userData.password !== userData.password_confirmation) {
          alert("Password and confirmation don't match!");
          return;
        }
        await axios.post('http://localhost:8000/api/signup', userData);
        alert('User created successfully!');
      }
      fetchUsers();
      setModalOpen(false);
    } catch (err) {
      const errorMsg = err.response?.data?.errors?.password?.[0] || 
                      err.response?.data?.message || 
                      'Operation failed';
      alert(`Error: ${errorMsg}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-3xl sm:text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded text-sm sm:text-base">
        {error}
        <button onClick={fetchUsers} className="ml-2 text-blue-500 hover:text-blue-700">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow min-h-screen">
      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        user={currentUser}
        isEditing={isEditing}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Users</h2>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition w-full sm:w-auto flex items-center justify-center gap-2 text-sm sm:text-base"
          onClick={handleAddUser}
        >
          <FaPlus /> Add New User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Email
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Role
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 sm:px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  {/* Show Email and Role on mobile in a stacked layout */}
                  <div className="mt-2 text-sm text-gray-500 sm:hidden">
                    <p><span className="font-medium">Email:</span> {user.email}</p>
                    <p className="mt-1"><span className="font-medium">Role:</span> {user.role}</p>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  <div className="text-sm text-gray-500 capitalize">{user.role}</div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => handleView(user)}
                      className="text-blue-500 hover:text-blue-700 flex items-center px-2 py-1 rounded hover:bg-blue-50 transition text-sm"
                    >
                      <FaEye className="mr-1" /> View
                    </button>
                    <button 
                      onClick={() => handleEdit(user)}
                      className="text-green-500 hover:text-green-700 flex items-center px-2 py-1 rounded hover:bg-green-50 transition text-sm"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="text-red-500 hover:text-red-700 flex items-center px-2 py-1 rounded hover:bg-red-50 transition text-sm"
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;