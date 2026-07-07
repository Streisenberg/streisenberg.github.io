"use client";

import { useEffect, useState } from "react";

/**
 * Global story rail.
 *
 * Renders a fixed vertical progress indicator down the left edge that tracks
 * the visitor across the WHOLE narrative — intro, every career chapter,
 * research, and contact — so people always know where they are.
 *
 * It measures the same `[data-scene]` anchors the 3D Experience reads, so the
 * rail can never drift from the scene.
 *
 * IMPORTANT: this must be rendered OUTSIDE `.content-overlay`. That element has
 * a `transform`, which makes any `position: fixed` descendant fixed relative to
 * the overlay box (not the viewport) — the reason the old indicator only showed
 * up near the middle of the page.
 */

interface Beat {
  scene: string;
  label: string;
  color: string;
}

const BEATS: Beat[] = [
  { scene: "hero", label: "Intro", color: "#a78bfa" },
  { scene: "edu-maidens", label: "Istanbul", color: "#7c3aed" },
  { scene: "edu-whitetower", label: "Thessaloniki", color: "#06b6d4" },
  { scene: "edu-taksim", label: "Koç · Istanbul", color: "#10b981" },
  { scene: "edu-airlines", label: "Houston · PhD", color: "#f97316" },
  { scene: "edu-graffiti", label: "MD Anderson", color: "#ef4444" },
  { scene: "projects", label: "Research", color: "#e879f9" },
  { scene: "contact", label: "Connect", color: "#22d3ee" },
];

export default function StoryProgress() {
  const [present, setPresent] = useState<boolean[]>(() => BEATS.map(() => false));
  const [active, setActive] = useState(0);

  useEffect(() => {
    const compute = () => {
      const focus = window.scrollY + window.innerHeight / 2;
      const pres: boolean[] = [];
      let act = 0;
      BEATS.forEach((b, i) => {
        const el = document.querySelector<HTMLElement>(
          `[data-scene="${b.scene}"]`
        );
        pres[i] = !!el;
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (focus >= top) act = i;
        }
      });
      setPresent(pres);
      setActive(act);
    };

    compute();
    // Re-measure after fonts / 3D / images settle the layout
    const timers = [300, 1000, 2500].map((d) => window.setTimeout(compute, d));
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  const go = (scene: string) => {
    const el = document.querySelector<HTMLElement>(`[data-scene="${scene}"]`);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const items = BEATS.map((b, i) => ({ ...b, i })).filter((x) => present[x.i]);

  return (
    <nav
      aria-label="Story progress"
      className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-start"
    >
      {items.map((x, idx) => {
        const isActive = x.i === active;
        const isPast = x.i < active;
        const next = items[idx + 1];
        return (
          <div key={x.scene} className="group flex flex-col items-start">
            <button
              type="button"
              onClick={() => go(x.scene)}
              aria-current={isActive ? "step" : undefined}
              className="relative flex items-center gap-3 py-1"
            >
              {/* Dot */}
              <span className="flex w-3.5 items-center justify-center">
                {isActive && (
                  <span
                    className="absolute inline-flex h-3.5 w-3.5 rounded-full opacity-40 animate-ping"
                    style={{ backgroundColor: x.color }}
                  />
                )}
                <span
                  className="relative rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: x.color,
                    width: isActive ? 14 : 8,
                    height: isActive ? 14 : 8,
                    opacity: isActive ? 1 : isPast ? 0.7 : 0.4,
                    boxShadow: isActive ? `0 0 12px ${x.color}` : "none",
                  }}
                />
              </span>

              {/* Label — always shown for the active beat, on hover otherwise */}
              <span
                className={`font-mono text-xs whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? "text-white opacity-100"
                    : "text-white/70 opacity-0 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-80"
                }`}
              >
                {x.label}
              </span>
            </button>

            {/* Connector to the next beat */}
            {next && (
              <span
                className="ml-[6px] h-6 w-0.5 rounded-full transition-opacity duration-300"
                style={{
                  background: `linear-gradient(to bottom, ${x.color}, ${next.color})`,
                  opacity: isPast ? 0.9 : 0.25,
                }}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
