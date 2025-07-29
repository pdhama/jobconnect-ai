"use client"

import { useAuth } from '@/contexts/auth-context'
import { useState } from 'react'

export default function SimpleTestPage() {
  const { user, signIn, signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('Signing in...')
    
    try {
      const { error } = await signIn(email, password)
      if (error) {
        setMessage(`Error: ${error.message}`)
      } else {
        setMessage('Sign in successful!')
      }
    } catch (err) {
      setMessage(`Exception: ${err}`)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('Signing up...')
    
    try {
      const { error } = await signUp(email, password, {})
      if (error) {
        setMessage(`Error: ${error.message}`)
      } else {
        setMessage('Sign up successful!')
      }
    } catch (err) {
      setMessage(`Exception: ${err}`)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Simple Authentication Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Current User:</strong> {user ? user.email : 'Not signed in'}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <strong>Message:</strong> {message}
      </div>

      <form onSubmit={handleSignIn} style={{ marginBottom: '20px' }}>
        <h3>Sign In</h3>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '5px', width: '200px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '5px', width: '200px' }}
          />
        </div>
        <button type="submit" style={{ padding: '5px 10px' }}>
          Sign In
        </button>
      </form>

      <form onSubmit={handleSignUp}>
        <h3>Sign Up</h3>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '5px', width: '200px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '5px', width: '200px' }}
          />
        </div>
        <button type="submit" style={{ padding: '5px 10px' }}>
          Sign Up
        </button>
      </form>

      <div style={{ marginTop: '20px' }}>
        <a href="/test-auth">Go to Full Auth Test</a>
      </div>
    </div>
  )
} 