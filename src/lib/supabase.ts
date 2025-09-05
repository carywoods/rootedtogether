import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase Environment Check:', {
  url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'MISSING',
  key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING',
  nodeEnv: import.meta.env.MODE
});

let supabase;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl ? 'present' : 'missing',
    key: supabaseAnonKey ? 'present' : 'missing'
  });
  // Create a dummy client that will show clear errors
  supabase = createClient('https://dummy.supabase.co', 'dummy-key');
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

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