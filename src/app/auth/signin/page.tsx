"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SignIn } from '@/components/auth/sign-in'
import { SignUp } from '@/components/auth/sign-up'

export default function SignInPage() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/')
  }

  const handleSwitchToSignUp = () => {
    setAuthMode('signup')
  }

  const handleSwitchToSignIn = () => {
    setAuthMode('signin')
  }

  return (
    <>
      {authMode === 'signin' ? (
        <SignIn 
          onSuccess={handleSuccess}
          onSwitchToSignUp={handleSwitchToSignUp}
        />
      ) : (
        <SignUp 
          onSuccess={handleSuccess}
          onSwitchToSignIn={handleSwitchToSignIn}
        />
      )}
    </>
  )
} 