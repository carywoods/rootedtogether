import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Comprehensive environment check
console.log('=== SUPABASE CONFIGURATION DEBUG ===');
console.log('VITE_SUPABASE_URL:', supabaseUrl || 'MISSING');
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING');
console.log('Environment:', import.meta.env.MODE);
console.log('All env vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ CRITICAL: Missing Supabase configuration!');
  console.error('Please ensure these environment variables are set:');
  console.error('- VITE_SUPABASE_URL: Your Supabase project URL');
  console.error('- VITE_SUPABASE_ANON_KEY: Your Supabase anonymous key');
}

// Create Supabase client with enhanced error handling
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        'X-Client-Info': 'rooted-together-app',
      },
    },
  }
);

// Enhanced connection testing
const testSupabaseConnection = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Skipping connection test - missing configuration');
    return;
  }

  try {
    console.log('🔄 Testing Supabase connection...');
    
    // Test basic connectivity
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Supabase connection error:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
      });
    } else {
      console.log('✅ Supabase connected successfully');
      console.log('Session data:', data.session ? 'User logged in' : 'No active session');
    }
  } catch (networkError) {
    console.error('❌ Network error connecting to Supabase:', networkError);
    console.error('This usually indicates:');
    console.error('1. Invalid Supabase URL');
    console.error('2. Network connectivity issues');
    console.error('3. CORS configuration problems');
    console.error('4. Supabase project is paused/inactive');
  }
}

export type Profile = {
  id: string;
  username: string;
  display_name: string;
  location_text?: string;
  latitude?: number;
  longitude?: number;
  growing_zone?: string;
  experience_level: 'Sprout' | 'Seedling' | 'Sapling' | 'Branch' | 'Oak';
  available_space: string[];
  sun_exposure: string[];
  gardening_goals: string[];
  preferred_plants: string;
  bio: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read_at?: string;
  created_at: string;
  sender?: Profile;
  recipient?: Profile;
};

export type GardeningPost = {
  id: string;
  author_id: string;
  title: string;
  content: string;
  growing_zone?: string;
  tags: string[];
  image_url?: string;
  created_at: string;
  author?: Profile;
};

export type Connection = {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  requester?: Profile;
  addressee?: Profile;
};