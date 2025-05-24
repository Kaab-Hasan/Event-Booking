import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Event Booking System</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Book your events, seminars, or consultations with ease. Get quick approvals and manage your bookings all in one place.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link to="/event" className="bg-white text-blue-600 hover:bg-blue-100 px-6 py-3 rounded-md font-bold text-lg">
              Book an Event
            </Link>
            <Link to="/status" className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-md font-bold text-lg">
              Check Status
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">1</div>
              <h3 className="text-xl font-bold mb-2">Submit Request</h3>
              <p className="text-gray-600">Fill out our simple form with your details and event information.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">2</div>
              <h3 className="text-xl font-bold mb-2">Wait for Approval</h3>
              <p className="text-gray-600">Our admin team will review your request and make a decision.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">3</div>
              <h3 className="text-xl font-bold mb-2">Get Confirmation</h3>
              <p className="text-gray-600">Check the status of your booking anytime using your email.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 