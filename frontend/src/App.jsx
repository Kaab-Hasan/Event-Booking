import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import EventForm from './pages/EventForm';
import EventStatus from './pages/EventStatus';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import NotificationManager from './components/NotificationManager';

// Layout component that conditionally renders Header and Footer
const Layout = ({ children, showHeaderFooter = true }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {showHeaderFooter && <Header />}
      <main className={`flex-grow ${!showHeaderFooter ? 'flex items-center justify-center' : ''}`}>
        {children}
      </main>
      {showHeaderFooter && <Footer />}
    </div>
  );
};

// Global Alert Component
const AlertDisplay = ({ alert }) => {
  if (!alert) return null;
  
  const alertClasses = {
    error: 'bg-red-100 text-red-800 border-l-4 border-red-500',
    warning: 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500',
    success: 'bg-green-100 text-green-800 border-l-4 border-green-500',
    info: 'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
  };
  
  return (
    <div className={`fixed top-20 right-4 z-50 p-4 rounded-md shadow-lg max-w-sm animate-slideIn ${alertClasses[alert.type] || alertClasses.info}`}>
      {alert.message}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationManager />
      <Routes>
        {/* Auth routes without header/footer */}
        <Route 
          path="/login" 
          element={
            <Layout showHeaderFooter={false}>
              <LoginPage />
            </Layout>
          } 
        />
        <Route 
          path="/register" 
          element={
            <Layout showHeaderFooter={false}>
              <RegisterPage />
            </Layout>
          } 
        />
        
        {/* Routes with header/footer */}
        <Route 
          path="/" 
          element={
            <Layout>
              <HomePage />
            </Layout>
          } 
        />
        <Route
          path="/event"
          element={
            <Layout>
              <ProtectedRoute requireAdmin={false}>
                <EventForm />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route 
          path="/status" 
          element={
            <Layout>
              <EventStatus />
            </Layout>
          } 
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <ProtectedRoute requireAdmin={false}>
                <ProfilePage />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route 
          path="/admin/*" 
          element={
            <Layout>
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            </Layout>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App; 