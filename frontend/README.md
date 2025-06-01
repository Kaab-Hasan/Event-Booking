# Event Booking System Frontend

## Firebase Push Notification Setup

This application uses Firebase Cloud Messaging for push notifications. Follow these steps to set it up:

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Register your web app in the Firebase project

### 2. Configure Firebase in the App

Create a `.env` file in the frontend root directory with the following variables:

```
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
VITE_FIREBASE_VAPID_KEY=your-vapid-key

# API URL
VITE_API_URL=http://localhost:3000/api
```

### 3. Update the Service Worker

Open `public/firebase-messaging-sw.js` and update the Firebase configuration:

```js
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
});
```

### 4. Generate VAPID Key

1. In Firebase Console, go to Project Settings > Cloud Messaging
2. In the "Web configuration" section, generate a new key pair
3. Copy the key and add it to your `.env` file as `VITE_FIREBASE_VAPID_KEY`

### 5. Backend Setup

Make sure your backend has an endpoint `/api/users/notification-token` that can save the FCM token for each user.

### 6. Sending Notifications from Backend

Use the Firebase Admin SDK in your backend to send notifications to users:

```javascript
// Example backend code
const admin = require("firebase-admin");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey)
});

// Function to send notification
const sendNotification = async (token, title, body, data = {}) => {
  const message = {
    notification: {
      title,
      body
    },
    data,
    token
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
```

## Installation and Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
``` 