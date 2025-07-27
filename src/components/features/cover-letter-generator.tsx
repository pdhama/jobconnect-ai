"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Mail, 
  Download, 
  Eye, 
  Sparkles, 
  Copy, 
  RefreshCw,
  Save,
  FileText,
  Building,
  User,
  Target,
  Award,
  Send,
  Edit3,
  CheckCircle,
  Plus
} from "lucide-react"

interface CoverLetterData {
  jobTitle: string
  companyName: string
  hiringManager: string
  keySkills: string[]
  experience: string
  motivation: string
  achievements: string[]
  tone: "professional" | "enthusiastic" | "confident" | "friendly"
}

export function CoverLetterGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [formData, setFormData] = useState<CoverLetterData>({
    jobTitle: "Senior Software Engineer",
    companyName: "TechCorp India",
    hiringManager: "Hiring Manager",
    keySkills: ["React", "Node.js", "TypeScript", "AWS"],
    experience: "5+ years in full-stack development",
    motivation: "I'm excited about the opportunity to contribute to innovative projects and grow with a dynamic team.",
    achievements: [
      "Led development of microservices architecture",
      "Improved system performance by 40%",
      "Mentored 3 junior developers"
    ],
    tone: "professional"
  })

  const tones = [
    { id: "professional", label: "Professional", description: "Formal and business-like" },
    { id: "enthusiastic", label: "Enthusiastic", description: "Energetic and passionate" },
    { id: "confident", label: "Confident", description: "Assured and self-assured" },
    { id: "friendly", label: "Friendly", description: "Warm and approachable" }
  ]

  const generateCoverLetter = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const generatedLetter = `Dear ${formData.hiringManager},

I am writing to express my strong interest in the ${formData.jobTitle} position at ${formData.companyName}. With ${formData.experience}, I am confident in my ability to make significant contributions to your team.

${formData.motivation}

My expertise in ${formData.keySkills.join(", ")} aligns perfectly with the requirements of this role. Throughout my career, I have demonstrated the ability to:

${formData.achievements.map(achievement => `• ${achievement}`).join("\n")}

I am particularly drawn to ${formData.companyName}'s commitment to innovation and excellence. The opportunity to work on cutting-edge projects while collaborating with talented professionals is exactly what I'm looking for in my next role.

I would welcome the opportunity to discuss how my skills and experience can contribute to ${formData.companyName}'s continued success. Thank you for considering my application.

Best regards,
[Your Name]`

    setCoverLetter(generatedLetter)
    setIsGenerating(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter)
    // In real implementation, show a toast notification
  }

  const downloadCoverLetter = () => {
    // In real implementation, generate and download PDF
    console.log("Downloading cover letter...")
  }

  const addSkill = (skill: string) => {
    if (skill.trim() && !formData.keySkills.includes(skill.trim())) {
      setFormData(prev => ({
        ...prev,
        keySkills: [...prev.keySkills, skill.trim()]
      }))
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      keySkills: prev.keySkills.filter(skill => skill !== skillToRemove)
    }))
  }

  const addAchievement = (achievement: string) => {
    if (achievement.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, achievement.trim()]
      }))
    }
  }

  const removeAchievement = (achievementToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter(achievement => achievement !== achievementToRemove)
    }))
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-4">
            <Mail className="w-6 h-6" />
            <span className="text-sm font-medium opacity-90">AI-Powered Cover Letter Generator</span>
          </div>
          <h1 className="text-display-2 mb-3">Write Compelling Cover Letters</h1>
          <p className="text-lg opacity-90 mb-8 max-w-2xl">
            Generate personalized cover letters that highlight your skills and match the job requirements using AI.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={generateCoverLetter}
              disabled={isGenerating}
              variant="accent" 
              size="lg"
              className="shadow-lg"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Cover Letter
                </>
              )}
            </Button>
            <Button 
              onClick={downloadCoverLetter}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="space-y-6">
          {/* Job Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-accent" />
                Job Information
              </CardTitle>
              <CardDescription>
                Details about the position you're applying for
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Job Title</label>
                <Input 
                  value={formData.jobTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Company Name</label>
                <Input 
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="e.g., TechCorp India"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Hiring Manager</label>
                <Input 
                  value={formData.hiringManager}
                  onChange={(e) => setFormData(prev => ({ ...prev, hiringManager: e.target.value }))}
                  placeholder="e.g., Hiring Manager or specific name"
                />
              </div>
            </CardContent>
          </Card>

          {/* Your Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-accent" />
                Your Profile
              </CardTitle>
              <CardDescription>
                Information about your background and experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Years of Experience</label>
                <Input 
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  placeholder="e.g., 5+ years in full-stack development"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Key Skills</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.keySkills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full">
                      <span className="text-sm font-medium">{skill}</span>
                      <button
                        onClick={() => removeSkill(skill)}
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
                        addSkill(e.currentTarget.value.trim())
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Motivation</label>
                <Textarea 
                  value={formData.motivation}
                  onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                  placeholder="Why are you interested in this role?"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-accent" />
                Key Achievements
              </CardTitle>
              <CardDescription>
                Highlight your most relevant accomplishments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {formData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-muted/30 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-success-green flex-shrink-0" />
                    <span className="text-sm flex-1">{achievement}</span>
                    <button
                      onClick={() => removeAchievement(achievement)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Add an achievement"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      addAchievement(e.currentTarget.value.trim())
                      e.currentTarget.value = ''
                    }
                  }}
                />
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tone Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-accent" />
                Writing Tone
              </CardTitle>
              <CardDescription>
                Choose the tone that best fits the company culture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {tones.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setFormData(prev => ({ ...prev, tone: tone.id as any }))}
                    className={`p-3 rounded-xl text-left transition-all duration-200 ${
                      formData.tone === tone.id
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted/30 hover:bg-muted/50"
                    }`}
                  >
                    <div className="font-medium">{tone.label}</div>
                    <div className="text-sm opacity-75">{tone.description}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Generated Cover Letter */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-accent" />
                  Generated Cover Letter
                </span>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={copyToClipboard}
                    disabled={!coverLetter}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={downloadCoverLetter}
                    disabled={!coverLetter}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {coverLetter ? (
                <div className="bg-muted/30 rounded-xl p-6 border border-border">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {coverLetter}
                  </div>
                </div>
              ) : (
                <div className="bg-muted/30 rounded-xl p-8 border border-border text-center">
                  <Mail className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-2">No cover letter generated yet</p>
                  <p className="text-sm text-muted-foreground">
                    Fill out the form and click "Generate Cover Letter" to create your personalized cover letter.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-accent" />
                Writing Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-info-blue/10 rounded-xl">
                <div className="w-2 h-2 bg-info-blue rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-foreground">Keep it concise</p>
                  <p className="text-xs text-muted-foreground">Aim for 250-400 words</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-success-green/10 rounded-xl">
                <div className="w-2 h-2 bg-success-green rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-foreground">Show enthusiasm</p>
                  <p className="text-xs text-muted-foreground">Express genuine interest in the role</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-accent/10 rounded-xl">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-foreground">Quantify achievements</p>
                  <p className="text-xs text-muted-foreground">Use specific numbers and metrics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 