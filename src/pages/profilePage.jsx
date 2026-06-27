import React, { useState, useEffect, useRef } from 'react';
import { colors } from '../constants';
import { Camera, Shirt, Calendar, Sparkles, User, Mail, Settings, ShieldAlert, LogOut, ArrowLeft, UserCheck } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const getStorageKey = (user) =>
  `curation_vault_profile_${user?.id || user?.email || 'guest'}`;

const getPhotoKey = (user) =>
  `curation_vault_photo_${user?.id || user?.email || 'guest'}`;

const loadProfile = (user) => {
  try {
    const saved = localStorage.getItem(getStorageKey(user));
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return null;
};

const loadPhoto = (user) => {
  try {
    return localStorage.getItem(getPhotoKey(user)) || null;
  } catch (_) {
    return null;
  }
};

const defaultForm = (user, saved) => ({
  name: saved?.name ?? user?.name ?? '',
  email: saved?.email ?? user?.email ?? '',
  gender: saved?.gender ?? user?.gender ?? '',
});

export default function ProfilePage({ currentUser, setCurrentUser, wardrobe = [], days = [], weeklyPlan = {}, onLogout }) {
  const [isEditingPage, setIsEditingPage] = useState(false); 
  const [profilePhoto, setProfilePhoto] = useState(() => loadPhoto(currentUser));
  const [formData, setFormData] = useState(() => {
    const saved = loadProfile(currentUser);
    return defaultForm(currentUser, saved);
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const saved = loadProfile(currentUser);
    setFormData(defaultForm(currentUser, saved));
    setProfilePhoto(loadPhoto(currentUser));
    setIsEditingPage(false);
  }, [currentUser?.id, currentUser?.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem(getStorageKey(currentUser), JSON.stringify({
        name: formData.name,
        email: formData.email,
        gender: formData.gender,
      }));
    } catch (_) {}
    setCurrentUser({ ...currentUser, name: formData.name, email: formData.email, gender: formData.gender });
    setIsEditingPage(false); 
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran foto maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setProfilePhoto(dataUrl);
      try {
        localStorage.setItem(getPhotoKey(currentUser), dataUrl);
      } catch (_) {}
    };
    reader.readAsDataURL(file);
  };

  const plannedDaysCount = days.filter(day => weeklyPlan && weeklyPlan[day.toLowerCase()]?.items?.length > 0).length;

  const eleganceScore = wardrobe?.length > 0 && plannedDaysCount > 0
    ? ((plannedDaysCount / 7) * 10).toFixed(1)
    : '0.0';

  const genderOptions = [
    { value: 'prefer_not', label: 'Prefer not to say' },
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'nonbinary', label: 'Non-binary' },
    { value: 'other', label: 'Other' },
  ];

  if (isEditingPage) {
    return (
      <div style={{ backgroundColor: colors.background }} className="min-h-screen pt-6 pb-24 px-4 font-sans antialiased text-gray-800 animate-in fade-in duration-300">
        <div className="max-w-xl mx-auto w-full bg-white rounded-2xl p-6 md:p-8 border shadow-sm" style={{ borderColor: colors.border }}>
          
          <div className="flex items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: colors.border }}>
            <button 
              onClick={() => setIsEditingPage(false)}
              className="p-2 -ml-2 rounded-full hover:bg-neutral-100 transition-colors text-neutral-500"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 className="text-lg font-medium tracking-tight text-neutral-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Edit Profile Workspace
              </h2>
              <p className="text-xs text-neutral-400 font-light">Update your profile</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex flex-row items-center gap-5 bg-neutral-50/50 p-4 rounded-xl border border-dashed border-neutral-200">
              <div
                className="w-16 h-16 rounded-full border flex items-center justify-center overflow-hidden flex-shrink-0 bg-white aspect-square"
                style={{ borderColor: colors.border }}
              >
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover object-center aspect-square flex-shrink-0" />
                ) : (
                  <span className="text-2xl font-light text-neutral-400 font-serif">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : 'C'}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border bg-white transition-all hover:bg-neutral-50 active:scale-95 shadow-sm"
                    style={{ borderColor: colors.border, color: colors.heading }}
                  >
                    Upload Photo
                  </button>
                  {profilePhoto && (
                    <button
                      type="button"
                      onClick={() => {
                        setProfilePhoto(null);
                        try { localStorage.removeItem(getPhotoKey(currentUser)); } catch (_) {}
                      }}
                      className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors px-2 py-1.5"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-neutral-400 mt-1.5">Max 5MB · JPG, PNG, WebP</p>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-600 block ml-0.5">Full Name</label>
              <div className="relative flex items-center">
                <User size={16} className="absolute left-4 text-neutral-400 pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm font-light bg-neutral-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200 transition-all"
                  style={{ borderColor: colors.border, color: colors.heading }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-600 block ml-0.5">Email Address</label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-4 text-neutral-400 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm font-light bg-neutral-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200 transition-all"
                  style={{ borderColor: colors.border, color: colors.heading }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-600 block ml-0.5">Gender</label>
              <div className="relative flex items-center">
                <UserCheck size={16} className="absolute left-4 text-neutral-400 pointer-events-none z-10" />
                <Select
                  value={formData.gender || undefined}
                  onValueChange={(value) => handleChange({ target: { name: 'gender', value } })}
                >
                  <SelectTrigger
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm font-light bg-neutral-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200 transition-all text-left"
                    style={{ borderColor: colors.border, color: formData.gender ? colors.heading : '#a3a3a3' }}
                  >
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {genderOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t" style={{ borderColor: colors.border }}>
              <button
                type="button"
                onClick={() => setIsEditingPage(false)}
                className="flex-1 py-2.5 text-sm font-medium border rounded-xl transition-all hover:bg-neutral-50 active:scale-[0.99]"
                style={{ borderColor: colors.border, color: colors.heading }}
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 text-sm font-medium rounded-xl transition-all shadow-sm hover:brightness-105 active:scale-[0.99] text-white"
                style={{ backgroundColor: colors.accent }}
              >
                SAVE CHANGES
              </button>
            </div>
          </form>

        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen pb-24 sm:pb-32 font-sans antialiased text-gray-800 relative animate-in fade-in duration-300">
      <div
        className="h-40 sm:h-56 md:h-80 w-full bg-cover bg-center relative"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.02), rgba(0,0,0,0.2)), url('/images/wardrobe.jpg')`,
          backgroundColor: '#F3F3EF'
        }}
      >
        <div className="absolute inset-0 backdrop-blur-[0.5px]" />
      </div>

      <div className="px-4 sm:px-6 md:px-12 -mt-16 sm:-mt-20 md:-mt-24 relative z-10">
        <div className="max-w-2xl mx-auto w-full space-y-6 sm:space-y-8">

          <div className="bg-white/85 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
              <div className="flex items-center gap-4 sm:gap-6 min-w-0">

                <div className="relative flex-shrink-0 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24">
                  <div
                    className="w-full h-full rounded-full border-4 shadow-sm flex items-center justify-center overflow-hidden aspect-square bg-white"
                    style={{ borderColor: colors.background }}
                  >
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt="Profile"
                        className="w-full h-full object-cover object-center aspect-square flex-shrink-0"
                      />
                    ) : (
                      <span className="text-2xl sm:text-2xl md:text-3xl font-light text-neutral-400 font-serif tracking-tighter">
                        {formData.name ? formData.name.charAt(0).toUpperCase() : 'C'}
                      </span>
                    )}
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
                  {formData.gender && formData.gender !== 'prefer_not' && (
                    <p className="text-[10px] text-neutral-300 tracking-wide capitalize">
                      {genderOptions.find(g => g.value === formData.gender)?.label}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setIsEditingPage(true)} 
                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] tracking-[0.2em] font-medium transition-all duration-300 uppercase border shadow-sm active:scale-95 whitespace-nowrap flex-shrink-0"
                style={{
                  backgroundColor: colors.accent,
                  color: 'white',
                  borderColor: 'transparent'
                }}
              >
                Edit
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: <Shirt size={14} />, count: wardrobe?.length || 0, label: 'Pieces Cataloged', isAccent: true },
              { icon: <Calendar size={14} />, count: `${plannedDaysCount} / 7`, label: 'Active Curations', isAccent: false },
              { icon: <Sparkles size={14} />, count: eleganceScore, label: 'Elegance Quotient', isAccent: false },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-xl sm:rounded-2xl text-center border bg-white shadow-[0_4px_20px_rgba(0,0,0,0.01)] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md"
                style={{ borderColor: colors.border }}
              >
                <div className="flex justify-center mb-2 text-neutral-300">{stat.icon}</div>
                <div
                  className={stat.isAccent ? "text-3xl sm:text-4xl font-light" : "text-xl sm:text-2xl font-light"}
                  style={{ color: stat.isAccent ? colors.accent : colors.heading, fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {stat.count}
                </div>
                <div className="text-[7px] sm:text-[8px] tracking-[0.2em] uppercase text-neutral-400 mt-1.5 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-4 sm:p-6 md:p-7 border bg-white shadow-[0_4px_20px_rgba(0,0,0,0.01)]" style={{ borderColor: colors.border }}>
            <h3 className="text-base sm:text-lg font-medium mb-4 tracking-tight" style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}>
              Curation Workspace Preferences
            </h3>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-neutral-100 bg-neutral-50/30">
                <div className="space-y-0.5 min-w-0">
                  <p className="font-normal text-xs sm:text-sm" style={{ color: colors.heading }}>Weekly Analytics Digest</p>
                  <p className="text-[10px] sm:text-xs text-neutral-400 font-light">Receive algorithmic wardrobe efficiency reporting</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-neutral-800 cursor-pointer focus:ring-0 flex-shrink-0" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-neutral-100 bg-neutral-50/30">
                <div className="space-y-0.5 min-w-0">
                  <p className="font-normal text-xs sm:text-sm text-neutral-400">System Low-Light Mode</p>
                  <p className="text-[10px] sm:text-xs text-neutral-400 font-light">Dark interface matrix optimization</p>
                </div>
                <span className="text-[8px] tracking-wider uppercase font-bold text-neutral-300 bg-neutral-100 px-2 py-0.5 rounded-md flex-shrink-0">Soon</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-6 md:p-7 border bg-red-50/10 border-red-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 text-red-800">
              <ShieldAlert size={14} className="flex-shrink-0" />
              <h3 className="text-base sm:text-lg text-black font-medium tracking-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                De-authenticate Workspace
              </h3>
            </div>
            <button
              onClick={onLogout}
              className="w-full py-2.5 sm:py-3 text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] rounded-lg sm:rounded-xl transition-all duration-300 hover:brightness-110 active:scale-[0.99] shadow-sm flex items-center justify-center gap-2"
              style={{ backgroundColor: '#800020', color: 'white' }}
            >
              <LogOut size={12} /> LOGOUT
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}