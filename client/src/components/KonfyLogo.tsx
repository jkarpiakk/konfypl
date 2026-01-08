interface KonfyLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function KonfyLogo({ className = "", size = "md", showIcon = false }: KonfyLogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && (
        <div className="flex items-center justify-center">
          <KonfyIcon size={size === "sm" ? 24 : size === "md" ? 32 : 40} />
        </div>
      )}
      <div className="flex items-baseline">
        <span className={`font-heading font-semibold ${sizeClasses[size]} text-[#0F172A] tracking-tight relative`}>
          konfy
          <span className="absolute -bottom-0.5 left-0 w-5 h-0.5 bg-gradient-to-r from-[#2ED3B7] to-[#2ED3B7]/50 rounded-full" />
        </span>
        <span className={`font-heading font-semibold ${sizeClasses[size]} text-[#2ED3B7] tracking-tight`}>
          .pl
        </span>
      </div>
    </div>
  );
}

interface KonfyIconProps {
  size?: number;
  className?: string;
}

export function KonfyIcon({ size = 32, className = "" }: KonfyIconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      fill="none" 
      className={className}
    >
      <rect x="17" y="14" width="6" height="36" rx="1" fill="#0F172A"/>
      <polygon points="23,30 41,14 48,14 30,30" fill="#0F172A"/>
      <polygon points="23,34 41,50 48,50 30,34" fill="#2ED3B7"/>
    </svg>
  );
}
