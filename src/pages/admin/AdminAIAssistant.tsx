import React from 'react';


const fakeChats = [
  { id: 1, user: 'Amit Sharma', message: 'How to apply for internships?', time: '10:00 AM' },
  { id: 2, user: 'Priya Singh', message: 'Show me my application status.', time: '10:05 AM' },
  { id: 3, user: 'Rahul Verma', message: 'What is premium?', time: '10:10 AM' },
];

const AdminAIAssistant = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">AI Assistant</h1>
    <ul className="space-y-2">
      {fakeChats.map(chat => (
        <li key={chat.id} className="border-b pb-2">
          <b>{chat.user}</b> ({chat.time}): {chat.message}
        </li>
      ))}
    </ul>
  </div>
);

export default AdminAIAssistant;
