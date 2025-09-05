import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate URL format
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Comprehensive environment check
console.log('=== SUPABASE CONFIGURATION DEBUG ===');
console.log('VITE_SUPABASE_URL:', supabaseUrl || 'MISSING');
console.log('URL is valid:', supabaseUrl ? isValidUrl(supabaseUrl) : false);
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING');
console.log('Environment:', import.meta.env.MODE);
console.log('All env vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));
console.log('Current URL:', window.location.href);
console.log('Is production build:', import.meta.env.PROD);

if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
  console.error('❌ CRITICAL: Invalid Supabase configuration!');
  console.error('Please ensure these environment variables are set:');
  console.error('- VITE_SUPABASE_URL: Your Supabase project URL (must be a valid URL)');
  console.error('- VITE_SUPABASE_ANON_KEY: Your Supabase anonymous key');
  
  // Show a user-friendly error in production
  if (import.meta.env.PROD) {
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; background: #fee2e2; border-bottom: 1px solid #fecaca; padding: 12px; z-index: 9999; font-family: Arial, sans-serif;">
        <div style="max-width: 1200px; margin: 0 auto; color: #991b1b;">
          <strong>⚠️ Configuration Error:</strong> Supabase environment variables are missing. Please check your deployment configuration.
        </div>
      </div>
    `;
    document.body.appendChild(errorDiv);
  }
}

// Create Supabase client with enhanced error handling
export const supabase = createClient(
  supabaseUrl && isValidUrl(supabaseUrl) ? supabaseUrl : 'https://localhost:54321',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'X-Client-Info': 'rooted-together-app',
      },
      fetch: (url, options = {}) => {
        // Add timeout and better error handling for fetch requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        return fetch(url, {
          ...options,
          signal: controller.signal,
        }).finally(() => {
          clearTimeout(timeoutId);
        });
      },
    },
  }
);

// Enhanced connection testing
const testSupabaseConnection = async () => {
  if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
    console.warn('⚠️ Skipping connection test - missing configuration');
    return;
  }

  try {
    console.log('🔄 Testing Supabase connection...');
    console.log('Testing with URL:', supabaseUrl);
    console.log('Testing with key prefix:', supabaseAnonKey.substring(0, 20) + '...');
    console.log('Key type check:', supabaseAnonKey.includes('service_role') ? '⚠️ SERVICE ROLE KEY DETECTED' : '✅ Anonymous key');
    
    // Test basic connectivity with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 5000)
    );
    
    const sessionPromise = supabase.auth.getSession();
    
    const { data, error } = await Promise.race([sessionPromise, timeoutPromise]);
    
    if (error) {
      console.error('❌ Supabase connection error:', error);
    } else {
      console.log('✅ Supabase connected successfully');
      
      // Test database read permissions with timeout
      try {
        console.log('🔄 Testing database read permissions...');
        const dbTimeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 3000)
        );
        
        const dbTestPromise = supabase
          .from('profiles')
          .select('count')
          .limit(1);
        
        const testRead = await Promise.race([dbTestPromise, dbTimeoutPromise]);
        
        if (testRead.error) {
          console.error('❌ Database access error:', testRead.error);
        } else {
          console.log('✅ Database read access working');
        }
      } catch (dbError) {
        console.error('❌ Database test failed:', dbError);
      }
    }
  } catch (networkError) {
    console.error('❌ Network error connecting to Supabase:', networkError);
  }
};

// Test connection on module load
testSupabaseConnection();

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