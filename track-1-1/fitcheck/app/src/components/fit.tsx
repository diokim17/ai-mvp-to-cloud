import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { scoreTone, store, useAppState } from "@/lib/store";

const toneText = { high: "text-score-high", mid: "text-score-mid", low: "text-score-low" };
const toneBg = { high: "bg-score-high", mid: "bg-score-mid", low: "bg-score-low" };
const toneStroke = { high: "stroke-score-high", mid: "stroke-score-mid", low: "stroke-score-low" };

export function AppHeader() {
  const { loggedIn } = useAppState();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[960px] items-center justify-between px-4">
        <Link to="/" className="text-xl font-extrabold tracking-tight text-foreground">
          Fit<span className="text-primary">Check</span>
        </Link>
        {loggedIn ? (
          <nav className="flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/history">내 분석 기록</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                store.logout();
                navigate({ to: "/" });
              }}
            >
              로그아웃
            </Button>
          </nav>
        ) : (
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">로그인</Link>
          </Button>
        )}
      </div>
    </header>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return <main className="mx-auto w-full max-w-[960px] px-4 py-8 sm:py-12">{children}</main>;
}

export function ScoreBadge({ score }: { score: number }) {
  const t = scoreTone(score);
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-bold text-primary-foreground", toneBg[t])}>
      {score}점
    </span>
  );
}

export function ScoreGauge({ score, size = 140 }: { score: number; size?: number }) {
  const t = scoreTone(score);
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="9" className="stroke-secondary" />
        <circle
          cx="50" cy="50" r={r} fill="none" strokeWidth="9" strokeLinecap="round"
          className={cn("transition-all duration-700", toneStroke[t])}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - score / 100)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-[48px] font-bold leading-none", toneText[t])}>{score}</span>
        <span className="mt-1 text-xs text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

export function ScoreBar({ label, value, max }: { label: string; value: number; max: number }) {
  const t = scoreTone((value / max) * 100);
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          <b className="text-foreground">{value}</b> / {max}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
        <div className={cn("h-full rounded-full", toneBg[t])} style={{ width: `${(value / max) * 100}%` }} />
      </div>
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-4 text-xl font-bold">{children}</h2>;
}
