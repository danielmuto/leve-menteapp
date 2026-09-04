import { moodInfo } from "@/lib/exercises";

/** Manchas de aquarela reaproveitadas como base das ilustrações. */
function Wash({ className = "" }: { className?: string }) {
  return (
    <g className={className}>
      <ellipse cx="34" cy="30" rx="26" ry="21" fill="var(--primary)" opacity="0.16" />
      <ellipse cx="46" cy="40" rx="22" ry="17" fill="var(--mauve)" opacity="0.14" />
      <ellipse cx="28" cy="44" rx="18" ry="13" fill="var(--success)" opacity="0.12" />
    </g>
  );
}

const stroke = {
  fill: "none",
  stroke: "var(--foreground)",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  opacity: 0.75,
};

const motifs: Record<string, React.ReactNode> = {
  list: (
    <g {...stroke}>
      <rect x="22" y="18" width="34" height="42" rx="6" />
      <path d="M28 29h18M28 37h22M28 45h14M28 53h19" />
    </g>
  ),
  trigger: (
    <g {...stroke}>
      <path d="M42 16 26 42h14l-4 22 20-28H41z" />
    </g>
  ),
  letter: (
    <g {...stroke}>
      <rect x="18" y="24" width="44" height="30" rx="5" />
      <path d="m18 27 22 16 22-16" />
      <path d="M52 18c3 2 3 6 0 8" opacity="0.5" />
    </g>
  ),
  letter2: (
    <g {...stroke}>
      <rect x="20" y="20" width="38" height="28" rx="4" />
      <path d="m20 23 19 14 19-14" />
      <path d="M30 56c6 4 14 4 20 0" />
    </g>
  ),
  monster: (
    <g {...stroke}>
      <path d="M24 50c-2-16 6-27 18-27s20 11 18 27c-1 8-9 11-18 11s-17-3-18-11z" />
      <circle cx="35" cy="40" r="2.4" fill="var(--foreground)" stroke="none" />
      <circle cx="49" cy="40" r="2.4" fill="var(--foreground)" stroke="none" />
      <path d="M37 49c3 3 7 3 10 0" />
      <path d="M30 24l-4-7M54 24l4-7" />
    </g>
  ),
  interview: (
    <g {...stroke}>
      <path d="M18 26h26v18H30l-8 7v-7h-4z" />
      <path d="M40 36h22v16h4l-7 7v-7H40z" opacity="0.85" />
    </g>
  ),
  memory: (
    <g {...stroke}>
      <rect x="20" y="22" width="40" height="32" rx="4" />
      <circle cx="32" cy="34" r="4" />
      <path d="m22 50 13-13 9 9 6-5 10 9" />
    </g>
  ),
  problem: (
    <g {...stroke}>
      <circle cx="40" cy="34" r="14" />
      <path d="M40 48v12M32 60h16" />
      <path d="M35 32c0-4 3-6 5-6s5 2 5 5c0 4-5 4-5 8" />
    </g>
  ),
  flow: (
    <g {...stroke}>
      <circle cx="40" cy="38" r="17" />
      <path d="M40 28v11l7 5" />
      <path d="M20 58c8-6 32-6 40 0" opacity="0.4" />
    </g>
  ),
  gratitude: (
    <g {...stroke}>
      <path d="M40 56s-16-9-16-20a9 9 0 0 1 16-5 9 9 0 0 1 16 5c0 11-16 20-16 20z" />
    </g>
  ),
};

export function ExerciseArt({
  kind,
  className = "",
  size = 80,
}: {
  kind: string;
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 80 76"
      width={size}
      height={(size * 76) / 80}
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      <Wash />
      {motifs[kind] ?? motifs["list"]}
    </svg>
  );
}

export function MoodIcon({
  mood,
  size = 34,
  active = false,
  className = "",
}: {
  mood: string;
  size?: number;
  active?: boolean;
  className?: string;
}) {
  const info = moodInfo(mood);
  const color = info?.color ?? "var(--primary)";
  const emoji = info?.emoji ?? "🙂";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full transition-all ${className}`}
      style={{
        width: size,
        height: size,
        background: `color-mix(in oklab, ${color} ${active ? 34 : 16}%, transparent)`,
        fontSize: size * 0.58,
        lineHeight: 1,
      }}
      role="img"
      aria-label={info?.label ?? mood}
    >
      {emoji}
    </span>
  );
}

/** Faixa impressionista usada em cabeçalhos. */
export function HeaderWash({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 160"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="120" cy="60" rx="180" ry="80" fill="var(--primary)" opacity="0.18" />
      <ellipse cx="380" cy="40" rx="200" ry="70" fill="var(--mauve)" opacity="0.14" />
      <ellipse cx="520" cy="110" rx="160" ry="70" fill="var(--success)" opacity="0.12" />
      <ellipse cx="280" cy="130" rx="220" ry="60" fill="var(--primary)" opacity="0.08" />
    </svg>
  );
}

/** Trilha ilustrada do streak. */
export function StreakTrail({ days, size = 7 }: { days: number; size?: number }) {
  const dots = Array.from({ length: size });
  return (
    <svg viewBox={`0 0 ${size * 26} 40`} className="h-10 w-full max-w-[220px]" aria-hidden="true">
      <path
        d={`M12 26 ${dots
          .map((_, i) => `Q ${12 + i * 26 + 13} ${i % 2 ? 12 : 34} ${12 + (i + 1) * 26} 26`)
          .join(" ")}`}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.25"
        strokeDasharray="1 6"
      />
      {dots.map((_, i) => {
        const filled = i < Math.min(days, size);
        return (
          <circle
            key={i}
            cx={12 + i * 26}
            cy={26}
            r={filled ? 7 : 4.5}
            fill={filled ? "var(--primary)" : "var(--border)"}
            opacity={filled ? 0.9 : 1}
          />
        );
      })}
    </svg>
  );
}
