import { ArtistProfile } from '../types';

export const ARTISTS_DATA: ArtistProfile[] = [
  // ==========================================
  // 1. ACTORS
  // ==========================================
  {
    id: 'julian-cross',
    name: 'Julian Cross',
    handle: '@julian.cross',
    title: 'A-List Drama & Cinema Actor',
    category: 'Actors',
    genre: 'Feature Film & Psychological Drama',
    image: '/src/assets/images/actor_julian_cross_1792514435644.jpg',
    bio: 'Golden Globe-winning dramatic lead renowned for transcendent cinematic performances in premier Hollywood psychological thrillers and prestige franchise features.',
    accentColor: '#38bdf8',
    glowRgba: 'rgba(56, 189, 248, 0.45)',
    status: {
      state: 'On Set / Filming',
      detail: 'Principal Photography in London'
    },
    metrics: {
      fanRank: 1,
      listenersMonthly: '9.4M Audience',
      vaultHolders: '24,800',
      connectionScore: '99.6%'
    },
    tiers: [
      {
        name: 'Screen Patron',
        badge: 'Tier I',
        price: '35 USDC / mo',
        perks: ['Signed Digital Script Pages', 'Private Set Diaries', 'Priority Premiere Screening Ballot']
      },
      {
        name: 'Cinema VIP',
        badge: 'Tier II',
        price: '120 USDC / mo',
        perks: ['1-on-1 Virtual Table Read', 'World Premiere Red Carpet Invitation', 'Custom Signed Slate']
      },
      {
        name: 'Executive Circle',
        badge: 'Tier III',
        price: '450 USDC / mo',
        perks: ['Producer Dinner in Beverly Hills', 'Private Screening Salon Access', 'Executive Co-Producer Billing']
      }
    ],
    upcomingDrop: {
      id: 'drop-jc-01',
      title: 'Midnight Sovereign — Official Premiere Film Pass',
      type: 'VIP Backstage',
      rarity: 'Legendary',
      releaseDate: 'Thursday, 20:00 UTC',
      priceUsd: 250
    },
    audioFrequency: {
      note: 220, // A3
      trackName: 'Midnight Sovereign (Main Theme)',
      bpm: 84
    },
    socialProof: {
      curatorQuote: 'Julian brings an electrifying, classical gravity to contemporary cinema.',
      curatorName: 'David H. Miller',
      curatorOrg: 'Cahiers du Cinéma Review'
    }
  },
  {
    id: 'marcus-vance',
    name: 'Marcus Vance',
    handle: '@marcus.vance',
    title: 'Method Actor & Noir Film Lead',
    category: 'Actors',
    genre: 'Neo-Noir & Character Method Acting',
    image: '/src/assets/images/actor_marcus_vance_1792514436840.jpg',
    bio: 'Commanding presence in British and international prestige cinema. Celebrated for transformative roles in high-stakes crime thrillers and West End Shakespeare productions.',
    accentColor: '#94a3b8',
    glowRgba: 'rgba(148, 163, 184, 0.45)',
    status: {
      state: 'Live Backstage',
      detail: 'West End Theatre Season'
    },
    metrics: {
      fanRank: 3,
      listenersMonthly: '6.2M Audience',
      vaultHolders: '16,400',
      connectionScore: '98.5%'
    },
    tiers: [
      {
        name: 'Dramaturgy Key',
        badge: 'Tier I',
        price: '30 USDC / mo',
        perks: ['Rehearsal Audio Logs', 'Method Acting Annotations', 'Exclusive Cast Q&A']
      },
      {
        name: 'West End Elite',
        badge: 'Tier II',
        price: '110 USDC / mo',
        perks: ['Green Room Meet & Greet', 'Signed Limited Playbill', 'Private Voice Coach Session']
      },
      {
        name: 'Sovereign Patron',
        badge: 'Tier III',
        price: '420 USDC / mo',
        perks: ['Annual Private Supper at The Ivy', 'Backstage Dressing Room Access', 'Dedicated Archive Piece']
      }
    ],
    upcomingDrop: {
      id: 'drop-mv-02',
      title: 'Solitary Echoes — Behind-the-Lens Master',
      type: 'Hologram Pass',
      rarity: 'Obsidian',
      releaseDate: 'Saturday, 18:00 UTC',
      priceUsd: 195
    },
    audioFrequency: {
      note: 196, // G3
      trackName: 'Solitary Echoes (Cinematic Score)',
      bpm: 72
    },
    socialProof: {
      curatorQuote: 'A rare craftsman whose screen intensity cuts right through the lens.',
      curatorName: 'Sarah Sterling',
      curatorOrg: 'London Film Critic Circle'
    }
  },

  // ==========================================
  // 2. ACTRESSES
  // ==========================================
  {
    id: 'victoria-sterling',
    name: 'Victoria Sterling',
    handle: '@victoria.sterling',
    title: 'Cannes Laureate & Dramatic Actress',
    category: 'Actresses',
    genre: 'Haute Cinema & Arthouse Masterpieces',
    image: '/src/assets/images/actress_victoria_sterling_1792514436570.jpg',
    bio: 'Palme d’Or recipient and global style muse. Headlining cinematic auteur productions, Venice competition selections, and couture cinematic editorials worldwide.',
    accentColor: '#10b981',
    glowRgba: 'rgba(16, 185, 129, 0.45)',
    status: {
      state: 'Cannes Screening',
      detail: 'Grand Palais Premiere Gala'
    },
    metrics: {
      fanRank: 2,
      listenersMonthly: '8.8M Audience',
      vaultHolders: '21,200',
      connectionScore: '99.4%'
    },
    tiers: [
      {
        name: 'Palme Access',
        badge: 'Tier I',
        price: '30 USDC / mo',
        perks: ['Cannes Red Carpet Livestream', 'Wardrobe Archive Lookbook', 'Festival Diary Audio']
      },
      {
        name: 'Riviera Circle',
        badge: 'Tier II',
        price: '135 USDC / mo',
        perks: ['1-on-1 Hologram Salon Call', 'Signed Festival Souvenir', 'Private Cannes Premiere Pass']
      },
      {
        name: 'Celestial Patron',
        badge: 'Tier III',
        price: '500 USDC / mo',
        perks: ['Private Gala Dinner in Cap d’Antibes', 'Exclusive Couture Wardrobe Token', 'Executive Patron Credit']
      }
    ],
    upcomingDrop: {
      id: 'drop-vs-01',
      title: 'Palais Vert — Red Carpet Gala Archive Pass',
      type: 'VIP Backstage',
      rarity: 'Celestial',
      releaseDate: 'Active Now',
      priceUsd: 320
    },
    audioFrequency: {
      note: 330, // E4
      trackName: 'Emerald Nocturne (Festival Suite)',
      bpm: 92
    },
    socialProof: {
      curatorQuote: 'The quintessential muse of modern European auteur cinema.',
      curatorName: 'Jean-Luc Moreau',
      curatorOrg: 'Festival de Cannes Retrospective'
    }
  },
  {
    id: 'camilla-fontaine',
    name: 'Camilla Fontaine',
    handle: '@camilla.fontaine',
    title: 'César-Winning Arthouse & Screen Actress',
    category: 'Actresses',
    genre: 'French Modern Cinema & Romantic Realism',
    image: '/src/assets/images/actress_camilla_fontaine_1792514475602.jpg',
    bio: 'Two-time César award-winner celebrated for intimate emotional truth and poetic cinema. Regular collaborator with premier French and European directors.',
    accentColor: '#f59e0b',
    glowRgba: 'rgba(245, 158, 11, 0.45)',
    status: {
      state: 'Studio Session',
      detail: 'Script Table Read in Paris'
    },
    metrics: {
      fanRank: 4,
      listenersMonthly: '5.6M Audience',
      vaultHolders: '14,100',
      connectionScore: '98.8%'
    },
    tiers: [
      {
        name: 'Atelier Screen Pass',
        badge: 'Tier I',
        price: '25 USDC / mo',
        perks: ['Paris Salon Journal', 'Behind-the-Camera Stills', 'Subtitled Director Commentary']
      },
      {
        name: 'Montmartre VIP',
        badge: 'Tier II',
        price: '95 USDC / mo',
        perks: ['Private Paris Screening Invitation', 'Signed Master Screenplay', 'Virtual French Cinema Masterclass']
      },
      {
        name: 'Maison Muse',
        badge: 'Tier III',
        price: '390 USDC / mo',
        perks: ['Private Dinner in Le Marais, Paris', 'On-Set VIP Guest Pass', 'Dedicated Screen Dedication']
      }
    ],
    upcomingDrop: {
      id: 'drop-cf-02',
      title: 'Lumière d’Automne — 35mm Master Key',
      type: 'Wearable',
      rarity: 'Obsidian',
      releaseDate: 'Sunday, 17:00 UTC',
      priceUsd: 180
    },
    audioFrequency: {
      note: 293.66, // D4
      trackName: 'Paris Reverie in D minor',
      bpm: 88
    },
    socialProof: {
      curatorQuote: 'Camilla possesses an indelible intimacy that commands every frame.',
      curatorName: 'Claire Laurent',
      curatorOrg: 'Cinematheque Francaise'
    }
  },

  // ==========================================
  // 3. ONLINE INFLUENCERS
  // ==========================================
  {
    id: 'noah-reed',
    name: 'Noah Reed',
    handle: '@noahreed',
    title: 'Cinematic Filmmaker & Tech Visionary',
    category: 'Online Influencers',
    platform: 'YouTube',
    genre: 'Documentary Filmmaking & Tech Architecture',
    image: '/src/assets/images/influencer_noah_reed_1792514437092.jpg',
    bio: 'World’s premier cinematic tech documentarian with 14.2M subscribers on YouTube. Blending cinema-grade RED/Arri workflows with deep cultural tech storytelling.',
    accentColor: '#ef4444',
    glowRgba: 'rgba(239, 68, 68, 0.45)',
    status: {
      state: 'Editing Master',
      detail: '4K Feature Cut Rendering'
    },
    metrics: {
      fanRank: 5,
      listenersMonthly: '14.2M Subs',
      vaultHolders: '38,500',
      connectionScore: '99.2%'
    },
    tiers: [
      {
        name: 'Creator Pass',
        badge: 'Tier I',
        price: '20 USDC / mo',
        perks: ['Raw LUTs & Camera Profiles', 'Uncut Timeline Previews', 'Discord Studio Access']
      },
      {
        name: 'Studio Lab Key',
        badge: 'Tier II',
        price: '85 USDC / mo',
        perks: ['1-on-1 Video Editing Review', 'Early 4K Master Screening', 'Exclusive Gear Breakdown Streams']
      },
      {
        name: 'Executive Creator Circle',
        badge: 'Tier III',
        price: '360 USDC / mo',
        perks: ['Full Day Studio Immersion in LA', 'Co-Branded Video Credit', 'Direct Consultation Hotline']
      }
    ],
    upcomingDrop: {
      id: 'drop-nr-01',
      title: 'Acoustic Sound Lab Master LUT Pack & Pass',
      type: 'Audio Stem',
      rarity: 'Legendary',
      releaseDate: 'Friday, 19:00 UTC',
      priceUsd: 145
    },
    audioFrequency: {
      note: 440, // A4
      trackName: 'Acoustic Sound Lab Master',
      bpm: 120
    },
    socialProof: {
      curatorQuote: 'Noah revolutionized online cinema standards into an undisputed artform.',
      curatorName: 'Kallum Scott',
      curatorOrg: 'Digital Creator Guild'
    }
  },
  {
    id: 'maya-lin',
    name: 'Maya Lin',
    handle: '@maya.lin',
    title: 'Luxury Fashion & Creative Director',
    category: 'Online Influencers',
    platform: 'Instagram',
    genre: 'Atelier Streetwear & Haute Aesthetics',
    image: '/src/assets/images/influencer_maya_lin_1792514437857.jpg',
    bio: 'Global fashion tastemaker with 8.4M Instagram followers. Collaborating with Chanel, Saint Laurent, and Jacquemus while steering modern luxury lifestyle culture.',
    accentColor: '#d946ef',
    glowRgba: 'rgba(217, 70, 239, 0.45)',
    status: {
      state: 'Exclusive Drop Live',
      detail: 'Milan Fashion Week Collab'
    },
    metrics: {
      fanRank: 6,
      listenersMonthly: '8.4M Followers',
      vaultHolders: '29,100',
      connectionScore: '99.1%'
    },
    tiers: [
      {
        name: 'Lookbook Inner Circle',
        badge: 'Tier I',
        price: '25 USDC / mo',
        perks: ['Private Close Friends Story Access', 'Paris/Milan Style Guides', 'Brand Archive Discounts']
      },
      {
        name: 'Front Row Pass',
        badge: 'Tier II',
        price: '115 USDC / mo',
        perks: ['1-on-1 Wardrobe Consultation Call', 'Signed Physical Lookbook', 'Backstage Fashion Week Access']
      },
      {
        name: 'Haute Ambassador',
        badge: 'Tier III',
        price: '440 USDC / mo',
        perks: ['Private Shopping Session in Paris', 'Curated Seasonal Wardrobe Gift', 'VIP Gala Companion Entry']
      }
    ],
    upcomingDrop: {
      id: 'drop-ml-02',
      title: 'Rue Saint-Honoré Capsule Vault Pass',
      type: 'Wearable',
      rarity: 'Celestial',
      releaseDate: 'Active Now',
      priceUsd: 280
    },
    audioFrequency: {
      note: 349.23, // F4
      trackName: 'Rue Saint-Honoré Soundscape',
      bpm: 114
    },
    socialProof: {
      curatorQuote: 'The gold standard of digital aesthetic curation and fashion influence.',
      curatorName: 'Marcello Rossi',
      curatorOrg: 'Milan Editorial Syndicate'
    }
  },
  {
    id: 'chloe-zephyr',
    name: 'Chloe Zephyr',
    handle: '@chloe.zephyr',
    title: 'Viral Trendsetter & Cultural Architect',
    category: 'Online Influencers',
    platform: 'TikTok',
    genre: 'Short-Form Choreography & Style Trends',
    image: '/src/assets/images/influencer_chloe_zephyr_1792514459365.jpg',
    bio: 'TikTok cultural phenomenon with 22.8M followers. Architect of global audio trends, viral dance choreography, and hyper-pop visual aesthetics.',
    accentColor: '#00f0ff',
    glowRgba: 'rgba(0, 240, 255, 0.45)',
    status: {
      state: 'Live Backstage',
      detail: 'Global Creator Studio Stream'
    },
    metrics: {
      fanRank: 7,
      listenersMonthly: '22.8M Followers',
      vaultHolders: '52,400',
      connectionScore: '99.7%'
    },
    tiers: [
      {
        name: 'FYP VIP Access',
        badge: 'Tier I',
        price: '15 USDC / mo',
        perks: ['Audio Trend Stems 48h Early', 'Exclusive Creator Discord', 'Monthly Livestream Hangout']
      },
      {
        name: 'Trendsetter Key',
        badge: 'Tier II',
        price: '75 USDC / mo',
        perks: ['Personalized Shoutout Duet', 'Choreography Breakdown Video', 'VIP Merch Box Delivered']
      },
      {
        name: 'Obsidian Creator Club',
        badge: 'Tier III',
        price: '320 USDC / mo',
        perks: ['In-Person Video Collab in LA', 'Custom Brand Strategy Mentorship', 'All-Access Tour Pass']
      }
    ],
    upcomingDrop: {
      id: 'drop-cz-03',
      title: 'Hyper-Pop Wave — Creator Audio License',
      type: 'Audio Stem',
      rarity: 'Legendary',
      releaseDate: 'Tomorrow, 21:00 UTC',
      priceUsd: 120
    },
    audioFrequency: {
      note: 523.25, // C5
      trackName: 'Hyper-Pop Stems (140 BPM)',
      bpm: 140
    },
    socialProof: {
      curatorQuote: 'Chloe shapes what 50 million people listen to and wear every single week.',
      curatorName: 'Jax Rivera',
      curatorOrg: 'Gen-Z Culture Wire'
    }
  }
];
