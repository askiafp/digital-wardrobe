import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { colors } from '../constants';
import logo from '../../public/images/logo.png';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Header({ currentPage, navigateTo, wardrobe, currentUser, onLogout }) {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n?.language || 'en');
  const [displayName, setDisplayName] = useState(t('nav.profile'));
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
    setDisplayName(t('nav.profile'));
  }, [currentUser, t, currentPage]);

  const navItems = [
    { id: 'home', label: t('nav.home') },
    { id: 'wardrobe', label: t('nav.wardrobe') },
    { id: 'styling', label: t('nav.styling') },
    { id: 'planner', label: t('nav.planner') },
    { id: 'analytics', label: t('nav.analytics') },
  ];

  const handleNavClick = (page) => {
    navigateTo(page);
    setIsMobileMenuOpen(false);
  };

  const changeLanguage = (lng) => {
    const langCode = lng === 'English' ? 'en' : 'id';
    i18n.changeLanguage(langCode);
    setCurrentLang(langCode);
  };

  function LanguageSelect({ mobile = false }) {
    const selectValue = currentLang.startsWith('id') ? 'Indonesian' : 'English';
    
    return (
      <Select value={selectValue} onValueChange={changeLanguage}>
        <SelectTrigger
          className={cn(
            "items-center gap-2 px-2 transition-colors border-0 rounded-full w-fit focus:ring-0 focus-visible:ring-0 shadow-none h-auto bg-transparent",
            mobile ? "flex text-gray-600 hover:bg-gray-100" : "hidden lg:flex text-gray-600 hover:bg-gray-100 mr-4"
          )}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white border rounded-xl shadow-lg min-w-[120px] z-[9999]">
          <SelectItem value="English" className="cursor-pointer">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/xl" id="flag-icons-gb" viewBox="0 0 640 480" className="size-4 rounded-sm flex-shrink-0">
                <path fill="#012169" d="M0 0h640v480H0z" />
                <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0z" />
                <path fill="#C8102E" d="m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z" />
                <path fill="#FFF" d="M241 0v480h160V0zM0 160v160h640V160z" />
                <path fill="#C8102E" d="M0 193v96h640v-96zM273 0v480h96V0z" />
              </svg>
              <span className="text-sm font-light">English</span>
            </div>
          </SelectItem>
          <SelectItem value="Indonesian" className="cursor-pointer">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/xl" id="flag-icons-id" viewBox="0 0 640 480" className="size-4 rounded-sm border flex-shrink-0">
                <path fill="#e70011" d="M0 0h640v240H0Z" />
                <path fill="#fff" d="M0 240h640v240H0Z" />
              </svg>
              <span className="text-sm font-light">Indonesian</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    );
  }

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

              <div className="flex items-center gap-6 pl-8 border-l transition-colors duration-500" style={{ borderColor: colors.border }}>
                <LanguageSelect mobile={false} />

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
                {wardrobe.length} {t('header.pieces')}
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
            className="absolute left-4 right-4 mt-2 p-4 rounded-2xl shadow-xl flex flex-col gap-2 border md:hidden animate-in fade-in slide-in-from-top-2 duration-300"
            style={{ backgroundColor: '#FAFAF8', borderColor: colors.border }}
          >
            <button
              onClick={() => handleNavClick('profile')}
              className="flex flex-col items-center justify-center w-full gap-2 p-4 rounded-xl text-sm font-light tracking-wider transition-all duration-200"
              style={{
                backgroundColor: currentPage === 'profile' ? colors.accent : colors.surfaceAlt,
                color: currentPage === 'profile' ? 'white' : colors.heading,
              }}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center aspect-square border-2 border-white shadow-md flex-shrink-0">
                {headerPhoto ? (
                  <img 
                    src={headerPhoto} 
                    alt="Header Avatar Mobile" 
                    className="w-full h-full object-cover object-center aspect-square flex-shrink-0" 
                  />
                ) : (
                  <span className="text-sm font-medium uppercase text-neutral-500">
                    {displayName ? displayName.charAt(0) : 'C'}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium tracking-wide mt-1">{displayName}</span>
            </button>

            <div className="h-px my-1" style={{ backgroundColor: colors.border }} />

            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="block w-full text-left px-4 py-3 rounded-xl text-sm font-light tracking-wider transition-all duration-200"
                style={{
                  backgroundColor: currentPage === item.id ? colors.accent : colors.surfaceAlt,
                  color: currentPage === item.id ? 'white' : colors.heading,
                }}
              >
                {item.label}
              </button>
            ))}
            
            <div className="h-px my-1" style={{ backgroundColor: colors.border }} />

            <div className="flex items-center justify-end py-1 mt-1 w-full pr-2">
              <LanguageSelect mobile={true} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}