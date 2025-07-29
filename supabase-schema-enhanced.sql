-- JobConnect AI Enhanced Database Schema
-- Includes job search automation, relevancy scoring, and vector search capabilities

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create user job preferences table
CREATE TABLE IF NOT EXISTS user_job_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  location TEXT,
  experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')),
  job_type TEXT[] DEFAULT '{}',
  remote_preference TEXT CHECK (remote_preference IN ('remote', 'hybrid', 'onsite')),
  salary_min INTEGER,
  salary_max INTEGER,
  industries TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced jobs table with vector search capabilities
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  job_url TEXT UNIQUE,
  description TEXT,
  requirements TEXT[] DEFAULT '{}',
  salary_min INTEGER,
  salary_max INTEGER,
  job_type TEXT CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship')),
  remote_preference TEXT CHECK (remote_preference IN ('remote', 'hybrid', 'onsite')),
  experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')),
  industry TEXT,
  platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'naukri', 'indeed', 'glassdoor')),
  posted_time TIMESTAMP WITH TIME ZONE NOT NULL,
  discovered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  keywords_matched TEXT[] DEFAULT '{}',
  relevance_score INTEGER CHECK (relevance_score BETWEEN 0 AND 100),
  freshness_score INTEGER CHECK (freshness_score BETWEEN 0 AND 100),
  embedding VECTOR(384),
  is_active BOOLEAN DEFAULT TRUE,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table (if not exists)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
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

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('applied', 'interviewing', 'offered', 'rejected', 'withdrawn')) DEFAULT 'applied',
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cover_letter TEXT,
  resume_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cover_letters table
CREATE TABLE IF NOT EXISTS cover_letters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create networking_contacts table
CREATE TABLE IF NOT EXISTS networking_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  company TEXT,
  position TEXT,
  linkedin_url TEXT,
  phone TEXT,
  notes TEXT,
  status TEXT CHECK (status IN ('discovered', 'connected', 'messaged', 'responded')) DEFAULT 'discovered',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job search logs for monitoring
CREATE TABLE IF NOT EXISTS job_search_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  search_query TEXT,
  jobs_found INTEGER DEFAULT 0,
  jobs_stored INTEGER DEFAULT 0,
  execution_time_ms INTEGER,
  status TEXT CHECK (status IN ('success', 'failed', 'partial')) DEFAULT 'success',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_job_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE networking_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_search_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_job_preferences
CREATE POLICY "Users can manage own job preferences" ON user_job_preferences
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for jobs (public read, admin write)
CREATE POLICY "Anyone can view active jobs" ON jobs
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admin can manage jobs" ON jobs
  FOR ALL USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email = 'admin@jobconnect.ai'
  ));

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for applications
CREATE POLICY "Users can view own applications" ON applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON applications
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for resumes
CREATE POLICY "Users can manage own resumes" ON resumes
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for cover_letters
CREATE POLICY "Users can manage own cover letters" ON cover_letters
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for networking_contacts
CREATE POLICY "Users can manage own contacts" ON networking_contacts
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for job_search_logs (admin only)
CREATE POLICY "Admin can view job search logs" ON job_search_logs
  FOR SELECT USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email = 'admin@jobconnect.ai'
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_posted_at ON jobs(posted_at);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_industry ON jobs(industry);
CREATE INDEX IF NOT EXISTS idx_jobs_platform ON jobs(platform);
CREATE INDEX IF NOT EXISTS idx_jobs_relevance_score ON jobs(relevance_score);
CREATE INDEX IF NOT EXISTS idx_jobs_freshness_score ON jobs(freshness_score);
CREATE INDEX IF NOT EXISTS idx_jobs_keywords_matched ON jobs USING GIN(keywords_matched);
CREATE INDEX IF NOT EXISTS idx_jobs_embedding ON jobs USING ivfflat (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_user_job_preferences_user_id ON user_job_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_job_preferences_keywords ON user_job_preferences USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_user_job_preferences_location ON user_job_preferences(location);

CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_cover_letters_user_id ON cover_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_networking_contacts_user_id ON networking_contacts(user_id);

CREATE INDEX IF NOT EXISTS idx_job_search_logs_platform ON job_search_logs(platform);
CREATE INDEX IF NOT EXISTS idx_job_search_logs_created_at ON job_search_logs(created_at);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON resumes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cover_letters_updated_at BEFORE UPDATE ON cover_letters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_networking_contacts_updated_at BEFORE UPDATE ON networking_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_job_preferences_updated_at BEFORE UPDATE ON user_job_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate relevance score
CREATE OR REPLACE FUNCTION calculate_relevance_score(
  job_title TEXT,
  job_description TEXT,
  job_location TEXT,
  job_posted_time TIMESTAMP WITH TIME ZONE,
  user_keywords TEXT[],
  user_location TEXT
) RETURNS INTEGER AS $$
DECLARE
  kw_score INTEGER := 0;
  loc_score INTEGER := 0;
  fresh_score INTEGER := 0;
  total_score INTEGER := 0;
  hours_since_posted INTEGER;
BEGIN
  -- Calculate keyword score (0-60)
  IF user_keywords IS NOT NULL AND array_length(user_keywords, 1) > 0 THEN
    -- Simple keyword matching - can be enhanced with TF-IDF
    FOR i IN 1..array_length(user_keywords, 1) LOOP
      IF LOWER(job_title || ' ' || COALESCE(job_description, '')) LIKE '%' || LOWER(user_keywords[i]) || '%' THEN
        kw_score := kw_score + 10;
      END IF;
    END LOOP;
    kw_score := LEAST(kw_score, 60);
  END IF;

  -- Calculate location score (0-20)
  IF user_location IS NOT NULL AND job_location IS NOT NULL THEN
    IF LOWER(job_location) LIKE '%' || LOWER(user_location) || '%' THEN
      loc_score := 20;
    END IF;
  END IF;

  -- Calculate freshness score (0-20)
  hours_since_posted := EXTRACT(EPOCH FROM (NOW() - job_posted_time)) / 3600;
  fresh_score := GREATEST(0, 20 - (hours_since_posted * 0.5));
  fresh_score := LEAST(fresh_score, 20);

  -- Calculate total score
  total_score := kw_score + loc_score + fresh_score;
  
  RETURN total_score;
END;
$$ LANGUAGE plpgsql;

-- Create function to update job relevance scores
CREATE OR REPLACE FUNCTION update_job_relevance_scores()
RETURNS TRIGGER AS $$
DECLARE
  user_pref RECORD;
BEGIN
  -- Update relevance scores for all active user preferences
  FOR user_pref IN 
    SELECT * FROM user_job_preferences WHERE is_active = TRUE
  LOOP
    UPDATE jobs 
    SET relevance_score = calculate_relevance_score(
      title, 
      description, 
      location, 
      posted_time, 
      user_pref.keywords, 
      user_pref.location
    )
    WHERE id = NEW.id;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update relevance scores when jobs are inserted
CREATE TRIGGER update_job_relevance_on_insert
  AFTER INSERT ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_job_relevance_scores();

-- Create function to get job recommendations
CREATE OR REPLACE FUNCTION get_job_recommendations(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 20
) RETURNS TABLE(
  job_id UUID,
  title TEXT,
  company TEXT,
  location TEXT,
  relevance_score INTEGER,
  freshness_score INTEGER,
  posted_time TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    j.id,
    j.title,
    j.company,
    j.location,
    j.relevance_score,
    j.freshness_score,
    j.posted_time
  FROM jobs j
  WHERE j.is_active = TRUE
    AND j.relevance_score IS NOT NULL
    AND j.relevance_score > 50
    AND j.posted_time >= NOW() - INTERVAL '7 days'
  ORDER BY j.relevance_score DESC, j.freshness_score DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample data for testing
INSERT INTO user_job_preferences (user_id, keywords, location, experience_level, job_type, remote_preference, salary_min, salary_max, industries, skills) VALUES
  ('00000000-0000-0000-0000-000000000001', ARRAY['react', 'node.js', 'typescript'], 'Bangalore', 'mid', ARRAY['full-time'], 'hybrid', 800000, 1500000, ARRAY['technology', 'software'], ARRAY['javascript', 'react', 'node.js']),
  ('00000000-0000-0000-0000-000000000002', ARRAY['python', 'machine learning', 'data science'], 'Mumbai', 'senior', ARRAY['full-time'], 'remote', 1200000, 2500000, ARRAY['technology', 'ai'], ARRAY['python', 'tensorflow', 'pandas']);

-- Insert sample jobs for testing
INSERT INTO jobs (title, company, location, job_url, description, requirements, salary_min, salary_max, job_type, remote_preference, experience_level, industry, platform, posted_time, keywords_matched, relevance_score, freshness_score) VALUES
  ('Senior React Developer', 'TechCorp', 'Bangalore', 'https://linkedin.com/jobs/1', 'We are looking for a senior React developer...', ARRAY['react', 'typescript', 'node.js'], 1200000, 1800000, 'full-time', 'hybrid', 'senior', 'technology', 'linkedin', NOW() - INTERVAL '2 hours', ARRAY['react', 'typescript'], 85, 95),
  ('Python Data Scientist', 'DataAI', 'Mumbai', 'https://naukri.com/jobs/2', 'Join our data science team...', ARRAY['python', 'machine learning', 'pandas'], 1500000, 2200000, 'full-time', 'remote', 'senior', 'ai', 'naukri', NOW() - INTERVAL '4 hours', ARRAY['python', 'machine learning'], 90, 92),
  ('Frontend Developer', 'StartupXYZ', 'Bangalore', 'https://linkedin.com/jobs/3', 'Build amazing user interfaces...', ARRAY['javascript', 'react', 'css'], 800000, 1200000, 'full-time', 'onsite', 'mid', 'technology', 'linkedin', NOW() - INTERVAL '6 hours', ARRAY['javascript', 'react'], 75, 88); 