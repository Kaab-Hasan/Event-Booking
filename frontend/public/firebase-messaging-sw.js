// Firebase messaging service worker
// Import and configure the Firebase SDK
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

// Configuration will be replaced during build
firebase.initializeApp({
  apiKey: 'AIzaSyCHT6bLr7Ktp0csC3ZD8tN7J8Uf6cZfpBQ',
  authDomain: 'event-booking-system-d585d.firebaseapp.com',
  projectId: 'event-booking-system-d585devent-booking-system-d585d',
  storageBucket: 'event-booking-system-d585d.firebasestorage.app',
  messagingSenderId: '490680388731',
  appId: '1:490680388731:web:595a66c9d93729596666de',
  measurementId: 'G-BJFEH3MNXX'
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png',
    badge: '/badge-icon.png',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
  const clickedNotification = event.notification;
  clickedNotification.close();

  // Get event data from notification payload
  const eventId = event.notification.data?.eventId;
  
  // Try to open a window that focuses on the event details
  const urlToOpen = eventId 
    ? new URL(`/status?eventId=${eventId}`, self.location.origin).href
    : new URL('/', self.location.origin).href;

  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  .then((windowClients) => {
    // Check if there is already a window/tab open with the target URL
    for (let i = 0; i < windowClients.length; i++) {
      const client = windowClients[i];
      if (client.url === urlToOpen && 'focus' in client) {
        return client.focus();
      }
    }
    // If not, open a new window/tab
    if (clients.openWindow) {
      return clients.openWindow(urlToOpen);
    }
  });

  event.waitUntil(promiseChain);
}); 