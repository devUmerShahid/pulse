import React from 'react';

interface PulseLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  /** Optional caption shown under the dots (e.g. "Loading Pulse..."). */
  label?: string;
}

/**
 * Brand loading indicator — three indigo dots that "pulse" in a staggered
 * rhythm. Use this everywhere the app shows a loading state so the whole
 * experience shares one pulse theme.
 */
const PulseLoader: React.FC<PulseLoaderProps> = ({ size = 'md', label }) => {
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-3 h-3' : 'w-2 h-2';
  const labelSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex items-center justify-center gap-1.5">
        <div className={`${dotSize} rounded-full bg-[#5c5cff] animate-pulse-dot`} />
        <div className={`${dotSize} rounded-full bg-[#5c5cff] animate-pulse-dot [animation-delay:0.15s]`} />
        <div className={`${dotSize} rounded-full bg-[#5c5cff] animate-pulse-dot [animation-delay:0.3s]`} />
      </div>
      {label && <span className={`${labelSize} font-medium text-gray-500`}>{label}</span>}
    </div>
  );
};

export default PulseLoader;
