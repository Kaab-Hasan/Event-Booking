import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardStats from '../components/DashboardStats';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    date: '',
    time: '',
    status: ''
  });
  const [actionLoading, setActionLoading] = useState({
    isLoading: false,
    action: '',
    eventId: null
  });
  const [alert, setAlert] = useState({
    show: false,
    type: '',
    message: ''
  });
  const modalRef = useRef(null);

  // Memoize filtered events
  const filteredEvents = useMemo(() => {
    if (statusFilter === 'all') return events;
    return events.filter(event => event.status === statusFilter);
  }, [events, statusFilter]);

  // Memoize fetch function
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/events', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Auto-hide alert after 3 seconds
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ show: false, type: '', message: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  const handleStatusUpdate = async (eventId, newStatus) => {
    try {
      setActionLoading({ isLoading: true, action: newStatus, eventId });
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status');
      }

      // Update local state
      setEvents(events.map(event => 
        event._id === eventId ? { ...event, status: newStatus } : event
      ));

      // Show success alert
      setAlert({
        show: true,
        type: 'success',
        message: `Event ${newStatus} successfully!`
      });
    } catch (err) {
      setError(err.message);
      setAlert({
        show: true,
        type: 'error',
        message: err.message
      });
    } finally {
      setActionLoading({ isLoading: false, action: '', eventId: null });
    }
  };

  const handleOpenEditModal = (event) => {
    setSelectedEvent(event);
    setEditForm({
      name: event.name,
      date: event.date,
      time: event.time,
      status: event.status
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      setActionLoading({ isLoading: true, action: 'edit', eventId: selectedEvent._id });
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/events/${selectedEvent._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update event');
      }

      const updatedEvent = await response.json();
      
      // Update local state
      setEvents(events.map(event => 
        event._id === selectedEvent._id ? updatedEvent : event
      ));
      
      setShowEditModal(false);
      setSelectedEvent(null);

      // Show success alert
      setAlert({
        show: true,
        type: 'success',
        message: 'Event updated successfully!'
      });
    } catch (err) {
      setError(err.message);
      setAlert({
        show: true,
        type: 'error',
        message: err.message
      });
    } finally {
      setActionLoading({ isLoading: false, action: '', eventId: null });
    }
  };

  // Handle clicks outside modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowEditModal(false);
        setSelectedEvent(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
            <p className="mt-2 text-gray-600">You do not have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage event bookings and view statistics</p>
        </div>

        {/* Alert Message */}
        {alert.show && (
          <div className={`mb-4 p-4 rounded-lg ${
            alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {alert.message}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <>
            {events.length > 0 && <DashboardStats events={events} />}
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Event Bookings</h2>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="all">All Events</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEvents.map((event) => (
                      <tr key={event._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(event.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.time}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            event.status === 'approved' ? 'bg-green-100 text-green-800' :
                            event.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {(event.status || 'pending').charAt(0).toUpperCase() + (event.status || 'pending').slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleOpenEditModal(event)}
                              disabled={actionLoading.isLoading}
                              className={`text-blue-600 hover:text-blue-900 ${actionLoading.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {actionLoading.isLoading && actionLoading.eventId === event._id && actionLoading.action === 'edit' ? (
                                <span className="inline-block animate-spin mr-1">⟳</span>
                              ) : null}
                              Edit
                            </button>
                            {event.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(event._id, 'approved')}
                                  disabled={actionLoading.isLoading}
                                  className={`text-green-600 hover:text-green-900 ${actionLoading.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  {actionLoading.isLoading && actionLoading.eventId === event._id && actionLoading.action === 'approved' ? (
                                    <span className="inline-block animate-spin mr-1">⟳</span>
                                  ) : null}
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(event._id, 'rejected')}
                                  disabled={actionLoading.isLoading}
                                  className={`text-red-600 hover:text-red-900 ${actionLoading.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  {actionLoading.isLoading && actionLoading.eventId === event._id && actionLoading.action === 'rejected' ? (
                                    <span className="inline-block animate-spin mr-1">⟳</span>
                                  ) : null}
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" ref={modalRef}>
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900">Edit Event</h3>
              <form onSubmit={handleEditSubmit} className="mt-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Event Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={editForm.date}
                    onChange={handleEditChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={editForm.time}
                    onChange={handleEditChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading.isLoading}
                    className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md ${
                      actionLoading.isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {actionLoading.isLoading ? (
                      <>
                        <span className="inline-block animate-spin mr-1">⟳</span>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 