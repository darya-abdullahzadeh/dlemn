import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import 'react-native-url-polyfill/auto';

// Get Supabase URL and Anon Key from environment variables
// Set these in your .env file (see SUPABASE_SETUP.md for instructions)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '⚠️ Supabase credentials not found. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file. See SUPABASE_SETUP.md for instructions.'
  );
  console.error('Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('Supabase Key:', supabaseAnonKey ? 'Set' : 'Missing');
} else {
  console.log('✅ Supabase client initialized');
  console.log('Supabase URL:', supabaseUrl.substring(0, 30) + '...');
}

// Custom storage adapter using Expo SecureStore
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
