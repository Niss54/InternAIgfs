import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Edit, Download, ExternalLink, Code } from 'lucide-react';

const leftItems = [
  'Profile',
  'Projects',
  'Skills',
  'Services',
  'Portfolio',
  'Reviews',
  'Achievements',
  'Certifications',
  'Contact',
  'Theme',
  'Publish',
];

const PortfolioBuilder: React.FC = () => {
  const handlePublish = () => {
    alert('Portfolio will be available at:\nhttps://internai.com/portfolio/username\n(After approval)');
  };

  return (
    <div className="min-h-screen relative">
      {/* subtle background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_rgba(0,180,255,0.06),_transparent_25%),radial-gradient(ellipse_at_bottom_right,_rgba(100,116,255,0.03),_transparent_20%)]" />

      <div className="grid grid-cols-12 gap-6">
        {/* Left builder sidebar (inside page) */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="glass-card sticky top-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Builder</h3>
            <ul className="space-y-2">
              {leftItems.map((it) => (
                <li key={it} className="flex items-center justify-between p-2 rounded-md hover:bg-white/5 transition-colors">
                  <span className="text-sm text-foreground">{it}</span>
                  <Edit className="w-4 h-4 text-muted-foreground" />
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Button className="w-full btn-neon" onClick={handlePublish}>Publish</Button>
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <main className="col-span-12 lg:col-span-9 space-y-6">
          {/* Hero / Profile Section */}
          <section className="glass-card p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground" style={{ boxShadow: 'var(--shadow-neon)' }}>
              IMG
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">Your Name</h2>
              <p className="text-muted-foreground">Your Professional Title</p>
              <p className="mt-3 text-sm text-muted-foreground max-w-2xl">A short bio goes here. Describe who you are, what you build, and what you want to achieve. This is placeholder text to show layout.</p>
              <div className="mt-4 flex gap-3">
                <Button className="btn-pulse">Hire Me</Button>
                <Button variant="outline" className="btn-secondary-glow">Contact Me</Button>
                <Button variant="outline" className="btn-secondary-glow"><Download className="w-4 h-4 mr-2" />Download CV</Button>
              </div>
            </div>
          </section>

          {/* About & Skills */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">About</h3>
              <p className="text-sm text-muted-foreground">This about section contains a descriptive paragraph about the user. It is static placeholder copy used to demonstrate layout and styling for submission purposes.</p>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-foreground mb-2">Skills</h4>
                <div className="space-y-3">
                  {['HTML', 'CSS', 'JavaScript', 'React'].map((s, i) => (
                    <div key={s}>
                      <div className="flex justify-between text-sm text-muted-foreground mb-1"><span>{s}</span><span>{(80 - i * 10)}%</span></div>
                      <div className="w-full bg-input/50 h-2 rounded-full overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-primary to-accent" style={{ width: `${80 - i * 10}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">Services / Why Choose Me</h3>
              <div className="grid grid-cols-1 gap-3">
                {['Web Development','App Design','Branding','UI/UX'].map(s => (
                  <div key={s} className="glass-card p-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-foreground">{s}</div>
                      <div className="text-xs text-muted-foreground">Short description about the service</div>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Projects */}
          <section className="glass-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Portfolio / Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1,2,3].map((n) => (
                <Card key={n} className="p-3 glass-card">
                  <div className="w-full h-36 bg-gradient-to-br from-primary/10 to-accent/5 rounded-md mb-3 flex items-center justify-center text-muted-foreground">Image</div>
                  <h4 className="text-sm font-semibold text-foreground">Project {n}</h4>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="text-xs text-muted-foreground px-2 py-1 bg-input/30 rounded">React</span>
                    <span className="text-xs text-muted-foreground px-2 py-1 bg-input/30 rounded">Tailwind</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button asChild size="sm"><a><ExternalLink className="w-4 h-4 mr-2"/>Live Demo</a></Button>
                    <Button asChild variant="outline" size="sm"><a><Code className="w-4 h-4 mr-2"/>Code</a></Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Reviews */}
          <section className="glass-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Reviews</h3>
            <div className="p-4 bg-card/60 rounded-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">A</div>
                <div>
                  <div className="flex items-center gap-2"><Star className="w-4 h-4 text-accent"/><Star className="w-4 h-4 text-accent"/><Star className="w-4 h-4 text-accent"/><Star className="w-4 h-4 text-accent"/><Star className="w-4 h-4 text-muted-foreground"/></div>
                  <p className="text-sm text-muted-foreground mt-2">"Great work! Delivered on time and exceeded expectations."</p>
                  <div className="text-xs text-muted-foreground mt-2">— Alex Johnson</div>
                </div>
              </div>
            </div>
          </section>

          {/* Achievements & Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { t: 'Projects Done', v: 24 },
              { t: 'Happy Clients', v: 18 },
              { t: 'Experience (yrs)', v: 3 },
              { t: 'Certifications', v: 5 },
            ].map((s) => (
              <Card key={s.t} className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{s.v}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.t}</div>
              </Card>
            ))}
          </section>

          {/* Contact Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">Contact</h3>
              <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); alert('This is a demo form.'); }}>
                <input placeholder="Name" className="w-full input-glass" />
                <input placeholder="Email" className="w-full input-glass" />
                <textarea placeholder="Message" className="w-full input-glass h-24" />
                <div className="flex gap-3">
                  <Button type="submit">Send</Button>
                  <Button variant="outline">Clear</Button>
                </div>
              </form>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">Contact Info</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>Email: you@internai.com</div>
                <div>Phone: +91 99999 99999</div>
                <div>Location: Lucknow, India</div>
              </div>
            </div>
          </section>

          <div className="text-sm text-muted-foreground">This feature is under development and will be available soon.</div>

          {/* Footer */}
          <footer className="mt-6 text-center text-xs text-muted-foreground">© InternAI. Made by InternAI</footer>
        </main>
      </div>
    </div>
  );
};

export default PortfolioBuilder;