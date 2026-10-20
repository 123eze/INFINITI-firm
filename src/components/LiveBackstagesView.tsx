import React, { useState } from 'react';
import { ARTISTS_DATA } from '../data/artists';
import { Radio, Volume2, VolumeX, Users, MessageSquare, Send, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

export const LiveBackstagesView: React.FC = () => {
  const [activeArtistIndex, setActiveArtistIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [comments, setComments] = useState<{ user: string; text: string; time: string }[]>([
    { user: 'SORA_09', text: 'The analog reverb decay on this channel is sublime...', time: '1m ago' },
    { user: 'Vesper_AI', text: 'Is this the 96kHz master stream from Tokyo?', time: '3m ago' },
    { user: 'Kaelen', text: 'Tier II members getting the lathe cut next month!', time: '5m ago' },
  ]);
  const [inputVal, setInputVal] = useState('');

  const currentArtist = ARTISTS_DATA[activeArtistIndex];

  const handleToggleAudio = () => {
    if (isPlaying) {
      soundEngine.stop();
      setIsPlaying(false);
    } else {
      soundEngine.playFrequency(currentArtist.audioFrequency.note, currentArtist.audioFrequency.trackName, () => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    soundEngine.playClickTick();
    setComments((prev) => [
      { user: 'You (VIP Key)', text: inputVal.trim(), time: 'Just now' },
      ...prev,
    ]);
    setInputVal('');
  };

  return (
    <section className="relative z-10 py-10 max-w-7xl mx-auto px-6">
      <div className="pb-8 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <span>Direct Studio Relays</span>
            <span aria-hidden="true">·</span>
            <span>Zero Latency</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white font-display mt-1">
            Live Backstage Broadcasts
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Real-time acoustic feeds from artist modular rigs, rehearsal spaces, and Paris ateliers.
          </p>
        </div>

        {/* Artist Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none p-1 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
          {ARTISTS_DATA.map((artist, idx) => (
            <button
              key={artist.id}
              onClick={() => {
                soundEngine.stop();
                setIsPlaying(false);
                setActiveArtistIndex(idx);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeArtistIndex === idx
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {artist.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Stream Viewport */}
        <div className="lg:col-span-8 rounded-3xl overflow-hidden border border-white/15 bg-slate-950 shadow-[0_20px_60px_rgba(0,0,0,0.85)] relative aspect-[16/10] flex flex-col justify-between p-6">
          <img
            src={currentArtist.image}
            alt={currentArtist.name}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-top opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />

          {/* Top Bar inside stream */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/15 text-xs text-white">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="font-semibold tracking-wide">LIVE</span>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span className="text-slate-300 font-mono">{currentArtist.status.detail}</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-black/65 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full">
              <Users className="w-3.5 h-3.5 text-cyan-300" />
              <span className="tabular-nums">1,492 Listening</span>
            </div>
          </div>

          {/* Bottom Stream Controls */}
          <div className="relative z-10 p-5 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white font-display">{currentArtist.name}</h3>
              <p className="text-xs text-cyan-300 font-mono mt-0.5">
                Frequency: {currentArtist.audioFrequency.trackName} ({currentArtist.audioFrequency.bpm} BPM)
              </p>
            </div>

            <button
              onClick={handleToggleAudio}
              className="h-10 px-5 rounded-xl bg-cyan-400 hover:bg-cyan-300 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer shrink-0"
            >
              {isPlaying ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Mute Broadcast</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Listen to Live Audio Stream</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Backstage Chat & Reactions */}
        <div className="lg:col-span-4 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6 shadow-xl flex flex-col justify-between h-[450px] lg:h-auto">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Sanctuary Backchannel</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">Low-Latency Mesh</span>
            </div>

            <div className="space-y-3 mt-4 max-h-[300px] overflow-y-auto pr-1">
              {comments.map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-cyan-300 font-semibold">{c.user}</span>
                    <span className="text-[10px] text-slate-500">{c.time}</span>
                  </div>
                  <p className="text-xs text-slate-200">{c.text}</p>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSend} className="mt-4 pt-3 border-t border-white/10 flex gap-2">
            <input
              type="text"
              placeholder="Send message to stream..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 h-9 px-3 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="h-9 px-3.5 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center hover:bg-cyan-300 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
