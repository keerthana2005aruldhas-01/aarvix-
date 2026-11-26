import React from 'react';

interface SectionBackdropProps {
  image: string;
  /** 0-100. Light green overlay strength. Higher = lighter (more readable), lower = image more visible */
  overlay?: number;
  position?: string;
  className?: string;
  children: React.ReactNode;
}

export const SectionBackdrop: React.FC<SectionBackdropProps> = ({
  image,
  overlay = 75,
  position = 'center',
  className = '',
  children,
}) => (
  <div className={`relative flow-root ${className}`}>
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <img
        src={image}
        alt=""
        loading="lazy"
        className="w-full h-full object-cover"
        style={{ objectPosition: position }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg,
            rgba(243, 248, 228, ${overlay / 100}) 0%,
            rgba(226, 238, 190, ${(overlay - 8) / 100}) 50%,
            rgba(205, 222, 150, ${overlay / 100}) 100%)`,
        }}
      />
    </div>
    <div className="relative">{children}</div>
  </div>
);

export default SectionBackdrop;