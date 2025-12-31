"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import Navigation from "@/components/ui/Navigation";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import {
  Mail,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Send,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import GlobalHorizonFooter from "@/components/ui/GlobalHorizonFooter";

export default function ContactPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(headerRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      delay: 0.3,
    }).from(
      ".contact-card",
      {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
      },
      "-=0.5"
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

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
      name: "Twitter",
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

  return (
    <SmoothScrollProvider>
      <Navigation />

      <main className="min-h-screen bg-void pt-24">
        {/* Back link */}
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>
        </div>

        {/* Header */}
        <section className="py-12 px-6">
          <div ref={headerRef} className="max-w-4xl mx-auto text-center">
            <span className="font-mono text-sm text-purple-400 tracking-widest uppercase mb-4 block">
              Get in Touch
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
              Let&apos;s Connect
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Interested in collaborating on research, discussing spatial
              multi-omics, or just want to say hello? I&apos;d love to hear from
              you.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              {/* Location Card */}
              <div className="contact-card glass-dark rounded-2xl p-8 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-orange-500/10">
                    <MapPin className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white mb-2">
                      Location
                    </h3>
                    <p className="text-white/60">
                      University of Houston
                      <br />
                      Houston, Texas, USA
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="contact-card glass-dark rounded-2xl p-8 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/10">
                    <Mail className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white mb-2">
                      Email
                    </h3>
                    <a
                      href="mailto:edasdemir@uh.edu"
                      className="text-white/60 hover:text-purple-400 transition-colors"
                    >
                      edasdemir@uh.edu
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="contact-card glass-dark rounded-2xl p-8 border border-white/10">
                <h3 className="font-display text-lg font-bold text-white mb-6">
                  Connect on Social
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl glass border border-white/5 transition-all ${link.color}`}
                    >
                      <link.icon className="w-5 h-5" />
                      <span className="font-medium">{link.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-card glass-dark rounded-2xl p-8 border border-white/10">
              <h3 className="font-display text-xl font-bold text-white mb-6">
                Send a Message
              </h3>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
                  <h4 className="font-display text-xl font-bold text-white mb-2">
                    Message Sent!
                  </h4>
                  <p className="text-white/60">
                    Thanks for reaching out. I&apos;ll get back to you soon.
                  </p>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all resize-none"
                      placeholder="Your message..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                  >
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Global Horizon Footer */}
        <GlobalHorizonFooter className="mt-12" />
      </main>
    </SmoothScrollProvider>
  );
}

