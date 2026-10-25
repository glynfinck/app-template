import type { Session } from '@supabase/supabase-js';

import { supabase } from './supabase';

// All sign-in goes through this file. Which methods work depends on the providers enabled in the
// app's Supabase project. Social providers (Apple, Google, ...) need a redirect back into the app:
// add them here per app, following Supabase's Expo social sign-in guide. If any social provider is
// offered on iOS, Sign in with Apple must be offered too (App Store guideline 4.8).

export async function signUpWithPassword(email: string, password: string): Promise<Session | null> {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data.session;
}

export async function signInWithPassword(email: string, password: string): Promise<Session> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getAccessToken(): Promise<string | null> {
  return (await getSession())?.access_token ?? null;
}

/** Calls back whenever the user signs in, signs out or the session refreshes. Returns an unsubscribe function. */
export function onSessionChange(callback: (session: Session | null) => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}
