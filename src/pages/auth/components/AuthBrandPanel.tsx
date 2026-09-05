// src/pages/auth/components/AuthBrandPanel.tsx

const AuthBrandPanel = () => {
  return (
    <div className="relative hidden lg:flex lg:w-1/2 flex-col items-center justify-center overflow-hidden bg-[#7B5CF6] px-12">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-16 h-80 w-80 rounded-full bg-white/15 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg shadow-purple-900/20">
          <img
            src="/pulse_logo.png"
            alt="Pulse logo"
            className="h-9 w-9"
          />
        </div>

        <p className="mb-8 text-xs font-semibold tracking-[0.35em] text-white/90">
          PULSE
        </p>

        <h1 className="text-xl font-semibold leading-tight text-white xl:text-[2.25rem]">
          Feel the Pulse
          <br />
          of the World
        </h1>

        <img
          src="/pulse-wave.png"
          alt=""
          className="mt-14 w-full max-w-sm opacity-90"
          aria-hidden
        />
      </div>
    </div>
  );
};

export default AuthBrandPanel;
