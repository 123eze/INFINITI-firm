import React, { useState, useMemo } from 'react';
import { ArtistProfile, UserProfile, MeetupTierId, LedgerEntry, SelectedLocationData } from '../types';
import { ARTISTS_DATA } from '../data/artists';
import { MEETUP_TIERS, calculateMeetupPrice } from '../utils/pricingEngine';
import { CascadingLocationSelector } from './CascadingLocationSelector';
import {
  X,
  Calendar,
  Sparkles,
  TrendingUp,
  Clock,
  ShieldCheck,
  Check,
  Code2,
  DollarSign,
  AlertCircle,
  Copy,
  MapPin,
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

interface MeetupBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  preselectedArtist?: ArtistProfile | null;
  onConfirmBooking: (record: Omit<LedgerEntry, 'id' | 'hash' | 'createdAt'>) => void;
}

export const MeetupBookingModal: React.FC<MeetupBookingModalProps> = ({
  isOpen,
  onClose,
  user,
  preselectedArtist,
  onConfirmBooking,
}) => {
  const [selectedArtistId, setSelectedArtistId] = useState<string>(
    preselectedArtist?.id || ARTISTS_DATA[0].id
  );
  const [selectedTierId, setSelectedTierId] = useState<MeetupTierId>('meet_and_greet');

  // Cascading Location Selector State
  const [locationData, setLocationData] = useState<SelectedLocationData>({
    isCustomVisit: false,
    country: 'United States',
    state: 'California',
    city: 'Los Angeles',
    spot: 'Sunset Sound Studios (Studio 2)',
    spotType: 'Acoustic Studio',
    spotAddress: '6650 Sunset Blvd, Hollywood, CA',
    customAddress: '',
    preferredTime: '12:00 PM – 08:00 PM CET',
    securityNotes: '',
  });

  // Default to 14 days in advance
  const defaultDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(defaultDate);
  const [specialRequests, setSpecialRequests] = useState('');
  const [activeTab, setActiveTab] = useState<'calculator' | 'code'>('calculator');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const artist = useMemo(() => {
    return ARTISTS_DATA.find((a) => a.id === selectedArtistId) || ARTISTS_DATA[0];
  }, [selectedArtistId]);

  // Recalculate price dynamically whenever tier or date changes
  const pricing = useMemo(() => {
    return calculateMeetupPrice(selectedTierId, selectedDate, user.tier);
  }, [selectedTierId, selectedDate, user.tier]);

  if (!isOpen) return null;

  const handlePresetDate = (days: number) => {
    soundEngine.playClickTick();
    const d = new Date();
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClickTick();

    const tierConfig = MEETUP_TIERS[selectedTierId];

    const locationDescription = locationData.isCustomVisit
      ? `Private Estate: ${locationData.customAddress || 'Bespoke Private Venue'} (${locationData.preferredTime || 'Custom window'})`
      : `${locationData.spot || 'Curated Landmark'}, ${locationData.city}, ${locationData.country}`;

    onConfirmBooking({
      userId: user.id,
      artistId: artist.id,
      artistName: artist.name,
      artistImage: artist.image,
      type: 'booking',
      title: `${artist.name} — ${tierConfig.name} (${tierConfig.tierLabel})`,
      description: `${tierConfig.durationLabel} in-person meetup scheduled for ${selectedDate} at ${locationDescription}. ${pricing.urgencyTierName} (${pricing.urgencyMultiplier}x multiplier).`,
      status: 'pending',
      statusMetadata: {
        responseDeadlineAt: new Date(Date.now() + 48 * 3600000).toISOString(),
        escrowStatus: 'held',
      },
      scheduledFor: `${selectedDate}T19:00:00Z`,
      amountUsd: pricing.finalTotalUsd,
      details: {
        format: tierConfig.id === 'meet_and_greet' ? 'Spatial Hologram (1-on-1)' : 'Studio Session',
        durationMinutes: tierConfig.id === 'meet_and_greet' ? 30 : tierConfig.id === 'dinner' ? 120 : tierConfig.id === 'hangout' ? 240 : 480,
        customNote: specialRequests.trim() || (locationData.isCustomVisit ? `Bespoke Estate: ${locationData.customAddress || 'Private Address'} | Window: ${locationData.preferredTime || 'Arranged window'} | Security: ${locationData.securityNotes || 'VIP Protocol'}` : `Venue: ${locationData.spot} (${locationData.spotAddress})`),
        streamKey: `meet_${artist.id}_${Math.floor(1000 + Math.random() * 9000)}`,
        deliverableUrl: `https://infiniti.firm/vault/meetups/${artist.id}-${selectedDate}`,
      },
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1600);
  };

  const jsFunctionCode = `/**
 * JavaScript/TypeScript Dynamic Meetup Pricing Function
 * Calculates final cost based on Tier Base Price multiplied by time-urgency factor.
 */
function calculateMeetupPrice(tierBasePrice, targetDateStr, patronDiscountRate = 0.0) {
  const targetDate = new Date(targetDateStr);
  const now = new Date();
  
  // Normalize date boundaries
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysInAdvance = Math.max(0, Math.floor((targetDate - now) / msPerDay));
  
  let multiplier = 1.0;
  
  if (daysInAdvance <= 2) {
    // 0 - 2 days: Emergency scheduling surge
    multiplier = 2.50;
  } else if (daysInAdvance <= 7) {
    // 3 - 7 days: Linear decay from 2.0x down to 1.6x
    multiplier = 1.60 + ((7 - daysInAdvance) / 4) * 0.40;
  } else if (daysInAdvance <= 14) {
    // 8 - 14 days: Linear decay from 1.5x down to 1.25x
    multiplier = 1.25 + ((14 - daysInAdvance) / 6) * 0.25;
  } else if (daysInAdvance <= 30) {
    // 15 - 30 days: Standard booking window from 1.2x to 1.05x
    multiplier = 1.05 + ((30 - daysInAdvance) / 15) * 0.15;
  } else {
    // > 30 days: Base advance rate
    multiplier = 1.00;
  }
  
  multiplier = Math.round(multiplier * 100) / 100;
  const scaledPrice = tierBasePrice * multiplier;
  const discount = scaledPrice * patronDiscountRate;
  const escrowFee = tierBasePrice * 0.025;
  const finalTotal = Math.round((scaledPrice - discount + escrowFee) * 100) / 100;

  return {
    basePrice: tierBasePrice,
    daysInAdvance,
    urgencyMultiplier: multiplier,
    urgencySurcharge: Math.round((scaledPrice - tierBasePrice) * 100) / 100,
    patronDiscount: Math.round(discount * 100) / 100,
    escrowFee: Math.round(escrowFee * 100) / 100,
    finalTotal
  };
}`;

  const pythonFunctionCode = `from datetime import datetime, timezone
import math

def calculate_meetup_price(tier_base_price: float, target_date_str: str, patron_discount: float = 0.0) -> dict:
    """
    Python Dynamic Meetup Pricing Engine
    Calculates final price via Tier Base Price * Time-Urgency Multiplier.
    """
    target_date = datetime.fromisoformat(target_date_str).replace(tzinfo=timezone.utc)
    now = datetime.now(timezone.utc)
    
    delta = target_date - now
    days_in_advance = max(0, delta.days)
    
    # Time-sensitivity decay curve
    if days_in_advance <= 2:
        multiplier = 2.50  # 48h emergency schedule surge
    elif days_in_advance <= 7:
        multiplier = 1.60 + ((7 - days_in_advance) / 4.0) * 0.40
    elif days_in_advance <= 14:
        multiplier = 1.25 + ((14 - days_in_advance) / 6.0) * 0.25
    elif days_in_advance <= 30:
        multiplier = 1.05 + ((30 - days_in_advance) / 15.0) * 0.15
    else:
        multiplier = 1.00  # Baseline advance notice
        
    multiplier = round(multiplier, 2)
    scaled_price = tier_base_price * multiplier
    discount_amount = scaled_price * patron_discount
    escrow_fee = tier_base_price * 0.025  # 2.5% platform guarantee
    final_total = round(scaled_price - discount_amount + escrow_fee, 2)
    
    return {
        "base_price": tier_base_price,
        "days_in_advance": days_in_advance,
        "urgency_multiplier": multiplier,
        "urgency_surcharge": round(scaled_price - tier_base_price, 2),
        "discount_amount": round(discount_amount, 2),
        "escrow_fee": round(escrow_fee, 2),
        "final_total": final_total
    }`;

  const copyCodeToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
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
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                  <span>INFINITI FIRM BOOKING ENGINE</span>
                  <span aria-hidden="true">·</span>
                  <span>TIME-SENSITIVITY SURGE LOGIC</span>
                </div>
                <h2 className="text-xl font-bold text-white font-display mt-0.5">
                  Dynamic Meetup Tier Booking & Cost Engine
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab(activeTab === 'calculator' ? 'code' : 'calculator')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-cyan-200 border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>{activeTab === 'calculator' ? 'View Algorithm Code' : 'Back to Calculator'}</span>
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
              <h3 className="text-xl font-bold text-white">Meetup Reservation Confirmed</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                {MEETUP_TIERS[selectedTierId].name} with {artist.name} on {selectedDate} locked at ${pricing.finalTotalUsd} USD. Permanent record committed to your account ledger.
              </p>
            </div>
          ) : activeTab === 'code' ? (
            /* Code View Tab */
            <div className="mt-6 space-y-5">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <h4 className="text-sm font-bold text-white">Dynamic Urgency Multiplier Formula</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Price scales continuously based on time delta between target meetup date and booking timestamp:
                  <span className="block mt-1 font-mono text-cyan-300">
                    Final Price = (Base Tier Price × Urgency Multiplier) - Patron Discount + Escrow Fee (2.5%)
                  </span>
                </p>
              </div>

              {/* JS Code */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-300">JavaScript / TypeScript Engine</span>
                  <button
                    onClick={() => copyCodeToClipboard(jsFunctionCode)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy JS</span>
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-black/70 border border-white/10 text-cyan-200 font-mono text-xs overflow-x-auto max-h-[220px]">
                  {jsFunctionCode}
                </pre>
              </div>

              {/* Python Code */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-300">Python 3 Production Implementation</span>
                  <button
                    onClick={() => copyCodeToClipboard(pythonFunctionCode)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Python</span>
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-black/70 border border-white/10 text-amber-200 font-mono text-xs overflow-x-auto max-h-[220px]">
                  {pythonFunctionCode}
                </pre>
              </div>
            </div>
          ) : (
            /* Calculator View Tab */
            <form onSubmit={handleBookingSubmit} className="mt-6 space-y-6">
              {/* Step 1: Artist Selection */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-2">
                  1. Select Creator / Cultural Figure
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

              {/* Step 2: Predefined Meetup Tiers (Meet & Greet, Dinner, Hangout, Visit) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    2. Choose Predefined Meetup Tier
                  </label>
                  <span className="text-xs text-slate-400 font-mono">Select exclusivity tier</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {(Object.keys(MEETUP_TIERS) as MeetupTierId[]).map((tierKey) => {
                    const t = MEETUP_TIERS[tierKey];
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
                            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-semibold">
                              {t.tierLabel}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-cyan-300" />}
                          </div>

                          <h4 className="text-base font-bold text-white font-display mt-1">
                            {t.name}
                          </h4>
                          <p className="text-xs font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            <span>{t.durationLabel}</span>
                          </p>

                          <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                            {t.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/10 flex items-baseline justify-between">
                          <span className="text-[10px] text-slate-400 uppercase">Base Price</span>
                          <span className="text-sm font-bold text-white font-mono tabular-nums">
                            ${t.basePriceUsd} USD
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Cascading Location Selector (Hierarchy Flow or Visit Tier Exception) */}
              <CascadingLocationSelector
                tierId={selectedTierId}
                value={locationData}
                onChange={setLocationData}
              />

              {/* Step 4: Calendar Date Picker & Urgency Multiplier */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>4. Select Calendar Date (Dynamic Time-Sensitivity)</span>
                    </label>
                    <p className="text-xs text-slate-400">
                      The closer the date is to today, the higher the urgency surge multiplier.
                    </p>
                  </div>

                  {/* Quick Presets */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-500 mr-1">Presets:</span>
                    <button
                      type="button"
                      onClick={() => handlePresetDate(1)}
                      className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[11px] font-mono text-rose-300 border border-rose-400/30 cursor-pointer"
                    >
                      +1d (Rush)
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetDate(5)}
                      className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[11px] font-mono text-amber-300 border border-amber-400/30 cursor-pointer"
                    >
                      +5d (High)
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetDate(14)}
                      className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[11px] font-mono text-cyan-300 border border-cyan-400/30 cursor-pointer"
                    >
                      +14d (Norm)
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetDate(45)}
                      className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[11px] font-mono text-emerald-300 border border-emerald-400/30 cursor-pointer"
                    >
                      +45d (Base)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-5">
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-white/[0.05] border border-white/15 text-sm text-white font-mono outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Urgency Factor Badge & Visual Meter */}
                  <div className="sm:col-span-7 p-3.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                        Time Urgency Factor
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`text-lg font-extrabold font-mono tabular-nums ${
                            pricing.urgencyMultiplier >= 2.0
                              ? 'text-rose-400'
                              : pricing.urgencyMultiplier >= 1.5
                              ? 'text-amber-400'
                              : pricing.urgencyMultiplier > 1.0
                              ? 'text-cyan-300'
                              : 'text-emerald-400'
                          }`}
                        >
                          {pricing.urgencyMultiplier.toFixed(2)}x
                        </span>
                        <span className="text-xs text-slate-300">
                          ({pricing.daysInAdvance} {pricing.daysInAdvance === 1 ? 'day' : 'days'} advance notice)
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-mono py-1 px-2.5 rounded-lg bg-white/10 border border-white/15 text-slate-200">
                      {pricing.urgencyTierName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 5: Transparent Cost Breakdown & Settlement Calculation */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/15 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  <span>5. Transparent Price Architecture</span>
                  <span className="text-cyan-300 font-mono">USDC / USD Settlement</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>
                      {pricing.tierName} Base Rate:
                    </span>
                    <span className="font-mono tabular-nums text-white">
                      ${pricing.basePriceUsd.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span className="flex items-center gap-1">
                      <span>Time-Urgency Multiplier ({pricing.urgencyMultiplier}x):</span>
                    </span>
                    <span
                      className={`font-mono tabular-nums font-semibold ${
                        pricing.urgencySurchargeUsd > 0 ? 'text-amber-300' : 'text-slate-400'
                      }`}
                    >
                      +${pricing.urgencySurchargeUsd.toFixed(2)}
                    </span>
                  </div>

                  {pricing.patronTierDiscountUsd > 0 && (
                    <div className="flex justify-between text-emerald-300">
                      <span>Patron Privilege ({user.tier}):</span>
                      <span className="font-mono tabular-nums">
                        -${pricing.patronTierDiscountUsd.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-400">
                    <span>Escrow & Security Bond (2.5%):</span>
                    <span className="font-mono tabular-nums text-slate-300">
                      +${pricing.escrowFeeUsd.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      Total Guaranteed Cost
                    </span>
                    <p className="text-[11px] text-slate-500 font-mono">Locked in atomic escrow upon booking</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-white font-mono tabular-nums">
                      ${pricing.finalTotalUsd.toLocaleString()} USD
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit & Cancel */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>100% Escrow Protected · Instant Audit Hash Generation</span>
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
                    <Sparkles className="w-4 h-4" />
                    <span>Lock Meetup Reservation (${pricing.finalTotalUsd})</span>
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
