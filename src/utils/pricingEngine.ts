import { MeetupTierConfig, MeetupTierId, PricingCalculationResult } from '../types';

export const MEETUP_TIERS: Record<MeetupTierId, MeetupTierConfig> = {
  meet_and_greet: {
    id: 'meet_and_greet',
    name: 'Meet & Greet',
    tierLabel: 'Base tier',
    basePriceUsd: 450,
    durationLabel: '30 Minutes',
    description: 'Intimate backstage or private greenroom encounter, signed commemorative lathe cut, and dedicated 1-on-1 photo session.',
    perks: [
      'Private 1-on-1 greenroom access (30 mins)',
      'Signed physical collectible or vinyl',
      'Dedicated photography & high-res digital delivery',
      'VIP lanyard & venue credential',
    ],
  },
  dinner: {
    id: 'dinner',
    name: 'Dinner',
    tierLabel: 'Plus tier',
    basePriceUsd: 1600,
    durationLabel: '2 Hours',
    description: 'Private culinary salon reservation in Tokyo, Paris, Milan, or London with the artist and creative director over a bespoke tasting menu.',
    perks: [
      'Multi-course private Michelin-starred dining salon',
      'Direct 2-hour conversational dinner with artist',
      'Curated wine/beverage pairing by resident sommelier',
      'Exclusive unreleased audio playback over dessert',
    ],
  },
  hangout: {
    id: 'hangout',
    name: 'Hangout',
    tierLabel: 'Expensive tier',
    basePriceUsd: 3800,
    durationLabel: '4 Hours',
    description: 'Half-day backstage immersion: join the modular synth jam session, soundcheck acoustics rehearsal, and artist afterparty lounge.',
    perks: [
      '4-Hour backstage studio & soundcheck immersion',
      'Hands-on analog synth & modular rig co-session',
      'Private greenroom lounge with artist inner circle',
      'Backstage pass to official tour afterparty',
    ],
  },
  visit: {
    id: 'visit',
    name: 'Visit',
    tierLabel: 'Premium tier',
    basePriceUsd: 9500,
    durationLabel: 'Full Day (8+ Hours)',
    description: 'The pinnacle VIP experience: full-day bespoke city excursion, atelier styling consultation, executive recording studio session, and private chauffeur.',
    perks: [
      'Full-day bespoke artist itinerary (8+ hours)',
      'Private studio co-production & stem credit opportunity',
      'Atelier haute-couture styling or wardrobe piece',
      'Dedicated executive security & luxury Maybach chauffeur',
    ],
  },
};

/**
 * Calculates the dynamic time-sensitivity pricing multiplier and final breakdown.
 *
 * Curve Mechanics:
 * - 0 - 2 days (Immediate Surge): 2.50x multiplier (Emergency logistical clearance & schedule preemption)
 * - 3 - 7 days (High Urgency): 1.60x - 2.00x multiplier
 * - 8 - 14 days (Moderate Notice): 1.25x - 1.50x multiplier
 * - 15 - 30 days (Standard Booking): 1.05x - 1.20x multiplier
 * - >30 days (Advance Early-Bird): 1.00x multiplier (Standard base rate)
 */
export function calculateMeetupPrice(
  tierId: MeetupTierId,
  selectedDateStr: string,
  userTier?: 'Obsidian Tier I' | 'Astral Tier II' | 'Celestial Tier III',
  currentDate: Date = new Date()
): PricingCalculationResult {
  const tierConfig = MEETUP_TIERS[tierId] || MEETUP_TIERS.meet_and_greet;
  const basePriceUsd = tierConfig.basePriceUsd;

  const targetDate = new Date(selectedDateStr);
  const now = new Date(currentDate);

  // Normalize to day boundaries
  const msPerDay = 1000 * 60 * 60 * 24;
  const targetUtc = Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const nowUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.max(0, Math.floor((targetUtc - nowUtc) / msPerDay));

  let urgencyMultiplier = 1.0;
  let urgencyTierName: PricingCalculationResult['urgencyTierName'] = 'Advance Early-Bird (>30d)';

  if (diffDays <= 2) {
    // Extreme 48h rush: schedule clearing surcharge
    urgencyMultiplier = 2.5;
    urgencyTierName = 'Immediate Surge (0-2d)';
  } else if (diffDays <= 7) {
    // 3 to 7 days: linear scale from 2.0 down to 1.6
    urgencyMultiplier = 1.6 + ((7 - diffDays) / 4) * 0.4;
    urgencyTierName = 'High Urgency (3-7d)';
  } else if (diffDays <= 14) {
    // 8 to 14 days: linear scale from 1.5 down to 1.25
    urgencyMultiplier = 1.25 + ((14 - diffDays) / 6) * 0.25;
    urgencyTierName = 'Moderate Notice (8-14d)';
  } else if (diffDays <= 30) {
    // 15 to 30 days: linear scale from 1.20 down to 1.05
    urgencyMultiplier = 1.05 + ((30 - diffDays) / 15) * 0.15;
    urgencyTierName = 'Standard Booking (15-30d)';
  } else {
    // > 30 days advance booking: baseline 1.00x
    urgencyMultiplier = 1.0;
    urgencyTierName = 'Advance Early-Bird (>30d)';
  }

  // Round multiplier to 2 decimals
  urgencyMultiplier = Math.round(urgencyMultiplier * 100) / 100;

  const scaledPrice = basePriceUsd * urgencyMultiplier;
  const urgencySurchargeUsd = Math.round((scaledPrice - basePriceUsd) * 100) / 100;

  // Patron Tier Discounts
  let discountRate = 0;
  if (userTier === 'Obsidian Tier I') discountRate = 0.05;
  if (userTier === 'Astral Tier II') discountRate = 0.1;
  if (userTier === 'Celestial Tier III') discountRate = 0.18;

  const patronTierDiscountUsd = Math.round(scaledPrice * discountRate * 100) / 100;

  // Platform Escrow & Insurance Fee (2.5% of base)
  const escrowFeeUsd = Math.round(basePriceUsd * 0.025 * 100) / 100;

  const finalTotalUsd = Math.round((scaledPrice - patronTierDiscountUsd + escrowFeeUsd) * 100) / 100;

  return {
    tierId,
    tierName: tierConfig.name,
    basePriceUsd,
    selectedDate: selectedDateStr,
    daysInAdvance: diffDays,
    urgencyMultiplier,
    urgencySurchargeUsd,
    patronTierDiscountUsd,
    escrowFeeUsd,
    finalTotalUsd,
    urgencyTierName,
  };
}
