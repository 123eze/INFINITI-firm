import { UserProfile, LedgerEntry, LedgerStatus, StatusMetadata } from '../types';
import { ARTISTS_DATA } from '../data/artists';

const USER_STORAGE_KEY = 'infiniti_firm_user_profile_v2';
const LEDGER_STORAGE_KEY = 'infiniti_firm_ledger_history_v2';

export const INITIAL_USER: UserProfile = {
  id: 'usr_infiniti_8f901',
  fullName: 'Azara Yucil',
  email: 'azarayucil014@gmail.com',
  phone: '+1 (415) 890-2184',
  socialHandles: {
    instagram: '@azara.sound',
    twitter: '@azara_yucil',
    tiktok: '@azarasphere',
    telegram: '@azara_vip',
    discord: 'azara#9041',
  },
  fanPassId: '0x8F9B2C41E094',
  tier: 'Astral Tier II',
  joinedAt: '2025-11-14T10:30:00Z',
  walletBalanceUsdc: 2450,
};

export const INITIAL_LEDGER: LedgerEntry[] = [
  {
    id: 'rec_bk_9102',
    userId: 'usr_infiniti_8f901',
    artistId: 'aurora-vane',
    artistName: 'Aurora Vane',
    artistImage: ARTISTS_DATA[0].image,
    type: 'booking',
    title: 'Aurora Vane — Dinner (Plus tier)',
    description: '120-min private dining salon meetup at Chateau Marmont Penthouse Salon. Awaiting management review.',
    status: 'pending',
    scheduledFor: '2026-11-04T19:00:00Z',
    amountUsd: 650,
    hash: '0x7B14A9C10E82D5940AF432B188DF31C9E78491A0E2',
    createdAt: '2026-10-20T08:15:00Z',
    statusMetadata: {
      responseDeadlineAt: '2026-10-22T08:15:00Z',
      escrowStatus: 'held',
      transitionLogs: [
        {
          timestamp: '2026-10-20T08:15:00Z',
          fromStatus: 'pending',
          toStatus: 'pending',
          actorId: 'usr_infiniti_8f901',
          actorRole: 'fan',
          reason: 'Initial submission of meetup request with escrow lock',
        },
      ],
    },
    details: {
      format: 'Studio Session',
      durationMinutes: 120,
      customNote: 'Discussing generative modular algorithms for winter tour.',
      streamKey: 'meet_aurora_9102',
      deliverableUrl: 'https://infiniti.firm/vault/meetups/aurora-dinner',
    },
  },
  {
    id: 'rec_bk_9844',
    userId: 'usr_infiniti_8f901',
    artistId: 'kai-mercer',
    artistName: 'Kai Mercer',
    artistImage: ARTISTS_DATA[3].image,
    type: 'booking',
    title: 'Kai Mercer — Hangout (Expensive tier)',
    description: 'Confirmed private backstage access prior to the orchestral hybrid live performance.',
    status: 'approved',
    scheduledFor: '2026-11-05T20:30:00Z',
    amountUsd: 1150,
    hash: '0x5C02947118DA0194883AC7105021F3847291B8820A',
    createdAt: '2026-10-18T18:04:00Z',
    statusMetadata: {
      reviewedAt: '2026-10-19T09:30:00Z',
      reviewedBy: 'Mercer Management Guild',
      reviewerRole: 'management',
      approvalNotes: 'VIP backstage sanctuary badge and soundcheck clearance authorized.',
      escrowStatus: 'settled',
      transitionLogs: [
        {
          timestamp: '2026-10-18T18:04:00Z',
          fromStatus: 'pending',
          toStatus: 'pending',
          actorId: 'usr_infiniti_8f901',
          actorRole: 'fan',
        },
        {
          timestamp: '2026-10-19T09:30:00Z',
          fromStatus: 'pending',
          toStatus: 'approved',
          actorId: 'mgmt_mercer_01',
          actorRole: 'management',
          reason: 'Approved after checking tour schedule and soundcheck timeline.',
        },
      ],
    },
    details: {
      format: 'Studio Session',
      durationMinutes: 240,
      streamKey: 'hlg_backstage_kai_amsterdam_9844',
      customNote: 'Hardware patch exploration and VIP entry key.',
    },
  },
  {
    id: 'rec_sh_8192',
    userId: 'usr_infiniti_8f901',
    artistId: 'valen-saint',
    artistName: 'Valen Saint',
    artistImage: ARTISTS_DATA[1].image,
    type: 'shoutout',
    title: 'Valen Saint — Personal Mentorship & Advice Video',
    description: 'Custom video guidance request for upcoming couture runway audio debut.',
    status: 'rejected',
    scheduledFor: '2026-10-24T16:00:00Z',
    amountUsd: 220,
    hash: '0x99A41C2B0DF71E409D8155CBA471329EF108044B29',
    createdAt: '2026-10-15T09:15:00Z',
    statusMetadata: {
      reviewedAt: '2026-10-16T14:20:00Z',
      reviewedBy: 'Valen Studio Operations',
      reviewerRole: 'management',
      rejectionReason: 'Studio locked for private Milan Fashion Week rehearsals. Full $220 USDC refunded to fan wallet.',
      escrowStatus: 'refunded',
      transitionLogs: [
        {
          timestamp: '2026-10-15T09:15:00Z',
          fromStatus: 'pending',
          toStatus: 'pending',
          actorId: 'usr_infiniti_8f901',
          actorRole: 'fan',
        },
        {
          timestamp: '2026-10-16T14:20:00Z',
          fromStatus: 'pending',
          toStatus: 'rejected',
          actorId: 'mgmt_valen_04',
          actorRole: 'management',
          reason: 'Schedule conflict with Milan runway rehearsal.',
        },
      ],
    },
    details: {
      format: 'Video Shoutout',
      occasion: 'Creative Direction',
      recipientName: 'Azara Yucil',
      customNote: 'Requesting review of runway soundtrack stems.',
    },
  },
  {
    id: 'rec_int_7712',
    userId: 'usr_infiniti_8f901',
    artistId: 'solene-vance',
    artistName: 'Solène Vance',
    artistImage: ARTISTS_DATA[2].image,
    type: 'interaction',
    title: 'Velvet Meridian Analog Tape Stem Allocation',
    description: 'Direct multi-track 24-bit/96kHz vocal stem decryption with cryptographic proof of ownership.',
    status: 'completed',
    amountUsd: 120,
    hash: '0x71BC3084DA15002C937EA441D99B15F6029381A4C2',
    createdAt: '2026-10-12T11:45:00Z',
    details: {
      format: 'Unreleased Master Stem',
      customNote: 'Direct cryptographic licensing key unlocked.',
      deliverableUrl: 'https://infiniti.firm/vault/stems/solene-velvet-stems.zip',
    },
  },
];

export const ledgerStorage = {
  getUserProfile: (): UserProfile => {
    try {
      const data = localStorage.getItem(USER_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return INITIAL_USER;
  },

  saveUserProfile: (profile: UserProfile): void => {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  },

  getLedgerEntries: (): LedgerEntry[] => {
    try {
      const data = localStorage.getItem(LEDGER_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    // Seed initial ledger
    try {
      localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(INITIAL_LEDGER));
    } catch {
      // ignore
    }
    return INITIAL_LEDGER;
  },

  addLedgerEntry: (entry: Omit<LedgerEntry, 'id' | 'hash' | 'createdAt'>): LedgerEntry => {
    const existing = ledgerStorage.getLedgerEntries();
    const id = `rec_${entry.type.substring(0, 2)}_${Math.floor(1000 + Math.random() * 9000)}`;
    const randomHex = Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    const hash = `0x${randomHex.toUpperCase()}`;
    const createdAt = new Date().toISOString();

    const newEntry: LedgerEntry = {
      ...entry,
      id,
      hash,
      createdAt,
      statusMetadata: entry.statusMetadata || {
        responseDeadlineAt: new Date(Date.now() + 48 * 3600000).toISOString(),
        escrowStatus: 'held',
        transitionLogs: [
          {
            timestamp: createdAt,
            fromStatus: entry.status,
            toStatus: entry.status,
            actorId: entry.userId,
            actorRole: 'fan',
            reason: 'Submitted meetup/shoutout request to artist queue',
          },
        ],
      },
    };

    const updated = [newEntry, ...existing];
    try {
      localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return newEntry;
  },

  updateLedgerStatus: (
    id: string,
    newStatus: LedgerStatus,
    reviewerDetails?: {
      reviewerName?: string;
      reviewerRole?: 'artist' | 'management' | 'system';
      reason?: string;
    }
  ): LedgerEntry | null => {
    const existing = ledgerStorage.getLedgerEntries();
    const index = existing.findIndex((e) => e.id === id);
    if (index === -1) return null;

    const current = existing[index];
    const now = new Date().toISOString();
    const prevStatus = current.status;

    const updatedMetadata: StatusMetadata = {
      ...current.statusMetadata,
      reviewedAt: now,
      reviewedBy: reviewerDetails?.reviewerName || (newStatus === 'approved' ? 'Artist Management Guild' : 'Talent Agency Team'),
      reviewerRole: reviewerDetails?.reviewerRole || 'management',
      escrowStatus: newStatus === 'approved' ? 'settled' : newStatus === 'rejected' ? 'refunded' : 'held',
      rejectionReason: newStatus === 'rejected' ? (reviewerDetails?.reason || 'Artist unavailable due to touring schedule conflict. Escrow refunded.') : undefined,
      approvalNotes: newStatus === 'approved' ? 'Request explicitly accepted by celebrity management. Greenroom access authorized.' : undefined,
      transitionLogs: [
        ...(current.statusMetadata?.transitionLogs || []),
        {
          timestamp: now,
          fromStatus: prevStatus,
          toStatus: newStatus,
          actorId: reviewerDetails?.reviewerName || 'mgmt_infiniti_dispatch',
          actorRole: reviewerDetails?.reviewerRole || 'management',
          reason: reviewerDetails?.reason || `Status updated from ${prevStatus} to ${newStatus}`,
        },
      ],
    };

    const updatedEntry: LedgerEntry = {
      ...current,
      status: newStatus,
      statusMetadata: updatedMetadata,
    };

    existing[index] = updatedEntry;
    try {
      localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(existing));
    } catch {
      // ignore
    }
    return updatedEntry;
  },
};
