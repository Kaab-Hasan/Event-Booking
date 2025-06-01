// This script replaces placeholders in firebase-messaging-sw.js with actual values from .env
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Define paths
const srcPath = path.resolve(__dirname, '../src/firebase-messaging-sw.js');
const destPath = path.resolve(__dirname, '../public/firebase-messaging-sw.js');

// Read the source file
let content = fs.readFileSync(srcPath, 'utf8');

// Replace placeholders with actual values
content = content.replace('__FIREBASE_API_KEY__', process.env.VITE_FIREBASE_API_KEY || '');
content = content.replace('__FIREBASE_AUTH_DOMAIN__', process.env.VITE_FIREBASE_AUTH_DOMAIN || '');
content = content.replace('__FIREBASE_PROJECT_ID__', process.env.VITE_FIREBASE_PROJECT_ID || '');
content = content.replace('__FIREBASE_STORAGE_BUCKET__', process.env.VITE_FIREBASE_STORAGE_BUCKET || '');
content = content.replace('__FIREBASE_MESSAGING_SENDER_ID__', process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '');
content = content.replace('__FIREBASE_APP_ID__', process.env.VITE_FIREBASE_APP_ID || '');
content = content.replace('__FIREBASE_MEASUREMENT_ID__', process.env.VITE_FIREBASE_MEASUREMENT_ID || '');

// Ensure the public directory exists
const publicDir = path.dirname(destPath);
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write the file to the output location
fs.writeFileSync(destPath, content);

console.log('Firebase service worker has been built successfully!'); 