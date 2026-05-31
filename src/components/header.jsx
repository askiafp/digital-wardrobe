import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { colors } from '../constants';
import logo from '../../public/images/logo.png';

export default function Header({ currentPage, navigateTo, wardrobe, currentUser, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <div
        className="sticky top-0 z-40 border-b px-6 md:px-12 py-4"
        style={{ backgroundColor: colors.background, borderColor: colors.border }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <img 
            src={logo} 
            alt="Closetry Logo" 
            className="h-16 max-h-16 w-auto object-contain transition-transform duration-500 hover:scale-105" 
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
                    fontFamily: 'DM Sans, sans-serif' 
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* User Profile & Wardrobe Count */}
            <div className="flex items-center gap-6 pl-8 border-l" style={{ borderColor: colors.border }}>
              <button
                onClick={() => handleNavClick('profile')}
                className="px-4 py-2 rounded-lg text-sm font-light tracking-wider transition-all duration-150"
                style={{
                  backgroundColor: currentPage === 'profile' ? colors.accent : colors.surfaceAlt,
                  color: currentPage === 'profile' ? 'white' : colors.heading,
                }}
              >
                {currentUser?.name || 'Profile'}
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <p className="text-xs" style={{ color: colors.muted }}>
              {wardrobe.length} pieces
            </p>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ color: colors.heading }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden mt-4 space-y-3 pb-4"
            style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '16px' }}
          >
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="block w-full text-left px-4 py-3 rounded-lg text-sm font-light tracking-wider transition-all duration-150"
                style={{
                  backgroundColor: currentPage === item.id ? colors.accent : colors.surfaceAlt,
                  color: currentPage === item.id ? 'white' : colors.heading,
                }}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('profile')}
              className="block w-full text-left px-4 py-3 rounded-lg text-sm font-light tracking-wider transition-all duration-150"
              style={{
                backgroundColor: colors.surfaceAlt,
                color: colors.heading,
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