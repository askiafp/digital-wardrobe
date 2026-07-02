import React, { useState } from 'react';
import { loadUserData, saveWardrobe, saveOutfits, saveWeeklyPlan } from './storage';
import LoginPage from './pages/loginPage';
import AppRoutes from './routes/AppRoutes';
import Header from './components/header';
import { colors, initialWardrobeData } from './constants';
import Footer from './pages/footer';
import { LogIn } from 'lucide-react';

const loadFullUserData = (userData) => {
  if (!userData) return null;
  let full = { ...userData };
  try {
    const storageKey = `curation_vault_profile_${userData.id || userData.email || 'guest'}`;
    const customProfile = localStorage.getItem(storageKey);
    if (customProfile) {
      full = { ...full, ...JSON.parse(customProfile) };
    } else {
      const allUsers = localStorage.getItem('users_database') || localStorage.getItem('users');
      if (allUsers) {
        const db = JSON.parse(allUsers);
        const matchedData = db.find(u => u.email === userData.email);
        if (matchedData) {
          full = { ...full, ...matchedData };
        }
      }
    }
  } catch (_) {}
  return full;
};

const syncWardrobeWithInitialData = (localItems = []) => {
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
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    if (!saved) return null;
    return loadFullUserData(JSON.parse(saved));
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

  const [outfitFromHome, setOutfitFromHome] = useState(null);
  const [currentPage, setCurrentPage]       = useState('home');
  const [selectedOutfit, setSelectedOutfit] = useState([]);
  const [activeFilter, setActiveFilter]     = useState('All');

  const [wardrobe, setWardrobe] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    const user  = saved ? JSON.parse(saved) : null;
    if (!user || user.isGuest) return [];
    const savedData  = loadUserData(user.email);
    return syncWardrobeWithInitialData(savedData?.wardrobe || []);
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
    const fullUserData = loadFullUserData(userData);
    localStorage.setItem('currentUser', JSON.stringify(fullUserData));
    setCurrentUser(fullUserData);
    
    const data     = initUserData(fullUserData);
    const combined = syncWardrobeWithInitialData(data.wardrobe || []);
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

  const handleAddItem = (newItem) => {
    setWardrobe(prev => [newItem, ...prev]);
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

  const handleDeleteItem = (itemId) => {
    setWardrobe(prev => prev.filter(i => i.id !== itemId));
    setSelectedOutfit(prev => prev.filter(i => i.id !== itemId));
  };

  const [selectedWeatherStyle, setSelectedWeatherStyle] = useState(null);

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
        <AppRoutes
          currentPage={currentPage}
          wardrobe={wardrobe}
          selectedOutfit={selectedOutfit}
          setSelectedOutfit={setSelectedOutfit}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          savedOutfits={savedOutfits}
          setSavedOutfits={setSavedOutfits}
          weeklyPlan={weeklyPlan}
          setWeeklyPlan={setWeeklyPlan}
          navigateTo={navigateTo}
          isGuest={isGuest}
          currentUser={currentUser}
          onUpdateProfile={handleUpdateProfile}
          onLogout={handleLogout}
          onAddItem={handleAddItem}
          onDeleteItem={handleDeleteItem}
          onEditItem={handleEditItem}
          onSelectRecommendedOutfit={setOutfitFromHome}
          selectedWeatherStyle={selectedWeatherStyle}
          setSelectedWeatherStyle={setSelectedWeatherStyle}
        />
      </div>

      <Footer />
    </div>
  );
}
