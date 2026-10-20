import React, { useEffect } from 'react';
import { Check, Sparkles, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="px-4 py-3 rounded-2xl bg-[#090d1b]/95 backdrop-blur-2xl border border-cyan-400/40 shadow-[0_10px_40px_rgba(0,240,255,0.25)] flex items-center gap-3 text-xs text-white">
        <span className="w-6 h-6 rounded-lg bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0">
          <Check className="w-3.5 h-3.5" />
        </span>
        <span className="font-medium pr-2">{message}</span>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
