import React from 'react';


const fakeApplications = [
  { id: 1, user: 'Amit Sharma', position: 'Frontend Intern', status: 'Pending' },
  { id: 2, user: 'Priya Singh', position: 'Backend Intern', status: 'Accepted' },
  { id: 3, user: 'Rahul Verma', position: 'UI/UX Intern', status: 'Rejected' },
];

const AdminApplications = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Applications</h1>
    <table className="min-w-full bg-white dark:bg-card rounded shadow">
      <thead>
        <tr>
          <th className="py-2 px-4">User</th>
          <th className="py-2 px-4">Position</th>
          <th className="py-2 px-4">Status</th>
        </tr>
      </thead>
      <tbody>
        {fakeApplications.map(app => (
          <tr key={app.id} className="border-t">
            <td className="py-2 px-4">{app.user}</td>
            <td className="py-2 px-4">{app.position}</td>
            <td className="py-2 px-4">{app.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AdminApplications;
