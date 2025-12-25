import React from 'react';


const fakeUsers = [
  { id: 1, name: 'Amit Sharma', email: 'amit@example.com', role: 'User', status: 'Active' },
  { id: 2, name: 'Priya Singh', email: 'priya@example.com', role: 'Admin', status: 'Active' },
  { id: 3, name: 'Rahul Verma', email: 'rahul@example.com', role: 'User', status: 'Inactive' },
];

const AdminUsers = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">User Management</h1>
    <table className="min-w-full bg-white dark:bg-card rounded shadow">
      <thead>
        <tr>
          <th className="py-2 px-4">Name</th>
          <th className="py-2 px-4">Email</th>
          <th className="py-2 px-4">Role</th>
          <th className="py-2 px-4">Status</th>
        </tr>
      </thead>
      <tbody>
        {fakeUsers.map(user => (
          <tr key={user.id} className="border-t">
            <td className="py-2 px-4">{user.name}</td>
            <td className="py-2 px-4">{user.email}</td>
            <td className="py-2 px-4">{user.role}</td>
            <td className="py-2 px-4">{user.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AdminUsers;
