"use client"

import { AuthStatus } from '@/components/auth/auth-status'

export default function TestAuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Authentication Test</h1>
          <p className="text-muted-foreground">
            This page tests the authentication system
          </p>
        </div>
        
        <AuthStatus />
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Check the browser console for authentication logs</p>
          <p>Visit <a href="/auth/signin" className="text-primary hover:underline">/auth/signin</a> to test sign-in</p>
        </div>
      </div>
    </div>
  )
} 