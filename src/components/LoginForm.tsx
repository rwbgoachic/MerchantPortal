import { useState } from 'react';
import { Button, Input } from '@lib/ui/components';
import { handleLogin } from '@lib/auth';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleLogin(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={onSubmit} className="login-form">
      {error && <div className="error">{error}</div>}
      <Input 
        label="Email" 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input 
        label="Password" 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="primary" type="submit">Sign In</Button>
    </form>
  );
}