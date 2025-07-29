'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

export default function VerifyEmailPage() {
  const [isChecking, setIsChecking] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleCheckVerification = async () => {
    setIsChecking(true)
    
    // Simulate checking verification status
    setTimeout(() => {
      setIsChecking(false)
      // In a real app, you would check the actual verification status
      // For now, we'll just redirect to the main app
      router.push('/')
    }, 2000)
  }

  const handleBackToSignIn = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <p className="text-muted-foreground">
            We've sent a verification link to your email address
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Please check your email and click the verification link to complete your account setup.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handleCheckVerification}
              disabled={isChecking}
              className="w-full"
            >
              {isChecking ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  I've Verified My Email
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleBackToSignIn}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or{' '}
              <button className="text-primary hover:underline font-medium">
                contact support
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 