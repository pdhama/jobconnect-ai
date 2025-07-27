"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Search, 
  FileText, 
  Mail, 
  Users, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Sparkles,
  Target,
  Award,
  Zap
} from "lucide-react"

interface DashboardProps {
  onTabChange?: (tab: string) => void
}

export function Dashboard({ onTabChange }: DashboardProps) {
  const stats = [
    {
      title: "Relevant Jobs Posted Today",
      value: "24",
      change: "+8 from yesterday",
      icon: Search,
      color: "text-info-blue",
      bgColor: "bg-info-blue/10",
      trend: "up"
    },
    {
      title: "Cover Letters Created",
      value: "12",
      change: "+3 this week",
      icon: Mail,
      color: "text-accent",
      bgColor: "bg-accent/10",
      trend: "up"
    },
    {
      title: "Resumes Created",
      value: "8",
      change: "+2 this week",
      icon: FileText,
      color: "text-accent",
      bgColor: "bg-accent/10",
      trend: "up"
    },
    {
      title: "Networking Contacts",
      value: "25",
      change: "+5 this week",
      icon: Users,
      color: "text-fresh-green",
      bgColor: "bg-fresh-green/10",
      trend: "up"
    }
  ]

  const recentApplications = [
    {
      id: "1",
      company: "TechCorp India",
      position: "Senior Software Engineer",
      status: "Applied",
      date: "2 days ago",
      statusColor: "bg-info-blue/20 text-info-blue",
      matchScore: 92
    },
    {
      id: "2",
      company: "StartupXYZ",
      position: "Full Stack Developer",
      status: "Interview Scheduled",
      date: "3 days ago",
      statusColor: "bg-success-green/20 text-success-green",
      matchScore: 88
    },
    {
      id: "3",
      company: "Digital Solutions",
      position: "React Developer",
      status: "Under Review",
      date: "5 days ago",
      statusColor: "bg-warning-yellow/20 text-warning-yellow",
      matchScore: 85
    }
  ]

  const handleFindJobsToday = () => {
    if (onTabChange) {
      onTabChange("job-search")
    }
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6" />
            <span className="text-sm font-medium opacity-90">Welcome back!</span>
          </div>
          <h1 className="text-display-2 mb-3">Ready to accelerate your career?</h1>
          <p className="text-lg opacity-90 mb-6 max-w-2xl">
            Your AI-powered job search assistant is here to help you find the perfect opportunities and land your dream job.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleFindJobsToday}
              variant="glass" 
              size="lg"
              className="shadow-lg"
            >
              <Search className="w-5 h-5 mr-2" />
              Find Jobs For Me Posted Today
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="group hover:scale-105 transition-transform duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-small text-muted-foreground mb-2">{stat.title}</p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-success-green" />
                    <span className="text-sm text-success-green font-medium">{stat.change}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Applications & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Applications</span>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardTitle>
            <CardDescription>
              Track your job application progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentApplications.map((application) => (
              <div
                key={application.id}
                className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-foreground">{application.position}</h4>
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4 text-accent" />
                      <span className="text-sm font-medium text-accent">{application.matchScore}% match</span>
                    </div>
                  </div>
                  <p className="text-small text-muted-foreground mb-1">{application.company}</p>
                  <p className="text-xs text-muted-foreground">{application.date}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${application.statusColor}`}>
                    {application.status}
                  </span>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <div className="space-y-6">
          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-accent" />
                Upcoming Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-warning-yellow/10 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-foreground">Follow up with TechCorp</p>
                  <p className="text-xs text-muted-foreground">Application submitted 2 days ago</p>
                </div>
                <Button size="sm" variant="outline">
                  Remind
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-info-blue/10 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-foreground">Prepare for StartupXYZ interview</p>
                  <p className="text-xs text-muted-foreground">Scheduled for tomorrow</p>
                </div>
                <Button size="sm" variant="outline">
                  Prepare
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-success-green/10 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-foreground">Update LinkedIn profile</p>
                  <p className="text-xs text-muted-foreground">Last updated 2 weeks ago</p>
                </div>
                <Button size="sm" variant="outline">
                  Update
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 