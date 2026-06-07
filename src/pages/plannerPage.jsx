import React from 'react';
import { Trash2, CalendarDays } from 'lucide-react';
import { days, colors } from '../constants';

export default function PlannerPage({ weeklyPlan, setWeeklyPlan, navigateTo }) {
  
  React.useEffect(() => {
    console.log("=== PLANNER PAGE LOADED ===");
    console.log("📥 weeklyPlan received:", weeklyPlan);
    console.log("📥 Type of weeklyPlan:", typeof weeklyPlan);
    
    if (weeklyPlan && typeof weeklyPlan === 'object') {
      const allKeys = Object.keys(weeklyPlan);
      console.log("📥 All keys in weeklyPlan:", allKeys);
      
      allKeys.forEach(key => {
        console.log(`  Key "${key}": `, weeklyPlan[key]);
      });
    }

    console.log("\n🗓️ Checking each day:");
    days.forEach(day => {
      const dayKey = day.toLowerCase();
      const hasData = weeklyPlan && weeklyPlan[dayKey];
      console.log(`  ${day} (${dayKey}): ${hasData ? '✅ HAS DATA' : '❌ NO DATA'}`);
    });
  }, [weeklyPlan]);

  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  const clearDayPlan = (day) => {
    const dayKey = day.toLowerCase();
    console.log("🗑️ Clearing plan for:", dayKey);
    
    setWeeklyPlan(prevPlan => {
      const updatedPlan = { ...prevPlan };
      delete updatedPlan[dayKey];
      console.log("🗑️ Updated plan:", updatedPlan);
      return updatedPlan;
    });
  };

  return (
    <div className="min-h-screen py-6 md:py-12" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-8 md:mb-12">
          <h1
            className="text-3xl md:text-5xl font-light mb-2"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}
          >
            Weekly Planner
          </h1>
          <p className="text-xs md:text-sm" style={{ color: colors.muted }}>
            Organize your outfits day by day and step into your week with clarity.
          </p>
          <p className="text-xs mt-3 italic" style={{ color: colors.accent }}>
            "Getting dressed is a form of self-expression. Plan it with intention."
          </p>
        </div>
        {/* Summary Bar */}
        <div
          className="mb-8 p-4 rounded-2xl flex items-center justify-between"
          style={{ backgroundColor: colors.surface }}
        >
          <p className="text-sm font-light" style={{ color: colors.heading }}>
            Weekly Planning Progress
          </p>
          <p className="text-sm" style={{ color: colors.accent }}>
            {days.filter(day => weeklyPlan && weeklyPlan[day.toLowerCase()]?.items?.length > 0).length} of 7 days planned
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {days.map(day => {
            const dayKey = day.toLowerCase();
            
            const dayData = weeklyPlan ? weeklyPlan[dayKey] : null;
            const outfitItems = dayData?.items || [];

            return (
              <div
                key={day}
                className="rounded-2xl p-5 md:p-6 min-h-[320px] flex flex-col justify-between transition-all duration-300 bg-white border shadow-sm"
                style={{
                  backgroundColor: outfitItems.length > 0 ? colors.surface : 'white',
                  borderStyle: outfitItems.length > 0 ? 'solid' : 'dashed',
                  borderColor: outfitItems.length > 0 ? colors.border : '#E5E7EB',
                }}
              >
                {/* Day Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-light text-sm tracking-wider uppercase" style={{ color: colors.heading }}>
                      {day}
                    </h3>
                    <p className="text-[10px]" style={{ color: colors.muted }}>
                      {outfitItems.length > 0 ? `${outfitItems.length} item${outfitItems.length > 1 ? 's' : ''} planned` : 'No outfit yet'}
                    </p>
                  </div>
                  
                  {/* Delete Button - Only show if outfit exists */}
                  {outfitItems.length > 0 && (
                    <button
                      onClick={() => clearDayPlan(day)}
                      className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-50 transition-all"
                      title="Clear this day's outfit"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* Outfit Items List */}
                {outfitItems.length > 0 ? (
                  <div className="space-y-2 my-5 max-h-48 overflow-y-auto pr-1">
                    {outfitItems.map(item => (
                      <div
                        key={item.id}
                        className="p-2 rounded-xl text-xs font-light flex items-center gap-2.5 border border-gray-100"
                        style={{ backgroundColor: colors.background }}
                      >
                        {/* Item Image Thumbnail */}
                        <div
                          className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden bg-white border border-gray-50 p-1"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                            onError={handleImageError}
                          />
                        </div>

                        {/* Item Info */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-normal text-gray-800">{item.name}</p>
                          <p className="text-[9px] uppercase tracking-wider text-gray-400">{item.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="my-8 text-center py-6 flex flex-col items-center justify-center space-y-2">
                    <CalendarDays size={24} className="text-gray-300" />
                    <p className="text-xs italic" style={{ color: colors.muted }}>
                      No outfit planned
                    </p>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => navigateTo('styling')}
                  className="w-full text-center text-[11px] tracking-widest font-medium py-3 px-3 rounded-xl transition-all duration-300 shadow-sm active:scale-95"
                  style={{
                    backgroundColor: outfitItems.length > 0 ? colors.surfaceAlt : colors.accent,
                    color: outfitItems.length > 0 ? colors.heading : 'white',
                  }}
                >
                  {outfitItems.length > 0 ? 'CHANGE OUTFIT' : '+ PLAN OUTFIT'}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}