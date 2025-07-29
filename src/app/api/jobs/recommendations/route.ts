import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }
    
    // Get user's job preferences
    const { data: preferences, error: prefError } = await supabase
      .from('user_job_preferences')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (prefError) {
      console.error('Error fetching user preferences:', prefError)
      return NextResponse.json(
        { error: 'Failed to fetch user preferences' },
        { status: 500 }
      )
    }
    
    // If no preferences found, return general recommendations
    if (!preferences || preferences.length === 0) {
      const { data: generalJobs, error: generalError } = await supabase
        .from('jobs')
        .select('*')
        .gte('relevance_score', 70)
        .gte('posted_time', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('relevance_score', { ascending: false })
        .order('posted_time', { ascending: false })
        .limit(limit)
      
      if (generalError) {
        console.error('Error fetching general jobs:', generalError)
        return NextResponse.json(
          { error: 'Failed to fetch general recommendations' },
          { status: 500 }
        )
      }
      
      return NextResponse.json({
        jobs: generalJobs || [],
        type: 'general',
        message: 'General job recommendations (no user preferences found)'
      })
    }
    
    const userPrefs = preferences[0]
    
    // Build personalized query based on user preferences
    let query = supabase
      .from('jobs')
      .select('*')
      .gte('relevance_score', 50)
      .gte('posted_time', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('relevance_score', { ascending: false })
      .order('posted_time', { ascending: false })
    
    // Apply user preference filters
    if (userPrefs.keywords && userPrefs.keywords.length > 0) {
      query = query.contains('keywords_matched', userPrefs.keywords)
    }
    
    if (userPrefs.location) {
      query = query.ilike('location', `%${userPrefs.location}%`)
    }
    
    if (userPrefs.experience_level) {
      query = query.eq('experience_level', userPrefs.experience_level)
    }
    
    if (userPrefs.job_type && userPrefs.job_type.length > 0) {
      query = query.overlaps('job_type', userPrefs.job_type)
    }
    
    if (userPrefs.remote_preference) {
      if (userPrefs.remote_preference === 'remote') {
        query = query.eq('is_remote', true)
      } else if (userPrefs.remote_preference === 'onsite') {
        query = query.eq('is_remote', false)
      }
      // For 'hybrid', we don't filter by remote status
    }
    
    if (userPrefs.salary_min) {
      query = query.gte('salary_min', userPrefs.salary_min)
    }
    
    if (userPrefs.salary_max) {
      query = query.lte('salary_max', userPrefs.salary_max)
    }
    
    // Apply limit
    query = query.limit(limit)
    
    const { data: jobs, error } = await query
    
    if (error) {
      console.error('Error fetching personalized jobs:', error)
      return NextResponse.json(
        { error: 'Failed to fetch personalized recommendations' },
        { status: 500 }
      )
    }
    
    // If no personalized jobs found, fall back to general recommendations
    if (!jobs || jobs.length === 0) {
      const { data: fallbackJobs, error: fallbackError } = await supabase
        .from('jobs')
        .select('*')
        .gte('relevance_score', 60)
        .gte('posted_time', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('relevance_score', { ascending: false })
        .order('posted_time', { ascending: false })
        .limit(limit)
      
      if (fallbackError) {
        console.error('Error fetching fallback jobs:', fallbackError)
        return NextResponse.json(
          { error: 'Failed to fetch fallback recommendations' },
          { status: 500 }
        )
      }
      
      return NextResponse.json({
        jobs: fallbackJobs || [],
        type: 'fallback',
        message: 'Fallback recommendations (no personalized matches found)'
      })
    }
    
    return NextResponse.json({
      jobs: jobs || [],
      type: 'personalized',
      preferences: {
        keywords: userPrefs.keywords,
        location: userPrefs.location,
        experience_level: userPrefs.experience_level,
        job_type: userPrefs.job_type,
        remote_preference: userPrefs.remote_preference
      },
      message: 'Personalized job recommendations based on your preferences'
    })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 