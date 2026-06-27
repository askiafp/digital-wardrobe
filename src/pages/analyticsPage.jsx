import React from 'react';
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { colors, categories, analyticsData } from '../constants';

export default function AnalyticsPage({ wardrobe = [], savedOutfits = [] }) {
  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  const mostWornCategory = wardrobe.length > 0 
    ? categories.slice(1).reduce((best, cat) => {
        const count = wardrobe.filter(i => i.category === cat).length;
        const bestCount = wardrobe.filter(i => i.category === best).length;
        return count > bestCount ? cat : best;
      }, categories[1] || 'None')
    : 'None';

  const avgItemsPerOutfit = savedOutfits.length > 0
    ? Math.round(savedOutfits.reduce((sum, o) => sum + o.items.length, 0) / savedOutfits.length)
    : 0;

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen">
      <div className="px-3 sm:px-4 md:px-8 lg:px-12 py-6 sm:py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-6 sm:mb-8 md:mb-12 lg:mb-16">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-light mb-1 sm:mb-2 leading-tight"
              style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}
            >
              Wardrobe Insights
            </h1>
            <p className="text-xs sm:text-sm md:text-base" style={{ color: colors.muted }}>
              Understand your styling patterns
            </p>
          </div>

          <div className="space-y-4 sm:space-y-5 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4 lg:gap-6">
            
            {/* 1. Weekly Usage Chart */}
            <div
              className="rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 md:col-span-2 lg:col-span-4 hover:shadow-sm transition-shadow duration-300"
              style={{ backgroundColor: colors.surface }}
            >
              <h3 
                className="font-light text-xs tracking-widest uppercase mb-2"
                style={{ color: colors.heading }}
              >
                Weekly Usage
              </h3>
              <p className="text-xs mb-3" style={{ color: colors.muted }}>
                Items worn per day
              </p>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                  <XAxis dataKey="day" stroke={colors.muted} style={{ fontSize: '10px' }} />
                  <YAxis stroke={colors.muted} style={{ fontSize: '10px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      fontSize: '11px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="worn" 
                    stroke={colors.accent} 
                    dot={false} 
                    strokeWidth={2}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 2. Key Stats */}
            <div
              className="rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 hover:shadow-sm transition-shadow duration-300"
              style={{ backgroundColor: colors.surface }}
            >
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: colors.muted }}>
                Total
              </p>
              <p className="text-2xl sm:text-3xl font-light" style={{ color: colors.accent }}>
                {wardrobe.length}
              </p>
              <p className="text-xs mt-1" style={{ color: colors.muted }}>
                items
              </p>
            </div>

            <div
              className="rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 hover:shadow-sm transition-shadow duration-300"
              style={{ backgroundColor: colors.surface }}
            >
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: colors.muted }}>
                Outfits
              </p>
              <p className="text-2xl sm:text-3xl font-light" style={{ color: colors.accent }}>
                {savedOutfits.length}
              </p>
              <p className="text-xs mt-1" style={{ color: colors.muted }}>
                saved
              </p>
            </div>

            <div
              className="rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 hover:shadow-sm transition-shadow duration-300"
              style={{ backgroundColor: colors.surface }}
            >
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: colors.muted }}>
                Avg/Fit
              </p>
              <p className="text-2xl sm:text-3xl font-light" style={{ color: colors.accent }}>
                {avgItemsPerOutfit}
              </p>
              <p className="text-xs mt-1" style={{ color: colors.muted }}>
                pieces
              </p>
            </div>

            {/* Go-To Category */}
            <div
              className="rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 hover:shadow-sm transition-shadow duration-300"
              style={{ backgroundColor: colors.surface }}
            >
              <h3 
                className="font-light text-xs tracking-widest uppercase mb-2"
                style={{ color: colors.heading }}
              >
                Go-To
              </h3>
              <p className="text-lg sm:text-xl font-light" style={{ color: colors.accent }}>
                {mostWornCategory}
              </p>
              <p className="text-xs mt-1" style={{ color: colors.muted }}>
                style
              </p>
            </div>

            {/* 3. Category Distribution */}
            <div
              className="rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 md:col-span-1 lg:col-span-2 hover:shadow-sm transition-shadow duration-300"
              style={{ backgroundColor: colors.surface }}
            >
              <h3 
                className="font-light text-xs tracking-widest uppercase mb-2"
                style={{ color: colors.heading }}
              >
                Categories
              </h3>
              <div className="space-y-2">
                {categories.slice(1).map(cat => {
                  const count = wardrobe.filter(i => i.category === cat).length;
                  const percentage = wardrobe.length > 0 ? (count / wardrobe.length) * 100 : 0;
                  return (
                    <div key={cat}>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs font-light" style={{ color: colors.heading }}>
                          {cat}
                        </p>
                        <p className="text-xs" style={{ color: colors.muted }}>
                          {count}
                        </p>
                      </div>
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ backgroundColor: colors.border }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            backgroundColor: colors.accent,
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Most Worn Items */}
            <div
              className="rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 md:col-span-1 lg:col-span-2 hover:shadow-sm transition-shadow duration-300"
              style={{ backgroundColor: colors.surface }}
            >
              <h3 
                className="font-light text-xs tracking-widest uppercase mb-2"
                style={{ color: colors.heading }}
              >
                Most Worn
              </h3>
              <div className="space-y-1.5">
                {wardrobe.length === 0 ? (
                  <div 
                    className="text-center py-4 border border-dashed rounded-lg"
                    style={{ borderColor: colors.border }}
                  >
                    <p className="text-xs font-light" style={{ color: colors.muted }}>
                      No items yet
                    </p>
                  </div>
                ) : (
                  wardrobe.slice(0, 5).map(item => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between p-1.5 sm:p-2 rounded hover:scale-102 transition-transform duration-200"
                      style={{ backgroundColor: colors.background }}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded flex-shrink-0 flex items-center justify-center overflow-hidden"
                          style={{ backgroundColor: colors.surfaceAlt }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-light truncate" style={{ color: colors.heading }}>
                            {item.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}