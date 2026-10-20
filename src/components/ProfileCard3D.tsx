import React, { useState, useRef, useCallback } from 'react';
import { ArtistProfile } from '../types';
import { Volume2, VolumeX, Sparkles, ArrowUpRight, Ticket, Film, Clapperboard, Youtube, Instagram, Video } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

interface ProfileCard3DProps {
  artist: ArtistProfile;
  onOpenPortal: (artist: ArtistProfile) => void;
  onQuickPass: (artist: ArtistProfile) => void;
}

export const ProfileCard3D: React.FC<ProfileCard3DProps> = ({
  artist,
  onOpenPortal,
  onQuickPass,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    glareX: 50,
    glareY: 50,
    isHovered: false,
  });
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // 3D Tilt calculation with dynamic enlargement against live background
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Normalizing coordinates between -1 and 1
    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;

    const maxRotation = 14; // degrees for responsive 3D perspective
    const rotateY = normX * maxRotation;
    const rotateX = -normY * maxRotation;

    setTilt({
      rotateX,
      rotateY,
      scale: 1.06, // Dynamic enlargement on hover
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      isHovered: true,
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    soundEngine.playClickTick();
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      glareX: 50,
      glareY: 50,
      isHovered: false,
    });
  }, []);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlayingAudio) {
      soundEngine.stop();
      setIsPlayingAudio(false);
    } else {
      soundEngine.playFrequency(artist.audioFrequency.note, artist.audioFrequency.trackName, () => {
        setIsPlayingAudio(false);
      });
      setIsPlayingAudio(true);
    }
  };

  // Platform icon helper
  const renderPlatformBadge = () => {
    if (artist.platform === 'YouTube') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/15 border border-red-500/30 text-red-300 font-mono text-[10px]">
          <Youtube className="w-3 h-3 text-red-400" />
          <span>YouTube</span>
        </span>
      );
    }
    if (artist.platform === 'Instagram') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-fuchsia-500/15 border border-fuchsia-500/30 text-fuchsia-300 font-mono text-[10px]">
          <Instagram className="w-3 h-3 text-fuchsia-400" />
          <span>Instagram</span>
        </span>
      );
    }
    if (artist.platform === 'TikTok') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-[10px]">
          <Video className="w-3 h-3 text-cyan-400" />
          <span>TikTok</span>
        </span>
      );
    }
    if (artist.category === 'Actors') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-500/30 text-sky-300 font-mono text-[10px]">
          <Film className="w-3 h-3 text-sky-400" />
          <span>Actor</span>
        </span>
      );
    }
    if (artist.category === 'Actresses') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px]">
          <Clapperboard className="w-3 h-3 text-emerald-400" />
          <span>Actress</span>
        </span>
      );
    }
    return null;
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpenPortal(artist)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenPortal(artist);
        }
      }}
      aria-label={`View VIP portal for ${artist.name}`}
      className="group relative cursor-pointer select-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      style={{
        perspective: '1400px',
      }}
    >
      {/* 3D Dynamic Enlargement & Tilt Transform Container */}
      <div
        className="relative w-full rounded-2xl transition-all duration-300 ease-out transform-gpu will-change-transform"
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${tilt.scale}, ${tilt.scale}, ${tilt.scale})`,
          boxShadow: tilt.isHovered
            ? `0 28px 70px -10px ${artist.glowRgba}, 0 0 40px 4px ${artist.glowRgba}, inset 0 0 25px rgba(255,255,255,0.12)`
            : '0 12px 30px -10px rgba(0, 0, 0, 0.75)',
        }}
      >
        {/* Liquid Glass Shell: Multi-layered backdrop blur + translucent gradient borders */}
        <div
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.09] via-white/[0.03] to-[#080b16]/95 backdrop-blur-2xl transition-all duration-500 group-hover:border-white/30"
          style={{
            borderColor: tilt.isHovered ? `color-mix(in srgb, ${artist.accentColor} 55%, rgba(255,255,255,0.35))` : undefined,
          }}
        >
          {/* Top Edge Specular Hairline */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

          {/* Dynamic Specular Glare Sheen (Liquid Glass Refraction follow mouse) */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-30"
            style={{
              opacity: tilt.isHovered ? 1 : 0,
              background: `radial-gradient(circle 340px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 45%, transparent 75%)`,
            }}
          />

          {/* Media Header with Portrait */}
          <div className="relative aspect-[4/4.8] w-full overflow-hidden bg-slate-950">
            <img
              src={artist.image}
              alt={artist.name}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-top transition-all duration-700 ease-out transform-gpu will-change-transform group-hover:scale-108 group-hover:brightness-110 group-hover:contrast-105 group-hover:saturate-115"
            />

            {/* Cinematic Gradient Scrim for Contrast & Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060812] via-[#060812]/35 to-transparent z-10" />

            {/* Top Bar on Image: Status & Platform Badge */}
            <div className="absolute top-3.5 inset-x-3.5 z-20 flex items-center justify-between pointer-events-auto">
              {/* Category / Platform Tag */}
              <div>{renderPlatformBadge()}</div>

              {/* Sound Theme Audio Preview Button */}
              <button
                type="button"
                onClick={toggleAudio}
                title={isPlayingAudio ? 'Mute Theme Frequency' : 'Preview Cinematic Frequency'}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-slate-200 transition-all duration-200 hover:scale-110 hover:border-white/50 active:scale-95 cursor-pointer"
                style={{
                  color: isPlayingAudio ? artist.accentColor : undefined,
                  boxShadow: isPlayingAudio ? `0 0 14px ${artist.accentColor}` : undefined,
                }}
              >
                {isPlayingAudio ? (
                  <VolumeX className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Live State Tag at bottom left of image */}
            <div className="absolute bottom-3 left-3.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-medium text-slate-200">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: artist.accentColor }}
              />
              <span className="truncate max-w-[170px]">{artist.status.state}</span>
            </div>

            {/* Audio Waveform Ribbon (active when playing) */}
            {isPlayingAudio && (
              <div className="absolute bottom-3 right-3.5 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-xs">
                <span className="w-1 h-3 bg-cyan-400 animate-pulse" />
                <span className="w-1 h-4 bg-cyan-300 animate-ping" />
                <span className="w-1 h-2 bg-cyan-400" />
              </div>
            )}
          </div>

          {/* Card Body & Content Section */}
          <div className="relative p-5 z-20 flex flex-col gap-3">
            {/* Title & Verification */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-200 transition-colors duration-200 font-display">
                  {artist.name}
                </h3>
                <span className="flex items-center text-slate-400 group-hover:text-white transition-colors duration-200">
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{artist.title}</p>
            </div>

            {/* Zero-Pill Clean Unboxed Metadata with Typographic Separator */}
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span className="text-cyan-300 font-mono text-[11px]">{artist.handle}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="font-mono tabular-nums text-slate-300">{artist.metrics.listenersMonthly}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">{artist.metrics.vaultHolders} patrons</span>
            </div>

            {/* Genre & Upcoming Drop */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm transition-all duration-300 group-hover:bg-white/[0.06] group-hover:border-white/[0.12]">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-medium text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Next Allocation</span>
                </span>
                <span className="font-mono tabular-nums text-slate-300">
                  {artist.upcomingDrop.releaseDate}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-100 mt-1 truncate">
                {artist.upcomingDrop.title}
              </p>
            </div>

            {/* Quick Interactive Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPortal(artist);
                }}
                className="py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] active:bg-white/[0.16] border border-white/10 text-xs font-semibold text-slate-200 transition-all duration-200 whitespace-nowrap text-center hover:text-white cursor-pointer"
              >
                Access Portal
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickPass(artist);
                }}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 active:scale-[0.98] border border-cyan-400/30 text-xs font-semibold text-cyan-200 transition-all duration-200 whitespace-nowrap text-center flex items-center justify-center gap-1.5 hover:shadow-[0_0_15px_rgba(0,240,255,0.25)] cursor-pointer"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Pass Mint</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
