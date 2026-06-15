import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { colors } from '../constants';

const heroImages = [
  '/images/hero-homepage.jpg',
  '/images/all-outfit.jpg',
  '/images/all-outfit-2.jpg',
  '/images/outfit mix match.jpg',
  '/images/wardrobe.jpg',
];

export default function HomePage({ wardrobe, savedOutfits, weeklyPlan, navigateTo }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isBlurring, setIsBlurring] = useState(false);
  const [bgOpacity, setBgOpacity] = useState(1);
  const heroRef = useRef(null);

  // Auto slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlurring(true);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % heroImages.length);
        setNextIndex(prev => (prev + 1) % heroImages.length);
        setIsBlurring(false);
      }, 800);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Fade out saat scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const heroHeight = heroRef.current.offsetHeight;
      const scrollY = window.scrollY;
      const fadeStart = heroHeight * 0.3;
      const fadeEnd = heroHeight * 0.8;

      if (scrollY <= fadeStart) {
        setBgOpacity(1);
      } else if (scrollY >= fadeEnd) {
        setBgOpacity(0);
      } else {
        setBgOpacity(1 - (scrollY - fadeStart) / (fadeEnd - fadeStart));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ backgroundColor: colors.background }}>

      {/* ── Hero dengan Background Slideshow ── */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">

        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImages[currentIndex]})`,
            filter: isBlurring ? 'blur(12px)' : 'blur(0px)',
            transform: isBlurring ? 'scale(1.05)' : 'scale(1)',
            opacity: bgOpacity,
            transition: 'filter 0.8s ease, transform 0.8s ease, opacity 0.5s ease',
          }}
        />

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 100%)',
            opacity: bgOpacity,
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1
            className="text-6xl md:text-7xl font-light mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: 'white' }}
          >
            Your Wardrobe,<br />Beautifully Organized
          </h1>
          <p className="text-lg font-light mb-8 opacity-90" style={{ color: 'white', fontFamily: 'DM Sans, sans-serif' }}>
            Reconnect with the clothes you already own. Create, plan, and style with intention.
          </p>
          <button
            onClick={() => navigateTo('wardrobe')}
            className="px-8 py-3 text-sm tracking-widest font-light rounded-2xl transition-all duration-150"
            style={{ backgroundColor: colors.accent, color: 'white' }}
          >
            START STYLING!
          </button>
        </div>

        {/* Dot Indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10"
          style={{ opacity: bgOpacity, transition: 'opacity 0.5s ease' }}
        >
          {heroImages.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === currentIndex ? '24px' : '8px',
                height: '8px',
                backgroundColor: 'white',
                opacity: i === currentIndex ? 1 : 0.4,
              }}
            />
          ))}
        </div>
      </section>

      {/* ── Featured Stats ── */}
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

      {/* ── CTA Mix & Match ── */}
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

      {/* ── Features Section ── */}
      <section className="px-6 md:px-12 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="rounded-2xl p-8" style={{ backgroundColor: colors.surface }}>
              <h3 className="text-2xl font-light mb-4" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}>
                Weekly Planning
              </h3>
              <p style={{ color: colors.body, marginBottom: '20px' }}>
                Organize your outfits for the week ahead. Plan each day with intention.
              </p>
              <button onClick={() => navigateTo('planner')} className="text-sm tracking-widest font-light flex items-center gap-2 transition-colors duration-150" style={{ color: colors.accent }}>
                PLAN YOUR WEEK <ChevronRight size={16} />
              </button>
            </div>

            <div className="rounded-2xl p-8" style={{ backgroundColor: colors.surface }}>
              <h3 className="text-2xl font-light mb-4" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}>
                Styling
              </h3>
              <p style={{ color: colors.body, marginBottom: '20px' }}>
                Discover outfit combinations and get personalized style recommendations.
              </p>
              <button onClick={() => navigateTo('styling')} className="text-sm tracking-widest font-light flex items-center gap-2 transition-colors duration-150" style={{ color: colors.accent }}>
                EXPLORE STYLING <ChevronRight size={16} />
              </button>
            </div>

            <div className="rounded-2xl p-8" style={{ backgroundColor: colors.surface }}>
              <h3 className="text-2xl font-light mb-4" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}>
                Wardrobe Insights
              </h3>
              <p style={{ color: colors.body, marginBottom: '20px' }}>
                Understand your styling patterns and maximize your wardrobe potential.
              </p>
              <button onClick={() => navigateTo('analytics')} className="text-sm tracking-widest font-light flex items-center gap-2 transition-colors duration-150" style={{ color: colors.accent }}>
                VIEW INSIGHTS <ChevronRight size={16} />
              </button>
            </div>

            <div className="rounded-2xl p-8" style={{ backgroundColor: colors.surface }}>
              <h3 className="text-2xl font-light mb-4" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}>
                Wardrobe
              </h3>
              <p style={{ color: colors.body, marginBottom: '20px' }}>
                Manage and organize all your clothing items in one place.
              </p>
              <button onClick={() => navigateTo('wardrobe')} className="text-sm tracking-widest font-light flex items-center gap-2 transition-colors duration-150" style={{ color: colors.accent }}>
                VIEW WARDROBE <ChevronRight size={16} />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── Cara Pakai ── */}
      <section className="py-20 px-8" style={{ backgroundColor: colors.surface }}>
        <div className="text-center mb-16">
          <p className="text-sm tracking-widest mb-4" style={{ color: colors.accent }}>
            CARA PAKAI
          </p>
          <h2 className="text-4xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}>
            Tiga langkah mudah
            <br />
            <span className="italic">untuk tampil lebih baik</span>
          </h2>
        </div>

        <div className="flex items-center justify-center gap-4 max-w-5xl mx-auto">

          <div className="rounded-2xl p-8 flex-1" style={{ backgroundColor: colors.background }}>
            <p className="text-4xl font-light mb-6" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.accent, opacity: 0.4 }}>01</p>
            <h3 className="text-base font-semibold mb-3" style={{ color: colors.heading }}>Upload Your Fits</h3>
            <p className="text-sm leading-relaxed" style={{ color: colors.body }}>
              Snap a pic and upload your clothes. Sort 'em into the right categories.
            </p>
          </div>

          <span style={{ color: colors.accent, opacity: 0.5, fontSize: '20px' }}>→</span>

          <div className="rounded-2xl p-8 flex-1" style={{ backgroundColor: colors.background }}>
            <p className="text-4xl font-light mb-6" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.accent, opacity: 0.4 }}>02</p>
            <h3 className="text-base font-semibold mb-3" style={{ color: colors.heading }}>Mix & Match Outfit</h3>
            <p className="text-sm leading-relaxed" style={{ color: colors.body }}>
              Drag and drop your pieces onto the canvas. Visually curate your best fits.
            </p>
          </div>

          <span style={{ color: colors.accent, opacity: 0.5, fontSize: '20px' }}>→</span>

          <div className="rounded-2xl p-8 flex-1" style={{ backgroundColor: colors.background }}>
            <p className="text-4xl font-light mb-6" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.accent, opacity: 0.4 }}>03</p>
            <h3 className="text-base font-semibold mb-3" style={{ color: colors.heading }}>Plan & Slay</h3>
            <p className="text-sm leading-relaxed" style={{ color: colors.body }}>
              Save your faves to the weekly planner. Say goodbye to your "what do I wear?" morning crisis.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}