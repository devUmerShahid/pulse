// src/pages/auth/Register/index.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../../api';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    name: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await authAPI.register({
        email: formData.email,
        username: formData.username,
        name: formData.name,
        password: formData.password,
      });

      alert('Account created successfully! Please login.');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold tracking-tight">Pulse</h1>
          <p className="text-zinc-500 mt-2">Join the conversation</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl focus:outline-none focus:border-blue-500 text-lg"
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl focus:outline-none focus:border-blue-500 text-lg"
              required
            />
          </div>

          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl focus:outline-none focus:border-blue-500 text-lg"
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl focus:outline-none focus:border-blue-500 text-lg"
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl focus:outline-none focus:border-blue-500 text-lg"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-2xl font-semibold text-lg hover:bg-zinc-200 transition disabled:opacity-70 mt-4"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-zinc-500">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              className="text-blue-500 font-medium cursor-pointer hover:underline"
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;