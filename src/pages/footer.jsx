import React from 'react';
import { colors } from '../constants';

export default function Footer() {
  const borderColor = colors?.border || '#E5E0D8';
  const headingColor = colors?.heading || '#1A1714';
  const prominentBodyColor = colors?.heading || '#1A1714'; 

  return (
    <section className="px-4 sm:px-6 md:px-12 py-6 border-t mt-4" style={{ borderColor: borderColor }}>
      <div className="max-w-5xl mx-auto text-center space-y-2">
        
        <h3
          className="text-xl sm:text-2xl font-light tracking-wide"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: headingColor }}
        >
          A Digital Wardrobe for the Intentional
        </h3>
        
        <p className="text-xs sm:text-sm font-light max-w-md mx-auto leading-relaxed" style={{ color: prominentBodyColor }}>
          Closetry helps you reconnect with the clothes you already own.
        </p>
        
        <div 
          className="pt-2 text-[10px] sm:text-[11px] tracking-[0.15em] sm:tracking-[0.2em] uppercase"
          style={{ color: '#000000', opacity: 1 }}
        >
          © {new Date().getFullYear()} Closetry. All rights reserved.
        </div>
        
      </div>
    </section>
  );
}