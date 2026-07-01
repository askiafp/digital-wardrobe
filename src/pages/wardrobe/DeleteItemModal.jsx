import { Trash2 } from 'lucide-react';

export default function DeleteItemModal({ onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[10000] bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm border border-gray-100 p-6 shadow-2xl text-center">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 text-red-500">
          <Trash2 size={24} />
        </div>
        <h2 className="text-xl text-black font-light mb-2">Delete Item?</h2>
        <p className="text-xs text-gray-400 mb-6 tracking-wide leading-relaxed">Are you sure you want to remove this piece from your wardrobe?</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 text-xs text-black tracking-wider border rounded-xl font-light hover:bg-gray-50 transition-all">CANCEL</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 text-xs tracking-wider text-white rounded-xl font-medium bg-red-500 hover:bg-red-600 transition-all active:scale-[0.98]">DELETE</button>
        </div>
      </div>
    </div>
  );
}
