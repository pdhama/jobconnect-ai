-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Profiles table (already exists, but ensuring it's complete)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')),
  preferred_industries TEXT[],
  salary_expectation INTEGER,
  job_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Job Preferences table
CREATE TABLE IF NOT EXISTS user_job_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  keywords TEXT[] NOT NULL,
  location TEXT NOT NULL,
  experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')),
  job_type TEXT[] DEFAULT ARRAY['full-time'],
  remote_preference TEXT DEFAULT 'hybrid',
  salary_min INTEGER,
  salary_max INTEGER,
  industries TEXT[],
  skills TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, location, keywords)
);

-- Jobs table for storing discovered jobs
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  company VARCHAR NOT NULL,
  location TEXT,
  job_url TEXT UNIQUE,
  description TEXT,
  platform VARCHAR NOT NULL CHECK (platform IN ('linkedin', 'naukri', 'indeed')),
  posted_time TIMESTAMP WITH TIME ZONE NOT NULL,
  discovered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  keywords_matched TEXT[],
  relevance_score INTEGER CHECK (relevance_score BETWEEN 0 AND 100),
  freshness_score INTEGER CHECK (freshness_score BETWEEN 0 AND 100),
  embedding VECTOR(384), -- For future AI features
  user_id UUID,
  experience_level TEXT,
  job_type TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  is_remote BOOLEAN DEFAULT false,
  is_urgent BOOLEAN DEFAULT false,
  application_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  job_id UUID NOT NULL,
  status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'interviewing', 'rejected', 'accepted', 'withdrawn')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cover_letter TEXT,
  resume_version TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- Resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  file_url TEXT,
  version TEXT DEFAULT '1.0',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cover Letters table
CREATE TABLE IF NOT EXISTS cover_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  job_id UUID,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  company_name TEXT,
  job_title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Networking Contacts table
CREATE TABLE IF NOT EXISTS networking_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  position TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  status TEXT DEFAULT 'discovered' CHECK (status IN ('discovered', 'connected', 'messaged', 'meeting_scheduled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job Search Logs table
CREATE TABLE IF NOT EXISTS job_search_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  platform TEXT NOT NULL,
  search_query TEXT NOT NULL,
  jobs_found INTEGER DEFAULT 0,
  jobs_stored INTEGER DEFAULT 0,
  execution_time_ms INTEGER,
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'error', 'partial')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_job_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE networking_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_search_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "users_can_view_own_profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_can_update_own_profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "system_can_insert_profiles" ON profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "users_can_insert_own_profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_job_preferences
CREATE POLICY "users_can_manage_own_preferences" ON user_job_preferences
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for jobs (public read, user-specific write)
CREATE POLICY "public_can_view_jobs" ON jobs
  FOR SELECT USING (true);

CREATE POLICY "users_can_insert_jobs" ON jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "users_can_update_own_jobs" ON jobs
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for applications
CREATE POLICY "users_can_manage_own_applications" ON applications
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for resumes
CREATE POLICY "users_can_manage_own_resumes" ON resumes
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for cover_letters
CREATE POLICY "users_can_manage_own_cover_letters" ON cover_letters
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for networking_contacts
CREATE POLICY "users_can_manage_own_contacts" ON networking_contacts
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for job_search_logs
CREATE POLICY "users_can_view_own_logs" ON job_search_logs
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "system_can_insert_logs" ON job_search_logs
  FOR INSERT WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_job_preferences_user_id ON user_job_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_job_preferences_active ON user_job_preferences(is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_platform ON jobs(platform);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_time ON jobs(posted_time);
CREATE INDEX IF NOT EXISTS idx_jobs_relevance_score ON jobs(relevance_score);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_keywords ON jobs USING GIN(keywords_matched);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_cover_letters_user_id ON cover_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_networking_contacts_user_id ON networking_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_job_search_logs_user_id ON job_search_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_job_search_logs_created_at ON job_search_logs(created_at);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Insert new profile with basic information from auth metadata
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    avatar_url
  ) VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_job_preferences_updated_at 
  BEFORE UPDATE ON user_job_preferences 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at 
  BEFORE UPDATE ON jobs 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at 
  BEFORE UPDATE ON applications 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at 
  BEFORE UPDATE ON resumes 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cover_letters_updated_at 
  BEFORE UPDATE ON cover_letters 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_networking_contacts_updated_at 
  BEFORE UPDATE ON networking_contacts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate job relevance score
CREATE OR REPLACE FUNCTION calculate_relevance_score(
  job_title TEXT,
  job_description TEXT,
  job_location TEXT,
  posted_time TIMESTAMP WITH TIME ZONE,
  user_keywords TEXT[],
  user_location TEXT
)
RETURNS INTEGER AS $$
DECLARE
  keyword_score INTEGER := 0;
  location_score INTEGER := 0;
  freshness_score INTEGER := 0;
  total_score INTEGER := 0;
  hours_since_posted INTEGER;
BEGIN
  -- Calculate keyword relevance (0-60 points)
  IF user_keywords IS NOT NULL THEN
    FOR i IN 1..array_length(user_keywords, 1) LOOP
      IF LOWER(job_title || ' ' || COALESCE(job_description, '')) LIKE '%' || LOWER(user_keywords[i]) || '%' THEN
        keyword_score := keyword_score + 10;
      END IF;
    END LOOP;
    keyword_score := LEAST(keyword_score, 60);
  END IF;
  
  -- Calculate location relevance (0-20 points)
  IF user_location IS NOT NULL AND job_location IS NOT NULL THEN
    IF LOWER(job_location) LIKE '%' || LOWER(user_location) || '%' THEN
      location_score := 20;
    END IF;
  END IF;
  
  -- Calculate freshness score (0-20 points)
  hours_since_posted := EXTRACT(EPOCH FROM (NOW() - posted_time)) / 3600;
  freshness_score := GREATEST(0, 20 - (hours_since_posted * 0.5));
  
  -- Calculate total score
  total_score := keyword_score + location_score + freshness_score;
  
  RETURN GREATEST(0, LEAST(100, total_score));
END;
$$ LANGUAGE plpgsql;

-- Function to update job relevance scores
CREATE OR REPLACE FUNCTION update_job_relevance_scores()
RETURNS TRIGGER AS $$
BEGIN
  -- Update relevance score for all active user preferences
  UPDATE jobs 
  SET relevance_score = calculate_relevance_score(
    title,
    description,
    location,
    posted_time,
    keywords_matched,
    (SELECT location FROM user_job_preferences WHERE user_id = jobs.user_id AND is_active = true LIMIT 1)
  )
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update relevance scores after job insertion
CREATE TRIGGER update_job_relevance_scores_trigger
  AFTER INSERT ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_job_relevance_scores();

-- Function to get job recommendations
CREATE OR REPLACE FUNCTION get_job_recommendations(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  company TEXT,
  location TEXT,
  job_url TEXT,
  description TEXT,
  platform TEXT,
  posted_time TIMESTAMP WITH TIME ZONE,
  relevance_score INTEGER,
  freshness_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    j.id,
    j.title,
    j.company,
    j.location,
    j.job_url,
    j.description,
    j.platform,
    j.posted_time,
    j.relevance_score,
    j.freshness_score
  FROM jobs j
  WHERE j.relevance_score >= 50  -- Only relevant jobs
    AND j.posted_time >= NOW() - INTERVAL '7 days'  -- Recent jobs
  ORDER BY j.relevance_score DESC, j.freshness_score DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON TABLE profiles TO authenticated, anon;
GRANT ALL ON TABLE user_job_preferences TO authenticated, anon;
GRANT ALL ON TABLE jobs TO authenticated, anon;
GRANT ALL ON TABLE applications TO authenticated, anon;
GRANT ALL ON TABLE resumes TO authenticated, anon;
GRANT ALL ON TABLE cover_letters TO authenticated, anon;
GRANT ALL ON TABLE networking_contacts TO authenticated, anon;
GRANT ALL ON TABLE job_search_logs TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION calculate_relevance_score(TEXT, TEXT, TEXT, TIMESTAMP WITH TIME ZONE, TEXT[], TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_job_recommendations(UUID, INTEGER) TO authenticated, anon;

-- Insert sample jobs (these don't depend on user existence)
INSERT INTO jobs (title, company, location, job_url, description, platform, posted_time, keywords_matched, relevance_score, freshness_score)
VALUES 
  ('Senior React Developer', 'TechCorp', 'Bangalore', 'https://linkedin.com/jobs/1', 'Looking for experienced React developer', 'linkedin', NOW() - INTERVAL '2 hours', ARRAY['react', 'javascript'], 85, 95),
  ('Python Data Scientist', 'DataTech', 'Mumbai', 'https://naukri.com/jobs/2', 'Machine learning expert needed', 'naukri', NOW() - INTERVAL '4 hours', ARRAY['python', 'data science'], 90, 85),
  ('Node.js Backend Developer', 'StartupXYZ', 'Delhi', 'https://linkedin.com/jobs/3', 'Backend API development role', 'linkedin', NOW() - INTERVAL '6 hours', ARRAY['node.js', 'backend'], 75, 75)
ON CONFLICT DO NOTHING; 