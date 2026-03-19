"use client";

/**
 * LottiePlayer — renders a Lottie animation JSON.
 * Falls back to a simple SVG placeholder if the source fails to load.
 */
import React, { useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";

interface LottiePlayerProps {
  /** Path to a local /public/lottie/*.json file or a remote URL */
  src: string;
  /** Width/height in px (square by default) */
  size?: number;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  /** Accessible label */
  ariaLabel?: string;
}

/** Fallback SVG when Lottie file is unavailable */
function FallbackIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="30" stroke="#6366f1" strokeWidth="2" />
      <circle cx="32" cy="32" r="12" fill="#6366f1" opacity="0.3" />
      <circle cx="32" cy="32" r="6"  fill="#6366f1" />
    </svg>
  );
}

export default function LottiePlayer({
  src,
  size = 120,
  loop = true,
  autoplay = true,
  className = "",
  ariaLabel = "Animated illustration",
}: LottiePlayerProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        role="img"
        aria-label={ariaLabel}
        className={className}
        style={{ width: size, height: size }}
      >
        <FallbackIcon size={size} />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={{ width: size, height: size }}
    >
      <Player
        src={src}
        autoplay={autoplay}
        loop={loop}
        style={{ width: size, height: size }}
        onEvent={(event) => {
          if (event === "error") setError(true);
        }}
      />
    </div>
  );
}
