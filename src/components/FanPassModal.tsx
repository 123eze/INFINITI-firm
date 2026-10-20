import React, { useState } from 'react';
import { X, KeyRound, Check, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

interface FanPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
  walletAddress: string;
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}

export const FanPassModal: React.FC<FanPassModalProps> = ({
  isOpen,
  onClose,
  isConnected,
  walletAddress,
  onConnect,
  onDisconnect,
}) => {
  const [selectedWallet, setSelectedWallet] = useState('PassKey');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleConnectSim = (provider: string) => {
    setIsProcessing(true);
    soundEngine.playClickTick();
    setTimeout(() => {
      setIsProcessing(false);
      onConnect(`0x${Math.random().toString(16).substring(2, 6).toUpperCase()}...${Math.random().toString(16).substring(2, 6).toUpperCase()}`);
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-[#04060d]/80 backdrop-blur-xl" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/15 bg-gradient-to-b from-[#0c1020] via-[#070914] to-[#04060c] backdrop-blur-3xl shadow-[0_20px_70px_rgba(0,0,0,0.85)] p-6 sm:p-7">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-display">INFINITI Fan Pass Vault</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isConnected ? (
          <div className="py-6 space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              <Check className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Authenticated Fan Key</p>
              <p className="text-lg font-bold font-mono text-white mt-0.5">{walletAddress}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 text-left space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Patron Tier:</span>
                <span className="text-cyan-300">Astral VIP (Tier II)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vault Tokens:</span>
                <span className="text-white">1,240 USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Network:</span>
                <span className="text-emerald-400">Arbitrum One (Low Latency)</span>
              </div>
            </div>
            <button
              onClick={() => {
                onDisconnect();
                onClose();
              }}
              className="w-full h-10 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-300 border border-white/10 text-xs font-semibold text-slate-300 transition-colors"
            >
              Disconnect Fan Key
            </button>
          </div>
        ) : (
          <div className="py-6 space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Authenticate your identity to unlock unreleased master stems, 1-on-1 hologram studio slots, and exclusive drops.
            </p>

            <div className="space-y-2">
              {[
                { name: 'Apple / Google Passkey', desc: 'Hardware biometric token', id: 'PassKey' },
                { name: 'Ethereum / Arbitrum Wallet', desc: 'MetaMask, Coinbase, Rainbow', id: 'Web3' },
                { name: 'VIP Guest Session', desc: 'Instant read-only trial pass', id: 'Guest' },
              ].map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => handleConnectSim(provider.id)}
                  disabled={isProcessing}
                  className="w-full p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 flex items-center justify-between text-left transition-all cursor-pointer group"
                >
                  <div>
                    <p className="text-xs font-semibold text-white group-hover:text-cyan-200 transition-colors">
                      {provider.name}
                    </p>
                    <p className="text-[11px] text-slate-400">{provider.desc}</p>
                  </div>
                  <Sparkles className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </button>
              ))}
            </div>

            {isProcessing && (
              <p className="text-xs text-cyan-300 text-center animate-pulse font-mono">
                Authenticating hardware passkey signature...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
