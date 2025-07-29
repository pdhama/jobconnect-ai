'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  FileText, 
  Mail, 
  Users, 
  ArrowRight, 
  CheckCircle,
  Star,
  TrendingUp,
  Zap
} from 'lucide-react'

export default function WelcomePage() {
  const [isSigningUp, setIsSigningUp] = useState(false)
  const router = useRouter()

  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Smart Job Search",
      description: "AI-powered job recommendations based on your skills and preferences"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Resume Builder",
      description: "Create professional resumes with AI assistance and optimization"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Cover Letter Generator",
      description: "Generate personalized cover letters for each job application"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Networking Assistant",
      description: "Connect with professionals and expand your network"
    }
  ]

  const stats = [
    { label: "Jobs Found", value: "10,000+", icon: <Search className="w-4 h-4" /> },
    { label: "Resumes Created", value: "5,000+", icon: <FileText className="w-4 h-4" /> },
    { label: "Success Rate", value: "85%", icon: <TrendingUp className="w-4 h-4" /> }
  ]

  const handleGetStarted = () => {
    setIsSigningUp(true)
    router.push('/')
  }

  const handleSignIn = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-8">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              JobConnect AI
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Your AI-powered career companion. Find jobs, build resumes, and network smarter with our intelligent platform designed for Indian professionals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                onClick={handleGetStarted}
                disabled={isSigningUp}
                size="lg"
                className="text-lg px-8 py-4"
              >
                {isSigningUp ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Setting up...
                  </>
                ) : (
                  <>
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
              <Button 
                onClick={handleSignIn}
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4"
              >
                Sign In
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center justify-center space-x-2 p-4 bg-muted/30 rounded-lg">
                  {stat.icon}
                  <div className="text-left">
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need for your career
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From job discovery to application success, we've got you covered with AI-powered tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-8">
            <Star className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to accelerate your career?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already using JobConnect AI to find their dream jobs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleGetStarted}
              disabled={isSigningUp}
              size="lg"
              className="text-lg px-8 py-4"
            >
              {isSigningUp ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Setting up...
                </>
              ) : (
                <>
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
            <Button 
              onClick={handleSignIn}
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 