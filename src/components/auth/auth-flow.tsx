'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'
import { signUp, signIn, getUserProfile } from '@/lib/supabase-enhanced'
import { Loader2, Mail, Lock, User, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'

interface AuthFlowProps {
  onSuccess?: () => void
  redirectTo?: string
}

export function AuthFlow({ onSuccess, redirectTo = '/dashboard' }: AuthFlowProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [step, setStep] = useState<'auth' | 'profile' | 'complete'>('auth')
  const router = useRouter()
  const { user } = useAuth()

  // Check if user has a profile
  useEffect(() => {
    const checkProfile = async () => {
      if (user) {
        try {
          const profile = await getUserProfile(user.id)
          if (profile) {
            setStep('complete')
            if (onSuccess) onSuccess()
            router.push(redirectTo)
          } else {
            setStep('profile')
          }
        } catch (error) {
          console.error('Error checking profile:', error)
        }
      }
    }

    if (user) {
      checkProfile()
    }
  }, [user, onSuccess, redirectTo, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long')
        return
      }
    }

    setIsLoading(true)

    try {
      if (isSignUp) {
        console.log('🚀 Starting sign up process...')
        
        await signUp(formData.email, formData.password, {
          full_name: formData.fullName
        })

        setSuccess('Account created successfully! Please check your email to verify your account.')
        
        // Clear form
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          fullName: ''
        })

        // Wait a moment then redirect
        setTimeout(() => {
          router.push('/auth/verify-email')
        }, 2000)
        
      } else {
        console.log('🔐 Starting sign in process...')
        
        await signIn(formData.email, formData.password)
        
        setSuccess('Welcome back! Redirecting to your dashboard...')
        
        // Clear form
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          fullName: ''
        })

        // Wait a moment then redirect
        setTimeout(() => {
          router.push(redirectTo)
        }, 2000)
      }
      
    } catch (error: any) {
      console.error('❌ Authentication failed:', error)
      
      // Enhanced error handling
      if (error.message.includes('Database error')) {
        setError('Database setup issue. Please contact support.')
      } else if (error.message.includes('policy')) {
        setError('Security policy issue. Please contact support.')
      } else if (error.message.includes('already registered')) {
        setError('An account with this email already exists. Please sign in instead.')
        setIsSignUp(false)
      } else if (error.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.')
      } else if (error.message.includes('Email not confirmed')) {
        setError('Please check your email and click the verification link before signing in.')
      } else {
        setError(error.message || 'Authentication failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const renderAuthForm = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl">
          {isSignUp ? 'Create Your Account' : 'Welcome Back'}
        </CardTitle>
        <p className="text-muted-foreground">
          {isSignUp 
            ? 'Join JobConnect AI to start your career journey'
            : 'Sign in to continue to your dashboard'
          }
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  required={isSignUp}
                  disabled={isLoading}
                  className="pl-10"
                  placeholder="Enter your full name"
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                disabled={isLoading}
                className="pl-10"
                placeholder="Enter your email"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                minLength={6}
                required
                disabled={isLoading}
                className="pl-10"
                placeholder="Enter your password"
              />
            </div>
          </div>
          
          {isSignUp && (
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  minLength={6}
                  required={isSignUp}
                  disabled={isLoading}
                  className="pl-10"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          )}
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </>
            ) : (
              <>
                {isSignUp ? 'Create Account' : 'Sign In'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
                setSuccess(null)
              }}
              className="ml-1 text-primary hover:underline font-medium"
            >
              {isSignUp ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  )

  const renderProfileSetup = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
        <p className="text-muted-foreground">
          Let's set up your profile to personalize your experience
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Your account has been created successfully! We're setting up your profile...
            </p>
          </div>
          
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            Redirecting to your dashboard...
          </p>
        </div>
      </CardContent>
    </Card>
  )

  const renderComplete = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl">Welcome to JobConnect AI!</CardTitle>
        <p className="text-muted-foreground">
          Your account is ready. Redirecting to your dashboard...
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === 'auth' && renderAuthForm()}
        {step === 'profile' && renderProfileSetup()}
        {step === 'complete' && renderComplete()}
      </div>
    </div>
  )
} 