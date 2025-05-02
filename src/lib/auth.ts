import { supabase } from '@/supabaseClient';
import { checkPermission } from './rbac';

export const handleLogin = async (email: string, password: string) => {
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  
  // Check if user has required permissions
  if (!checkPermission(data.user, 'auth.login')) {
    throw new Error('Insufficient permissions');
  }
};

export const handleLogout = async () => {
  await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};