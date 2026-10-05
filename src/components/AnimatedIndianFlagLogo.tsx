import React from 'react';

interface AnimatedIndianFlagLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWave?: boolean;
  className?: string;
}

export const AnimatedIndianFlagLogo: React.FC<AnimatedIndianFlagLogoProps> = ({
  size = 'md',
  showWave = true,
  className = ''
}) => {
  // Dimension mappings
  const dimensions = {
    sm: { box: 'w-7 h-7', svg: 'w-7 h-7', chakra: 'w-2 h-2', radius: 'rounded-lg' },
    md: { box: 'w-9 h-9 sm:w-10 sm:h-10', svg: 'w-9 h-9 sm:w-10 sm:h-10', chakra: 'w-3 h-3', radius: 'rounded-xl' },
    lg: { box: 'w-12 h-12', svg: 'w-12 h-12', chakra: 'w-4 h-4', radius: 'rounded-2xl' },
    xl: { box: 'w-16 h-16', svg: 'w-16 h-16', chakra: 'w-5 h-5', radius: 'rounded-2xl' }
  }[size];

  return (
    <div 
      className={`relative inline-flex items-center justify-center ${dimensions.box} ${dimensions.radius} overflow-hidden shadow-md shadow-amber-500/20 border border-amber-400/40 select-none group cursor-pointer transition-transform hover:scale-105 active:scale-95 ${className}`}
      title="IND CROSSTAX AI - Official Indian Flag Emblem"
    >
      {/* 3 Tricolor Bands */}
      <div className="absolute inset-0 flex flex-col w-full h-full">
        {/* Top: Kesari / Deep Saffron */}
        <div className="h-1/3 w-full bg-gradient-to-r from-[#FF9933] via-[#FF8008] to-[#FFA751] relative">
          {/* Subtle light shimmer */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
        </div>

        {/* Middle: Shwet / White */}
        <div className="h-1/3 w-full bg-[#FFFFFF] relative flex items-center justify-center">
          {/* Subtle gloss */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/50 to-transparent"></div>
        </div>

        {/* Bottom: Hara / India Green */}
        <div className="h-1/3 w-full bg-gradient-to-r from-[#138808] via-[#0E7A05] to-[#1FB30F] relative">
          {/* Subtle bottom shadow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </div>

      {/* Flag Flutter Wave Gradient Overlay */}
      {showWave && (
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(115deg,rgba(255,255,255,0.4)_0%,rgba(0,0,0,0.15)_30%,rgba(255,255,255,0.4)_60%,rgba(0,0,0,0.15)_100%)] animate-pulse"></div>
      )}

      {/* Centerpiece: Ashoka Chakra (Rotating with 24 Radial Spokes) */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="relative flex items-center justify-center">
          {/* Rotating SVG Chakra */}
          <svg 
            className={`${dimensions.chakra} text-[#000080] animate-[spin_10s_linear_infinite] drop-shadow-[0_0_1px_rgba(0,0,128,0.8)]`} 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Rim */}
            <circle cx="50" cy="50" r="46" stroke="#000080" strokeWidth="6" />
            
            {/* Inner Hub Circle */}
            <circle cx="50" cy="50" r="14" fill="#000080" />
            <circle cx="50" cy="50" r="6" fill="#FFFFFF" />

            {/* 24 Spokes rendered at 15-degree increments */}
            {[...Array(24)].map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2="50"
                y2="5"
                stroke="#000080"
                strokeWidth="2.5"
                strokeLinecap="round"
                transform={`rotate(${i * 15} 50 50)`}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Subtle Golden Sheen Border Glow */}
      <div className="absolute inset-0 rounded-inherit ring-1 ring-inset ring-amber-400/30 pointer-events-none"></div>
    </div>
  );
};
