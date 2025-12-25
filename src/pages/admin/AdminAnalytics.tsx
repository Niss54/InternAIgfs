import React from 'react';


const fakeAnalytics = {
  users: 1200,
  revenue: 45000,
  growth: '12%',
  active: 980,
};

const AdminAnalytics = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Analytics</h1>
    <ul className="space-y-2">
      <li>Total Users: <b>{fakeAnalytics.users}</b></li>
      <li>Total Revenue: <b>₹{fakeAnalytics.revenue}</b></li>
      <li>Growth: <b>{fakeAnalytics.growth}</b></li>
      <li>Active Users: <b>{fakeAnalytics.active}</b></li>
    </ul>
  </div>
);

export default AdminAnalytics;
