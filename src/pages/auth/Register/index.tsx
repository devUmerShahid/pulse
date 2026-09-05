// src/pages/auth/Register/index.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../../api';
import AuthLayout from '../components/AuthLayout';
import PasswordInput from '../components/PasswordInput';
// import AuthDivider from '../components/AuthDivider';
// import GoogleSignInButton from '../components/GoogleSignInButton';

const inputClass =
  'w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[#7B5CF6] focus:ring-2 focus:ring-[#7B5CF6]/20';

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
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
      navigate('/login');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : undefined;
      setError(message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Pulse and start sharing with the world."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[#7B5CF6] hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-zinc-700">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Jane Doe"
            value={formData.name}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="name@company.com"
            value={formData.email}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-zinc-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="janedoe"
            value={formData.username}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <PasswordInput
          id="password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#7B5CF6] py-3 text-sm font-semibold text-white transition hover:bg-[#6B4CE6] disabled:opacity-60 cursor-pointer mt-2"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      {/* <AuthDivider />
      <GoogleSignInButton label="Sign up with Google" /> */}
    </AuthLayout>
  );
};

export default Register;
