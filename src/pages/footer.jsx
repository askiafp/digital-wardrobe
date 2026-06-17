import React from 'react';
import { colors } from '../constants';

export default function Footer() {
  const borderColor = colors?.border || '#E5E0D8';
  const headingColor = colors?.heading || '#1A1714';
  const prominentBodyColor = colors?.heading || '#1A1714'; 

  return (
    // Jarak atas (mt-4) dan padding atas-bawah (py-6) dibuat rapat
    <section className="px-4 sm:px-6 md:px-12 py-6 border-t mt-4" style={{ borderColor: borderColor }}>
      <div className="max-w-5xl mx-auto text-center space-y-2">
        
        {/* Title */}
        <h3
          className="text-xl sm:text-2xl font-light tracking-wide"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: headingColor }}
        >
          A Digital Wardrobe for the Intentional
        </h3>
        
        {/* Description */}
        <p className="text-xs sm:text-sm font-light max-w-md mx-auto leading-relaxed" style={{ color: prominentBodyColor }}>
          Closetry helps you reconnect with the clothes you already own.
        </p>
        
        {/* Copyright Section - Dijamin Hitam Pekat & Tidak Pudar */}
        <div 
          className="pt-2 text-[10px] sm:text-[11px] tracking-[0.15em] sm:tracking-[0.2em] uppercase font-bold"
          style={{ color: '#000000', opacity: 1 }} // Cara valid mengunci warna hitam pekat di React
        >
          © {new Date().getFullYear()} Closetry. All rights reserved.
        </div>
        
      </div>
    </section>
  );
}