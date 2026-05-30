import React from 'react';
import { Heart } from 'lucide-react';
import { colors, categories } from '../constants';

export default function WardrobePage({ wardrobe, selectedOutfit, setSelectedOutfit, activeFilter, setActiveFilter }) {
  const filteredWardrobe = activeFilter === 'All' 
    ? wardrobe 
    : wardrobe.filter(item => item.category === activeFilter);

  const toggleItemSelection = (item) => {
    const isSelected = selectedOutfit.find(i => i.id === item.id);
    if (isSelected) {
      setSelectedOutfit(selectedOutfit.filter(i => i.id !== item.id));
    } else {
      setSelectedOutfit([...selectedOutfit, item]);
    }
  };

  const handleImageError = (e) => {
    e.target.style.backgroundColor = colors.surfaceAlt;
    e.target.style.display = 'flex';
    e.target.style.alignItems = 'center';
    e.target.style.justifyContent = 'center';
    e.target.innerHTML = '<span style="font-size: 24px; color: ' + colors.muted + ';">No Image</span>';
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
                {/* Image Container */}
                <div
                  className="aspect-[3/4] rounded-2xl mb-3 overflow-hidden group-hover:shadow-lg transition-all duration-150 flex items-center justify-center"
                  style={{
                    backgroundColor: colors.surfaceAlt,
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </div>

                {/* Item Info */}
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

          {/* Empty State */}
          {filteredWardrobe.length === 0 && (
            <div className="text-center py-20">
              <p style={{ color: colors.muted }}>
                No items in this category yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}