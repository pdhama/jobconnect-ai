# JobConnect AI 🚀

An AI-powered job search platform designed specifically for Indian professionals. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## ✨ Features

- **🔐 Secure Authentication** - Email/password and Google OAuth
- **📊 Smart Dashboard** - Real-time job insights and progress tracking
- **🔍 AI-Powered Job Search** - Intelligent job matching and recommendations
- **📝 Resume Builder** - AI-assisted resume creation and optimization
- **✉️ Cover Letter Generator** - Personalized cover letter generation
- **🤝 Networking Assistant** - Professional networking and outreach tools
- **🌙 Dark Mode** - Beautiful Apple-inspired dark theme
- **📱 Mobile Responsive** - Optimized for all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage)
- **Authentication**: Supabase Auth with Google OAuth
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **State Management**: React Context + Hooks

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd jobconnect-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment

```bash
# Run the setup script
node scripts/setup-env.js

# Or manually create .env.local
cp env.example .env.local
```

### 4. Configure Supabase

1. **Create Supabase Project**
   - Go to [https://supabase.com](https://supabase.com)
   - Create a new project
   - Get your project URL and anon key

2. **Update Environment Variables**
   ```bash
   # Edit .env.local
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

3. **Set Up Database**
   - Go to Supabase SQL Editor
   - Run the contents of `supabase-schema.sql`

4. **Configure Google OAuth**
   - Create Google OAuth app in Google Cloud Console
   - Add redirect URIs to Google OAuth
   - Enable Google provider in Supabase Auth

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
jobconnect-ai/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── auth/              # Authentication pages
│   │   ├── globals.css        # Global styles
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   ├── features/          # Feature components
│   │   ├── layout/            # Layout components
│   │   └── ui/                # Reusable UI components
│   ├── contexts/              # React contexts
│   └── lib/                   # Utility libraries
├── scripts/                   # Setup scripts
├── supabase-schema.sql        # Database schema
├── SUPABASE_SETUP.md          # Supabase setup guide
└── env.example               # Environment template
```

## 🔐 Authentication

The app uses Supabase Authentication with:

- **Email/Password** - Traditional sign-up/sign-in
- **Google OAuth** - Social login with Google
- **Protected Routes** - Automatic redirection for unauthenticated users
- **Session Management** - Persistent authentication state

### Testing Authentication

Visit [http://localhost:3000/test-auth](http://localhost:3000/test-auth) to test the authentication system.

## 🎨 Design System

Built with a custom design system inspired by Apple's design philosophy:

- **Color Palette**: Deep blue, bright orange, fresh green
- **Typography**: Inter + Poppins fonts
- **Components**: Modern, accessible UI components
- **Dark Mode**: Apple-inspired dark theme
- **Animations**: Smooth micro-interactions

## 📊 Database Schema

The app includes comprehensive database tables:

- **profiles** - User profiles and preferences
- **jobs** - Job listings and metadata
- **applications** - User job applications
- **resumes** - User resume storage
- **cover_letters** - Generated cover letters
- **networking_contacts** - Professional connections

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Environment Variables

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

- **Documentation**: See `SUPABASE_SETUP.md` for detailed setup instructions
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## 🎯 Roadmap

- [ ] Job scraping backend
- [ ] AI-powered resume optimization
- [ ] Advanced networking features
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Advanced analytics

---

Built with ❤️ for Indian professionals
