import { X, Plus } from 'lucide-react';
import { colors, categories } from '../../constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AddWardrobeItemModal({
  itemData,
  setItemData,
  onClose,
  onImagePick,
  onSave,
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/30 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div 
        className="bg-white/95 backdrop-blur-md w-full max-w-[400px] rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] border p-6 relative flex flex-col transition-all animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto"
        style={{ borderColor: colors.border, scrollbarWidth: 'none' }}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-600 p-1.5 rounded-full hover:bg-neutral-50 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="mb-5">
          <h2 className="text-2xl font-light mb-0.5" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}>
            Add New Piece
          </h2>
          <p className="text-[10px] text-neutral-400 uppercase tracking-[0.18em] font-light">Expand your curated closet</p>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">Item Name</label>
            <input
              type="text" 
              required 
              placeholder="e.g. Vintage Leather Jacket"
              value={itemData.name}
              onChange={(e) => setItemData({ ...itemData, name: e.target.value })}
              className="w-full px-4 py-2.5 text-sm text-neutral-800 bg-neutral-50/60 border rounded-xl focus:outline-none focus:ring-1 transition-all"
              style={{ borderColor: colors.border, '--tw-ring-color': colors.accent }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">Category</label>
              <Select
                value={itemData.category || ''}
                onValueChange={(val) => setItemData({ ...itemData, category: val })}
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
                value={itemData.style || ''} 
                onValueChange={(val) => setItemData({ ...itemData, style: val })}
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

          <div>
            <label className="block text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">Photo</label>
            <label className="flex flex-col items-center justify-center w-full cursor-pointer rounded-2xl border border-dashed transition-all hover:bg-neutral-50 bg-neutral-50/30 overflow-hidden" style={{ borderColor: colors.border, minHeight: 140 }}>
              {itemData.preview ? (
                <img src={itemData.preview} alt="preview" className="w-full h-44 object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 py-6 text-neutral-400">
                  <Plus size={20} />
                  <span className="text-xs font-light tracking-wide">Upload Photo</span>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={onImagePick} />
            </label>
            {itemData.preview && (
              <button type="button" onClick={() => setItemData(prev => ({ ...prev, image: '', preview: '' }))} className="mt-2 text-[10px] text-neutral-400 hover:text-red-400 tracking-wider transition-colors block mx-auto">
                Remove photo
              </button>
            )}
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full py-3.5 text-[11px] tracking-[0.2em] font-medium text-white rounded-xl transition-all duration-300 shadow-sm hover:brightness-105 active:scale-[0.98]" 
              style={{ backgroundColor: colors.accent }}
            >
              ADD TO CLOSET
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
