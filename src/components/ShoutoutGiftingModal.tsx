import React, { useState, useMemo } from 'react';
import { ArtistProfile, UserProfile, ShoutoutTierId, LedgerEntry } from '../types';
import { ARTISTS_DATA } from '../data/artists';
import { SHOUTOUT_TIERS, DIGITAL_GIFTS } from '../data/shoutouts';
import {
  X,
  Sparkles,
  Video,
  Gift,
  Heart,
  Clock,
  ShieldCheck,
  Check,
  HelpCircle,
  Code2,
  FileText,
  Volume2,
  Send,
  AtSign,
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

interface ShoutoutGiftingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  preselectedArtist?: ArtistProfile | null;
  onConfirmShoutout: (record: Omit<LedgerEntry, 'id' | 'hash' | 'createdAt'>) => void;
}

export const ShoutoutGiftingModal: React.FC<ShoutoutGiftingModalProps> = ({
  isOpen,
  onClose,
  user,
  preselectedArtist,
  onConfirmShoutout,
}) => {
  const [selectedArtistId, setSelectedArtistId] = useState<string>(
    preselectedArtist?.id || ARTISTS_DATA[0].id
  );
  const [selectedTierId, setSelectedTierId] = useState<ShoutoutTierId>('love_dedication');
  const [recipientName, setRecipientName] = useState('Chloe Henderson');
  const [phonetic, setPhonetic] = useState('KLOH-ee HEN-der-sun');
  const [occasion, setOccasion] = useState('Romantic Love Dedication');
  const [tone, setTone] = useState<'Heartfelt & Warm' | 'Energetic & Hype' | 'Intimate & Poetic' | 'Mentorship & Creative'>(
    'Intimate & Poetic'
  );
  const [instructions, setInstructions] = useState(
    'Please tell Chloe that she is my soulmate and the melody of my life. Mention our first concert in Kyoto and say "I love you to infinity and back" from Julian.'
  );
  const [selectedGiftId, setSelectedGiftId] = useState<string>('gift_rose');
  const [deliverySpeed, setDeliverySpeed] = useState<'Standard (48h)' | 'Express (24h)' | 'Rush (6h)'>(
    'Express (24h)'
  );
  const [isPrivateVideo, setIsPrivateVideo] = useState(true);
  const [activeTab, setActiveTab] = useState<'builder' | 'wireframe'>('builder');
  const [isSuccess, setIsSuccess] = useState(false);

  const artist = useMemo(() => {
    return ARTISTS_DATA.find((a) => a.id === selectedArtistId) || ARTISTS_DATA[0];
  }, [selectedArtistId]);

  const selectedTier = SHOUTOUT_TIERS[selectedTierId];
  const selectedGift = DIGITAL_GIFTS.find((g) => g.id === selectedGiftId);

  // Financial calculation
  const speedSurcharge = deliverySpeed === 'Rush (6h)' ? 60 : deliverySpeed === 'Express (24h)' ? 25 : 0;
  const giftPrice = selectedGift ? selectedGift.priceUsd : 0;
  const subtotal = selectedTier.priceUsd + speedSurcharge + giftPrice;
  const escrowFee = Math.round(subtotal * 0.025 * 100) / 100;
  const totalAmount = Math.round((subtotal + escrowFee) * 100) / 100;

  if (!isOpen) return null;

  const handleApplySamplePrompt = (sample: string) => {
    soundEngine.playClickTick();
    setInstructions(sample);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClickTick();

    onConfirmShoutout({
      userId: user.id,
      artistId: artist.id,
      artistName: artist.name,
      artistImage: artist.image,
      type: 'shoutout',
      title: `${artist.name} — ${selectedTier.name} (${selectedTier.durationLabel})`,
      description: `Custom video dedication for ${recipientName} (${occasion}). Instructions: "${instructions.substring(0, 80)}..."`,
      status: 'pending',
      statusMetadata: {
        responseDeadlineAt: new Date(Date.now() + 48 * 3600000).toISOString(),
        escrowStatus: 'held',
      },
      scheduledFor: new Date(Date.now() + (deliverySpeed.includes('6h') ? 6 : deliverySpeed.includes('24h') ? 24 : 48) * 3600000).toISOString(),
      amountUsd: totalAmount,
      details: {
        format: 'Video Shoutout',
        occasion,
        recipientName,
        customNote: `Phonetic: ${phonetic}. Tone: ${tone}. Gift: ${selectedGift?.name || 'None'}. Prompt: ${instructions}`,
        streamKey: `sho_${artist.id}_${Math.floor(1000 + Math.random() * 9000)}`,
        deliverableUrl: `https://infiniti.firm/vault/shoutouts/${artist.id}-${Date.now()}.mp4`,
      },
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-[#04060d]/85 backdrop-blur-2xl transition-opacity" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl max-h-[94vh] overflow-y-auto rounded-3xl border border-white/15 bg-gradient-to-b from-[#0c1020] via-[#080b18] to-[#04060c] backdrop-blur-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] p-6 sm:p-8 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-300">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                  <span>CELEBRITY SHOUTOUT & GIFTING SUITE</span>
                  <span aria-hidden="true">·</span>
                  <span>4K STUDIO RECORDING</span>
                </div>
                <h2 className="text-xl font-bold text-white font-display mt-0.5">
                  Commission Bespoke Video Dedication
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab(activeTab === 'builder' ? 'wireframe' : 'builder')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-cyan-200 border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{activeTab === 'builder' ? 'View UX Wireframe & Flow' : 'Back to Builder'}</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {isSuccess ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Shoutout Order Dispatched</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                {selectedTier.name} commission for {recipientName} has been routed directly to {artist.name}’s atelier recording queue. Funds locked in escrow.
              </p>
            </div>
          ) : activeTab === 'wireframe' ? (
            /* Wireframe & UX Architecture View */
            <div className="mt-6 space-y-6">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>UI Wireframe Structure & Component Tree</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Structured breakdown of the responsive Liquid Glass layout designed for maximum emotional resonance, frictionless prompt input, and transparent pricing.
                </p>
              </div>

              {/* ASCII Wireframe */}
              <pre className="p-4 rounded-2xl bg-black/75 border border-white/10 text-cyan-300 font-mono text-[11px] leading-relaxed overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────────────────────┐
│ INFINITI firm: CELEBRITY SHOUTOUT & GIFTING WIREFRAME                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ [1. CELEBRITY LOCKUP]                                                       │
│  [Avatar] Artist Name · Category · Status · Rating · Typical Delivery Time  │
├─────────────────────────────────────────────────────────────────────────────┤
│ [2. SHOUTOUT TIERS - 4 CARDS WITH PRICING & VALUE LADDER]                   │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌───────────────┐ │
│  │ Quick 'Hi'     │ │ Milestone      │ │ Mentorship     │ │ 'I Love You'  │ │
│  │ $50 (15-20s)   │ │ $120 (45-60s)  │ │ $220 (90-120s) │ │ $400 (2-3min) │ │
│  │ [Brief Wave]   │ │ [Birthday/Win] │ │ [Creative Tip] │ │ [Forever Cut] │ │
│  └────────────────┘ └────────────────┘ └────────────────┘ └───────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ [3. CUSTOM PROMPT & INSTRUCTION COMPOSER]                                    │
│  • Recipient Name: [ John Doe                  ] [Pronunciation: JON DOH]   │
│  • Occasion: [ Birthday ▼ ]   • Tone: [ Heartfelt & Warm ▼ ]                 │
│  • Custom Prompt Instructions:                                              │
│    ┌──────────────────────────────────────────────────────────────────────┐ │
│    │ "Tell Maya her Berlin synth EP was inspirational..." (142/400 chars) │ │
│    └──────────────────────────────────────────────────────────────────────┘ │
│  • Quick Prompt Inspiration Chips: [Birthday] [Romantic] [Mentorship]       │
├─────────────────────────────────────────────────────────────────────────────┤
│ [4. DIGITAL GIFTING ADD-ONS]                                                │
│  [Cyber Rose +$15] · [Aether Champagne +$35] · [Diamond Crest +$100]        │
├─────────────────────────────────────────────────────────────────────────────┤
│ [5. DELIVERY SLA & SUMMARY FOOTER]                                          │
│  • Speed: [ Standard 48h ] [ Express 24h (+$25) ] [ Rush 6h (+$60) ]        │
│  • Total: $425 USD · [Lock Escrow & Dispatch Video Commission]              │
└─────────────────────────────────────────────────────────────────────────────┘`}
              </pre>

              {/* Delivery & Retrieval Flow Description */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
                  <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase">Phase 1: Recording</span>
                  <h5 className="text-xs font-bold text-white">Artist Studio Capture</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Celebrity receives phonetic guide and custom prompt on their private mobile portal. High-fidelity audio and 4K ProRes video is recorded with zero compression.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
                  <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase">Phase 2: Quality & Hash</span>
                  <h5 className="text-xs font-bold text-white">Automated QC & Watermark</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Video passes automated audio clarity and name detection checks. An immutable cryptographic watermark and SHA-256 ledger proof hash are embedded.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
                  <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase">Phase 3: Delivery</span>
                  <h5 className="text-xs font-bold text-white">Vault Stream & SMS Ping</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    The fan receives an instant SMS/email notification with a direct private Liquid Glass theater link, offering 4K stream playback, uncompressed MP4 download, and social sharing.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Interactive Builder View */
            <form onSubmit={handleSubmitOrder} className="mt-6 space-y-6">
              {/* Step 1: Celebrity Selection */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-2">
                  1. Select Celebrity / Public Figure
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {ARTISTS_DATA.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playClickTick();
                        setSelectedArtistId(a.id);
                      }}
                      className={`p-2.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center gap-3 ${
                        selectedArtistId === a.id
                          ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                          : 'bg-white/[0.04] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <img
                        src={a.image}
                        alt={a.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xl object-cover object-top border border-white/15 shrink-0"
                      />
                      <div className="truncate">
                        <p className="text-xs font-bold text-white truncate">{a.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{a.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Shoutout Tiers: Scaling from $50 up to $400 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    2. Choose Shoutout Tier
                  </label>
                  <span className="text-xs text-slate-400 font-mono">From quick hello to eternal dedication</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {(Object.keys(SHOUTOUT_TIERS) as ShoutoutTierId[]).map((tierKey) => {
                    const t = SHOUTOUT_TIERS[tierKey];
                    const isSelected = selectedTierId === tierKey;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playClickTick();
                          setSelectedTierId(t.id);
                        }}
                        className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-b from-cyan-500/20 to-blue-600/15 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                            : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-base font-extrabold text-white font-mono tabular-nums">
                              ${t.priceUsd} USD
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-cyan-300" />}
                          </div>

                          <h4 className="text-sm font-bold text-white font-display mt-1 line-clamp-1">
                            {t.name}
                          </h4>
                          <span className="text-[11px] font-mono text-cyan-300 block mt-0.5">
                            {t.durationLabel}
                          </span>

                          <p className="text-xs text-slate-300 mt-2 line-clamp-3">
                            {t.description}
                          </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-white/10">
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Best for</p>
                          <p className="text-[11px] text-slate-200 line-clamp-1">{t.idealFor}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Sample snippet showcase */}
                <div className="mt-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5 text-xs text-slate-300">
                  <Volume2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-mono text-cyan-300 font-semibold uppercase">
                      Sample {selectedTier.name} Response:
                    </span>
                    <p className="italic text-slate-300 mt-0.5">{selectedTier.exampleSnippet}</p>
                  </div>
                </div>
              </div>

              {/* Step 3: Custom Prompts & Specific Instructions Interface */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>3. Custom Prompt & Specific Instructions</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Celebrity reads instructions prior to shooting
                  </span>
                </div>

                {/* Recipient & Phonetic Spelling Guide */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Recipient / Fan Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chloe Henderson"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white outline-none focus:border-cyan-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Phonetic Pronunciation Guide (Helps celebrity say it right!)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. KLOH-ee HEN-der-sun"
                      value={phonetic}
                      onChange={(e) => setPhonetic(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-cyan-300 font-mono outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Occasion & Tone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Occasion / Dedication Reason
                    </label>
                    <select
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#0b0e1b] border border-white/10 text-xs text-slate-200 outline-none focus:border-cyan-400"
                    >
                      <option value="Romantic Love Dedication">Romantic Love Dedication / Proposal</option>
                      <option value="Birthday Celebration">Birthday Celebration</option>
                      <option value="Milestone & Career Leap">Milestone / Career Leap / Album Drop</option>
                      <option value="Creative Advice & Mentorship">Creative Advice & Mentorship</option>
                      <option value="Just Because / General Greeting">Just Because / Everyday Spark</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Desired Tone
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-xl bg-[#0b0e1b] border border-white/10 text-xs text-slate-200 outline-none focus:border-cyan-400"
                    >
                      <option value="Intimate & Poetic">Intimate & Poetic (Deep Emotional Resonance)</option>
                      <option value="Heartfelt & Warm">Heartfelt & Warm (Friendly & Gracious)</option>
                      <option value="Energetic & Hype">Energetic & Hype (Tour/Festival Vibe)</option>
                      <option value="Mentorship & Creative">Mentorship & Creative (Constructive Advice)</option>
                    </select>
                  </div>
                </div>

                {/* Specific Instructions Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      Specific Instructions & Key Talking Points *
                    </label>
                    <span className="text-[11px] font-mono text-slate-500">
                      {instructions.length} / 500 characters
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={500}
                    placeholder="Tell the celebrity who this is for, what to say, memories to reference, or specific jokes/phrases..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                    required
                  />

                  {/* Sample prompt chips */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[11px] text-slate-500">Prompt Inspiration:</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleApplySamplePrompt(
                          `Please tell ${recipientName} that they are my forever love. Reference our road trip under the Tokyo stars and say "I love you to the stars and back."`
                        )
                      }
                      className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[11px] text-cyan-300 border border-white/10 cursor-pointer"
                    >
                      Romantic & "I Love You"
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleApplySamplePrompt(
                          `Wish ${recipientName} an explosive Happy 25th Birthday! Tell them that their creative hustle inspires everyone and to play your new track on repeat today.`
                        )
                      }
                      className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[11px] text-amber-300 border border-white/10 cursor-pointer"
                    >
                      Birthday Celebration
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleApplySamplePrompt(
                          `Give ${recipientName} direct advice on producing modular synths. Mention not over-compressing the master channel and staying bold with unorthodox tuning.`
                        )
                      }
                      className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 border border-white/10 cursor-pointer"
                    >
                      Producer Mentorship
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 4: Digital Gifting Add-ons */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-2">
                  4. Optional Digital Gifting Token (Direct to Celebrity Vault)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClickTick();
                      setSelectedGiftId('');
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedGiftId === ''
                        ? 'bg-cyan-500/15 border-cyan-400 text-white'
                        : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <p className="text-xs font-bold">No Digital Gift</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">$0 USD</p>
                  </button>

                  {DIGITAL_GIFTS.map((gift) => (
                    <button
                      key={gift.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playClickTick();
                        setSelectedGiftId(gift.id);
                      }}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedGiftId === gift.id
                          ? 'bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                          : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{gift.name}</span>
                        <span className="text-xs font-mono text-cyan-300 tabular-nums">+${gift.priceUsd}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{gift.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 5: Delivery Speed & Cost Breakdown */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/15 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                      5. Delivery Speed SLA
                    </span>
                    <p className="text-[11px] text-slate-400">Guaranteed turnaround by artist management</p>
                  </div>

                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10">
                    {[
                      { id: 'Standard (48h)', label: 'Standard 48h (Free)' },
                      { id: 'Express (24h)', label: 'Express 24h (+$25)' },
                      { id: 'Rush (6h)', label: 'Rush 6h (+$60)' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playClickTick();
                          setDeliverySpeed(s.id as any);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                          deliverySpeed === s.id
                            ? 'bg-white/15 text-white shadow-sm font-semibold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>{selectedTier.name} Base Rate:</span>
                    <span className="font-mono tabular-nums text-white">${selectedTier.priceUsd}.00</span>
                  </div>
                  {speedSurcharge > 0 && (
                    <div className="flex justify-between text-amber-300">
                      <span>Expedited Delivery ({deliverySpeed}):</span>
                      <span className="font-mono tabular-nums">+${speedSurcharge}.00</span>
                    </div>
                  )}
                  {selectedGift && (
                    <div className="flex justify-between text-cyan-300">
                      <span>Digital Gift ({selectedGift.name}):</span>
                      <span className="font-mono tabular-nums">+${selectedGift.priceUsd}.00</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Platform Escrow & 4K Master Render (2.5%):</span>
                    <span className="font-mono tabular-nums text-slate-300">+${escrowFee.toFixed(2)}</span>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-wider">
                        Total Amount Due
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        Funds held in atomic escrow until video is delivered
                      </p>
                    </div>
                    <span className="text-2xl font-extrabold text-white font-mono tabular-nums">
                      ${totalAmount.toLocaleString()} USD
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>100% Satisfaction or Automatic Escrow Refund</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="h-11 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.35)] transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Dispatch Shoutout Order (${totalAmount})</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
