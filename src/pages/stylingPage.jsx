import React, { useState } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, Calendar, ArrowRight, RotateCcw, Check, EyeOff, X } from 'lucide-react';
import { colors } from '../constants';

// Import komponen Shadcn UI
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STEPS = [
  { id: 'Tops', label: 'Tops' },
  { id: 'Bottoms', label: 'Bottoms' },
  { id: 'Outerwear', label: 'Outerwear' },
  { id: 'Accessories', label: 'Accessories' },
  { id: 'Bags', label: 'Bags'},
  { id: 'Shoes', label: 'Shoes' },
  { id: 'Preview', label: 'Review' }
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
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [skippedCategories, setSkippedCategories] = useState({});
  const [carouselIndices, setCarouselIndices] = useState({
    Tops: 0, Bottoms: 0, Outerwear: 0, Accessories: 0, Bags:0, Shoes: 0
  });

  const [selectedDay, setSelectedDay] = useState('Monday');
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'success', message: '' });
  
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const currentStep = STEPS[currentStepIdx];

  const itemsByCategory = {
    Tops: wardrobe.filter(item => item.category === 'Tops'),
    Bottoms: wardrobe.filter(item => item.category === 'Bottoms'),
    Outerwear: wardrobe.filter(item => item.category === 'Outerwear'),
    Accessories: wardrobe.filter(item => item.category === 'Accessories'),
    Bags: wardrobe.filter(item => item.category === 'Bags'),
    Shoes: wardrobe.filter(item => item.category === 'Shoes')
  };

  const handleScrollItem = (direction) => {
    const category = currentStep.id;
    const items = itemsByCategory[category];
    if (!items || items.length <= 1) return;

    if (skippedCategories[category]) {
      setSkippedCategories({ ...skippedCategories, [category]: false });
    }

    let newIndex = carouselIndices[category] + direction;
    if (newIndex < 0) newIndex = items.length - 1;
    if (newIndex >= items.length) newIndex = 0;

    setCarouselIndices({ ...carouselIndices, [category]: newIndex });

    const activeItem = items[newIndex];
    setSelectedOutfit(prev => [...prev.filter(i => i.category !== category), activeItem]);
  };

  const handleSelectNone = () => {
    const category = currentStep.id;
    setSkippedCategories({ ...skippedCategories, [category]: true });
    setSelectedOutfit(prev => prev.filter(i => i.category !== category));
    
    if (currentStepIdx < STEPS.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handleNextStep = () => {
    const category = currentStep.id;
    const items = itemsByCategory[category];
    const activeIndex = carouselIndices[category];

    if (!skippedCategories[category] && items && items.length > 0) {
      const activeItem = items[activeIndex];
      
      setSelectedOutfit(prev => {
        const filtered = prev.filter(i => i.category !== category);
        return [...filtered, activeItem];
      });
    }

    if (currentStepIdx < STEPS.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const saveAndScheduleOutfit = () => {
    console.log("🚀 SAVE FUNCTION TRIGGERED");
    
    if (!selectedOutfit || selectedOutfit.length === 0) {
      setModalConfig({
        isOpen: true,
        type: 'error',
        message: 'Please select at least one clothing item!'
      });
      return;
    }

    const outfitId = Date.now();
    const newOutfitObj = { 
      id: outfitId, 
      items: [...selectedOutfit] 
    };

    // 1. Save to savedOutfits array
    setSavedOutfits([...savedOutfits, newOutfitObj]);

    // 2. Add to weekly planner
    if (typeof setWeeklyPlan === 'function') {
      const dayKey = selectedDay.toLowerCase();
      
      setWeeklyPlan(prevPlan => {
        const nextPlan = { ...prevPlan };
        nextPlan[dayKey] = newOutfitObj;
        return nextPlan;
      });
    }

    setModalConfig({
      isOpen: true,
      type: 'success',
      message: `Outfit successfully saved to ${selectedDay}!`
    });

    // 3. Navigate to planner with delay
    setTimeout(() => {
      setModalConfig(prev => ({ ...prev, isOpen: false }));
      if (typeof navigateTo === 'function') {
        navigateTo('planner');
      }
      resetWizard();
    }, 1600);
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  const generateAIOutfit = () => {
    const newIndices = {};
    const newOutfit = [];
    const newSkips = {};

    ['Tops', 'Bottoms', 'Shoes'].forEach(cat => {
      const items = itemsByCategory[cat];
      if (items.length > 0) {
        const randomIndex = Math.floor(Math.random() * items.length);
        newIndices[cat] = randomIndex;
        newOutfit.push(items[randomIndex]);
      }
    });

    ['Outerwear', 'Bags', 'Accessories'].forEach(cat => {
      const items = itemsByCategory[cat];
      if (items.length > 0 && Math.random() > 0.5) {
        const randomIndex = Math.floor(Math.random() * items.length);
        newIndices[cat] = randomIndex;
        newOutfit.push(items[randomIndex]);
      } else {
        newSkips[cat] = true;
      }
    });

    setCarouselIndices(prev => ({ ...prev, ...newIndices }));
    setSkippedCategories(newSkips);
    setSelectedOutfit(newOutfit);
    setCurrentStepIdx(STEPS.length - 1);
  };

  const resetWizard = () => {
    setSelectedOutfit([]);
    setCurrentStepIdx(0);
    setSkippedCategories({});
    setCarouselIndices({ Tops: 0, Bottoms: 0, Outerwear: 0, Accessories: 0, Bags:0, Shoes: 0 });
  };

  return (
    <div className="min-h-screen py-6 md:py-12 relative" style={{ backgroundColor: colors.background }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-6 md:mb-10 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}>
            Outfit Builder
          </h1>
          <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-gray-400">Step-by-step styling session</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8 md:mb-12 relative before:content-[''] before:absolute before:w-full before:h-[1px] before:bg-gray-200 before:top-1/2 before:z-0">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="z-10 flex flex-col items-center flex-1">
              <div 
                className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs transition-all duration-300 border bg-white ${
                  idx <= currentStepIdx ? 'text-white' : 'text-gray-400'
                }`}
                style={{ 
                  backgroundColor: idx <= currentStepIdx ? colors.accent : 'white',
                  borderColor: idx <= currentStepIdx ? colors.accent : '#E5E7EB'
                }}
              >
                {idx < currentStepIdx ? <Check size={14} /> : idx + 1}
              </div>
              <span className={`hidden sm:block text-[9px] md:text-[10px] tracking-wider uppercase mt-2 font-light ${idx === currentStepIdx ? 'text-gray-900 font-normal' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* AI Banner at Start */}
        {currentStepIdx === 0 && selectedOutfit.length === 0 && (
          <div className="mb-6 bg-amber-50/50 border border-amber-100 rounded-2xl p-4 md:p-6 text-center space-y-3 mx-auto max-w-xl">
            <div className="flex justify-center text-amber-500"><Sparkles size={24} /></div>
            <p className="text-xs md:text-sm font-light text-amber-900">Bingung mau pasang baju apa hari ini?</p>
            <button
              onClick={generateAIOutfit}
              className="w-full sm:w-auto px-6 py-2.5 text-xs tracking-wider text-white rounded-xl font-medium transition-all duration-300 shadow-md hover:brightness-95 active:scale-95"
              style={{ backgroundColor: colors.accent }}
            >
              AUTO GENERATE OUTFIT (AI)
            </button>
          </div>
        )}

        {/* Carousel Wizard */}
        {currentStep.id !== 'Preview' ? (
          <div className="bg-white rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 border text-center space-y-6 md:space-y-8 shadow-sm max-w-xl mx-auto" style={{ borderColor: colors.border }}>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-center px-1">
              <span className="text-[9px] md:text-[10px] tracking-[0.2em] uppercase px-3 py-1 bg-gray-100 rounded-full text-gray-500">
                Step {currentStepIdx + 1}: {itemsByCategory[currentStep.id] ? currentStep.label : 'Loading'}
              </span>
              
              <button
                onClick={handleSelectNone}
                className={`w-full sm:w-auto text-xs px-3 py-1.5 sm:py-1 rounded-xl sm:rounded-lg border border-dashed flex items-center justify-center gap-1.5 transition-all ${
                  skippedCategories[currentStep.id] 
                    ? 'bg-red-50 text-red-500 border-red-200 font-medium' 
                    : 'bg-white text-gray-400 hover:text-gray-600'
                }`}
              >
                <EyeOff size={12} /> {skippedCategories[currentStep.id] ? 'NONE ACTIVE' : 'SKIP / NONE'}
              </button>
            </div>

            {/* Item Carousel */}
            <div className="flex items-center justify-between gap-2 sm:gap-6 max-w-md mx-auto">
              <button 
                onClick={() => handleScrollItem(-1)}
                disabled={skippedCategories[currentStep.id] || !itemsByCategory[currentStep.id] || itemsByCategory[currentStep.id].length <= 1}
                className="p-2 md:p-3 rounded-full border bg-white shadow-sm hover:bg-gray-50 active:scale-90 disabled:opacity-10 transition-all flex-shrink-0"
              >
                <ChevronLeft size={20} style={{ color: colors.heading }} />
              </button>

              <div className={`w-full h-48 sm:w-56 sm:h-56 rounded-2xl flex flex-col items-center justify-center p-4 border border-dashed transition-all ${
                skippedCategories[currentStep.id] ? 'bg-red-50/30 border-red-200' : 'bg-gray-50 border-gray-200'
              }`}>
                {skippedCategories[currentStep.id] ? (
                  <div className="text-red-400 space-y-1">
                    <p className="text-xs font-medium">NONE</p>
                    <p className="text-[10px] italic">Omitted</p>
                  </div>
                ) : itemsByCategory[currentStep.id] && itemsByCategory[currentStep.id][carouselIndices[currentStep.id]] ? (
                  <>
                    <img 
                      src={itemsByCategory[currentStep.id][carouselIndices[currentStep.id]].image} 
                      alt={itemsByCategory[currentStep.id][carouselIndices[currentStep.id]].name} 
                      className="w-28 h-28 sm:w-36 sm:h-36 object-contain mb-2 sm:mb-3"
                    />
                    <p className="text-[11px] sm:text-xs font-light text-center text-gray-700 w-full truncate px-1">
                      {itemsByCategory[currentStep.id][carouselIndices[currentStep.id]].name}
                    </p>
                  </>
                ) : (
                  <div className="text-gray-400 space-y-1">
                    <p className="text-xs">No items found</p>
                    <p className="text-[10px] text-gray-400 italic">(Skippable)</p>
                  </div>
                )}
              </div>

              <button 
                onClick={() => handleScrollItem(1)}
                disabled={skippedCategories[currentStep.id] || !itemsByCategory[currentStep.id] || itemsByCategory[currentStep.id].length <= 1}
                className="p-2 md:p-3 rounded-full border bg-white shadow-sm hover:bg-gray-50 active:scale-90 disabled:opacity-10 transition-all flex-shrink-0"
              >
                <ChevronRight size={20} style={{ color: colors.heading }} />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t gap-4" style={{ borderColor: colors.border }}>
              <button
                onClick={handlePrevStep}
                disabled={currentStepIdx === 0}
                className="flex-1 sm:flex-initial px-4 md:px-5 py-2.5 text-xs tracking-wider border rounded-xl flex items-center justify-center gap-1 hover:bg-gray-50 disabled:opacity-30 transition-all"
                style={{ color: colors.heading, borderColor: colors.border }}
              >
                <ChevronLeft size={14} /> BACK
              </button>

              <button
                onClick={handleNextStep}
                className="flex-1 sm:flex-initial px-5 md:px-6 py-2.5 text-xs tracking-wider text-white rounded-xl flex items-center justify-center gap-1 transition-all duration-300 shadow-[0_3px_0_rgba(0,0,0,0.15)] hover:translate-y-[2px] hover:shadow-none active:scale-98"
                style={{ backgroundColor: colors.accent }}
              >
                NEXT <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          /* Preview/Review Step */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
            
            {/* Left: Visual Grid */}
            <div className="md:col-span-2 bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border space-y-4 shadow-sm" style={{ borderColor: colors.border }}>
              <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-1">Lookbook Preview</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl min-h-[200px] items-center justify-center">
                {selectedOutfit.length > 0 ? (
                  selectedOutfit.map((item) => (
                    <div key={item.id} className="bg-white p-2.5 sm:p-3 rounded-xl border flex flex-col items-center w-full shadow-sm transition-transform hover:scale-105">
                      <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-2" />
                      <span className="text-[8px] sm:text-[9px] uppercase px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-md mb-1 font-light">{item.category}</span>
                      <p className="text-[10px] text-center font-light truncate w-full text-gray-700 px-0.5">{item.name}</p>
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-xs text-gray-400 text-center py-8">No pieces selected.</p>
                )}
              </div>
            </div>

            {/* Right: Schedule Panel */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 border space-y-5 md:space-y-6 shadow-sm" style={{ borderColor: colors.border }}>
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-2.5">Add to Planner</p>
                
                {/* INTEGRASI DROPDOWN SHADCN UI */}
                <Select value={selectedDay} onValueChange={(value) => setSelectedDay(value)}>
                  <SelectTrigger className="w-full h-12 bg-gray-50 rounded-xl border font-light text-gray-700 text-sm focus:ring-1 focus:ring-amber-200" style={{ borderColor: colors.border }}>
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border rounded-xl shadow-lg">
                    {daysOfWeek.map(day => (
                      <SelectItem key={day} value={day} className="cursor-pointer text-sm font-light py-2.5">
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2.5 pt-1">
                <button
                  onClick={saveAndScheduleOutfit}
                  disabled={selectedOutfit.length === 0}
                  className="w-full py-3.5 text-xs tracking-[0.2em] font-medium text-white rounded-xl transition-all duration-300 
                             shadow-[0_4px_0_rgba(0,0,0,0.15)] 
                             hover:brightness-90 hover:shadow-none hover:translate-y-[4px] 
                             disabled:opacity-40 disabled:pointer-events-none active:scale-98"
                  style={{ backgroundColor: colors.accent }}
                >
                  SAVE & SCHEDULE
                </button>
                
                <button
                  onClick={handlePrevStep}
                  className="w-full py-2.5 text-xs tracking-[0.15em] font-light rounded-xl border bg-white hover:bg-gray-50 transition-all flex items-center justify-center gap-1 text-gray-700"
                  style={{ borderColor: colors.border }}
                >
                  <ChevronLeft size={14} /> ADJUST SELECTION
                </button>

                <button
                  onClick={resetWizard}
                  className="w-full py-2.5 text-xs tracking-[0.15em] font-light text-red-400 rounded-xl hover:bg-red-50/40 transition-all flex items-center justify-center gap-1"
                >
                  <RotateCcw size={12} /> START OVER
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* CUSTOM APP MODAL POP-UP (MENGGANTIKAN BROWSER ALERT) */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-4 border border-gray-100 relative animate-slide-up">
            
            {/* Tombol Close manual khusus untuk modal Error/Peringatan */}
            {modalConfig.type === 'error' && (
              <button 
                onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-50"
              >
                <X size={16} />
              </button>
            )}

            {/* Icon Dinamis berdasarkan type */}
            <div className="text-4xl mb-4">
              {modalConfig.type === 'success' ? '✨' : '⚠️'}
            </div>

            <h3 className={`text-lg font-medium mb-2 ${modalConfig.type === 'success' ? 'text-gray-900' : 'text-red-500'}`}>
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