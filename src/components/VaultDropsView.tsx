import React, { useState } from 'react';
import { ARTISTS_DATA } from '../data/artists';
import { ArtistDrop } from '../types';
import { Sparkles, Check, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

interface VaultDropsViewProps {
  onMintPass: (drop: ArtistDrop) => void;
}

export const VaultDropsView: React.FC<VaultDropsViewProps> = ({ onMintPass }) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [mintedMap, setMintedMap] = useState<Record<string, boolean>>({});

  const drops = ARTISTS_DATA.map((a) => ({
    ...a.upcomingDrop,
    artistName: a.name,
    artistImage: a.image,
    accentColor: a.accentColor,
    glowRgba: a.glowRgba,
  }));

  const filteredDrops = filterType === 'All'
    ? drops
    : drops.filter((d) => d.type === filterType);

  const handleMint = (drop: typeof drops[0]) => {
    soundEngine.playClickTick();
    setMintedMap((prev) => ({ ...prev, [drop.id]: true }));
    onMintPass(drop);
  };

  return (
    <section className="relative z-10 py-10 max-w-7xl mx-auto px-6">
      <div className="pb-8 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <span>Primary Market</span>
            <span aria-hidden="true">·</span>
            <span>Cryptographic Proof</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white font-display mt-1">
            Exclusive Artist Vault Drops
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Tokenized master stems, backstage holographic passes, and couture pieces delivered directly from artist studios.
          </p>
        </div>

        {/* Filter Tabs (Interactive buttons allowed per constitution) */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md self-start md:self-auto">
          {['All', 'Audio Stem', 'Wearable', 'Hologram Pass', 'VIP Backstage'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                filterType === tab
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {filteredDrops.map((drop) => {
          const isMinted = mintedMap[drop.id];
          return (
            <div
              key={drop.id}
              className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] via-white/[0.02] to-[#070914]/90 backdrop-blur-2xl p-6 sm:p-7 shadow-[0_15px_45px_rgba(0,0,0,0.6)] flex flex-col justify-between transition-all duration-300 hover:border-white/20 group"
              style={{
                boxShadow: `0 10px 30px -10px ${drop.glowRgba}`,
              }}
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={drop.artistImage}
                      alt={drop.artistName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover object-top border border-white/20"
                    />
                    <div>
                      <p className="text-xs font-semibold text-white">{drop.artistName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{drop.releaseDate}</p>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-cyan-300 py-1 px-2.5 rounded-lg bg-cyan-400/10 border border-cyan-400/20">
                    {drop.rarity}
                  </span>
                </div>

                <div className="mt-5 space-y-1.5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    {drop.type}
                  </span>
                  <h3 className="text-xl font-bold text-white font-display group-hover:text-cyan-200 transition-colors">
                    {drop.title}
                  </h3>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Allocation Price</span>
                  <p className="text-lg font-bold font-mono text-white tabular-nums">
                    {drop.priceUsd} USDC
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleMint(drop)}
                  disabled={isMinted}
                  className={`h-11 px-5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    isMinted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/15 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  {isMinted ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Minted to Vault</span>
                    </>
                  ) : (
                    <>
                      <span>Acquire Drop</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
