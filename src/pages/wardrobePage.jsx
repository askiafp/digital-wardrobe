import React, { useState } from 'react';
import { Heart, Plus, Trash2, X, Edit2 } from 'lucide-react';
import { colors, categories } from '../constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function WardrobePage({ wardrobe, selectedOutfit, setSelectedOutfit, activeFilter, setActiveFilter, onAddPhoto, onDeleteItem, onEditItem, isGuest }) {
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [editItem, setEditItem] = useState(null);

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

  const openEditModal = (item, e) => {
    e.stopPropagation();
    setEditItem({
      id: item.id,
      name: item.name || '',
      category: item.category || '',
      style: item.style ? item.style.charAt(0).toUpperCase() + item.style.slice(1) : ''
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (onEditItem && editItem) {
      onEditItem(editItem.id, {
        name: editItem.name,
        category: editItem.category,
        style: editItem.style
      });
    }
    setEditItem(null);
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
      <div className="px-2 sm:px-6 md:px-12 py-6 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 md:mb-12 px-1">
            <h1
              className="text-3xl md:text-5xl font-light mb-1 md:mb-2"
              style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}
            >
              My Wardrobe
            </h1>
            <p className="text-xs md:text-sm" style={{ color: colors.muted }}>
              {wardrobe.length} pieces carefully curated
            </p>
          </div>

          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 px-1" style={{ scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className="px-4 py-1.5 text-xs md:text-sm font-light tracking-wider whitespace-nowrap rounded-full transition-all duration-150"
                style={{
                  backgroundColor: activeFilter === cat ? colors.accent : colors.surfaceAlt,
                  color: activeFilter === cat ? 'white' : colors.heading,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div 
            className="grid gap-2 md:gap-6 [grid-template-columns:repeat(3,minmax(0,1fr))] lg:[grid-template-columns:repeat(4,minmax(0,1fr))]"
          >
            {activeFilter === 'All' && (
              <div
                onClick={onAddPhoto}
                className="group cursor-pointer flex flex-col transition-all duration-200 active:scale-[0.98]"
              >
                <div
                  className="aspect-[3/4] rounded-xl md:rounded-2xl mb-1.5 border border-dashed flex flex-col items-center justify-center gap-1 group-hover:bg-black/[0.02] group-hover:border-gray-400 transition-all duration-150 h-full"
                  style={{
                    backgroundColor: colors.surfaceAlt,
                    borderColor: '#E5E0D8',
                  }}
                >
                  <div className="p-2 rounded-full bg-white shadow-sm text-gray-400 group-hover:text-gray-600 transition-colors">
                    <Plus size={14} />
                  </div>
                  <p className="text-[10px] font-light tracking-wide text-gray-400 group-hover:text-gray-600 transition-colors">
                    Add Photo
                  </p>
                </div>
              </div>
            )}

            {filteredWardrobe.map(item => (
              <div
                key={item.id}
                onClick={() => toggleItemSelection(item)}
                className="group cursor-pointer transition-all duration-200 relative flex flex-col justify-between"
                style={{
                  transform: selectedOutfit.find(i => i.id === item.id) ? 'scale(0.98)' : 'scale(1)',
                }}
              >
                <div className="absolute top-1 right-1 md:top-3 md:right-3 z-10 flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => openEditModal(item, e)}
                    className="p-1 md:p-2 bg-white/80 backdrop-blur-md rounded-md md:rounded-xl text-gray-400 hover:text-gray-700 hover:bg-white shadow-sm active:scale-90 flex items-center justify-center"
                  >
                    <Edit2 className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
                  </button>
                  <button
                    onClick={(e) => openDeleteConfirmation(item.id, e)}
                    className="p-1 md:p-2 bg-white/80 backdrop-blur-md rounded-md md:rounded-xl text-gray-400 hover:text-red-500 hover:bg-white shadow-sm active:scale-90 flex items-center justify-center"
                  >
                    <Trash2 className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
                  </button>
                </div>

                <div>
                  <div
                    className="aspect-[3/4] rounded-xl md:rounded-2xl mb-1 md:mb-3 overflow-hidden group-hover:shadow-lg transition-all duration-150 flex items-center justify-center bg-white border border-gray-50/50"
                    style={{ backgroundColor: colors.surfaceAlt }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </div>

                  <h3 className="font-light text-[8px] md:text-sm leading-tight px-0.5 scale-[0.70] md:scale-100 origin-left break-words line-clamp-2" style={{ color: colors.heading }}>                    
                    {item.name}
                  </h3>
                </div>
                
                <div className="flex justify-between items-center mt-0.5 px-0.5 w-full min-w-0">
                  <div className="flex items-center gap-0.5 flex-wrap min-w-0">
                    <p className="text-[7.5px] md:text-xs text-gray-400 font-light scale-[0.85] md:scale-100 origin-left" style={{ color: colors.muted }}>                      
                      {item.category}
                    </p>
                    {item.style && (
                      <span 
                        className="text-[7px] md:text-[9px] px-1 py-0.5 rounded font-medium tracking-wide uppercase scale-90 md:scale-100 origin-left flex-shrink-0"
                        style={{ 
                          backgroundColor: 
                            item.style === 'formal' ? '#F4EFEA' : 
                            item.style === 'sporty' ? '#EBF3FE' : 
                            item.style === 'comfy' ? '#F0FDF4' : '#F4F4F5',
                          color: 
                            item.style === 'formal' ? '#8C6343' : 
                            item.style === 'sporty' ? '#2563EB' : 
                            item.style === 'comfy' ? '#16A34A' : '#71717A'
                        }}
                      >
                        {item.style}
                      </span>
                    )}
                  </div>
                  {selectedOutfit.find(i => i.id === item.id) && (
                    <Heart size={10} className="flex-shrink-0" style={{ color: colors.accent, fill: colors.accent }} />
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

      {editItem && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/30 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div 
            className="bg-white/95 backdrop-blur-md w-full max-w-[400px] rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] border p-6 relative flex flex-col transition-all max-h-[90vh] overflow-y-auto"
            style={{ borderColor: colors.border, scrollbarWidth: 'none' }}
          >
            <button
              onClick={() => setEditItem(null)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-600 p-1.5 rounded-full hover:bg-neutral-50 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="mb-5">
              <h2 className="text-2xl font-light mb-0.5" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}>
                Edit Piece Info
              </h2>
              <p className="text-[10px] text-neutral-400 uppercase tracking-[0.18em] font-light">Update details of your item</p>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">Item Name</label>
                <input
                  type="text" 
                  required
                  value={editItem.name}
                  onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm text-neutral-800 bg-neutral-50/60 border rounded-xl focus:outline-none focus:ring-1 transition-all"
                  style={{ borderColor: colors.border, '--tw-ring-color': colors.accent }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">Category</label>
                  <Select
                    value={editItem.category}
                    onValueChange={(val) => setEditItem({ ...editItem, category: val })}
                  >
                    <SelectTrigger className="w-full px-4 py-2.5 text-sm text-neutral-800 bg-neutral-50/60 border rounded-xl focus:outline-none focus:ring-1" style={{ borderColor: colors.border, height: 'auto' }}>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border shadow-lg z-[10000] bg-white">
                      {categories.filter(cat => cat !== 'All').map(cat => (
                        <SelectItem key={cat} value={cat} className="text-sm cursor-pointer rounded-lg font-light">{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">Style</label>
                  <Select 
                    value={editItem.style} 
                    onValueChange={(val) => setEditItem({ ...editItem, style: val })}
                  >
                    <SelectTrigger className="w-full px-4 py-2.5 text-sm text-neutral-800 bg-neutral-50/60 border rounded-xl focus:outline-none focus:ring-1" style={{ borderColor: colors.border, height: 'auto' }}>
                      <SelectValue placeholder="Select Style" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border shadow-lg z-[10000] bg-white">
                      {['Casual', 'Formal', 'Comfy', 'Sporty'].map(st => (
                        <SelectItem key={st} value={st} className="text-sm cursor-pointer rounded-lg capitalize font-light">{st}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full py-3.5 text-[11px] tracking-[0.2em] font-medium text-white rounded-xl transition-all duration-300 shadow-sm hover:brightness-105 active:scale-[0.98]" 
                  style={{ backgroundColor: colors.accent }}
                >
                  SAVE CHANGES
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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