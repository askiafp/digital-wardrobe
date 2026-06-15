import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { colors } from '../constants';
import logo from '../../public/images/logo.png';
import { cn } from '@/lib/utils'; // Menggunakan utility cn bawaan projekmu
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

  // State lokal sinkronisasi value bahasa ke react-i18next
  const [currentLang, setCurrentLang] = useState(i18n?.language || 'en');

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

  // Menghubungkan label ke dictionary i18n menggunakan fungsi t()
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

  // Komponen dropdown bendera khusus JavaScript sesuai desain kodinganmu (Murni JS)
  function LanguageSelect({ mobile = false }) {
    const selectValue = currentLang.startsWith('id') ? 'Indonesian' : 'English';
    
    return (
      <Select value={selectValue} onValueChange={changeLanguage}>
        <SelectTrigger
          className={cn(
            "items-center gap-2 px-2 transition-colors border-0 rounded-full w-fit focus:ring-0 focus-visible:ring-0 shadow-none h-auto bg-transparent",
            mobile
              ? "flex text-gray-600 hover:bg-gray-100"
              : "hidden lg:flex text-gray-600 hover:bg-gray-100 mr-4"
          )}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white border rounded-xl shadow-lg min-w-[120px] z-[9999]">
          <SelectItem value="English" className="cursor-pointer">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/xl" id="flag-icons-gb" viewBox="0 0 640 480" className="in-data-[slot=select-trigger]:size-5 size-4 rounded-sm flex-shrink-0">
                <path fill="#012169" d="M0 0h640v480H0z" />
                <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0z" />
                <path fill="#C8102E" d="m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z" />
                <path fill="#FFF" d="M241 0v480h160V0zM0 160v160h640V160z" />
                <path fill="#C8102E" d="M0 193v96h640v-96zM273 0v480h96V0z" />
              </svg>
              <span className="in-data-[slot=select-trigger]:hidden text-sm font-light">English</span>
            </div>
          </SelectItem>
          <SelectItem value="Indonesian" className="cursor-pointer">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/xl" id="flag-icons-id" viewBox="0 0 640 480" className="in-data-[slot=select-trigger]:size-5 size-4 rounded-sm border flex-shrink-0">
                <path fill="#e70011" d="M0 0h640v240H0Z" />
                <path fill="#fff" d="M0 240h640v240H0Z" />
              </svg>
              <span className="in-data-[slot=select-trigger]:hidden text-sm font-light">Indonesian</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <>
      {/* Outer sticky wrapper: Tetap pakai class bawaan asli lu 'sticky top-0 z-40' */}
      <div
        className="sticky top-0 z-40 transition-all duration-500 w-full"
        style={{
          // Trik safety padding inline: mencegah kapsul meluber nabrak batas screen di mobile
          padding: scrolled ? '10px 16px' : (window.innerWidth < 768 ? '0px 16px' : '0'),
          backgroundColor: 'transparent',
        }}
      >
        {/* Inner pill */}
        <div
          className="max-w-7xl mx-auto transition-all duration-500"
          style={{
            backgroundColor: scrolled ? 'rgba(255,255,255,0.72)' : colors.background,
            backdropFilter: scrolled ? 'blur(18px) saturate(1.4)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(18px) saturate(1.4)' : 'none',
            borderRadius: scrolled ? '9999px' : '0',
            border: scrolled ? `1px solid rgba(255,255,255,0.55)` : `0px solid transparent`,
            borderBottom: scrolled ? `1px solid rgba(255,255,255,0.55)` : `1px solid ${colors.border}`,
            boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)' : 'none',
            padding: scrolled ? '10px 24px' : '6px 24px',
          }}
        >
          <div className="flex justify-between items-center">
            <img
              src={logo}
              alt="Closetry Logo"
              className="w-auto object-contain transition-all duration-500 hover:scale-105 flex-shrink-0"
              style={{ 
                height: window.innerWidth < 640 
                  ? (scrolled ? 36 : 48) 
                  : (scrolled ? 44 : 64)
              }}
            />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-12">
              <nav className="flex gap-8">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="text-sm font-light tracking-wider transition-colors duration-200"
                    style={{
                      color: currentPage === item.id ? colors.accent : colors.body,
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="flex items-center gap-6 pl-8 border-l" style={{ borderColor: colors.border }}>
                {/* Dropdown Bahasa - Desktop */}
                <LanguageSelect mobile={false} />

                <button
                  onClick={() => handleNavClick('profile')}
                  className="px-4 py-2 rounded-lg text-sm font-light tracking-wider transition-all duration-150"
                  style={{
                    backgroundColor: currentPage === 'profile' ? colors.accent : colors.surfaceAlt,
                    color: currentPage === 'profile' ? 'white' : colors.heading,
                    borderRadius: scrolled ? '9999px' : undefined,
                  }}
                >
                  {currentUser?.name || t('nav.profile')}
                </button>
              </div>
            </div>

            {/* Mobile Menu Button Controls */}
            <div className="md:hidden flex items-center gap-4 flex-shrink-0">
              <p className="text-[11px] font-light" style={{ color: colors.muted }}>
                {wardrobe.length} {t('header.pieces')}
              </p>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{ color: colors.heading }}
                className="p-1 active:scale-95 transition-transform"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Hamburger Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="absolute left-4 right-4 mt-2 p-4 rounded-2xl shadow-xl flex flex-col gap-2 border md:hidden animate-in fade-in slide-in-from-top-2 duration-200"
            style={{ 
              backgroundColor: '#FAFAF8', 
              borderColor: colors.border,
            }}
          >
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="block w-full text-left px-4 py-3 rounded-xl text-sm font-light tracking-wider transition-all duration-150"
                style={{
                  backgroundColor: currentPage === item.id ? colors.accent : colors.surfaceAlt,
                  color: currentPage === item.id ? 'white' : colors.heading,
                }}
              >
                {item.label}
              </button>
            ))}
            
            <div className="h-px my-1" style={{ backgroundColor: colors.border }} />

            <button
              onClick={() => handleNavClick('profile')}
              className="block w-full text-left px-4 py-3 rounded-xl text-sm font-light tracking-wider transition-all duration-150"
              style={{
                backgroundColor: currentPage === 'profile' ? colors.accent : colors.surfaceAlt,
                color: currentPage === 'profile' ? 'white' : colors.heading,
              }}
            >
              {currentUser?.name || t('nav.profile')}
            </button>

            {/* Dropdown Bahasa - Mobile Menu */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-xl border mt-1" style={{ borderColor: colors.border }}>
              <span className="text-xs font-light text-gray-400 uppercase tracking-wider">Language</span>
              <LanguageSelect mobile={true} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}