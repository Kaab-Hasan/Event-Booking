import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  requestNotificationPermission, 
  onMessageListener 
} from '../firebase';

const NotificationManager = () => {
  const { isAuthenticated, showAlert } = useAuth();
  const [notification, setNotification] = useState(null);
  const [notificationsSupported, setNotificationsSupported] = useState(true);

  // Check if browser supports notifications
  useEffect(() => {
    const checkNotificationSupport = () => {
      if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        setNotificationsSupported(false);
        return false;
      }
      return true;
    };
    
    checkNotificationSupport();
  }, []);

  // Request permission and set up token when user logs in
  useEffect(() => {
    if (isAuthenticated && notificationsSupported) {
      const setupNotifications = async () => {
        try {
          const token = await requestNotificationPermission();
          if (token) {
            console.log('Notification setup complete');
          } else {
            console.log('Notification permission denied or setup failed');
          }
        } catch (error) {
          console.error('Error setting up notifications:', error);
        }
      };
      
      setupNotifications();
    }
  }, [isAuthenticated, notificationsSupported]);

  // Set up message listener for foreground notifications
  useEffect(() => {
    if (isAuthenticated && notificationsSupported) {
      const messageListener = onMessageListener()
        .then((payload) => {
          if (!payload) return;
          
          setNotification({
            title: payload.notification?.title || 'New Notification',
            body: payload.notification?.body || '',
            data: payload.data || {}
          });
          
          // Show notification via our alert system
          showAlert(
            `${payload.notification?.title || 'New Notification'}: ${payload.notification?.body || ''}`, 
            payload.data?.type || 'info'
          );
        })
        .catch((err) => {
          console.error('Error receiving foreground message:', err);
        });
      
      return () => {
        messageListener.catch(() => {});  // Prevent unhandled rejection on unmount
      };
    }
  }, [isAuthenticated, showAlert, notificationsSupported]);

  return null; // This is a non-UI component
};

export default NotificationManager; 