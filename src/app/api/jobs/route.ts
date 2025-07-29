import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const keywords = searchParams.get('keywords')
    const location = searchParams.get('location')
    const experience = searchParams.get('experience')
    const jobType = searchParams.get('jobType')
    const remote = searchParams.get('remote')
    const platform = searchParams.get('platform')
    const minScore = searchParams.get('minScore')
    const postedAfter = searchParams.get('postedAfter')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    // Build query
    let query = supabase
      .from('jobs')
      .select('*')
      .order('relevance_score', { ascending: false })
      .order('posted_time', { ascending: false })
    
    // Apply filters
    if (keywords) {
      const keywordArray = keywords.split(',').map(k => k.trim())
      query = query.contains('keywords_matched', keywordArray)
    }
    
    if (location) {
      query = query.ilike('location', `%${location}%`)
    }
    
    if (experience) {
      query = query.eq('experience_level', experience)
    }
    
    if (jobType) {
      query = query.eq('job_type', jobType)
    }
    
    if (remote) {
      query = query.eq('is_remote', remote === 'true')
    }
    
    if (platform) {
      query = query.eq('platform', platform)
    }
    
    if (minScore) {
      query = query.gte('relevance_score', parseInt(minScore))
    }
    
    if (postedAfter) {
      const date = new Date()
      switch (postedAfter) {
        case '24h':
          date.setHours(date.getHours() - 24)
          break
        case '7d':
          date.setDate(date.getDate() - 7)
          break
        case '30d':
          date.setDate(date.getDate() - 30)
          break
        default:
          date.setHours(date.getHours() - 24) // Default to 24 hours
      }
      query = query.gte('posted_time', date.toISOString())
    }
    
    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)
    
    const { data: jobs, error, count } = await query
    
    if (error) {
      console.error('Error fetching jobs:', error)
      return NextResponse.json(
        { error: 'Failed to fetch jobs' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      jobs: jobs || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, keywords, location, experience_level, job_type, remote_preference, salary_min, salary_max, industries, skills } = body
    
    // Validate required fields
    if (!user_id || !keywords || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, keywords, location' },
        { status: 400 }
      )
    }
    
    // Upsert user job preferences
    const { data, error } = await supabase
      .from('user_job_preferences')
      .upsert({
        user_id,
        keywords: Array.isArray(keywords) ? keywords : [keywords],
        location,
        experience_level,
        job_type: Array.isArray(job_type) ? job_type : [job_type],
        remote_preference,
        salary_min,
        salary_max,
        industries: Array.isArray(industries) ? industries : [industries],
        skills: Array.isArray(skills) ? skills : [skills],
        is_active: true
      }, {
        onConflict: 'user_id,location,keywords'
      })
      .select()
    
    if (error) {
      console.error('Error saving job preferences:', error)
      return NextResponse.json(
        { error: 'Failed to save job preferences' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: 'Job preferences saved successfully',
      data: data[0]
    })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 