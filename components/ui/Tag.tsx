import React from "react";

interface TagProps {
  label: string;
  className?: string;
}

/** Simple pill tag for skills/project labels */
export const Tag: React.FC<TagProps> = ({ label, className = "" }) => (
  <span className={`tag-pill ${className}`}>{label}</span>
);

export default Tag;
