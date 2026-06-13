import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, ArrowRight, RotateCcw, Check, EyeOff, X, Palette, Info, Cloud, Sun, CloudRain, Wind, Droplets } from 'lucide-react';
import { colors } from '../constants';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Weather helpers ──────────────────────────────────────────────────────────

const WMO_CODES = {
  0:  { label: 'Clear sky',         icon: 'sun' },
  1:  { label: 'Mainly clear',      icon: 'sun' },
  2:  { label: 'Partly cloudy',     icon: 'cloud-sun' },
  3:  { label: 'Overcast',             icon: 'cloud' },
  45: { label: 'Foggy',                icon: 'cloud' },
  48: { label: 'Icy fog',              icon: 'cloud' },
  51: { label: 'Light drizzle',        icon: 'rain' },
  53: { label: 'Drizzle',              icon: 'rain' },
  55: { label: 'Heavy drizzle',        icon: 'rain' },
  61: { label: 'Light rain',           icon: 'rain' },
  63: { label: 'Rain',                 icon: 'rain' },
  65: { label: 'Heavy rain',           icon: 'rain' },
  71: { label: 'Light snow',           icon: 'cloud' },
  80: { label: 'Light showers',        icon: 'rain' },
  81: { label: 'Showers',              icon: 'rain' },
  82: { label: 'Heavy showers',        icon: 'rain' },
  95: { label: 'Thunderstorm',         icon: 'rain' },
  96: { label: 'Thunderstorm + hail',  icon: 'rain' },
  99: { label: 'Thunderstorm + hail',  icon: 'rain' },
};

function getWeatherMeta(code) {
  return WMO_CODES[code] || { label: 'Unknown', icon: 'cloud' };
}

function getWeatherOutfitTips(weather) {
  if (!weather) return null;
  const { tempC, conditionIcon } = weather;

  if (conditionIcon === 'rain') {
    return {
      tag: 'Rainy day',
      tip: 'Layer up with a light jacket & opt for darker colors — rain splashes are less visible.',
      avoid: 'Light fabrics that go see-through when wet.',
      accent: '#5B7DB1',
      bg: 'rgba(91,125,177,0.08)',
      border: 'rgba(91,125,177,0.25)',
      textColor: '#1B2A5C',
    };
  }
  if (tempC >= 32) {
    return {
      tag: 'Very hot',
      tip: 'Wear breathable linen or cotton in light, airy tones. Loose silhouettes keep you cool.',
      avoid: 'Dark heavy fabrics that absorb heat.',
      accent: '#E8955A',
      bg: 'rgba(232,149,90,0.08)',
      border: 'rgba(232,149,90,0.25)',
      textColor: '#7A3A10',
    };
  }
  if (tempC >= 28) {
    return {
      tag: 'Warm & sunny',
      tip: "Perfect for bright colors & lightweight fits. Don't forget UV protection accessories.",
      avoid: 'Heavy layering.',
      accent: '#D4A843',
      bg: 'rgba(212,168,67,0.08)',
      border: 'rgba(212,168,67,0.25)',
      textColor: '#6B4226',
    };
  }
  if (tempC >= 23) {
    return {
      tag: 'Pleasant',
      tip: 'Great weather for almost anything! Light layers work perfectly in case it cools down.',
      avoid: null,
      accent: '#4A9C6B',
      bg: 'rgba(74,156,107,0.08)',
      border: 'rgba(74,156,107,0.25)',
      textColor: '#1B4A2C',
    };
  }
  return {
    tag: 'Cool',
    tip: 'A light jacket or blazer is a smart choice today. Layered looks are both practical & stylish.',
    avoid: null,
    accent: '#8B7DB1',
    bg: 'rgba(139,125,177,0.08)',
    border: 'rgba(139,125,177,0.25)',
    textColor: '#3B2A5C',
  };
}

function weatherScoreBoost(item, weather) {
  if (!weather) return 0;
  const { tempC, conditionIcon } = weather;
  const hex = item.color.toLowerCase();
  let boost = 0;

  if (conditionIcon === 'rain') {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    if (brightness < 100) boost += 40;
    if (item.category === 'Outerwear') boost += 60;
  }
  if (tempC >= 30) {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    if (brightness > 180) boost += 30;
    if (item.category === 'Outerwear') boost -= 40;
  }
  return boost;
}

// ─── WeatherIcon ──────────────────────────────────────────────────────────────

function WeatherIcon({ icon, size = 20, color }) {
  if (icon === 'sun')       return <Sun       size={size} color={color || '#E8955A'} />;
  if (icon === 'rain')      return <CloudRain size={size} color={color || '#5B7DB1'} />;
  if (icon === 'cloud-sun') return <Cloud     size={size} color={color || '#9E9E9E'} />;
  return                            <Cloud     size={size} color={color || '#9E9E9E'} />;
}

// ─── Weather Background Images ──────────────────────────────────────────────

function getWeatherBackgroundImage(conditionIcon, tempC) {
  if (conditionIcon === 'rain') {
    return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&q=80&fit=crop';
  }
  if (tempC >= 30) {
    return 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=1000&q=80&fit=crop';
  }
  if (tempC >= 25) {
    return 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1000&q=80&fit=crop';
  }
  return 'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=1000&q=80&fit=crop';
}

// ─── Responsive Weather Card Component ───────────────────────────────────────

function DesktopWeatherPanel({ weather, loading, error, onRetry }) {
  const tips = getWeatherOutfitTips(weather);
  const backgroundImage = weather ? getWeatherBackgroundImage(weather.conditionIcon, weather.tempC) : null;

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 border border-gray-300 shadow-sm animate-pulse min-h-[120px] sm:min-h-[135px] md:min-h-[145px]" />
    );
  }

  if (error || !weather || !tips) {
    return (
      <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 border border-dashed border-gray-200 flex items-center justify-center min-h-[120px] sm:min-h-[135px] md:min-h-[145px]">
        <button onClick={onRetry} className="flex flex-col items-center justify-center gap-1.5 text-[11px] sm:text-xs text-gray-400 hover:text-gray-600 transition-all">
          <RotateCcw size={12} className="sm:size-3.5" />
          <span>Tap to retry weather</span>
        </button>
      </div>
    );
  }

  return (
    <div 
      className="w-full rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 border shadow-lg flex flex-col justify-between min-h-[120px] sm:min-h-[135px] md:min-h-[145px] relative overflow-hidden transition-all duration-300"
      style={{ 
        backgroundImage: `linear-gradient(135deg, rgba(10,10,20,0.4) 0%, rgba(20,30,50,0.3) 100%), url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderColor: 'rgba(255,255,255,0.15)'
      }}
    >
      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none" style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.15)' }} />
      
      <div className="flex justify-between items-start gap-2 z-10 relative flex-wrap">
        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="p-1.5 sm:p-2 md:p-2.5 rounded-lg sm:rounded-2xl flex-shrink-0 backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <WeatherIcon 
              icon={weather.conditionIcon} 
              size={window.innerWidth < 640 ? 18 : window.innerWidth < 1024 ? 22 : 24} 
              color="#FFFFFF" 
            />
          </div>
          
          <div className="min-w-0 flex flex-col justify-center">
            <p className="text-lg sm:text-xl md:text-2xl font-light tracking-tight leading-tight text-white drop-shadow-sm" style={{ fontSize: 'clamp(16px, 3vw, 28px)' }}>
              {Math.round(weather.tempC)}°C
            </p>
            <p className="text-[8px] sm:text-[9px] md:text-[10px] font-light uppercase tracking-widest truncate mt-0.5 sm:mt-1 text-white/85 drop-shadow-sm" style={{ fontSize: 'clamp(7px, 1.5vw, 10px)' }}>
              {weather.condition} · Jakarta
            </p>
          </div>
        </div>
        <span 
          className="text-[6px] sm:text-[7px] md:text-[7px] font-bold tracking-[0.1em] sm:tracking-[0.15em] px-2 sm:px-3 md:px-3 py-1 sm:py-1.5 rounded-full text-gray-900 uppercase flex-shrink-0 backdrop-blur-md shadow-sm whitespace-nowrap" 
          style={{ background: 'rgba(255,255,255,0.9)', fontSize: 'clamp(6px, 1.2vw, 8px)' }}
        >
          {tips.tag}
        </span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-[8px] sm:text-[9px] md:text-[10px] pt-2 sm:pt-3 md:pt-3 border-t border-white/15 mt-2 sm:mt-3 md:mt-3 z-10 relative flex-wrap" style={{ fontSize: 'clamp(8px, 1.3vw, 10px)' }}>
        <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
          <Droplets 
            size={window.innerWidth < 640 ? 10 : window.innerWidth < 1024 ? 11 : 12} 
            color="rgba(255,255,255,0.95)" 
            strokeWidth={2.5} 
            className="flex-shrink-0"
          />
          <span className="text-white/90 drop-shadow-sm font-light truncate">
            {weather.humidity}% 
            <span className="opacity-60 text-[7px] sm:text-[8px] ml-0.5">Humidity</span>
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
          <Wind 
            size={window.innerWidth < 640 ? 10 : window.innerWidth < 1024 ? 11 : 12} 
            color="rgba(255,255,255,0.95)" 
            strokeWidth={2.5}
            className="flex-shrink-0"
          />
          <span className="text-white/90 drop-shadow-sm font-light truncate">
            {Math.round(weather.wind)} km/h 
            <span className="opacity-60 text-[7px] sm:text-[8px] ml-0.5">Wind</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function WeatherSidebarCard({ weather, weatherTips }) {
  if (!weather || !weatherTips) return null;
  return (
    <div className="mb-4">
      <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2">Today's Weather</p>
      <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: weatherTips.bg, border: `1px solid ${weatherTips.border}` }}>
        <WeatherIcon icon={weather.conditionIcon} size={24} color={weatherTips.accent} />
        <div className="flex-1 min-w-0">
          <p className="font-medium" style={{ color: weatherTips.textColor, fontSize: 13 }}>
            {Math.round(weather.tempC)}°C
          </p>
          <p style={{ color: weatherTips.accent, fontSize: 10 }}>{weather.condition}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Original constants & logic ──────────────────────────────────────────────

const UNDERTONES = [
  {
    id: 'warm',
    label: 'Warm',
    description: 'Yellow, peach & golden hues',
    swatches: ['#F5C07A', '#E8955A', '#D4824A'],
    bestColors: ['#8B5E3C','#7A5230','#6B4226','#9C6B3C','#D4A843','#4A4A4A','#BC7642'],
    avoidColors: ['#5B7DB1','#3B5998','#1B2A5C','#F2C4CE','#E8A0B0'],
    tips: 'Earth tones, warm browns, camel, gold & olive green look radiant on you. Avoid icy blues and cool-toned pinks.',
    exampleColors: ['Brown', 'Gold', 'Camel', 'Olive']
  },
  {
    id: 'cool',
    label: 'Cool',
    description: 'Pink, red & bluish hues',
    swatches: ['#C4B5D8', '#8EB0D8', '#E8A0B0'],
    bestColors: ['#5B7DB1','#3B5998','#1B2A5C','#E8A0B0','#F2C4CE','#9E9E9E','#E8E8E8','#F5F5F5','#FAFAFA','#F0EDE0'],
    avoidColors: ['#8B5E3C','#7A5230','#6B4226','#D4A843','#9C6B3C'],
    tips: 'Blues, navy, cool pinks, lavender, silver & crisp whites are your power palette. Earthy browns and warm gold can clash.',
    exampleColors: ['Navy', 'Blush Pink', 'Cool Grey', 'White']
  },
  {
    id: 'neutral',
    label: 'Neutral',
    description: 'Balanced mix of warm & cool',
    swatches: ['#D4B896', '#C4A882', '#B89870'],
    bestColors: ['#8B5E3C','#9E9E9E','#4A4A4A','#E8E8E8','#F5F5F5','#FAFAFA','#F0EDE0','#5B7DB1','#E8A0B0','#D4A843'],
    avoidColors: [],
    tips: 'Lucky you — most colors work! Stick to muted, balanced tones for effortless elegance, or use bold colors as accents.',
    exampleColors: ['Most colors', 'Muted tones', 'Classic neutrals']
  }
];

function hexDistance(hex1, hex2) {
  const toRgb = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
  const [r1,g1,b1] = toRgb(hex1);
  const [r2,g2,b2] = toRgb(hex2);
  return Math.sqrt((r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2);
}

function getItemScore(item, undertone, weather) {
  if (!undertone) return weatherScoreBoost(item, weather);
  const tone = UNDERTONES.find(t => t.id === undertone);
  if (!tone) return weatherScoreBoost(item, weather);
  const minBestDist = Math.min(...tone.bestColors.map(c => hexDistance(item.color, c)));
  let score = Math.max(0, 300 - minBestDist);
  if (tone.avoidColors.length > 0) {
    const minAvoidDist = Math.min(...tone.avoidColors.map(c => hexDistance(item.color, c)));
    if (minAvoidDist < 80) score -= 120;
  }
  return score + weatherScoreBoost(item, weather);
}

function isGoodMatch(item, undertone) {
  if (!undertone) return false;
  const tone = UNDERTONES.find(t => t.id === undertone);
  if (!tone) return false;
  if (undertone === 'neutral') return true;
  const minBestDist = Math.min(...tone.bestColors.map(c => hexDistance(item.color, c)));
  if (minBestDist >= 120) return false;
  if (tone.avoidColors.length > 0) {
    const minAvoidDist = Math.min(...tone.avoidColors.map(c => hexDistance(item.color, c)));
    if (minAvoidDist < 80) return false;
  }
  return true;
}

// ─── UndertoneSelectorModal ───────────────────────────────────────────────────

function UndertoneSelectorModal({ selectedTone, onSelect, onClose }) {
  const selected = UNDERTONES.find(t => t.id === selectedTone);
  return (
    <div className="fixed inset-0 flex items-end sm:items-center justify-center z-[9999] bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white w-full rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-gray-100 flex flex-col" style={{ maxWidth: 'min(100%, 520px)', maxHeight: '92dvh' }}>
        <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>
        <div className="overflow-y-auto flex-1 px-5 pt-4 pb-2" style={{ scrollbarWidth: 'none' }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading, fontSize: 'clamp(18px, 4vw, 24px)' }}>Skin Undertone</h2>
              <p className="text-[10px] tracking-[0.18em] uppercase text-gray-400 mt-0.5">Personalizes color recommendations</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors ml-4 flex-shrink-0" style={{ minWidth: 36, minHeight: 36 }}>
              <X size={16} className="text-gray-500" />
            </button>
          </div>
          <div className="bg-gray-50 rounded-xl px-4 py-2.5 mb-4">
            <p className="text-[10px] text-gray-500 font-light leading-relaxed" style={{ fontSize: 'clamp(10px, 1.5vw, 11px)' }}>
              <span className="font-medium text-gray-600">Tips:</span> Check the veins on your wrist — green/yellow = <span className="text-amber-600 font-medium">Warm</span>, blue/purple = <span className="text-blue-500 font-medium">Cool</span>, mix of both = <span className="text-stone-500 font-medium">Neutral</span>
            </p>
          </div>
          <div className="flex flex-col gap-2.5 mb-4">
            {UNDERTONES.map(tone => (
              <button
                key={tone.id}
                onClick={() => onSelect(tone.id)}
                className={`flex items-center gap-3 rounded-2xl border-2 transition-all text-left w-full ${selectedTone === tone.id ? 'border-amber-400 bg-amber-50/40 shadow-sm' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/60 active:bg-gray-100'}`}
                style={{ padding: 'clamp(10px, 2vw, 16px) clamp(12px, 2.5vw, 16px)', minHeight: 'clamp(56px, 10vw, 72px)' }}
              >
                <div className="flex -space-x-2 flex-shrink-0">
                  {tone.swatches.map((hex, i) => (
                    <div key={i} className="rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: hex, zIndex: tone.swatches.length - i, width: 'clamp(28px, 5vw, 36px)', height: 'clamp(28px, 5vw, 36px)' }} />
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800" style={{ fontSize: 'clamp(12px, 1.8vw, 14px)' }}>{tone.label}</p>
                  <p className="text-gray-400 font-light leading-tight" style={{ fontSize: 'clamp(9px, 1.2vw, 10px)' }}>{tone.description}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {tone.exampleColors.map(c => (
                      <span key={c} className="uppercase tracking-wide bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md" style={{ fontSize: 'clamp(7px, 1vw, 8px)' }}>{c}</span>
                    ))}
                  </div>
                </div>
                {selectedTone === tone.id ? <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.accent }}><Check size={10} className="text-white" /></div> : <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex-shrink-0" />}
              </button>
            ))}
          </div>
          {selected && (
            <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-3.5 mb-4">
              <div className="flex gap-2">
                <Info size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-900 font-light leading-relaxed" style={{ fontSize: 'clamp(10px, 1.5vw, 11px)' }}>{selected.tips}</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex-shrink-0 border-t border-gray-50" style={{ padding: 'clamp(12px, 2vw, 20px) clamp(16px, 3vw, 32px) clamp(16px, 4vw, 32px)' }}>
          <button onClick={onClose} disabled={!selectedTone} className="w-full tracking-[0.2em] font-medium text-white rounded-xl transition-all duration-300 shadow-md hover:brightness-95 active:scale-[0.98] disabled:opacity-40" style={{ backgroundColor: colors.accent, fontSize: 'clamp(10px, 1.2vw, 12px)', padding: 'clamp(12px, 2vw, 14px)', minHeight: 'clamp(44px, 6vw, 52px)' }}>
            {selectedTone ? 'APPLY PREFERENCES' : 'SELECT YOUR UNDERTONE'}
          </button>
        </div>
      </div>
    </div>
  );
}

function MatchBadge({ item, undertone }) {
  if (!undertone || !isGoodMatch(item, undertone)) return null;
  return (
    <span className="absolute top-1.5 right-1.5 bg-amber-400 text-white text-[7px] sm:text-[8px] font-semibold px-1.5 py-0.5 rounded-full leading-tight shadow-sm">
      ✦ MATCH
    </span>
  );
}

function CuratedLookPanel({ selectedOutfit, undertone, selectedUndertoneData }) {
  const order = ['Tops', 'Outerwear', 'Bottoms', 'Accessories', 'Shoes', 'Bags'];
  const sortedOutfit = [...selectedOutfit].sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));
  const hasItems = selectedOutfit.length > 0;
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full" style={{ borderColor: colors.border }}>
      <div className="px-5 pt-5 pb-3 border-b border-gray-50">
        <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-light">Your Outfit</p>
        <p className="text-base font-light mt-0.5" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}>Curated Look</p>
      </div>
      <div className="flex-1 p-3 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {!hasItems ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-300 min-h-[120px]">
            <Sparkles size={20} className="mb-2 opacity-50" />
            <p className="text-[10px] font-light">No items selected</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {sortedOutfit.map(item => {
              const isMatch = undertone && isGoodMatch(item, undertone);
              return (
                <div key={item.id} className="relative flex items-center justify-center transition-all hover:scale-105" style={{ aspectRatio: '1 / 1', padding: 8 }}>
                  {isMatch && <span className="absolute top-1 right-1 text-amber-400 text-[10px] font-bold z-10">✦</span>}
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 8px 10px rgba(0,0,0,0.2))' }} />
                </div>
              );
            })}
          </div>
        )}
      </div>
      {undertone && hasItems && (
        <div className="p-4 pt-0">
          <div className="bg-amber-50/60 rounded-xl px-3 py-2 flex items-center gap-2">
            <Sparkles size={11} className="text-amber-500 flex-shrink-0" />
            <p className="text-[9px] text-amber-800 font-light leading-snug">
              {selectedOutfit.filter(i => isGoodMatch(i, undertone)).length}/{selectedOutfit.length} matches your {selectedUndertoneData?.label} palette
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const STEPS = [
  { id: 'Tops',        label: 'Tops',        shortLabel: 'Top'  },
  { id: 'Bottoms',     label: 'Bottoms',     shortLabel: 'Bot'  },
  { id: 'Outerwear',   label: 'Outerwear',   shortLabel: 'Out'  },
  { id: 'Accessories', label: 'Accessories', shortLabel: 'Acc'  },
  { id: 'Bags',        label: 'Bags',        shortLabel: 'Bag'  },
  { id: 'Shoes',       label: 'Shoes',       shortLabel: 'Shoe' },
  { id: 'Preview',     label: 'Review',      shortLabel: 'Rev'  },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function StylingPage({ wardrobe, selectedOutfit, setSelectedOutfit, savedOutfits, setSavedOutfits, setWeeklyPlan, navigateTo }) {
  const [currentStepIdx, setCurrentStepIdx]       = useState(0);
  const [skippedCategories, setSkippedCategories] = useState({});
  const [carouselIndices, setCarouselIndices]      = useState({ Tops:0, Bottoms:0, Outerwear:0, Accessories:0, Bags:0, Shoes:0 });
  const [selectedDay, setSelectedDay]              = useState('Monday');
  const [modalConfig, setModalConfig]              = useState({ isOpen:false, type:'success', message:'' });
  
  const [undertone, setUndertone]                  = useState(() => {
    return localStorage.getItem('closetry_user_undertone') || null;
  });
  const [showUndertoneModal, setShowUndertoneModal] = useState(false);

  const [weather, setWeather]             = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError]   = useState(false);

  const fetchWeather = useCallback(async () => {
    setWeatherLoading(true);
    setWeatherError(false);
    try {
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=-6.2088&longitude=106.8456&current=temperature_2m,apparent_temperature,weathercode,relative_humidity_2m,wind_speed_10m&wind_speed_unit=kmh&temperature_unit=celsius&timezone=Asia%2FJakarta';
      const res = await fetch(url);
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      const c    = data.current;
      const meta = getWeatherMeta(c.weathercode);
      setWeather({
        tempC:         c.temperature_2m,
        feelsLike:     c.apparent_temperature,
        humidity:      c.relative_humidity_2m,
        wind:          c.wind_speed_10m,
        condition:     meta.label,
        conditionIcon: meta.icon,
        code:          c.weathercode,
      });
    } catch {
      setWeatherError(true);
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  useEffect(() => { fetchWeather(); }, [fetchWeather]);

  const handleSelectUndertone = (toneId) => {
    setUndertone(toneId);
    if (toneId) {
      localStorage.setItem('closetry_user_undertone', toneId);
    } else {
      localStorage.removeItem('closetry_user_undertone');
    }
  };

  const daysOfWeek = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const currentStep = STEPS[currentStepIdx];
  const selectedUndertoneData = UNDERTONES.find(t => t.id === undertone);

  const itemsByCategory = {
    Tops:        wardrobe.filter(i => i.category === 'Tops'),
    Bottoms:     wardrobe.filter(i => i.category === 'Bottoms'),
    Outerwear:   wardrobe.filter(i => i.category === 'Outerwear'),
    Accessories: wardrobe.filter(i => i.category === 'Accessories'),
    Bags:        wardrobe.filter(i => i.category === 'Bags'),
    Shoes:       wardrobe.filter(i => i.category === 'Shoes'),
  };

  const getSortedItems = (category) => {
    const items = itemsByCategory[category] || [];
    if (!undertone && !weather) return items;
    return [...items].sort((a,b) => getItemScore(b, undertone, weather) - getItemScore(a, undertone, weather));
  };

  const handleScrollItem = (direction) => {
    const category = currentStep.id;
    const items = getSortedItems(category);
    if (!items || items.length <= 1) return;
    if (skippedCategories[category]) setSkippedCategories({ ...skippedCategories, [category]: false });
    let newIndex = carouselIndices[category] + direction;
    if (newIndex < 0) newIndex = items.length - 1;
    if (newIndex >= items.length) newIndex = 0;
    setCarouselIndices({ ...carouselIndices, [category]: newIndex });
    setSelectedOutfit(prev => [...prev.filter(i => i.category !== category), items[newIndex]]);
  };

  const handleSelectNone = () => {
    const category = currentStep.id;
    setSkippedCategories({ ...skippedCategories, [category]: true });
    setSelectedOutfit(prev => prev.filter(i => i.category !== category));
    if (currentStepIdx < STEPS.length - 1) setCurrentStepIdx(currentStepIdx + 1);
  };

  const handleNextStep = () => {
    const category = currentStep.id;
    const items = getSortedItems(category);
    const activeIndex = carouselIndices[category];
    if (!skippedCategories[category] && items && items.length > 0) {
      setSelectedOutfit(prev => [...prev.filter(i => i.category !== category), items[activeIndex]]);
    }
    if (currentStepIdx < STEPS.length - 1) setCurrentStepIdx(currentStepIdx + 1);
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) setCurrentStepIdx(currentStepIdx - 1);
  };

  const generateAIOutfit = () => {
    const newIndices = {}, newOutfit = [], newSkips = {};
    const pickBest = (category) => {
      const items = itemsByCategory[category];
      if (!items || items.length === 0) return null;
      if (undertone || weather) {
        const scored = [...items]
          .map(item => ({ item, score: getItemScore(item, undertone, weather) }))
          .sort((a,b) => b.score - a.score);
        return scored[Math.floor(Math.random() * Math.min(3, scored.length))].item;
      }
      return items[Math.floor(Math.random() * items.length)];
    };
    ['Tops','Bottoms','Shoes'].forEach(cat => {
      const picked = pickBest(cat);
      if (picked) { newIndices[cat] = itemsByCategory[cat].indexOf(picked); newOutfit.push(picked); }
    });
    ['Outerwear','Bags','Accessories'].forEach(cat => {
      const items = itemsByCategory[cat];
      const alwaysInclude = cat === 'Outerwear' && weather?.conditionIcon === 'rain';
      if (items && items.length > 0 && (alwaysInclude || Math.random() > 0.5)) {
        const picked = pickBest(cat);
        newIndices[cat] = itemsByCategory[cat].indexOf(picked);
        newOutfit.push(picked);
      } else {
        newSkips[cat] = true;
      }
    });
    setCarouselIndices(prev => ({ ...prev, ...newIndices }));
    setSkippedCategories(newSkips);
    setSelectedOutfit(newOutfit);
    setCurrentStepIdx(STEPS.length - 1);
  };

  const saveAndScheduleOutfit = () => {
    if (!selectedOutfit || selectedOutfit.length === 0) {
      setModalConfig({ isOpen:true, type:'error', message:'Please select at least one clothing item!' });
      return;
    }
    const outfitId = Date.now();
    const newOutfitObj = { id: outfitId, items: [...selectedOutfit] };
    setSavedOutfits([...savedOutfits, newOutfitObj]);
    if (typeof setWeeklyPlan === 'function') {
      setWeeklyPlan(prevPlan => ({ ...prevPlan, [selectedDay.toLowerCase()]: newOutfitObj }));
    }
    setModalConfig({ isOpen:true, type:'success', message:`Outfit successfully saved to ${selectedDay}!` });
    setTimeout(() => {
      setModalConfig(prev => ({ ...prev, isOpen:false }));
      if (typeof navigateTo === 'function') navigateTo('planner');
      resetWizard();
    }, 1600);
  };

  const resetWizard = () => {
    setSelectedOutfit([]);
    setCurrentStepIdx(0);
    setSkippedCategories({});
    setCarouselIndices({ Tops:0, Bottoms:0, Outerwear:0, Accessories:0, Bags:0, Shoes:0 });
  };

  const RecommendationPanel = ({ category }) => {
    const items = itemsByCategory[category] || [];
    if (!undertone || items.length === 0) return null;
    const goodItems = items.filter(item => isGoodMatch(item, undertone));
    if (goodItems.length === 0) return null;
    return (
      <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-3">
        <p className="text-[9px] uppercase tracking-[0.15em] text-amber-700 font-medium mb-2 flex items-center gap-1">
          Recommended for {selectedUndertoneData?.label} undertone
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth:'none', WebkitOverflowScrolling: 'touch' }}>
          {goodItems.map(item => {
            const sorted = getSortedItems(category);
            const sortedIdx = sorted.findIndex(i => i.id === item.id);
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (sortedIdx >= 0) {
                    setCarouselIndices(prev => ({ ...prev, [category]: sortedIdx }));
                    setSelectedOutfit(prev => [...prev.filter(i => i.category !== category), item]);
                    if (skippedCategories[category]) setSkippedCategories(prev => ({ ...prev, [category]: false }));
                  }
                }}
                className="flex-shrink-0 flex flex-col items-center gap-1 bg-white rounded-xl border border-amber-200 p-2 hover:border-amber-400 active:scale-95 transition-all hover:shadow-sm"
                style={{ minWidth: 60 }}
              >
                <img src={item.image} alt={item.name} className="w-10 h-10 object-contain" />
                <p className="text-[8px] text-center text-gray-600 w-14 truncate">{item.name}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const currentItems     = getSortedItems(currentStep.id);
  const currentItem      = currentItems?.[carouselIndices[currentStep.id]];
  const currentItemIsMatch = currentItem && undertone && isGoodMatch(currentItem, undertone);
  const weatherTips     = getWeatherOutfitTips(weather);

  return (
    <div className="min-h-screen py-6 md:py-10 lg:py-14" style={{ backgroundColor: colors.background }}>
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page header ── */}
        <div className="mb-6 md:mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-1.5" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}>
            Outfit Builder
          </h1>
          <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-gray-400">
            Step-by-step styling session
          </p>
        </div>

        {/* ── TOP HEADER GRID: Symmetrical Rectangular Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8 max-w-4xl mx-auto w-full">
          
          <div className="w-full flex">
            {!undertone ? (
              <button
                onClick={() => setShowUndertoneModal(true)}
                className="w-full text-left bg-gradient-to-br from-amber-50/60 to-orange-50/20 border border-amber-200/70 rounded-3xl p-5 hover:border-amber-400 hover:shadow-md transition-all duration-300 group active:scale-[0.99] flex flex-col justify-between min-h-[145px]"
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex -space-x-2 flex-shrink-0 p-1 bg-white/80 rounded-xl border border-amber-100 shadow-sm">
                    {['#F5C07A', '#C4B5D8', '#D4B896'].map((c, i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-105" style={{ backgroundColor: c, zIndex: 3 - i }} />
                    ))}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-sm font-semibold text-amber-900 tracking-tight flex items-center gap-1.5">
                      Skin Undertone
                      <Sparkles size={13} className="text-amber-500 animate-pulse" />
                    </p>
                    <p className="text-[11px] text-amber-700/80 font-light leading-relaxed truncate xs:whitespace-normal">
                      Calibrate your personal layout configuration for optimized color results.
                    </p>
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <span className="text-[9px] tracking-widest font-bold text-white bg-amber-500 group-hover:bg-amber-600 transition-colors px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                    ANALYZE <ArrowRight size={10} />
                  </span>
                </div>
              </button>
            ) : (
              <div className="w-full bg-gradient-to-br from-stone-50/50 to-white border border-gray-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between min-h-[145px]">
                <div className="flex items-start gap-3.5">
                  <div className="flex -space-x-1.5 flex-shrink-0 p-1.5 bg-gray-50 rounded-xl border border-gray-100">
                    {selectedUndertoneData?.swatches.map((c, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c, zIndex: 3 - i }} />
                    ))}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] uppercase tracking-widest font-semibold text-gray-400">Analysis Active</p>
                    <p className="text-sm font-medium text-gray-800 leading-snug">
                      Recommendations matching your{' '}
                      <span className="font-semibold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100/50">{selectedUndertoneData?.label}</span>{' '}
                      palette.
                    </p>
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <button onClick={() => setShowUndertoneModal(true)} className="text-[9px] tracking-widest font-semibold text-gray-500 hover:text-amber-700 border border-gray-200 hover:border-amber-200 bg-white hover:bg-amber-50/30 px-3 py-1.5 rounded-xl transition-all shadow-sm active:scale-95">
                    RE-CALIBRATE
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="w-full flex">
            <DesktopWeatherPanel 
              weather={weather} 
              loading={weatherLoading} 
              error={weatherError} 
              onRetry={fetchWeather} 
            />
          </div>

        </div>

        {/* ── MAIN WORKSPACE CONTENT ── */}
        <div className="flex flex-col gap-5 max-w-4xl mx-auto w-full">
          
          <div className="flex-1 min-w-0 w-full space-y-5">
            
            <div className="relative overflow-x-auto pb-2 max-w-2xl mx-auto" style={{ scrollbarWidth: 'none' }}>
              <div className="absolute top-4 left-0 right-0 h-px bg-gray-200 z-0 min-w-[340px]" />
              <div className="flex items-start justify-between relative z-10 gap-2 min-w-[340px] px-1">
                {STEPS.map((step, idx) => (
                  <div key={step.id} className="flex flex-col items-center" style={{ flex: '1 1 0', minWidth: 0 }}>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] transition-all duration-300 border-2 bg-white flex-shrink-0"
                      style={{
                        backgroundColor: idx <= currentStepIdx ? colors.accent : 'white',
                        borderColor:     idx <= currentStepIdx ? colors.accent : '#E5E7EB',
                        color:           idx <= currentStepIdx ? 'white' : '#9CA3AF',
                      }}
                    >
                      {idx < currentStepIdx ? <Check size={11} /> : idx + 1}
                    </div>
                    <span className={`text-center mt-1.5 font-light leading-tight transition-colors ${idx === currentStepIdx ? 'text-gray-800 font-medium' : 'text-gray-400'}`} style={{ fontSize: 8 }}>
                      <span className="sm:hidden">{step.shortLabel}</span>
                      <span className="hidden sm:inline text-[9px] tracking-wide uppercase">{step.label}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {currentStepIdx === 0 && selectedOutfit.length === 0 && (
              <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-4 text-center space-y-2.5 max-w-xl mx-auto">
                <div className="flex justify-center text-amber-500"><Sparkles size={16} /></div>
                <p className="text-xs font-light text-amber-900 leading-relaxed">
                  {undertone 
                    ? `Struggling to style today? AI can pick a color palette matching your ${selectedUndertoneData?.label} tone!`
                    : `It's ${Math.round(weather?.tempC || 28)}°C in Jakarta — let AI generate your outfit configuration!`}
                </p>
                <button onClick={generateAIOutfit} className="px-5 py-2.5 text-xs text-white rounded-xl font-medium transition-all shadow-sm flex items-center justify-center gap-1.5 mx-auto active:scale-95 hover:brightness-95" style={{ backgroundColor: colors.accent }}>
                  <Sparkles size={12} /> AUTO GENERATE OUTFIT
                </button>
              </div>
            )}

            {currentStep.id !== 'Preview' ? (
              <div className="flex flex-col md:flex-row gap-4 items-stretch justify-center w-full">
                <div className="bg-white rounded-3xl border shadow-sm flex-1 overflow-hidden flex flex-col justify-between" style={{ borderColor: colors.border }}>
                  <div>
                    <div className="flex items-center justify-between px-5 pt-5 pb-2 gap-3">
                      <span className="text-[10px] tracking-wider uppercase px-2.5 py-1 bg-gray-100 rounded-full text-gray-500">
                        {currentStepIdx + 1}/{STEPS.length - 1} · {currentStep.label}
                      </span>
                      <button
                        onClick={handleSelectNone}
                        className={`text-xs px-3 py-1.5 rounded-xl border border-dashed flex items-center gap-1.5 transition-all ${skippedCategories[currentStep.id] ? 'bg-red-50 text-red-500 border-red-200' : 'bg-white text-gray-400'}`}
                      >
                        <EyeOff size={11} />
                        <span>{skippedCategories[currentStep.id] ? 'NONE ACTIVE' : 'SKIP / NONE'}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-4 px-4 py-6 max-w-sm mx-auto">
                      <button onClick={() => handleScrollItem(-1)} disabled={skippedCategories[currentStep.id] || !currentItems || currentItems.length <= 1} className="p-2 rounded-full border bg-white shadow-sm disabled:opacity-20 active:scale-90 transition-all">
                        <ChevronLeft size={18} style={{ color: colors.heading }} />
                      </button>

                      <div className={`relative flex-1 rounded-2xl flex flex-col items-center justify-center p-4 border border-dashed transition-all aspect-square ${skippedCategories[currentStep.id] ? 'bg-red-50/30 border-red-200' : currentItemIsMatch ? 'bg-amber-50/40 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
                        {skippedCategories[currentStep.id] ? (
                          <div className="text-red-400 text-center"><p className="text-xs font-medium">OMITTED</p></div>
                        ) : currentItem ? (
                          <>
                            {undertone && <MatchBadge item={currentItem} undertone={undertone} />}
                            <img src={currentItem.image} alt={currentItem.name} className="object-contain mb-2 w-[60%] h-[60%]" />
                            <p className="text-xs text-center font-light text-gray-700 w-full truncate">{currentItem.name}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <div className="w-2 rounded-full h-2 border" style={{ backgroundColor: currentItem.color }} />
                              <span className="text-[9px] text-gray-400">{currentItem.color}</span>
                            </div>
                          </>
                        ) : (
                          <div className="text-gray-400 text-center"><p className="text-xs">No items available</p></div>
                        )}
                      </div>

                      <button onClick={() => handleScrollItem(1)} disabled={skippedCategories[currentStep.id] || !currentItems || currentItems.length <= 1} className="p-2 rounded-full border bg-white shadow-sm disabled:opacity-20 active:scale-90 transition-all">
                        <ChevronRight size={18} style={{ color: colors.heading }} />
                      </button>
                    </div>

                    {undertone && !skippedCategories[currentStep.id] && (
                      <div className="px-5 pb-5"><RecommendationPanel category={currentStep.id} /></div>
                    )}
                  </div>

                  <div className="flex gap-3 px-5 py-4 border-t" style={{ borderColor: colors.border }}>
                    <button onClick={handlePrevStep} disabled={currentStepIdx === 0} className="flex-1 py-2.5 text-xs text-black border rounded-xl flex items-center justify-center gap-1 hover:bg-gray-50 disabled:opacity-30">
                      <ChevronLeft size={14} /> BACK
                    </button>
                    <button onClick={handleNextStep} className="flex-1 py-2.5 text-xs text-white rounded-xl flex items-center justify-center gap-1 shadow-sm active:scale-95" style={{ backgroundColor: colors.accent }}>
                      NEXT <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="w-full md:w-64 flex-shrink-0">
                  <CuratedLookPanel selectedOutfit={selectedOutfit} undertone={undertone} selectedUndertoneData={selectedUndertoneData} />
                </div>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <div className="bg-white rounded-3xl p-5 border shadow-sm w-[380px]" style={{ borderColor: colors.border }}>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-6 text-center">Lookbook Preview</p>
                  
                  <div className="relative w-full h-[580px] flex items-center justify-center overflow-hidden bg-gray-50/50 rounded-2xl">
                    {selectedOutfit.length > 0 ? (
                      <div className="relative w-full h-full">                        
                        {selectedOutfit.filter(i => i.category === 'Tops').map(item => (
                          <div key={item.id} className="absolute top-8 right-8 w-full h-64 flex items-center justify-center -translate-x-14 z-10 scale-100">
                            <img src={item.image} alt={item.name} className="h-full w-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)]" />
                          </div>
                        ))}                        
                        {selectedOutfit.filter(i => i.category === 'Bottoms').map(item => (
                          <div key={item.id} className="absolute top-40 left-0 w-full h-[400px] flex items-center justify-center -translate-x-14 z-20 scale-135">
                            <img src={item.image} alt={item.name} className="h-full w-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)]" />
                          </div>
                        ))}
                        {selectedOutfit.filter(i => i.category === 'Shoes').map(item => (
                          <div key={item.id} className="absolute bottom-6 right-10 w-full h-28 flex items-center justify-center -translate-x-14 z-30 scale-80">
                            <img src={item.image} alt={item.name} className="h-full w-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.1)]" />
                          </div>
                        ))}

                        {selectedOutfit.filter(i => i.category === 'Outerwear').map(item => (
                          <div key={item.id} className="absolute top-10 right-1 w-full h-64 flex items-center justify-center translate-x-16 z-10 scale-100">
                            <img src={item.image} alt={item.name} className="h-full w-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)]" />
                          </div>
                        ))}
                        {selectedOutfit.filter(i => i.category === 'Accessories').map(item => (
                          <div key={item.id} className="absolute top-72 left-0 w-full h-20 flex items-center justify-center translate-x-16 z-20 scale-80">
                            <img src={item.image} alt={item.name} className="h-full w-full object-contain drop-shadow-[0_8px_8px_rgba(0,0,0,0.1)]" />
                          </div>
                        ))}
                        {selectedOutfit.filter(i => i.category === 'Bags').map(item => (
                          <div key={item.id} className="absolute bottom-10 left-0 w-full h-48 flex items-center justify-center translate-x-16 z-20 scale-80">
                            <img src={item.image} alt={item.name} className="h-full w-full object-contain drop-shadow-[0_12px_12px_rgba(0,0,0,0.15)]" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-300 italic text-sm">Canvas is empty...</div>
                    )}
                  </div>

                  <div className="space-y-4 pt-6 border-t border-gray-100 mt-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-[10px] tracking-wider uppercase text-gray-400">Add to Planner</p>
                      <Select value={selectedDay} onValueChange={setSelectedDay}>
                        <SelectTrigger className="w-full bg-gray-50 rounded-xl border text-black focus:ring-1 focus:ring-amber-200" style={{ borderColor: colors.border, height: 44 }}>
                          <SelectValue placeholder="Select a day" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border rounded-xl shadow-lg">
                          {daysOfWeek.map(day => <SelectItem key={day} value={day} className="cursor-pointer text-sm font-light">{day}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={saveAndScheduleOutfit} className="flex-[2] text-xs font-medium text-white rounded-xl py-3 tracking-widest transition-all active:scale-[0.98]" style={{ backgroundColor: colors.accent }}>
                        SAVE & SCHEDULE
                      </button>
                      <button onClick={handlePrevStep} className="flex-1 border rounded-xl py-3 text-gray-600 hover:bg-gray-50 flex items-center justify-center">
                        <ChevronLeft size={16} />
                      </button>
                      <button onClick={resetWizard} className="flex-1 border rounded-xl py-3 text-red-400 hover:bg-red-50 flex items-center justify-center">
                        <RotateCcw size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modals Containers ── */}
      {showUndertoneModal && (
        <UndertoneSelectorModal 
          selectedTone={undertone} 
          onSelect={handleSelectUndertone} 
          onClose={() => setShowUndertoneModal(false)} 
        />
      )}

      {modalConfig.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl text-center w-full max-w-xs border border-gray-100 relative p-6">
            {modalConfig.type === 'error' && (
              <button onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))} className="absolute top-4 right-4 text-gray-400 p-1 hover:bg-gray-50 rounded-full">
                <X size={16} />
              </button>
            )}
            <div className="text-4xl mb-3">{modalConfig.type === 'success' ? '✨' : '⚠️'}</div>
            <h3 className={`text-base font-medium mb-1 ${modalConfig.type === 'success' ? 'text-gray-900' : 'text-red-500'}`}>
              {modalConfig.type === 'success' ? 'Outfit Scheduled!' : 'Action Required'}
            </h3>
            <p className="text-gray-500 text-xs tracking-wide font-light leading-relaxed">{modalConfig.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}