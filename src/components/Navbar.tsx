import React from 'react';
import { KeyRound, Layers, User, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSpecs: () => void;
  onConnectWallet: () => void;
  isConnected: boolean;
  walletAddress: string;
  user: UserProfile;
  onOpenRegistration: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSpecs,
  onConnectWallet,
  isConnected,
  walletAddress,
  user,
  onOpenRegistration,
}) => {
  const navItems = [
    { id: 'roster', label: 'Featured Roster' },
    { id: 'backstages', label: 'Live Backstages' },
    { id: 'drops', label: 'Vault Drops' },
    { id: 'ledger', label: 'Account Ledger' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#05070e]/70 border-b border-white/[0.08] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element, zero pill badge attachment) */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('roster');
            }}
            className="text-xl font-extrabold tracking-wider text-white hover:text-cyan-200 transition-colors whitespace-nowrap font-display flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-tr from-cyan-400 to-indigo-500 shadow-[0_0_10px_rgba(0,240,255,0.7)]" />
            <span>INFINITI</span>
            <span className="text-xs font-light text-slate-400 tracking-widest uppercase">FIRM</span>
          </a>
        </div>

        {/* Zone 2: 4 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative py-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === item.id
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{item.label}</span>
              {activeTab === item.id && (
                <span className="absolute -bottom-2 inset-x-0 h-0.5 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
              )}
            </button>
          ))}
          <button
            onClick={onOpenSpecs}
            className="text-xs font-mono text-cyan-300/80 hover:text-cyan-200 flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture & CSS</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* User Profile Quick Trigger */}
          <button
            onClick={onOpenRegistration}
            className="hidden sm:flex items-center gap-2 h-10 px-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-slate-200 transition-all cursor-pointer"
            title="Edit Patron Registration Profile"
          >
            <div className="w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center font-bold text-[10px]">
              {user.fullName.charAt(0)}
            </div>
            <span className="font-semibold text-white max-w-[110px] truncate">{user.fullName}</span>
          </button>

          {/* Fan Key Connect */}
          <button
            onClick={onConnectWallet}
            className="h-10 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98] text-xs font-semibold text-slate-950 transition-all duration-200 whitespace-nowrap shrink-0 flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.35)]"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{isConnected ? walletAddress : 'Connect Fan Pass'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
