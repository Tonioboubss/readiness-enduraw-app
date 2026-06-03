import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase environment variables. Check your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // local session save
    autoRefreshToken: true, //token auto refresh after expiration
    persistSession: true,  // still connected when app closed
    detectSessionInUrl: false, // web specific (disabled when on mobile)
  },
});

/*
1. Lit les infos de connexion
2. Crée une connexion à Supabase
3. Garde l'utilisateur connecté
4. Rend cette connexion disponible partout dans l'application
*/