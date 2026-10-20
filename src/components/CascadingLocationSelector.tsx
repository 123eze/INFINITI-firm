import React, { useMemo } from 'react';
import { MeetupTierId, SelectedLocationData, CountryLocation, StateInfo, CityInfo, SpotInfo } from '../types';
import { MEETUP_LOCATIONS_DATA } from '../data/locations';
import {
  MapPin,
  Building2,
  Navigation,
  Sparkles,
  ShieldCheck,
  Check,
  Clock,
  Compass,
  AlertCircle,
  Home,
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

interface CascadingLocationSelectorProps {
  tierId: MeetupTierId;
  value: SelectedLocationData;
  onChange: (val: SelectedLocationData) => void;
}

export const CascadingLocationSelector: React.FC<CascadingLocationSelectorProps> = ({
  tierId,
  value,
  onChange,
}) => {
  const isVisitTier = tierId === 'visit';

  // Find currently selected hierarchical branch
  const currentCountryObj = useMemo(() => {
    if (!value.country) return null;
    return MEETUP_LOCATIONS_DATA.find((c) => c.country === value.country) || null;
  }, [value.country]);

  const currentStateObj = useMemo(() => {
    if (!currentCountryObj || !value.state) return null;
    return currentCountryObj.states.find((s) => s.name === value.state) || null;
  }, [currentCountryObj, value.state]);

  const currentCityObj = useMemo(() => {
    if (!currentStateObj || !value.city) return null;
    return currentStateObj.cities.find((c) => c.name === value.city) || null;
  }, [currentStateObj, value.city]);

  const currentSpotObj = useMemo(() => {
    if (!currentCityObj || !value.spot) return null;
    return currentCityObj.spots.find((sp) => sp.name === value.spot) || null;
  }, [currentCityObj, value.spot]);

  // Handlers for cascading state resets
  const handleCountryChange = (countryName: string) => {
    soundEngine.playClickTick();
    onChange({
      isCustomVisit: false,
      country: countryName,
      state: '',
      city: '',
      spot: '',
      spotType: '',
      spotAddress: '',
    });
  };

  const handleStateChange = (stateName: string) => {
    soundEngine.playClickTick();
    onChange({
      ...value,
      isCustomVisit: false,
      state: stateName,
      city: '',
      spot: '',
      spotType: '',
      spotAddress: '',
    });
  };

  const handleCityChange = (cityName: string) => {
    soundEngine.playClickTick();
    onChange({
      ...value,
      isCustomVisit: false,
      city: cityName,
      spot: '',
      spotType: '',
      spotAddress: '',
    });
  };

  const handleSpotChange = (spotName: string) => {
    soundEngine.playClickTick();
    const spotObj = currentCityObj?.spots.find((sp) => sp.name === spotName);
    onChange({
      ...value,
      isCustomVisit: false,
      spot: spotName,
      spotType: spotObj?.type || '',
      spotAddress: spotObj?.addressSnippet || '',
    });
  };

  // Visit Tier custom address handlers
  const handleCustomAddressChange = (address: string) => {
    onChange({
      ...value,
      isCustomVisit: true,
      customAddress: address,
    });
  };

  const handlePreferredTimeChange = (timeStr: string) => {
    onChange({
      ...value,
      isCustomVisit: true,
      preferredTime: timeStr,
    });
  };

  const handleSecurityNotesChange = (notes: string) => {
    onChange({
      ...value,
      isCustomVisit: true,
      securityNotes: notes,
    });
  };

  // -------------------------------------------------------------------------
  // EXCEPTION RULE: VISIT TIER (Bespoke Private Location & Schedule Suite)
  // -------------------------------------------------------------------------
  if (isVisitTier) {
    return (
      <div className="p-5 rounded-2xl bg-gradient-to-b from-purple-500/10 via-indigo-500/5 to-transparent border border-purple-400/30 space-y-4 animate-in fade-in duration-300">
        {/* Exception Rule Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-purple-400/20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 font-bold block">
                VISIT TIER EXCEPTION ACTIVE
              </span>
              <h4 className="text-sm font-bold text-white">
                Bespoke Private Estate / Custom Atelier Address
              </h4>
            </div>
          </div>
          <span className="text-xs font-mono py-0.5 px-2.5 rounded-md bg-purple-400/15 border border-purple-400/30 text-purple-200 w-fit">
            Standard Dropdowns Bypassed
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Because you selected the ultra-exclusive <strong className="text-white">Visit Tier</strong>, you are not bound to standard studio or restaurant landmarks. The artist and executive security entourage will travel directly to your preferred private venue, estate, or private yacht.
        </p>

        {/* Custom Input Fields for Visit Tier */}
        <div className="space-y-3.5 pt-1">
          {/* Custom Address Input */}
          <div>
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              <span>Custom Private Address / Estate / Atelier Location *</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Villa d’Este, Via Regina 40, Cernobbio, Lake Como, Italy or Private Residence, Bel Air, CA"
              value={value.customAddress || ''}
              onChange={(e) => handleCustomAddressChange(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-white/[0.05] border border-purple-400/30 text-xs text-white placeholder:text-slate-500 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/40 transition-all font-sans"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Preferred Time Window */}
            <div>
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 mb-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>Preferred Arrival Time & Daily Window *</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 11:30 AM – 08:00 PM CET"
                value={value.preferredTime || ''}
                onChange={(e) => handlePreferredTimeChange(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white placeholder:text-slate-500 outline-none focus:border-purple-400 font-mono"
                required
              />
            </div>

            {/* Security Clearance & Gate Access */}
            <div>
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Gate Code / Chauffeur Instructions</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Gate code #8902 or Concierge check-in name"
                value={value.securityNotes || ''}
                onChange={(e) => handleSecurityNotesChange(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white placeholder:text-slate-500 outline-none focus:border-purple-400 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-purple-300 font-mono pt-1">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>Includes dedicated Maybach chauffeur coordination & advance security sweep.</span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // STANDARD HIERARCHY FLOW: Country ➔ State/Province ➔ City ➔ Spot / Landmark
  // -------------------------------------------------------------------------
  const isStateEnabled = Boolean(value.country && currentCountryObj);
  const isCityEnabled = Boolean(isStateEnabled && value.state && currentStateObj);
  const isSpotEnabled = Boolean(isCityEnabled && value.city && currentCityObj);

  return (
    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
      {/* Header & Breadcrumb Trail */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cascading Location Selector</span>
          </label>
          <p className="text-xs text-slate-400 mt-0.5">
            Curated acoustic studios, private dining salons, and official greenrooms.
          </p>
        </div>

        {/* Progress Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
          <span className={value.country ? 'text-cyan-300 font-bold' : 'text-slate-500'}>
            1. Country {value.country && '✓'}
          </span>
          <span className="text-slate-600">➔</span>
          <span className={value.state ? 'text-cyan-300 font-bold' : 'text-slate-500'}>
            2. State {value.state && '✓'}
          </span>
          <span className="text-slate-600">➔</span>
          <span className={value.city ? 'text-cyan-300 font-bold' : 'text-slate-500'}>
            3. City {value.city && '✓'}
          </span>
          <span className="text-slate-600">➔</span>
          <span className={value.spot ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
            4. Spot {value.spot && '✓'}
          </span>
        </div>
      </div>

      {/* 4 Cascading Dropdowns in Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Step 1: Country */}
        <div>
          <label className="text-xs font-medium text-slate-300 block mb-1.5">
            1. Select Country *
          </label>
          <select
            value={value.country || ''}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="w-full h-11 px-3 rounded-xl bg-[#0b0e1b] border border-white/15 text-xs text-slate-100 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all cursor-pointer"
          >
            <option value="" disabled className="text-slate-500">
              -- Choose Country --
            </option>
            {MEETUP_LOCATIONS_DATA.map((c) => (
              <option key={c.country} value={c.country} className="bg-[#0b0e1b] text-slate-200">
                {c.country} ({c.code})
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: State / Province */}
        <div>
          <label className="text-xs font-medium text-slate-300 block mb-1.5">
            2. State / Province *
          </label>
          <select
            disabled={!isStateEnabled}
            value={value.state || ''}
            onChange={(e) => handleStateChange(e.target.value)}
            className={`w-full h-11 px-3 rounded-xl border text-xs outline-none transition-all ${
              isStateEnabled
                ? 'bg-[#0b0e1b] border-white/15 text-slate-100 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 cursor-pointer'
                : 'bg-white/[0.02] border-white/5 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <option value="" disabled className="text-slate-500">
              {isStateEnabled ? '-- Choose State / Region --' : 'Select Country First'}
            </option>
            {currentCountryObj?.states.map((st) => (
              <option key={st.name} value={st.name} className="bg-[#0b0e1b] text-slate-200">
                {st.name}
              </option>
            ))}
          </select>
        </div>

        {/* Step 3: City */}
        <div>
          <label className="text-xs font-medium text-slate-300 block mb-1.5">
            3. City *
          </label>
          <select
            disabled={!isCityEnabled}
            value={value.city || ''}
            onChange={(e) => handleCityChange(e.target.value)}
            className={`w-full h-11 px-3 rounded-xl border text-xs outline-none transition-all ${
              isCityEnabled
                ? 'bg-[#0b0e1b] border-white/15 text-slate-100 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 cursor-pointer'
                : 'bg-white/[0.02] border-white/5 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <option value="" disabled className="text-slate-500">
              {isCityEnabled ? '-- Choose City --' : 'Select State First'}
            </option>
            {currentStateObj?.cities.map((city) => (
              <option key={city.name} value={city.name} className="bg-[#0b0e1b] text-slate-200">
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Step 4: Specific Spot or Landmark */}
        <div>
          <label className="text-xs font-medium text-slate-300 block mb-1.5">
            4. Spot / Landmark *
          </label>
          <select
            disabled={!isSpotEnabled}
            value={value.spot || ''}
            onChange={(e) => handleSpotChange(e.target.value)}
            className={`w-full h-11 px-3 rounded-xl border text-xs outline-none transition-all ${
              isSpotEnabled
                ? 'bg-[#0b0e1b] border-cyan-400/50 text-cyan-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.15)] font-semibold'
                : 'bg-white/[0.02] border-white/5 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <option value="" disabled className="text-slate-500">
              {isSpotEnabled ? '-- Choose Spot / Venue --' : 'Select City First'}
            </option>
            {currentCityObj?.spots.map((spot) => (
              <option key={spot.id} value={spot.name} className="bg-[#0b0e1b] text-slate-200">
                {spot.name} ({spot.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Verified Venue Details Card (Shows once Spot is selected) */}
      {currentSpotObj ? (
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 via-sky-500/5 to-transparent border border-cyan-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-400/20 text-cyan-300 shrink-0 mt-0.5">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-display">
                  {currentSpotObj.name}
                </span>
                <span className="text-[10px] font-mono py-0.5 px-2 rounded bg-cyan-400/15 border border-cyan-400/30 text-cyan-300">
                  {currentSpotObj.type}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1 font-mono">
                <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>{currentSpotObj.addressSnippet}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-mono shrink-0">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Sanctuary Acoustic Clearance Confirmed</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
          <Navigation className="w-3.5 h-3.5 text-slate-500" />
          <span>Follow sequence 1 through 4 to unlock verified artist landmark venue.</span>
        </div>
      )}
    </div>
  );
};
