import React, { useState } from 'react';
import { colors } from '../constants';

export default function ProfilePage({ currentUser, setCurrentUser, onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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

  return (
    <div style={{ backgroundColor: colors.background }}>
      <div className="px-6 md:px-12 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-12">
            <h1
              className="text-5xl font-light mb-2"
              style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}
            >
              Your Profile
            </h1>
            <p style={{ color: colors.muted }}>
              Manage your account settings
            </p>
          </div>

          {/* Profile Card */}
          <div
            className="rounded-2xl p-8 mb-8"
            style={{ backgroundColor: colors.surface }}
          >
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs tracking-widest uppercase mb-2" style={{ color: colors.muted }}>
                    Account Information
                  </p>
                  <h2
                    className="text-3xl font-light"
                    style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}
                  >
                    {formData.name}
                  </h2>
                  <p style={{ color: colors.body, marginTop: '8px' }}>
                    {formData.email}
                  </p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 rounded-lg text-sm font-light tracking-wider transition-all duration-150"
                  style={{
                    backgroundColor: isEditing ? colors.border : colors.accent,
                    color: isEditing ? colors.heading : 'white',
                  }}
                >
                  {isEditing ? 'CANCEL' : 'EDIT'}
                </button>
              </div>

              {/* Edit Form */}
              {isEditing && (
                <form onSubmit={handleSave} className="space-y-6 border-t pt-6" style={{ borderColor: colors.border }}>
                  <div>
                    <label
                      className="block text-xs tracking-widest uppercase mb-3"
                      style={{ color: colors.muted }}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border text-sm font-light"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                        color: colors.heading,
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-xs tracking-widest uppercase mb-3"
                      style={{ color: colors.muted }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border text-sm font-light"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                        color: colors.heading,
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 text-sm font-light tracking-widest rounded-lg transition-all duration-150"
                    style={{
                      backgroundColor: colors.accent,
                      color: 'white',
                    }}
                  >
                    SAVE CHANGES
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Settings Section */}
          <div
            className="rounded-2xl p-8 mb-8"
            style={{ backgroundColor: colors.surface }}
          >
            <h3
              className="text-xl font-light mb-6"
              style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}
            >
              Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: colors.background }}>
                <div>
                  <p className="font-light text-sm" style={{ color: colors.heading }}>
                    Email Notifications
                  </p>
                  <p className="text-xs" style={{ color: colors.muted }}>
                    Receive outfit suggestions and weekly style tips
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: colors.background }}>
                <div>
                  <p className="font-light text-sm" style={{ color: colors.heading }}>
                    Dark Mode
                  </p>
                  <p className="text-xs" style={{ color: colors.muted }}>
                    Coming soon
                  </p>
                </div>
                <input type="checkbox" disabled className="w-5 h-5 opacity-50" />
              </div>
            </div>
          </div>

          {/* About Section */}
          <div
            className="rounded-2xl p-8 mb-8"
            style={{ backgroundColor: colors.surface }}
          >
            <h3
              className="text-xl font-light mb-6"
              style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}
            >
              About Closetry
            </h3>
            <p style={{ color: colors.body, marginBottom: '16px', lineHeight: 1.8 }}>
              Closetry is a luxury digital wardrobe designed to help you reconnect with the clothes you already own.
              Organize, plan, and style with intention.
            </p>
            <div className="space-y-2 text-sm">
              <p style={{ color: colors.muted }}>
                Version 1.0.0
              </p>
              <p style={{ color: colors.muted }}>
                © 2024 Closetry. All rights reserved.
              </p>
            </div>
          </div>

          {/* Danger Zone */}
          <div
            className="rounded-2xl p-8 border-2"
            style={{ backgroundColor: colors.background, borderColor: colors.border }}
          >
            <h3
              className="text-xl font-light mb-4"
              style={{ fontFamily: 'Cormorant Garamond, serif', color: colors.heading }}
            >
              Danger Zone
            </h3>
            <p style={{ color: colors.body, marginBottom: '16px' }}>
              Once you log out, you'll need to sign in again to access your wardrobe.
            </p>
            <button
              onClick={onLogout}
              className="w-full py-3 text-sm font-light tracking-widest rounded-lg transition-all duration-150"
              style={{
                backgroundColor: '#E8B4B8',
                color: 'white',
              }}
            >
              SIGN OUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}