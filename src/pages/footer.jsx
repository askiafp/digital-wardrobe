import React from 'react';
import { colors } from '../constants';

export default function Footer() {
  const borderColor = colors?.border || '#E5E0D8';
  const headingColor = colors?.heading || '#1A1714';
  const mutedColor = colors?.muted || '#9E9890';

  return (
    <section className="px-6 md:px-12 py-12 border-t" style={{ borderColor: borderColor }}>
      <div className="max-w-5xl mx-auto text-center space-y-4">
        <h3
          className="text-xl font-light"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: headingColor }}
        >
          A Digital Wardrobe for the Intentional
        </h3>
        <p style={{ color: mutedColor }}>
          Closetry helps you reconnect with the clothes you already own.
        </p>
        
        <div 
          className="pt-8 text-[11px] tracking-[0.2em] uppercase" 
          style={{ 
            color: '#000000 !important', 
            fontWeight: '800 !important', 
            opacity: '1 !important'        
          }}
        >
          <p style={{ color: '#000000 !important', fontWeight: '800 !important' }}>
            © {new Date().getFullYear()} Closetry. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}