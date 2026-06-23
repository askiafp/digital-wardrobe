import React, { useState } from 'react';
import { colors } from '../constants';
import logo from '../../public/images/logo.png';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(false);

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
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 antialiased selection:bg-neutral-100"
      style={{ backgroundColor: colors.background }}
    >
      <div className="w-full max-w-[400px] mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">

        <div className="text-center space-y-4">
          <div className="flex justify-center w-full">
            <img
              src={logo}
              alt="Closetry Logo"
              className="h-12 sm:h-14 w-auto object-contain transition-transform duration-500"
            />
          </div>
          <p className="text-[10px] sm:text-xs tracking-[0.25em] uppercase font-light text-neutral-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Your digital luxury wardrobe
          </p>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="space-y-5 bg-white p-6 sm:p-8 rounded-2xl border border-neutral-100 shadow-[0_12px_40px_rgba(0,0,0,0.03)] w-full transition-all duration-300" 
          style={{ color: colors.body, fontFamily: 'DM Sans, sans-serif' }}
        >
          {[
            { id: 'name', label: 'Full Name', type: 'text', val: name, set: setName, show: isSignUp, icon: <User size={16} /> },
            { id: 'email', label: 'Email Address', type: 'email', val: email, set: setEmail, show: true, icon: <Mail size={16} /> },
            { id: 'password', label: 'Password', type: showPassword ? 'text' : 'password', val: password, set: setPassword, show: true, icon: <Lock size={16} /> },
          ].map((field) => field.show && (
            <div key={field.id} className="space-y-1.5">
              <label className="block text-[9px] sm:text-[10px] tracking-[0.15em] uppercase font-medium text-neutral-400 ml-0.5">
                {field.label}
              </label>
              
              <div className="relative flex items-center group">
                <div className="absolute left-4 text-neutral-300 group-focus-within:text-neutral-500 transition-colors duration-200 flex-shrink-0 pointer-events-none">
                  {field.icon}
                </div>
                
                <input
                  type={field.type}
                  value={field.val}
                  onChange={(e) => field.set(e.target.value)}
                  placeholder={field.id === 'email' ? 'your.email@example.com' : field.id === 'name' ? 'Enter your full name' : 'Enter your password'}
                  className={cn(
                    "w-full pl-11 py-3 rounded-xl border text-sm font-light bg-neutral-50/30 transition-all duration-200 placeholder:text-neutral-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200/60",
                    field.id === 'password' ? 'pr-11' : 'pr-4'
                  )}
                  style={{
                    borderColor:     colors.border,
                    color:           colors.heading,
                  }}
                />
                
                {field.id === 'password' && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 p-1 rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 active:scale-95 transition-all z-10"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
            </div>
          ))}

          {!isSignUp && (
            <div className="flex items-center justify-between pt-1 pb-1 text-xs select-none">
              <label className="flex items-center cursor-pointer font-light text-neutral-400 hover:text-neutral-600 transition-colors select-none">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-neutral-300 text-neutral-800 focus:ring-0 focus:ring-offset-0 accent-neutral-800 transition-all m-0 p-0 mr-2 flex-shrink-0" 
                />
                <span className="text-xs leading-none pt-[2px]">
                  Remember me
                </span>
              </label>
              <button 
                type="button"
                onClick={() => alert('Forgot password feature coming soon')}
                className="font-light text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 text-xs tracking-[0.2em] font-medium rounded-xl transition-all duration-300 shadow-sm hover:brightness-105 active:scale-[0.99] text-white mt-2"
            style={{ backgroundColor: colors.accent }}
          >
            {isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
          </button>
        </form>

        <div className="text-center space-y-5">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setName('');
              setEmail('');
              setPassword('');
            }}
            className="text-xs font-light tracking-[0.05em] text-neutral-400 hover:text-neutral-700 transition-colors underline underline-offset-4"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>

          <div className="flex items-center justify-center gap-3 w-full max-w-[200px] mx-auto opacity-40">
            <div className="h-px bg-neutral-400 flex-1" />
            <span className="text-[9px] tracking-wider uppercase font-medium">OR</span>
            <div className="h-px bg-neutral-400 flex-1" />
          </div>

          <div>
            <button
              onClick={handleGuest}
              className="text-[10px] tracking-[0.2em] font-light text-neutral-400 hover:text-neutral-600 border-b border-transparent hover:border-current transition-all"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              CONTINUE AS GUEST
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}