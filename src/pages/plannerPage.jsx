import React, { useState } from 'react';
import { Trash2, CalendarDays, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { days, colors } from '../constants';

const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening', 'Night'];

export default function PlannerPage({ weeklyPlan, setWeeklyPlan, navigateTo }) {
  const [expandedDays, setExpandedDays] = useState({});

  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  const getSlotOutfits = (dayKey) => {
    const dayData = weeklyPlan?.[dayKey];
    if (!dayData) return {};
    if (dayData.slots) return dayData.slots;
    if (dayData.items?.length > 0) return { Morning: { items: dayData.items } };
    return {};
  };

  const getTotalItems = (dayKey) => {
    const slots = getSlotOutfits(dayKey);
    return Object.values(slots).reduce((sum, slot) => sum + (slot?.items?.length || 0), 0);
  };

  const toggleDayExpand = (dayKey) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayKey]: !prev[dayKey]
    }));
  };

  const clearSlot = (dayKey, slot) => {
    setWeeklyPlan(prev => {
      const updated = { ...prev };
      const slots = { ...(updated[dayKey]?.slots || {}) };
      delete slots[slot];
      if (Object.keys(slots).length === 0) {
        delete updated[dayKey];
      } else {
        updated[dayKey] = { ...updated[dayKey], slots };
      }
      return updated;
    });
  };

  const clearDayPlan = (dayKey) => {
    setWeeklyPlan(prev => {
      const updated = { ...prev };
      delete updated[dayKey];
      return updated;
    });
  };

  const setSlotMood = (dayKey, slot, mood) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        slots: {
          ...(prev[dayKey]?.slots || {}),
          [slot]: { ...(prev[dayKey]?.slots?.[slot] || { items: [] }), mood }
        }
      }
    }));
  };

  const setSlotWeather = (dayKey, slot, weather) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        slots: {
          ...(prev[dayKey]?.slots || {}),
          [slot]: { ...(prev[dayKey]?.slots?.[slot] || { items: [] }), weather }
        }
      }
    }));
  };

  const handlePlanOutfit = (dayKey, slot) => {
    localStorage.setItem('plannerTargetDay', dayKey);
    localStorage.setItem('plannerTargetSlot', slot);
    navigateTo('styling');
  };

  const totalDaysPlanned = days.filter(day => getTotalItems(day.toLowerCase()) > 0).length;

  return (
    <div className="min-h-screen py-6 md:py-12" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-light mb-2"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}>
            Weekly Planner
          </h1>
          <p className="text-xs md:text-sm" style={{ color: colors.muted }}>
            Organize your outfits day by day and step into your week with clarity.
          </p>
        </div>

        <div className="mb-8 p-4 rounded-2xl flex items-center justify-between"
          style={{ backgroundColor: colors.surface }}>
          <p className="text-sm font-light" style={{ color: colors.heading }}>Weekly Planning Progress</p>
          <p className="text-sm" style={{ color: colors.accent }}>{totalDaysPlanned} of 7 days planned</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {days.map(day => {
            const dayKey = day.toLowerCase();
            const slots = getSlotOutfits(dayKey);
            const totalItems = getTotalItems(dayKey);
            const hasOutfit = totalItems > 0;
            const isExpanded = !!expandedDays[dayKey];

            return (
              <div key={day}
                className="rounded-2xl p-4 md:p-6 flex flex-col gap-3 transition-all duration-300 border shadow-sm cursor-pointer sm:cursor-default"
                onClick={() => {
                  if (window.innerWidth < 640) toggleDayExpand(dayKey);
                }}
                style={{
                  backgroundColor: hasOutfit ? colors.surface : 'white',
                  borderStyle: hasOutfit ? 'solid' : 'dashed',
                  borderColor: hasOutfit ? colors.border : '#E5E7EB',
                }}>

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-light text-sm tracking-wider uppercase" style={{ color: colors.heading }}>{day}</h3>
                    <p className="text-[10px]" style={{ color: colors.muted }}>
                      {hasOutfit ? `${totalItems} item${totalItems > 1 ? 's' : ''} planned` : 'No outfit yet'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {hasOutfit && (
                      <button onClick={() => clearDayPlan(dayKey)}
                        className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-50 transition-all">
                        <Trash2 size={14} />
                      </button>
                    )}
                    <div className="sm:hidden text-gray-400 p-1">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </div>

                <div className={`${isExpanded ? 'flex' : 'hidden'} sm:flex flex-col gap-2`} onClick={(e) => e.stopPropagation()}>
                  {TIME_SLOTS.map(slot => {
                    const slotData = slots[slot];
                    const slotItems = slotData?.items || [];
                    const hasSlotItems = slotItems.length > 0;

                    return (
                      <div key={slot} className="rounded-xl border p-3"
                        style={{
                          borderColor: hasSlotItems ? colors.border : '#E5E7EB',
                          borderStyle: hasSlotItems ? 'solid' : 'dashed',
                          backgroundColor: hasSlotItems ? colors.background : 'transparent',
                        }}>

                        <div className="flex justify-between items-center mb-2">
                          <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.accent }}>
                            {slot}
                          </p>
                          {hasSlotItems && (
                            <button onClick={() => clearSlot(dayKey, slot)}
                              className="text-gray-300 hover:text-red-400 transition-all">
                              <X size={12} />
                            </button>
                          )}
                        </div>

                        {hasSlotItems && (
                          <>
                            <div className="space-y-1 mb-2 max-h-28 overflow-y-auto">
                              {slotItems.map(item => (
                                <div key={item.id}
                                  className="flex items-center gap-2 p-1.5 rounded-lg border border-gray-100"
                                  style={{ backgroundColor: 'white' }}>
                                  <div className="w-7 h-7 rounded-md flex-shrink-0 overflow-hidden bg-white border border-gray-50 p-0.5">
                                    <img src={item.image} alt={item.name}
                                      className="w-full h-full object-contain" onError={handleImageError} />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-[10px] font-normal text-gray-800">{item.name}</p>
                                    <p className="text-[9px] uppercase tracking-wider text-gray-400">{item.category}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-1 flex-wrap mb-1">
                              {['Casual', 'Formal', 'Sporty', 'Comfy'].map(mood => (
                                <button key={mood}
                                  className="text-[8px] px-1.5 py-0.5 rounded-full border transition-all"
                                  style={{
                                    backgroundColor: slotData?.mood === mood ? colors.accent : 'transparent',
                                    color: slotData?.mood === mood ? 'white' : colors.muted,
                                    borderColor: slotData?.mood === mood ? colors.accent : colors.border,
                                  }}
                                  onClick={() => setSlotMood(dayKey, slot, mood)}>
                                  {mood}
                                </button>
                              ))}
                            </div>
                            <div className="flex gap-1 flex-wrap">
                              {['Sunny', 'Rainy', 'Cold', 'Cloudy'].map(weather => (
                                <button key={weather}
                                  className="text-[8px] px-1.5 py-0.5 rounded-full border transition-all"
                                  style={{
                                    backgroundColor: slotData?.weather === weather ? colors.accent : 'transparent',
                                    color: slotData?.weather === weather ? 'white' : colors.muted,
                                    borderColor: slotData?.weather === weather ? colors.accent : colors.border,
                                  }}
                                  onClick={() => setSlotWeather(dayKey, slot, weather)}>
                                  {weather}
                                </button>
                              ))}
                            </div>
                          </>
                        )}

                        {!hasSlotItems && (
                          <button
                            onClick={() => handlePlanOutfit(dayKey, slot)}
                            className="w-full flex items-center justify-center gap-1 text-[9px] tracking-widest py-1.5 rounded-lg transition-all"
                            style={{ color: colors.muted, border: `1px dashed ${colors.border}` }}>
                            <Plus size={10} /> Add outfit
                          </button>
                        )}
                        {hasSlotItems && (
                          <button
                            onClick={() => handlePlanOutfit(dayKey, slot)}
                            className="w-full text-[9px] tracking-widest py-1.5 rounded-lg transition-all mt-2"
                            style={{ backgroundColor: colors.surfaceAlt, color: colors.heading }}>
                            Change outfit
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}