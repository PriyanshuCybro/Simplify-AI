import React from 'react';

const Logo = ({ size = 56, showText = true, variant = 'default', className = "" }) => {
  const getColors = () => {
    if (variant === 'dark') {
      return { primary: '#1E40AF', accent: '#0EA5E9', text: '#ffffff' };
    }
    return { primary: '#2563EB', accent: '#0EA5E9', text: '#0F172A' };
  };

  const colors = getColors();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Mark */}
      <div className="relative flex-shrink-0" style={{ width: `${size}px`, height: `${size}px` }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          <defs>
            {/* Main gradient for book */}
            <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.primary} stopOpacity="1" />
              <stop offset="100%" stopColor="#1E40AF" stopOpacity="1" />
            </linearGradient>
            {/* Gradient for spark */}
            <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.accent} stopOpacity="1" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="1" />
            </linearGradient>
            <filter id="glow">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Open Book - Left page */}
          <path
            d="M 18 20 L 14 28 Q 12 32 14 40 L 28 40 L 28 20 Z"
            fill="url(#bookGrad)"
            opacity="0.9"
            filter="url(#glow)"
          />

          {/* Open Book - Right page */}
          <path
            d="M 28 20 L 28 40 L 42 40 Q 44 32 42 28 L 38 20 Z"
            fill={colors.primary}
            opacity="0.7"
            filter="url(#glow)"
          />

          {/* Book spine/center */}
          <line x1="28" y1="20" x2="28" y2="40" stroke={colors.primary} strokeWidth="1.5" opacity="0.5" />

          {/* Page lines on left */}
          <line x1="18" y1="26" x2="26" y2="26" stroke="white" strokeWidth="1" opacity="0.6" />
          <line x1="16" y1="32" x2="26" y2="32" stroke="white" strokeWidth="1" opacity="0.5" />
          <line x1="15" y1="38" x2="26" y2="38" stroke="white" strokeWidth="1" opacity="0.4" />

          {/* Page lines on right */}
          <line x1="30" y1="26" x2="38" y2="26" stroke="white" strokeWidth="1" opacity="0.6" />
          <line x1="30" y1="32" x2="40" y2="32" stroke="white" strokeWidth="1" opacity="0.5" />
          <line x1="30" y1="38" x2="39" y2="38" stroke="white" strokeWidth="1" opacity="0.4" />

          {/* Upward Arrow - Growth/Learning */}
          <g transform="translate(28, 12)">
            {/* Arrow shaft */}
            <line x1="0" y1="8" x2="0" y2="0" stroke={colors.primary} strokeWidth="2.5" strokeLinecap="round" />
            
            {/* Arrow head - top */}
            <path
              d="M -3 4 L 0 0 L 3 4"
              stroke={colors.primary}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>

          {/* AI Spark - Lightning Bolt at top */}
          <g transform="translate(28, 4)">
            <path
              d="M 0 -2 L 2.5 2 L 0.5 2 L 3 8 L -1 3.5 L 0.5 3.5 Z"
              fill="url(#sparkGrad)"
              filter="url(#glow)"
            />
            
            {/* Inner highlight */}
            <path
              d="M 0.5 0 L 1.5 1.5 L 0 1.5 L 1.5 4 Z"
              fill="white"
              opacity="0.5"
            />
          </g>

          {/* Circle background - subtle */}
          <circle cx="32" cy="28" r="30" fill="none" stroke={colors.primary} strokeWidth="1" opacity="0.15" />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && variant !== 'icon-only' && (
        <div className="flex flex-col leading-tight mt-0.5">
          <div style={{ display: 'flex', gap: '0px', alignItems: 'center' }}>
            <span className="font-black tracking-tighter" style={{ 
              fontSize: `${16 * (size / 40)}px`,
              color: colors.text,
              letterSpacing: '-0.8px',
              lineHeight: '1.05'
            }}>
              Simplify
            </span>
            <span className="font-black" style={{ 
              fontSize: `${14 * (size / 40)}px`,
              color: colors.accent,
              letterSpacing: '0.3px',
              lineHeight: '1.05',
              marginLeft: '2px'
            }}>
              AI
            </span>
          </div>
          {variant === 'default' && (
            <span className="text-[9px] font-bold" style={{ 
              color: colors.text,
              opacity: 0.6,
              marginTop: '1px',
              letterSpacing: '0.4px'
            }}>
              Learn & Grow
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
