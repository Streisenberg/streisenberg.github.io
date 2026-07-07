"use client";

import { useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Globe, ArrowUp, MapPin } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin);
}

// Geographic data
const locations = {
  istanbul: {
    name: "Istanbul",
    timezone: "Europe/Istanbul",
    coords: { lat: "41.0082°N", lng: "28.9784°E" },
    color: "text-purple-400",
    borderColor: "border-purple-500/20",
    glowColor: "rgba(124, 58, 237, 0.05)",
  },
  houston: {
    name: "Houston",
    timezone: "America/Chicago",
    coords: { lat: "29.7604°N", lng: "95.3698°W" },
    color: "text-orange-400",
    borderColor: "border-orange-500/20",
    glowColor: "rgba(249, 115, 22, 0.05)",
  },
};

// Real-time clock component
function LocationClock({ location }: { location: typeof locations.istanbul }) {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const timeFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: location.timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      const dateFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: location.timezone,
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      setTime(timeFormatter.format(now));
      setDate(dateFormatter.format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [location.timezone]);

  return (
    <div
      className={`relative p-4 rounded-xl backdrop-blur-md bg-white/[0.02] border ${location.borderColor} transition-all duration-300 hover:bg-white/[0.04] group`}
    >
      {/* Location header */}
      <div className="flex items-center gap-2 mb-3">
        <MapPin className={`w-3.5 h-3.5 ${location.color}`} />
        <span
          className={`font-mono text-xs uppercase tracking-wider ${location.color}`}
        >
          {location.name}
        </span>
      </div>

      {/* Time display */}
      <div className="font-mono text-2xl text-white/90 tracking-wider mb-1 tabular-nums">
        {time || "--:--:--"}
      </div>

      {/* Date */}
      <div className="font-mono text-xs text-white/40 mb-3">
        {date || "--- --- --"}
      </div>

      {/* Coordinates - scientific/terminal feel */}
      <div className="pt-2 border-t border-white/5">
        <div className="font-mono text-[10px] text-white/20 tracking-wide">
          <span className="text-white/30">LAT</span> {location.coords.lat}
        </div>
        <div className="font-mono text-[10px] text-white/20 tracking-wide">
          <span className="text-white/30">LNG</span> {location.coords.lng}
        </div>
      </div>

      {/* Subtle glow effect on hover */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${location.glowColor} 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}

// Return to start button
function ReturnToStartButton() {
  const handleClick = () => {
    gsap.to(window, {
      duration: 1.5,
      scrollTo: { y: 0 },
      ease: "power3.inOut",
    });
  };

  return (
    <button
      onClick={handleClick}
      className="group flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-md bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300"
    >
      <ArrowUp className="w-4 h-4 text-white/50 group-hover:text-white/80 group-hover:-translate-y-0.5 transition-all duration-300" />
      <span className="font-mono text-xs text-white/50 group-hover:text-white/80 uppercase tracking-wider transition-colors">
        Return to Start
      </span>
    </button>
  );
}

interface GlobalHorizonFooterProps {
  className?: string;
}

export default function GlobalHorizonFooter({
  className = "",
}: GlobalHorizonFooterProps) {
  return (
    <footer className={`py-16 px-6 border-t border-white/5 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Global Horizon Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/20" />
          <Globe className="w-4 h-4 text-white/30" />
          <span className="font-mono text-xs text-white/30 uppercase tracking-[0.3em]">
            Global Horizon
          </span>
          <Globe className="w-4 h-4 text-white/30" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/20" />
        </div>

        {/* Time Zones - Glassmorphic Cards */}
        <div className="flex justify-center gap-4 flex-wrap mb-8">
          <LocationClock location={locations.istanbul} />
          <LocationClock location={locations.houston} />
        </div>

        {/* Return to Start Button */}
        <div className="flex justify-center mb-8">
          <ReturnToStartButton />
        </div>

        {/* Divider */}
        <div className="h-px w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

        {/* Copyright Footer */}
        <div className="text-center space-y-2">
          <p className="font-mono text-sm text-white/30">
            © Enes Dasdemir, PhD
          </p>
          <p className="font-mono text-[10px] text-white/15 tracking-wider">
            SPATIAL MULTI-OMICS • COMPUTATIONAL BIOLOGY • DATA SCIENCE
          </p>
        </div>
      </div>
    </footer>
  );
}

