"use client";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
}

export const Logo = ({
  className = "",
  size = "lg",
  showBadge = true,
}: LogoProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const textClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative shrink-0 ${sizeClasses[size]}`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="top-face" x1="8" y1="6" x2="32" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2dd4bf" />
              <stop offset="1" stopColor="#14b8a6" />
            </linearGradient>
            <linearGradient id="left-face" x1="8" y1="13" x2="20" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0d9488" />
              <stop offset="1" stopColor="#0f766e" />
            </linearGradient>
            <linearGradient id="right-face" x1="20" y1="13" x2="32" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="#5eead4" />
              <stop offset="1" stopColor="#2dd4bf" />
            </linearGradient>
          </defs>

          <path d="M20 4 L34 12 L20 20 L6 12 Z" fill="url(#top-face)" />
          <path d="M6 12 L20 20 L20 36 L6 28 Z" fill="url(#left-face)" />
          <path d="M20 20 L34 12 L34 28 L20 36 Z" fill="url(#right-face)" />

          <path d="M20 12 L25 15 L20 18 L15 15 Z" fill="#ffffff" opacity="0.95" />
          <path d="M15 15 L20 18 L20 24 L15 21 Z" fill="#cbd5e1" opacity="0.7" />
          <path d="M20 18 L25 15 L25 21 L20 24 Z" fill="#94a3b8" opacity="0.7" />
        </svg>
      </div>

      <div className="flex flex-col justify-center">
        <div className={`font-display font-bold tracking-tight text-slate-100 flex items-baseline ${textClasses[size]}`}>
          Stor<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-600 font-extrabold">Ex</span>
        </div>

        {showBadge && (
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest -mt-1 ml-0.5">
            Terminal
          </span>
        )}
      </div>
    </div>
  );
};