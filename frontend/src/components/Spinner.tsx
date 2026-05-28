interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };

export default function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <svg
      className={`animate-spin ${sizes[size]} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle className="opacity-10" cx="12" cy="12" r="10" stroke="#818cf8" strokeWidth="3" />
      <path
        className="opacity-80"
        fill="url(#spinner-grad)"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
      <defs>
        <linearGradient id="spinner-grad" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#818cf8" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
}
