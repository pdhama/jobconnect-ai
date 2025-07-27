"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Users, 
  Search, 
  MessageSquare, 
  Send, 
  UserPlus, 
  Sparkles,
  Building,
  MapPin,
  Briefcase,
  Mail,
  Linkedin,
  Globe,
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  Star,
  Filter,
  SortAsc,
  Plus,
  Edit3,
  Trash2
} from "lucide-react"

interface Contact {
  id: string
  name: string
  title: string
  company: string
  location: string
  email: string
  linkedin: string
  avatar: string
  mutualConnections: number
  commonalities: string[]
  lastContact?: string
  status: "new" | "contacted" | "responded" | "meeting"
}

interface MessageTemplate {
  id: string
  name: string
  content: string
  type: "linkedin" | "email" | "general"
}

export function Networking() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Priya Sharma",
      title: "Senior Product Manager",
      company: "TechCorp India",
      location: "Bangalore, India",
      email: "priya.sharma@techcorp.com",
      linkedin: "linkedin.com/in/priyasharma",
      avatar: "PS",
      mutualConnections: 5,
      commonalities: ["IIT Delhi", "Product Management", "Tech Industry"],
      status: "new"
    },
    {
      id: "2",
      name: "Arjun Patel",
      title: "Engineering Manager",
      company: "StartupXYZ",
      location: "Mumbai, India",
      email: "arjun.patel@startupxyz.com",
      linkedin: "linkedin.com/in/arjunpatel",
      avatar: "AP",
      mutualConnections: 3,
      commonalities: ["React", "Node.js", "Startup Experience"],
      lastContact: "2 days ago",
      status: "contacted"
    },
    {
      id: "3",
      name: "Meera Reddy",
      title: "VP of Engineering",
      company: "Digital Solutions",
      location: "Delhi, India",
      email: "meera.reddy@digitalsolutions.com",
      linkedin: "linkedin.com/in/meerareddy",
      avatar: "MR",
      mutualConnections: 8,
      commonalities: ["Leadership", "Engineering", "Women in Tech"],
      lastContact: "1 week ago",
      status: "responded"
    }
  ])

  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>([
    {
      id: "1",
      name: "General Introduction",
      content: "Hi [Name], I came across your profile and was impressed by your work at [Company]. I'm also passionate about [Common Interest] and would love to connect and learn from your experience.",
      type: "general"
    },
    {
      id: "2",
      name: "Job Referral Request",
      content: "Hi [Name], I hope you're doing well! I noticed you work at [Company] and I'm very interested in the [Position] role. Would you be open to a brief conversation about your experience there?",
      type: "linkedin"
    },
    {
      id: "3",
      name: "Industry Discussion",
      content: "Hi [Name], I've been following your work in [Industry] and would love to connect. I'm particularly interested in [Specific Topic] and would appreciate your insights.",
      type: "email"
    }
  ])

  const companies = ["TechCorp India", "StartupXYZ", "Digital Solutions", "All Companies"]
  const statusFilters = ["All", "New", "Contacted", "Responded", "Meeting"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-info-blue/20 text-info-blue"
      case "contacted": return "bg-warning-yellow/20 text-warning-yellow"
      case "responded": return "bg-success-green/20 text-success-green"
      case "meeting": return "bg-accent/20 text-accent"
      default: return "bg-muted/30 text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new": return <UserPlus className="w-4 h-4" />
      case "contacted": return <MessageSquare className="w-4 h-4" />
      case "responded": return <CheckCircle className="w-4 h-4" />
      case "meeting": return <Clock className="w-4 h-4" />
      default: return <Users className="w-4 h-4" />
    }
  }

  const sendMessage = (contactId: string, templateId: string) => {
    // In real implementation, this would send the message
    console.log(`Sending message to ${contactId} using template ${templateId}`)
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-6 h-6" />
            <span className="text-sm font-medium opacity-90">AI-Powered Networking Assistant</span>
          </div>
          <h1 className="text-display-2 mb-3">Build Your Professional Network</h1>
          <p className="text-lg opacity-90 mb-8 max-w-2xl">
            Discover and connect with professionals in your industry. Use AI-powered insights to craft personalized messages and grow your network strategically.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="accent" 
              size="lg"
              className="shadow-lg"
            >
              <Search className="w-5 h-5 mr-2" />
              Find Connections
            </Button>
            <Button 
              variant="glass" 
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              AI Message Generator
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Search Contacts</label>
              <Input 
                placeholder="Search by name, company, or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Company</label>
              <select 
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full h-12 rounded-xl border-2 border-input bg-background px-4 py-3 text-base focus-visible:outline-none focus-visible:border-ring transition-all duration-200"
              >
                {companies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
              <div className="flex flex-wrap gap-2">
                {statusFilters.map(status => (
                  <button
                    key={status}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Contact Discovery */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-accent" />
                  Discovered Contacts
                </span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <SortAsc className="w-4 h-4 mr-2" />
                    Sort
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                {contacts.length} professionals found in your target companies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <Card key={contact.id} className="border border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white font-semibold">
                          {contact.avatar}
                        </div>
                        
                        {/* Contact Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-foreground mb-1">{contact.name}</h4>
                              <p className="text-sm text-muted-foreground mb-1">{contact.title}</p>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Building className="w-3 h-3" />
                                  <span>{contact.company}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{contact.location}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="w-3 h-3" />
                                  <span>{contact.mutualConnections} mutual</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Status Badge */}
                            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                              {getStatusIcon(contact.status)}
                              <span className="capitalize">{contact.status}</span>
                            </div>
                          </div>
                          
                          {/* Commonalities */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {contact.commonalities.map((commonality, index) => (
                              <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                {commonality}
                              </span>
                            ))}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Linkedin className="w-4 h-4 mr-2" />
                              View Profile
                            </Button>
                            <Button size="sm" variant="outline">
                              <Mail className="w-4 h-4 mr-2" />
                              Send Email
                            </Button>
                            <Button size="sm" variant="accent">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Send Message
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Message Templates & Analytics */}
        <div className="space-y-6">
          {/* Message Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-accent" />
                  Message Templates
                </span>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {messageTemplates.map((template) => (
                  <div key={template.id} className="p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-foreground">{template.name}</h4>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {template.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground capitalize">{template.type}</span>
                      <Button size="sm" variant="outline">
                        <Send className="w-3 h-3 mr-1" />
                        Use
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Networking Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Networking Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-success-green/10 rounded-xl">
                  <div className="text-2xl font-bold text-success-green">25</div>
                  <div className="text-xs text-muted-foreground">Total Contacts</div>
                </div>
                <div className="text-center p-4 bg-info-blue/10 rounded-xl">
                  <div className="text-2xl font-bold text-info-blue">8</div>
                  <div className="text-xs text-muted-foreground">Responses</div>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-xl">
                  <div className="text-2xl font-bold text-accent">3</div>
                  <div className="text-xs text-muted-foreground">Meetings</div>
                </div>
                <div className="text-center p-4 bg-warning-yellow/10 rounded-xl">
                  <div className="text-2xl font-bold text-warning-yellow">32%</div>
                  <div className="text-xs text-muted-foreground">Response Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-accent" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Search className="w-4 h-4 mr-2" />
                Find Alumni
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Building className="w-4 h-4 mr-2" />
                Company Employees
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Briefcase className="w-4 h-4 mr-2" />
                Industry Leaders
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Globe className="w-4 h-4 mr-2" />
                Event Attendees
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 