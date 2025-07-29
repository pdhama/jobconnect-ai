"use client"

import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Mail, Calendar, LogOut } from 'lucide-react'

export function AuthStatus() {
  const { user, profile, loading, signOut } = useAuth()

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Not Authenticated
          </CardTitle>
          <CardDescription>
            You are not signed in. Please sign in to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => window.location.href = '/auth/signin'}
            className="w-full"
          >
            Sign In
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="w-5 h-5 mr-2" />
          Authenticated
        </CardTitle>
        <CardDescription>
          You are successfully signed in.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
            <span className="font-medium">Email:</span>
            <span className="ml-2">{user.email}</span>
          </div>
          
          {profile && (
            <>
              <div className="flex items-center text-sm">
                <User className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Name:</span>
                <span className="ml-2">{profile.full_name || 'Not set'}</span>
              </div>
              
              {profile.location && (
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">Location:</span>
                  <span className="ml-2">{profile.location}</span>
                </div>
              )}
            </>
          )}
          
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
            <span className="font-medium">Joined:</span>
            <span className="ml-2">
              {new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <Button 
          onClick={signOut}
          variant="outline"
          className="w-full"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </CardContent>
    </Card>
  )
} 