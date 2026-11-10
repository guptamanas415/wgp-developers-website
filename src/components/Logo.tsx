/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

export const OFFICIAL_LOGO_PATH = '/assets/aistudio/file_0000000097808211aebe646ad6bd8207_464d849d.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showLabel = false,
}) => {
  const [imageSrc, setImageSrc] = useState(OFFICIAL_LOGO_PATH);

  // Height configurations strictly preserving aspect ratio (object-fit: contain)
  const sizeStyles = {
    sm: 'h-8 sm:h-9 max-w-[160px] sm:max-w-[180px]',
    md: 'h-11 sm:h-13 max-w-[210px] sm:max-w-[260px]',
    lg: 'h-16 sm:h-20 max-w-[300px] sm:max-w-[380px]',
    xl: 'h-24 sm:h-32 max-w-[420px] sm:max-w-[540px]',
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* 
        Official WGP Developer's Company Logo:
        - Uses the official uploaded image asset
        - Preserves original design, colors and aspect ratio
        - Never cropped, stretched, distorted or recreated
        - Strictly applies object-fit: contain
        - Entire logo visible on mobile and desktop
      */}
      <img
        src={imageSrc}
        alt="WGP Developer's Official Logo"
        onError={() => {
          if (imageSrc !== '/logo.png') {
            setImageSrc('/logo.png');
          }
        }}
        className={`${sizeStyles} w-auto object-contain shrink-0 transition-transform duration-300 hover:scale-[1.02]`}
        style={{ objectFit: 'contain' }}
        loading="eager"
      />

      {showLabel && (
        <div className="flex flex-col select-none">
          <span className="font-bold tracking-tight text-white text-base md:text-lg leading-tight whitespace-nowrap">
            WGP <span className="text-[#00E5FF]">DEVELOPER'S</span>
          </span>
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium whitespace-nowrap">
            Build • Innovate • Grow
          </span>
        </div>
      )}
    </div>
  );
};
