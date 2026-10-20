import { ShoutoutTierConfig, DigitalGiftItem, ShoutoutTierId } from '../types';

export const SHOUTOUT_TIERS: Record<ShoutoutTierId, ShoutoutTierConfig> = {
  quick_hi: {
    id: 'quick_hi',
    name: "Quick 'Hi' & Wave",
    priceUsd: 50,
    durationLabel: '15 - 20 Seconds',
    headline: 'Spontaneous Studio Wave',
    description: 'A crisp, high-energy direct video greeting from the celebrity mentioning your name, current location, and a quick positive spark.',
    idealFor: 'Quick mood booster, DM reaction video, social greeting',
    exampleSnippet: '"Hey Marcus! Aurora here live from our Tokyo studio. Sending pure modular warmth your way—keep creating and shine bright today!"',
  },
  milestone: {
    id: 'milestone',
    name: 'Milestone & Celebration',
    priceUsd: 120,
    durationLabel: '45 - 60 Seconds',
    headline: 'Memorable Life Achievement',
    description: 'A thoughtful, personalized dedication celebrating birthdays, anniversaries, graduations, or career leaps with heartfelt warmth.',
    idealFor: 'Birthdays, wedding surprises, project releases, milestone celebrations',
    exampleSnippet: '"Happy 30th Birthday Elena! Valen Saint here from Milan. Your friends tell me you’ve been rocking the runway track nonstop. May this year be your boldest masterpiece yet!"',
  },
  mentorship: {
    id: 'mentorship',
    name: 'Creative Mentorship & Feedback',
    priceUsd: 220,
    durationLabel: '90 - 120 Seconds',
    headline: 'Artistic Direction & Insight',
    description: 'Direct artistic consultation: the celebrity reviews your prompt, offers actionable sonic/creative guidance, and shares personal wisdom.',
    idealFor: 'Aspiring producers, fashion designers, songwriters, creative motivation',
    exampleSnippet: '"Julian, Kai here. I listened to your concept notes on polyrhythmic basslines. Don’t compress the low-end transients too early—let the natural tape warmth breathe before the drop..."',
  },
  love_dedication: {
    id: 'love_dedication',
    name: "Personalized 'I Love You' & Forever Dedication",
    priceUsd: 400,
    durationLabel: '2 - 3 Minutes',
    headline: 'Cinematic Emotional Masterpiece',
    description: 'The pinnacle dedication: an intimate, unhurried cinematic video message featuring deep personal reflection, acoustic humming, and an eternal signed digital token.',
    idealFor: 'Proposals, lifelong soulmates, deeply personal romantic dedications, ultimate fandom tribute',
    exampleSnippet: '"To my dearest Chloe... Solène here. Julian asked me to tell you just how deeply you are loved, today and for all the horizons ahead. From the bottom of my heart, I love you both so much..."',
  },
};

export const DIGITAL_GIFTS: DigitalGiftItem[] = [
  {
    id: 'gift_rose',
    name: 'Cyber Obsidian Rose',
    priceUsd: 15,
    iconName: 'Rose',
    description: 'A glowing cryptographic rose token permanently pinned to the artist’s fan sanctuary leaderboard.',
  },
  {
    id: 'gift_champagne',
    name: 'Aether Vintage Champagne',
    priceUsd: 35,
    iconName: 'Sparkles',
    description: 'Curated toast asset sent straight to the celebrity’s dressing room with a special on-screen burst.',
  },
  {
    id: 'gift_diamond',
    name: 'Celestial Diamond Patron Crest',
    priceUsd: 100,
    iconName: 'Award',
    description: 'Highest-honor digital gift minted on-chain, unlocking permanent patron badge on the celebrity’s vault wall.',
  },
];
