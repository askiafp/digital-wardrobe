import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, ArrowRight, RotateCcw, Check, EyeOff, X, Palette, Info } from 'lucide-react';
import { colors } from '../constants';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

function getItemScore(item, undertone) {
  if (!undertone) return 0;
  const tone = UNDERTONES.find(t => t.id === undertone);
  if (!tone) return 0;
  const minBestDist = Math.min(...tone.bestColors.map(c => hexDistance(item.color, c)));
  let score = Math.max(0, 300 - minBestDist);
  if (tone.avoidColors.length > 0) {
    const minAvoidDist = Math.min(...tone.avoidColors.map(c => hexDistance(item.color, c)));
    if (minAvoidDist < 80) score -= 120;
  }
  return score;
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

function UndertoneSelectorModal({ selectedTone, onSelect, onClose }) {
  const selected = UNDERTONES.find(t => t.id === selectedTone);
  return (
    <div className="fixed inset-0 flex items-end sm:items-center justify-center z-[9999] bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div
        className="bg-white w-full rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-gray-100 flex flex-col"
        style={{ maxWidth: 'min(100%, 520px)', maxHeight: '92dvh' }}
      >
        {/* drag handle mobile */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 pt-4 pb-2" style={{ scrollbarWidth: 'none' }}>

          {/* header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2
                className="font-light"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading, fontSize: 'clamp(18px, 4vw, 24px)' }}
              >
                Skin Undertone
              </h2>
              <p className="text-[10px] tracking-[0.18em] uppercase text-gray-400 mt-0.5">
                Personalizes color recommendations
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors ml-4 flex-shrink-0"
              style={{ minWidth: 36, minHeight: 36 }}
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>

          {/* tips */}
          <div className="bg-gray-50 rounded-xl px-4 py-2.5 mb-4">
            <p className="text-[10px] text-gray-500 font-light leading-relaxed" style={{ fontSize: 'clamp(10px, 1.5vw, 11px)' }}>
              <span className="font-medium text-gray-600">Tips:</span> Check the veins on your wrist —{' '}
              green/yellow = <span className="text-amber-600 font-medium">Warm</span>,{' '}
              blue/purple = <span className="text-blue-500 font-medium">Cool</span>,{' '}
              mix of both = <span className="text-stone-500 font-medium">Neutral</span>
            </p>
          </div>

          {/* undertone options */}
          <div className="flex flex-col gap-2.5 mb-4">
            {UNDERTONES.map(tone => (
              <button
                key={tone.id}
                onClick={() => onSelect(tone.id)}
                className={`flex items-center gap-3 rounded-2xl border-2 transition-all text-left w-full ${
                  selectedTone === tone.id
                    ? 'border-amber-400 bg-amber-50/40 shadow-sm'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/60 active:bg-gray-100'
                }`}
                style={{ padding: 'clamp(10px, 2vw, 16px) clamp(12px, 2.5vw, 16px)', minHeight: 'clamp(56px, 10vw, 72px)' }}
              >
                {/* swatches */}
                <div className="flex -space-x-2 flex-shrink-0">
                  {tone.swatches.map((hex, i) => (
                    <div
                      key={i}
                      className="rounded-full border-2 border-white shadow-sm"
                      style={{
                        backgroundColor: hex,
                        zIndex: tone.swatches.length - i,
                        width: 'clamp(28px, 5vw, 36px)',
                        height: 'clamp(28px, 5vw, 36px)',
                      }}
                    />
                  ))}
                </div>

                {/* label + desc */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800" style={{ fontSize: 'clamp(12px, 1.8vw, 14px)' }}>
                    {tone.label}
                  </p>
                  <p className="text-gray-400 font-light leading-tight" style={{ fontSize: 'clamp(9px, 1.2vw, 10px)' }}>
                    {tone.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {tone.exampleColors.map(c => (
                      <span key={c} className="uppercase tracking-wide bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md" style={{ fontSize: 'clamp(7px, 1vw, 8px)' }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* checkmark */}
                {selectedTone === tone.id
                  ? <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.accent }}>
                      <Check size={10} className="text-white" />
                    </div>
                  : <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex-shrink-0" />
                }
              </button>
            ))}
          </div>

          {/* selected tips */}
          {selected && (
            <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-3.5 mb-4">
              <div className="flex gap-2">
                <Info size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-900 font-light leading-relaxed" style={{ fontSize: 'clamp(10px, 1.5vw, 11px)' }}>
                  {selected.tips}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* footer CTA */}
        <div
          className="flex-shrink-0 border-t border-gray-50"
          style={{ padding: 'clamp(12px, 2vw, 20px) clamp(16px, 3vw, 32px) clamp(16px, 4vw, 32px)' }}
        >
          <button
            onClick={onClose}
            disabled={!selectedTone}
            className="w-full tracking-[0.2em] font-medium text-white rounded-xl transition-all duration-300 shadow-md hover:brightness-95 active:scale-[0.98] disabled:opacity-40"
            style={{
              backgroundColor: colors.accent,
              fontSize: 'clamp(10px, 1.2vw, 12px)',
              padding: 'clamp(12px, 2vw, 14px)',
              minHeight: 'clamp(44px, 6vw, 52px)',
            }}
          >
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
  
  const sortedOutfit = [...selectedOutfit].sort((a, b) => 
    order.indexOf(a.category) - order.indexOf(b.category)
  );

  const hasItems = selectedOutfit.length > 0;

  return (
    <div
      className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full"
      style={{ borderColor: colors.border }}
    >
      <div className="px-5 pt-5 pb-3 border-b border-gray-50">
        <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-light">Your Outfit</p>
        <p className="text-base font-light mt-0.5" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}>
          Curated Look
        </p>
      </div>

      <div className="flex-1 p-3 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {!hasItems ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-300">
            <Sparkles size={20} className="mb-2 opacity-50" />
            <p className="text-[10px] font-light">No items selected</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {sortedOutfit.map(item => {
              const isMatch = undertone && isGoodMatch(item, undertone);
              return (
                <div
                  key={item.id}
                  className="relative flex items-center justify-center transition-all hover:scale-105"
                  style={{
                    aspectRatio: '1 / 1',  
                    padding: 8,
                  }}
                >
                  {isMatch && (
                    <span className="absolute top-1 right-1 text-amber-400 text-[10px] font-bold z-10">✦</span>
                  )}
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 8px 10px rgba(0,0,0,0.2))',
                    }}
                  />
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

export default function StylingPage({
  wardrobe,
  selectedOutfit,
  setSelectedOutfit,
  savedOutfits,
  setSavedOutfits,
  setWeeklyPlan,
  navigateTo
}) {
  const [currentStepIdx, setCurrentStepIdx]   = useState(0);
  const [skippedCategories, setSkippedCategories] = useState({});
  const [carouselIndices, setCarouselIndices]  = useState({
    Tops:0, Bottoms:0, Outerwear:0, Accessories:0, Bags:0, Shoes:0
  });
  const [selectedDay, setSelectedDay]          = useState('Monday');
  const [modalConfig, setModalConfig]          = useState({ isOpen:false, type:'success', message:'' });
  const [undertone, setUndertone]              = useState(null);
  const [showUndertoneModal, setShowUndertoneModal] = useState(false);

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
    if (!undertone) return items;
    return [...items].sort((a,b) => getItemScore(b, undertone) - getItemScore(a, undertone));
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
      if (undertone) {
        const scored = [...items].map(item => ({ item, score: getItemScore(item, undertone) })).sort((a,b) => b.score - a.score);
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
      if (items && items.length > 0 && Math.random() > 0.5) {
        const picked = pickBest(cat);
        newIndices[cat] = itemsByCategory[cat].indexOf(picked);
        newOutfit.push(picked);
      } else { newSkips[cat] = true; }
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
          <Sparkles size={10} /> Recommended for {selectedUndertoneData?.label} undertone
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

  const currentItems = getSortedItems(currentStep.id);
  const currentItem = currentItems?.[carouselIndices[currentStep.id]];
  const currentItemIsMatch = currentItem && undertone && isGoodMatch(currentItem, undertone);

  return (
    <div className="min-h-screen py-6 md:py-10 lg:py-14" style={{ backgroundColor: colors.background }}>
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-5 md:mb-8 text-center">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-light mb-1.5"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}
          >
            Outfit Builder
          </h1>
          <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-gray-400">
            Step-by-step styling session
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-5">
          {!undertone ? (
            <button
              onClick={() => setShowUndertoneModal(true)}
              className="w-full flex items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-3.5 sm:p-4 hover:border-amber-300 transition-all group active:scale-[0.99]"
              style={{ minHeight: 56 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-1.5 flex-shrink-0">
                  {['#F5C07A','#C4B5D8','#D4B896'].map((c,i) => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor:c, zIndex:3-i }} />
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-amber-900">Set your skin undertone</p>
                  <p className="text-[10px] text-amber-600 font-light">Warm · Cool · Neutral — get matched recommendations</p>
                </div>
              </div>
              <span className="text-[10px] tracking-wider font-medium text-amber-600 group-hover:text-amber-800 transition-colors flex-shrink-0 ml-1">
                SET →
              </span>
            </button>
          ) : (
            <div className="flex items-center justify-between bg-amber-50/70 border border-amber-100 rounded-2xl p-3 px-4">
              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-1.5 flex-shrink-0">
                  {selectedUndertoneData?.swatches.map((c,i) => (
                    <div key={i} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor:c, zIndex:3-i }} />
                  ))}
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-medium text-amber-900">
                    <span className="font-semibold">{selectedUndertoneData?.label}</span> undertone active
                  </p>
                  <p className="text-[9px] text-amber-600 font-light hidden sm:block">Dw, these color recs are literally made for u</p>
                </div>
              </div>
              <button onClick={() => setShowUndertoneModal(true)} className="text-[10px] tracking-wider text-amber-600 hover:text-amber-800 font-medium transition-colors px-2 py-1">
                CHANGE
              </button>
            </div>
          )}
        </div>

        <div className="relative mb-8 md:mb-10 max-w-2xl mx-auto overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0" style={{ scrollbarWidth: 'none' }}>
          <div className="absolute top-4 sm:top-[18px] left-0 right-0 h-px bg-gray-200 z-0 min-w-[340px]" />
          <div className="flex items-start justify-between relative z-10 gap-2 sm:gap-0 min-w-[340px] px-1">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex flex-col items-center" style={{ flex: '1 1 0', minWidth: 0 }}>
                <div
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[10px] sm:text-xs transition-all duration-300 border-2 bg-white flex-shrink-0"
                  style={{
                    backgroundColor: idx <= currentStepIdx ? colors.accent : 'white',
                    borderColor: idx <= currentStepIdx ? colors.accent : '#E5E7EB',
                    color: idx <= currentStepIdx ? 'white' : '#9CA3AF',
                  }}
                >
                  {idx < currentStepIdx ? <Check size={13} /> : idx + 1}
                </div>
                <span className={`text-center mt-1.5 font-light leading-tight transition-colors ${idx === currentStepIdx ? 'text-gray-800 font-medium' : 'text-gray-400'}`} style={{ fontSize: 8 }}>
                  <span className="sm:hidden">{step.shortLabel}</span>
                  <span className="hidden sm:inline text-[9px] md:text-[10px] tracking-wide uppercase">{step.label}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {currentStepIdx === 0 && selectedOutfit.length === 0 && (
          <div className="mb-5 bg-amber-50/50 border border-amber-100 rounded-2xl p-4 sm:p-6 text-center space-y-3 max-w-xl mx-auto">
            <div className="flex justify-center text-amber-500"><Sparkles size={22} /></div>
            <p className="text-xs sm:text-sm font-light text-amber-900 leading-relaxed">
              {undertone
                ? `Struggling to mix & match today? Lowkey don't worry, AI gotchu with an outfit color palette that perfectly fits your ${selectedUndertoneData?.label} undertone!`
                : "Idk what to wear today?"
              }
            </p>
            <button
              onClick={generateAIOutfit}
              className="w-full sm:w-auto px-6 py-3 text-xs tracking-wider text-white rounded-xl font-medium transition-all duration-300 shadow-md hover:brightness-95 active:scale-[0.98] inline-flex items-center justify-center gap-2"
              style={{ backgroundColor: colors.accent, minHeight: 44 }}
            >
              <Sparkles size={13} />
              {undertone ? 'AUTO GENERATE (COLOR-MATCHED)' : 'AUTO GENERATE OUTFIT (AI)'}
            </button>
          </div>
        )}

        {currentStep.id !== 'Preview' ? (
          <div className="flex flex-col md:flex-row gap-4 lg:gap-6 items-stretch justify-center max-w-4xl mx-auto w-full">
            <div
              className="bg-white rounded-2xl sm:rounded-3xl border shadow-sm w-full md:flex-1 overflow-hidden flex flex-col justify-between"
              style={{ borderColor: colors.border }}
            >
              <div>
                <div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-6 pb-3 gap-3">
                  <span className="text-[9px] sm:text-[10px] tracking-[0.18em] uppercase px-2.5 py-1 bg-gray-100 rounded-full text-gray-500 flex-shrink-0">
                    {currentStepIdx + 1}/{STEPS.length - 1} · {currentStep.label}
                  </span>
                  <button
                    onClick={handleSelectNone}
                    className={`text-xs px-3 py-2 rounded-xl border border-dashed flex items-center gap-1.5 transition-all flex-shrink-0 ${
                      skippedCategories[currentStep.id]
                        ? 'bg-red-50 text-red-500 border-red-200 font-medium'
                        : 'bg-white text-gray-400 hover:text-gray-600 hover:border-gray-300'
                    }`}
                    style={{ minHeight: 36 }}
                  >
                    <EyeOff size={11} />
                    <span className="hidden xs:inline">{skippedCategories[currentStep.id] ? 'NONE ACTIVE' : 'SKIP / NONE'}</span>
                    <span className="xs:hidden">{skippedCategories[currentStep.id] ? 'NONE' : 'SKIP'}</span>
                  </button>
                </div>

                {undertone && currentItem && (
                  <div className={`flex items-center justify-center gap-1.5 text-[10px] font-light pb-2 ${currentItemIsMatch ? 'text-amber-600' : 'text-gray-400'}`}>
                    <div className="w-2.5 h-2.5 rounded-full border border-gray-200 flex-shrink-0" style={{ backgroundColor: currentItem.color }} />
                    {currentItemIsMatch
                      ? <span>Fits your {selectedUndertoneData?.label} undertone perfectly</span>
                      : <span>Swipe to find a better match</span>
                    }
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 sm:gap-6 px-3 sm:px-6 pb-4 w-full max-w-sm mx-auto">
                  <button
                    onClick={() => handleScrollItem(-1)}
                    disabled={skippedCategories[currentStep.id] || !currentItems || currentItems.length <= 1}
                    className="p-2.5 sm:p-3 rounded-full border bg-white shadow-sm hover:bg-gray-50 active:scale-90 disabled:opacity-10 transition-all flex-shrink-0"
                    style={{ minWidth: 44, minHeight: 44 }}
                  >
                    <ChevronLeft size={20} style={{ color: colors.heading }} />
                  </button>

                  <div
                    className={`relative flex-1 rounded-2xl flex flex-col items-center justify-center p-4 border border-dashed transition-all w-full ${
                      skippedCategories[currentStep.id]
                        ? 'bg-red-50/30 border-red-200'
                        : currentItemIsMatch
                          ? 'bg-amber-50/40 border-amber-200'
                          : 'bg-gray-50 border-gray-200'
                    }`}
                    style={{ aspectRatio: '1 / 1' }}
                  >
                    {skippedCategories[currentStep.id] ? (
                      <div className="text-red-400 text-center space-y-1">
                        <p className="text-xs font-medium">NONE</p>
                        <p className="text-[10px] italic">Omitted</p>
                      </div>
                    ) : currentItem ? (
                      <>
                        {undertone && <MatchBadge item={currentItem} undertone={undertone} />}
                        <img src={currentItem.image} alt={currentItem.name} className="object-contain mb-2 w-[55%] h-[55%] sm:w-[60%] sm:h-[60%]" />
                        <p className="text-[11px] sm:text-xs font-light text-center text-gray-700 w-full truncate px-1">{currentItem.name}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="w-2.5 h-2.5 rounded-full border border-gray-300" style={{ backgroundColor: currentItem.color }} />
                          <span className="text-[9px] text-gray-400">{currentItem.color.toUpperCase()}</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-400 text-center space-y-1">
                        <p className="text-xs">No items</p>
                        <p className="text-[10px] italic">(Skippable)</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleScrollItem(1)}
                    disabled={skippedCategories[currentStep.id] || !currentItems || currentItems.length <= 1}
                    className="p-2.5 sm:p-3 rounded-full border bg-white shadow-sm hover:bg-gray-50 active:scale-90 disabled:opacity-10 transition-all flex-shrink-0"
                    style={{ minWidth: 44, minHeight: 44 }}
                  >
                    <ChevronRight size={20} style={{ color: colors.heading }} />
                  </button>
                </div>

                {undertone && !skippedCategories[currentStep.id] && (
                  <div className="px-4 sm:px-6 pb-4">
                    <RecommendationPanel category={currentStep.id} />
                  </div>
                )}
              </div>

              <div className="flex gap-3 px-4 sm:px-6 py-4 sm:py-5 border-t mt-auto" style={{ borderColor: colors.border }}>
                <button
                  onClick={handlePrevStep}
                  disabled={currentStepIdx === 0}
                  className="flex-1 py-3 text-xs tracking-wider border rounded-xl flex items-center justify-center gap-1 hover:bg-gray-50 disabled:opacity-30 transition-all"
                  style={{ color: colors.heading, borderColor: colors.border, minHeight: 44 }}
                >
                  <ChevronLeft size={14} /> BACK
                </button>
                <button
                  onClick={handleNextStep}
                  className="flex-1 py-3 text-xs tracking-wider text-white rounded-xl flex items-center justify-center gap-1 transition-all duration-300 shadow-[0_3px_0_rgba(0,0,0,0.12)] hover:translate-y-[2px] hover:shadow-none active:scale-[0.98]"
                  style={{ backgroundColor: colors.accent, minHeight: 44 }}
                >
                  NEXT <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
              <CuratedLookPanel
                selectedOutfit={selectedOutfit}
                undertone={undertone}
                selectedUndertoneData={selectedUndertoneData}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-5 lg:gap-8 items-start">
            <div
              className="w-full lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border space-y-4 shadow-sm"
              style={{ borderColor: colors.border }}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-xs tracking-[0.2em] uppercase text-gray-400">Lookbook Preview</p>
                {undertone && selectedOutfit.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <div className="flex -space-x-1">
                      {selectedUndertoneData?.swatches.slice(0,2).map((c,i) => (
                        <div key={i} className="w-4 h-4 rounded-full border border-white" style={{ backgroundColor:c }} />
                      ))}
                    </div>
                    <span className="text-[9px] text-amber-600 tracking-wide">{selectedUndertoneData?.label} palette</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl min-h-[160px]">
                {selectedOutfit.length > 0 ? (
                  selectedOutfit.map(item => {
                    const isMatch = undertone && isGoodMatch(item, undertone);
                    return (
                      <div key={item.id} className={`relative bg-white rounded-xl border flex flex-col items-center p-2.5 sm:p-3 shadow-sm transition-transform hover:scale-[1.02] ${isMatch ? 'border-amber-200' : 'border-gray-100'}`}>
                        {isMatch && <span className="absolute top-1 right-1 text-amber-400 text-[8px] font-bold">✦</span>}
                        <img src={item.image} alt={item.name} className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain mb-1.5" />
                        <span className="text-[7px] sm:text-[8px] uppercase px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-md mb-1 font-light">{item.category}</span>
                        <p className="text-[9px] sm:text-[10px] text-gray-700 text-center font-light truncate w-full px-0.5">{item.name}</p>
                        <div className="w-2.5 h-2.5 rounded-full border border-gray-200 mt-1 flex-shrink-0" style={{ backgroundColor: item.color }} />
                      </div>
                    );
                  })
                ) : (
                  <p className="col-span-full text-xs text-gray-400 text-center py-10 my-auto">No pieces selected.</p>
                )}
              </div>

              {undertone && selectedOutfit.length > 0 && (
                <div className="flex items-center gap-2 bg-amber-50/60 rounded-xl px-4 py-2.5">
                  <Sparkles size={13} className="text-amber-500 flex-shrink-0" />
                  <p className="text-[10px] text-amber-800 font-light">
                    {selectedOutfit.filter(i => isGoodMatch(i, undertone)).length}/{selectedOutfit.length} items are a certified match for your {selectedUndertoneData?.label} undertone
                  </p>
                </div>
              )}
            </div>

            <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border shadow-sm" style={{ borderColor: colors.border }}>
              <div className="mb-5">
                <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2">Skin Undertone</p>
                <button
                  onClick={() => setShowUndertoneModal(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border hover:border-amber-300 hover:bg-amber-50/30 active:bg-amber-50 transition-all"
                  style={{ borderColor: colors.border, minHeight: 52 }}
                >
                  <div className="flex -space-x-1.5 flex-shrink-0">
                    {undertone
                      ? selectedUndertoneData?.swatches.map((c,i) => (
                          <div key={i} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor:c, zIndex:3-i }} />
                        ))
                      : <div className="w-6 h-6 rounded-full bg-gray-200" />
                    }
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700">{undertone ? `${selectedUndertoneData?.label} Undertone` : 'Not set yet'}</p>
                    <p className="text-[9px] text-gray-400">{undertone ? 'Tap to change' : 'Tap to personalize'}</p>
                  </div>
                  <Palette size={14} className="text-gray-400 flex-shrink-0" />
                </button>
              </div>

              <div className="mb-5">
                <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2">Add to Planner</p>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger
                    className="w-full bg-gray-50 rounded-xl border font-light text-gray-700 text-sm focus:ring-1 focus:ring-amber-200"
                    style={{ borderColor: colors.border, height: 48 }}
                  >
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border rounded-xl shadow-lg">
                    {daysOfWeek.map(day => (
                      <SelectItem key={day} value={day} className="cursor-pointer text-sm font-light py-2.5">{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={saveAndScheduleOutfit}
                  disabled={selectedOutfit.length === 0}
                  className="w-full text-xs tracking-[0.2em] font-medium text-white rounded-xl transition-all duration-300 shadow-[0_4px_0_rgba(0,0,0,0.13)] hover:brightness-90 hover:shadow-none hover:translate-y-[3px] disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98]"
                  style={{ backgroundColor: colors.accent, minHeight: 48, padding: '0 16px' }}
                >
                  SAVE & SCHEDULE
                </button>
                <button
                  onClick={handlePrevStep}
                  className="w-full text-xs tracking-[0.15em] font-light rounded-xl border bg-white hover:bg-gray-50 active:bg-gray-100 transition-all flex items-center justify-center gap-1 text-gray-700"
                  style={{ borderColor: colors.border, minHeight: 44 }}
                >
                  <ChevronLeft size={13} /> ADJUST SELECTION
                </button>
                <button
                  onClick={resetWizard}
                  className="w-full text-xs tracking-[0.15em] font-light text-red-400 rounded-xl hover:bg-red-50/40 active:bg-red-50 transition-all flex items-center justify-center gap-1"
                  style={{ minHeight: 44 }}
                >
                  <RotateCcw size={12} /> START OVER
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showUndertoneModal && (
        <UndertoneSelectorModal
          selectedTone={undertone}
          onSelect={(tone) => setUndertone(tone)}
          onClose={() => setShowUndertoneModal(false)}
        />
      )}

      {modalConfig.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl text-center w-full max-w-xs sm:max-w-sm border border-gray-100 relative p-6 sm:p-8">
            {modalConfig.type === 'error' && (
              <button
                onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-50"
                style={{ minWidth: 32, minHeight: 32 }}
              >
                <X size={16} />
              </button>
            )}
            <div className="text-4xl mb-4">{modalConfig.type === 'success' ? '✨' : '⚠️'}</div>
            <h3 className={`text-base sm:text-lg font-medium mb-2 ${modalConfig.type === 'success' ? 'text-gray-900' : 'text-red-500'}`}>
              {modalConfig.type === 'success' ? 'Outfit Scheduled!' : 'Action Required'}
            </h3>
            <p className="text-gray-500 text-xs tracking-wide font-light leading-relaxed">
              {modalConfig.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}