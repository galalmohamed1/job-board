import React from 'react';

interface HorusLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const HorusLogo: React.FC<HorusLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
}) => {
  return (
    <div className={`flex items-center gap-3 select-none text-right ${className}`}>
      {/* Eye of Horus Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 100 80"
          className={
            size === 'sm' ? 'w-10 h-8' : size === 'lg' ? 'w-16 h-12' : 'w-12 h-10'
          }
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Eyebrow */}
          <path
            d="M 12 24 C 30 14, 70 14, 88 24 C 82 20, 45 12, 12 24 Z"
            fill="url(#goldGradient)"
          />
          {/* Upper Eye Lid */}
          <path
            d="M 14 36 C 35 20, 68 20, 86 36 C 68 25, 35 25, 14 36 Z"
            fill="url(#goldGradient)"
          />
          {/* Pupil and Iris */}
          <circle cx="50" cy="38" r="9.5" fill="url(#goldGradient)" />
          <circle cx="50" cy="38" r="4.5" fill="#08101E" />
          <circle cx="52" cy="36" r="2" fill="#FDE047" />
          {/* Lower Eye Lid */}
          <path
            d="M 16 38 C 35 48, 68 48, 84 38 C 68 45, 35 45, 16 38 Z"
            fill="url(#goldGradient)"
          />
          {/* Falcon Cheek Marking (Spiral / Hook) */}
          <path
            d="M 50 48 C 50 64, 38 68, 30 64 C 24 60, 26 54, 32 55 C 38 56, 42 59, 44 54 C 45 49, 46 48, 50 48 Z"
            fill="url(#goldGradient)"
          />
          {/* Vertical Falcon Plume Marking */}
          <path
            d="M 64 42 C 65 52, 66 68, 68 76 C 66 76, 62 62, 60 44 Z"
            fill="url(#goldGradient)"
          />
          {/* Outer cosmetic line */}
          <path
            d="M 85 36 C 92 37, 96 40, 98 42 C 95 42, 90 39, 84 38 Z"
            fill="url(#goldGradient)"
          />
          
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F3C053" />
              <stop offset="50%" stopColor="#D49B35" />
              <stop offset="100%" stopColor="#B87B22" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Typography */}
      <div className="flex items-start flex-col">
        <div className="flex items-baseline gap-2">
          <span className="text-xl md:text-2xl font-black tracking-tight text-white font-['Cairo']">
            سوق حورس
          </span>
        </div>
        <span className="text-[11px] font-bold tracking-wider text-[#D49B35] font-['Cairo'] -mt-1 uppercase">
          HORUS MARKET
        </span>
        {showTagline && (
          <span className="text-[10px] text-slate-300 font-medium whitespace-nowrap hidden sm:inline-block">
            منصة التجارة والتسويق والخدمات الرقمية
          </span>
        )}
      </div>
    </div>
  );
};

export default HorusLogo;
