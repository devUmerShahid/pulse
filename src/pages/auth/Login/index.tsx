// src/pages/auth/Login/index.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { authAPI } from '../../../api';
import AuthLayout from '../components/AuthLayout';
import PasswordInput from '../components/PasswordInput';
// import AuthDivider from '../components/AuthDivider';
// import GoogleSignInButton from '../components/GoogleSignInButton';

const inputClass =
  'w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[#7B5CF6] focus:ring-2 focus:ring-[#7B5CF6]/20';

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
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : undefined;
      setError(message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your credentials to access your feed."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-[#7B5CF6] hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <PasswordInput
          id="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          labelExtra={
            <button
              type="button"
              onClick={() => alert('Password reset flow coming soon.')}
              className="text-sm font-medium text-[#7B5CF6] hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          }
        />

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#7B5CF6] py-3 text-sm font-semibold text-white transition hover:bg-[#6B4CE6] disabled:opacity-60 cursor-pointer"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* <AuthDivider />
      <GoogleSignInButton /> */}
    </AuthLayout>
  );
};

export default Login;
