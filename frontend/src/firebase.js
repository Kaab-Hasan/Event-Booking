// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize messaging conditionally based on browser support
const getMessagingInstance = async () => {
  try {
    const isSupportedBrowser = await isSupported();
    if (isSupportedBrowser) {
      return getMessaging(app);
    }
    console.log('Firebase messaging is not supported in this browser');
    return null;
  } catch (err) {
    console.error('Error checking messaging support:', err);
    return null;
  }
};

let messagingPromise = getMessagingInstance();

// Service worker registration
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/'
      });
      console.log('Firebase service worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      return null;
    }
  }
  console.warn('Service workers are not supported in this browser');
  return null;
};

// Function to request notification permission
export const requestNotificationPermission = async () => {
  try {
    // Ensure service worker is registered
    await registerServiceWorker();
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      return await getTokenAndSubscribe();
    } else {
      console.log('Notification permission denied.');
      return null;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
};

// Function to get token and subscribe to topics
export const getTokenAndSubscribe = async () => {
  try {
    const messaging = await messagingPromise;
    if (!messaging) {
      console.error('Messaging not supported or initialized');
      return null;
    }
    
    // Get registration token
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
    });
    
    console.log('Current token:', token);
    
    // Send the token to your server
    if (token) {
      sendTokenToServer(token);
      return token;
    } else {
      console.log('No registration token available.');
      return null;
    }
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Function to send token to server for storage
const sendTokenToServer = async (token) => {
  // Get current user info from local storage
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    console.log('No user logged in. Cannot save token.');
    return;
  }
  
  try {
    const response = await fetch('/api/users/notification-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ 
        userId: user._id,
        notificationToken: token 
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to save notification token');
    }
    
    console.log('Token saved to server successfully');
  } catch (error) {
    console.error('Error saving token to server:', error);
  }
};

// Function to handle incoming messages
export const onMessageListener = () => {
  return new Promise(async (resolve) => {
    const messaging = await messagingPromise;
    if (!messaging) {
      console.error('Messaging not supported or initialized');
      resolve(null);
      return;
    }
    
    onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      resolve(payload);
    });
  });
};

export default app; 