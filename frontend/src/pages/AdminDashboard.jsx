import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionInProgress, setActionInProgress] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    date: '',
    time: ''
  });
  
  const modalRef = useRef();
  const { user } = useAuth();
  
  useEffect(() => {
    fetchEvents();
  }, [statusFilter]);
  
  useEffect(() => {
    // Close the modal when clicking outside
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsEditModalOpen(false);
      }
    };
    
    if (isEditModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditModalOpen]);
  
  const fetchEvents = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const url = statusFilter 
        ? `/api/events?status=${statusFilter}` 
        : '/api/events';
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch events');
      }
      
      setEvents(data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching events');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStatusUpdate = async (eventId, newStatus) => {
    setActionInProgress(eventId);
    
    try {
      const response = await fetch(`/api/events/${eventId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update event status');
      }
      
      // Update the event in the state
      setEvents(events.map(event => 
        event._id === eventId ? { ...event, status: newStatus } : event
      ));
    } catch (err) {
      setError(err.message || 'An error occurred while updating status');
    } finally {
      setActionInProgress(null);
    }
  };
  
  const handleOpenEditModal = (event) => {
    setSelectedEvent(event);
    // Format the date to YYYY-MM-DD for the input
    const formattedDate = new Date(event.date).toISOString().split('T')[0];
    setEditFormData({
      date: formattedDate,
      time: event.time || ''
    });
    setIsEditModalOpen(true);
  };
  
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };
  
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setActionInProgress(selectedEvent._id);
    
    try {
      const response = await fetch(`/api/events/${selectedEvent._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editFormData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update event');
      }
      
      // Update the event in the state
      setEvents(events.map(event => 
        event._id === selectedEvent._id ? { 
          ...event, 
          date: new Date(editFormData.date),
          time: editFormData.time 
        } : event
      ));
      
      setIsEditModalOpen(false);
    } catch (err) {
      setError(err.message || 'An error occurred while updating the event');
    } finally {
      setActionInProgress(null);
    }
  };
  
  // Generate time options from 9 AM to 9 PM in 30-minute intervals
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 9; hour <= 21; hour++) {
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      const ampm = hour < 12 ? 'AM' : 'PM';
      
      options.push(`${formattedHour}:00 ${ampm}`);
      if (hour < 21) {
        options.push(`${formattedHour}:30 ${ampm}`);
      }
    }
    return options;
  };
  
  const timeOptions = generateTimeOptions();
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (!user || !user.isAdmin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
        <p className="mt-2 text-gray-600">You do not have permission to access this page.</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage event booking requests</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="text-red-700">{error}</div>
        </div>
      )}
      
      <div className="mb-6 flex justify-between items-center">
        <div>
          <label htmlFor="statusFilter" className="mr-2 text-gray-700">Filter by status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <button
          onClick={() => fetchEvents()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
          <p className="text-gray-500">No events found.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date/Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{event.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{event.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      <div>{formatDate(event.date)}</div>
                      {event.time && <div className="text-xs mt-1">Time: {event.time}</div>}
                      <button
                        onClick={() => handleOpenEditModal(event)}
                        className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                      >
                        Edit Date/Time
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${event.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        event.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {event.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(event._id, 'approved')}
                          disabled={actionInProgress === event._id}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(event._id, 'rejected')}
                          disabled={actionInProgress === event._id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {event.status !== 'pending' && (
                      <span className="text-gray-400">No actions available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Edit Event Modal */}
      {isEditModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div ref={modalRef} className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Edit Event Details</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={editFormData.date}
                  onChange={handleEditChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Time
                </label>
                <select
                  name="time"
                  value={editFormData.time}
                  onChange={handleEditChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select a time</option>
                  {timeOptions.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionInProgress === selectedEvent._id}
                  className={`py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                    actionInProgress === selectedEvent._id ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {actionInProgress === selectedEvent._id ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 