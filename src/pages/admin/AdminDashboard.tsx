import { useState, useEffect } from 'react';
import { Users, UserPlus, DollarSign, TrendingUp, Activity, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalUsers: number;
  monthlyRegistrations: number;
  totalRevenue: number;
  activeSubscriptions: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    monthlyRegistrations: 0,
    totalRevenue: 0,
    activeSubscriptions: 0
  });

  const [chartData] = useState([
    { month: 'Jan', users: 120, revenue: 3400 },
    { month: 'Feb', users: 190, revenue: 5100 },
    { month: 'Mar', users: 300, revenue: 7200 },
    { month: 'Apr', users: 280, revenue: 6800 },
    { month: 'May', users: 420, revenue: 9500 },
    { month: 'Jun', users: 380, revenue: 8900 },
  ]);

  const [subscriptionData] = useState([
    { name: 'Free Trial', value: 45, color: '#3B82F6' },
    { name: 'Monthly Premium', value: 35, color: '#10B981' },
    { name: 'Yearly Premium', value: 20, color: '#F59E0B' },
  ]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch monthly registrations
      const currentMonth = new Date();
      currentMonth.setDate(1);
      const { count: monthlyRegistrations } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', currentMonth.toISOString());

      // Fetch revenue data
      const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'paid');

      const totalRevenue = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

      // Fetch active subscriptions
      const { count: activeSubscriptions } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_premium', true);

      setStats({
        totalUsers: totalUsers || 0,
        monthlyRegistrations: monthlyRegistrations || 0,
        totalRevenue: totalRevenue / 100, // Convert from paisa to rupees
        activeSubscriptions: activeSubscriptions || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor platform performance and user activity</p>
        </div>
        <div className="flex items-center gap-4">
          <Bell className="w-6 h-6 text-primary cursor-pointer hover:text-primary-glow transition-colors" />
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card hover:scale-105 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-accent">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:scale-105 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Registrations</CardTitle>
            <UserPlus className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.monthlyRegistrations.toLocaleString()}</div>
            <p className="text-xs text-accent">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:scale-105 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">₹{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-accent">+24% from last month</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:scale-105 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscriptions</CardTitle>
            <TrendingUp className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.activeSubscriptions.toLocaleString()}</div>
            <p className="text-xs text-accent">+18% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-foreground">User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-foreground">Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="hsl(var(--accent))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Distribution */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-foreground">Subscription Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width={400} height={300}>
              <PieChart>
                <Pie
                  data={subscriptionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subscriptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {subscriptionData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;