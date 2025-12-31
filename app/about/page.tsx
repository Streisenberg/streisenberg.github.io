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
  MapPin,
  Mail,
  Linkedin,
  Github,
  GraduationCap,
  Microscope,
  Code,
  FlaskConical,
  ArrowRight,
} from "lucide-react";
import GlobalHorizonFooter from "@/components/ui/GlobalHorizonFooter";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const skills = [
  {
    category: "Computational Biology",
    icon: Microscope,
    items: [
      "Single-cell RNA-seq",
      "Spatial Transcriptomics",
      "Multi-omics Integration",
      "Trajectory Analysis",
      "Cell-Cell Communication",
    ],
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-400",
    borderColor: "border-purple-500/20",
    borderHover: "hover:border-purple-500/40",
    dotColor: "bg-purple-400",
  },
  {
    category: "Programming",
    icon: Code,
    items: [
      "Python",
      "R",
      "JavaScript/TypeScript",
      "HPC",
      "Bash & Shell Scripting",
    ],
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
    borderColor: "border-cyan-500/20",
    borderHover: "hover:border-cyan-500/40",
    dotColor: "bg-cyan-400",
  },
  {
    category: "Wet Lab",
    icon: FlaskConical,
    items: [
      "CRISPR Gene Editing",
      "Flow Cytometry (FACS)",
      "Cell Culture",
      "Library Preparation",
      "Immunohistochemistry",
    ],
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    borderColor: "border-orange-500/20",
    borderHover: "hover:border-orange-500/40",
    dotColor: "bg-orange-400",
  },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(heroRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      delay: 0.3,
    });

    // Simplified animation to ensure cards stay aligned correctly
    gsap.from(".skill-card", {
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      scrollTrigger: {
        trigger: ".skills-section",
        start: "top 85%",
        once: true,
      },
      onComplete: (self: any) => {
        gsap.set(".skill-card", { clearProps: "opacity,y" });
      }
    });
  }, []);

  return (
    <SmoothScrollProvider>
      <Navigation />

      <main className="min-h-screen bg-void pt-24">
        {/* Hero Section */}
        <section className="relative py-20 px-6">
          <div
            ref={heroRef}
            className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center"
          >
            {/* Image */}
            <div className="relative">
              <div className="relative w-full aspect-[4/5] max-w-md mx-auto rounded-2xl overflow-hidden border border-purple-500/20">
                <Image
                  src="/assets/About_Me.JPG"
                  alt="Enes Dasdemir"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent" />
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border border-purple-500/30 rounded-2xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-cyan-500/30 rounded-2xl" />
            </div>

            {/* Content */}
            <div>
              <span className="font-mono text-sm text-purple-400 tracking-widest uppercase mb-4 block">
                About Me
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
                Enes Dasdemir
              </h1>
              <p className="text-xl text-white/60 mb-4">
                Computational Biologist & Spatial Multi-Omics Researcher
              </p>

              <div className="flex flex-wrap gap-4 mb-6 text-sm text-white/50">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-400" />
                  <span>Houston, Texas</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  <span>University of Houston</span>
                </div>
              </div>

              <p className="text-white/70 leading-relaxed mb-8">
                I&apos;m a computational biologist passionate about understanding
                the spatial organization of cells in health and disease. My
                research focuses on developing computational methods for spatial
                multi-omics analysis, with particular interest in bone marrow
                biology and acute myeloid leukemia (AML).
              </p>

              <p className="text-white/70 leading-relaxed mb-8">
                My journey in science has taken me from Istanbul to Greece and
                finally to Houston, where I now work at the forefront of cancer
                research. I believe that by understanding the spatial context of
                cells, we can unlock new insights into disease mechanisms and
                develop better treatments.
              </p>

              {/* Social links */}
              <div className="flex gap-4 flex-wrap">
                <a
                  href="https://github.com/Streisenberg"
                  className="p-3 rounded-xl glass border border-white/10 hover:border-purple-500/30 transition-all"
                  title="GitHub"
                >
                  <Github className="w-5 h-5 text-white/70" />
                </a>
                <a
                  href="https://www.linkedin.com/in/dasdemirenes/"
                  className="p-3 rounded-xl glass border border-white/10 hover:border-purple-500/30 transition-all"
                  title="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-white/70" />
                </a>
                <a
                  href="mailto:edasdemir@uh.edu"
                  className="p-3 rounded-xl glass border border-white/10 hover:border-purple-500/30 transition-all"
                  title="Email"
                >
                  <Mail className="w-5 h-5 text-white/70" />
                </a>
                <a
                  href="https://scholar.google.com/citations?user=WhlWVjQAAAAJ&hl=en"
                  className="p-3 rounded-xl glass border border-white/10 hover:border-purple-500/30 transition-all"
                  title="Google Scholar"
                >
                  <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
                  </svg>
                </a>
                <a
                  href="https://www.researchgate.net/profile/Enes-Dasdemir-3"
                  className="p-3 rounded-xl glass border border-white/10 hover:border-purple-500/30 transition-all"
                  title="ResearchGate"
                >
                  <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.68a3.193 3.193 0 0 0-.112.437 8.365 8.365 0 0 0-.078.53 9 9 0 0 0-.05.727c-.01.282-.013.621-.013 1.016a31.121 31.121 0 0 0 .014 1.017 9 9 0 0 0 .05.727 7.946 7.946 0 0 0 .078.53 3.193 3.193 0 0 0 .112.437c.244.743.65 1.303 1.213 1.68.565.376 1.255.564 2.073.564.818 0 1.508-.188 2.073-.564.564-.377.97-.937 1.213-1.68.043-.13.08-.277.112-.437.032-.166.057-.343.078-.53.02-.187.036-.435.05-.727.013-.29.014-.632.014-1.017s-.001-.725-.014-1.016a9 9 0 0 0-.05-.727 7.995 7.995 0 0 0-.078-.53 3.193 3.193 0 0 0-.112-.437c-.244-.744-.65-1.303-1.213-1.68C21.094.19 20.404 0 19.586 0zm0 3.152c.3 0 .53.08.695.238.165.16.247.394.247.703v2.06c0 .31-.082.544-.247.703-.164.16-.395.238-.695.238-.3 0-.53-.079-.695-.238-.165-.16-.247-.394-.247-.704V4.093c0-.309.082-.543.247-.703.164-.158.395-.238.695-.238zM5.103 7.12c-.91 0-1.705.232-2.386.695-.68.464-1.16 1.108-1.44 1.934-.28.825-.42 1.78-.42 2.865 0 1.084.14 2.04.42 2.865.28.825.76 1.47 1.44 1.933.681.464 1.476.695 2.386.695.91 0 1.705-.231 2.385-.695.681-.463 1.161-1.108 1.44-1.933.28-.825.42-1.781.42-2.865 0-1.084-.14-2.04-.42-2.865-.279-.826-.759-1.47-1.44-1.934-.68-.463-1.475-.695-2.385-.695zm0 2.753c.512 0 .898.208 1.16.625.26.417.39 1.085.39 2.004 0 .918-.13 1.587-.39 2.004-.262.417-.648.625-1.16.625-.511 0-.897-.208-1.159-.625-.261-.417-.391-1.086-.391-2.004 0-.919.13-1.587.391-2.004.262-.417.648-.625 1.16-.625zm8.482.16v6.68h3.5c.89 0 1.622-.22 2.198-.658.576-.438.864-1.097.864-1.977 0-.533-.122-.972-.366-1.318a2.208 2.208 0 0 0-.941-.754c.296-.218.534-.48.713-.785.18-.306.27-.673.27-1.101 0-.78-.261-1.365-.782-1.756-.521-.39-1.207-.586-2.058-.586h-3.398v.255zm2.174 1.425h1.11c.35 0 .604.07.765.208.16.139.24.357.24.653 0 .296-.084.515-.25.655-.168.14-.42.209-.755.209h-1.11v-1.725zm0 3.23h1.32c.387 0 .67.082.85.246.178.164.267.411.267.739 0 .329-.089.574-.268.738-.178.164-.462.246-.849.246h-1.32v-1.969z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="skills-section py-20 px-6 bg-void-light">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="font-mono text-sm text-cyan-400 tracking-widest uppercase mb-4 block">
                Expertise
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
                Skills & Technologies
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-start">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className={`skill-card rounded-2xl p-8 bg-white/[0.03] backdrop-blur-sm border ${skill.borderColor} ${skill.borderHover} flex flex-col h-full`}
                >
                  <div className={`p-3 rounded-xl ${skill.iconBg} w-fit mb-6`}>
                    <skill.icon className={`w-6 h-6 ${skill.iconColor}`} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-4">
                    {skill.category}
                  </h3>
                  <ul className="space-y-3 flex-1">
                    {skill.items.map((item, i) => (
                      <li
                        key={i}
                        className="text-white/70 flex items-center gap-3 text-sm"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${skill.dotColor} flex-shrink-0`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
              Interested in Collaborating?
            </h2>
            <p className="text-white/60 mb-8 max-w-2xl mx-auto">
              I&apos;m always open to discussing new research opportunities,
              collaborations, or just chatting about spatial biology.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 btn-primary"
            >
              <span>Get in Touch</span>
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
