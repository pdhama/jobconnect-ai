"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useIsAuthenticated } from '@/contexts/auth-context'
import { Loader2 } from 'lucide-react'
import { AuthFlow } from './auth-flow'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useIsAuthenticated()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Don't redirect automatically, let AuthFlow handle it
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return fallback || <AuthFlow />
  }

  return <>{children}</>
}

// Hook for conditional rendering based on auth state
export function useProtectedRoute() {
  const { isAuthenticated, loading } = useIsAuthenticated()
  
  return {
    isAuthenticated,
    loading,
    showProtectedContent: isAuthenticated && !loading
  }
} 