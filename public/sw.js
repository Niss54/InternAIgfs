// Service Worker for Push Notifications and PWA functionality

const CACHE_NAME = 'internship-alerts-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/offline.html'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Handle push events
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  let notificationData = {
    title: 'New Internship Alert! 🚀',
    body: 'A new internship opportunity is available.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: {
      url: '/dashboard/search',
      type: 'internship_alert'
    },
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/favicon.ico'
      },
      {
        action: 'apply',
        title: 'Apply Now',
        icon: '/favicon.ico'
      }
    ],
    tag: 'internship-alert',
    requireInteraction: true,
    vibrate: [200, 100, 200],
    timestamp: Date.now()
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      notificationData = { ...notificationData, ...payload };
    } catch (e) {
      console.error('Error parsing push payload:', e);
      notificationData.body = event.data.text();
    }
  }

  const promiseChain = self.registration.showNotification(
    notificationData.title,
    notificationData
  );

  event.waitUntil(promiseChain);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  const action = event.action;
  const data = event.notification.data || {};
  
  let urlToOpen = data.url || '/dashboard/search';
  
  if (action === 'view') {
    urlToOpen = data.url || '/dashboard/search';
  } else if (action === 'apply' && data.internshipId) {
    urlToOpen = `/dashboard/search?highlight=${data.internshipId}`;
  }

  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then((clientList) => {
    // Check if the app is already open
    for (let i = 0; i < clientList.length; i++) {
      const client = clientList[i];
      if (client.url.includes(urlToOpen) && 'focus' in client) {
        return client.focus();
      }
    }
    
    // If not open, open a new window
    if (clients.openWindow) {
      return clients.openWindow(urlToOpen);
    }
  });

  event.waitUntil(promiseChain);
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
  // Could track analytics here
});

// Fetch event for offline support
self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      })
  );
});

// Handle background sync (for offline actions)
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Implement background sync logic here
  console.log('Performing background sync...');
}