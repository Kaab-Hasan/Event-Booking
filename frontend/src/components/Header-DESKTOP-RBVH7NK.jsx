import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const userMenuRef = useRef(null);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (path) => {
    return `${isActive(path) 
      ? 'text-white font-semibold border-b-2 border-white' 
      : 'text-blue-100 hover:text-white hover:border-b-2 hover:border-blue-200'} px-2 py-2 transition-colors`;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (userMenuOpen) setUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 mr-2 text-yellow-400 group-hover:text-yellow-300 transition-colors" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className="group-hover:text-blue-100 transition-colors">Event Booking</span>
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none p-2 hover:bg-blue-700 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={navLinkClass("/")}>Home</Link>
            <Link to="/event" className={navLinkClass("/event")}>Book Event</Link>
            <Link to="/status" className={navLinkClass("/status")}>Check Status</Link>
            
            {!isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-blue-600 hover:bg-blue-100 hover:text-blue-700 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded-md transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{user?.email?.split('@')[0]}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        className="block px-4 py-2 text-gray-800 hover:bg-blue-100 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-100 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
        
        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 py-3 border-t border-blue-400 flex flex-col space-y-4 animate-fadeIn">
            <Link 
              to="/" 
              className={`${isActive('/') ? 'font-semibold bg-blue-700' : ''} block px-3 py-2 rounded-md`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/event" 
              className={`${isActive('/event') ? 'font-semibold bg-blue-700' : ''} block px-3 py-2 rounded-md`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Book Event
            </Link>
            <Link 
              to="/status" 
              className={`${isActive('/status') ? 'font-semibold bg-blue-700' : ''} block px-3 py-2 rounded-md`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Check Status
            </Link>
            
            {!isAuthenticated ? (
              <div className="flex flex-col space-y-2 pt-3 border-t border-blue-400">
                <Link 
                  to="/login" 
                  className="hover:bg-blue-600 text-white px-3 py-2 rounded-md block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-blue-600 hover:bg-blue-100 hover:text-blue-700 px-4 py-2 rounded-md font-medium block text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-3 border-t border-blue-400">
                <div className="px-3 py-2 text-blue-100 font-medium">
                  Hello, {user?.email?.split('@')[0]}
                </div>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="hover:bg-blue-700 px-4 py-2 rounded-md block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link 
                  to="/profile" 
                  className="hover:bg-blue-700 px-4 py-2 rounded-md block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }} 
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md w-full text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header; 