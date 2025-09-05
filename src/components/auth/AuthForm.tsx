import { useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onModeChange: (mode: 'signin' | 'signup') => void;
}

export function AuthForm({ mode, onModeChange }: AuthFormProps) {
  const { signIn, signUp } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          console.error('Sign up error details:', error);
          throw error;
        }
      }
    } catch (error: any) {
      console.error('❌ Auth form error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'An unexpected error occurred';
      
      if (error.message?.includes('fetch')) {
        errorMessage = 'Connection failed. Please check your internet connection and try again.';
      } else if (error.message?.includes('NetworkError')) {
        errorMessage = 'Network error. Please verify your Supabase configuration and try again.';
      } else if (error.message?.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to authentication service. Please check your Supabase URL and keys.';
      } else if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.message?.includes('User already registered')) {
        errorMessage = 'An account with this email already exists. Try signing in instead.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="email"
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          loading={loading}
          size="lg"
        >
          {mode === 'signin' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => onModeChange(mode === 'signin' ? 'signup' : 'signin')}
            className="text-green-600 hover:text-green-500 font-medium"
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}