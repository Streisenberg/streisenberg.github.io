"use client";

import dynamic from "next/dynamic";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import Navigation from "@/components/ui/Navigation";
import StoryProgress from "@/components/ui/StoryProgress";
import HeroSection from "@/components/sections/HeroSection";
import EducationSection from "@/components/sections/EducationSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactSection from "@/components/sections/ContactSection";

// Dynamically import the 3D Experience with SSR disabled
const Experience = dynamic(() => import("@/components/three/Experience"), {
  ssr: false,
  loading: () => (
    <div className="loading-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="loading-spinner" />
        <p className="font-mono text-sm text-white/50">Loading 3D Experience...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <SmoothScrollProvider>
      {/* Navigation Header */}
      <Navigation />

      {/* Fixed 3D Canvas Background */}
      <Experience />

      {/* Global story rail — rendered OUTSIDE .content-overlay so its
          position:fixed is relative to the viewport, not the transformed
          overlay box. Tracks the visitor across the whole narrative. */}
      <StoryProgress />

      {/* Scrollable Content Overlay */}
      <main className="content-overlay">
        {/* Hero Section - Intro */}
        <HeroSection />

        {/* Education Journey - Istanbul, Greece, Houston */}
        <EducationSection />

        {/* Projects Section - Flying papers */}
        <ProjectsSection />

        {/* Contact Section */}
        <ContactSection />
      </main>
    </SmoothScrollProvider>
  );
}
