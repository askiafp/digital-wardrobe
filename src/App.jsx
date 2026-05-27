import React, { useState, useEffect } from 'react';
import { ChevronRight, Plus, X, Heart, Share2, Calendar, TrendingUp, Sparkles, Home, Shirt, Palette, Settings, Search } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Luxury Color System
const colors = {
  background: '#FAFAF8',
  surface: '#F5F2EE',
  surfaceAlt: '#EDE9E3',
  border: '#E5E0D8',
  heading: '#1A1714',
  body: '#5A5450',
  muted: '#9E9890',
  accent: '#C9A09A',
};

// Sample wardrobe data
const initialWardrobeData = [
  { id: 1, name: 'White Linen Shirt', category: 'Tops', color: '#FFFFFF', image: '🤍', lastWorn: '2 days ago', style: 'minimalist' },
  { id: 2, name: 'Cream Cashmere Knit', category: 'Tops', color: '#F5E6D3', image: '🧶', lastWorn: '5 days ago', style: 'minimalist' },
  { id: 3, name: 'Black Tailored Trousers', category: 'Bottoms', color: '#1A1714', image: '👖', lastWorn: '3 days ago', style: 'formal' },
  { id: 4, name: 'Camel Wool Coat', category: 'Outerwear', color: '#C4A080', image: '🧥', lastWorn: '1 week ago', style: 'minimalist' },
  { id: 5, name: 'Nude Ballet Flats', category: 'Shoes', color: '#D4B5A0', image: '👠', lastWorn: '6 days ago', style: 'minimalist' },
  { id: 6, name: 'Gold Pendant', category: 'Accessories', color: '#D4AF37', image: '✨', lastWorn: '2 days ago', style: 'casual' },
  { id: 7, name: 'Linen Slip Dress', category: 'Tops', color: '#E8DCC8', image: '👗', lastWorn: '4 days ago', style: 'casual' },
  { id: 8, name: 'Chocolate Leather Bag', category: 'Accessories', color: '#6B4423', image: '👜', lastWorn: '1 day ago', style: 'formal' },
];

const analyticsData = [
  { day: 'Mon', worn: 4 },
  { day: 'Tue', worn: 3 },
  { day: 'Wed', worn: 5 },
  { day: 'Thu', worn: 3 },
  { day: 'Fri', worn: 6 },
  { day: 'Sat', worn: 2 },
  { day: 'Sun', worn: 2 },
];

export default function Closetry() {
  const [currentPage, setCurrentPage] = useState('home');
  const [wardrobe, setWardrobe] = useState(initialWardrobeData);
  const [selectedOutfit, setSelectedOutfit] = useState([]);
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [weeklyPlan, setWeeklyPlan] = useState({});
  const [skinTone, setSkinTone] = useState('neutral');
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Shoes', 'Accessories'];

  const filteredWardrobe = activeFilter === 'All' 
    ? wardrobe 
    : wardrobe.filter(item => item.category === activeFilter);

  const generateAIOutfit = () => {
    const tops = wardrobe.filter(i => i.category === 'Tops');
    const bottoms = wardrobe.filter(i => i.category === 'Bottoms');
    const shoes = wardrobe.filter(i => i.category === 'Shoes');
    
    if (tops.length > 0 && bottoms.length > 0 && shoes.length > 0) {
      const outfit = [
        tops[Math.floor(Math.random() * tops.length)],
        bottoms[Math.floor(Math.random() * bottoms.length)],
        shoes[Math.floor(Math.random() * shoes.length)],
      ];
      setSelectedOutfit(outfit);
    }
  };

  const saveOutfit = () => {
    if (selectedOutfit.length > 0) {
      setSavedOutfits([...savedOutfits, { id: Date.now(), items: selectedOutfit }]);
      setSelectedOutfit([]);
    }
  };

  const toggleItemSelection = (item) => {
    const isSelected = selectedOutfit.find(i => i.id === item.id);
    if (isSelected) {
      setSelectedOutfit(selectedOutfit.filter(i => i.id !== item.id));
    } else {
      setSelectedOutfit([...selectedOutfit, item]);
    }
  };

  const planOutfitDay = (day, outfit) => {
    setWeeklyPlan({ ...weeklyPlan, [day]: outfit });
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Home Page
  const HomePage = () => (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Editorial Hero */}
      <section className="pt-20 pb-16 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-6">
            <h1 className="text-6xl md:text-7xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}>
              Your Wardrobe,<br />Beautifully Organized
            </h1>
            <p className="text-lg" style={{ color: colors.body, fontFamily: 'DM Sans, sans-serif' }}>
              Reconnect with the clothes you already own. Create, plan, and style with intention.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => setCurrentPage('wardrobe')}
                className="px-8 py-3 text-sm tracking-widest font-light"
                style={{ backgroundColor: colors.accent, color: 'white', borderRadius: '14px' }}
              >
                START STYLING
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stats */}
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

      {/* CTA Section */}
      <section className="px-6 md:px-12 py-16 border-t" style={{ borderColor: colors.border }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-light mb-4" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}>
                Mix & Match
              </h2>
              <p style={{ color: colors.body, lineHeight: 1.8 }}>
                Combine pieces from your wardrobe. Preview outfits instantly. Save your favorites for later.
              </p>
              <button
                onClick={() => setCurrentPage('styling')}
                className="mt-6 text-sm tracking-widest font-light flex items-center gap-2"
                style={{ color: colors.accent }}
              >
                EXPLORE STYLING <ChevronRight size={16} />
              </button>
            </div>
            <div className="h-40 rounded-lg" style={{ backgroundColor: colors.surfaceAlt }}></div>
          </div>
        </div>
      </section>
    </div>
  );

  // Wardrobe Inventory Page
  const WardrobePage = () => (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="px-6 md:px-12 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-light mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}>
              My Wardrobe
            </h1>
            <p style={{ color: colors.muted }}>
              {wardrobe.length} pieces carefully curated
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex gap-3 mb-12 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className="px-5 py-2 text-sm font-light tracking-wider whitespace-nowrap rounded-full transition-all duration-150"
                style={{
                  backgroundColor: activeFilter === cat ? colors.accent : colors.surfaceAlt,
                  color: activeFilter === cat ? 'white' : colors.heading,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Wardrobe Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredWardrobe.map(item => (
              <div
                key={item.id}
                onClick={() => toggleItemSelection(item)}
                className="group cursor-pointer transition-all duration-200"
                style={{
                  transform: selectedOutfit.find(i => i.id === item.id) ? 'scale(0.98)' : 'scale(1)',
                }}
              >
                <div
                  className="aspect-[3/4] rounded-2xl mb-3 flex items-center justify-center text-6xl group-hover:shadow-lg transition-all duration-150"
                  style={{
                    backgroundColor: item.color === '#FFFFFF' ? colors.surfaceAlt : item.color,
                  }}
                >
                  {item.image}
                </div>
                <h3 className="font-light text-sm" style={{ color: colors.heading }}>
                  {item.name}
                </h3>
                <div className="flex justify-between items-start mt-2">
                  <p className="text-xs" style={{ color: colors.muted }}>
                    {item.category}
                  </p>
                  {selectedOutfit.find(i => i.id === item.id) && (
                    <Heart size={14} style={{ color: colors.accent, fill: colors.accent }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Styling Page (Mix & Match)
  const StylingPage = () => (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="px-6 md:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}>
              Compose an Outfit
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Wardrobe Selector */}
            <div>
              <div className="space-y-6">
                <div>
                  <p className="text-xs tracking-widest uppercase mb-3" style={{ color: colors.muted }}>
                    Select Items
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.slice(1).map(cat => (
                      <button
                        key={cat}
                        className="px-3 py-2 text-xs font-light rounded-lg transition-all duration-150"
                        style={{
                          backgroundColor: colors.surfaceAlt,
                          color: colors.heading,
                        }}
                        onClick={() => setActiveFilter(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs tracking-widest uppercase mb-3" style={{ color: colors.muted }}>
                    Available Pieces
                  </p>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredWardrobe.map(item => (
                      <button
                        key={item.id}
                        onClick={() => toggleItemSelection(item)}
                        className="w-full p-3 text-left rounded-lg transition-all duration-150 text-sm font-light"
                        style={{
                          backgroundColor: selectedOutfit.find(i => i.id === item.id)
                            ? colors.accent
                            : colors.surfaceAlt,
                          color: selectedOutfit.find(i => i.id === item.id)
                            ? 'white'
                            : colors.heading,
                        }}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={generateAIOutfit}
                  className="w-full py-3 text-sm font-light tracking-wider rounded-lg transition-all duration-150 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: colors.accent,
                    color: 'white',
                  }}
                >
                  <Sparkles size={16} />
                  TODAY'S LOOK
                </button>
              </div>
            </div>

            {/* Center Panel - Styling Workspace */}
            <div
              className="rounded-2xl p-8 flex flex-col items-center justify-center min-h-96"
              style={{ backgroundColor: colors.surfaceAlt }}
            >
              {selectedOutfit.length === 0 ? (
                <div className="text-center space-y-3">
                  <Palette size={40} style={{ color: colors.muted, margin: '0 auto' }} />
                  <p style={{ color: colors.muted }}>
                    Select items to compose an outfit
                  </p>
                </div>
              ) : (
                <div className="space-y-4 w-full">
                  {selectedOutfit.map(item => (
                    <div
                      key={item.id}
                      className="p-4 rounded-lg flex items-center justify-between"
                      style={{ backgroundColor: colors.surface }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg text-xl flex items-center justify-center"
                          style={{ backgroundColor: item.color }}
                        >
                          {item.image}
                        </div>
                        <div>
                          <p className="font-light text-sm" style={{ color: colors.heading }}>
                            {item.name}
                          </p>
                          <p className="text-xs" style={{ color: colors.muted }}>
                            {item.category}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleItemSelection(item)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-all"
                      >
                        <X size={16} style={{ color: colors.muted }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Panel - Outfit Actions */}
            <div className="space-y-6">
              <div>
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: colors.muted }}>
                  Outfit Actions
                </p>
                <div className="space-y-3">
                  <button
                    onClick={saveOutfit}
                    disabled={selectedOutfit.length === 0}
                    className="w-full py-3 text-sm font-light tracking-wider rounded-lg transition-all duration-150"
                    style={{
                      backgroundColor: selectedOutfit.length === 0 ? colors.border : colors.accent,
                      color: 'white',
                      opacity: selectedOutfit.length === 0 ? 0.5 : 1,
                    }}
                  >
                    SAVE OUTFIT
                  </button>
                  <button
                    onClick={() => setSelectedOutfit([])}
                    className="w-full py-3 text-sm font-light tracking-wider rounded-lg transition-all duration-150"
                    style={{
                      backgroundColor: colors.surfaceAlt,
                      color: colors.heading,
                    }}
                  >
                    CLEAR
                  </button>
                </div>
              </div>

              {savedOutfits.length > 0 && (
                <div>
                  <p className="text-xs tracking-widest uppercase mb-3" style={{ color: colors.muted }}>
                    Saved Outfits ({savedOutfits.length})
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {savedOutfits.map(outfit => (
                      <button
                        key={outfit.id}
                        onClick={() => setSelectedOutfit(outfit.items)}
                        className="w-full p-3 text-left rounded-lg text-xs font-light transition-all duration-150"
                        style={{
                          backgroundColor: colors.surfaceAlt,
                          color: colors.heading,
                        }}
                      >
                        Outfit • {outfit.items.length} pieces
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Weekly Planner Page
  const PlannerPage = () => (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="px-6 md:px-12 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-light mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}>
              Weekly Planner
            </h1>
            <p style={{ color: colors.muted }}>
              Organize your outfits day by day
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {days.map(day => (
              <div
                key={day}
                className="rounded-2xl p-6 min-h-72 flex flex-col justify-between"
                style={{
                  backgroundColor: weeklyPlan[day] ? colors.surface : colors.surfaceAlt,
                  borderWidth: !weeklyPlan[day] ? '2px' : '0px',
                  borderStyle: 'dashed',
                  borderColor: colors.border,
                }}
              >
                <div>
                  <h3 className="font-light text-sm tracking-wider uppercase mb-1" style={{ color: colors.heading }}>
                    {day}
                  </h3>
                  <p className="text-xs" style={{ color: colors.muted }}>
                    {new Date().toLocaleDateString()}
                  </p>
                </div>

                {weeklyPlan[day] ? (
                  <div className="space-y-2 my-4">
                    {weeklyPlan[day].map(item => (
                      <div
                        key={item.id}
                        className="p-2 rounded-lg text-xs font-light flex items-center gap-2"
                        style={{ backgroundColor: colors.background }}
                      >
                        <div
                          className="w-8 h-8 rounded text-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: item.color }}
                        >
                          {item.image}
                        </div>
                        <span className="truncate">{item.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="my-4">
                    <p className="text-xs" style={{ color: colors.muted }}>
                      No outfit planned
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setCurrentPage('styling')}
                  className="text-xs tracking-widest font-light py-2 px-3 rounded-lg transition-all duration-150"
                  style={{
                    backgroundColor: colors.accent,
                    color: 'white',
                  }}
                >
                  + PLAN OUTFIT
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Analytics Page
  const AnalyticsPage = () => (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="px-6 md:px-12 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-light mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}>
              Wardrobe Insights
            </h1>
            <p style={{ color: colors.muted }}>
              Understand your styling patterns
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Usage Chart */}
            <div
              className="rounded-2xl p-8"
              style={{ backgroundColor: colors.surface }}
            >
              <h3 className="font-light text-sm tracking-widest uppercase mb-6" style={{ color: colors.heading }}>
                Weekly Usage
              </h3>
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
              <div className="space-y-4">
                {categories.slice(1).map(cat => {
                  const count = wardrobe.filter(i => i.category === cat).length;
                  const percentage = (count / wardrobe.length) * 100;
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
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded text-lg flex items-center justify-center"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.image}
                      </div>
                      <p className="text-sm font-light" style={{ color: colors.heading }}>
                        {item.name}
                      </p>
                    </div>
                    <p className="text-xs" style={{ color: colors.muted }}>
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
        </div>
      </div>
    </div>
  );

  // Bottom Navigation
  const BottomNav = () => (
    <div
      className="fixed bottom-0 left-0 right-0 border-t flex justify-around items-center h-16"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.border,
      }}
    >
      {[
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'wardrobe', icon: Shirt, label: 'Wardrobe' },
        { id: 'styling', icon: Palette, label: 'Styling' },
        { id: 'planner', icon: Calendar, label: 'Planner' },
        { id: 'analytics', icon: TrendingUp, label: 'Insights' },
      ].map(({ id, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setCurrentPage(id)}
          className="flex flex-col items-center justify-center w-full h-full transition-all duration-200"
          style={{
            color: currentPage === id ? colors.accent : colors.muted,
          }}
        >
          <Icon size={24} />
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div
        className="sticky top-0 z-40 border-b px-6 md:px-12 py-4"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border,
        }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1
            className="text-2xl font-light tracking-widest"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: colors.heading,
            }}
          >
            CLOSETRY
          </h1>
          <div className="hidden md:flex gap-4">
            <p className="text-sm" style={{ color: colors.muted }}>
              {wardrobe.length} pieces
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-24">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'wardrobe' && <WardrobePage />}
        {currentPage === 'styling' && <StylingPage />}
        {currentPage === 'planner' && <PlannerPage />}
        {currentPage === 'analytics' && <AnalyticsPage />}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}