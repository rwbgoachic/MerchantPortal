import { describe, it, expect, vi } from 'vitest';
import { handleLogin, handleLogout, getCurrentUser } from '@/lib/auth';
import { supabase } from '@/supabaseClient';
import { checkPermission } from '@/lib/rbac';

// Mock Supabase client
vi.mock('@/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn()
    }
  }
}));

// Mock RBAC
vi.mock('@/lib/rbac', () => ({
  checkPermission: vi.fn()
}));

describe('Authentication', () => {
  it('should successfully login with valid credentials', async () => {
    const mockUser = { id: '123', email: 'test@example.com', user_metadata: { roles: ['user'] } };
    
    // Mock successful login
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: { user: mockUser },
      error: null
    });
    
    // Mock permission check
    vi.mocked(checkPermission).mockReturnValueOnce(true);

    await expect(handleLogin('test@example.com', 'password123')).resolves.not.toThrow();
  });

  it('should throw error on login with invalid credentials', async () => {
    // Mock failed login
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: { user: null },
      error: new Error('Invalid credentials')
    });

    await expect(handleLogin('invalid@example.com', 'wrongpass'))
      .rejects.toThrow('Invalid credentials');
  });

  it('should throw error when user lacks required permissions', async () => {
    const mockUser = { id: '123', email: 'test@example.com', user_metadata: { roles: ['guest'] } };
    
    // Mock successful login but failed permission check
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: { user: mockUser },
      error: null
    });
    
    // Mock permission check failure
    vi.mocked(checkPermission).mockReturnValueOnce(false);

    await expect(handleLogin('test@example.com', 'password123'))
      .rejects.toThrow('Insufficient permissions');
  });

  it('should successfully logout', async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValueOnce({ error: null });
    await expect(handleLogout()).resolves.not.toThrow();
  });

  it('should get current user', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
      data: { user: mockUser },
      error: null
    });

    const user = await getCurrentUser();
    expect(user).toEqual(mockUser);
  });
});