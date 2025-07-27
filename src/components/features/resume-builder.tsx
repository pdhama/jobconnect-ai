"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  FileText, 
  Download, 
  Eye, 
  Edit3, 
  Plus, 
  Trash2, 
  Sparkles,
  Award,
  Briefcase,
  GraduationCap,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Save,
  RefreshCw
} from "lucide-react"

interface ResumeSection {
  id: string
  title: string
  content: string
  type: "text" | "list" | "experience" | "education"
}

export function ResumeBuilder() {
  const [activeSection, setActiveSection] = useState("personal")
  const [resumeData, setResumeData] = useState({
    personal: {
      name: "Rahul Sharma",
      email: "rahul.sharma@email.com",
      phone: "+91 98765 43210",
      location: "Bangalore, India",
      website: "rahulsharma.dev",
      linkedin: "linkedin.com/in/rahulsharma",
      github: "github.com/rahulsharma"
    },
    summary: "Experienced software engineer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about building scalable applications and leading technical teams.",
    experience: [
      {
        id: "1",
        title: "Senior Software Engineer",
        company: "TechCorp India",
        duration: "2022 - Present",
        description: "Led development of microservices architecture, improved system performance by 40%, mentored junior developers."
      },
      {
        id: "2",
        title: "Full Stack Developer",
        company: "StartupXYZ",
        duration: "2020 - 2022",
        description: "Built and deployed 3 major features, reduced bug reports by 60%, implemented CI/CD pipeline."
      }
    ],
    education: [
      {
        id: "1",
        degree: "Bachelor of Technology in Computer Science",
        institution: "IIT Delhi",
        duration: "2016 - 2020",
        gpa: "8.5/10"
      }
    ],
    skills: ["React", "Node.js", "TypeScript", "Python", "AWS", "Docker", "MongoDB", "PostgreSQL"],
    projects: [
      {
        id: "1",
        title: "E-commerce Platform",
        description: "Built a full-stack e-commerce platform with React, Node.js, and MongoDB",
        tech: ["React", "Node.js", "MongoDB", "Stripe"]
      }
    ]
  })

  const sections = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "summary", label: "Summary", icon: FileText },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Award },
    { id: "projects", label: "Projects", icon: Globe }
  ]

  const generateResume = () => {
    // In real implementation, this would call AI service
    console.log("Generating AI-optimized resume...")
  }

  const downloadResume = () => {
    // In real implementation, this would generate PDF
    console.log("Downloading resume as PDF...")
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-6 h-6" />
            <span className="text-sm font-medium opacity-90">AI-Powered Resume Builder</span>
          </div>
          <h1 className="text-display-2 mb-3">Create Your Perfect Resume</h1>
          <p className="text-lg opacity-90 mb-8 max-w-2xl">
            Build a professional resume that stands out with AI-powered optimization and ATS-friendly formatting.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={generateResume}
              variant="accent" 
              size="lg"
              className="shadow-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              AI Optimize Resume
            </Button>
            <Button 
              onClick={downloadResume}
              variant="glass" 
              size="lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar - Section Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-accent" />
                Resume Sections
              </CardTitle>
              <CardDescription>
                Complete each section to build your resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon
                  const isActive = activeSection === section.id
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Resume Preview */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-accent" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-xl p-4 min-h-[300px] border border-border">
                <div className="text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Resume preview will appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  {(() => {
                    const Icon = sections.find(s => s.id === activeSection)?.icon || FileText
                    return <Icon className="w-5 h-5 text-accent" />
                  })()}
                  <span>{sections.find(s => s.id === activeSection)?.label}</span>
                </span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Information */}
              {activeSection === "personal" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Full Name</label>
                    <Input 
                      value={resumeData.personal.name}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, name: e.target.value }
                      }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                    <Input 
                      value={resumeData.personal.email}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, email: e.target.value }
                      }))}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Phone</label>
                    <Input 
                      value={resumeData.personal.phone}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, phone: e.target.value }
                      }))}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Location</label>
                    <Input 
                      value={resumeData.personal.location}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, location: e.target.value }
                      }))}
                      placeholder="City, State"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Website</label>
                    <Input 
                      value={resumeData.personal.website}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, website: e.target.value }
                      }))}
                      placeholder="yourwebsite.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">LinkedIn</label>
                    <Input 
                      value={resumeData.personal.linkedin}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, linkedin: e.target.value }
                      }))}
                      placeholder="linkedin.com/in/username"
                    />
                  </div>
                </div>
              )}

              {/* Professional Summary */}
              {activeSection === "summary" && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Professional Summary</label>
                  <Textarea 
                    value={resumeData.summary}
                    onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                    placeholder="Write a compelling professional summary..."
                    rows={6}
                  />
                  <div className="mt-2 text-xs text-muted-foreground">
                    {resumeData.summary.length}/500 characters
                  </div>
                </div>
              )}

              {/* Work Experience */}
              {activeSection === "experience" && (
                <div className="space-y-4">
                  {resumeData.experience.map((exp, index) => (
                    <Card key={exp.id} className="border border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <Input 
                              value={exp.title}
                              onChange={(e) => {
                                const newExp = [...resumeData.experience]
                                newExp[index].title = e.target.value
                                setResumeData(prev => ({ ...prev, experience: newExp }))
                              }}
                              placeholder="Job Title"
                              className="mb-2"
                            />
                            <Input 
                              value={exp.company}
                              onChange={(e) => {
                                const newExp = [...resumeData.experience]
                                newExp[index].company = e.target.value
                                setResumeData(prev => ({ ...prev, experience: newExp }))
                              }}
                              placeholder="Company Name"
                              className="mb-2"
                            />
                            <Input 
                              value={exp.duration}
                              onChange={(e) => {
                                const newExp = [...resumeData.experience]
                                newExp[index].duration = e.target.value
                                setResumeData(prev => ({ ...prev, experience: newExp }))
                              }}
                              placeholder="Duration (e.g., 2020 - 2022)"
                            />
                          </div>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea 
                          value={exp.description}
                          onChange={(e) => {
                            const newExp = [...resumeData.experience]
                            newExp[index].description = e.target.value
                            setResumeData(prev => ({ ...prev, experience: newExp }))
                          }}
                          placeholder="Describe your responsibilities and achievements..."
                          rows={3}
                        />
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
              )}

              {/* Education */}
              {activeSection === "education" && (
                <div className="space-y-4">
                  {resumeData.education.map((edu, index) => (
                    <Card key={edu.id} className="border border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 space-y-2">
                            <Input 
                              value={edu.degree}
                              onChange={(e) => {
                                const newEdu = [...resumeData.education]
                                newEdu[index].degree = e.target.value
                                setResumeData(prev => ({ ...prev, education: newEdu }))
                              }}
                              placeholder="Degree"
                            />
                            <Input 
                              value={edu.institution}
                              onChange={(e) => {
                                const newEdu = [...resumeData.education]
                                newEdu[index].institution = e.target.value
                                setResumeData(prev => ({ ...prev, education: newEdu }))
                              }}
                              placeholder="Institution"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <Input 
                                value={edu.duration}
                                onChange={(e) => {
                                  const newEdu = [...resumeData.education]
                                  newEdu[index].duration = e.target.value
                                  setResumeData(prev => ({ ...prev, education: newEdu }))
                                }}
                                placeholder="Duration"
                              />
                              <Input 
                                value={edu.gpa}
                                onChange={(e) => {
                                  const newEdu = [...resumeData.education]
                                  newEdu[index].gpa = e.target.value
                                  setResumeData(prev => ({ ...prev, education: newEdu }))
                                }}
                                placeholder="GPA"
                              />
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </Button>
                </div>
              )}

              {/* Skills */}
              {activeSection === "skills" && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Skills</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {resumeData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full">
                        <span className="text-sm font-medium">{skill}</span>
                        <button
                          onClick={() => {
                            const newSkills = resumeData.skills.filter((_, i) => i !== index)
                            setResumeData(prev => ({ ...prev, skills: newSkills }))
                          }}
                          className="text-primary hover:text-destructive"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="Add a skill"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          setResumeData(prev => ({
                            ...prev,
                            skills: [...prev.skills, e.currentTarget.value.trim()]
                          }))
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                    <Button variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Projects */}
              {activeSection === "projects" && (
                <div className="space-y-4">
                  {resumeData.projects.map((project, index) => (
                    <Card key={project.id} className="border border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 space-y-2">
                            <Input 
                              value={project.title}
                              onChange={(e) => {
                                const newProjects = [...resumeData.projects]
                                newProjects[index].title = e.target.value
                                setResumeData(prev => ({ ...prev, projects: newProjects }))
                              }}
                              placeholder="Project Title"
                            />
                            <Textarea 
                              value={project.description}
                              onChange={(e) => {
                                const newProjects = [...resumeData.projects]
                                newProjects[index].description = e.target.value
                                setResumeData(prev => ({ ...prev, projects: newProjects }))
                              }}
                              placeholder="Project description..."
                              rows={2}
                            />
                            <Input 
                              value={project.tech.join(', ')}
                              onChange={(e) => {
                                const newProjects = [...resumeData.projects]
                                newProjects[index].tech = e.target.value.split(',').map(t => t.trim())
                                setResumeData(prev => ({ ...prev, projects: newProjects }))
                              }}
                              placeholder="Technologies used (comma separated)"
                            />
                          </div>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 