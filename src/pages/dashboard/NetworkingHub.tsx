import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, Megaphone, Bell, ClipboardList } from 'lucide-react';

const groups = [
  { id: 'internship', title: 'Internship Notices', icon: Briefcase, count: 42, desc: 'Latest internship listings and application tips.' },
  { id: 'jobs', title: 'Job Updates', icon: Megaphone, count: 18, desc: 'New job postings and company hiring updates.' },
  { id: 'announcements', title: 'Announcements', icon: Bell, count: 7, desc: 'Platform news and important announcements.' },
  { id: 'study', title: 'Study Groups', icon: Users, count: 12, desc: 'Form or join study groups for interviews.' },
  { id: 'projects', title: 'Project Collaborations', icon: ClipboardList, count: 9, desc: 'Find collaborators and showcase projects.' },
];

const NetworkingHub: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-6rem)]">
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Networking</h2>
        <p className="text-sm text-muted-foreground">Connect with peers, find groups, and stay updated. (Static demo view)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        <aside className="lg:col-span-1">
          <Card className="glass-card p-4">
            <h3 className="text-lg font-semibold text-foreground mb-3">Groups</h3>
            <ul className="space-y-2">
              {groups.map(g => (
                <li key={g.id} className="flex items-center justify-between p-3 rounded-md hover:bg-accent/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <g.icon className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-foreground">{g.title}</div>
                      <div className="text-xs text-muted-foreground">{g.desc}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{g.count}</div>
                </li>
              ))}
            </ul>
          </Card>
        </aside>

        <main className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groups.map(g => (
              <Card key={g.id} className="glass-card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <g.icon className="w-6 h-6 text-primary" />
                      <h4 className="text-lg font-semibold text-foreground">{g.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{g.desc}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-2xl font-bold text-foreground">{g.count}</div>
                    <div className="mt-3">
                      <Button size="sm" className="btn-neon mr-2">Open</Button>
                      <Button size="sm" variant="outline">Subscribe</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="glass-card p-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">Quick Actions</h3>
            <div className="flex gap-3 flex-wrap">
              <Button className="btn-pulse">Create Group</Button>
              <Button variant="outline">Browse Jobs</Button>
              <Button variant="outline">Find Collaborators</Button>
            </div>
          </Card>

          <Card className="glass-card p-4 text-sm text-muted-foreground">
            This networking demo shows static groups and actions. Replace with real data when ready.
          </Card>
        </main>
      </div>
    </div>
  );
};

export default NetworkingHub;
