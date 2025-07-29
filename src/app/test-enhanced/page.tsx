'use client'

import { useState } from 'react'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { testAuthentication } from '@/lib/supabase-enhanced'

export default function TestEnhancedPage() {
  const [testResult, setTestResult] = useState<string | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  const runTest = async () => {
    setIsTesting(true)
    setTestResult(null)
    
    try {
      const result = await testAuthentication()
      setTestResult(result ? '✅ Authentication system is working correctly!' : '❌ Authentication system has issues')
    } catch (error: any) {
      setTestResult(`❌ Test failed: ${error.message}`)
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            JobConnect AI - Enhanced Authentication Test
          </h1>
          <p className="text-gray-600 mb-6">
            Testing the comprehensive authentication system based on PRD analysis
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={runTest}
              disabled={isTesting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isTesting ? 'Testing...' : 'Test Authentication System'}
            </button>
          </div>
          
          {testResult && (
            <div className={`p-4 rounded-lg mb-6 ${
              testResult.includes('✅') 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className={testResult.includes('✅') ? 'text-green-800' : 'text-red-800'}>
                {testResult}
              </p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Enhanced Sign Up Form
            </h2>
            <SignUpForm />
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              PRD-Based Solutions Implemented
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                SECURITY DEFINER with proper search_path
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                System-level RLS policies for triggers
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Enhanced error handling in triggers
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Proper function visibility and permissions
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Comprehensive error handling in UI
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Apply the comprehensive SQL fix to Supabase</li>
                <li>2. Test the sign-up form above</li>
                <li>3. Verify profile creation works</li>
                <li>4. Check authentication flow</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 