"use client"


interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}

export const Logo = ({ className = "", size = "lg", showBadge = true }: LogoProps) => {
  // Configurable sizes so you can reuse this in headers, footers, or loaders
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  const textClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl"
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon (Custom 3D Isometric Cube SVG) */}
      <div className={`relative shrink-0 ${sizeClasses[size]}`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <defs>
            <linearGradient id="top-face" x1="8" y1="6" x2="32" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60A5FA" /> {/* Tailwind blue-400 */}
              <stop offset="1" stopColor="#3B82F6" /> {/* Tailwind blue-500 */}
            </linearGradient>
            <linearGradient id="left-face" x1="8" y1="13" x2="20" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563EB" /> {/* Tailwind blue-600 */}
              <stop offset="1" stopColor="#1D4ED8" /> {/* Tailwind blue-800 */}
            </linearGradient>
            <linearGradient id="right-face" x1="20" y1="13" x2="32" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06B6D4" /> {/* Tailwind cyan-500 */}
              <stop offset="1" stopColor="#0891B2" /> {/* Tailwind cyan-600 */}
            </linearGradient>
          </defs>
          
          {/* Top Face */}
          <path d="M20 4 L34 12 L20 20 L6 12 Z" fill="url(#top-face)" />
          {/* Left Face */}
          <path d="M6 12 L20 20 L20 36 L6 28 Z" fill="url(#left-face)" />
          {/* Right Face */}
          <path d="M20 20 L34 12 L34 28 L20 36 Z" fill="url(#right-face)" />
          
          {/* Inner Glowing Core (Represents Secure Assets inside the Wallet) */}
          <path d="M20 12 L25 15 L20 18 L15 15 Z" fill="#FFFFFF" opacity="0.95" />
          <path d="M15 15 L20 18 L20 24 L15 21 Z" fill="#E2E8F0" opacity="0.8" />
          <path d="M20 18 L25 15 L25 21 L20 24 Z" fill="#CBD5E1" opacity="0.8" />
        </svg>
      </div>

      {/* Logo Typography */}
      <div className="flex flex-col justify-center mt-1">
        <div className={`font-bold tracking-tight text-slate-800 flex items-baseline ${textClasses[size]}`}>
          Stor<span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500 font-extrabold">Ex</span>
        </div>
        
        {/* Optional WaaS Badge */}
        {showBadge && (
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest -mt-1 ml-0.5">
            WaaS Platform
          </span>
        )}
      </div>
    </div>
  );
}