import React from 'react';

const Logo = ({ size = 40, showText = true, variant = 'default', className = "" }) => {
  // Variants: 'default', 'icon-only', 'compact', 'dark'
  
  const getColors = () => {
    if (variant === 'dark') {
      return { primary: '#1E40AF', accent: '#0EA5E9', text: '#ffffff' };
    }
    return { primary: '#2563EB', accent: '#0EA5E9', text: '#0F172A' };
  };

  const colors = getColors();
  const scale = size / 40; // Base size is 40

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Main Logo Mark */}
      <div className="relative flex-shrink-0" style={{ width: `${size}px`, height: `${size}px` }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          {/* Define gradients */}
          <defs>
            <linearGradient id="gradientS" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.primary} stopOpacity="1" />
              <stop offset="100%" stopColor={colors.accent} stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="gradientAI" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.accent} stopOpacity="1" />
              <stop offset="100%" stopColor={colors.primary} stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Background Circle - Soft */}
          <circle cx="20" cy="20" r="19.5" fill="none" stroke={colors.primary} strokeWidth="0.5" opacity="0.1" />

          {/* Main S Shape - Premium Design */}
          <path
            d="M 10 12 C 10 10 12 8 14 8 C 16 8 18 9 18 11 C 18 13 16 14 14 14 C 13 14 12 14.5 12 15.5 C 12 16.5 13 17 14 17 L 26 17 C 28 17 30 18 30 20 C 30 22 28 23 26 23 C 24 23 22 22 22 20"
            stroke="url(#gradientS)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.95"
          />

          {/* AI Symbol - Modern Spark */}
          <g>
            {/* Outer spark glow */}
            <circle cx="26" cy="12" r="5" fill={colors.accent} opacity="0.15" />
            
            {/* Inner lightning bolt */}
            <path
              d="M 26 8 L 28 13 L 32 13 L 29 17 L 31 23 L 26 19 L 21 19 Z"
              fill="url(#gradientAI)"
              opacity="0.9"
            />
            
            {/* Highlight shine */}
            <path
              d="M 26 9 L 27.5 12 L 29 12 L 27 14.5 Z"
              fill="white"
              opacity="0.6"
            />
          </g>

          {/* Accent dots for sophistication */}
          <circle cx="13" cy="28" r="1.2" fill={colors.primary} opacity="0.4" />
          <circle cx="28" cy="29" r="0.8" fill={colors.accent} opacity="0.5" />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && variant !== 'icon-only' && (
        <div className="flex flex-col leading-none">
          <div style={{ display: 'flex', gap: '1px', alignItems: 'baseline' }}>
            <span className="font-black tracking-tight" style={{ 
              fontSize: `${14 * scale}px`,
              color: colors.text,
              letterSpacing: '-0.5px'
            }}>
              Simplify
            </span>
            <span className="font-black" style={{ 
              fontSize: `${11 * scale}px`,
              color: colors.accent,
              letterSpacing: '0.5px'
            }}>
              AI
            </span>
          </div>
          {variant === 'default' && (
            <span className="text-xs font-medium" style={{ 
              color: colors.text,
              opacity: 0.6,
              marginTop: '2px'
            }}>
              Master Your Learning
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
