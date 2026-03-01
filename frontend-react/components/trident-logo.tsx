export function TridentLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Center prong */}
      <path
        d="M24 4L24 32"
        stroke="url(#trident-gradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Left prong */}
      <path
        d="M14 10L14 26C14 29.3 18 32 24 32"
        stroke="url(#trident-gradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right prong */}
      <path
        d="M34 10L34 26C34 29.3 30 32 24 32"
        stroke="url(#trident-gradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Handle */}
      <path
        d="M24 32L24 44"
        stroke="url(#trident-gradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Cross bar */}
      <path
        d="M10 16H38"
        stroke="url(#trident-gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Prong tips */}
      <circle cx="14" cy="8" r="2.5" fill="url(#trident-gradient)" />
      <circle cx="24" cy="4" r="2.5" fill="url(#trident-gradient)" />
      <circle cx="34" cy="8" r="2.5" fill="url(#trident-gradient)" />
      <defs>
        <linearGradient id="trident-gradient" x1="10" y1="4" x2="38" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#06b6d4" />
          <stop offset="1" stopColor="#0891b2" />
        </linearGradient>
      </defs>
    </svg>
  )
}
