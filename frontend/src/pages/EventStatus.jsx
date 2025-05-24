import React, { useState } from 'react';

const EventStatus = () => {
  const [email, setEmail] = useState('');
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setEvents([]);
    
    try {
      const response = await fetch(`/api/events/user/${encodeURIComponent(email)}`);
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
  
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Check Event Status
        </h1>
        <p className="mt-3 text-lg text-gray-500">
          Enter your email to see the status of your event requests.
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="text-red-700">{error}</div>
        </div>
      )}
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-3 border"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Searching...' : 'Check Status'}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {searched && (
        <div>
          {events.length > 0 ? (
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
          ) : (
            <div className="text-center py-8 bg-white shadow sm:rounded-lg">
              <p className="text-gray-500">No events found for this email address.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventStatus; 