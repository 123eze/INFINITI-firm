import React from 'react';
import { ArtistProfile } from '../types';
import { ProfileCard3D } from './ProfileCard3D';
import { Sparkles, ArrowUpDown, Filter } from 'lucide-react';

interface ProfileGridViewProps {
  artists: ArtistProfile[];
  onOpenPortal: (artist: ArtistProfile) => void;
  onQuickPass: (artist: ArtistProfile) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  selectedCategory?: string;
  selectedPlatform?: string;
  onResetFilters?: () => void;
}

export const ProfileGridView: React.FC<ProfileGridViewProps> = ({
  artists,
  onOpenPortal,
  onQuickPass,
  sortBy,
  setSortBy,
  selectedCategory = 'All',
  selectedPlatform = 'All',
  onResetFilters,
}) => {
  return (
    <section className="relative z-10 py-6 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header with Natural Editorial Title & Tabular Numbers */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 gap-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-bold tracking-tight text-white font-display">
                Verified Talent Pool
              </h2>
              <span className="text-xs font-mono text-cyan-400 font-normal py-0.5 px-2 rounded-md bg-cyan-400/10 border border-cyan-400/20 tabular-nums">
                {artists.length} Available
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span>Hover profile to inspect with 3D perspective tilt</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-300">
                Filter: {selectedCategory === 'All' ? 'All Talent' : selectedCategory}
                {selectedPlatform !== 'All' ? ` (${selectedPlatform})` : ''}
              </span>
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" />
              <span>Sort:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-8 px-2.5 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-slate-200 outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="rank" className="bg-[#0b0e1a] text-slate-200">Fan Rank</option>
              <option value="listeners" className="bg-[#0b0e1a] text-slate-200">Audience Reach</option>
              <option value="name" className="bg-[#0b0e1a] text-slate-200">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Empty State */}
        {artists.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md mt-6">
            <Sparkles className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No Talent Profiles Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No actors or influencers match your current category or platform filter criteria.
            </p>
            {onResetFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          /* Profile Grid View Layout: Responsive 1 / 2 / 3 / 4 column layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6">
            {artists.map((artist) => (
              <ProfileCard3D
                key={artist.id}
                artist={artist}
                onOpenPortal={onOpenPortal}
                onQuickPass={onQuickPass}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
