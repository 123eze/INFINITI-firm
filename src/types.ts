export interface ArtistTier {
  name: string;
  badge: string;
  price: string;
  perks: string[];
}

export interface ArtistDrop {
  id: string;
  title: string;
  type: 'Audio Stem' | 'Hologram Pass' | 'VIP Backstage' | 'Wearable';
  rarity: 'Legendary' | 'Celestial' | 'Obsidian';
  releaseDate: string;
  priceUsd: number;
}

export interface ArtistProfile {
  id: string;
  name: string;
  handle: string;
  title: string;
  category: 'Actors' | 'Actresses' | 'Online Influencers' | 'Electronic' | 'High Fashion' | 'R&B / Soul' | 'Neo-Classical';
  platform?: 'YouTube' | 'Instagram' | 'TikTok';
  genre: string;
  image: string;
  bio: string;
  accentColor: string; // e.g. '#00f0ff', '#a855f7', '#f59e0b', '#38bdf8'
  glowRgba: string; // e.g. 'rgba(0, 240, 255, 0.45)'
  status: {
    state: 'Live Backstage' | 'Studio Session' | 'Exclusive Drop Live' | 'Touring World' | 'On Set / Filming' | 'Editing Master' | 'Cannes Screening';
    detail: string;
  };
  metrics: {
    fanRank: number;
    listenersMonthly: string;
    vaultHolders: string;
    connectionScore: string;
  };
  tiers: ArtistTier[];
  upcomingDrop: ArtistDrop;
  audioFrequency: {
    note: number; // Hz for synthesizer
    trackName: string;
    bpm: number;
  };
  socialProof: {
    curatorQuote: string;
    curatorName: string;
    curatorOrg: string;
  };
}

export interface SocialHandles {
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  telegram?: string;
  discord?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  socialHandles: SocialHandles;
  fanPassId: string;
  tier: 'Obsidian Tier I' | 'Astral Tier II' | 'Celestial Tier III';
  joinedAt: string;
  avatarUrl?: string;
  walletBalanceUsdc: number;
}

export type LedgerType = 'booking' | 'interaction' | 'shoutout';
export type MeetupRequestStatus = 'pending' | 'approved' | 'rejected' | 'completed';
export type LedgerStatus = 'pending' | 'approved' | 'rejected' | 'confirmed' | 'completed' | 'delivered';

export interface StateTransitionLog {
  timestamp: string;
  fromStatus: LedgerStatus;
  toStatus: LedgerStatus;
  actorId: string;
  actorRole: 'fan' | 'artist' | 'management' | 'system';
  reason?: string;
}

export interface StatusMetadata {
  reviewedAt?: string;
  reviewedBy?: string;
  reviewerRole?: 'artist' | 'management' | 'system';
  responseDeadlineAt?: string;
  rejectionReason?: string;
  approvalNotes?: string;
  escrowStatus?: 'held' | 'settled' | 'refunded';
  transitionLogs?: StateTransitionLog[];
}

export interface LedgerEntry {
  id: string;
  userId: string;
  artistId: string;
  artistName: string;
  artistImage: string;
  type: LedgerType;
  title: string;
  description: string;
  status: LedgerStatus;
  statusMetadata?: StatusMetadata;
  scheduledFor?: string;
  amountUsd: number;
  hash: string; // Cryptographic audit hash
  createdAt: string;
  details: {
    format?: 'Spatial Hologram (1-on-1)' | 'Studio Session' | 'Video Shoutout' | 'Audio Voice Note' | 'Unreleased Master Stem';
    durationMinutes?: number;
    occasion?: string;
    recipientName?: string;
    customNote?: string;
    streamKey?: string;
    deliverableUrl?: string;
  };
}

export type ShoutoutTierId = 'quick_hi' | 'milestone' | 'mentorship' | 'love_dedication';

export interface ShoutoutTierConfig {
  id: ShoutoutTierId;
  name: string;
  priceUsd: number;
  durationLabel: string;
  headline: string;
  description: string;
  idealFor: string;
  exampleSnippet: string;
}

export interface DigitalGiftItem {
  id: string;
  name: string;
  priceUsd: number;
  iconName: string;
  description: string;
}

export interface ShoutoutOrderPayload {
  artistId: string;
  tierId: ShoutoutTierId;
  recipientName: string;
  phoneticPronunciation?: string;
  occasion: string;
  tone: 'Heartfelt & Warm' | 'Energetic & Hype' | 'Intimate & Poetic' | 'Mentorship & Creative';
  promptInstructions: string;
  deliverySpeed: 'Standard (48h)' | 'Express (24h)' | 'Rush (6h)';
  selectedGiftId?: string;
  isPrivate: boolean;
  totalPriceUsd: number;
}

export type MeetupTierId = 'meet_and_greet' | 'dinner' | 'hangout' | 'visit';

export interface MeetupTierConfig {
  id: MeetupTierId;
  name: string; // Meet & Greet, Dinner, Hangout, Visit
  tierLabel: 'Base tier' | 'Plus tier' | 'Expensive tier' | 'Premium tier';
  basePriceUsd: number;
  durationLabel: string;
  description: string;
  perks: string[];
}

export interface PricingCalculationResult {
  tierId: MeetupTierId;
  tierName: string;
  basePriceUsd: number;
  selectedDate: string;
  daysInAdvance: number;
  urgencyMultiplier: number;
  urgencySurchargeUsd: number;
  patronTierDiscountUsd: number;
  escrowFeeUsd: number;
  finalTotalUsd: number;
  urgencyTierName: 'Immediate Surge (0-2d)' | 'High Urgency (3-7d)' | 'Moderate Notice (8-14d)' | 'Standard Booking (15-30d)' | 'Advance Early-Bird (>30d)';
}

export type PaymentGatewayId = 'express_wallet' | 'credit_card' | 'crypto';
export type GatewayStatus = 'active' | 'degraded' | 'unavailable';

export interface PaymentGatewayConfig {
  id: PaymentGatewayId;
  name: string;
  badgeLabel: string;
  status: GatewayStatus;
  statusMessage: string;
  latencyMs: number;
  uptime: string;
  supportedMethods: string[];
}

export interface SpotInfo {
  id: string;
  name: string;
  type: 'Acoustic Studio' | 'Dining Salon' | 'Backstage Greenroom' | 'Atelier' | 'Landmark';
  addressSnippet: string;
}

export interface CityInfo {
  name: string;
  spots: SpotInfo[];
}

export interface StateInfo {
  name: string;
  cities: CityInfo[];
}

export interface CountryLocation {
  country: string;
  code: string;
  states: StateInfo[];
}

export interface SelectedLocationData {
  isCustomVisit: boolean;
  country?: string;
  state?: string;
  city?: string;
  spot?: string;
  spotType?: string;
  spotAddress?: string;
  customAddress?: string;
  preferredTime?: string;
  securityNotes?: string;
}
