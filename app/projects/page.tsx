"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/ui/Navigation";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import {
  ExternalLink,
  Github,
  FileText,
  Code,
  Presentation,
  Microscope,
  ArrowRight,
  ImageIcon,
} from "lucide-react";
import GlobalHorizonFooter from "@/components/ui/GlobalHorizonFooter";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Publications data with logo placeholders
const publications = [
  {
    title: "Integrative spatial multi-omics reveal niche-specific inflammatory signaling and differentiation hierarchies in AML",
    journal: "iScience",
    year: "2026",
    description:
      "Comprehensive spatial transcriptomic profiling revealing cellular neighborhoods in acute myeloid leukemia bone marrow samples.",
    tags: ["Spatial Multi-Omics", "AML", "Bone Marrow"],
    link: "https://www.cell.com/iscience/fulltext/S2589-0042(25)02550-7",
    github: "https://github.com/abbaslab/2025_Spatial_Profiling_in_Medullary_Extramedullary_Leukemia",
    logo: "/assets/iScience-logo.png",
  },
  {
    title: "Macrophage-secreted Pyrimidine Metabolites Confer Chemotherapy Resistance in Acute Myeloid Leukemia",
    journal: "BioRxiv",
    year: "2025",
    description:
      "Identifying a metabolic immune-leukemia crosstalk in which SAMHD1 high macrophages mediates chemoresistance by secreting pyrimidine metabolites.",
    tags: ["scRNA-seq", "HSC", "Niche Dynamics"],
    link: "https://www.biorxiv.org/content/10.1101/2025.11.01.686055v1.abstract",
    github: "https://github.com/abbaslab",
    logo: "/assets/BioRxiv_logo.png",
  },
  {
    title: "Multimodal spatial proteomic profiling in acute myeloid leukemia",
    journal: "npj Precision Oncology",
    year: "2025",
    description:
      "Novel computational framework for integrating spatial proteomics and transcriptomics data in cancer research.",
    tags: ["Multi-modal", "Pipeline", "Integration"],
    link: "https://www.nature.com/articles/s41698-025-00897-7",
    github: "https://github.com/abbaslab",
    logo: "/assets/npj.png",
  },
  {
    title: "Mutation dynamics from diagnosis to relapse in acute myeloid leukemia with chromosomal 7 deletions",
    journal: "Leukemia & Lymphoma",
    year: "2024",
    description:
      "Mutation dynamics from diagnosis to relapse in acute myeloid leukemia with chromosomal 7 deletions.",
    tags: ["AML", "Mutation Dynamics", "Chromosomal 7 Deletions"],
    link: "https://www.tandfonline.com/doi/abs/10.1080/10428194.2025.2477723",
    github: "https://github.com/abbaslab",
    logo: "/assets/Taylor_and_Francis.png",
  },
  {
    title: "Comprehensive characterization of IFNγ signaling in acute myeloid leukemia reveals prognostic and therapeutic strategies",
    journal: "Nature Communications",
    year: "2024",
    description:
      "Inhibiting IFNγ signaling is a potential treatment strategy to overcoming venetoclax resistance and immune evasion in AML patients.",
    tags: ["Immunology", "TME", "Single Cell Analysis"],
    link: "https://www.nature.com/articles/s41467-024-45916-6",
    github: "https://github.com/abbaslab",
    logo: "/assets/Nat-Comm.jpg",
  },
];

// Symposium & Congress presentations
const presentations = [
  {
    title: "Multimodal Spatial Transcriptomic Profiling Elucidates Niche-Specific Dynamics in Medullary and Extramedullary Acute Myeloid Leukemia",
    event: "American Society of Hematology (ASH)",
    year: "2024",
    type: "Oral Presentation",
    description:
      "Presented novel findings on spatial organization of the bone marrow niche in acute myeloid leukemia using integrated multi-omics approaches.",
    logo: "/assets/ASH.png",
    link: "https://ashpublications.org/blood/article/144/Supplement%201/1059/530503",
  },
  {
    title: "Integrative Spatial Multi-Omics Reveal Niche-Specific Inflammatory Signaling and Differentiation Hierarchies in Acute Myeloid Leukemia",
    event: "European Hematology Association (EHA)",
    year: "2025",
    type: "Oral Presentation",
    description:
      "Presented novel findings on spatial organization of the bone marrow niche in acute myeloid leukemia using integrated multi-omics approaches.",
    logo: "/assets/EHA.jpg",
    link: "https://www.cell.com/iscience/fulltext/S2589-0042(25)02550-7",
  },
];

// Software projects - 4 square cards
const softwareProjects = [
  {
    title: "SpatialOmics Toolkit",
    description:
      "Python package for comprehensive spatial transcriptomics analysis including cell segmentation, spatial statistics, and visualization.",
    tags: ["Python", "Spatial Analysis"],
    github: "#",
    stars: "124",
    logo: "/assets/logos/spatial-toolkit.png",
  },
  {
    title: "CellNeighborhood",
    description:
      "R package for identifying and characterizing cellular neighborhoods in spatial omics data.",
    tags: ["R", "Bioconductor"],
    github: "#",
    stars: "87",
    logo: "/assets/logos/cell-neighborhood.png",
  },
  {
    title: "MultiOmicsIntegrator",
    description:
      "Web-based tool for integrating and visualizing multi-modal single-cell and spatial datasets.",
    tags: ["React", "WebGL"],
    github: "#",
    link: "#",
    stars: "56",
    logo: "/assets/logos/multi-omics.png",
  },
  {
    title: "NicheMapper",
    description:
      "Interactive visualization platform for exploring cellular niches and microenvironments in tissue sections.",
    tags: ["D3.js", "Python"],
    github: "#",
    link: "#",
    stars: "43",
    logo: "/assets/logos/niche-mapper.png",
  },
];

export default function ProjectsPage() {
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(headerRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      delay: 0.3,
    });

    // Set all cards to full opacity immediately, then animate position only
    gsap.set(".project-card", { opacity: 1 });
    gsap.from(".project-card", {
      y: 30,
      duration: 0.8,
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".projects-grid",
        start: "top 80%",
      },
    });

    gsap.set(".presentation-card", { opacity: 1 });
    gsap.from(".presentation-card", {
      y: 30,
      duration: 0.8,
      stagger: 0.15,
      scrollTrigger: {
        trigger: ".presentations-grid",
        start: "top 80%",
      },
    });

    gsap.set(".software-card", { opacity: 1 });
    gsap.from(".software-card", {
      y: 30,
      duration: 0.8,
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".software-grid",
        start: "top 80%",
      },
    });
  }, []);

  return (
    <SmoothScrollProvider>
      <Navigation />

      <main className="min-h-screen bg-void pt-24">
        {/* Header */}
        <section className="py-20 px-6">
          <div ref={headerRef} className="max-w-4xl mx-auto text-center">
            <span className="font-mono text-sm text-purple-400 tracking-widest uppercase mb-4 block">
              Research & Development
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
              Projects & Publications
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Exploring the spatial universe of cells through computational
              methods, open-source tools, and collaborative research.
            </p>
          </div>
        </section>

        {/* Publications Section */}
        <section className="pt-16 pb-20 px-6 bg-void-light">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className="p-3 rounded-xl bg-purple-500/10">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white">
                Publications
              </h2>
            </div>

            <div className="projects-grid space-y-6">
              {publications.map((pub, index) => (
                <div
                  key={index}
                  className="project-card rounded-2xl p-8 bg-white/[0.03] backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 opacity-100"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Logo placeholder */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                        {pub.logo ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={pub.logo}
                              alt={pub.journal}
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                        ) : (
                          <ImageIcon className="w-8 h-8 text-white/20" />
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                        <div>
                          <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">
                            {pub.journal} • {pub.year}
                          </span>
                          <h3 className="font-display text-xl font-bold text-white mt-2">
                            {pub.title}
                          </h3>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          {pub.link && (
                            <a
                              href={pub.link}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4 text-white/60" />
                            </a>
                          )}
                          {pub.github && (
                            <a
                              href={pub.github}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                            >
                              <Github className="w-4 h-4 text-white/60" />
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-white/60 mb-4">{pub.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {pub.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Symposium & Congress Section */}
        <section className="pt-16 pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className="p-3 rounded-xl bg-orange-500/10">
                <Presentation className="w-6 h-6 text-orange-400" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white">
                Symposiums & Conferences
              </h2>
            </div>

            <div className="presentations-grid grid md:grid-cols-2 gap-6">
              {presentations.map((pres, index) => (
                <div
                  key={index}
                  className="presentation-card aspect-square rounded-2xl p-6 bg-white/[0.03] backdrop-blur-sm border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 flex flex-col opacity-100"
                >
                  {/* Logo placeholder */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                      {pres.logo ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={pres.logo}
                            alt={pres.event}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                      ) : (
                        <ImageIcon className="w-5 h-5 text-white/20" />
                      )}
                    </div>
                    <span className="px-2 py-1 rounded-full text-[10px] font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      {pres.type}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <span className="text-xs font-mono text-orange-400 uppercase tracking-wider mb-2">
                      {pres.event} • {pres.year}
                    </span>
                    <h3 className="font-display text-lg font-bold text-white mb-3">
                      {pres.title}
                    </h3>
                    <p className="text-white/60 text-sm flex-1">
                      {pres.description}
                    </p>

                    {/* Link */}
                    {pres.link && (
                      <a
                        href={pres.link}
                        className="mt-4 inline-flex items-center gap-2 text-xs text-orange-400 hover:text-orange-300 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Abstract
                      </a>
                    )}
                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>

        {/* Software Section */}
        <section className="py-16 px-6 bg-void-light">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className="p-3 rounded-xl bg-cyan-500/10">
                <Code className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white">
                Software & Tools
              </h2>
            </div>

            <div className="software-grid grid grid-cols-2 lg:grid-cols-4 gap-6">
              {softwareProjects.map((project, index) => (
                <div
                  key={index}
                  className="software-card aspect-square rounded-2xl p-5 bg-white/[0.03] backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 group flex flex-col opacity-100"
                >
                  {/* Logo and stars */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                      {project.logo && false ? ( // Kept disabled for now per previous state
                        <div className="relative w-full h-full">
                          <Image
                            src={project.logo}
                            alt={project.title}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                      ) : (
                        <ImageIcon className="w-4 h-4 text-white/20" />
                      )}
                    </div>
                    {project.stars && (
                      <span className="text-[10px] font-mono text-white/40">
                        ⭐ {project.stars}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-display text-sm font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-white/60 text-xs mb-3 flex-1 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/5 text-white/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex gap-3">
                      {project.github && (
                        <a
                          href={project.github}
                          className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          <Github className="w-3 h-3" />
                          Code
                        </a>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Microscope className="w-12 h-12 text-purple-400 mx-auto mb-6" />
            <h2 className="font-display text-3xl font-bold text-white mb-4">
              Interested in Collaboration?
            </h2>
            <p className="text-white/60 mb-8">
              I&apos;m always looking for new research collaborations and
              opportunities to apply computational methods to biological
              questions.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 btn-primary"
            >
              <span>Let&apos;s Talk</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Global Horizon Footer */}
        <GlobalHorizonFooter />
      </main>
    </SmoothScrollProvider>
  );
}
