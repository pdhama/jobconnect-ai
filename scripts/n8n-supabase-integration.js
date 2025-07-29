// n8n Supabase Integration Helper
// This module provides helper functions for n8n workflows to interact with Supabase

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

class JobConnectSupabase {
  constructor() {
    this.supabase = supabase;
  }

  // Job Operations
  async insertJob(jobData) {
    try {
      const { data, error } = await this.supabase
        .from('jobs')
        .insert({
          title: jobData.title,
          company: jobData.company,
          location: jobData.location,
          description: jobData.description,
          requirements: jobData.requirements || [],
          salary_min: jobData.salary_min,
          salary_max: jobData.salary_max,
          job_type: jobData.job_type || 'full-time',
          remote_preference: jobData.remote_preference || 'onsite',
          experience_level: jobData.experience_level || 'mid',
          industry: jobData.industry,
          source_url: jobData.source_url,
          is_active: true
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error inserting job:', error);
      return { success: false, error: error.message };
    }
  }

  async getJobs(filters = {}) {
    try {
      let query = this.supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true);

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters.industry) {
        query = query.eq('industry', filters.industry);
      }

      if (filters.experience_level) {
        query = query.eq('experience_level', filters.experience_level);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return { success: false, error: error.message };
    }
  }

  // Application Operations
  async getPendingApplications() {
    try {
      const { data, error } = await this.supabase
        .from('applications')
        .select(`
          *,
          jobs (title, company, location),
          profiles (full_name, email)
        `)
        .eq('status', 'applied')
        .order('applied_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching applications:', error);
      return { success: false, error: error.message };
    }
  }

  async updateApplicationStatus(applicationId, status) {
    try {
      const { data, error } = await this.supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating application:', error);
      return { success: false, error: error.message };
    }
  }

  // Resume Operations
  async updateResume(userId, resumeData) {
    try {
      const { data, error } = await this.supabase
        .from('resumes')
        .upsert({
          user_id: userId,
          title: resumeData.title,
          content: resumeData.content,
          is_active: resumeData.is_active || false
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating resume:', error);
      return { success: false, error: error.message };
    }
  }

  async getResume(userId) {
    try {
      const { data, error } = await this.supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching resume:', error);
      return { success: false, error: error.message };
    }
  }

  // Cover Letter Operations
  async createCoverLetter(userId, jobId, coverLetterData) {
    try {
      const { data, error } = await this.supabase
        .from('cover_letters')
        .insert({
          user_id: userId,
          job_id: jobId,
          title: coverLetterData.title,
          content: coverLetterData.content
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating cover letter:', error);
      return { success: false, error: error.message };
    }
  }

  // Networking Operations
  async insertContact(userId, contactData) {
    try {
      const { data, error } = await this.supabase
        .from('networking_contacts')
        .insert({
          user_id: userId,
          name: contactData.name,
          email: contactData.email,
          company: contactData.company,
          position: contactData.position,
          linkedin_url: contactData.linkedin_url,
          phone: contactData.phone,
          notes: contactData.notes,
          status: contactData.status || 'discovered'
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error inserting contact:', error);
      return { success: false, error: error.message };
    }
  }

  async updateContactStatus(contactId, status) {
    try {
      const { data, error } = await this.supabase
        .from('networking_contacts')
        .update({ status })
        .eq('id', contactId);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating contact:', error);
      return { success: false, error: error.message };
    }
  }

  // Profile Operations
  async updateProfile(userId, profileData) {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url,
          phone: profileData.phone,
          location: profileData.location,
          experience_level: profileData.experience_level,
          preferred_industries: profileData.preferred_industries,
          salary_expectation: profileData.salary_expectation,
          job_preferences: profileData.job_preferences
        })
        .eq('id', userId);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }
  }

  // Analytics Operations
  async getJobStats() {
    try {
      const { data, error } = await this.supabase
        .from('jobs')
        .select('id, posted_at, is_active')
        .gte('posted_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const stats = {
        total_jobs: data.length,
        active_jobs: data.filter(job => job.is_active).length,
        jobs_this_week: data.length
      };

      return { success: true, data: stats };
    } catch (error) {
      console.error('Error fetching job stats:', error);
      return { success: false, error: error.message };
    }
  }

  async getApplicationStats(userId) {
    try {
      const { data, error } = await this.supabase
        .from('applications')
        .select('status, applied_at')
        .eq('user_id', userId);

      if (error) throw error;

      const stats = {
        total_applications: data.length,
        applied: data.filter(app => app.status === 'applied').length,
        interviewing: data.filter(app => app.status === 'interviewing').length,
        offered: data.filter(app => app.status === 'offered').length,
        rejected: data.filter(app => app.status === 'rejected').length
      };

      return { success: true, data: stats };
    } catch (error) {
      console.error('Error fetching application stats:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export the class and a singleton instance
module.exports = {
  JobConnectSupabase,
  supabaseHelper: new JobConnectSupabase()
}; 