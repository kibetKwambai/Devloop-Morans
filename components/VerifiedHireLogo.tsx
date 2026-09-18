import React from 'react';

export type LogoVariant = 'horizontal' | 'stacked' | 'icon' | 'poster' | 'seal' | 'badge';

interface VerifiedHireLogoProps {
  variant?: LogoVariant;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  className?: string;
  showTagline?: boolean;
  invertedText?: boolean;
  onClick?: () => void;
}

/**
 * 3D Faceted Shield Checkmark Icon Symbol
 * Faithfully recreating the surgical-grade VerifiedHire brand mark
 */
export const VerifiedHireIconMark: React.FC<{
  size?: number | string;
  className?: string;
}> = ({ size = 36, className = '' }) => {
  const uniqueId = React.useId().replace(/:/g, '_');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-shrink-0 transition-transform duration-300 ${className}`}
      aria-label="VerifiedHire Shield Mark"
    >
      <defs>
        {/* Top-Left Facet Gradient */}
        <linearGradient id={`tl_grad_${uniqueId}`} x1="40" y1="40" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>

        {/* Top-Right Upper Bar Gradient */}
        <linearGradient id={`tr_grad_${uniqueId}`} x1="100" y1="30" x2="160" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>

        {/* Bottom-Left Shield Curve Gradient */}
        <linearGradient id={`bl_grad_${uniqueId}`} x1="40" y1="80" x2="100" y2="175" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>

        {/* Bottom-Right Shield Curve Gradient (Deep Shadow) */}
        <linearGradient id={`br_grad_${uniqueId}`} x1="100" y1="175" x2="160" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="70%" stopColor="#172554" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>

        {/* Checkmark Main Body Gradient */}
        <linearGradient id={`chk_grad_${uniqueId}`} x1="60" y1="70" x2="160" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>

        {/* Checkmark 3D Depth Underside */}
        <linearGradient id={`chk_shade_${uniqueId}`} x1="80" y1="120" x2="140" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>

        {/* Subtle Glow Filter */}
        <filter id={`glow_${uniqueId}`} x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#3B82F6" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter={`url(#glow_${uniqueId})`}>
        {/* 1. TOP-LEFT SHIELD SEGMENT */}
        <path
          d="M 97 29 L 46 60 L 46 88 L 68 76 L 68 68 L 97 51 Z"
          fill={`url(#tl_grad_${uniqueId})`}
        />

        {/* 2. TOP-RIGHT SHIELD SEGMENT */}
        <path
          d="M 103 29 L 154 60 L 154 84 L 132 72 L 132 68 L 103 51 Z"
          fill={`url(#tr_grad_${uniqueId})`}
        />

        {/* 3. BOTTOM-LEFT SHIELD WING (Vibrant Light Reflective Face) */}
        <path
          d="M 46 95 L 46 122 C 46 148 70 167 97 176 L 97 148 C 78 141 68 128 68 116 L 68 83 Z"
          fill={`url(#bl_grad_${uniqueId})`}
        />

        {/* 4. BOTTOM-RIGHT SHIELD WING (Deep Isometric Shadow Face) */}
        <path
          d="M 154 92 L 154 122 C 154 148 130 167 103 176 L 103 148 C 122 141 132 128 132 116 L 132 80 Z"
          fill={`url(#br_grad_${uniqueId})`}
        />

        {/* 5. 3D INTEGRATED CHECKMARK (Left Hook) */}
        <path
          d="M 68 97 L 97 126 L 111 112 L 82 83 Z"
          fill={`url(#chk_shade_${uniqueId})`}
        />

        {/* 6. 3D INTEGRATED CHECKMARK (Main Right Sweeping Arm) */}
        <path
          d="M 97 126 L 160 63 L 138 41 L 82 97 Z"
          fill={`url(#chk_grad_${uniqueId})`}
        />

        {/* 7. CHECKMARK FRONT HIGHLIGHT CAP */}
        <path
          d="M 97 126 L 160 63 L 154 57 L 97 114 Z"
          fill="#93C5FD"
          opacity="0.65"
        />
      </g>
    </svg>
  );
};

export const VerifiedHireLogo: React.FC<VerifiedHireLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showTagline = false,
  invertedText = false,
  onClick
}) => {
  // Size mappings
  const iconSizes = {
    xs: 20,
    sm: 28,
    md: 38,
    lg: 48,
    xl: 64,
    '2xl': 96,
    custom: 38
  };

  const textSizes = {
    xs: 'text-base',
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
    '2xl': 'text-6xl',
    custom: 'text-2xl'
  };

  const iconPx = iconSizes[size];
  const textSizeClass = textSizes[size];

  // -------------------------------------------------------------
  // VARIANT: ICON ONLY
  // -------------------------------------------------------------
  if (variant === 'icon') {
    return (
      <div 
        onClick={onClick} 
        className={`inline-flex items-center justify-center ${onClick ? 'cursor-pointer hover:opacity-90' : ''} ${className}`}
      >
        <VerifiedHireIconMark size={iconPx} />
      </div>
    );
  }

  // -------------------------------------------------------------
  // VARIANT: STACKED (Centered Icon + Wordmark + Tagline)
  // -------------------------------------------------------------
  if (variant === 'stacked') {
    return (
      <div 
        onClick={onClick}
        className={`flex flex-col items-center text-center select-none group ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <div className="transform group-hover:scale-105 transition-transform duration-300">
          <VerifiedHireIconMark size={iconPx * 1.5} />
        </div>

        <div className="mt-3 flex items-baseline justify-center tracking-tight font-black font-display">
          <span className={invertedText ? 'text-white' : 'text-slate-900 dark:text-white'} style={{ fontSize: `${iconPx * 0.9}px` }}>
            Verified
          </span>
          <span className="text-indigo-600 dark:text-indigo-400 ml-0.5" style={{ fontSize: `${iconPx * 0.9}px` }}>
            Hire
          </span>
          <span className="text-[10px] font-bold text-slate-400 dark:text-indigo-300 ml-1 uppercase">TM</span>
        </div>

        {showTagline && (
          <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xs text-balance">
            The world’s first surgical-grade verification layer for professional integrity.
          </p>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VARIANT: POSTER / HERO BRAND CARD
  // -------------------------------------------------------------
  if (variant === 'poster') {
    return (
      <div 
        onClick={onClick}
        className={`bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-indigo-900/40 rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col items-center text-center space-y-5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <div className="p-3 bg-gradient-to-b from-indigo-50/80 to-transparent dark:from-indigo-950/40 rounded-3xl">
          <VerifiedHireIconMark size={92} />
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-center tracking-tight font-black font-display text-4xl sm:text-5xl">
            <span className="text-slate-950 dark:text-white">Verified</span>
            <span className="text-indigo-600 dark:text-indigo-400 ml-1">Hire</span>
            <span className="text-xs font-bold text-slate-400 dark:text-indigo-300 ml-1 uppercase">TM</span>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium max-w-md mx-auto leading-relaxed">
            The world’s first surgical-grade verification layer for professional integrity.
          </p>
        </div>

        <div className="w-16 h-1 bg-indigo-600 rounded-full my-2" />

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-indigo-300">
          <span>Real Professionals</span>
          <span className="text-indigo-400">•</span>
          <span>Verified at Source</span>
          <span className="text-indigo-400">•</span>
          <span>A Better Tomorrow</span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VARIANT: TRUST SEAL / BADGE
  // -------------------------------------------------------------
  if (variant === 'seal' || variant === 'badge') {
    return (
      <div 
        onClick={onClick}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 shadow-sm select-none ${onClick ? 'cursor-pointer hover:border-indigo-400' : ''} ${className}`}
      >
        <VerifiedHireIconMark size={22} />
        <div className="flex flex-col text-left leading-none">
          <span className="text-[11px] font-black tracking-tight text-slate-900 dark:text-white">
            <span className="text-indigo-600 dark:text-indigo-400">Verified</span>Hire
          </span>
          <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            Source Certified
          </span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VARIANT: HORIZONTAL (DEFAULT - Brand Lockup for Navbars & Footers)
  // -------------------------------------------------------------
  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none group ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="transform group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
        <VerifiedHireIconMark size={iconPx} />
      </div>

      <div className="flex flex-col">
        <div className={`flex items-baseline font-black font-display tracking-tight leading-none ${textSizeClass}`}>
          <span className={invertedText ? 'text-white' : 'text-slate-950 dark:text-white group-hover:text-slate-800 dark:group-hover:text-slate-100 transition-colors'}>
            Verified
          </span>
          <span className="text-indigo-600 dark:text-indigo-400 ml-0.5 group-hover:text-indigo-500 transition-colors">
            Hire
          </span>
          <span className="text-[9px] font-bold text-slate-400 dark:text-indigo-300 ml-1 uppercase">TM</span>
        </div>

        {showTagline && (
          <span className="text-[10px] text-slate-400 dark:text-indigo-300 font-semibold tracking-tight mt-0.5 max-w-[200px] truncate">
            Surgical-Grade Verification
          </span>
        )}
      </div>
    </div>
  );
};
