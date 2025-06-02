# 🎟️ Event Booking App

A full-featured MERN stack application that allows users to browse and book events, while admins can manage events and get notified of new bookings. The app integrates **Firebase Cloud Messaging (FCM)** to send **push notifications** directly to users' browsers.

---

## 📌 Description

The Event Booking App is designed to simplify event management and participation. It allows:

- Admins to create, edit, or delete events
- Users to view and book events
- Real-time push notifications via Firebase for updates and reminders

Built using modern web technologies and a modular architecture, it's scalable for both educational and enterprise use cases.

---

## 🚀 Features

- 🔐 User authentication with login/signup
- 🗓️ Event listing and booking
- 🧑‍💼 Admin dashboard for managing events
- 🔔 Firebase Cloud Messaging (Push notifications)
- 💻 Fully responsive design (mobile & desktop)

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Firebase
- **Backend**: Node.js, Express.js, MongoDB
- **Notifications**: Firebase Cloud Messaging (FCM)

---

## 📁 Project Structure

event-booking-app/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ └── server.js
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── firebase.js
│ │ └── App.jsx
│ └── vite.config.js
├── .env
└── README.md

---

## ⚙️ Getting Started

### 📦 Prerequisites

- Node.js and npm installed
- MongoDB (local or MongoDB Atlas)
- Firebase project with FCM enabled

### 🔧 Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/Kaab-Hasan/event-booking-app.git
cd event-booking-app
Setup environment variables

Create a .env file in the project root:

```env
# Backend
PORT=5000
MONGODB_URI=your_mongodb_connection_string

# Firebase
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_FIREBASE_VAPID_KEY=your_public_vapid_key
```
Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```
Run the application

```bash
# Start backend server
cd backend
npm start

# Start frontend server
cd ../frontend
npm run dev
```
Then open http://localhost:3000 in your browser.

🔔 Firebase Cloud Messaging Setup
To enable push notifications:

Go to Firebase Console > Project Settings > Cloud Messaging

Generate a Web Push certificate

Copy the Public VAPID Key and paste it into .env as VITE_FIREBASE_VAPID_KEY

Firebase Init (frontend/src/firebase.js)
```javascript
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
```
Request Token and Listen for Messages
```javascript
import { messaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";

getToken(messaging, {
  vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
})
  .then((currentToken) => {
    if (currentToken) {
      console.log("Token:", currentToken);
      // Send this token to backend for sending push
    }
  })
  .catch((err) => console.error("Token error:", err));

onMessage(messaging, (payload) => {
  console.log("Message received:", payload);
  // Display notification or update UI
});
```
🔐 Local Development Notes
Push notifications require HTTPS

Use Firebase Hosting or local HTTPS setup

Foreground messages still work on localhost

📤 Deployment
For production deployment, consider:

Hosting backend on platforms like Render, Railway, or Heroku

Hosting frontend with Firebase Hosting or Netlify

Ensure you use a production MongoDB connection string (e.g. MongoDB Atlas)

🧾 License
This project is open-source and available under the MIT License.

🙌 Acknowledgements
Firebase

React.js

Node.js

MongoDB

Built with ❤️ by Muhammad Kaab Hasan Siddiqui