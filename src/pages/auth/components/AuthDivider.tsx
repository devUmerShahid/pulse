// src/pages/auth/components/AuthDivider.tsx

const AuthDivider = () => (
  <div className="relative my-6">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-zinc-200" />
    </div>
    <div className="relative flex justify-center text-[11px] font-medium tracking-wider text-zinc-400">
      <span className="bg-white px-3">OR CONTINUE WITH</span>
    </div>
  </div>
);

export default AuthDivider;
