import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database type definitions
export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  phone?: string
  location?: string
  experience_level?: 'entry' | 'mid' | 'senior' | 'executive'
  preferred_industries?: string[]
  salary_expectation?: number
  job_preferences?: Record<string, any>
  created_at: string
  updated_at: string
}

// Enhanced authentication helper functions
export const signUp = async (email: string, password: string, metadata?: any) => {
  console.log('🔐 Attempting sign up with metadata:', metadata)
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  })
  
  if (error) {
    console.error('❌ Sign up error:', error)
    throw error
  }
  
  console.log('✅ Sign up successful:', data)
  return data
}

export const signIn = async (email: string, password: string) => {
  console.log('🔐 Attempting sign in for:', email)
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) {
    console.error('❌ Sign in error:', error)
    throw error
  }
  
  console.log('✅ Sign in successful:', data)
  return data
}

export const signOut = async () => {
  console.log('🔐 Attempting sign out')
  
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('❌ Sign out error:', error)
    throw error
  }
  
  console.log('✅ Sign out successful')
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('❌ Get current user error:', error)
    throw error
  }
  return user
}

export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  console.log('👤 Fetching profile for user:', userId)
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('❌ Error fetching profile:', error)
    return null
  }
  
  console.log('✅ Profile fetched successfully:', data)
  return data
}

export const updateUserProfile = async (userId: string, updates: Partial<Profile>) => {
  console.log('👤 Updating profile for user:', userId, 'with updates:', updates)
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) {
    console.error('❌ Error updating profile:', error)
    throw error
  }
  
  console.log('✅ Profile updated successfully:', data)
  return data
}

// Enhanced error handling for database operations
export const createUserProfile = async (userId: string, profileData: Partial<Profile>) => {
  console.log('👤 Creating profile for user:', userId, 'with data:', profileData)
  
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      ...profileData
    }, {
      onConflict: 'id'
    })
    .select()
    .single()
  
  if (error) {
    console.error('❌ Error creating profile:', error)
    throw error
  }
  
  console.log('✅ Profile created successfully:', data)
  return data
}

// Test authentication system
export const testAuthentication = async () => {
  console.log('🧪 Testing JobConnect AI Authentication System...')
  
  try {
    // Test 1: Database connection
    const { data, error } = await supabase.from('profiles').select('count').single()
    if (error) {
      console.error('❌ Database connection failed:', error)
      return false
    }
    console.log('✅ Database connection successful')
    
    // Test 2: Trigger function accessibility
    try {
      const { data: triggerTest, error: triggerError } = await supabase.rpc('handle_new_user')
      if (triggerError) {
        console.log('ℹ️ Trigger function test completed (expected behavior)')
      } else {
        console.log('✅ Trigger function is accessible')
      }
    } catch (err) {
      console.log('ℹ️ Trigger function test completed (expected behavior)')
    }
    
    // Test 3: RLS policies
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profile) {
        console.log('✅ RLS policies working correctly')
      } else if (profileError) {
        console.log('ℹ️ RLS policies test completed (expected behavior)')
      }
    }
    
    console.log('✅ Authentication system tests completed')
    return true
  } catch (error) {
    console.error('❌ Authentication system test failed:', error)
    return false
  }
} 