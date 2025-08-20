import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);

  // Memoize API endpoints to prevent recreation on every render
  const API_ENDPOINTS = useMemo(() => ({
    getContacts: 'http://127.0.0.1:8000/api/contact',
    getContact: (id) => `http://127.0.0.1:8000/api/contact/${id}`,
    deleteContact: (id) => `http://127.0.0.1:8000/api/contact/${id}`
  }), []);

  // GET http://127.0.0.1:8000/api/contact
  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_ENDPOINTS.getContacts);
      
      if (Array.isArray(response.data)) {
        setContacts(response.data);
      } else if (response.data && typeof response.data === 'object') {
        setContacts([response.data]);
      } else {
        setContacts([]);
        console.warn('Unexpected API response format:', response.data);
      }
    } catch (err) {
      setError('Failed to fetch contacts. Please try again.');
      console.error('Error fetching contacts:', err);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, [API_ENDPOINTS]);

  // GET http://127.0.0.1:8000/api/contact/{id}
  const showContact = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_ENDPOINTS.getContact(id));
      
      if (response.data && response.data.status === 'success' && response.data.data) {
        const contactData = response.data.data;
        setCurrentContact({
          id: contactData.id,
          name: contactData.name || 'No name provided',
          email: contactData.email || 'No email provided',
          message: contactData.message || 'No message provided',
          created_at: contactData.created_at
        });
        setShowModal(true);
      } else {
        setError(response.data.message || 'Contact data not found in response');
      }
    } catch (err) {
      setError('Failed to fetch contact details. Please try again.');
      console.error('Error fetching contact:', err);
    } finally {
      setLoading(false);
    }
  }, [API_ENDPOINTS]);

  // DELETE http://127.0.0.1:8000/api/contact/{id}
  const deleteContact = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact message?')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await axios.delete(API_ENDPOINTS.deleteContact(id));
      window.alert('Contact message deleted successfully!');
      fetchContacts();
    } catch (err) {
      setError('Failed to delete contact message. Please try again.');
      console.error('Error deleting contact:', err);
    } finally {
      setLoading(false);
    }
  }, [API_ENDPOINTS, fetchContacts]);

  // Format date
  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'No date available';
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setShowModal(false);
    setCurrentContact(null);
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Contact Messages</h1>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 sm:mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}
        
        {loading && (
          <div className="text-center py-6 sm:py-8">
            <span className="text-sm sm:text-base text-gray-600">Loading contacts...</span>
          </div>
        )}

        {/* Contacts Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {contacts.length > 0 ? (
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
                    Message Preview
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Date
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {contact.name || 'No name provided'}
                      </div>
                      {/* Stacked layout for mobile */}
                      <div className="mt-2 text-sm text-gray-500 sm:hidden">
                        <p><span className="font-medium">Email:</span> {contact.email || 'No email provided'}</p>
                        <p className="mt-1 truncate max-w-[200px]"><span className="font-medium">Message:</span> {contact.message || 'No message provided'}</p>
                        <p className="mt-1"><span className="font-medium">Date:</span> {formatDate(contact.created_at)}</p>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-sm text-gray-500">
                        {contact.email || 'No email provided'}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                      <div className="text-sm text-gray-500 truncate max-w-[200px] md:max-w-xs">
                        {contact.message || 'No message provided'}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-sm text-gray-500">
                        {formatDate(contact.created_at)}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => showContact(contact.id)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() => deleteContact(contact.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            !loading && (
              <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                No contact messages found
              </div>
            )
          )}
        </div>

        {/* Contact Detail Modal */}
        {showModal && currentContact && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">Contact Details</h2>
                  <button 
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm sm:text-base text-gray-900">
                      {currentContact.name || 'No name provided'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm sm:text-base text-gray-900">
                      {currentContact.email || 'No email provided'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <p className="mt-1 text-sm sm:text-base text-gray-900">
                      {formatDate(currentContact.created_at)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Message</label>
                    <p className="mt-1 text-sm sm:text-base text-gray-900 whitespace-pre-line">
                      {currentContact.message || 'No message provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsPage;