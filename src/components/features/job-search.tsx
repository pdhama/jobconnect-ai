"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Building, Clock, ExternalLink, Bookmark, Filter, Sparkles, Award, TrendingUp } from "lucide-react"

interface Job {
  id: string
  title: string
  company: string
  location: string
  postedTime: string
  platform: string
  jobUrl: string
  description: string
  salary?: string
  matchScore?: number
  isRemote?: boolean
  isUrgent?: boolean
}

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "TechCorp India",
    location: "Bangalore, India",
    postedTime: "2 hours ago",
    platform: "LinkedIn",
    jobUrl: "#",
    description: "We're looking for a Senior Software Engineer to join our team and help build scalable applications...",
    salary: "₹15-25 LPA",
    matchScore: 92,
    isRemote: true,
    isUrgent: true
  },
  {
    id: "2",
    title: "Full Stack Developer",
    company: "StartupXYZ",
    location: "Mumbai, India",
    postedTime: "5 hours ago",
    platform: "Naukri",
    jobUrl: "#",
    description: "Join our fast-growing startup as a Full Stack Developer and work on cutting-edge technologies...",
    salary: "₹12-20 LPA",
    matchScore: 88,
    isRemote: false
  },
  {
    id: "3",
    title: "React Developer",
    company: "Digital Solutions",
    location: "Delhi, India",
    postedTime: "1 day ago",
    platform: "LinkedIn",
    jobUrl: "#",
    description: "We need a skilled React Developer to build amazing user experiences and contribute to our product...",
    salary: "₹10-18 LPA",
    matchScore: 85,
    isRemote: true
  }
]

export function JobSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const [jobs, setJobs] = useState<Job[]>(mockJobs)
  const [isSearching, setIsSearching] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const handleSearch = async () => {
    setIsSearching(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSearching(false)
    // In real implementation, this would call your job scraping API
  }

  const saveJob = (jobId: string) => {
    // In real implementation, this would save to database
    console.log("Saving job:", jobId)
  }

  const filters = [
    { id: "remote", label: "Remote", icon: "🏠" },
    { id: "urgent", label: "Urgent", icon: "⚡" },
    { id: "high-salary", label: "High Salary", icon: "💰" },
    { id: "startup", label: "Startup", icon: "🚀" }
  ]

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    )
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      {/* Hero Search Section */}
      <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-6 h-6" />
            <span className="text-sm font-medium opacity-90">Find Your Dream Job</span>
          </div>
          <h1 className="text-display-2 mb-3">Discover Opportunities</h1>
          <p className="text-lg opacity-90 mb-8 max-w-2xl">
            Search across multiple job platforms to find the perfect opportunity that matches your skills and career goals.
          </p>
          
          {/* Search Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              placeholder="Job title, keywords, or company"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
            />
            <Input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
            />
            <Button 
              onClick={handleSearch} 
              disabled={isSearching}
              variant="accent"
              size="lg"
              className="shadow-lg"
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Search Jobs
                </>
              )}
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedFilters.includes(filter.id)
                    ? "bg-white text-primary shadow-md"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <span className="mr-2">{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Job Results */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-h2 font-bold text-foreground">Found {jobs.length} jobs</h3>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Updated 2 minutes ago</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              Sort
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="group hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Job Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-h4 font-semibold text-foreground hover:text-primary transition-colors cursor-pointer">
                            {job.title}
                          </h4>
                          {job.isUrgent && (
                            <span className="px-2 py-1 bg-accent/20 text-accent text-xs font-medium rounded-full">
                              Urgent
                            </span>
                          )}
                          {job.isRemote && (
                            <span className="px-2 py-1 bg-success-green/20 text-success-green text-xs font-medium rounded-full">
                              Remote
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-muted-foreground mb-3">
                          <div className="flex items-center space-x-1">
                            <Building className="w-4 h-4" />
                            <span className="text-sm">{job.company}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{job.postedTime}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {job.matchScore && (
                          <div className="flex items-center space-x-1 bg-primary/10 px-3 py-1 rounded-full">
                            <Award className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">{job.matchScore}% match</span>
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => saveJob(job.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Bookmark className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Job Description */}
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {job.description}
                    </p>
                    
                    {/* Job Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {job.salary && (
                          <span className="text-sm font-medium text-success-green">
                            {job.salary}
                          </span>
                        )}
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                          {job.platform}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Job
                        </Button>
                        <Button size="sm" variant="accent">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Resume
                        </Button>
                        <Button size="sm" variant="outline">
                          Write Cover Letter
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Jobs
          </Button>
        </div>
      </div>
    </div>
  )
} 