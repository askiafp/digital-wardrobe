import React from 'react';
import { ChevronRight } from 'lucide-react';
import { colors } from '../constants';

export default function HomePage({ wardrobe, savedOutfits, weeklyPlan, navigateTo }) {
  return (
    <div style={{ backgroundColor: colors.background }}>
      {/* Editorial Hero */}
      <section className="pt-20 pb-16 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-6">
            <h1
              className="text-6xl md:text-7xl font-light"
              style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}
            >
              Your Wardrobe,<br />Beautifully Organized
            </h1>
            <p className="text-lg" style={{ color: colors.body, fontFamily: 'DM Sans, sans-serif' }}>
              Reconnect with the clothes you already own. Create, plan, and style with intention.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => navigateTo('wardrobe')}
                className="px-8 py-3 text-sm tracking-widest font-light rounded-2xl transition-all duration-150"
                style={{ backgroundColor: colors.accent, color: 'white' }}
              >
                START STYLING
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stats */}
      <section className="px-6 md:px-12 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="text-4xl font-light" style={{ color: colors.accent }}>
                {wardrobe.length}
              </div>
              <p className="text-sm tracking-wider uppercase" style={{ color: colors.muted }}>
                Pieces in Your Closet
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="text-4xl font-light" style={{ color: colors.accent }}>
                {savedOutfits.length}
              </div>
              <p className="text-sm tracking-wider uppercase" style={{ color: colors.muted }}>
                Outfits Saved
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="text-4xl font-light" style={{ color: colors.accent }}>
                {Object.keys(weeklyPlan).length}
              </div>
              <p className="text-sm tracking-wider uppercase" style={{ color: colors.muted }}>
                Days Planned
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* CTA Section */}
      <section className="px-6 md:px-12 py-16 border-t" style={{ borderColor: colors.border }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Bagian Teks (Kiri) */}
            <div>
              <h2
                className="text-4xl font-light mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}
              >
                Mix & Match
              </h2>
              <p style={{ color: colors.body, lineHeight: 1.8 }}>
                Combine pieces from your wardrobe. Preview outfits instantly. Save your favorites for later.
              </p>
              <button
                onClick={() => navigateTo('styling')}
                className="mt-6 text-sm tracking-widest font-light flex items-center gap-2 transition-colors duration-150"
                style={{ color: colors.accent }}
              >
                EXPLORE STYLING <ChevronRight size={16} />
              </button>
            </div>

            {/* Bagian Gambar (Kanan) */}
            <div className="h-64 md:h-80 w-full overflow-hidden rounded-2xl shadow-lg">
              <img 
                src="/images/all-outfit.jpg" 
                alt="Mix and Match Preview" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-12 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Weekly Planner */}
            <div
              className="rounded-2xl p-8"
              style={{ backgroundColor: colors.surface }}
            >
              <h3
                className="text-2xl font-light mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}
              >
                Weekly Planning
              </h3>
              <p style={{ color: colors.body, marginBottom: '20px' }}>
                Organize your outfits for the week ahead. Plan each day with intention.
              </p>
              <button
                onClick={() => navigateTo('planner')}
                className="text-sm tracking-widest font-light flex items-center gap-2 transition-colors duration-150"
                style={{ color: colors.accent }}
              >
                PLAN YOUR WEEK <ChevronRight size={16} />
              </button>
            </div>

            {/* Analytics */}
            <div
              className="rounded-2xl p-8"
              style={{ backgroundColor: colors.surface }}
            >
              <h3
                className="text-2xl font-light mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}
              >
                Wardrobe Insights
              </h3>
              <p style={{ color: colors.body, marginBottom: '20px' }}>
                Understand your styling patterns and maximize your wardrobe potential.
              </p>
              <button
                onClick={() => navigateTo('analytics')}
                className="text-sm tracking-widest font-light flex items-center gap-2 transition-colors duration-150"
                style={{ color: colors.accent }}
              >
                VIEW INSIGHTS <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="px-6 md:px-12 py-12 border-t" style={{ borderColor: colors.border }}>
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h3
            className="text-xl font-light"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}
          >
            A Digital Wardrobe for the Intentional
          </h3>
          <p style={{ color: colors.muted }}>
            Closetry helps you reconnect with the clothes you already own.
          </p>
          
          {/* Copyright Section */}
          <div className="pt-8 text-[10px] tracking-[0.2em] uppercase" style={{ color: colors.muted }}>
            <p>© {new Date().getFullYear()} Closetry. All rights reserved.</p>
          </div>
        </div>
      </section>
    </div>
  );
}