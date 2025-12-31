"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ExternalLink,
  FileText,
  Github,
  BookOpen,
  Microscope,
  Ship,
} from "lucide-react";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface PaperCardProps {
  title: string;
  journal: string;
  year: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
  index: number;
}

const papersData: PaperCardProps[] = [
  {
    title: "Spatial Multi-omics Analysis of Bone Marrow Microenvironment in AML",
    journal: "Nature Communications",
    year: "2024",
    description:
      "Comprehensive spatial transcriptomic profiling revealing cellular neighborhoods in acute myeloid leukemia bone marrow samples.",
    tags: ["Spatial Transcriptomics", "AML", "Bone Marrow"],
    link: "#",
    github: "#",
    index: 0,
  },
  {
    title: "Single-Cell Analysis of Hematopoietic Stem Cell Niche Dynamics",
    journal: "Cell Reports",
    year: "2023",
    description:
      "Identifying key cellular interactions within the hematopoietic stem cell niche using single-cell RNA sequencing.",
    tags: ["scRNA-seq", "HSC", "Niche Dynamics"],
    link: "#",
    github: "#",
    index: 1,
  },
  {
    title: "Computational Pipeline for Integrating Multi-modal Spatial Data",
    journal: "Bioinformatics",
    year: "2023",
    description:
      "Novel computational framework for integrating spatial proteomics and transcriptomics data in cancer research.",
    tags: ["Multi-modal", "Pipeline", "Integration"],
    link: "#",
    github: "#",
    index: 2,
  },
  {
    title: "Machine Learning Approaches for Cell Type Deconvolution",
    journal: "Genome Biology",
    year: "2022",
    description:
      "Deep learning models for accurate cell type identification and deconvolution in bulk RNA-seq data.",
    tags: ["Machine Learning", "Deconvolution", "Deep Learning"],
    link: "#",
    github: "#",
    index: 3,
  },
  {
    title: "Spatial Organization of Immune Cells in Cancer Microenvironment",
    journal: "Cancer Discovery",
    year: "2022",
    description:
      "Characterizing the spatial distribution and interactions of immune cells within tumor microenvironment.",
    tags: ["Immuno-oncology", "TME", "Spatial Analysis"],
    link: "#",
    github: "#",
    index: 4,
  },
];

function PaperCard({
  title,
  journal,
  year,
  description,
  tags,
  link,
  github,
  index,
}: PaperCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Flying in from right effect
    gsap.fromTo(
      cardRef.current,
      {
        x: 500,
        rotation: 15,
        opacity: 0,
        scale: 0.9,
      },
      {
        x: 0,
        rotation: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 95%",
          end: "top 50%",
          scrub: 1.5,
        },
      }
    );

    // Fly out to left on continue scroll
    gsap.to(cardRef.current, {
      x: -500,
      rotation: -15,
      opacity: 0,
      scale: 0.9,
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top 15%",
        end: "top -30%",
        scrub: 1.5,
      },
    });
  }, []);

  const gradients = [
    "from-purple-600/20 to-purple-900/20",
    "from-cyan-600/20 to-cyan-900/20",
    "from-orange-600/20 to-orange-900/20",
    "from-pink-600/20 to-pink-900/20",
    "from-emerald-600/20 to-emerald-900/20",
  ];

  const borderColors = [
    "border-purple-500/30 hover:border-purple-500/50",
    "border-cyan-500/30 hover:border-cyan-500/50",
    "border-orange-500/30 hover:border-orange-500/50",
    "border-pink-500/30 hover:border-pink-500/50",
    "border-emerald-500/30 hover:border-emerald-500/50",
  ];

  return (
    <div
      ref={cardRef}
      className={`relative glass-dark rounded-2xl p-8 border ${borderColors[index % borderColors.length]} transition-all duration-500 max-w-2xl mx-auto backdrop-blur-xl overflow-hidden`}
      style={{ willChange: "transform, opacity" }}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} opacity-50`}
      />

      {/* Paper fold effect */}
      <div className="absolute top-0 right-0 w-16 h-16">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-t-white/5 border-l-[40px] border-l-transparent" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">
                {journal}
              </span>
              <span className="text-xs text-white/40 ml-2">• {year}</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-2">
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
              >
                <ExternalLink className="w-4 h-4 text-white/60" />
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
              >
                <Github className="w-4 h-4 text-white/60" />
              </a>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display text-xl font-bold text-white mb-3 leading-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="text-white/60 text-sm leading-relaxed mb-4">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/70 border border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header animation
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
    <section
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
      style={{ minHeight: `${(papersData.length + 1) * 100}vh` }}
    >
      {/* Section header - sticky */}
      <div className="sticky top-24 z-20 mb-16">
        <div ref={headerRef} className="text-center px-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <BookOpen className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <span className="font-mono text-sm text-cyan-400 tracking-widest uppercase mb-4 block">
            Research & Publications
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            My Work
          </h2>
          <p className="text-white/60 max-w-xl mx-auto mb-4">
            Selected publications and research projects in spatial multi-omics,
            computational biology, and cancer research.
          </p>
          <div className="flex items-center justify-center gap-2 text-white/30">
            <Ship className="w-4 h-4" />
            <span className="font-mono text-xs">Watch the ship sail as you explore</span>
            <Ship className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Papers - flying from right to left */}
      <div className="relative z-10 space-y-[60vh] px-6 pt-32">
        {papersData.map((paper, index) => (
          <PaperCard key={index} {...paper} />
        ))}
      </div>

      {/* View all link */}
      <div className="relative z-10 text-center mt-32 px-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full glass border border-white/10 hover:border-purple-500/30 transition-all duration-300 group"
        >
          <Microscope className="w-5 h-5 text-purple-400" />
          <span className="font-medium text-white">View All Projects</span>
          <ExternalLink className="w-4 h-4 text-white/60 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
