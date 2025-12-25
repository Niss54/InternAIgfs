import React from 'react';


const fakeSettings = [
  { key: 'Platform Mode', value: 'Live' },
  { key: 'Default Role', value: 'User' },
  { key: 'Notifications', value: 'Enabled' },
];

const AdminSettings = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Settings</h1>
    <ul className="space-y-2">
      {fakeSettings.map(s => (
        <li key={s.key} className="border-b pb-2">
          <b>{s.key}:</b> {s.value}
        </li>
      ))}
    </ul>
  </div>
);

export default AdminSettings;
