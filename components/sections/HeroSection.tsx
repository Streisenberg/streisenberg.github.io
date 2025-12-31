"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const welcomeRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Initial reveal animation with staggered effects
    tl.from(logoRef.current, {
      scale: 0.5,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: "elastic.out(1, 0.5)",
    })
      .from(
        welcomeRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
        },
        "-=0.5"
      )
      .from(
        titleRef.current,
        {
          y: 100,
          opacity: 0,
          duration: 1.2,
        },
        "-=0.6"
      )
      .from(
        subtitleRef.current,
        {
          y: 50,
          opacity: 0,
          duration: 1,
        },
        "-=0.6"
      )
      .from(
        ctaRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
        },
        "-=0.4"
      )
      .from(
        scrollIndicatorRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
        },
        "-=0.4"
      );

    // Parallax effect on scroll
    gsap.to([titleRef.current, subtitleRef.current], {
      y: -100,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void/50 to-void pointer-events-none" />

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "-3s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "-1.5s" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Logo */}
        <div ref={logoRef} className="flex justify-center mb-8">
          <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20 animate-pulse-glow">
            <Image
              src="/assets/ED_Logo.png"
              alt="Enes Dasdemir Logo"
              fill
              className="object-cover"
              priority
            />
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 mix-blend-overlay" />
          </div>
        </div>

        {/* Welcome text */}
        <span
          ref={welcomeRef}
          className="inline-block font-mono text-sm md:text-base text-purple-400 tracking-[0.3em] uppercase mb-4"
        >
          Welcome to my world
        </span>

        {/* Main title */}
        <h1
          ref={titleRef}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
        >
          <span className="block text-white/90">I&apos;m</span>
          <span className="block text-gradient leading-tight">
            Enes Dasdemir
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="font-sans text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-12"
        >
          <span className="text-purple-400">Computational Biologist</span> •{" "}
          <span className="text-cyan-400">Spatial Multi-Omics Researcher</span>{" "}
          •{" "}
          <span className="text-orange-400">
            Data Scientist
          </span>
          <br />
          <span className="block mt-4 text-white/50">
            Exploring the spatial universe of cells from Istanbul to Houston
          </span>
        </p>

        {/* CTA Buttons */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Link
            href="/projects"
            className="group btn-primary flex items-center gap-2"
          >
            <span>View My Work</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/about"
            className="px-6 py-3 rounded-full border border-white/20 text-white/80 hover:bg-white/5 hover:border-white/30 transition-all duration-300 font-medium"
          >
            About Me
          </Link>
        </div>

        {/* Scroll indicator */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-xs text-white/40 tracking-widest uppercase">
            Scroll to explore
          </span>
          <div className="animate-bounce">
            <ChevronDown className="w-6 h-6 text-white/40" />
          </div>
        </div>
      </div>

      {/* Decorative grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute left-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/10 to-transparent"
        />
        <div
          className="absolute right-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent"
        />
        <div
          className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/10 to-transparent"
        />
        <div
          className="absolute bottom-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"
        />
      </div>
    </section>
  );
}
