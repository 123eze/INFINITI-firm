import React from 'react';
import { ShieldCheck, Award, Sparkles } from 'lucide-react';

export const CuratorsView: React.FC = () => {
  const curators = [
    {
      name: 'Elena Rostova',
      role: 'Chief Sonic Architect',
      organization: 'Aether Sound Guild, Berlin',
      quote: 'We verify every stem and analog frequency for genuine acoustic sovereignty before it reaches the INFINITI firm ledger.',
      location: 'Berlin / Kreuzberg',
    },
    {
      name: 'Lucia d’Este',
      role: 'Atelier Director',
      organization: 'Milan Contemporary Guild',
      quote: 'The intersection of bespoke runway tailoring and spatial sound creates an unprecedented level of emotional intimacy between visionary and patron.',
      location: 'Milan / Quadrilatero',
    },
    {
      name: 'Marcus Cole',
      role: 'Acoustic Master Engineer',
      organization: 'Horizon Sonic Institute',
      quote: 'Zero compression loss. What the artist performs in their Tokyo or London room is rendered byte-for-byte in your holographic playback.',
      location: 'London / Shoreditch',
    },
  ];

  return (
    <section className="relative z-10 py-10 max-w-7xl mx-auto px-6">
      <div className="pb-8 border-b border-white/10">
        <div className="text-xs font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
          <span>Acoustic Verification</span>
          <span aria-hidden="true">·</span>
          <span>Institutional Backing</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white font-display mt-1">
          Curatorial Board & Acoustic Guilds
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xl">
          Independent curators ensuring cryptographic integrity, audio fidelity, and exclusive allocations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {curators.map((c, i) => (
          <div
            key={i}
            className="p-6 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                &ldquo;{c.quote}&rdquo;
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10">
              <p className="text-sm font-bold text-white font-display">{c.name}</p>
              <p className="text-xs text-cyan-300 font-mono">{c.role}</p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                <span>{c.organization}</span>
                <span aria-hidden="true">·</span>
                <span>{c.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
