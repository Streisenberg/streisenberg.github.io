"use client";

import { useEffect, useRef, ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis with optimized settings
    const lenis = new Lenis({
      duration: 1.0,  // Slightly faster
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.8,  // Reduced for smoother scrolling
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Update ScrollTrigger on scroll - throttled
    lenis.on("scroll", ScrollTrigger.update);

    // The 3D experience pauses scrolling while it loads and warms the GPU,
    // so the first user scroll never collides with shader compilation.
    const onExperienceLoading = () => lenis.stop();
    const onExperienceReady = () => lenis.start();
    window.addEventListener("experience:loading", onExperienceLoading);
    window.addEventListener("experience:ready", onExperienceReady);

    // Use a more efficient RAF loop
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("experience:loading", onExperienceLoading);
      window.removeEventListener("experience:ready", onExperienceReady);
      lenis.destroy();
    };
  }, []);

  // Debounced resize handler
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);  // Debounce resize
    };

    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return <>{children}</>;
}
