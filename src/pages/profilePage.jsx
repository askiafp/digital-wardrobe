import React, { useState } from 'react';
import { colors } from '../constants';
import { useTranslation } from 'react-i18next';
import { Camera, Shirt, Calendar, Sparkles, User, Mail, Settings, ShieldAlert, LogOut } from 'lucide-react';

export default function ProfilePage({ currentUser, setCurrentUser, wardrobe = [], days = [], weeklyPlan = {}, onLogout }) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name: formData.name,
      email: formData.email,
    });
    setIsEditing(false);
  };

  const plannedDaysCount = days.filter(day => weeklyPlan && weeklyPlan[day.toLowerCase()]?.items?.length > 0).length;

  const eleganceScore = wardrobe?.length > 0 && plannedDaysCount > 0 
    ? ((plannedDaysCount / 7) * 10).toFixed(1) 
    : '0.0';

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen pb-24 sm:pb-32 font-sans antialiased text-gray-800">      
      {/* Banner */}
      <div 
        className="h-40 sm:h-56 md:h-80 w-full bg-cover bg-center relative"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.02), rgba(0,0,0,0.2)), url('/images/wardrobe.jpg')`,
          backgroundColor: '#F3F3EF' 
        }}
      >
        <div className="absolute inset-0 backdrop-blur-[0.5px]" />
      </div>

      {/* Main Content Container */}
      <div className="px-4 sm:px-6 md:px-12 -mt-16 sm:-mt-20 md:-mt-24 relative z-10">
        <div className="max-w-2xl mx-auto w-full space-y-6 sm:space-y-8">
          
          {/* Profile Header Card */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
              {/* Avatar & Info */}
              <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                {/* Avatar */}
                <div 
                  className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full border-4 shadow-sm flex items-center justify-center relative group overflow-hidden flex-shrink-0 transition-transform duration-500 hover:scale-105 bg-white"
                  style={{ borderColor: colors.background }}
                >
                  <span className="text-2xl sm:text-2xl md:text-3xl font-light text-neutral-400 font-serif tracking-tighter">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : 'C'}
                  </span>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer duration-300">
                    <Camera size={14} className="text-white" />
                  </div>
                </div>
                
                <div className="space-y-1 min-w-0">
                  <p className="text-[7px] sm:text-[8px] md:text-[9px] tracking-[0.1em] sm:tracking-[0.3em] uppercase font-semibold text-neutral-400 whitespace-nowrap">
                    Curation Vault Owner
                  </p>
                  <h1
                    className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight break-words"
                    style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}
                  >
                    {formData.name || 'Anonymous Curator'}
                  </h1>
                  <p className="text-xs sm:text-xs md:text-sm font-light text-neutral-400 tracking-wide truncate">
                    {formData.email || 'No email registered'}
                  </p>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] tracking-[0.2em] font-medium transition-all duration-300 uppercase border shadow-sm active:scale-95 whitespace-nowrap flex-shrink-0"
                style={{
                  backgroundColor: isEditing ? 'white' : colors.accent,
                  color: isEditing ? colors.heading : 'white',
                  borderColor: isEditing ? colors.border : 'transparent'
                }}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
              { 
                icon: <Shirt size={14} />, 
                count: wardrobe?.length || 0, 
                label: 'Pieces Cataloged', 
                isAccent: true 
              },
              { 
                icon: <Calendar size={14} />, 
                count: `${plannedDaysCount} / 7`, 
                label: 'Active Curations', 
                isAccent: false 
              },
              { 
                icon: <Sparkles size={14} />, 
                count: eleganceScore, 
                label: 'Elegance Quotient', 
                isAccent: false 
              },
            ].map((stat, i) => (
              <div 
                key={i} 
                className="p-4 sm:p-5 rounded-xl sm:rounded-2xl text-center border bg-white shadow-[0_4px_20px_rgba(0,0,0,0.01)] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md" 
                style={{ borderColor: colors.border }}
              >
                <div className="flex justify-center mb-2 text-neutral-300">{stat.icon}</div>
                <div 
                  className={stat.isAccent ? "text-3xl sm:text-4xl font-light" : "text-xl sm:text-2xl font-light"} 
                  style={{ 
                    color: stat.isAccent ? colors.accent : colors.heading, 
                    fontFamily: 'Cormorant Garamond, serif' 
                  }}
                >
                  {stat.count}
                </div>
                <div className="text-[7px] sm:text-[8px] tracking-[0.2em] uppercase text-neutral-400 mt-1.5 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div 
              className="rounded-2xl p-4 sm:p-6 md:p-8 border animate-in fade-in slide-in-from-top-4 duration-300 shadow-md bg-white" 
              style={{ borderColor: colors.border }}
            >
              <form onSubmit={handleSave} className="space-y-5">
                {/* Form Header */}
                <div className="flex items-center gap-2 pb-3 sm:pb-4 border-b" style={{ borderColor: colors.border }}>
                  <Settings size={13} className="text-neutral-400 flex-shrink-0" />
                  <h3 className="text-[8px] sm:text-[9px] tracking-[0.2em] uppercase font-bold text-neutral-400">Credentials Setup</h3>
                </div>
                
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-[8px] sm:text-[9px] tracking-[0.15em] uppercase font-semibold text-neutral-400 block ml-0.5">Full Name</label>
                  <div className="relative flex items-center">
                    <User size={14} className="absolute left-4 text-neutral-400 flex-shrink-0" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border text-sm font-light bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200 transition-all"
                      style={{ borderColor: colors.border, color: colors.heading }}
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-[8px] sm:text-[9px] tracking-[0.15em] uppercase font-semibold text-neutral-400 block ml-0.5">Email Address</label>
                  <div className="relative flex items-center">
                    <Mail size={14} className="absolute left-4 text-neutral-400 flex-shrink-0" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border text-sm font-light bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200 transition-all"
                      style={{ borderColor: colors.border, color: colors.heading }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-2.5 sm:py-3 sm:py-3.5 text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] rounded-lg sm:rounded-xl transition-all shadow-sm hover:brightness-105 active:scale-[0.99] mt-3"
                  style={{ backgroundColor: colors.accent, color: 'white' }}
                >
                  COMMIT CHANGES
                </button>
              </form>
            </div>
          )}

          {/* Preferences Section */}
          <div className="rounded-2xl p-4 sm:p-6 md:p-7 border bg-white shadow-[0_4px_20px_rgba(0,0,0,0.01)]" style={{ borderColor: colors.border }}>
            <h3 className="text-base sm:text-lg font-medium mb-4 tracking-tight" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}>
              Curation Workspace Preferences
            </h3>
            <div className="space-y-3">
              {/* Preference 1 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-neutral-100 bg-neutral-50/30">
                <div className="space-y-0.5 min-w-0">
                  <p className="font-normal text-xs sm:text-sm" style={{ color: colors.heading }}>Weekly Analytics Digest</p>
                  <p className="text-[10px] sm:text-xs text-neutral-400 font-light">Receive algorithmic wardrobe efficiency reporting</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-neutral-800 cursor-pointer focus:ring-0 flex-shrink-0" />
              </div>

              {/* Preference 2 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-neutral-100 bg-neutral-50/30">
                <div className="space-y-0.5 min-w-0">
                  <p className="font-normal text-xs sm:text-sm text-neutral-400">System Low-Light Mode</p>
                  <p className="text-[10px] sm:text-xs text-neutral-400 font-light">Dark interface matrix optimization</p>
                </div>
                <span className="text-[8px] tracking-wider uppercase font-bold text-neutral-300 bg-neutral-100 px-2 py-0.5 rounded-md flex-shrink-0">Soon</span>
              </div>
            </div>
          </div>

          {/* Danger Zone - Logout */}
          <div className="rounded-2xl p-4 sm:p-6 md:p-7 border bg-red-50/10 border-red-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 text-red-800">
              <ShieldAlert size={14} className="flex-shrink-0" />
              <h3 className="text-base sm:text-lg text-black font-medium tracking-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                De-authenticate Workspace
              </h3>
            </div>
            <button
              onClick={onLogout}
              className="w-full py-2.5 sm:py-3 sm:py-3.5 text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] rounded-lg sm:rounded-xl transition-all duration-300 hover:brightness-110 active:scale-[0.99] shadow-sm flex items-center justify-center gap-2"
              style={{ backgroundColor: '#800020', color: 'white' }}
            >
              <LogOut size={12} /> TERMINATE DISCOVERY SESSION
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}