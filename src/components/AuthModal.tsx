import React, { useState } from 'react';
import { X, Send, User, Lock, Phone } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (username: string) => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [phone, setPhone] = useState('0911223344');
  const [password, setPassword] = useState('******');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(phone || 'ZemaPlayer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-[#121824] border border-slate-800 rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h3 className="font-extrabold text-white text-lg">
            {mode === 'signin' ? 'Sign In to ZEMA BET' : 'Create ZEMA BET Account'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telegram Fast Login Promo */}
        <div className="p-5 space-y-4">
          <a
            href="https://t.me/tolobirrbot/start"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#2AABEE] hover:bg-[#229ED9] text-white font-bold rounded-xl transition shadow-md"
          >
            <Send className="w-4 h-4 fill-white" /> Quick Login via Telegram
          </a>

          <div className="flex items-center my-3">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="px-3 text-xs text-slate-500 uppercase font-semibold">Or with Phone</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Phone Number (Ethiopia)</label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="09... or 07..."
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-[#161e2e] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-amber-500"
                  required
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#161e2e] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-amber-500"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-base shadow-lg shadow-amber-500/20 transition active:scale-95"
            >
              {mode === 'signin' ? 'Sign In' : 'Register & Claim 200% Bonus'}
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-2">
            {mode === 'signin' ? (
              <span>
                Don't have an account?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="text-amber-400 font-bold hover:underline"
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  onClick={() => setMode('signin')}
                  className="text-amber-400 font-bold hover:underline"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
