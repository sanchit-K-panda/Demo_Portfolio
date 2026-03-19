import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* ── Surfaces ── */
        bg: {
          DEFAULT:  "#000000",
          2:        "#080808",
          3:        "#111111",
          surface:  "#161616",
          surface2: "#1e1e1e",
        },
        /* ── Text ── */
        text: {
          DEFAULT:  "#ffffff",
          2:        "rgba(255,255,255,0.55)",
          3:        "rgba(255,255,255,0.22)",
          inv:      "#000000",
        },
        /* ── Borders ── */
        border: {
          DEFAULT: "rgba(255,255,255,0.07)",
          strong:  "rgba(255,255,255,0.18)",
          x:       "rgba(255,255,255,0.35)",
        },
        /* ── Accent (white) ── */
        accent: "#ffffff",
      },
      fontFamily: {
        sans:    ["var(--font-inter)",          "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)",  "system-ui", "sans-serif"],
        mono:    ["var(--font-jetbrains-mono)", "monospace"],
      },
      backgroundImage: {
        "pixel-grid":
          "linear-gradient(rgba(255,255,255,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.035) 1px,transparent 1px)",
        "pixel-grid-fine":
          "linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "noise":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      backgroundSize: {
        "pixel-grid":      "40px 40px",
        "pixel-grid-fine": "12px 12px",
      },
      animation: {
        "fade-in":     "fadeIn 0.5s ease forwards",
        "slide-up":    "slideUp 0.5s ease forwards",
        marquee:       "marquee 35s linear infinite",
        "marquee-rev": "marqueeRev 35s linear infinite",
        "ping-slow":   "ping 2.8s cubic-bezier(0,0,0.2,1) infinite",
        float:         "float 8s ease-in-out infinite",
        "float-alt":   "floatAlt 9s ease-in-out infinite",
        shimmer:       "shimmer 2.5s linear infinite",
        "glitch-a":    "glitchA 4s steps(1,end) infinite",
        "glitch-b":    "glitchB 4s steps(1,end) infinite",
        "scan":        "scanline 3s linear infinite",
        "blink":       "blink 1.2s steps(1,end) infinite",
        "border-spin": "borderSpin 8s linear infinite",
      },
      keyframes: {
        fadeIn:    { from: { opacity: "0" },          to:   { opacity: "1" } },
        slideUp:   { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        float:     { "0%,100%": { transform: "translateY(0)" },           "50%": { transform: "translateY(-12px)" } },
        floatAlt:  { "0%,100%": { transform: "translateY(0)" },           "40%": { transform: "translateY(-8px)" }, "70%": { transform: "translateY(-14px)" } },
        marquee:   { "0%": { transform: "translateX(0)" },                "100%": { transform: "translateX(-50%)" } },
        marqueeRev:{ "0%": { transform: "translateX(-50%)" },             "100%": { transform: "translateX(0)" } },
        shimmer:   { "0%": { backgroundPosition: "-200% 0" },            "100%": { backgroundPosition: "200% 0" } },
        blink:     { "0%,100%": { opacity: "1" },                         "50%": { opacity: "0" } },
        scanline:  {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        glitchA: {
          "0%,96%,100%":   { transform: "translate(0,0)",   clipPath: "none" },
          "97%":           { transform: "translate(-2px,0)", clipPath: "inset(10% 0 85% 0)" },
          "98%":           { transform: "translate(2px,0)",  clipPath: "inset(40% 0 40% 0)" },
          "99%":           { transform: "translate(-1px,0)", clipPath: "inset(80% 0 5% 0)" },
        },
        glitchB: {
          "0%,96%,100%":   { transform: "translate(0,0)",  clipPath: "none" },
          "97%":           { transform: "translate(2px,1px)",  clipPath: "inset(60% 0 25% 0)" },
          "98%":           { transform: "translate(-2px,0)", clipPath: "inset(20% 0 65% 0)" },
          "99%":           { transform: "translate(1px,-1px)", clipPath: "inset(90% 0 2% 0)" },
        },
        borderSpin: {
          "0%":   { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
      spacing: {
        "18": "4.5rem", "22": "5.5rem", "26": "6.5rem", "30": "7.5rem",
        "88": "22rem",  "112": "28rem", "128": "32rem",  "144": "36rem",
      },
      maxWidth: {
        "8xl": "88rem",
      },
      boxShadow: {
        "glow-sm":  "0 0 16px rgba(255,255,255,0.1)",
        "glow":     "0 0 40px rgba(255,255,255,0.15)",
        "glow-lg":  "0 0 80px rgba(255,255,255,0.12)",
        "card":     "0 0 0 1px rgba(255,255,255,0.07), 0 4px 24px rgba(0,0,0,0.8)",
        "card-hover":"0 0 0 1px rgba(255,255,255,0.22), 0 20px 60px rgba(0,0,0,0.9)",
        "btn":      "0 0 0 1px rgba(255,255,255,0.8), 0 2px 8px rgba(0,0,0,0.5)",
        "btn-hover":"0 0 0 1px rgba(255,255,255,0.7), 0 8px 32px rgba(255,255,255,0.12)",
      },
      borderRadius: {
        /* Override with very sharp radii for futuristic look */
        sm: "2px", DEFAULT: "2px", md: "4px", lg: "6px", xl: "8px",
        "2xl": "10px", "3xl": "14px", "4xl": "20px",
      },
    },
  },
  plugins: [],
};

export default config;
