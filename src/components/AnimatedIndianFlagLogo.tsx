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
    sm: { box: 'w-8 h-8', chakra: 'w-2.5 h-2.5', radius: 'rounded-lg' },
    md: { box: 'w-10 h-10 sm:w-11 sm:h-11', chakra: 'w-3.5 h-3.5', radius: 'rounded-xl' },
    lg: { box: 'w-14 h-14', chakra: 'w-4.5 h-4.5', radius: 'rounded-2xl' },
    xl: { box: 'w-16 h-16', chakra: 'w-5.5 h-5.5', radius: 'rounded-2xl' }
  }[size];

  return (
    <div 
      className={`relative inline-flex items-center justify-center ${dimensions.box} ${dimensions.radius} overflow-hidden shadow-lg shadow-amber-500/25 border-2 border-amber-400/50 select-none group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-amber-500/40 hover:border-amber-400 active:scale-95 ${className}`}
      title="IND CROSSTAX AI - Official Indian Flag Emblem"
    >
      {/* 3 Tricolor Bands */}
      <div className="absolute inset-0 flex flex-col w-full h-full">
        {/* Top: Kesari / Deep Saffron with gradient sheen */}
        <div className="h-1/3 w-full bg-gradient-to-r from-[#FF9933] via-[#FF8008] to-[#FFA751] relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent"></div>
        </div>

        {/* Middle: Shwet / Pure White */}
        <div className="h-1/3 w-full bg-[#FFFFFF] relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/60 to-transparent"></div>
        </div>

        {/* Bottom: Hara / India Green with depth */}
        <div className="h-1/3 w-full bg-gradient-to-r from-[#138808] via-[#0E7A05] to-[#1FB30F] relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent"></div>
        </div>
      </div>

      {/* Flag Flutter Wave Shimmer Effect */}
      {showWave && (
        <div className="absolute inset-0 pointer-events-none opacity-45 bg-[linear-gradient(115deg,rgba(255,255,255,0.5)_0%,rgba(0,0,0,0.15)_30%,rgba(255,255,255,0.5)_60%,rgba(0,0,0,0.15)_100%)] animate-pulse"></div>
      )}

      {/* Centerpiece: Ashoka Chakra (Rotating with 24 Radial Spokes) */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="relative flex items-center justify-center">
          <svg 
            className={`${dimensions.chakra} text-[#000080] animate-[spin_10s_linear_infinite] drop-shadow-[0_0_2px_rgba(0,0,128,0.9)]`} 
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

      {/* Luxury Golden Outer Sheen Ring & Hover Animation */}
      <div className="absolute inset-0 rounded-inherit ring-1 ring-inset ring-amber-300/40 group-hover:ring-amber-300/80 transition-all pointer-events-none"></div>
      
      {/* Dynamic diagonal shimmer beam on hover */}
      <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -rotate-45 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none"></div>
    </div>
  );
};
