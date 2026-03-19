"use client";

/**
 * Footer — Minimal B&W footer.
 *
 * Columns:
 *  Left: logo + tagline
 *  Right: social icons + back-to-top
 * Bottom row: copyright + built-with stack
 */
import React from "react";

const SOCIALS = [
  {
    label: "GitHub",
    href:  "https://github.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href:  "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    href:  "https://twitter.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer
      className="relative bg-black border-t border-white/8 px-6 md:px-14 py-14 overflow-hidden"
      aria-label="Site footer"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px,transparent 1px)," +
            "linear-gradient(90deg,rgba(255,255,255,0.035) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-[90rem] mx-auto">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-12">
          {/* Logo + tagline */}
          <div>
            <span className="block font-mono text-[11px] tracking-[0.4em] uppercase text-white/55 mb-2">
              AR_DEV
            </span>
            <p className="font-mono text-[10px] tracking-wider text-white/20">
              Full-Stack Engineer & Designer
            </p>
          </div>

          {/* Social + back to top */}
          <div className="flex items-center gap-6">
            {SOCIALS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-white/28 hover:text-white transition-colors duration-200"
              >
                {icon}
              </a>
            ))}
            <button
              type="button"
              aria-label="Scroll back to top"
              onClick={scrollTop}
              className="ml-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] uppercase text-white/25 hover:text-white transition-colors duration-200"
            >
              Top
              <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3" aria-hidden="true">
                <path d="M8 13V3M4 7l4-4 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/8 mb-8" aria-hidden="true" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-mono text-[10px] tracking-wider text-white/18">
            © 2025 AR_DEV — All rights reserved
          </p>
          <div className="flex items-center gap-3">
            {["Next.js", "GSAP", "R3F", "Tailwind"].map((t, i) => (
              <React.Fragment key={t}>
                {i > 0 && <span className="text-white/12 font-mono text-[10px]">·</span>}
                <span className="font-mono text-[10px] tracking-wider text-white/18">{t}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
