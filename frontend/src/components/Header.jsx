import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, isAdmin, user, logout, alert } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();
  const userMenuRef = useRef(null);
  const logoutConfirmRef = useRef(null);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (path) => {
    return `${isActive(path) 
      ? 'text-white font-semibold border-b-2 border-white' 
      : 'text-blue-100 hover:text-white border-b-2 border-transparent hover:border-blue-200'} px-3 py-3 transition-colors`;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (userMenuOpen) setUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setUserMenuOpen(false);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (logoutConfirmRef.current && !logoutConfirmRef.current.contains(event.target)) {
        setShowLogoutConfirm(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-5">
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
                    className="hover:bg-blue-600 text-white px-3 py-2 rounded-md transition-colors"
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
                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-blue-100 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        My Profile
                      </Link>
                      <button 
                        onClick={handleLogoutClick}
                        className="flex w-full items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
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
                  <div className="px-3 py-2 text-blue-100 font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {user?.email?.split('@')[0]}
                  </div>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="hover:bg-blue-700 px-4 py-2 rounded-md block flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Admin Dashboard
                    </Link>
                  )}
                  <Link 
                    to="/profile" 
                    className="hover:bg-blue-700 px-4 py-2 rounded-md block flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    My Profile
                  </Link>
                  <button 
                    onClick={handleLogoutClick}
                    className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md w-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </nav>
          )}
        </div>
      </header>

      {/* Alert Messages */}
      {alert && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-md shadow-lg max-w-sm animate-slideIn ${
          alert.type === 'error' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' : 
          alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500' : 
          'bg-green-100 text-green-800 border-l-4 border-green-500'
        }`}>
          {alert.message}
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div 
            ref={logoutConfirmRef}
            className="bg-white rounded-lg shadow-xl max-w-sm mx-4 w-full animate-slideUp overflow-hidden"
          >
            <div className="bg-red-50 px-6 py-4 border-b border-red-100">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <h3 className="ml-3 text-xl font-medium text-red-800">Confirm Logout</h3>
              </div>
            </div>
            
            <div className="px-6 py-6">
              <p className="text-gray-700">Are you sure you want to log out? Any unsaved changes will be lost.</p>
              
              <div className="mt-8 flex justify-end space-x-3">
                <button 
                  onClick={handleCancelLogout}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header; 