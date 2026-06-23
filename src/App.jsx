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
import { X, Plus, Trash2, LogIn } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    if (!saved) return null;
    const parsedUser = JSON.parse(saved);
    try {
      const storageKey = `curation_vault_profile_${parsedUser?.id || parsedUser?.email || 'guest'}`;
      const customProfile = localStorage.getItem(storageKey);
      if (customProfile) {
        const parsedProfile = JSON.parse(customProfile);
        return { ...parsedUser, ...parsedProfile };
      }
    } catch (_) {}
    return parsedUser;
  });

  const isAuthenticated = !!currentUser;
  const isGuest = currentUser?.isGuest === true;

  const initUserData = (user) => {
    if (!user || user.isGuest) return { wardrobe: [], outfits: [], weeklyPlan: {} };
    const saved = loadUserData(user.email);
    const finalWardrobe = (saved.wardrobe && saved.wardrobe.length > 0)
      ? saved.wardrobe
      : initialWardrobeData;
    return { wardrobe: finalWardrobe, outfits: saved.outfits || [], weeklyPlan: saved.weeklyPlan || {} };
  };

  const [currentPage, setCurrentPage]       = useState('home');
  const [selectedOutfit, setSelectedOutfit] = useState([]);
  const [activeFilter, setActiveFilter]     = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemData, setNewItemData]        = useState({ name: '', category: '', style: '', image: '', preview: '' });

  const [wardrobe, setWardrobe] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    const user  = saved ? JSON.parse(saved) : null;
    
    if (!user || user.isGuest) return [];
    
    const savedData  = loadUserData(user.email);
    const localItems = savedData?.wardrobe || [];
    
    const updatedLocalItems = localItems.map(localItem => {
      const freshItem = initialWardrobeData.find(fresh => fresh.id === localItem.id);
      return freshItem ? { ...localItem, style: freshItem.style } : localItem;
    });

    const combined = [...updatedLocalItems];
    
    initialWardrobeData.forEach(constItem => {
      if (!combined.some(i => i.id === constItem.id)) {
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

  React.useEffect(() => {
    if (!isGuest && currentUser?.email) {
      try { saveWardrobe(currentUser.email, wardrobe); }
      catch (e) { console.error('Failed to auto-save wardrobe:', e); }
    }
  }, [wardrobe]);

  React.useEffect(() => {
    if (!isGuest && currentUser?.email) {
      try { saveOutfits(currentUser.email, savedOutfits); }
      catch (e) { console.error('Failed to auto-save outfits:', e); }
    }
  }, [savedOutfits]);

  React.useEffect(() => {
    if (!isGuest && currentUser?.email) {
      try { saveWeeklyPlan(currentUser.email, weeklyPlan); }
      catch (e) { console.error('Failed to auto-save weekly plan:', e); }
    }
  }, [weeklyPlan]);

  const navigateTo = (page) => {
    if (isGuest && page !== 'home') {
      setCurrentPage('home');
      return;
    }
    setCurrentPage(page);
  };

  const handleLogin = (userData) => {
    let fullUserData = { ...userData };
    
    try {
      const storageKey = `curation_vault_profile_${userData?.id || userData?.email || 'guest'}`;
      const customProfile = localStorage.getItem(storageKey);
      if (customProfile) {
        const parsedProfile = JSON.parse(customProfile);
        fullUserData = { ...fullUserData, ...parsedProfile };
      } else {
        const allUsers = localStorage.getItem('users_database') || localStorage.getItem('users');
        if (allUsers) {
          const db = JSON.parse(allUsers);
          const matchedData = db.find(u => u.email === userData.email);
          if (matchedData) {
            fullUserData = { ...fullUserData, ...matchedData };
          }
        }
      }
    } catch (_) {}

    localStorage.setItem('currentUser', JSON.stringify(fullUserData));
    setCurrentUser(fullUserData);
    
    const data     = initUserData(fullUserData);
    const combined = [...(data.wardrobe || [])];
    initialWardrobeData.forEach(constItem => {
      if (!combined.some(i => i.id === constItem.id)) combined.push(constItem);
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

  const handleUpdateProfile = (updatedProfileData) => {
    const updatedUser = { ...currentUser, ...updatedProfileData };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    try {
      const storageKey = `curation_vault_profile_${currentUser?.id || currentUser?.email || 'guest'}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedProfileData));

      const allUsers = localStorage.getItem('users_database') || localStorage.getItem('users');
      if (allUsers) {
        const db = JSON.parse(allUsers);
        const updatedDb = db.map(u => u.email === currentUser.email ? { ...u, ...updatedProfileData } : u);
        localStorage.setItem('users_database', JSON.stringify(updatedDb));
      }
    } catch (e) {
      console.error('Failed to back up profile info:', e);
    }
  };

  const handleImagePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 1080, MAX_HEIGHT = 1350;
        let { width, height } = img;
        if (width > height) { if (width > MAX_WIDTH)  { height *= MAX_WIDTH / width;   width  = MAX_WIDTH;  } }
        else                { if (height > MAX_HEIGHT) { width  *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/webp', 0.6);
        setNewItemData(prev => ({ ...prev, image: compressed, preview: compressed }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveNewItem = (e) => {
    e.preventDefault();
    if (!newItemData.name || !newItemData.image) { alert('Harap isi semua field!'); return; }
    
    const nameLower = newItemData.name.toLowerCase();
    let autoStyle = 'casual';

    if (
      nameLower.includes('lounger') || 
      nameLower.includes('corduroy') || 
      nameLower.includes('knit') || 
      nameLower.includes('sweater') || 
      nameLower.includes('hoodie') || 
      nameLower.includes('comfy') || 
      nameLower.includes('cardigan') || 
      nameLower.includes('lounge')
    ) {
      autoStyle = 'comfy';
    } else if (
      nameLower.includes('puma') || 
      nameLower.includes('speedcat') || 
      nameLower.includes('sport') || 
      nameLower.includes('run') || 
      nameLower.includes('active') || 
      nameLower.includes('sneaker') || 
      nameLower.includes('gym')
    ) {
      autoStyle = 'sporty';
    } else if (
      nameLower.includes('vest') || 
      nameLower.includes('gothic') || 
      nameLower.includes('collared') || 
      nameLower.includes('blazer') || 
      nameLower.includes('suit') || 
      nameLower.includes('formal') || 
      nameLower.includes('office') || 
      nameLower.includes('esq') ||
      nameLower.includes('trousers')
    ) {
      autoStyle = 'formal';
    }

    const newItem = {
      id: Date.now(), 
      name: newItemData.name, 
      category: newItemData.category || 'Tops',
      color: '#1A1A1A', 
      image: newItemData.image, 
      lastWorn: 'Just now', 
      style: newItemData.style?.toLowerCase() || autoStyle,
    };
    setWardrobe(prev => [newItem, ...prev]);
    setIsAddModalOpen(false);
    setNewItemData({ name: '', category: '', style: '', image: '', preview: '' });
  };

  const handleEditItem = (itemId, updatedData) => {
    setWardrobe(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          name: updatedData.name,
          category: updatedData.category,
          style: updatedData.style.toLowerCase()
        };
      }
      return item;
    }));
    
    setSelectedOutfit(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          name: updatedData.name,
          category: updatedData.category,
          style: updatedData.style.toLowerCase()
        };
      }
      return item;
    }));
  };

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, itemId: null });
  const handleDeleteItem = (itemId, e) => { e.stopPropagation(); setDeleteModal({ isOpen: true, itemId }); };
  const confirmDelete = () => {
    setWardrobe(prev => prev.filter(i => i.id !== deleteModal.itemId));
    setSelectedOutfit(prev => prev.filter(i => i.id !== deleteModal.itemId));
    setDeleteModal({ isOpen: false, itemId: null });
  };

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;

  const GuestBanner = () => (
    <div
      className="w-full flex items-center justify-between gap-3 px-5 py-3"
      style={{ backgroundColor: colors.accent }}
    >
      <p className="text-[11px] tracking-[0.15em] uppercase font-medium text-white/90">
        You're browsing as a guest. Sign in to unlock all features.
      </p>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase font-semibold text-white border border-white/40 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors whitespace-nowrap flex-shrink-0"
      >
        <LogIn size={11} /> Sign In
      </button>
    </div>
  );

  const [selectedWeatherStyle, setSelectedWeatherStyle] = useState(null);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.background }}>
      {isGuest && <GuestBanner />}

      <Header
        currentPage={currentPage}
        navigateTo={navigateTo}
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
            navigateTo={navigateTo}
            isGuest={isGuest}
            onSelectWeatherStyle={(weatherData) => {
              setSelectedWeatherStyle(weatherData);
            }}
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
            onEditItem={handleEditItem}
            isGuest={isGuest}
          />
        )}
        {currentPage === 'analytics' && (
          <AnalyticsPage wardrobe={wardrobe} savedOutfits={savedOutfits} isGuest={isGuest} />
        )}
        {currentPage === 'profile' && (
          <ProfilePage
            currentUser={currentUser}
            setCurrentUser={handleUpdateProfile}
            onLogout={handleLogout}
            isGuest={isGuest}
            wardrobe={wardrobe}
            days={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}
            weeklyPlan={weeklyPlan}
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
            navigateTo={navigateTo}
            isGuest={isGuest}
            weatherFromHome={selectedWeatherStyle}
            clearWeatherFromHome={() => setSelectedWeatherStyle(null)}
          />
        )}
        {currentPage === 'planner' && (
          <PlannerPage
            wardrobe={wardrobe}
            weeklyPlan={weeklyPlan}
            setWeeklyPlan={setWeeklyPlan}
            navigateTo={navigateTo}
            isGuest={isGuest}
          />
        )}
      </div>

      <Footer />

      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/30 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div 
            className="bg-white/95 backdrop-blur-md w-full max-w-[400px] rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] border p-6 relative flex flex-col transition-all animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto"
            style={{ borderColor: colors.border, scrollbarWidth: 'none' }}
          >
            <button
              onClick={() => setIsAddModalOpen(false)}
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

            <form onSubmit={handleSaveNewItem} className="space-y-4">
              <div>
                <label className="block text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">Item Name</label>
                <input
                  type="text" 
                  required 
                  placeholder="e.g. Vintage Leather Jacket"
                  value={newItemData.name}
                  onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm text-neutral-800 bg-neutral-50/60 border rounded-xl focus:outline-none focus:ring-1 transition-all"
                  style={{ borderColor: colors.border, '--tw-ring-color': colors.accent }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">Category</label>
                  <Select
                    value={newItemData.category || ''}
                    onValueChange={(val) => setNewItemData({ ...newItemData, category: val })}
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
                    value={newItemData.style || ''} 
                    onValueChange={(val) => setNewItemData({ ...newItemData, style: val })}
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
                  {newItemData.preview ? (
                    <img src={newItemData.preview} alt="preview" className="w-full h-44 object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-6 text-neutral-400">
                      <Plus size={20} />
                      <span className="text-xs font-light tracking-wide">Upload Photo</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
                </label>
                {newItemData.preview && (
                  <button type="button" onClick={() => setNewItemData(prev => ({ ...prev, image: '', preview: '' }))} className="mt-2 text-[10px] text-neutral-400 hover:text-red-400 tracking-wider transition-colors block mx-auto">
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
      )}

      {deleteModal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[10000] bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm border border-gray-100 p-6 shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 text-red-500">
              <Trash2 size={24} />
            </div>
            <h2 className="text-xl text-black font-light mb-2">Delete Item?</h2>
            <p className="text-xs text-gray-400 mb-6 tracking-wide leading-relaxed">Are you sure you want to remove this piece from your wardrobe?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal({ isOpen: false, itemId: null })} className="flex-1 py-2.5 text-xs text-black tracking-wider border rounded-xl font-light hover:bg-gray-50 transition-all">CANCEL</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 text-xs tracking-wider text-white rounded-xl font-medium bg-red-500 hover:bg-red-600 transition-all active:scale-[0.98]">DELETE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}