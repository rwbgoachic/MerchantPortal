import { User } from '@supabase/supabase-js';
import { Permission, RoleManager } from '@paysurity/security';

const roleManager = new RoleManager();

// Define permissions
const permissions = {
  'auth.login': new Permission('auth.login', 'Allow user to login'),
  'auth.logout': new Permission('auth.logout', 'Allow user to logout'),
};

// Define roles and their permissions
roleManager.addRole('user', [
  permissions['auth.login'],
  permissions['auth.logout'],
]);

export const checkPermission = (user: User | null, permissionName: keyof typeof permissions): boolean => {
  if (!user) return false;
  
  // Get user roles from metadata
  const roles = user.user_metadata?.roles || ['user'];
  
  // Check if any of the user's roles have the required permission
  return roles.some(role => 
    roleManager.hasPermission(role, permissionName)
  );
};