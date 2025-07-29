"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthState, authManager } from '@/lib/auth'

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, profile: any) => Promise<{ data: any; error: any }>
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signInWithGoogle: () => Promise<{ data: any; error: any }>
  signOut: () => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ error: any }>
  updatePassword: (password: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authManager.subscribe((state) => {
      setAuthState(state)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const value: AuthContextType = {
    ...authState,
    signUp: async (email: string, password: string, profile: any) => {
      const { auth } = await import('@/lib/auth')
      return auth.signUp(email, password, profile)
    },
    signIn: async (email: string, password: string) => {
      const { auth } = await import('@/lib/auth')
      return auth.signIn(email, password)
    },
    signInWithGoogle: async () => {
      const { auth } = await import('@/lib/auth')
      return auth.signInWithGoogle()
    },
    signOut: async () => {
      const { auth } = await import('@/lib/auth')
      return auth.signOut()
    },
    resetPassword: async (email: string) => {
      const { auth } = await import('@/lib/auth')
      return auth.resetPassword(email)
    },
    updatePassword: async (password: string) => {
      const { auth } = await import('@/lib/auth')
      return auth.updatePassword(password)
    }
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Custom hooks for specific auth states
export function useUser() {
  const { user, loading } = useAuth()
  return { user, loading }
}

export function useProfile() {
  const { profile, loading } = useAuth()
  return { profile, loading }
}

export function useSession() {
  const { session, loading } = useAuth()
  return { session, loading }
}

// Hook to check if user is authenticated
export function useIsAuthenticated() {
  const { user, loading } = useAuth()
  return { isAuthenticated: !!user, loading }
} 