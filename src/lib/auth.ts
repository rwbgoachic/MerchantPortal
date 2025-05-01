import { supabase } from '@/supabaseClient';

export const handleLogin = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
};

export const handleLogout = async () => {
  await supabase.auth.signOut();
};