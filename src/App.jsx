import React, { useState } from 'react';
import { loadUserData, saveWardrobe, saveOutfits, saveWeeklyPlan } from './storage';
import LoginPage from './pages/loginPage';
import HomePage from './pages/homePage';
import WardrobePage from './pages/wardrobePage';
import StylingPage from './pages/stylingPage';
import PlannerPage from './pages/plannerPage';
import AnalyticsPage from './pages/analyticsPage';
import ProfilePage from './pages/profilePage';
import Header from './components/header';
import { colors, initialWardrobeData, categories } from './constants';
import Footer from './pages/footer';
import { X, Plus, ChevronDown, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function App() {
  // ─── Auth ─────────────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = !!currentUser;
  const isGuest = currentUser?.isGuest === true;

  // ─── Per-user data initializer ────────────────────────────────────────────
  const initUserData = (user) => {
    if (!user || user.isGuest) {
      return { wardrobe: [], outfits: [], weeklyPlan: {} };
    }
    const saved = loadUserData(user.email);
    
    const finalWardrobe = (saved.wardrobe && saved.wardrobe.length > 0) 
      ? saved.wardrobe 
      : initialWardrobeData;

    return {
      wardrobe:   finalWardrobe,
      outfits:    saved.outfits || [],
      weeklyPlan: saved.weeklyPlan || {},
    };
  };

  // ─── State ────────────────────────────────────────────────────────────────
  const [currentPage, setCurrentPage]     = useState('home');
  const [selectedOutfit, setSelectedOutfit] = useState([]);
  const [activeFilter, setActiveFilter]   = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemData, setNewItemData]      = useState({ name: '', category: 'Tops', image: '', preview: '' });

  const [wardrobe, setWardrobe] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    const user  = saved ? JSON.parse(saved) : null;
    
    if (!user || user.isGuest) return [];
    
    const savedData = loadUserData(user.email);
    const localItems = savedData?.wardrobe || [];
    
    const combined = [...localItems];
    
    initialWardrobeData.forEach(constItem => {
      const isAlreadyExist = combined.some(localItem => localItem.id === constItem.id);
      if (!isAlreadyExist) {
        combined.push(constItem);
      }
    });
    
    return combined;
  });

  const [savedOutfits, setSavedOutfits] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    const user  = saved ? JSON.parse(saved) : null;
    return initUserData(user).outfits;
  });

  const [weeklyPlan, setWeeklyPlan] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    const user  = saved ? JSON.parse(saved) : null;
    return initUserData(user).weeklyPlan;
  });

  // ─── Auto-save ────────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!isGuest && currentUser?.email) {
      try {
        saveWardrobe(currentUser.email, wardrobe);
      } catch (e) {
        console.error("Failed to auto-save wardrobe due to quota:", e);
      }
    }
  }, [wardrobe]);

  React.useEffect(() => {
    if (!isGuest && currentUser?.email) {
      try {
        saveOutfits(currentUser.email, savedOutfits);
      } catch (e) {
        console.error("Failed to auto-save outfits due to quota:", e);
      }
    }
  }, [savedOutfits]);

  React.useEffect(() => {
    if (!isGuest && currentUser?.email) {
      try {
        saveWeeklyPlan(currentUser.email, weeklyPlan);
      } catch (e) {
        console.error("Failed to auto-save weekly plan due to quota:", e);
      }
    }
  }, [weeklyPlan]);

  // ─── Auth handlers ────────────────────────────────────────────────────────
  const handleLogin = (userData) => {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setCurrentUser(userData);
    
    const data = initUserData(userData);
    const localItems = data.wardrobe || [];
    
    const combined = [...localItems];
    initialWardrobeData.forEach(constItem => {
      if (!combined.some(item => item.id === constItem.id)) {
        combined.push(constItem);
      }
    });

    setWardrobe(combined);
    setSavedOutfits(data.outfits || []);
    setWeeklyPlan(data.weeklyPlan || {});
    setSelectedOutfit([]);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setWardrobe([]);
    setSavedOutfits([]);
    setWeeklyPlan({});
    setSelectedOutfit([]);
    setCurrentPage('home');
  };

  // ─── Wardrobe handlers & Image Compressor ──────────────────────────────────
  const handleImagePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Dinaikkan ke 1080 agar pas dipasang full di card portrait tidak pecah
        const MAX_WIDTH = 1080;
        const MAX_HEIGHT = 1350; // Disesuaikan dengan aspek rasio 4:5
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Menggunakan 'image/webp' agar file super ringan tapi ketajaman gambar tetap HD
        const compressedBase64 = canvas.toDataURL('image/webp', 0.6);
        setNewItemData((prev) => ({ 
          ...prev, 
          image: compressedBase64, 
          preview: compressedBase64 
        }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveNewItem = (e) => {
    e.preventDefault();
    if (!newItemData.name || !newItemData.image) {
      alert('Harap isi semua field!');
      return;
    }
    const newItem = {
      id:       Date.now(),
      name:     newItemData.name,
      category: newItemData.category,
      color:    '#1A1A1A', 
      image:    newItemData.image,
      lastWorn: 'Just now',
      style:    'minimalist',
    };
    setWardrobe((prev) => [newItem, ...prev]);
    setIsAddModalOpen(false);
    setNewItemData({ name: '', category: 'Tops', image: '', preview: '' });
  };

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, itemId: null });
  const handleDeleteItem = (itemId, e) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, itemId: itemId }); 
  };

  const confirmDelete = () => {
    setWardrobe((prev) => prev.filter((item) => item.id !== deleteModal.itemId));
    setSelectedOutfit((prev) => prev.filter((item) => item.id !== deleteModal.itemId));
    setDeleteModal({ isOpen: false, itemId: null });
  };

  // ─── Gate ────────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.background }}>
      <Header
        currentPage={currentPage}
        navigateTo={setCurrentPage}
        wardrobe={wardrobe}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <div className="pb-24 flex-grow">
        {currentPage === 'home' && (
          <HomePage
            wardrobe={wardrobe}
            savedOutfits={savedOutfits}
            weeklyPlan={weeklyPlan}
            navigateTo={setCurrentPage}
            isGuest={isGuest}
          />
        )}
        {currentPage === 'wardrobe' && (
          <WardrobePage
            wardrobe={wardrobe}
            selectedOutfit={selectedOutfit}
            setSelectedOutfit={setSelectedOutfit}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            onAddPhoto={() => {
              if (isGuest) { alert('Sign in to add items to your wardrobe!'); return; }
              setIsAddModalOpen(true);
            }}
            onDeleteItem={handleDeleteItem} 
            isGuest={isGuest}
          />
        )}
        {currentPage === 'analytics' && (
          <AnalyticsPage wardrobe={wardrobe} savedOutfits={savedOutfits} isGuest={isGuest} />
        )}
        {currentPage === 'profile' && (
          <ProfilePage
            currentUser={currentUser}
            setCurrentUser={(updatedUser) => {
              setCurrentUser(updatedUser);
              localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            }}
            onLogout={handleLogout}
            isGuest={isGuest}
          />
        )}
        {currentPage === 'styling' && (
          <StylingPage
            wardrobe={wardrobe}
            selectedOutfit={selectedOutfit}
            setSelectedOutfit={setSelectedOutfit}
            savedOutfits={savedOutfits}
            setSavedOutfits={setSavedOutfits}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            setWeeklyPlan={setWeeklyPlan}
            navigateTo={setCurrentPage}
            isGuest={isGuest}
          />
        )}
        {currentPage === 'planner' && (
          <PlannerPage
            wardrobe={wardrobe}
            weeklyPlan={weeklyPlan}
            setWeeklyPlan={setWeeklyPlan}
            navigateTo={setCurrentPage}
            isGuest={isGuest}
          />
        )}
      </div>

      <Footer />

      {/* ── Add Item Modal ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center z-[9999] bg-black/40 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md border border-gray-100 p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-50 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 sm:hidden" />

            <h2 className="text-2xl font-light mb-1" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}>
              Add New Piece
            </h2>
            <p className="text-xs text-gray-400 mb-6 uppercase tracking-wider">
              Expand your curated closet
            </p>

            <form onSubmit={handleSaveNewItem} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vintage Leather Jacket"
                  value={newItemData.name}
                  onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm text-black bg-gray-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-200"
                  style={{ borderColor: colors.border }}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <Select
                  value={newItemData.category}
                  onValueChange={(val) => setNewItemData({ ...newItemData, category: val })}
                >
                  <SelectTrigger
                    className="w-full px-4 py-2.5 text-sm text-black bg-gray-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-200"
                    style={{ borderColor: colors.border, height: 'auto' }}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border shadow-lg z-[10000] bg-white">
                    {categories.filter((cat) => cat !== 'All').map((cat) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className="text-sm cursor-pointer rounded-lg"
                      >
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  Photo
                </label>
                <label
                  className="flex flex-col items-center justify-center w-full cursor-pointer rounded-xl border border-dashed transition-all hover:bg-gray-50"
                  style={{ borderColor: colors.border, minHeight: 120 }}
                >
                  {newItemData.preview ? (
                    <img
                      src={newItemData.preview}
                      alt="preview"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-8 text-gray-400">
                      <Plus size={22} />
                      <span className="text-xs tracking-wider">Upload Photo</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImagePick}
                  />
                </label>
                {newItemData.preview && (
                  <button
                    type="button"
                    onClick={() => setNewItemData((prev) => ({ ...prev, image: '', preview: '' }))}
                    className="mt-1.5 text-[10px] text-gray-400 hover:text-red-400 tracking-wider transition-colors"
                  >
                    Remove photo
                  </button>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 text-xs tracking-[0.2em] font-medium text-white rounded-xl transition-all duration-300 shadow-md hover:brightness-95 active:scale-[0.98]"
                  style={{ backgroundColor: colors.accent, minHeight: 44 }}
                >
                  ADD TO CLOSET
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[10000] bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm border border-gray-100 p-6 shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 text-red-500">
              <Trash2 size={24} />
            </div>
            <h2 className="text-xl text-black font-light mb-2">Delete Item?</h2>
            <p className="text-xs text-gray-400 mb-6 tracking-wide leading-relaxed">
              Are you sure you want to remove this piece from your wardrobe?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteModal({ isOpen: false, itemId: null })}
                className="flex-1 py-2.5 text-xs text-black tracking-wider border rounded-xl font-light hover:bg-gray-50 transition-all"
              >
                CANCEL
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-2.5 text-xs tracking-wider text-white rounded-xl font-medium bg-red-500 hover:bg-red-600 transition-all active:scale-[0.98]"
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