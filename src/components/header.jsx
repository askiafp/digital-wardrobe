import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { colors } from '../constants';
import logo from '../../public/images/logo.png';
import { cn } from '@/lib/utils';

export default function Header({ currentPage, navigateTo, wardrobe, currentUser, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [displayName, setDisplayName] = useState("Profile");
  const [headerPhoto, setHeaderPhoto] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (currentUser) {
      const photoKey = `curation_vault_photo_${currentUser?.id || currentUser?.email || 'guest'}`;
      try {
        const savedPhoto = localStorage.getItem(photoKey);
        setHeaderPhoto(savedPhoto || null);
      } catch (_) {
        setHeaderPhoto(null);
      }

      if (currentUser.name && !currentUser.name.includes('@')) {
        setDisplayName(currentUser.name);
        return;
      }
      if (currentUser.username && !currentUser.username.includes('@')) {
        setDisplayName(currentUser.username);
        return;
      }

      const emailTarget = currentUser.email || (currentUser.name?.includes('@') ? currentUser.name : null);
      if (emailTarget) {
        const allUsers = localStorage.getItem('users_database') || localStorage.getItem('users');
        if (allUsers) {
          const db = JSON.parse(allUsers);
          const matchedData = db.find(u => u.email === emailTarget);
          if (matchedData?.name) {
            setDisplayName(matchedData.name);
            return;
          }
        }
        setDisplayName(emailTarget.split('@')[0]);
        return;
      }
    } else {
      setHeaderPhoto(null);
    }
    setDisplayName("Profile");
  }, [currentUser, currentPage]);

  const navItems = [
    { id: 'home', label: "Home" },
    { id: 'wardrobe', label: "Wardrobe" },
    { id: 'styling', label: "Styling" },
    { id: 'planner', label: "Planner" },
    { id: 'analytics', label: "Insights" },
  ];

  const handleNavClick = (page) => {
    navigateTo(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-500 ease-in-out",
          scrolled ? "p-2 sm:p-3 md:p-4" : "p-0"
        )}
      >
        <div
          className={cn(
            "max-w-7xl mx-auto w-full transition-all duration-500 ease-in-out",
            scrolled 
              ? "bg-white/75 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.02)] rounded-full px-6 py-2.5" 
              : "bg-transparent border-b px-6 py-2.5"
          )}
          style={{ 
            borderColor: scrolled ? 'rgba(255,255,255,0.4)' : colors.border,
            backgroundColor: scrolled ? undefined : colors.background 
          }}
        >
          <div className="flex justify-between items-center">
            <img
              src={logo}
              alt="Closetry Logo"
              className="w-auto object-contain transition-all duration-500 ease-in-out hover:scale-105 flex-shrink-0"
              style={{ 
                height: window.innerWidth < 640 ? (scrolled ? 32 : 44) : (scrolled ? 40 : 56)
              }}
            />

            <div className="hidden md:flex items-center gap-12">
              <nav className="flex gap-8">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="text-sm font-light tracking-wider transition-colors duration-300 ease-in-out"
                    style={{
                      color: currentPage === item.id ? colors.accent : colors.body,
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="flex items-center pl-8 border-l transition-colors duration-500" style={{ borderColor: colors.border }}>
                <button
                  onClick={() => handleNavClick('profile')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-light tracking-wider transition-all duration-300 ease-in-out"
                  style={{
                    backgroundColor: currentPage === 'profile' ? colors.accent : colors.surfaceAlt,
                    color: currentPage === 'profile' ? 'white' : colors.heading,
                    borderRadius: scrolled ? '9999px' : undefined,
                  }}
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center flex-shrink-0 aspect-square border border-white/20 shadow-sm">
                    {headerPhoto ? (
                      <img 
                        src={headerPhoto} 
                        alt="Header Avatar" 
                        className="w-full h-full object-cover object-center aspect-square flex-shrink-0" 
                      />
                    ) : (
                      <span className="text-[9px] font-medium uppercase text-neutral-500">
                        {displayName ? displayName.charAt(0) : 'C'}
                      </span>
                    )}
                  </div>
                  <span>{displayName}</span>
                </button>
              </div>
            </div>

            <div className="md:hidden flex items-center gap-4 flex-shrink-0">
              <p className="text-[11px] font-light" style={{ color: colors.muted }}>
                {wardrobe.length} pieces
              </p>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{ color: colors.heading }}
                className="p-1 active:scale-95 transition-transform duration-200"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div 
            className="absolute left-4 right-4 mt-2 p-3 rounded-2xl shadow-xl flex flex-col gap-1.5 border md:hidden animate-in fade-in slide-in-from-top-2 duration-300 z-[9999]"
            style={{ backgroundColor: '#FAFAF8', borderColor: colors.border }}
          >
            <div className="flex items-center justify-between gap-3 p-2 rounded-xl" style={{ backgroundColor: colors.surfaceAlt }}>
              <button
                onClick={() => handleNavClick('profile')}
                className="flex items-center gap-2.5 flex-1 min-w-0 text-left transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center aspect-square border border-white shadow-sm flex-shrink-0">
                  {headerPhoto ? (
                    <img 
                      src={headerPhoto} 
                      alt="Header Avatar Mobile" 
                      className="w-full h-full object-cover object-center aspect-square flex-shrink-0" 
                    />
                  ) : (
                    <span className="text-xs font-medium uppercase text-neutral-500">
                      {displayName ? displayName.charAt(0) : 'C'}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium tracking-wide text-neutral-700 truncate">{displayName}</span>
              </button>
            </div>

            <div className="h-px my-0.5" style={{ backgroundColor: colors.border }} />

            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="block w-full text-left px-4 py-2.5 rounded-xl text-xs font-light tracking-wider transition-all duration-200"
                style={{
                  backgroundColor: currentPage === item.id ? colors.accent : colors.surfaceAlt,
                  color: currentPage === item.id ? 'white' : colors.heading,
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}