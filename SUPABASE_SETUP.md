# Supabase Setup Guide for JobConnect AI

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New Project"
5. Choose your organization
6. Fill in project details:
   - **Name**: `jobconnect-ai`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users (e.g., `Asia Pacific (Singapore)`)
7. Click "Create new project"
8. Wait for project to be ready (2-3 minutes)

## 2. Get Project Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 3. Set Up Database Schema

1. Go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL script
4. This will create all tables and policies

## 4. Configure Google OAuth

### 4.1 Create Google OAuth App

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client IDs**
5. Choose **Web application**
6. Add these Authorized redirect URIs:
   - `https://your-project-id.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)
7. Copy the **Client ID** and **Client Secret**

### 4.2 Configure in Supabase

1. Go to **Authentication** → **Providers**
2. Find **Google** and click **Enable**
3. Enter your Google OAuth credentials:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
4. Click **Save**

## 5. Configure Environment Variables

Create `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# For development (optional)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 6. Test Authentication

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/auth/signin`
3. Try signing up with email/password
4. Try signing in with Google
5. Check the **Authentication** → **Users** section in Supabase

## 7. Storage Setup (Optional)

For avatar uploads:

1. Go to **Storage** → **Create a new bucket**
2. Name: `avatars`
3. Make it **Public**
4. Add RLS policies for user access

## 8. Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize the email templates for:
   - Confirm signup
   - Magic link
   - Change email address
   - Reset password

## Troubleshooting

### Google OAuth Issues
- Ensure redirect URIs are exactly correct
- Check that Google OAuth is enabled in Supabase
- Verify Client ID and Secret are correct

### Database Issues
- Run the schema SQL again if tables don't exist
- Check RLS policies are working correctly
- Verify triggers are created properly

### Environment Issues
- Restart your dev server after changing `.env.local`
- Check that environment variables are loaded correctly
- Verify Supabase URL and keys are correct

## Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Use RLS policies** for all database access
3. **Enable email confirmation** for production
4. **Set up proper CORS** for production domains
5. **Monitor authentication logs** in Supabase dashboard

## Production Deployment

When deploying to production:

1. Update Google OAuth redirect URIs to include your production domain
2. Set up proper environment variables on your hosting platform
3. Configure CORS settings in Supabase
4. Enable email confirmations
5. Set up monitoring and logging 