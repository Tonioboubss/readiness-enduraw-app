import { supabase } from "./supabase";

/**
 * Create a new user account.
 */
export async function signUpWithEmail({ email, password, fullName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Log in an existing user.
 */
export async function signInWithEmail({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Log out current user.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }

  return true;
}

/**
 * Get current active session.
 */
export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

/**
 * Get current logged user.
 */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return data.user;
}

/**
 * Listen to auth state changes.
 * Useful in App.js to update navigation.
 */
export function onAuthStateChange(callback) {
  const { data } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      callback(session);
    }
  );

  return data.subscription;
}

/*
Créer un compte
Se connecter
Se déconnecter
Récupérer la session active
Récupérer l’utilisateur connecté
Écouter les changements de connexion
*/