import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EventStatus = () => {
  const { user, isAuthenticated, showAlert } = useAuth();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  
  // Fetch user's events when they're authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserEvents(user.email);
    }
  }, [isAuthenticated, user]);

  const fetchUserEvents = async (email) => {
    setIsLoading(true);
    setError('');
    setEvents([]);
    
    try {
      const response = await fetch(`/api/events/user/${encodeURIComponent(email)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch events');
      }
      
      setEvents(data);
      setSearched(true);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Show a login message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Check Event Status
          </h1>
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg text-center">
          <svg className="h-12 w-12 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sign In Required
          </h2>
          <p className="text-gray-600 mb-6">
            You need to sign in to check your event request status.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Check Event Status
        </h1>
        <p className="mt-3 text-lg text-gray-500">
          View the status of your event requests.
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="text-red-700">{error}</div>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : searched && events.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {events.map((event) => (
              <li key={event._id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{event.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{formatDate(event.date)}</p>
                  </div>
                  <span className={`px-3 py-1 uppercase text-xs font-bold rounded-full ${getStatusBadgeClass(event.status)}`}>
                    {event.status}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-700">{event.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : searched ? (
        <div className="text-center py-8 bg-white shadow sm:rounded-lg">
          <p className="text-gray-500">No events found for your account.</p>
          <div className="mt-6">
            <Link 
              to="/event" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Create New Event Request
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default EventStatus; 