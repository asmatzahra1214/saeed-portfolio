import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

const HomeContentForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    button1_text: '',
    button1_link: '',
    show_button1: false,
    button2_text: '',
    button2_link: '',
    show_button2: false,
    simple_link_text: '',
    simple_link_url: '',
    show_simple_link: false,
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setValidationErrors({});

    try {
      // Create FormData object
      const data = new FormData();
    // Append all form data
data.append('title', formData.title);
data.append('description', formData.description);
data.append('button1_text', formData.button1_text || '');
data.append('button1_link', formData.button1_link || '');
data.append('show_button1', formData.show_button1 ? 1 : 0);
data.append('button2_text', formData.button2_text || '');
data.append('button2_link', formData.button2_link || '');
data.append('show_button2', formData.show_button2 ? 1 : 0);
data.append('simple_link_text', formData.simple_link_text || '');
data.append('simple_link_url', formData.simple_link_url || '');
data.append('show_simple_link', formData.show_simple_link ? 1 : 0);

if (formData.image) {
  data.append('image', formData.image);
}


      // Print data to console before sending
      console.log('Form data to be sent:');
      for (let [key, value] of data.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Send POST request to Laravel backend
      const response = await fetch(`${API_BASE_URL}/home`, {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 422 && result.errors) {
          // Handle validation errors
          setValidationErrors(result.errors);
          throw new Error('Please fix the validation errors below.');
        } else {
          throw new Error(result.message || result.error || 'Failed to save data');
        }
      }

      setSuccess('Content updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      setError(err.message || 'Error updating content.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      button1_text: '',
      button1_link: '',
      show_button1: false,
      button2_text: '',
      button2_link: '',
      show_button2: false,
      simple_link_text: '',
      simple_link_url: '',
      show_simple_link: false,
      image: null
    });
    setValidationErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-8 lg:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
          Manage Home Page Content
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 sm:mb-6 text-sm sm:text-base">
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 sm:mb-6 text-sm sm:text-base">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                validationErrors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter page title"
            />
            {validationErrors.title && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.title[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                validationErrors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter page description"
            />
            {validationErrors.description && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.description[0]}</p>
            )}
          </div>

          {/* Button 1 Section */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="show_button1"
                checked={formData.show_button1}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Show Primary Button
              </span>
            </label>
          </div>

          {formData.show_button1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Button Text</label>
                <input
                  type="text"
                  name="button1_text"
                  value={formData.button1_text}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                    validationErrors.button1_text ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter button text"
                />
                {validationErrors.button1_text && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.button1_text[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Button Link (Optional)</label>
                <input
                  type="url"
                  name="button1_link"
                  value={formData.button1_link}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                    validationErrors.button1_link ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://example.com (optional)"
                />
                {validationErrors.button1_link && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.button1_link[0]}</p>
                )}
              </div>
            </>
          )}

          {/* Button 2 Section */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="show_button2"
                checked={formData.show_button2}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Show Secondary Button
              </span>
            </label>
          </div>

          {formData.show_button2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Button Text</label>
                <input
                  type="text"
                  name="button2_text"
                  value={formData.button2_text}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                    validationErrors.button2_text ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter button text"
                />
                {validationErrors.button2_text && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.button2_text[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Button Link (Optional)</label>
                <input
                  type="url"
                  name="button2_link"
                  value={formData.button2_link}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                    validationErrors.button2_link ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://example.com (optional)"
                />
                {validationErrors.button2_link && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.button2_link[0]}</p>
                )}
              </div>
            </>
          )}

          {/* Simple Link Section */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="show_simple_link"
                checked={formData.show_simple_link}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Show Simple Text Link
              </span>
            </label>
          </div>

          {formData.show_simple_link && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Text</label>
                <input
                  type="text"
                  name="simple_link_text"
                  value={formData.simple_link_text}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                    validationErrors.simple_link_text ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter link text"
                />
                {validationErrors.simple_link_text && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.simple_link_text[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link URL (Optional)</label>
                <input
                  type="url"
                  name="simple_link_url"
                  value={formData.simple_link_url}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                    validationErrors.simple_link_url ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://example.com (optional)"
                />
                {validationErrors.simple_link_url && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.simple_link_url[0]}</p>
                )}
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image (Optional)</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-sm sm:text-base"
            />
            <p className="mt-1 text-xs text-gray-500">
              Upload a new image (optional)
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-2 rounded-md text-white text-sm sm:text-base font-medium ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin inline-block mr-2" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm sm:text-base font-medium"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomeContentForm;