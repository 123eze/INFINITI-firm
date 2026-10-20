import React, { useState } from 'react';
import { ArtistProfile, ArtistTier } from '../types';
import { X, Volume2, VolumeX, Sparkles, Calendar, Check, Send, ShieldCheck, Heart, Radio } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

interface ArtistPortalModalProps {
  artist: ArtistProfile | null;
  onClose: () => void;
  onMintPass: (tier: ArtistTier) => void;
  onOpenMeetupBooking?: (artist: ArtistProfile) => void;
}

export const ArtistPortalModal: React.FC<ArtistPortalModalProps> = ({
  artist,
  onClose,
  onMintPass,
  onOpenMeetupBooking,
}) => {
  if (!artist) return null;

  const [selectedTier, setSelectedTier] = useState<ArtistTier>(artist.tiers[1] || artist.tiers[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSessionDate, setSelectedSessionDate] = useState('2026-10-24');
  const [bookedSession, setBookedSession] = useState(false);
  const [fanMessage, setFanMessage] = useState('');
  const [sentMessages, setSentMessages] = useState<string[]>([
    'Welcome to the private sanctuary feed.',
  ]);

  const toggleSound = () => {
    if (isPlaying) {
      soundEngine.stop();
      setIsPlaying(false);
    } else {
      soundEngine.playFrequency(artist.audioFrequency.note, artist.audioFrequency.trackName, () => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClickTick();
    setBookedSession(true);
    setTimeout(() => setBookedSession(false), 4000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fanMessage.trim()) return;
    soundEngine.playClickTick();
    setSentMessages((prev) => [...prev, fanMessage.trim()]);
    setFanMessage('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Liquid Glass Backdrop with deep blur */}
      <div
        className="fixed inset-0 bg-[#04060d]/80 backdrop-blur-2xl transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Card with Specular Rim and Glowing Liquid Border */}
      <div
        className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.08] via-[#090d18]/95 to-[#05070e] backdrop-blur-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-6 sm:p-8 transition-all animate-in zoom-in-95 duration-200"
        style={{
          boxShadow: `0 0 70px -10px ${artist.glowRgba}, 0 20px 40px rgba(0,0,0,0.8)`,
        }}
      >
        {/* Top Specular Hairline */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer z-30"
          aria-label="Close portal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Content Header Split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Media Box */}
          <div className="md:col-span-5 space-y-4">
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] border border-white/15 bg-slate-950 shadow-2xl">
              <img
                src={artist.image}
                alt={artist.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              {/* Status on image */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-medium text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: artist.accentColor }} />
                <span>{artist.status.state}</span>
              </div>

              {/* Bottom stem frequency preview */}
              <div className="absolute bottom-3 inset-x-3 p-3 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-mono text-cyan-300 truncate max-w-[170px]">{artist.audioFrequency.trackName}</p>
                  <p className="text-[10px] text-slate-400">{artist.audioFrequency.bpm} BPM · Master Stem</p>
                </div>
                <button
                  type="button"
                  onClick={toggleSound}
                  className="p-2 rounded-lg bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-colors"
                >
                  {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Metrics (Zero-pill tabular nums) */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-white/[0.04] border border-white/10 text-center">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Rank</p>
                <p className="text-sm font-bold text-white font-mono tabular-nums">#{artist.metrics.fanRank}</p>
              </div>
              <div className="border-x border-white/10">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Listeners</p>
                <p className="text-sm font-bold text-cyan-300 font-mono tabular-nums">{artist.metrics.listenersMonthly}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Vault</p>
                <p className="text-sm font-bold text-white font-mono tabular-nums">{artist.metrics.vaultHolders}</p>
              </div>
            </div>
          </div>

          {/* Right Information & Action Panel */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-cyan-300 font-mono">
                <span>{artist.category}</span>
                <span aria-hidden="true">·</span>
                <span>{artist.genre}</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight font-display mt-1">
                {artist.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1">{artist.handle}</p>
              <p className="text-sm text-slate-300 leading-relaxed mt-3">
                {artist.bio}
              </p>
            </div>

            {/* Fan Loyalty Tiers Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Select Connection Tier
                </h4>
                <span className="text-xs text-cyan-300 font-mono">Instant Token Activation</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {artist.tiers.map((tier) => (
                  <button
                    key={tier.name}
                    type="button"
                    onClick={() => {
                      soundEngine.playClickTick();
                      setSelectedTier(tier);
                    }}
                    className={`p-3 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                      selectedTier.name === tier.name
                        ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                        : 'bg-white/[0.04] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-cyan-300">{tier.badge}</span>
                      {selectedTier.name === tier.name && (
                        <Check className="w-3.5 h-3.5 text-cyan-300" />
                      )}
                    </div>
                    <p className="text-xs font-bold text-white mt-1">{tier.name}</p>
                    <p className="text-xs text-slate-300 font-mono mt-1 tabular-nums">{tier.price}</p>
                  </button>
                ))}
              </div>

              {/* Selected Tier Perks */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <p className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Included in {selectedTier.name}:</span>
                </p>
                <ul className="text-xs text-slate-400 space-y-1 pl-5 list-disc">
                  {selectedTier.perks.map((perk, i) => (
                    <li key={i}>{perk}</li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onMintPass(selectedTier)}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.35)] transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>Mint {selectedTier.name} ({selectedTier.price})</span>
              </button>
            </div>

            {/* In-Person Meetup Engine: 4 Predefined Tiers with Dynamic Pricing */}
            {onOpenMeetupBooking && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-sky-500/10 to-indigo-500/10 border border-cyan-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>IN-PERSON MEETUP ENGINE</span>
                  </div>
                  <p className="text-xs text-white font-bold mt-0.5">
                    Meet & Greet · Dinner · Hangout · Visit
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Calculates dynamic time-urgency pricing based on your chosen date.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenMeetupBooking(artist);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 active:scale-95 text-slate-950 text-xs font-bold whitespace-nowrap shadow-[0_0_15px_rgba(0,240,255,0.3)] cursor-pointer"
                >
                  Configure Meetup
                </button>
              </div>
            )}

            {/* 1-on-1 VIP Hologram Booker */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Reserve 1-on-1 Holographic Studio Slot</span>
              </h4>

              {bookedSession ? (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Slot Confirmed for {selectedSessionDate} at 19:00 UTC. Holographic stream key generated.</span>
                </div>
              ) : (
                <form onSubmit={handleBookSession} className="flex gap-2">
                  <input
                    type="date"
                    value={selectedSessionDate}
                    onChange={(e) => setSelectedSessionDate(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-slate-200 outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="h-9 px-4 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    Request Slot
                  </button>
                </form>
              )}
            </div>

            {/* Direct Artist Fan Feed Simulator */}
            <div className="pt-4 border-t border-white/10 space-y-2.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-amber-400" />
                <span>Sanctuary Backstage Feed</span>
              </h4>
              <div className="max-h-24 overflow-y-auto space-y-1.5 p-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-slate-300 font-mono">
                {sentMessages.map((msg, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 shrink-0">&gt;</span>
                    <span className="break-all">{msg}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Send a direct note to artist backchannel..."
                  value={fanMessage}
                  onChange={(e) => setFanMessage(e.target.value)}
                  className="flex-1 h-9 px-3 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-slate-200 outline-none focus:border-cyan-400 placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  className="h-9 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-xs font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
