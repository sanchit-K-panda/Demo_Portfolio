"use client";

/**
 * ContactSection — Floating terminal-style contact panel.
 *
 * Features:
 *  - Corner accent decorations (SVG brackets)
 *  - Bottom-border-only terminal inputs
 *  - GSAP panel rise-in on scroll
 *  - React Hook Form + Zod validation
 *  - Success state with animated checkmark
 *  - Social links row
 */
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

gsap.registerPlugin(ScrollTrigger);

// ── Zod schema ──────────────────────────────────────────────────────────────
const schema = z.object({
  name:    z.string().min(2, "Name must be at least 2 characters"),
  email:   z.string().email("Invalid email address"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type FormValues = z.infer<typeof schema>;

// ── Corner bracket decoration ───────────────────────────────────────────────
function CornerBracket({
  corner,
}: {
  corner: "tl" | "tr" | "bl" | "br";
}) {
  const rotations = { tl: 0, tr: 90, br: 180, bl: 270 };
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="absolute text-white/20"
      style={{
        top:       corner.startsWith("t") ? 0 : "auto",
        bottom:    corner.startsWith("b") ? 0 : "auto",
        left:      corner.endsWith("l")   ? 0 : "auto",
        right:     corner.endsWith("r")   ? 0 : "auto",
        transform: `rotate(${rotations[corner]}deg)`,
      } as React.CSSProperties}
    >
      <path d="M0 24 V0 H24" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

// ── Social data ─────────────────────────────────────────────────────────────
const SOCIALS = [
  { label: "GitHub",   href: "https://github.com",   handle: "github.com" },
  { label: "LinkedIn", href: "https://linkedin.com",  handle: "linkedin.com" },
  { label: "X/Twitter",href: "https://twitter.com",  handle: "@handle" },
];

// ── Main section ─────────────────────────────────────────────────────────────
export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  // GSAP entrance — blur rise + post-settle glitch flash
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true },
      });
      tl.fromTo(
        panelRef.current,
        { y: 60, opacity: 0, filter: "blur(12px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, ease: "power3.out" },
      ).to(panelRef.current, {
        keyframes: [
          { filter: "brightness(1.8) blur(1px)", duration: 0.05 },
          { filter: "brightness(0.6)",           duration: 0.04 },
          { filter: "brightness(1.2)",           duration: 0.04 },
          { filter: "brightness(1)",             duration: 0.15, ease: "power2.out" },
        ],
        ease: "none",
        clearProps: "filter",
      }, "-=0.1");
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const onSubmit = async (data: FormValues) => {
    // In production, replace with your API route or email service
    await new Promise((r) => setTimeout(r, 1000));
    console.log("Contact form submitted:", data);
    setSent(true);
    reset();
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative bg-black py-28 px-6 md:px-14 overflow-hidden"
      aria-labelledby="contact-headline"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)," +
            "linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-[90rem] mx-auto">
        {/* Section label */}
        <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/20 mb-5 flex items-center gap-3">
          <span className="block w-6 h-px bg-white/20" />
          05 — Contact
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16 lg:gap-24 items-start">
          {/* Left: headline + socials */}
          <div>
            <h2
              id="contact-headline"
              className="font-display font-bold mb-8"
              style={{ fontSize: "clamp(2rem, 5.5vw, 5rem)", lineHeight: 0.95 }}
            >
              LET&apos;S
              <br />
              <span
                style={{
                  WebkitTextStroke: "1.5px rgba(255,255,255,0.45)",
                  color: "transparent",
                }}
              >
                CONNECT.
              </span>
            </h2>
            <p className="text-[15px] leading-relaxed text-white/40 mb-12 max-w-sm">
              Open to full-time roles, freelance projects, and interesting collaborations.
              Drop me a message and I&apos;ll respond within 24 hours.
            </p>

            {/* Social links */}
            <div className="space-y-4">
              {SOCIALS.map(({ label, href, handle }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-3.5 border-b border-white/8 hover:border-white/28 transition-colors duration-200"
                >
                  <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-white/35 group-hover:text-white/70 transition-colors duration-200">
                    {label}
                  </span>
                  <span className="font-mono text-[12px] text-white/55 group-hover:text-white transition-colors duration-200">
                    {handle}&nbsp;↗
                  </span>
                </a>
              ))}
            </div>

            {/* Direct email */}
            <div className="mt-12">
              <p className="font-mono text-[10px] tracking-widest uppercase text-white/18 mb-2">
                Or email directly
              </p>
              <a
                href="mailto:hello@example.com"
                className="font-display font-bold text-white/55 hover:text-white transition-colors duration-200 tracking-tight"
                style={{ fontSize: "clamp(1rem, 2.2vw, 1.6rem)" }}
              >
                hello@example.com
              </a>
            </div>
          </div>

          {/* Right: floating form panel */}
          <div ref={panelRef} className="relative">
            {/* Corner brackets */}
            <CornerBracket corner="tl" />
            <CornerBracket corner="tr" />
            <CornerBracket corner="bl" />
            <CornerBracket corner="br" />

            <div className="border border-white/10 bg-white/[0.025] backdrop-blur-sm p-8 md:p-10">
              {/* Panel header */}
              <div className="flex items-center justify-between mb-8 pb-5 border-b border-white/8">
                <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/25">
                  ▌ Message
                </span>
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white/10" />
                  <span className="w-2 h-2 rounded-full bg-white/10" />
                  <span className="w-2 h-2 rounded-full bg-white/25" />
                </div>
              </div>

              {sent ? (
                // ── Success state
                <div className="text-center py-16">
                  <div className="w-12 h-12 mx-auto mb-6 border border-white/20 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" aria-hidden="true">
                      <path d="M4 12l5.5 5.5L20 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="font-display font-bold text-white mb-2 text-xl">Message sent.</h3>
                  <p className="font-mono text-[12px] text-white/40 mb-8 tracking-wider">
                    I&apos;ll be in touch within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/35 border-b border-white/15 hover:text-white hover:border-white/40 transition-all duration-200 pb-px"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                // ── Form
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  {/* Name */}
                  <div className="mb-7">
                    <label htmlFor="name" className="block font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Sanchit"
                      {...register("name")}
                      className="w-full bg-transparent border-0 border-b border-white/15 text-white/80 placeholder:text-white/18 focus:outline-none focus:border-white/40 py-2.5 font-mono text-[13px] tracking-wider transition-colors duration-200"
                    />
                    {errors.name && (
                      <p className="mt-2 font-mono text-[10px] text-white/50 tracking-wider">
                        ▲ {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="mb-7">
                    <label htmlFor="email" className="block font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="abc@example.com"
                      {...register("email")}
                      className="w-full bg-transparent border-0 border-b border-white/15 text-white/80 placeholder:text-white/18 focus:outline-none focus:border-white/40 py-2.5 font-mono text-[13px] tracking-wider transition-colors duration-200"
                    />
                    {errors.email && (
                      <p className="mt-2 font-mono text-[10px] text-white/50 tracking-wider">
                        ▲ {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="mb-9">
                    <label htmlFor="message" className="block font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="Tell me about your project..."
                      {...register("message")}
                      className="w-full bg-transparent border-0 border-b border-white/15 text-white/80 placeholder:text-white/18 focus:outline-none focus:border-white/40 py-2.5 font-mono text-[13px] tracking-wider transition-colors duration-200 resize-none"
                    />
                    {errors.message && (
                      <p className="mt-2 font-mono text-[10px] text-white/50 tracking-wider">
                        ▲ {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full flex items-center justify-between px-6 py-4 border border-white/18 hover:border-white hover:bg-white transition-all duration-250 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-white group-hover:text-black transition-colors duration-200">
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </span>
                    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-white group-hover:text-black transition-colors duration-200" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between mt-16 pt-8 border-t border-white/8">
          <span className="font-mono text-[10px] text-white/18 tracking-widest uppercase">
            © 2026 — All rights reserved
          </span>
          <span className="font-mono text-[9px] text-white/12 tracking-widest hidden sm:block">
            05 / 05
          </span>
        </div>
      </div>
    </section>
  );
}
