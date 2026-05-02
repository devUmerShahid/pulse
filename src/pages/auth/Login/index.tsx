// src/pages/auth/Login/index.tsx
import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      login(response.token, response.user);
      navigate('/feed');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold tracking-tight">Pulse</h1>
          <p className="text-zinc-500 mt-2">Stay in the pulse</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl focus:outline-none focus:border-blue-500 text-lg"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl focus:outline-none focus:border-blue-500 text-lg"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-2xl font-semibold text-lg hover:bg-zinc-200 transition disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-zinc-500">
            Don't have an account?{' '}
            <span 
              onClick={() => navigate('/register')}
              className="text-blue-500 font-medium cursor-pointer hover:underline"
            >
              Create one
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;