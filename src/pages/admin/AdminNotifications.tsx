import React from 'react';


const fakeNotifications = [
  { id: 1, message: 'Welcome to the platform!', date: '2025-12-01' },
  { id: 2, message: 'New internship posted.', date: '2025-12-10' },
  { id: 3, message: 'System maintenance on 2025-12-18.', date: '2025-12-15' },
];

const AdminNotifications = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Notifications</h1>
    <ul className="space-y-2">
      {fakeNotifications.map(n => (
        <li key={n.id} className="border-b pb-2">
          <b>{n.date}:</b> {n.message}
        </li>
      ))}
    </ul>
  </div>
);

export default AdminNotifications;
