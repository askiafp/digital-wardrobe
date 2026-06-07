import React from 'react';
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { colors, categories, analyticsData } from '../constants';

export default function AnalyticsPage({ wardrobe, savedOutfits }) {
  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  return (
    <div style={{ backgroundColor: colors.background }}>
      <div className="px-6 md:px-12 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1
              className="text-5xl font-light mb-2"
              style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}
            >
              Wardrobe Insights
            </h1>
            <p style={{ color: colors.muted }}>
              Understand your styling patterns
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Usage Chart */}
            <div
              className="rounded-2xl p-8 mb-8"
              style={{ backgroundColor: colors.surface }}
            >
              <h3 className="font-light text-sm tracking-widest uppercase mb-6" style={{ color: colors.heading }}>
                Weekly Usage
              </h3>
              <p className="text-xs mb-4" style={{ color: colors.muted }}>
                How many items you wore each day this week
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                  <XAxis dataKey="day" stroke={colors.muted} style={{ fontSize: '12px' }} />
                  <YAxis stroke={colors.muted} style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                    }}
                  />
                  <Line type="monotone" dataKey="worn" stroke={colors.accent} dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Category Distribution */}
            <div
              className="rounded-2xl p-8"
              style={{ backgroundColor: colors.surface }}
            >
              <h3 className="font-light text-sm tracking-widest uppercase mb-6" style={{ color: colors.heading }}>
                By Category
              </h3>
              <p className="text-xs mb-4" style={{ color: colors.muted }}>
                Distribution of your wardrobe by clothing type
              </p>
              <div className="space-y-4">
                {categories.slice(1).map(cat => {
                  const count = wardrobe.filter(i => i.category === cat).length;
                  const percentage = wardrobe.length > 0 ? (count / wardrobe.length) * 100 : 0;
                  return (
                    <div key={cat}>
                      <div className="flex justify-between mb-2">
                        <p className="text-sm font-light" style={{ color: colors.heading }}>
                          {cat}
                        </p>
                        <p className="text-sm" style={{ color: colors.muted }}>
                          {count}
                        </p>
                      </div>
                      <div
                        className="h-2 rounded-full"
                        style={{ backgroundColor: colors.border }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            backgroundColor: colors.accent,
                            width: `${percentage}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Most Worn */}
            <div
              className="rounded-2xl p-8"
              style={{ backgroundColor: colors.surface }}
            >
              <h3 className="font-light text-sm tracking-widest uppercase mb-6" style={{ color: colors.heading }}>
                Most Worn
              </h3>
              <div className="space-y-3">
                {wardrobe.slice(0, 5).map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: colors.background }}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded flex-shrink-0 flex items-center justify-center overflow-hidden"
                        style={{ backgroundColor: colors.surfaceAlt }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                      </div>
                      <p className="text-sm font-light truncate" style={{ color: colors.heading }}>
                        {item.name}
                      </p>
                    </div>
                    <p className="text-xs flex-shrink-0" style={{ color: colors.muted }}>
                      {item.lastWorn}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="space-y-4">
              <div
                className="rounded-2xl p-6"
                style={{ backgroundColor: colors.surface }}
              >
                <p className="text-xs tracking-widest uppercase" style={{ color: colors.muted }}>
                  Average Pieces Per Outfit
                </p>
                <p className="text-4xl font-light mt-3" style={{ color: colors.accent }}>
                  {savedOutfits.length > 0
                    ? Math.round(
                        savedOutfits.reduce((sum, o) => sum + o.items.length, 0) /
                          savedOutfits.length
                      )
                    : 3}
                </p>
              </div>
              <div
                className="rounded-2xl p-6"
                style={{ backgroundColor: colors.surface }}
              >
                <p className="text-xs tracking-widest uppercase" style={{ color: colors.muted }}>
                  Outfit Combinations
                </p>
                <p className="text-4xl font-light mt-3" style={{ color: colors.accent }}>
                  {savedOutfits.length}
                </p>
              </div>
            </div>
          </div>
          {/* Most Worn Category */}
            <div
              className="rounded-2xl p-8"
              style={{ backgroundColor: colors.surface }}
            >
              <h3 className="font-light text-sm tracking-widest uppercase mb-2" style={{ color: colors.heading }}>
                Most Worn Category
              </h3>
              <p className="text-xs mb-6" style={{ color: colors.muted }}>
                The category you reach for the most
              </p>
              <p className="text-4xl font-light" style={{ color: colors.accent }}>
                {categories.slice(1).reduce((best, cat) => {
                  const count = wardrobe.filter(i => i.category === cat).length;
                  const bestCount = wardrobe.filter(i => i.category === best).length;
                  return count > bestCount ? cat : best;
                }, categories[1] || 'None')}
              </p>
              <p className="text-xs mt-2" style={{ color: colors.muted }}>
                is your go-to category
              </p>
            </div>
        </div>
      </div>
    </div>
  );
}