import React from 'react';


const fakeInterviews = [
  { id: 1, candidate: 'Amit Sharma', date: '2025-12-20', status: 'Scheduled' },
  { id: 2, candidate: 'Priya Singh', date: '2025-12-22', status: 'Completed' },
  { id: 3, candidate: 'Rahul Verma', date: '2025-12-25', status: 'Cancelled' },
];

const AdminInterviews = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Interviews</h1>
    <table className="min-w-full bg-white dark:bg-card rounded shadow">
      <thead>
        <tr>
          <th className="py-2 px-4">Candidate</th>
          <th className="py-2 px-4">Date</th>
          <th className="py-2 px-4">Status</th>
        </tr>
      </thead>
      <tbody>
        {fakeInterviews.map(interview => (
          <tr key={interview.id} className="border-t">
            <td className="py-2 px-4">{interview.candidate}</td>
            <td className="py-2 px-4">{interview.date}</td>
            <td className="py-2 px-4">{interview.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AdminInterviews;
