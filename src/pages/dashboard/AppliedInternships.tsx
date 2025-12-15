import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, CheckCircle, Calendar, MapPin, DollarSign, 
  Filter, Search, Eye, MessageCircle, ExternalLink
} from "lucide-react";

const AppliedInternships = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  
  const applications = [
    {
      id: 1,
      company: "Google",
      role: "Software Engineering Intern",
      location: "Mountain View, CA",
      stipend: "$7,500/month",
      appliedDate: "2024-01-15",
      status: "interview",
      nextStep: "Technical Round - Jan 25, 2:00 PM",
      logo: "G",
      description: "Developing scalable web applications"
    },
    {
      id: 2,
      company: "Microsoft",
      role: "Product Manager Intern",
      location: "Seattle, WA",
      stipend: "$6,800/month",
      appliedDate: "2024-01-12",
      status: "pending",
      nextStep: "Waiting for HR response",
      logo: "M",
      description: "Product strategy and user research"
    },
    {
      id: 3,
      company: "Meta",
      role: "Data Science Intern",
      location: "Menlo Park, CA",
      stipend: "$8,200/month",
      appliedDate: "2024-01-10",
      status: "selected",
      nextStep: "Offer accepted - Starting March 1st",
      logo: "F",
      description: "Machine learning and analytics"
    },
    {
      id: 4,
      company: "Amazon",
      role: "Cloud Engineer Intern",
      location: "Remote",
      stipend: "$6,500/month",
      appliedDate: "2024-01-08",
      status: "rejected",
      nextStep: "Position filled",
      logo: "A",
      description: "AWS infrastructure development"
    },
    {
      id: 5,
      company: "Netflix",
      role: "ML Engineer Intern",
      location: "Los Gatos, CA",
      stipend: "$8,000/month",
      appliedDate: "2024-01-05",
      status: "interview",
      nextStep: "Final Round - Jan 30, 11:00 AM",
      logo: "N",
      description: "Recommendation algorithms"
    },
    {
      id: 6,
      company: "Apple",
      role: "iOS Developer Intern",
      location: "Cupertino, CA",
      stipend: "$7,200/month",
      appliedDate: "2024-01-03",
      status: "pending",
      nextStep: "Resume under review",
      logo: "🍎",
      description: "Mobile app development"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'selected':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          <CheckCircle className="w-3 h-3 mr-1" />
          Selected
        </Badge>;
      case 'interview':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          <Calendar className="w-3 h-3 mr-1" />
          Interview Scheduled
        </Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">
          ✕ Rejected
        </Badge>;
      default:
        return null;
    }
  };

  const filteredApplications = statusFilter === "all" 
    ? applications 
    : applications.filter(app => app.status === statusFilter);

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    interview: applications.filter(app => app.status === 'interview').length,
    selected: applications.filter(app => app.status === 'selected').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Applied Internships</h1>
        <p className="text-muted-foreground">Track all your internship applications and their status</p>
      </div>

      {/* Status Filter Tabs */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Applications', count: statusCounts.all },
              { key: 'pending', label: 'Pending', count: statusCounts.pending },
              { key: 'interview', label: 'Interview', count: statusCounts.interview },
              { key: 'selected', label: 'Selected', count: statusCounts.selected },
              { key: 'rejected', label: 'Rejected', count: statusCounts.rejected }
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={statusFilter === filter.key ? "default" : "outline"}
                onClick={() => setStatusFilter(filter.key)}
                className={`
                  ${statusFilter === filter.key 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary/50 hover:bg-secondary"
                  }
                `}
              >
                {filter.label}
                <Badge variant="secondary" className="ml-2 bg-background/50">
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Applications Grid */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <Card key={application.id} className="glass-card group hover:scale-[1.01] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Company Logo */}
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl pulse-glow">
                    {application.logo}
                  </div>

                  {/* Application Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                          {application.role}
                        </h3>
                        <p className="text-muted-foreground font-medium">{application.company}</p>
                      </div>
                      {getStatusBadge(application.status)}
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {application.description}
                    </p>

                    {/* Job Info */}
                    <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {application.location}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="w-4 h-4" />
                        {application.stipend}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        Applied {new Date(application.appliedDate).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Next Step */}
                    <div className="p-3 bg-secondary/30 rounded-lg border border-border/50 mb-4">
                      <p className="text-sm font-medium text-foreground mb-1">Next Step:</p>
                      <p className="text-sm text-muted-foreground">{application.nextStep}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      {application.status === 'interview' && (
                        <>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Join Interview
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                            <Calendar className="w-4 h-4 mr-1" />
                            Add to Calendar
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Job
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredApplications.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-secondary/50 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No applications found
            </h3>
            <p className="text-muted-foreground mb-4">
              {statusFilter === 'all' 
                ? "You haven't applied to any internships yet."
                : `No applications with "${statusFilter}" status.`
              }
            </p>
            <Button className="btn-neon">
              Find Internships
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AppliedInternships;