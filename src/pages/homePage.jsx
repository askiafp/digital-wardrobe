import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Sun, CloudRain, Cloud, Snowflake, Calendar, Sparkles, User, Mail } from 'lucide-react';
import { colors } from '../constants';

const heroImages = [
  '/images/hero-1.jpg',
  '/images/hero-2.jpg',
  '/images/hero-3.jpg',
];

const weatherConfig = {
  Sunny: { icon: Sun, label: 'Sunny' },
  Rainy: { icon: CloudRain, label: 'Rainy' },
  Cloudy: { icon: Cloud, label: 'Cloudy' },
  Snowy: { icon: Snowflake, label: 'Snowy' },
};

function getWeatherBackgroundImage(conditionIcon, tempC) {
  if (conditionIcon === 'rain') return '/images/rain.jpg';
  if (tempC >= 30) return '/images/hot.jpg';
  if (tempC >= 25) return '/images/warm.jpg';
  return '/images/default.jpg';
}

export default function HomePage({ wardrobe = [], savedOutfits = [], weeklyPlan = {}, navigateTo, isGuest }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [bgOpacity, setBgOpacity] = useState(1);
  const [randomItems, setRandomItems] = useState([]);
  const heroRef = useRef(null);

  const [weather, setWeather] = useState({
    condition: 'Sunny',
    temp: 28,
    day: 'Today',
    time: 'Now'
  });

  const weatherInfo = weatherConfig[weather.condition] || weatherConfig.Sunny;
  const WeatherIcon = weatherInfo.icon;

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = daysOfWeek[new Date().getDay()];
  const todayOutfit = weeklyPlan[todayName.toLowerCase()] || null;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-6.2146&longitude=106.8451&current=temperature_2m,weather_code&timezone=Asia%2FJakarta'
        );
        const data = await response.json();
        if (data && data.current) {
          const code = data.current.weather_code;
          let cond = 'Sunny';
          let iconName = 'clear';

          if (code >= 1 && code <= 3) {
            cond = 'Cloudy';
            iconName = 'cloudy';
          } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || (code >= 95 && code <= 99)) {
            cond = 'Rainy';
            iconName = 'rain'; 
          } else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
            cond = 'Snowy';
            iconName = 'snow';
          } else if (code === 0) {
            cond = 'Sunny';
            iconName = 'clear';
          }

          const now = new Date();
          const currentHour = now.getHours();
          const period = currentHour >= 12 ? 'pm' : 'am';
          const displayHour = currentHour % 12 || 12;

          setWeather({
            condition: cond,
            icon: iconName,
            temp: Math.round(data.current.temperature_2m),
            day: todayName,
            time: `${displayHour} ${period}`
          });
        }
      } catch (error) {
        console.error('Failed to fetch real-time Jakarta weather data:', error);
      }
    };

    fetchWeather();
    const weatherInterval = setInterval(fetchWeather, 900000);
    return () => clearInterval(weatherInterval);
  }, [todayName]);

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
    if (wardrobe && wardrobe.length > 0 && !isGuest) {
      const shuffled = [...wardrobe].sort(() => 0.5 - Math.random());
      setRandomItems(shuffled.slice(0, 3));
    } else {
      setRandomItems([]);
    }
  }, [wardrobe, isGuest]);

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen">

      <section 
        ref={heroRef} 
        className="relative w-full aspect-[16/9] overflow-hidden flex items-center justify-center"
      >
        <div
          className="absolute inset-0 bg-cover bg-top transition-all"
          style={{
            backgroundImage: `url(${heroImages[currentIndex]})`,
            transform: isTransitioning ? 'scale(1.02)' : 'scale(1)',
            opacity: isTransitioning ? 0 : bgOpacity,
            transition: 'opacity 1.2s ease-in-out, transform 7s linear',
          }}
        />
        <div
          className="absolute inset-0 bg-cover bg-top -z-10"
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
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-12 max-w-4xl mx-auto h-full w-full">
          <h1
            className="text-[5vw] sm:text-5xl md:text-6xl font-light mb-2 sm:mb-6 leading-tight select-none"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: 'white' }}
          >
            Your Wardrobe,<br />Beautifully Organized
          </h1>
          <p 
            className="text-[2.2vw] sm:text-base md:text-lg font-light mb-3 sm:mb-8 opacity-90 max-w-[80%] sm:max-w-xl mx-auto leading-relaxed select-none" 
            style={{ color: 'white', fontFamily: 'DM Sans, sans-serif' }}
          >
            Reconnect with the clothes you already own. Create, plan, and style with intention.
          </p>
          <button
            onClick={() => navigateTo('wardrobe')}
            className="px-4 py-1.5 sm:px-8 sm:py-3.5 text-[2vw] sm:text-xs md:text-sm tracking-widest font-semibold rounded-full transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-[0.98]"
            style={{ backgroundColor: colors.accent, color: 'white' }}
          >
            START STYLING
          </button>
        </div>
      </section>

      {!isGuest ? (
        <section className="px-6 md:px-12 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-2 border-b md:border-b-0 md:border-r pb-6 md:pb-0 last:border-0" style={{ borderColor: colors.border }}>
                <div className="text-4xl font-light" style={{ color: colors.accent }}>
                  {wardrobe.length}
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
      ) : (
        <section className="px-6 md:px-12 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="rounded-3xl border p-8 md:p-10 text-center space-y-4 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.01)]" style={{ borderColor: colors.border }}>
              <Sparkles size={28} style={{ color: colors.accent }} className="mx-auto" />
              <h2
                className="text-2xl md:text-3xl font-light"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}
              >
                Welcome to Your Curation Vault
              </h2>
              <p className="text-sm font-light text-neutral-400 max-w-md mx-auto leading-relaxed">
                Start by adding pieces to your wardrobe. Your stats, outfits, and weekly plan will appear here once you do.
              </p>
              <button
                onClick={() => navigateTo('wardrobe')}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs tracking-widest font-semibold rounded-full transition-all duration-300 hover:scale-[1.03] hover:shadow-md active:scale-[0.98]"
                style={{ backgroundColor: colors.accent, color: 'white' }}
              >
                ADD YOUR FIRST PIECE <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </section>
      )}

      {!isGuest && (
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
      )}

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
            3 easy steps to glow up your look
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto relative">
          <div className="rounded-3xl p-6 md:p-8 bg-white border border-neutral-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] flex flex-col justify-between group hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 min-w-0">
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

          <div className="rounded-3xl p-6 md:p-8 bg-white border border-neutral-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] flex flex-col justify-between group hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 min-w-0">
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

      <button
        onClick={() => navigateTo('styling')}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex rounded-[28px] md:rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-white/10 bg-cover bg-center text-left transition-all duration-300 hover:scale-[1.02] active:scale-95 origin-bottom-right scale-85 sm:scale-90 md:scale-100"
        style={{ 
          backgroundImage: `url(${getWeatherBackgroundImage(weather.icon, weather.temp)})`, 
          width: '290px',
          height: '135px' 
        }}
      >
        <div className="absolute inset-0 bg-black/5" />

        <div className="w-1/2 h-full relative p-2.5">
          {(() => {
            const filteredItems = wardrobe.filter(item => {
              const nameLower = item.name?.toLowerCase() || '';
              const catLower = item.category?.toLowerCase() || '';
              const styleLower = item.style?.toLowerCase() || '';

              if (weather.condition === 'Rainy') {
                return (
                  catLower.includes('outer') || 
                  catLower.includes('pants') ||
                  nameLower.includes('hoodie') || 
                  nameLower.includes('jacket') || 
                  nameLower.includes('sweater') ||
                  styleLower.includes('comfy')
                );
              } else if (weather.condition === 'Sunny') {
                return (
                  catLower.includes('top') || 
                  catLower.includes('bottom') ||
                  nameLower.includes('t-shirt') || 
                  nameLower.includes('shirt') || 
                  nameLower.includes('short') ||
                  styleLower.includes('casual')
                );
              } else {
                return (
                  nameLower.includes('shirt') || 
                  catLower.includes('pants') || 
                  styleLower.includes('formal')
                );
              }
            });

            const topPiece = filteredItems.find(item => {
              const cat = item.category?.toLowerCase() || '';
              return cat.includes('top') || cat.includes('outer') || item.name?.toLowerCase().includes('shirt');
            }) || wardrobe.find(item => item.category?.toLowerCase().includes('top'));

            const bottomPiece = filteredItems.find(item => {
              const cat = item.category?.toLowerCase() || '';
              return cat.includes('bottom') || cat.includes('pants') || item.name?.toLowerCase().includes('short');
            }) || wardrobe.find(item => item.category?.toLowerCase().includes('bottom') || item.category?.toLowerCase().includes('pants'));

            return (
              <div className="absolute inset-0 z-10 p-3 flex flex-col justify-between">
                <div className="flex justify-start">
                  {topPiece ? (
                    <img 
                      src={topPiece.image} 
                      alt="Top" 
                      className="w-18 h-18 object-contain filter drop-shadow-[0_8px_10px_rgba(0,0,0,0.4)] transform -rotate-6 transition-transform duration-300 hover:rotate-0"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : <div className="w-1" />}
                </div>
                
                <div className="flex justify-end">
                  {bottomPiece ? (
                    <img 
                      src={bottomPiece.image} 
                      alt="Bottom" 
                      className="w-16 h-16 object-contain filter drop-shadow-[0_8px_10px_rgba(0,0,0,0.4)] transform rotate-6 transition-transform duration-300 hover:rotate-0"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : <div className="w-1" />}
                </div>

                {!topPiece && !bottomPiece && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[9px] text-white/90 font-medium tracking-widest uppercase backdrop-blur-md bg-black/30 px-2 py-0.5 rounded-md">
                      Empty Closet
                    </span>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        <div 
          className="w-1/2 h-full flex flex-col justify-between p-3.5 relative border-l border-white/10"
          style={{ 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(240,240,240,0.25) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
        >
          <div>
            <h4 className="text-xs font-semibold tracking-tight text-neutral-800 leading-none mb-0.5">
              Recommended
            </h4>
            <p className="text-[10px] text-neutral-600 font-light leading-none">
              clothes for today
            </p>
          </div>

          <p className="text-[10px] font-medium text-neutral-700/90 tracking-wide my-0.5">
            {weather.day}, {weather.time}
          </p>

          <div 
            className="flex items-center gap-2 rounded-[14px] px-2.5 py-1.5 w-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] border border-white/20"
            style={{ 
              background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.4) 100%)' 
            }}
          >
            <div className="p-1 rounded-full bg-white shadow-sm flex items-center justify-center text-neutral-700">
              <WeatherIcon size={14} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider leading-none mb-0.5">
                {weatherInfo.label}
              </p>
              <p className="text-sm font-bold text-neutral-800 leading-none tracking-tight">
                {weather.temp}°C
              </p>
            </div>
          </div>
        </div>
      </button>

    </div>
  );
}