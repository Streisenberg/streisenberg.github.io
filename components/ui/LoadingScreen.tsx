"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

export default function LoadingScreen() {
  const { progress, active } = useProgress();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (progress === 100 && !active) {
      // Delay hiding to allow for smooth transition
      const timer = setTimeout(() => {
        setVisible(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [progress, active]);

  if (!visible) return null;

  return (
    <div
      className={`loading-screen transition-opacity duration-700 ${
        progress === 100 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-8">
        {/* DNA Helix Animation */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-purple-500/30 animate-pulse" />
          <div className="absolute inset-2 rounded-full border-4 border-cyan-400/40 animate-pulse" style={{ animationDelay: "0.2s" }} />
          <div className="absolute inset-4 rounded-full border-4 border-purple-500/50 animate-pulse" style={{ animationDelay: "0.4s" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="loading-spinner !w-8 !h-8" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="font-display text-2xl font-bold text-gradient">
            Spatial Multi-Omics
          </h1>
          <p className="font-mono text-xs text-white/50 tracking-widest uppercase">
            Initializing 3D Experience
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 space-y-2">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500 transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                backgroundSize: "200% 100%",
                animation: "gradientShift 2s ease infinite",
              }}
            />
          </div>
          <div className="flex justify-between items-center text-xs font-mono text-white/40">
            <span>Loading assets...</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Stage indicators */}
        <div className="flex gap-6 text-xs font-mono text-white/30">
          <span className={progress >= 25 ? "text-purple-400" : ""}>
            ● Models
          </span>
          <span className={progress >= 50 ? "text-cyan-400" : ""}>
            ● Environment
          </span>
          <span className={progress >= 75 ? "text-orange-400" : ""}>
            ● Textures
          </span>
          <span className={progress === 100 ? "text-green-400" : ""}>
            ● Ready
          </span>
        </div>
      </div>
    </div>
  );
}

