import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL and Anon Key are required. Please check your .env.local file and deployment environment variables.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Alert {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  latitude: number | null;
  longitude: number | null;
  location_accuracy: number | null;
  alert_type: 'voice_help' | 'manual' | 'emergency';
  status: 'sent' | 'acknowledged' | 'resolved';
  created_at: string;
  front_photo_url?: string | null;
  back_photo_url?: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
}
