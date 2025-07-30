-- JobConnect AI - Test Data Setup Script
-- Run this in Supabase SQL Editor to set up test data for workflow testing

-- Step 1: Get your user ID (replace with your actual email)
-- First, let's find your user ID from auth.users
SELECT 
  id as user_id,
  email,
  created_at
FROM auth.users 
WHERE email = 'your-email@example.com'  -- REPLACE WITH YOUR ACTUAL EMAIL
LIMIT 1;

-- Step 2: Insert test profile data (replace USER_ID_HERE with your actual user ID)
INSERT INTO profiles (
  id,
  email,
  full_name,
  avatar_url,
  phone,
  location,
  experience_level,
  preferred_industries,
  salary_expectation,
  job_preferences
) VALUES (
  'USER_ID_HERE',  -- REPLACE WITH YOUR ACTUAL USER ID
  'your-email@example.com',  -- REPLACE WITH YOUR ACTUAL EMAIL
  'Test User',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  '+91 98765 43210',
  'Bangalore, India',
  'mid',
  ARRAY['Technology', 'Software Development', 'AI/ML'],
  800000,
  '{"remote_preference": "hybrid", "job_type": ["full-time"], "skills": ["React", "Node.js", "TypeScript"]}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  location = EXCLUDED.location,
  experience_level = EXCLUDED.experience_level,
  updated_at = NOW();

-- Step 3: Insert test job preferences (replace USER_ID_HERE with your actual user ID)
INSERT INTO user_job_preferences (
  user_id,
  keywords,
  location,
  experience_level,
  job_type,
  remote_preference,
  salary_min,
  salary_max,
  industries,
  skills,
  is_active
) VALUES 
-- Preference 1: React Developer
(
  'USER_ID_HERE',  -- REPLACE WITH YOUR ACTUAL USER ID
  ARRAY['React', 'JavaScript', 'TypeScript', 'Frontend'],
  'Bangalore, India',
  'mid',
  ARRAY['full-time'],
  'hybrid',
  600000,
  1200000,
  ARRAY['Technology', 'Software Development'],
  ARRAY['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS'],
  true
),
-- Preference 2: Full Stack Developer
(
  'USER_ID_HERE',  -- REPLACE WITH YOUR ACTUAL USER ID
  ARRAY['Full Stack', 'Node.js', 'React', 'MongoDB'],
  'Mumbai, India',
  'mid',
  ARRAY['full-time', 'contract'],
  'remote',
  800000,
  1500000,
  ARRAY['Technology', 'Startups'],
  ARRAY['Node.js', 'React', 'MongoDB', 'Express', 'JavaScript'],
  true
),
-- Preference 3: AI/ML Engineer
(
  'USER_ID_HERE',  -- REPLACE WITH YOUR ACTUAL USER ID
  ARRAY['Machine Learning', 'Python', 'AI', 'Data Science'],
  'Delhi, India',
  'senior',
  ARRAY['full-time'],
  'hybrid',
  1200000,
  2500000,
  ARRAY['Technology', 'AI/ML', 'Research'],
  ARRAY['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas'],
  true
)
ON CONFLICT (user_id, location, keywords) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  experience_level = EXCLUDED.experience_level,
  job_type = EXCLUDED.job_type,
  remote_preference = EXCLUDED.remote_preference,
  salary_min = EXCLUDED.salary_min,
  salary_max = EXCLUDED.salary_max,
  industries = EXCLUDED.industries,
  skills = EXCLUDED.skills,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Step 4: Verify the data was inserted correctly
SELECT 
  'Profiles' as table_name,
  COUNT(*) as count
FROM profiles
WHERE id = 'USER_ID_HERE'  -- REPLACE WITH YOUR ACTUAL USER ID

UNION ALL

SELECT 
  'User Job Preferences' as table_name,
  COUNT(*) as count
FROM user_job_preferences
WHERE user_id = 'USER_ID_HERE'  -- REPLACE WITH YOUR ACTUAL USER ID
  AND is_active = true;

-- Step 5: Show the inserted preferences
SELECT 
  id,
  user_id,
  keywords,
  location,
  experience_level,
  job_type,
  remote_preference,
  salary_min,
  salary_max,
  industries,
  skills,
  is_active,
  created_at
FROM user_job_preferences
WHERE user_id = 'USER_ID_HERE'  -- REPLACE WITH YOUR ACTUAL USER ID
  AND is_active = true
ORDER BY created_at DESC; 