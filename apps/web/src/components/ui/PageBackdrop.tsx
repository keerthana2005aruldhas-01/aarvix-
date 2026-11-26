import React from 'react';

interface PageBackdropProps {
  /** Background photo shown under the pale green overlay */
  image?: string;
  /** 0-1. Higher = lighter/plainer, lower = photo more visible */
  overlay?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Pale green page backdrop. Stays inside this wrapper only,
 * so a footer placed after it is never covered.
 */
export const PageBackdrop: React.FC<PageBackdropProps> = ({
  image = '/images/hero-highway-truck.jpg',
  overlay = 0.9,
  className = '',
  children,
}) => (
  <div className={`relative isolate w-full flex-1 ${className}`}>
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg,
            rgba(243, 248, 228, ${overlay}) 0%,
            rgba(236, 244, 214, ${overlay}) 50%,
            rgba(243, 248, 228, ${overlay}) 100%)`,
        }}
      />
    </div>
    {children}
  </div>
);

export default PageBackdrop;