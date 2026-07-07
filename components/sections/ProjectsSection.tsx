"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ExternalLink,
  FileText,
  BookOpen,
  Microscope,
  Star,
  FlaskConical,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface PaperCardProps {
  title: string;
  journal: string;
  year?: string;
  description: string;
  tags: string[];
  link?: string;
  logo?: string;
  status?: string;
  featured?: boolean;
  index: number;
}

const papersData: Omit<PaperCardProps, "index">[] = [
  {
    title:
      "Integrative spatial multi-omics reveal niche-specific inflammatory signaling and differentiation hierarchies in AML",
    journal: "iScience (Cell Press)",
    year: "2025",
    description:
      "My flagship study, resolving how the acute myeloid leukemia niche shapes inflammatory signaling and differentiation hierarchies through integrative spatial multi-omics.",
    tags: ["Spatial Multi-omics", "AML", "Cell Press"],
    link: "https://www.cell.com/iscience/fulltext/S2589-0042(25)02550-7",
    logo: "/assets/iScience-logo.png",
    featured: true,
  },
  {
    title:
      "Comprehensive characterization of IFNγ signaling in acute myeloid leukemia reveals prognostic and therapeutic strategies",
    journal: "Nature Communications",
    year: "2024",
    description:
      "Dissecting interferon-γ signaling across AML to surface prognostic markers and actionable therapeutic strategies.",
    tags: ["IFNγ Signaling", "AML", "Immuno-oncology"],
    link: "https://www.nature.com/articles/s41467-024-45916-6",
    logo: "/assets/Nat-Comm.jpg",
  },
  {
    title: "Multimodal spatial proteomic profiling in acute myeloid leukemia",
    journal: "npj Precision Oncology",
    year: "2025",
    description:
      "High-plex spatial proteomics resolving the cellular architecture of the AML bone-marrow microenvironment.",
    tags: ["Spatial Proteomics", "AML", "Bone Marrow"],
    link: "https://www.nature.com/articles/s41698-025-00897-7",
    logo: "/assets/npj.png",
  },
  {
    title:
      "Mutation dynamics from diagnosis to relapse in acute myeloid leukemia with chromosomal 7 deletions",
    journal: "Leukemia & Lymphoma",
    year: "2025",
    description:
      "Tracking clonal mutation dynamics from diagnosis to relapse in del(7) acute myeloid leukemia.",
    tags: ["Clonal Evolution", "AML", "del(7)"],
    link: "https://www.tandfonline.com/doi/abs/10.1080/10428194.2025.2477723",
    logo: "/assets/Taylor_and_Francis.png",
  },
  {
    title:
      "Macrophage-secreted pyrimidine metabolites confer chemotherapy resistance in acute myeloid leukemia",
    journal: "bioRxiv",
    year: "2025",
    status: "Under Revision",
    description:
      "How macrophage-derived pyrimidine metabolites drive chemotherapy resistance in AML.",
    tags: ["Chemoresistance", "Metabolism", "Microenvironment"],
    link: "https://www.biorxiv.org/content/10.1101/2025.11.01.686055v1.abstract",
    logo: "/assets/BioRxiv_logo.png",
  },
  {
    title:
      "DYRK1A controls CD47 endocytic degradation and cancer immune surveillance",
    journal: "Nature Immunology",
    status: "In Revision",
    description:
      "Identifying DYRK1A as a regulator of CD47 turnover and the “don’t-eat-me” axis in cancer immune surveillance.",
    tags: ["CD47", "Immune Surveillance", "DYRK1A"],
  },
  {
    title: "CALM: A Comprehensive Atlas of Leukemia and its Microenvironment",
    journal: "Cell Reports Medicine",
    status: "In Submission",
    description:
      "Building CALM, a comprehensive single-cell and spatial atlas of leukemia and its microenvironment.",
    tags: ["Atlas", "Leukemia", "Single-cell"],
  },
];

const statusStyles: Record<string, string> = {
  "Under Revision": "bg-amber-500/15 text-amber-300 border-amber-500/30",
  "In Revision": "bg-amber-500/15 text-amber-300 border-amber-500/30",
  "In Submission": "bg-sky-500/15 text-sky-300 border-sky-500/30",
};

function PaperCard({
  title,
  journal,
  year,
  description,
  tags,
  link,
  logo,
  status,
  featured,
  index,
}: PaperCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Flying in from right effect
    gsap.fromTo(
      cardRef.current,
      { x: 500, rotation: 15, opacity: 0, scale: 0.9 },
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

  const borderColors = [
    "border-purple-500/30 hover:border-purple-500/50",
    "border-cyan-500/30 hover:border-cyan-500/50",
    "border-orange-500/30 hover:border-orange-500/50",
    "border-pink-500/30 hover:border-pink-500/50",
    "border-emerald-500/30 hover:border-emerald-500/50",
  ];

  const gradients = [
    "from-purple-600/20 to-purple-900/20",
    "from-cyan-600/20 to-cyan-900/20",
    "from-orange-600/20 to-orange-900/20",
    "from-pink-600/20 to-pink-900/20",
    "from-emerald-600/20 to-emerald-900/20",
  ];

  return (
    <div
      ref={cardRef}
      className={`relative glass-dark rounded-2xl p-8 border ${
        featured
          ? "border-amber-400/40 hover:border-amber-400/60 ring-1 ring-amber-400/20"
          : borderColors[index % borderColors.length]
      } transition-all duration-500 max-w-2xl mx-auto overflow-hidden`}
      style={{ willChange: "transform, opacity" }}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${
          featured ? "from-amber-500/10 to-amber-900/10" : gradients[index % gradients.length]
        } opacity-50`}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Journal logo, on a light chip so it reads on the dark card */}
            {logo ? (
              <div className="flex items-center justify-center rounded-md bg-white px-2 py-1.5 shrink-0">
                <Image
                  src={logo}
                  alt={journal}
                  width={120}
                  height={32}
                  className="h-6 w-auto object-contain"
                />
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 shrink-0">
                <FileText className="w-5 h-5 text-purple-400" />
              </div>
            )}
            <div className="min-w-0">
              <span className="block text-xs font-mono text-purple-300 uppercase tracking-wider truncate">
                {journal}
                {year && <span className="text-white/40 ml-2">• {year}</span>}
              </span>
              {status && (
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                    statusStyles[status] ?? "bg-white/10 text-white/60 border-white/20"
                  }`}
                >
                  {status}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {featured && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-400/15 text-amber-300 border border-amber-400/30">
                <Star className="w-3 h-3 fill-amber-300" />
                Featured
              </span>
            )}
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${journal} publication`}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
              >
                <ExternalLink className="w-4 h-4 text-white/60" />
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

  const published = papersData.filter((p) => !p.status).length;
  const inProgress = papersData.length - published;

  return (
    <section
      ref={sectionRef}
      data-scene="projects"
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
          <p className="text-white/60 max-w-xl mx-auto mb-5">
            Peer-reviewed and in-progress work in spatial multi-omics,
            computational biology, and the leukemia microenvironment.
          </p>
          <div className="flex items-center justify-center gap-3 text-white/40 font-mono text-xs">
            <span className="flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5" />
              {papersData.length} papers
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>{published} peer-reviewed</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>{inProgress} in progress</span>
          </div>
        </div>
      </div>

      {/* Papers - flying from right to left */}
      <div className="relative z-10 space-y-[60vh] px-6 pt-32">
        {papersData.map((paper, index) => (
          <PaperCard key={index} {...paper} index={index} />
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
