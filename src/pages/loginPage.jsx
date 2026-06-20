import React, { useState } from 'react';
import { colors } from '../constants';
import logo from '../../public/images/logo.png';

export default function LoginPage({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName]         = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }
    if (isSignUp && !name) {
      alert('Please enter your name');
      return;
    }

    onLogin({
      id:      email,                                      
      name:    isSignUp ? name : email.split('@')[0],
      email:   email,
      isGuest: false,
    });
  };

  const handleGuest = () => {
    onLogin({
      id:      'guest',
      name:    'Guest',
      email:   null,
      isGuest: true,
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{ backgroundColor: colors.background }}
    >
      <div className="w-full max-w-sm space-y-10">

        {/* Header */}
        <div className="text-center space-y-6">
          <div className="flex justify-center w-full">
            <img
              src={logo}
              alt="Closetry Logo"
              className="h-24 w-auto object-contain transition-transform duration-500"
            />
          </div>
          <p className="text-sm tracking-[0.2em] uppercase" style={{ color: colors.body, fontFamily: 'DM Sans, sans-serif' }}>
            Your digital luxury wardrobe
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl" style={{ color: colors.body, fontFamily: 'DM Sans, sans-serif' }}>
          {[
            { id: 'name',     label: 'Full Name',      type: 'text',     val: name,     set: setName,     show: isSignUp },
            { id: 'email',    label: 'Email Address',  type: 'email',    val: email,    set: setEmail,    show: true },
            { id: 'password', label: 'Password',       type: 'password', val: password, set: setPassword, show: true },
          ].map((field) => field.show && (
            <div key={field.id}>
              <label className="block text-[10px] tracking-[0.2em] uppercase mb-2 ml-1" style={{ color: colors.muted }}>
                {field.label}
              </label>
              <input
                type={field.type}
                value={field.val}
                onChange={(e) => field.set(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border text-sm font-light transition-all focus:ring-2 focus:ring-opacity-20"
                style={{
                  backgroundColor: colors.surface,
                  borderColor:     colors.border,
                  color:           colors.heading,
                }}
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-4 text-xs tracking-[0.2em] font-medium rounded-xl transition-all duration-300 
                      shadow-[0_4px_0_rgba(0,0,0,0.2)] 
                      hover:brightness-110 hover:shadow-none hover:translate-y-[4px] 
                      active:scale-[0.98]"
            style={{ backgroundColor: colors.accent, color: 'white' }}
          >
            {isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="text-center space-y-4">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-light tracking-[0.1em] underline underline-offset-4"
            style={{ color: colors.body, fontFamily: 'DM Sans, sans-serif' }}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>

          <div className="pt-6">
            <button
              onClick={handleGuest}
              className="text-[10px] tracking-[0.2em] font-light border-b border-transparent hover:border-current transition-all"
              style={{ color: colors.body, fontFamily: 'DM Sans, sans-serif' }}
            >
              CONTINUE AS GUEST
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}