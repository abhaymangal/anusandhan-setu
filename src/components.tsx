import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import type { Screen, Tone } from "./types";

export const SCREEN_LABELS: Array<{ id: Screen; label: string; short: string }> = [
  { id: "discovery", label: "Discovery", short: "Discovery" },
  { id: "asset", label: "Verified research asset", short: "Asset" },
  { id: "brief", label: "Funded problem brief", short: "Brief" },
  { id: "match", label: "Evidence-led match room", short: "Match" },
];

/* --------------------------------------------------------------------------
   Seal
   A bridge (setu) inside a double ring. Drawn for this platform — deliberately
   NOT derived from any state emblem, since the product carries no official
   endorsement.
   -------------------------------------------------------------------------- */
export function Seal({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" role="img" aria-label="Anusandhan Setu">
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        {/* seal */}
        <circle cx="24" cy="24" r="22" strokeWidth="1.4" />
        <circle cx="24" cy="24" r="18.4" strokeWidth="0.7" opacity="0.45" />
        {/* deck */}
        <path d="M10.5 26.5h27" strokeWidth="2" />
        {/* arch carrying the deck */}
        <path d="M13 34q11-12 22 0" strokeWidth="1.8" />
      </g>
      {/* the evidence node the two banks meet at */}
      <circle cx="24" cy="26.5" r="3.1" fill="currentColor" />
    </svg>
  );
}

/* --------------------------------------------------------------------------
   Exchange diagram
   The platform thesis in one figure: two records meet at an evidence test,
   and only a funded milestone crosses the gap.
   -------------------------------------------------------------------------- */
export function ExchangeDiagram() {
  return (
    <svg
      className="exchange__svg"
      viewBox="0 0 400 244"
      role="img"
      aria-label="A research asset and a funded problem brief meet at an evidence test. Two requirements are met, two partial, one is a gap and one waits on the sponsor. A funded milestone of one lakh ten thousand rupees is the next step."
    >
      <defs>
        <linearGradient id="ex-thread" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* connectors */}
      <g fill="none" stroke="url(#ex-thread)" strokeWidth="1.3" strokeDasharray="3 4">
        <path d="M86 74 V108 Q86 124 118 124 H176" />
        <path d="M314 74 V108 Q314 124 282 124 H224" />
      </g>

      {/* research asset */}
      <g>
        <rect x="10" y="16" width="152" height="58" rx="12"
          fill="#ffffff" fillOpacity="0.08"
          stroke="#ffffff" strokeOpacity="0.22" />
        <text x="26" y="38" fill="#fff" fontSize="11.5" fontWeight="650">Research asset</text>
        <text x="26" y="55" fill="#fff" fillOpacity="0.62" fontSize="10"
          fontFamily="var(--font-mono)">RA-2026-0417 · TRL 4</text>
      </g>

      {/* problem brief */}
      <g>
        <rect x="238" y="16" width="152" height="58" rx="12"
          fill="#ffffff" fillOpacity="0.08"
          stroke="#ffffff" strokeOpacity="0.22" />
        <text x="254" y="38" fill="#fff" fontSize="11.5" fontWeight="650">Funded brief</text>
        <text x="254" y="55" fill="#fff" fillOpacity="0.62" fontSize="10"
          fontFamily="var(--font-mono)">PB-2026-0088 · ₹6,00,000</text>
      </g>

      {/* evidence test */}
      <g>
        <rect x="104" y="98" width="192" height="74" rx="14"
          fill="oklch(0.55 0.17 258)" fillOpacity="0.42"
          stroke="#ffffff" strokeOpacity="0.42" strokeWidth="1.2" />
        <text x="200" y="124" textAnchor="middle" fill="#fff" fontSize="11.5" fontWeight="650">
          Requirement coverage
        </text>
        {/* six requirement cells, in evidence colours */}
        <g>
          {[
            { x: 128, fill: "oklch(0.72 0.11 172)" },
            { x: 152, fill: "oklch(0.72 0.11 172)" },
            { x: 176, fill: "oklch(0.77 0.12 68)" },
            { x: 200, fill: "oklch(0.77 0.12 68)" },
            { x: 224, fill: "oklch(0.70 0.15 27)" },
            { x: 248, fill: "oklch(0.74 0.11 268)" },
          ].map((cell) => (
            <rect key={cell.x} x={cell.x} y="134" width="20" height="7" rx="2" fill={cell.fill} />
          ))}
        </g>
        <text x="200" y="160" textAnchor="middle" fill="#fff" fillOpacity="0.66" fontSize="9.5">
          2 met · 2 partial · 1 gap · 1 on sponsor
        </text>
      </g>

      {/* funded milestone */}
      <g>
        <path d="M200 172 V196" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1.3"
          strokeDasharray="3 4" fill="none" />
        <rect x="96" y="196" width="208" height="36" rx="10"
          fill="#ffffff" fillOpacity="0.13"
          stroke="#ffffff" strokeOpacity="0.3" />
        <text x="200" y="219" textAnchor="middle" fill="#fff" fontSize="10.5" fontWeight="600">
          M1 validation · ₹1,10,000 · 3 weeks
        </text>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */

interface ScreenNavProps {
  active: Screen;
  onChange: (screen: Screen) => void;
}

export function ScreenNav({ active, onChange }: ScreenNavProps) {
  return (
    <nav className="screen-nav shell-width" aria-label="Product workflow">
      {SCREEN_LABELS.map((screen, index) => (
        <button
          className="screen-tab"
          data-active={screen.id === active}
          key={screen.id}
          onClick={() => onChange(screen.id)}
          aria-current={screen.id === active ? "page" : undefined}
        >
          <span className="screen-tab__index">{String(index + 1).padStart(2, "0")}</span>
          {screen.label}
          {screen.id === active ? (
            <motion.i
              className="screen-tab__indicator"
              layoutId="workflow-indicator"
              transition={{ duration: 0.22, ease: [0.2, 0, 0.38, 0.9] }}
            />
          ) : null}
        </button>
      ))}
    </nav>
  );
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span className={`pill pill--${tone}`}>
      <i aria-hidden="true" />
      {children}
    </span>
  );
}

export function Panel({
  title,
  aside,
  flush = false,
  children,
}: {
  title: string;
  aside?: ReactNode;
  flush?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="panel reveal">
      <div className="panel__header">
        <h3>{title}</h3>
        {aside}
      </div>
      <div className={flush ? "panel__body panel__body--flush" : "panel__body"}>{children}</div>
    </section>
  );
}

export function Button({
  children,
  variant = "secondary",
  full = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  full?: boolean;
}) {
  return (
    <button className={`button button--${variant}${full ? " button--full" : ""}`} {...props}>
      {children}
    </button>
  );
}

export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <header className="page-intro">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{children}</p>
    </header>
  );
}

export function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: "light" | "dark";
  onToggle: () => void;
}) {
  return (
    <button
      className="icon-button"
      onClick={onToggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} appearance`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} appearance`}
    >
      {theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </button>
  );
}
