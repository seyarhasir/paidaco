type VerifiedBadgeProps = {
  label: string;
  size?: number;
};

export function VerifiedBadge({ label, size = 24 }: VerifiedBadgeProps) {
  return (
    <svg
      aria-label={label}
      className="verified-svg"
      height={size}
      role="img"
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" fill="currentColor" r="11" />
      <path
        d="M7.3 12.3l3 3 6.4-7"
        fill="none"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.6"
      />
    </svg>
  );
}
