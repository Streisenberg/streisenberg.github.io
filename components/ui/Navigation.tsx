"use client";

import { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(() => {
    // Initial reveal animation
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(logoRef.current, {
      y: -30,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
    }).from(
      linksRef.current?.children || [],
      {
        y: -20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
      },
      "-=0.4"
    );
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "py-3 bg-void/80 backdrop-blur-xl border-b border-white/5"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div ref={logoRef}>
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-purple-500/30 group-hover:border-purple-500/60 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/20">
                <Image
                  src="/assets/ED_Logo.png"
                  alt="Enes Dasdemir Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-display text-lg font-bold text-white group-hover:text-gradient transition-all">
                  Enes Dasdemir
                </span>
                <span className="block text-xs font-mono text-white/40 tracking-wider">
                  COMPUTATIONAL BIOLOGIST
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div
            ref={linksRef}
            className="hidden md:flex items-center gap-1"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative px-5 py-2.5 font-medium text-white/70 hover:text-white transition-colors group"
              >
                <span className="relative z-10">{link.name}</span>
                <span className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/5 transition-all duration-300" />
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-400 group-hover:w-1/2 transition-all duration-300" />
              </Link>
            ))}

            {/* CTA Button */}
            <Link
              href="/contact"
              className="ml-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
            >
              Get in Touch
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg glass border border-white/10 hover:border-white/20 transition-all"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 glass-dark border-b border-white/10 transition-all duration-300 overflow-hidden ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-6 space-y-4">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-3 px-4 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-all font-medium"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-medium text-center"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </nav>

      {/* Decorative top border */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 via-cyan-400 to-purple-600 z-50 opacity-60" />
    </>
  );
}

