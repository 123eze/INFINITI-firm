import React, { useState } from 'react';
import { UserProfile, SocialHandles } from '../types';
import { X, UserPlus, Sparkles, Check, AtSign, Phone, Mail, User, ShieldCheck } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveUser: (profile: UserProfile) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveUser,
}) => {
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [socials, setSocials] = useState<SocialHandles>({
    instagram: currentUser.socialHandles.instagram || '',
    twitter: currentUser.socialHandles.twitter || '',
    tiktok: currentUser.socialHandles.tiktok || '',
    telegram: currentUser.socialHandles.telegram || '',
    discord: currentUser.socialHandles.discord || '',
  });
  const [tier, setTier] = useState<UserProfile['tier']>(currentUser.tier);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full legal/patron name is required.';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid corporate or patron email is required.';
    if (!phone.trim()) errs.phone = 'Contact phone number is required.';
    if (!socials.instagram?.trim() && !socials.twitter?.trim() && !socials.telegram?.trim()) {
      errs.socials = 'At least one verified social handle is required for artist identification.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    soundEngine.playClickTick();
    const updatedUser: UserProfile = {
      ...currentUser,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      socialHandles: {
        instagram: socials.instagram?.trim(),
        twitter: socials.twitter?.trim(),
        tiktok: socials.tiktok?.trim(),
        telegram: socials.telegram?.trim(),
        discord: socials.discord?.trim(),
      },
      tier,
    };

    onSaveUser(updatedUser);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#04060e]/85 backdrop-blur-2xl transition-opacity" onClick={onClose} />

      {/* Glass Card */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.08] via-[#090d18]/98 to-[#05070e] backdrop-blur-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] p-6 sm:p-8">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
              <UserPlus className="w-4 h-4" />
              <span>ONBOARDING & PATRON IDENTITY REGISTRATION</span>
            </div>
            <h2 className="text-xl font-bold text-white font-display mt-0.5">
              INFINITI firm Account Profile
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Patron Identity Verified</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Your credentials and social handles have been cryptographically bound to your permanent account ledger.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            {/* Row 1: Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Full Legal / Patron Name *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Azara Yucil"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                />
                {errors.fullName && <p className="text-[11px] text-rose-400 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Email Address *</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. azara@soundguild.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                />
                {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Row 2: Phone Number & Patron Tier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Phone Number (SMS / Broadcast OTP) *</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +1 (415) 890-2184"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all font-mono"
                />
                {errors.phone && <p className="text-[11px] text-rose-400 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Patron Loyalty Tier</span>
                </label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as UserProfile['tier'])}
                  className="w-full h-10 px-3 rounded-xl bg-[#0b0e1b] border border-white/10 text-xs text-slate-200 outline-none focus:border-cyan-400"
                >
                  <option value="Obsidian Tier I">Obsidian Tier I (Stems & Merch)</option>
                  <option value="Astral Tier II">Astral Tier II (Holograms & VIP)</option>
                  <option value="Celestial Tier III">Celestial Tier III (Executive Studio)</option>
                </select>
              </div>
            </div>

            {/* Social Handles Section */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <AtSign className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Verified Social Handles (Artists & Influencer Verification) *</span>
                </span>
                <span className="text-[11px] text-slate-400">Used for shoutout delivery</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Instagram</span>
                  <input
                    type="text"
                    placeholder="@username"
                    value={socials.instagram}
                    onChange={(e) => setSocials({ ...socials, instagram: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">X / Twitter</span>
                  <input
                    type="text"
                    placeholder="@handle"
                    value={socials.twitter}
                    onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">TikTok</span>
                  <input
                    type="text"
                    placeholder="@handle"
                    value={socials.tiktok}
                    onChange={(e) => setSocials({ ...socials, tiktok: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Telegram / Discord</span>
                  <input
                    type="text"
                    placeholder="@telegram or name#0000"
                    value={socials.telegram}
                    onChange={(e) => setSocials({ ...socials, telegram: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
              {errors.socials && <p className="text-[11px] text-rose-400 mt-1">{errors.socials}</p>}
            </div>

            {/* Cryptographic Fan Pass info */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
              <span>Bound Fan Key:</span>
              <span className="text-cyan-300 font-bold">{currentUser.fanPassId}</span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(0,240,255,0.35)] transition-all active:scale-[0.98] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Save & Authenticate Ledger</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
