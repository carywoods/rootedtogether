# Rooted Together - Social Gardening PWA

A modern Progressive Web App that connects gardeners of all experience levels. Built with React, Vite, Supabase, and Tailwind CSS.

## Features

- **User Authentication** - Secure signup/signin with Supabase Auth
- **Profile Creation** - Detailed gardening profiles with experience levels, growing zones, and preferences
- **Geographic Discovery** - Find nearby gardeners based on location and shared interests
- **Real-time Messaging** - Direct communication between gardeners
- **Technical Feed** - Zone-specific gardening content and community posts
- **Progressive Web App** - Works offline with app-like experience
- **Responsive Design** - Optimized for all device sizes

## Prerequisites

- Node.js 18 or higher
- A Supabase project with:
  - Supabase URL
  - Supabase anon key
- For deployment: Coolify instance

## Quick Start

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Set up the database:**
   - Open your Supabase dashboard
   - Go to SQL Editor
   - Copy and paste the contents of `supabase/migrations/01_initial_schema.sql`
   - Run the SQL to create tables and policies

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **For production, build and start the server:**
   ```bash
   npm run build
   npm start
   ```

## Deployment with Coolify

1. **Create new application in Coolify**
   - Connect your Git repository
   - Set as Node.js application

2. **Configure environment variables in Coolify:**
   Go to your Coolify application dashboard and add these environment variables:
   ```
   VITE_SUPABASE_URL=http://supabasekong-i4w0w04g0w4k0gs048k884ok.158.69.200.214.sslip.io/
   VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1NjY4MDY2MCwiZXhwIjo0OTEyMzU0MjYwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.PPFg8Oq3QGCSZYY_z34gb6nlLJ5zQcC-NRe1W-b-21Q
   ```
   
   **Important:** Make sure to add these in the Coolify dashboard under:
   - Application Settings → Environment Variables
   - Or during the application setup process

3. **Set build and start commands:**
   - Build command: `npm run build`
   - Start command: `npm start`
   - Port: `8080`

4. **Configure health check:**
   - Health check path: `/health`
   - Enable TLS and attach your domain

## Architecture

### Frontend Stack
- **React 18** - Component framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Headless UI** - Accessible components

### Backend Stack
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Row Level Security (RLS)

### Key Features
- **PWA Support** - Service worker, manifest, offline capability
- **Responsive Design** - Mobile-first approach
- **Real-time Updates** - Live messaging and feed updates
- **Geographic Matching** - Location-based user discovery
- **Type Safety** - Full TypeScript coverage

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components (Header, etc.)
│   ├── profile/        # Profile-related components
│   └── ui/             # Generic UI components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── pages/              # Route components
└── types/              # TypeScript type definitions

server.js               # Express server for self-hosting
supabase/
└── migrations/         # Database migration files

public/
├── manifest.json       # PWA manifest
└── sw.js              # Service worker
```

## Environment Variables

Required environment variables:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## API Endpoints

- `GET /health` - Health check endpoint for deployment monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details