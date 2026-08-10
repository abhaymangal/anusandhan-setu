import type { ReactNode } from "react";
import { motion } from "motion/react";
import type { Screen, Tone } from "./types";

export const SCREEN_LABELS: Array<{ id: Screen; label: string }> = [
  { id: "discovery", label: "Discovery" },
  { id: "asset", label: "Verified research asset" },
  { id: "brief", label: "Funded problem brief" },
  { id: "match", label: "Evidence-led match room" },
];

interface ScreenNavProps {
  active: Screen;
  onChange: (screen: Screen) => void;
}

export function ScreenNav({ active, onChange }: ScreenNavProps) {
  return (
    <nav className="screen-nav" aria-label="Product workflow">
      {SCREEN_LABELS.map((screen, index) => (
        <button
          className="screen-tab"
          data-active={screen.id === active}
          key={screen.id}
          onClick={() => onChange(screen.id)}
          aria-current={screen.id === active ? "page" : undefined}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          {screen.label}
          {screen.id === active ? <motion.i className="screen-tab__indicator" layoutId="workflow-indicator" /> : null}
        </button>
      ))}
    </nav>
  );
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return <span className={`pill pill--${tone}`}><i aria-hidden="true" />{children}</span>;
}

export function Section({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="section-card">
      <div className="section-card__header">
        <h3>{title}</h3>
        {aside}
      </div>
      <div className="section-card__body">{children}</div>
    </section>
  );
}

export function Button({
  children,
  variant = "secondary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" }) {
  return (
    <button className={`button button--${variant}`} {...props}>
      {children}
    </button>
  );
}

export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <header className="page-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{children}</p>
    </header>
  );
}
