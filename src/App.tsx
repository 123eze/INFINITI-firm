/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { ARTISTS_DATA } from './data/artists';
import { ArtistProfile, ArtistTier, ArtistDrop, UserProfile, LedgerEntry, LedgerStatus } from './types';
import { ledgerStorage } from './services/ledgerStorage';
import { FluidCanvasBackground } from './components/FluidCanvasBackground';
import { Navbar } from './components/Navbar';
import { HeroSpotlight } from './components/HeroSpotlight';
import { ProfileGridView } from './components/ProfileGridView';
import { ArtistPortalModal } from './components/ArtistPortalModal';
import { StylingBreakdownDrawer } from './components/StylingBreakdownDrawer';
import { FanPassModal } from './components/FanPassModal';
import { VaultDropsView } from './components/VaultDropsView';
import { LiveBackstagesView } from './components/LiveBackstagesView';
import { CuratorsView } from './components/CuratorsView';
import { AccountLedgerView } from './components/AccountLedgerView';
import { RegistrationModal } from './components/RegistrationModal';
import { ArchitectureSchemaModal } from './components/ArchitectureSchemaModal';
import { MeetupBookingModal } from './components/MeetupBookingModal';
import { ShoutoutGiftingModal } from './components/ShoutoutGiftingModal';
import { MultiOptionCheckoutModal } from './components/MultiOptionCheckoutModal';
import { Toast } from './components/Toast';
import { Layers, Database, UserPlus, Sparkles, TrendingUp, Video, CreditCard } from 'lucide-react';
import { soundEngine } from './utils/audioSynth';

export default function App() {
  const [activeTab, setActiveTab] = useState<'roster' | 'backstages' | 'drops' | 'ledger' | 'curation'>('roster');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('rank');

  // User Profile & Persistent History Ledger
  const [user, setUser] = useState<UserProfile>(() => ledgerStorage.getUserProfile());
  const [ledger, setLedger] = useState<LedgerEntry[]>(() => ledgerStorage.getLedgerEntries());

  // Modals & Panels
  const [activeModalArtist, setActiveModalArtist] = useState<ArtistProfile | null>(null);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isMeetupModalOpen, setIsMeetupModalOpen] = useState(false);
  const [meetupArtist, setMeetupArtist] = useState<ArtistProfile | null>(null);
  const [isShoutoutModalOpen, setIsShoutoutModalOpen] = useState(false);
  const [shoutoutArtist, setShoutoutArtist] = useState<ArtistProfile | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<{ title: string; price: number }>({
    title: 'Julian Cross — 1-on-1 Private Dinner (Plus Tier)',
    price: 450,
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Wallet / Pass status
  const [isConnected, setIsConnected] = useState(true);
  const [walletAddress, setWalletAddress] = useState(user.fanPassId);

  // Synchronize user profile updates to storage
  const handleSaveUser = (updatedProfile: UserProfile) => {
    setUser(updatedProfile);
    ledgerStorage.saveUserProfile(updatedProfile);
    setToastMessage(`Account profile for ${updatedProfile.fullName} updated and cryptographically signed.`);
  };

  // Add entry to ledger
  const handleAddLedgerRecord = (record: Omit<LedgerEntry, 'id' | 'hash' | 'createdAt'>) => {
    const created = ledgerStorage.addLedgerEntry(record);
    setLedger((prev) => [created, ...prev]);
    setToastMessage(`Logged to ledger: ${created.title} (${created.hash.substring(0, 10)}...)`);
  };

  // Update status in ledger via state machine
  const handleUpdateLedgerStatus = (
    id: string,
    newStatus: LedgerStatus,
    reviewerDetails?: {
      reviewerName?: string;
      reviewerRole?: 'artist' | 'management' | 'system';
      reason?: string;
    }
  ) => {
    const updated = ledgerStorage.updateLedgerStatus(id, newStatus, reviewerDetails);
    if (updated) {
      setLedger((prev) => prev.map((entry) => (entry.id === id ? updated : entry)));
      const statusLabel =
        newStatus === 'pending'
          ? 'Unapproved / Request Sent'
          : newStatus === 'approved'
          ? 'Request Approved / Accepted'
          : 'Rejected / Declined';
      setToastMessage(`Status updated to "${statusLabel}"`);
    }
  };

  // Filter & sort artists (exclusive talent pool: Actors, Actresses, Online Influencers)
  const filteredArtists = useMemo(() => {
    return ARTISTS_DATA.filter((artist) => {
      const matchesCategory =
        selectedCategory === 'All' || artist.category === selectedCategory;
      const matchesPlatform =
        selectedPlatform === 'All' ||
        (artist.category === 'Online Influencers' && artist.platform === selectedPlatform);
      const matchesSearch =
        artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (artist.platform && artist.platform.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesPlatform && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'rank') return a.metrics.fanRank - b.metrics.fanRank;
      if (sortBy === 'listeners') return b.metrics.listenersMonthly.localeCompare(a.metrics.listenersMonthly);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [selectedCategory, selectedPlatform, searchQuery, sortBy]);

  const featuredArtist = useMemo(() => {
    if (selectedCategory !== 'All') {
      const match = ARTISTS_DATA.find((a) => a.category === selectedCategory);
      if (match) return match;
    }
    return ARTISTS_DATA[0];
  }, [selectedCategory]);

  const handleOpenMeetup = (artist?: ArtistProfile) => {
    soundEngine.playClickTick();
    setMeetupArtist(artist || featuredArtist);
    setIsMeetupModalOpen(true);
  };

  const handleOpenShoutout = (artist?: ArtistProfile) => {
    soundEngine.playClickTick();
    setShoutoutArtist(artist || featuredArtist);
    setIsShoutoutModalOpen(true);
  };

  const handleOpenCheckout = (title?: string, price?: number) => {
    soundEngine.playClickTick();
    setCheckoutItem({
      title: title || 'Aurora Vane — 1-on-1 Spatial Meetup (Plus Tier)',
      price: price || 450,
    });
    setIsCheckoutModalOpen(true);
  };

  const handleOpenPortal = (artist: ArtistProfile) => {
    soundEngine.playClickTick();
    setActiveModalArtist(artist);
  };

  const handleQuickPass = (artist: ArtistProfile) => {
    soundEngine.playClickTick();
    handleAddLedgerRecord({
      userId: user.id,
      artistId: artist.id,
      artistName: artist.name,
      artistImage: artist.image,
      type: 'interaction',
      title: `${artist.name} Tier I Obsidian Mint`,
      description: `Instant activation of unreleased stems, private broadcast chat, and priority allocation.`,
      status: 'confirmed',
      amountUsd: 25,
      details: {
        format: 'Unreleased Master Stem',
        customNote: `Bound to fan address ${user.fanPassId}`,
        deliverableUrl: `https://infiniti.firm/vault/stems/${artist.id}-stems.zip`,
      },
    });
  };

  const handleMintTier = (tier: ArtistTier) => {
    if (!activeModalArtist) return;
    handleAddLedgerRecord({
      userId: user.id,
      artistId: activeModalArtist.id,
      artistName: activeModalArtist.name,
      artistImage: activeModalArtist.image,
      type: 'booking',
      title: `${activeModalArtist.name} ${tier.name} Token Allocation`,
      description: `Includes ${tier.perks.join(', ')}.`,
      status: 'confirmed',
      amountUsd: parseInt(tier.price) || 90,
      details: {
        format: 'Spatial Hologram (1-on-1)',
        customNote: `Tier level: ${tier.badge}`,
        streamKey: `hlg_${activeModalArtist.id}_${Math.floor(1000 + Math.random() * 9000)}`,
        deliverableUrl: `https://infiniti.firm/vault/tiers/${activeModalArtist.id}`,
      },
    });
    setActiveModalArtist(null);
  };

  const handleMintDrop = (drop: ArtistDrop) => {
    const artist = ARTISTS_DATA.find((a) => a.upcomingDrop.id === drop.id) || featuredArtist;
    handleAddLedgerRecord({
      userId: user.id,
      artistId: artist.id,
      artistName: artist.name,
      artistImage: artist.image,
      type: drop.type === 'Hologram Pass' ? 'booking' : 'interaction',
      title: drop.title,
      description: `${drop.rarity} allocation of ${drop.type} with cryptographic delivery license.`,
      status: 'confirmed',
      amountUsd: drop.priceUsd,
      details: {
        format: drop.type as any,
        deliverableUrl: `https://infiniti.firm/vault/drops/${drop.id}`,
      },
    });
  };

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col font-sans bg-[#05060b]">
      {/* 60fps Live Procedural Fluid Canvas Background Loop */}
      <FluidCanvasBackground intensity={1.0} interactive={true} />

      {/* Top Bar Navigation (Strict 3-Zone Contract) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          soundEngine.playClickTick();
          setActiveTab(tab as typeof activeTab);
        }}
        onOpenSpecs={() => {
          soundEngine.playClickTick();
          setIsSpecsOpen(true);
        }}
        onConnectWallet={() => {
          soundEngine.playClickTick();
          setIsWalletOpen(true);
        }}
        isConnected={isConnected}
        walletAddress={walletAddress}
        user={user}
        onOpenRegistration={() => {
          soundEngine.playClickTick();
          setIsRegistrationOpen(true);
        }}
      />

      {/* Main Content Areas based on selected Navigation Tab */}
      <main className="flex-1 z-10">
        {activeTab === 'roster' && (
          <>
            {/* Featured VIP Spotlight & Curation Filter Bar */}
            <HeroSpotlight
              featuredArtist={featuredArtist}
              onOpenPortal={handleOpenPortal}
              onOpenMeetup={handleOpenMeetup}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                soundEngine.playClickTick();
                setSelectedCategory(cat);
              }}
              selectedPlatform={selectedPlatform}
              onSelectPlatform={(plat) => {
                soundEngine.playClickTick();
                setSelectedPlatform(plat);
              }}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            {/* Profile Grid View with Interactive 3D Tilt Cards */}
            <ProfileGridView
              artists={filteredArtists}
              onOpenPortal={handleOpenPortal}
              onQuickPass={handleQuickPass}
              sortBy={sortBy}
              setSortBy={setSortBy}
              selectedCategory={selectedCategory}
              selectedPlatform={selectedPlatform}
              onResetFilters={() => {
                soundEngine.playClickTick();
                setSelectedCategory('All');
                setSelectedPlatform('All');
                setSearchQuery('');
              }}
            />
          </>
        )}

        {activeTab === 'backstages' && <LiveBackstagesView />}

        {activeTab === 'drops' && <VaultDropsView onMintPass={handleMintDrop} />}

        {activeTab === 'ledger' && (
          <AccountLedgerView
            user={user}
            ledger={ledger}
            onOpenRegistration={() => {
              soundEngine.playClickTick();
              setIsRegistrationOpen(true);
            }}
            onOpenArchitecture={() => {
              soundEngine.playClickTick();
              setIsArchitectureOpen(true);
            }}
            onAddLedgerRecord={handleAddLedgerRecord}
            onUpdateEntryStatus={handleUpdateLedgerStatus}
          />
        )}

        {activeTab === 'curation' && <CuratorsView />}
      </main>

      {/* Clean Footer */}
      <footer className="relative z-10 border-t border-white/[0.08] bg-[#03050a]/80 backdrop-blur-xl py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-extrabold tracking-wider text-white font-display">INFINITI firm</span>
            <span aria-hidden="true">·</span>
            <span>Premier Fan-to-Artist Connection Platform</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button
              onClick={() => setIsArchitectureOpen(true)}
              className="text-cyan-300 hover:text-cyan-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>DB Schema & Architecture</span>
            </button>

            <button
              onClick={() => setIsSpecsOpen(true)}
              className="text-cyan-300 hover:text-cyan-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tailwind & CSS Spec</span>
            </button>
            <span>&copy; {new Date().getFullYear()} INFINITI firm Ltd. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons: Architecture, Meetup, Shoutout, Fintech Checkout & Design Specs */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-2.5">
        <button
          onClick={() => handleOpenCheckout()}
          className="h-10 px-4 rounded-xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 active:scale-95 border border-emerald-400/40 text-emerald-200 backdrop-blur-2xl text-xs font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all cursor-pointer"
        >
          <CreditCard className="w-4 h-4 text-emerald-300" />
          <span>Multi-Option Checkout</span>
        </button>

        <button
          onClick={() => handleOpenShoutout()}
          className="h-10 px-3.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 active:scale-95 border border-purple-400/30 text-purple-200 backdrop-blur-2xl text-xs font-semibold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
        >
          <Video className="w-3.5 h-3.5 text-purple-300" />
          <span>Shoutout Suite</span>
        </button>

        <button
          onClick={() => handleOpenMeetup()}
          className="h-10 px-3.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 active:scale-95 border border-cyan-400/30 text-cyan-200 backdrop-blur-2xl text-xs font-semibold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
        >
          <TrendingUp className="w-3.5 h-3.5 text-cyan-300" />
          <span>Meetup Engine</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClickTick();
            setIsArchitectureOpen(true);
          }}
          className="h-10 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] active:scale-95 border border-white/15 text-slate-200 backdrop-blur-2xl text-xs font-semibold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
        >
          <Database className="w-3.5 h-3.5 text-cyan-300" />
          <span>DB Schema</span>
        </button>
      </div>

      {/* Modals & Slide-overs */}
      <ArtistPortalModal
        artist={activeModalArtist}
        onClose={() => setActiveModalArtist(null)}
        onMintPass={handleMintTier}
        onOpenMeetupBooking={handleOpenMeetup}
      />

      <MeetupBookingModal
        isOpen={isMeetupModalOpen}
        onClose={() => setIsMeetupModalOpen(false)}
        user={user}
        preselectedArtist={meetupArtist}
        onConfirmBooking={handleAddLedgerRecord}
      />

      <ShoutoutGiftingModal
        isOpen={isShoutoutModalOpen}
        onClose={() => setIsShoutoutModalOpen(false)}
        user={user}
        preselectedArtist={shoutoutArtist}
        onConfirmShoutout={handleAddLedgerRecord}
      />

      <MultiOptionCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        user={user}
        itemTitle={checkoutItem.title}
        itemPriceUsd={checkoutItem.price}
        onPaymentSuccess={handleAddLedgerRecord}
      />

      <StylingBreakdownDrawer
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
      />

      <ArchitectureSchemaModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      <RegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        currentUser={user}
        onSaveUser={handleSaveUser}
      />

      <FanPassModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        isConnected={isConnected}
        walletAddress={walletAddress}
        onConnect={(addr) => {
          setIsConnected(true);
          setWalletAddress(addr);
          setToastMessage(`PassKey authenticated: ${addr}`);
        }}
        onDisconnect={() => {
          setIsConnected(false);
          setToastMessage('Fan Pass disconnected.');
        }}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
