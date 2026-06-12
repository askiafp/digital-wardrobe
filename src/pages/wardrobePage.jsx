import React, { useState } from 'react';
import { Heart, Plus, Trash2, X } from 'lucide-react';
import { colors, categories } from '../constants';

export default function WardrobePage({ wardrobe, selectedOutfit, setSelectedOutfit, activeFilter, setActiveFilter, onAddPhoto, onDeleteItem, isGuest }) {
  const [deleteTargetId, setDeleteTargetId] = useState(null);

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
    e.target.onerror = null; 
    e.target.src = 'https://placehold.co/300x400/EDE9E3/9E9890?text=No+Image';
  };

  const openDeleteConfirmation = (id, e) => {
    e.stopPropagation();
    onDeleteItem(id, e);
  };

  const confirmDelete = (e) => {
    e.stopPropagation();
    if (onDeleteItem && deleteTargetId) {
      onDeleteItem(deleteTargetId, e);
    }
    setDeleteTargetId(null);
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setDeleteTargetId(null);
  };

  if (isGuest) {
    return (
      <div style={{ backgroundColor: colors.background }} className="min-h-screen">
        <div className="px-6 md:px-12 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h1
                className="text-5xl font-light mb-2"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}
              >
                My Wardrobe
              </h1>
            </div>
            <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: colors.surfaceAlt }}
              >
                <Plus size={28} style={{ color: colors.muted }} />
              </div>
              <p
                className="text-2xl font-light"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}
              >
                Your wardrobe awaits
              </p>
              <p className="text-sm font-light" style={{ color: colors.muted }}>
                Sign in to start building your digital closet
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

          <div className="flex gap-3 mb-12 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {activeFilter === 'All' && (
              <div
                onClick={onAddPhoto}
                className="group cursor-pointer flex flex-col transition-all duration-200 active:scale-[0.98]"
              >
                <div
                  className="aspect-[3/4] rounded-2xl mb-3 border border-dashed flex flex-col items-center justify-center gap-2 group-hover:bg-black/[0.02] group-hover:border-gray-400 transition-all duration-150 h-full"
                  style={{
                    backgroundColor: colors.surfaceAlt,
                    borderColor: '#E5E0D8',
                  }}
                >
                  <div className="p-3 rounded-full bg-white shadow-sm text-gray-400 group-hover:text-gray-600 transition-colors">
                    <Plus size={20} />
                  </div>
                  <p className="text-xs font-light tracking-wide text-gray-400 group-hover:text-gray-600 transition-colors">
                    Add Photo
                  </p>
                </div>
              </div>
            )}

            {filteredWardrobe.map(item => (
              <div
                key={item.id}
                onClick={() => toggleItemSelection(item)}
                className="group cursor-pointer transition-all duration-200 relative"
                style={{
                  transform: selectedOutfit.find(i => i.id === item.id) ? 'scale(0.98)' : 'scale(1)',
                }}
              >
                <button
                  onClick={(e) => openDeleteConfirmation(item.id, e)}
                  className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-md rounded-xl text-gray-400 hover:text-red-500 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 active:scale-90"
                >
                  <Trash2 size={14} />
                </button>

                <div
                  className="aspect-[3/4] rounded-2xl mb-3 overflow-hidden group-hover:shadow-lg transition-all duration-150 flex items-center justify-center"
                  style={{ backgroundColor: colors.surfaceAlt }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
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

          {filteredWardrobe.length === 0 && activeFilter !== 'All' && (
            <div className="text-center py-20">
              <p style={{ color: colors.muted }}>
                No items in this category yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Custom Delete Confirmation Modal ────────────────────────────────────── */}
      {deleteTargetId && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/40 backdrop-blur-sm p-4"
          onClick={cancelDelete}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-sm border border-gray-100 p-6 relative shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={cancelDelete}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-50 transition-colors"
            >
              <X size={16} />
            </button>
            
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <Trash2 size={20} />
            </div>

            <h2 className="text-xl font-light mb-1" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}>
              Delete Item?
            </h2>
            <p className="text-xs text-gray-400 mb-6 tracking-wide leading-relaxed">
              Are you sure you want to remove this piece from your wardrobe? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button 
                onClick={cancelDelete}
                className="flex-1 py-2.5 text-xs tracking-wider border rounded-xl font-light hover:bg-gray-50 transition-all text-gray-500"
                style={{ borderColor: colors.border }}
              >
                CANCEL
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-2.5 text-xs tracking-wider text-white rounded-xl font-medium transition-all duration-300 shadow-sm bg-red-500 hover:bg-red-600 active:scale-[0.98]"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}