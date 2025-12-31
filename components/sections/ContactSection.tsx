"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Mail, Github, Linkedin, Twitter, ExternalLink, Globe, ArrowUp, MapPin } from "lucide-react";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

const socialLinks = [
  {
    name: "GitHub",
    icon: Github,
    href: "https://github.com/Streisenberg",
    color: "hover:text-white hover:bg-white/10",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/in/dasdemirenes/",
    color: "hover:text-blue-400 hover:bg-blue-400/10",
  },
  {
    name: "Twitter/X",
    icon: Twitter,
    href: "https://x.com/Streisenbergg",
    color: "hover:text-sky-400 hover:bg-sky-400/10",
  },
  {
    name: "Email",
    icon: Mail,
    href: "mailto:edasdemir@uh.edu",
    color: "hover:text-purple-400 hover:bg-purple-400/10",
  },
];

// Geographic data
const locations = {
  istanbul: {
    name: "Istanbul",
    timezone: "Europe/Istanbul",
    coords: { lat: "41.0082°N", lng: "28.9784°E" },
    color: "text-purple-400",
    borderColor: "border-purple-500/20",
  },
  houston: {
    name: "Houston",
    timezone: "America/Chicago",
    coords: { lat: "29.7604°N", lng: "95.3698°W" },
    color: "text-orange-400",
    borderColor: "border-orange-500/20",
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
    <div className={`relative p-4 rounded-xl backdrop-blur-md bg-white/[0.02] border ${location.borderColor} transition-all duration-300 hover:bg-white/[0.04] group`}>
      {/* Location header */}
      <div className="flex items-center gap-2 mb-3">
        <MapPin className={`w-3.5 h-3.5 ${location.color}`} />
        <span className={`font-mono text-xs uppercase tracking-wider ${location.color}`}>
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
      <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
        style={{
          background: `radial-gradient(circle at 50% 50%, ${location.color === 'text-purple-400' ? 'rgba(124, 58, 237, 0.05)' : 'rgba(249, 115, 22, 0.05)'} 0%, transparent 70%)`
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

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 60%",
        toggleActions: "play none none reverse",
      },
    });

    tl.from(contentRef.current?.children || [], {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
    });

    // Staggered social links reveal
    gsap.from(linksRef.current?.children || [], {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: linksRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    // Footer animation
    gsap.from(footerRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center py-32 px-6"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-void via-void-light to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div ref={contentRef}>
          {/* Section label */}
          <span className="font-mono text-sm text-cyan-400 tracking-widest uppercase mb-4 block">
            Get In Touch
          </span>

          {/* Main heading with Nobel Prize background */}
          <div className="relative inline-block mb-6">
            {/* Nobel Prize background image */}
            <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-20 scale-150">
              <Image
                src="/assets/Nobel_Prize.png"
                alt=""
                width={300}
                height={300}
                className="object-contain"
              />
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white relative z-10">
              Let&apos;s{" "}
              <span className="text-gradient">Collaborate</span>
            </h2>
          </div>

          {/* Description */}
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Interested in spatial multi-omics, bone marrow research, or
            computational biology? I&apos;m always open to discussing new ideas,
            collaborations, or opportunities.
          </p>

          {/* CTA Button */}
          <a
            href="mailto:edasdemir@uh.edu"
            className="inline-flex items-center gap-3 btn-primary mb-16"
          >
            <span>Send a Message</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Social Links */}
        <div
          ref={linksRef}
          className="flex justify-center gap-4 flex-wrap"
        >
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-3 px-6 py-4 rounded-xl glass border border-white/10 transition-all duration-300 ${link.color}`}
            >
              <link.icon className="w-5 h-5 text-white/60 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-white/80">{link.name}</span>
            </a>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            GLOBAL HORIZON FOOTER
        ═══════════════════════════════════════════════════════════════════ */}
        <div ref={footerRef} className="mt-24">
          {/* Global Horizon Header */}
          <div className="flex items-center justify-center gap-3 mb-6">
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
          <div className="space-y-2">
            <p className="font-mono text-sm text-white/30">
              © Enes Dasdemir, PhD
            </p>
            <p className="font-mono text-[10px] text-white/15 tracking-wider">
              SPATIAL MULTI-OMICS • COMPUTATIONAL BIOLOGY • DATA SCIENCE
            </p>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
    </section>
  );
}
