import React, { useState } from 'react';
import { ArtistProfile } from '../types';
import { Play, Pause, Sparkles, ArrowRight, Film, Clapperboard, Youtube, Instagram, Video, SlidersHorizontal, Search } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

interface HeroSpotlightProps {
  featuredArtist: ArtistProfile;
  onOpenPortal: (artist: ArtistProfile) => void;
  onOpenMeetup?: (artist: ArtistProfile) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedPlatform: string;
  onSelectPlatform: (plat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const HeroSpotlight: React.FC<HeroSpotlightProps> = ({
  featuredArtist,
  onOpenPortal,
  onOpenMeetup,
  selectedCategory,
  onSelectCategory,
  selectedPlatform,
  onSelectPlatform,
  searchQuery,
  setSearchQuery,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Exclusively 3 main talent categories per specification (+ All)
  const mainCategories = [
    { id: 'All', label: 'All Talent', icon: Sparkles, count: '7' },
    { id: 'Actors', label: 'Actors', icon: Film, count: '2' },
    { id: 'Actresses', label: 'Actresses', icon: Clapperboard, count: '2' },
    { id: 'Online Influencers', label: 'Online Influencers', icon: Video, count: '3' },
  ];

  // Platform sub-filters for Online Influencers
  const influencerPlatforms = [
    { id: 'All', label: 'All Platforms', icon: SlidersHorizontal },
    { id: 'YouTube', label: 'YouTube', icon: Youtube, color: 'text-red-400' },
    { id: 'Instagram', label: 'Instagram', icon: Instagram, color: 'text-fuchsia-400' },
    { id: 'TikTok', label: 'TikTok', icon: Video, color: 'text-cyan-400' },
  ];

  const handleToggleAudio = () => {
    if (isPlaying) {
      soundEngine.stop();
      setIsPlaying(false);
    } else {
      soundEngine.playFrequency(featuredArtist.audioFrequency.note, featuredArtist.audioFrequency.trackName, () => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  return (
    <section className="relative z-10 pt-8 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Hero Spotlight Banner — Liquid Glassmorphism Showcase */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-[#060812]/95 backdrop-blur-3xl shadow-[0_20px_70px_-15px_rgba(0,0,0,0.75)] p-8 lg:p-10 transition-all duration-300">
          {/* Top specular hairline */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

          {/* Background Ambient Glow */}
          <div
            className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-[130px] pointer-events-none opacity-30"
            style={{ backgroundColor: featuredArtist.accentColor }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Editorial & Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              {/* Natural editorial kicker with clean metadata (zero pill) */}
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 tracking-wider uppercase">
                <span>Featured {featuredArtist.category.replace(/s$/, '')}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-300">{featuredArtist.genre}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-amber-400 font-semibold">Verified Talent Pool</span>
              </div>

              {/* Headline with balanced wrap */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display leading-[1.15] text-balance">
                Direct Cinema & Cultural Access to Global Talent.
              </h1>

              <p className="text-base text-slate-300/90 leading-relaxed max-w-2xl font-normal">
                INFINITI firm connects patrons directly with leading Actors, Actresses, and Online Influencers for private meetups, bespoke video shoutouts, and permanent cryptographic ledger interactions.
              </p>

              {/* Mechanism-to-Outcome Interactive Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onOpenPortal(featuredArtist)}
                  className="h-12 px-5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  <span>Enter {featuredArtist.name} Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {onOpenMeetup && (
                  <button
                    type="button"
                    onClick={() => onOpenMeetup(featuredArtist)}
                    className="h-12 px-5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-200 text-sm font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>Meetup Dynamic Pricing</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleToggleAudio}
                  className="h-12 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-slate-200 text-sm font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 text-cyan-300" />
                      <span>Pause Theme</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 text-cyan-300 fill-cyan-300" />
                      <span>Preview Theme Wave</span>
                    </>
                  )}
                </button>
              </div>

              {/* Social Proof Quote Adjacency */}
              <div className="pt-2 border-t border-white/[0.08] flex items-center gap-3 text-xs text-slate-400">
                <p className="italic text-slate-300">
                  &ldquo;{featuredArtist.socialProof.curatorQuote}&rdquo;
                </p>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="font-medium text-slate-400 whitespace-nowrap">
                  {featuredArtist.socialProof.curatorName}, {featuredArtist.socialProof.curatorOrg}
                </span>
              </div>
            </div>

            {/* Right Column: Featured Artist Media Card with Liquid Glass Refraction */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-slate-950 shadow-[0_15px_40px_rgba(0,0,0,0.8)] aspect-[4/5] group">
                <img
                  src={featuredArtist.image}
                  alt={featuredArtist.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* Live Badge in Glass Scrim */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold tracking-wide">{featuredArtist.status.state}</span>
                </div>

                {/* Floating Glass Meta at bottom */}
                <div className="absolute bottom-4 inset-x-4 z-20 p-4 rounded-xl bg-white/[0.08] backdrop-blur-xl border border-white/15 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-lg text-white font-display">{featuredArtist.name}</h4>
                      <p className="text-xs text-cyan-300 font-mono">{featuredArtist.title}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-300 font-mono tabular-nums">{featuredArtist.metrics.listenersMonthly}</span>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">{featuredArtist.category}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Talent Category & Platform Filter Bar — Liquid Glass Segmented Controls */}
        <div className="mt-10 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Main Category Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md overflow-x-auto scrollbar-none">
              {mainCategories.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playClickTick();
                      onSelectCategory(cat.id);
                      if (cat.id !== 'Online Influencers' && cat.id !== 'All') {
                        onSelectPlatform('All');
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/25 to-blue-500/25 text-white shadow-[0_0_20px_rgba(0,240,255,0.2)] border border-cyan-400/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300' : 'text-slate-500'}`} />
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isActive ? 'bg-cyan-400/20 text-cyan-200' : 'bg-white/5 text-slate-500'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Search Input */}
            <div className="relative sm:w-72">
              <input
                type="text"
                placeholder="Search actor, actress, creator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 px-4 pl-10 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 backdrop-blur-md outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40 transition-all"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Sub-Filters for Online Influencers: Platform Segmented Controls */}
          {(selectedCategory === 'Online Influencers' || selectedCategory === 'All') && (
            <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-2xl bg-gradient-to-r from-white/[0.03] to-white/[0.01] border border-white/[0.08] backdrop-blur-xl">
              <span className="text-xs text-slate-400 font-medium px-2 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Platform Sub-Filter:</span>
              </span>

              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                {influencerPlatforms.map((plat) => {
                  const Icon = plat.icon;
                  const isActive = selectedPlatform === plat.id;
                  return (
                    <button
                      key={plat.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playClickTick();
                        onSelectPlatform(plat.id);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-white/15 text-white border border-white/25 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${plat.color || (isActive ? 'text-cyan-300' : 'text-slate-500')}`} />
                      <span>{plat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
