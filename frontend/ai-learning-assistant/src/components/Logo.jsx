import React from 'react';

const Logo = ({ size = 32, showText = true, className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Minimalistic Logo: Letter 'S' with AI concept */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Background circle */}
        <circle cx="20" cy="20" r="19" fill="#2563EB" opacity="0.1" stroke="#2563EB" strokeWidth="1" />
        
        {/* Main S shape with AI spark */}
        <path
          d="M 12 10 Q 12 14 16 14 Q 20 14 20 18 Q 20 22 16 22 Q 12 22 12 26 Q 12 30 16 30 L 24 30"
          stroke="#2563EB"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* AI Spark (lightning bolt) */}
        <path
          d="M 26 8 L 28 14 L 32 14 L 28 18 L 30 24 L 26 20 L 22 20 Z"
          fill="#2563EB"
        />
      </svg>

      {/* Text branding */}
      {showText && (
        <div className="flex flex-col">
          <span className="font-black text-sm text-slate-900 leading-none">Simplify</span>
          <span className="font-black text-xs text-blue-600 leading-none">AI</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
