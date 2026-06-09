import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { colors } from '../constants';
import logo from '../../public/images/logo.png';

export default function Header({ currentPage, navigateTo, wardrobe, currentUser, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'wardrobe', label: 'Wardrobe' },
    { id: 'styling', label: 'Styling' },
    { id: 'planner', label: 'Planner' },
    { id: 'analytics', label: 'Insights' },
  ];

  const handleNavClick = (page) => {
    navigateTo(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Outer sticky wrapper */}
      <div
        className="sticky top-0 z-40 transition-all duration-500"
        style={{
          padding: scrolled ? '10px 16px' : '0',
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
            padding: scrolled ? '10px 24px' : '16px 24px',
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
                <button
                  onClick={() => handleNavClick('profile')}
                  className="px-4 py-2 rounded-lg text-sm font-light tracking-wider transition-all duration-150"
                  style={{
                    backgroundColor: currentPage === 'profile' ? colors.accent : colors.surfaceAlt,
                    color: currentPage === 'profile' ? 'white' : colors.heading,
                    borderRadius: scrolled ? '9999px' : undefined,
                  }}
                >
                  {currentUser?.name || 'Profile'}
                </button>
              </div>
            </div>

            {/* Mobile Menu Button Controls */}
            <div className="md:hidden flex items-center gap-4 flex-shrink-0">
              <p className="text-[11px] font-light" style={{ color: colors.muted }}>
                {wardrobe.length} pieces
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
              {currentUser?.name || 'Profile'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}