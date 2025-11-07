import { createClient } from '@supabase/supabase-js';

// ⚠️ WARNING: Hardcoding credentials is insecure and not recommended for production.
// This exposes your keys in your public code. The correct way is to use environment variables.
const supabaseUrl = 'https://acgsmcxmesvsftzugeik.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjZ3NtY3htZXN2c2Z0enVnZWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNzIzNTYsImV4cCI6MjA3Nzg0ODM1Nn0.EwiJajiscMqz1jHyyl-BDS4YIvc0nihBUn3m8pPUP1c';

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

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
