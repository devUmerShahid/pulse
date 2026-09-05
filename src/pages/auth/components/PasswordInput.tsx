// src/pages/auth/components/PasswordInput.tsx
import { useState, type ChangeEvent, type ReactNode } from 'react';

const inputClass =
  'w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 pr-11 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[#7B5CF6] focus:ring-2 focus:ring-[#7B5CF6]/20';

interface PasswordInputProps {
  id: string;
  name?: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  labelExtra?: ReactNode;
}

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <path d="M1 1l22 22" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
  </svg>
);

const PasswordInput = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder = '••••••••',
  required = false,
  labelExtra,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      {labelExtra ? (
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor={id} className="text-sm font-medium text-zinc-700">
            {label}
          </label>
          {labelExtra}
        </div>
      ) : (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-zinc-700">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={inputClass}
          required={required}
          autoComplete={name === 'confirmPassword' ? 'new-password' : name === 'password' ? 'new-password' : 'current-password'}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition cursor-pointer"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
