import React from 'react';

const Logo = ({ size = 40, showText = true, variant = 'default', className = "" }) => {
  // Variants: 'default', 'icon-only', 'compact', 'dark'
  
  const getColors = () => {
    if (variant === 'dark') {
      return { primary: '#1E40AF', accent: '#0EA5E9', text: '#ffffff', bg: '#1e293b' };
    }
    return { primary: '#2563EB', accent: '#0EA5E9', text: '#0F172A', bg: '#ffffff' };
  };

  const colors = getColors();
  const scale = size / 40; // Base size is 40

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Main Logo Mark - Bold & Visible */}
      <div className="relative flex-shrink-0" style={{ width: `${size}px`, height: `${size}px` }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Define gradients */}
          <defs>
            <linearGradient id="gradientBold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.primary} stopOpacity="1" />
              <stop offset="100%" stopColor="#1E40AF" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="gradientSpark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.accent} stopOpacity="1" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="1" />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Bold S Shape - Main Brand Mark */}
          <g filter="url(#shadow)">
            {/* First curve of S */}
            <path
              d="M 12 10 C 8 10 6 12 6 15 C 6 18 8 20 12 20 C 15 20 18 20 20 20"
              stroke="url(#gradientBold)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            
            {/* Second curve of S */}
            <path
              d="M 28 28 C 32 28 36 26 36 23 C 36 20 34 18 30 18 C 27 18 24 18 22 18"
              stroke="url(#gradientBold)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            
            {/* Middle connection */}
            <circle cx="21" cy="19" r="2.5" fill="url(#gradientBold)" />
          </g>

          {/* Bold AI Lightning Bolt - Accent */}
          <g filter="url(#shadow)">
            {/* Outer lightning shape */}
            <path
              d="M 32 6 L 35 14 L 40 14 L 36 22 L 39 32 L 32 24 L 28 24 Z"
              fill="url(#gradientSpark)"
              opacity="0.95"
            />
            
            {/* Inner highlight for depth */}
            <path
              d="M 32 8 L 34 13 L 37 13 L 34 18 L 36 25 Z"
              fill="white"
              opacity="0.4"
            />
          </g>

          {/* Accent circle background - subtle */}
          <circle
            cx="32"
            cy="18"
            r="16"
            fill="none"
            stroke="url(#gradientSpark)"
            strokeWidth="1"
            opacity="0.2"
          />

          {/* Corner accent dots */}
          <circle cx="10" cy="38" r="1.5" fill={colors.primary} opacity="0.6" />
          <circle cx="40" cy="40" r="1" fill={colors.accent} opacity="0.7" />
        </svg>
      </div>

      {/* Brand Text - Bold & Clear */}
      {showText && variant !== 'icon-only' && (
        <div className="flex flex-col leading-tight">
          <div style={{ display: 'flex', gap: '0px', alignItems: 'baseline' }}>
            <span className="font-black tracking-tighter" style={{ 
              fontSize: `${16 * scale}px`,
              color: colors.text,
              letterSpacing: '-1px',
              lineHeight: '1'
            }}>
              Simplify
            </span>
            <span className="font-black" style={{ 
              fontSize: `${13 * scale}px`,
              color: colors.accent,
              letterSpacing: '0.5px',
              lineHeight: '1'
            }}>
              AI
            </span>
          </div>
          {variant === 'default' && (
            <span className="text-[10px] font-bold" style={{ 
              color: colors.text,
              opacity: 0.7,
              marginTop: '1px',
              letterSpacing: '0.3px'
            }}>
              Master Learning
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
