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
                START STYLING!
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
      <section className="px-6 md:px-12 py-16 border-t" style={{ borderColor: colors.border }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
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
            
            {/* Styling */}
            <div
              className="rounded-2xl p-8"
              style={{ backgroundColor: colors.surface }}
            >
              <h3
                className="text-2xl font-light mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}
              >
                Styling
              </h3>
              <p style={{ color: colors.body, marginBottom: '20px' }}>
                Discover outfit combinations and get personalized style recommendations.
              </p>
              <button
                onClick={() => navigateTo('styling')}
                className="text-sm tracking-widest font-light flex items-center gap-2 transition-colors duration-150"
                style={{ color: colors.accent }}
              >
                EXPLORE STYLING <ChevronRight size={16} />
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

            {/* Wardrobe */}
            <div
              className="rounded-2xl p-8"
              style={{ backgroundColor: colors.surface }}
            >
              <h3
                className="text-2xl font-light mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}
              >
                Wardrobe
              </h3>
              <p style={{ color: colors.body, marginBottom: '20px' }}>
                Manage and organize all your clothing items in one place.
              </p>
              <button
                onClick={() => navigateTo('wardrobe')}
                className="text-sm tracking-widest font-light flex items-center gap-2 transition-colors duration-150"
                style={{ color: colors.accent }}
              >
                VIEW WARDROBE <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Cara Pakai Section */}
      <section className="py-20 px-8" style={{ backgroundColor: colors.surface }}>
        {/* Header */}
        <div className="text-center mb-16">
          <p
            className="text-sm tracking-widest mb-4"
            style={{ color: colors.accent }}
          >
            CARA PAKAI
          </p>
          <h2
            className="text-4xl font-light"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}
          >
            Tiga langkah mudah
            <br />
          <span className="italic">untuk tampil lebih baik</span>
          </h2>
        </div>

      {/* Steps */}
      <div className="flex items-center justify-center gap-4 max-w-5xl mx-auto">

        {/* Step 01 */}
        <div className="rounded-2xl p-8 flex-1" style={{ backgroundColor: colors.background }}>
          <p
            className="text-4xl font-light mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.accent, opacity: 0.4 }}
          >
            01
          </p>
          <h3 className="text-base font-semibold mb-3" style={{ color: colors.heading }}>
            Upload Pakaianmu
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: colors.body }}>
            Foto dan upload pakaian yang kamu punya. Kelompokkan ke kategori yang sesuai.
          </p>
        </div>

          {/* Arrow */}
          <span style={{ color: colors.accent, opacity: 0.5, fontSize: '20px' }}>→</span>

        {/* Step 02 */}
        <div className="rounded-2xl p-8 flex-1" style={{ backgroundColor: colors.background }}>
          <p
            className="text-4xl font-light mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.accent, opacity: 0.4 }}
          >
            02
          </p>
            <h3 className="text-base font-semibold mb-3" style={{ color: colors.heading }}>
              Mix & Match Outfit
            </h3>
          <p className="text-sm leading-relaxed" style={{ color: colors.body }}>
            Drag-and-drop pakaian ke canvas. Temukan kombinasi outfit terbaikmu secara visual.
          </p>
        </div>

          {/* Arrow */}
          <span style={{ color: colors.accent, opacity: 0.5, fontSize: '20px' }}>→</span>

        {/* Step 03 */}
        <div className="rounded-2xl p-8 flex-1" style={{ backgroundColor: colors.background }}>
          <p
            className="text-4xl font-light mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.accent, opacity: 0.4 }}
          >
            03
          </p>
            <h3 className="text-base font-semibold mb-3" style={{ color: colors.heading }}>
              Rencanakan & Simpan
            </h3>
          <p className="text-sm leading-relaxed" style={{ color: colors.body }}>
              Simpan outfit ke weekly planner. Tidak perlu bingung setiap pagi mau pakai apa.
          </p>
        </div>

        </div>
      </section>
    </div>
  );
}