import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Calendar, Sparkles } from 'lucide-react';
import { colors } from '../constants';

const heroImages = [
  '/images/hero-1.jpg',
  '/images/hero-2.jpg',
  '/images/hero-3.jpg',
];

export default function HomePage({ wardrobe = [], savedOutfits = [], weeklyPlan = {}, navigateTo }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [bgOpacity, setBgOpacity] = useState(1);
  const [randomItems, setRandomItems] = useState([]);
  const heroRef = useRef(null);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = daysOfWeek[new Date().getDay()];
  const todayOutfit = weeklyPlan[todayName.toLowerCase()] || null;

  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % heroImages.length);
        setNextIndex(prev => (prev + 1) % heroImages.length);
        setIsTransitioning(false);
      }, 1200);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    if (wardrobe && wardrobe.length > 0) {
      const shuffled = [...wardrobe].sort(() => 0.5 - Math.random());
      setRandomItems(shuffled.slice(0, 3));
    }
  }, [wardrobe]);

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen">

      <section 
        ref={heroRef} 
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] min-h-[400px] sm:min-h-0 overflow-hidden flex items-center justify-center"
      >

        <div
          className="absolute inset-0 bg-cover bg-[center_top_15%] sm:bg-top transition-all"
          style={{
            backgroundImage: `url(${heroImages[currentIndex]})`,
            transform: isTransitioning ? 'scale(1.02)' : 'scale(1)',
            opacity: isTransitioning ? 0 : bgOpacity,
            transition: 'opacity 1.2s ease-in-out, transform 7s linear',
          }}
        />

        <div
          className="absolute inset-0 bg-cover bg-[center_top_15%] sm:bg-top -z-10"
          style={{
            backgroundImage: `url(${heroImages[nextIndex]})`,
            opacity: isTransitioning ? bgOpacity : 0,
            transition: 'opacity 1.2s ease-in-out',
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.6) 100%)',
            opacity: bgOpacity,
            transition: 'opacity 0.5s ease',
          }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-12 max-w-4xl mx-auto h-full w-full">
          <h1
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-4 sm:mb-6 leading-tight select-none"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: 'white' }}
          >
            Your Wardrobe,<br />Beautifully Organized
          </h1>
          <p 
            className="text-xs sm:text-base md:text-lg font-light mb-6 sm:mb-8 opacity-90 max-w-md sm:max-w-xl mx-auto leading-relaxed select-none" 
            style={{ color: 'white', fontFamily: 'DM Sans, sans-serif' }}
          >
            Reconnect with the clothes you already own. Create, plan, and style with intention.
          </p>
          <button
            onClick={() => navigateTo('wardrobe')}
            className="px-6 py-2.5 sm:px-8 sm:py-3.5 text-[11px] sm:text-xs md:text-sm tracking-widest font-semibold rounded-full transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-[0.98]"
            style={{ backgroundColor: colors.accent, color: 'white' }}
          >
            START STYLING
          </button>
        </div>
      </section>

      <section className="px-6 md:px-12 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-2 border-b md:border-b-0 md:border-r pb-6 md:pb-0 last:border-0" style={{ borderColor: colors.border }}>
              <div className="text-4xl font-light" style={{ color: colors.accent }}>
                {wardrobe?.length || 0}
              </div>
              <p className="text-xs tracking-widest uppercase font-semibold text-neutral-400">
                Pieces in Your Closet
              </p>
            </div>
            <div className="text-center space-y-2 border-b md:border-b-0 md:border-r pb-6 md:pb-0 last:border-0" style={{ borderColor: colors.border }}>
              <div className="text-4xl font-light" style={{ color: colors.accent }}>
                {savedOutfits?.length || 0}
              </div>
              <p className="text-xs tracking-widest uppercase font-semibold text-neutral-400">
                Outfits Saved
              </p>
            </div>
            <div className="text-center space-y-2 pb-0 last:border-0">
              <div className="text-4xl font-light" style={{ color: colors.accent }}>
                {Object.keys(weeklyPlan || {}).length}
              </div>
              <p className="text-xs tracking-widest uppercase font-semibold text-neutral-400">
                Days Planned
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-10 border-t" style={{ borderColor: colors.border }}>
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
              <div className="p-4 rounded-2xl bg-neutral-50" style={{ color: colors.accent }}>
                <Calendar size={24} />
              </div>
              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-neutral-400 block mb-0.5">
                  Today's Schedule ({todayName})
                </span>
                <h3 className="text-lg font-medium text-neutral-800">
                  {todayOutfit ? `Ready to wear: ${todayOutfit.name || 'Your Curated Look'}` : "No look scheduled for today yet."}
                </h3>
              </div>
            </div>
            <button 
              onClick={() => navigateTo('planner')}
              className="text-xs font-semibold tracking-wider uppercase border px-5 py-2.5 rounded-xl hover:bg-neutral-50 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              style={{ borderColor: colors.border, color: colors.heading }}
            >
              {todayOutfit ? 'Open Planner' : 'Schedule Now'} <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 border-t" style={{ borderColor: colors.border }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2
                className="text-4xl font-light"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}
              >
                Mix & Match
              </h2>
              <p style={{ color: colors.body, lineHeight: 1.8 }} className="text-sm font-light">
                Combine pieces from your wardrobe. Preview outfits instantly. Save your favorites for later.
              </p>
              <button
                onClick={() => navigateTo('styling')}
                className="text-xs tracking-widest font-semibold flex items-center gap-2 transition-colors duration-150 uppercase"
                style={{ color: colors.accent }}
              >
                EXPLORE STYLING <ChevronRight size={14} />
              </button>
            </div>
            <div className="h-64 md:h-80 w-full overflow-hidden rounded-3xl shadow-sm border" style={{ borderColor: colors.border }}>
              <img
                src="/images/all-outfit.jpg"
                alt="Mix and Match Preview"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-103"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-3xl p-8 border bg-white shadow-[0_4px_20px_rgba(0,0,0,0.01)] transition-transform duration-300 hover:translate-y-[-2px]" style={{ borderColor: colors.border }}>
              <h3 className="text-2xl font-light mb-3" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}>
                Weekly Planning
              </h3>
              <p style={{ color: colors.body }} className="text-sm font-light mb-5 leading-relaxed">
                Organize your outfits for the week ahead. Plan each day with intention.
              </p>
              <button onClick={() => navigateTo('planner')} className="text-xs tracking-widest font-semibold flex items-center gap-2 transition-colors duration-150 uppercase" style={{ color: colors.accent }}>
                PLAN YOUR WEEK <ChevronRight size={14} />
              </button>
            </div>

            <div className="rounded-3xl p-8 border bg-white shadow-[0_4px_20px_rgba(0,0,0,0.01)] transition-transform duration-300 hover:translate-y-[-2px]" style={{ borderColor: colors.border }}>
              <h3 className="text-2xl font-light mb-3" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}>
                Wardrobe Insights
              </h3>
              <p style={{ color: colors.body }} className="text-sm font-light mb-5 leading-relaxed">
                Understand your styling patterns and maximize your wardrobe potential.
              </p>
              <button onClick={() => navigateTo('analytics')} className="text-xs tracking-widest font-semibold flex items-center gap-2 transition-colors duration-150 uppercase" style={{ color: colors.accent }}>
                VIEW INSIGHTS <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12" style={{ backgroundColor: colors.surface }}>
        <div className="text-center mb-16 space-y-2">
          <h2 
            className="text-3xl md:text-4xl font-bold tracking-wide" 
            style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.accent }}
          >
            HOW-TO
          </h2>
          <p className="text-xs md:text-sm font-light tracking-wider text-neutral-400 uppercase">
            3 easy steps <span className="italic font-serif lowercase tracking-normal text-neutral-500">to</span> glow up your look
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto relative">
          <div className="rounded-3xl p-6 md:p-8 bg-white border border-neutral-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] flex flex-col justify-between relative group hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 min-w-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl md:text-4xl font-light opacity-35 select-none" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.accent }}>01</span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm md:text-base font-semibold tracking-tight truncate" style={{ color: colors.heading }}>Upload Your Fits</h3>
                <p className="text-xs md:text-sm font-light leading-relaxed text-neutral-400 break-words">Snap a pic and upload your clothes. Sort 'em into the right categories.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl p-6 md:p-8 bg-white border border-neutral-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] flex flex-col justify-between relative group hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 min-w-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl md:text-4xl font-light opacity-35 select-none" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.accent }}>02</span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm md:text-base font-semibold tracking-tight truncate" style={{ color: colors.heading }}>Mix & Match</h3>
                <p className="text-xs md:text-sm font-light leading-relaxed text-neutral-400 break-words">Drag and drop your pieces onto the canvas. Visually curate your best fits.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl p-6 md:p-8 bg-white border border-neutral-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] flex flex-col justify-between sm:col-span-2 md:col-span-1 hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 min-w-0">
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-3xl md:text-4xl font-light opacity-35 select-none" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.accent }}>03</span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm md:text-base font-semibold tracking-tight truncate" style={{ color: colors.heading }}>Plan & Slay</h3>
                <p className="text-xs md:text-sm font-light leading-relaxed text-neutral-400 break-words">Save your faves to the weekly planner. Say goodbye to your "what do I wear?" morning crisis.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}