"use client";

/**
 * Button — styled-components widget (required by spec).
 * Wraps with Framer Motion for tap feedback.
 */
import React from "react";
import styled, { css } from "styled-components";
import { motion } from "framer-motion";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?:    Size;
  /** Render as an anchor tag (for navigation) */
  as?: "button" | "a";
  href?: string;
}

const sizeStyles = {
  sm: css`padding: 0.375rem 0.875rem; font-size: 0.8125rem;`,
  md: css`padding: 0.625rem 1.25rem;  font-size: 0.9375rem;`,
  lg: css`padding: 0.875rem 1.75rem;  font-size: 1.0625rem;`,
};

const variantStyles = {
  primary: css`
    background: linear-gradient(135deg, #6366f1, #a855f7);
    color: #fff;
    border: none;
    &:hover:not(:disabled) { opacity: 0.9; box-shadow: 0 0 30px rgba(99,102,241,0.5); }
  `,
  secondary: css`
    background: rgba(99,102,241,0.15);
    color: #818cf8;
    border: 1px solid rgba(99,102,241,0.3);
    &:hover:not(:disabled) { background: rgba(99,102,241,0.25); border-color: #6366f1; }
  `,
  ghost: css`
    background: transparent;
    color: #94a3b8;
    border: none;
    &:hover:not(:disabled) { color: #fff; background: rgba(255,255,255,0.06); }
  `,
  outline: css`
    background: transparent;
    color: #e2e8f0;
    border: 1px solid rgba(255,255,255,0.15);
    &:hover:not(:disabled) { border-color: rgba(255,255,255,0.4); color: #fff; }
  `,
};

const StyledButton = styled.button<{ $variant: Variant; $size: Size }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  white-space: nowrap;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid #6366f1;
    outline-offset: 3px;
  }

  ${({ $size }) => sizeStyles[$size]}
  ${({ $variant }) => variantStyles[$variant]}
`;

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  ...rest
}) => (
  <motion.div
    whileTap={{ scale: 0.96 }}
    whileHover={{ scale: 1.02 }}
    style={{ display: "inline-flex" }}
  >
    <StyledButton $variant={variant} $size={size} {...rest}>
      {children}
    </StyledButton>
  </motion.div>
);

export default Button;
