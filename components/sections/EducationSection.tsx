"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  GraduationCap,
  MapPin,
  Calendar,
  Building,
  Dna,
  FlaskConical,
  Compass,
  Atom,
  Trophy,
  Music,
  Drama,
  Plane,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ExtraKind = "sport" | "music" | "theater";

interface ExtraItem {
  kind: ExtraKind;
  label: string;
}

interface EducationCardProps {
  title: string;
  institution: string;
  location: string;
  period: string;
  description: string;
  color: string;
  landmark: string;
  /** Anchor consumed by the 3D Experience — keeps model & card in sync */
  sceneId: string;
  achievements?: string[];
  /** Life beyond the lab — sports, music, theater */
  extras?: ExtraItem[];
  transitionNote?: string;
  icon?: "graduation" | "research" | "dna" | "compass" | "atom";
}

const educationData: EducationCardProps[] = [
  {
    title: "Undergraduate Studies",
    institution: "Istanbul University",
    location: "Istanbul, Türkiye",
    period: "2016 - 2021",
    description:
      "Five years in the Biology program on the shores of the Bosphorus. This was a wet lab education built on the core molecular biology techniques and bench work, long before any computation entered the picture.",
    color: "purple",
    landmark: "Maiden's Tower",
    sceneId: "edu-maidens",
    icon: "graduation",
    achievements: ["Molecular Biology", "Wet Lab Techniques", "Bench Research"],
    extras: [{ kind: "sport", label: "Faculty Basketball Team" }],
    transitionNote: "An exchange year abroad, sailing west across the Aegean.",
  },
  {
    title: "Erasmus Exchange",
    institution: "Aristotle University of Thessaloniki",
    location: "Thessaloniki, Greece",
    period: "Erasmus Programme",
    description:
      "A semester under the White Tower, trading the Bosphorus for the Thermaic Gulf, and learning how much of science is built between cultures.",
    color: "cyan",
    landmark: "White Tower of Thessaloniki",
    sceneId: "edu-whitetower",
    icon: "research",
    achievements: ["European Research Exchange", "Cross-cultural Collaboration"],
    extras: [
      { kind: "sport", label: "Erasmus Basketball" },
      { kind: "music", label: "Music Ensemble" },
      { kind: "theater", label: "Theater Team" },
    ],
    transitionNote: "Home again, where two continents meet.",
  },
  {
    title: "Undergraduate Research Fellow",
    institution: "Koç University",
    location: "Istanbul, Türkiye",
    period: "2021",
    description:
      "Back in Istanbul, finishing my degree and joining a summer research fellowship on biomolecular systems through the lens of quantum biology, under Dr. Özgür Müstecaplıoğlu. We studied how quantum information phenomena play out inside living systems, and it grew my footing in both physics and computation. The coding that followed, I taught myself.",
    color: "emerald",
    landmark: "Taksim Tünel",
    sceneId: "edu-taksim",
    icon: "atom",
    achievements: ["Quantum Biology", "Quantum Information", "Scientific Computing"],
    transitionNote: "A flight west, bound for Texas.",
  },
  {
    title: "Ph.D. in Biochemistry",
    institution: "University of Houston · Gunaratne Lab",
    location: "Houston, Texas",
    period: "2022 - 2026",
    description:
      "Doctoral research in genomics and computational biology in the Gunaratne Lab, building the sequencing, single cell, and spatial pipelines that turn raw reads into biology. Alongside the PhD, I worked as a bioinformatician for the university's Seq N Edit Core.",
    color: "orange",
    landmark: "Turkish Airlines · The Crossing",
    sceneId: "edu-airlines",
    icon: "dna",
    achievements: [
      "Bioinformatics",
      "Single cell & Spatial Genomics",
      "NGS Pipelines",
      "Core Facility",
    ],
    transitionNote: "Deeper into the Texas Medical Center.",
  },
  {
    title: "Graduate Researcher",
    institution: "MD Anderson Cancer Center · Abbas Lab",
    location: "Houston, Texas",
    period: "2023 - 2026",
    description:
      "Mapping the leukemia microenvironment with spatial multi-omics in the Abbas Lab, bridging computation and the clinic to understand how acute myeloid leukemia survives and resists therapy.",
    color: "red",
    landmark: "Texas Medical Center",
    sceneId: "edu-graffiti",
    icon: "research",
    achievements: [
      "AML & Leukemia",
      "Spatial Multi-omics",
      "Tumor Microenvironment",
    ],
  },
];

const extraIcon: Record<ExtraKind, typeof Trophy> = {
  sport: Trophy,
  music: Music,
  theater: Drama,
};

function TransitionIndicator({ note }: { note: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/25 to-transparent" />
      <div className="flex items-center gap-4 text-white/40 font-mono text-sm">
        <Compass className="w-4 h-4 animate-[spin_12s_linear_infinite]" />
        <span className="italic tracking-wide">{note}</span>
      </div>
      <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/25 to-transparent" />
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
  extras,
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

  const IconComponent =
    icon === "research"
      ? FlaskConical
      : icon === "dna"
        ? Dna
        : icon === "atom"
          ? Atom
          : icon === "compass"
            ? Compass
            : GraduationCap;

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

        {/* Beyond the lab — sports, music, theater */}
        {extras && extras.length > 0 && (
          <div className="mb-4 p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 mb-3">
              Beyond the Lab
            </p>
            <div className="flex flex-wrap gap-3">
              {extras.map((extra, index) => {
                const ExtraIcon = extraIcon[extra.kind];
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-white/70"
                  >
                    <ExtraIcon className={`w-4 h-4 ${colors.text}`} />
                    <span>{extra.label}</span>
                  </div>
                );
              })}
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
    <section ref={sectionRef} className="relative py-32">
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
          <Plane className="w-4 h-4" />
          <span className="font-mono text-xs">
            Follow the route: Istanbul · Thessaloniki · Houston
          </span>
          <Plane className="w-4 h-4 -scale-x-100" />
        </div>
      </div>

      {/* Education cards with transitions */}
      <div className="relative max-w-4xl mx-auto px-6">
        {educationData.map((edu, index) => (
          <div key={edu.sceneId}>
            {/* Education Card — data-scene drives the 3D landmark sync */}
            <div
              data-scene={edu.sceneId}
              className={`min-h-[140vh] flex items-center ${index % 2 === 0 ? "justify-start" : "justify-end"
                }`}
            >
              <EducationCard {...edu} />
            </div>

            {/* Transition indicator (except after last card) */}
            {edu.transitionNote && (
              <TransitionIndicator note={edu.transitionNote} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
