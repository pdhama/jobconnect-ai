import { createClient } from '@supabase/supabase-js'
import { User, Session, AuthError } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// User profile interface
export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  phone?: string
  location?: string
  experience_level?: 'entry' | 'mid' | 'senior' | 'executive'
  preferred_industries?: string[]
  salary_expectation?: number
  job_preferences?: {
    remote_preference?: 'remote' | 'hybrid' | 'onsite'
    relocation_willing?: boolean
    visa_sponsorship_needed?: boolean
  }
  created_at: string
  updated_at: string
}

// Authentication state interface
export interface AuthState {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  error: AuthError | null
}

// Authentication methods
export const auth = {
  // Sign up with email and password
  async signUp(email: string, password: string, profile: Partial<UserProfile>) {
    try {
      console.log('Starting sign up process for:', email)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: profile.full_name,
            phone: profile.phone,
            location: profile.location,
            experience_level: profile.experience_level,
            preferred_industries: profile.preferred_industries,
            salary_expectation: profile.salary_expectation,
            job_preferences: profile.job_preferences,
          }
        }
      })

      if (error) {
        console.error('Supabase auth signUp error:', error)
        
        // Check if it's a database-related error
        if (error.message.includes('Database error') || error.message.includes('policy')) {
          console.error('Database schema issue detected. Please apply the database schema.')
          throw new Error('Database setup incomplete. Please contact support or apply the database schema.')
        }
        
        throw error
      }

      console.log('Auth signUp successful, user created:', data.user?.id)

      // The profile will be automatically created by the database trigger
      // We just need to wait a moment for it to be created
      if (data.user) {
        // Wait a bit for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Try to get the profile to confirm it was created
        const userProfile = await getUserProfile(data.user.id)
        if (userProfile) {
          console.log('Profile created successfully:', userProfile)
          return { data: { ...data, profile: userProfile }, error: null }
        } else {
          console.log('Profile not found, attempting manual creation')
          // If profile wasn't created by trigger, create it manually
          const { error: profileError } = await createUserProfile(data.user.id, {
            email: data.user.email || email,
            ...profile
          })
          
          if (profileError) {
            console.error('Manual profile creation error:', profileError)
            // Don't throw here, the user was created successfully
            return { data, error: null }
          }
          
          const createdProfile = await getUserProfile(data.user.id)
          return { data: { ...data, profile: createdProfile }, error: null }
        }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { data: null, error: error as AuthError }
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Fetch user profile
      if (data.user) {
        const profile = await getUserProfile(data.user.id)
        return { data: { ...data, profile }, error: null }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as AuthError }
    }
  },

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as AuthError }
    }
  },



  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    }
  },

  // Reset password
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    }
  },

  // Update password
  async updatePassword(password: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password
      })

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    }
  },

  // Get current session
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return { session, error: null }
    } catch (error) {
      return { session: null, error: error as AuthError }
    }
  },

  // Get current user
  async getUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return { user, error: null }
    } catch (error) {
      return { user: null, error: error as AuthError }
    }
  }
}

// Profile management
export const profile = {
  // Create user profile
  async create(profile: Partial<UserProfile>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([profile])
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get user profile
  async get(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update user profile
  async update(userId: string, updates: Partial<UserProfile>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Upload avatar
  async uploadAvatar(userId: string, file: File) {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile with new avatar URL
      await this.update(userId, { avatar_url: publicUrl })

      return { url: publicUrl, error: null }
    } catch (error) {
      return { url: null, error }
    }
  }
}

// Helper functions
async function createUserProfile(userId: string, profileData: Partial<UserProfile>) {
  try {
    console.log('Creating user profile for:', userId)
    console.log('Profile data:', profileData)
    
    const { error } = await supabase
      .from('profiles')
      .upsert([{
        id: userId,
        email: profileData.email || '',
        full_name: profileData.full_name,
        phone: profileData.phone,
        location: profileData.location,
        experience_level: profileData.experience_level,
        preferred_industries: profileData.preferred_industries,
        salary_expectation: profileData.salary_expectation,
        job_preferences: profileData.job_preferences,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }], {
        onConflict: 'id'
      })

    if (error) {
      console.error('Supabase profile creation error:', error)
      return { error }
    }
    
    console.log('Profile created/updated successfully')
    return { error: null }
  } catch (error) {
    console.error('Exception in createUserProfile:', error)
    return { error }
  }
}

async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) return null
  return data
}

// Auth state management
export class AuthManager {
  private listeners: Set<(state: AuthState) => void> = new Set()
  private state: AuthState = {
    user: null,
    session: null,
    profile: null,
    loading: true,
    error: null
  }

  constructor() {
    this.initialize()
  }

  private async initialize() {
    // Get initial session
    const { session } = await auth.getSession()
    this.state.session = session
    this.state.user = session?.user || null

    // Get user profile if logged in
    if (this.state.user) {
      const profile = await getUserProfile(this.state.user.id)
      this.state.profile = profile
    }

    this.state.loading = false
    this.notifyListeners()

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      this.state.session = session
      this.state.user = session?.user || null
      this.state.profile = null

      if (session?.user) {
        const profile = await getUserProfile(session.user.id)
        this.state.profile = profile
      }

      this.notifyListeners()
    })
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state))
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  getState(): AuthState {
    return this.state
  }
}

// Export singleton instance
export const authManager = new AuthManager() 