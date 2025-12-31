"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GraduationCap, MapPin, Calendar, Building, Ship, Anchor, Dna, FlaskConical } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface EducationCardProps {
  title: string;
  institution: string;
  location: string;
  period: string;
  description: string;
  color: string;
  landmark: string;
  achievements?: string[];
  transitionNote?: string;
  icon?: "graduation" | "research" | "dna";
}

const educationData: EducationCardProps[] = [
  {
    title: "Undergraduate Studies",
    institution: "Istanbul University",
    location: "Istanbul, Turkey",
    period: "2015 - 2019",
    description:
      "Foundations in molecular biology and computational methods. First exposure to the complexity of biological systems and bioinformatics.",
    color: "purple",
    landmark: "Maiden's Tower",
    icon: "graduation",
    achievements: [
      "Molecular Biology fundamentals",
      "Introduction to Bioinformatics",
      "Research methodology",
    ],
    transitionNote: "Sailing across the Aegean Sea...",
  },
  {
    title: "ERASMUS",
    institution: "Aristotle University of Thessaloniki",
    location: "Thessaloniki, Greece",
    period: "2019 - 2020",
    description:
      "Advanced training in bioinformatics and single-cell genomics. Developed computational pipelines for RNA-seq analysis and spatial transcriptomics.",
    color: "cyan",
    landmark: "White Tower of Thessaloniki",
    icon: "research",
    achievements: [
      "Single-cell RNA-seq analysis",
      "Computational pipeline development",
    ],
    transitionNote: "Returning to the Bosphorus...",
  },
  {
    title: "Undergraduate Research Fellow",
    institution: "Koç University",
    location: "Istanbul, Turkey",
    period: "2020",
    description:
      "Advanced quantum biology training with focus on systems biology and machine learning applications.",
    color: "emerald",
    landmark: "Taksim Tünel",
    icon: "graduation",
    achievements: [
      "Quantum Biology",
      "Machine Learning in Genomics",
    ],
    transitionNote: "Crossing the Atlantic...",
  },
  {
    title: "PhD Student - Bioinformatician",
    institution: "University of Houston - Seq-N-Edit Core",
    location: "Houston, Texas",
    period: "2022 - 2025",
    description:
      "Completed a PhD in Biochemistry. Led bioinformatics analyses for the Seq-N-Edit genomics core facility. Developed pipelines for NGS data processing, single-cell analysis, and spatial transcriptomics.",
    color: "orange",
    landmark: "Houston Skyline",
    icon: "dna",
    achievements: [
      "NGS Pipeline Development",
      "Core Facility Management",
      "Spatial Transcriptomics",
      "Client Consultation",
    ],
    transitionNote: "Venturing into the Medical Center...",
  },
  {
    title: "Graduate Student-non-UTHSCH",
    institution: "MD Anderson Cancer Center",
    location: "Houston, Texas",
    period: "2023 - 2026",
    description:
      "Pioneering spatial multi-omics approaches in bone marrow and AML research. Integrating computational biology with clinical insights to advance cancer treatment.",
    color: "red",
    landmark: "Texas Medical Center",
    icon: "research",
    achievements: [
      "Bone marrow spatial analysis",
      "AML research breakthroughs",
      "Clinical collaborations",
    ],
  },
];

function TransitionIndicator({ note, color }: { note: string; color: string }) {
  const colorMap: Record<string, string> = {
    purple: "from-purple-500/30 to-cyan-500/30",
    cyan: "from-cyan-500/30 to-emerald-500/30",
    emerald: "from-emerald-500/30 to-orange-500/30",
    orange: "from-orange-500/30 to-red-500/30",
  };

  return (
    <div className="flex items-center justify-center py-16 relative">
      <div className={`absolute inset-0 bg-gradient-to-b ${colorMap[color] || "from-white/10 to-white/10"} pointer-events-none`} />
      <div className="flex items-center gap-4 text-white/40 font-mono text-sm z-10">
        <div className="w-16 h-px bg-gradient-to-r from-transparent to-white/20" />
        <Ship className="w-5 h-5 animate-bounce" />
        <span className="italic">{note}</span>
        <Ship className="w-5 h-5 animate-bounce" style={{ animationDelay: "0.5s" }} />
        <div className="w-16 h-px bg-gradient-to-l from-transparent to-white/20" />
      </div>
    </div>
  );
}

function EducationCard({
  title,
  institution,
  location,
  period,
  description,
  color,
  landmark,
  achievements,
  icon = "graduation",
}: EducationCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(cardRef.current, {
      x: color === "purple" || color === "emerald" || color === "red" ? -100 : 100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top 80%",
        end: "top 50%",
        toggleActions: "play none none reverse",
      },
    });
  }, [color]);

  const colorClasses: Record<string, {
    border: string;
    bg: string;
    text: string;
    glow: string;
    badge: string;
    gradient: string;
  }> = {
    purple: {
      border: "border-purple-500/30",
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      glow: "shadow-purple-500/20",
      badge: "bg-purple-500/20 text-purple-300",
      gradient: "from-purple-500/20 to-purple-900/20",
    },
    cyan: {
      border: "border-cyan-500/30",
      bg: "bg-cyan-500/10",
      text: "text-cyan-400",
      glow: "shadow-cyan-500/20",
      badge: "bg-cyan-500/20 text-cyan-300",
      gradient: "from-cyan-500/20 to-cyan-900/20",
    },
    emerald: {
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      glow: "shadow-emerald-500/20",
      badge: "bg-emerald-500/20 text-emerald-300",
      gradient: "from-emerald-500/20 to-emerald-900/20",
    },
    orange: {
      border: "border-orange-500/30",
      bg: "bg-orange-500/10",
      text: "text-orange-400",
      glow: "shadow-orange-500/20",
      badge: "bg-orange-500/20 text-orange-300",
      gradient: "from-orange-500/20 to-orange-900/20",
    },
    red: {
      border: "border-red-500/30",
      bg: "bg-red-500/10",
      text: "text-red-400",
      glow: "shadow-red-500/20",
      badge: "bg-red-500/20 text-red-300",
      gradient: "from-red-500/20 to-red-900/20",
    },
  };

  const colors = colorClasses[color] || colorClasses.purple;

  const IconComponent = icon === "research" ? FlaskConical : icon === "dna" ? Dna : GraduationCap;

  return (
    <div
      ref={cardRef}
      className={`relative glass-dark rounded-2xl p-8 border ${colors.border} hover:shadow-xl ${colors.glow} transition-all duration-500 max-w-xl overflow-hidden group`}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-50 group-hover:opacity-70 transition-opacity`} />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-3 rounded-xl ${colors.bg} border ${colors.border}`}>
            <IconComponent className={`w-6 h-6 ${colors.text}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-xl font-bold text-white mb-1">
              {title}
            </h3>
            <p className={`font-semibold ${colors.text}`}>{institution}</p>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm text-white/50">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{period}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-white/70 leading-relaxed mb-4">{description}</p>

        {/* Achievements */}
        {achievements && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {achievements.map((achievement, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${colors.badge} backdrop-blur-sm`}
                >
                  {achievement}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Landmark reference */}
        <div className="pt-4 border-t border-white/10 flex items-center gap-2">
          <Building className={`w-4 h-4 ${colors.text}`} />
          <p className="font-mono text-xs text-white/40">
            Featured Landmark: {landmark}
          </p>
        </div>
      </div>

      {/* Decorative corner accent */}
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${colors.gradient} opacity-30 rounded-bl-full`} />
    </div>
  );
}

// Scroll progress indicator
function ScrollProgressIndicator() {
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const newProgress = Math.min(1, Math.max(0, scrollY / docHeight));
      setProgress(newProgress);

      // Calculate active section based on scroll ranges matching Experience.tsx
      const ranges = [
        { start: 0.05, end: 0.18 },   // Istanbul
        { start: 0.18, end: 0.32 },   // Aristotle
        { start: 0.32, end: 0.46 },   // Koc
        { start: 0.46, end: 0.60 },   // UH
        { start: 0.60, end: 0.74 },   // MD Anderson
      ];

      const active = ranges.findIndex(r => newProgress >= r.start && newProgress <= r.end);
      setActiveIndex(active >= 0 ? active : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sectionColors = ["#7c3aed", "#06b6d4", "#10b981", "#f97316", "#ef4444"];

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-2">
      {sectionColors.map((color, index) => (
        <div key={index} className="relative">
          <div
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeIndex ? "scale-150" : "scale-100 opacity-50"
              }`}
            style={{ backgroundColor: color }}
          />
          {index < sectionColors.length - 1 && (
            <div
              className="w-0.5 h-8 mx-auto mt-1"
              style={{
                background: `linear-gradient(to bottom, ${color}, ${sectionColors[index + 1]})`,
                opacity: index < activeIndex ? 1 : 0.3,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function EducationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(headerRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: headerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[600vh] py-32">
      {/* Progress indicator */}
      <ScrollProgressIndicator />

      {/* Section header */}
      <div ref={headerRef} className="text-center px-6 mb-24">
        <span className="font-mono text-sm text-purple-400 tracking-widest uppercase mb-4 block">
          My Journey
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
          Education & Career
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          From the historic shores of Istanbul to the cutting-edge research
          facilities of Houston, each step shaped my path in computational
          biology.
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 text-white/30">
          <Anchor className="w-4 h-4" />
          <span className="font-mono text-xs">Follow the ship through my journey</span>
          <Anchor className="w-4 h-4" />
        </div>
      </div>

      {/* Education cards with transitions */}
      <div className="relative max-w-4xl mx-auto px-6">
        {educationData.map((edu, index) => (
          <div key={edu.institution}>
            {/* Education Card */}
            <div className={`min-h-screen flex items-center ${index % 2 === 0 ? "justify-start" : "justify-end"
              }`}>
              <EducationCard {...edu} />
            </div>

            {/* Transition indicator (except after last card) */}
            {edu.transitionNote && (
              <TransitionIndicator note={edu.transitionNote} color={edu.color} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
