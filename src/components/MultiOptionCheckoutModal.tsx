import React, { useState } from 'react';
import { PaymentGatewayId, GatewayStatus, PaymentGatewayConfig, UserProfile, LedgerEntry } from '../types';
import {
  X,
  CreditCard,
  Smartphone,
  Wallet,
  Check,
  Copy,
  AlertTriangle,
  ShieldCheck,
  Lock,
  Sparkles,
  QrCode,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Sliders,
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

interface MultiOptionCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  itemTitle?: string;
  itemPriceUsd?: number;
  onPaymentSuccess?: (record: Omit<LedgerEntry, 'id' | 'hash' | 'createdAt'>) => void;
}

export const MultiOptionCheckoutModal: React.FC<MultiOptionCheckoutModalProps> = ({
  isOpen,
  onClose,
  user,
  itemTitle = "Aurora Vane — 1-on-1 Spatial Meetup (Plus Tier)",
  itemPriceUsd = 450,
  onPaymentSuccess,
}) => {
  // Gateways configuration with live availability state
  const [gateways, setGateways] = useState<Record<PaymentGatewayId, PaymentGatewayConfig>>({
    express_wallet: {
      id: 'express_wallet',
      name: 'Google Pay / Apple Pay',
      badgeLabel: 'Express Wallets',
      status: 'active',
      statusMessage: 'Device Biometrics Operational (Apple Pay & Google Wallet API 2.0)',
      latencyMs: 14,
      uptime: '99.99%',
      supportedMethods: ['Apple Pay', 'Google Pay', 'Biometric Passkey'],
    },
    credit_card: {
      id: 'credit_card',
      name: 'Credit / Debit Card',
      badgeLabel: 'Direct Bank Card',
      status: 'active',
      statusMessage: '3D Secure 2.2 Routing Active via Stripe / Adyen Vault',
      latencyMs: 38,
      uptime: '99.95%',
      supportedMethods: ['Visa', 'Mastercard', 'American Express', 'Discover'],
    },
    crypto: {
      id: 'crypto',
      name: 'Cryptocurrency (USDC / ETH)',
      badgeLabel: 'Web3 & Multi-Chain',
      status: 'active',
      statusMessage: 'Arbitrum One & Ethereum Mainnet RPC Nodes Healthy',
      latencyMs: 120,
      uptime: '100.0%',
      supportedMethods: ['USDC (Arbitrum)', 'USDC (Ethereum)', 'ETH', 'SOL'],
    },
  });

  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayId>('express_wallet');
  const [showAdminSim, setShowAdminSim] = useState(false);

  // Card Form State
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvc, setCardCvc] = useState('892');
  const [cardZip, setCardZip] = useState('94103');
  const [cardholderName, setCardholderName] = useState(user.fullName);

  // Crypto State
  const [cryptoToken, setCryptoToken] = useState<'USDC-Arb' | 'USDC-Eth' | 'ETH'>('USDC-Arb');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [cryptoAddress] = useState('0x8F9B2C41E09477B132A85501A94D25C6718E34F1');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Toggle availability status of a payment gateway (Active, Degraded, Temporarily Unavailable)
  const handleToggleGatewayStatus = (id: PaymentGatewayId, nextStatus: GatewayStatus) => {
    soundEngine.playClickTick();
    setGateways((prev) => {
      const messages = {
        active: 'Operational — All payment channels nominal.',
        degraded: 'Elevated Latency — Settlement may take 1-2 minutes longer.',
        unavailable: 'Temporarily Unavailable — Upstream banking gateway undergoing scheduled maintenance.',
      };
      return {
        ...prev,
        [id]: {
          ...prev[id],
          status: nextStatus,
          statusMessage: messages[nextStatus],
        },
      };
    });

    // If current selected gateway is set to unavailable, switch to first active one
    if (nextStatus === 'unavailable' && selectedGateway === id) {
      const activeOne = (['express_wallet', 'credit_card', 'crypto'] as PaymentGatewayId[]).find(
        (g) => g !== id && gateways[g].status !== 'unavailable'
      );
      if (activeOne) setSelectedGateway(activeOne);
    }
  };

  const copyCryptoAddress = () => {
    navigator.clipboard.writeText(cryptoAddress);
    soundEngine.playClickTick();
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    const currentG = gateways[selectedGateway];
    if (currentG.status === 'unavailable') return;

    setIsProcessing(true);
    soundEngine.playClickTick();

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      if (onPaymentSuccess) {
        onPaymentSuccess({
          userId: user.id,
          artistId: 'aurora-vane',
          artistName: 'Aurora Vane',
          artistImage: '/src/assets/images/infiniti_artist_aurora_1792510926400.jpg',
          type: 'booking',
          title: `${itemTitle} (${currentG.name})`,
          description: `Settled via ${currentG.name} with 100% Escrow Protection.`,
          status: 'confirmed',
          amountUsd: itemPriceUsd,
          details: {
            format: 'Studio Session',
            customNote: `Gateway: ${currentG.name} · Transacted by ${user.fullName}`,
            streamKey: `pay_${Date.now()}_escrow_settled`,
            deliverableUrl: 'https://infiniti.firm/vault/receipts',
          },
        });
      }

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1800);
    }, 1400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-[#04060d]/85 backdrop-blur-2xl transition-opacity" onClick={onClose} />

      <div className="relative z-10 w-full max-w-3xl max-h-[94vh] overflow-y-auto rounded-3xl border border-white/15 bg-gradient-to-b from-[#0e1324] via-[#080b18] to-[#04060c] backdrop-blur-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] p-6 sm:p-8 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-300">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                  <span>FINTECH ESCROW CHECKOUT</span>
                  <span aria-hidden="true">·</span>
                  <span>AES-256 ENCRYPTED</span>
                </div>
                <h2 className="text-xl font-bold text-white font-display mt-0.5">
                  Multi-Gateway Settlement Portal
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAdminSim(!showAdminSim)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  showAdminSim
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                    : 'bg-white/10 hover:bg-white/15 border-white/10 text-slate-300'
                }`}
                title="Toggle Live Availability Simulator Controls"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Gateway Health Controls</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Admin Simulator Drawer (Allows user to toggle Availability live!) */}
          {showAdminSim && (
            <div className="mt-4 p-4 rounded-2xl bg-cyan-950/30 border border-cyan-400/30 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-300 font-bold uppercase flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Gateway Availability Simulator (Test Gateway Health in Real-Time)</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Simulates live outage or latency</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {(['express_wallet', 'credit_card', 'crypto'] as PaymentGatewayId[]).map((gId) => {
                  const g = gateways[gId];
                  return (
                    <div key={gId} className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-2">
                      <p className="text-xs font-semibold text-white truncate">{g.name}</p>
                      <div className="flex items-center gap-1">
                        {(['active', 'degraded', 'unavailable'] as GatewayStatus[]).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleToggleGatewayStatus(gId, st)}
                            className={`flex-1 py-1 rounded text-[10px] font-mono capitalize transition-all cursor-pointer ${
                              g.status === st
                                ? st === 'active'
                                  ? 'bg-emerald-500 text-black font-bold shadow-[0_0_8px_rgba(16,185,129,0.7)]'
                                  : st === 'degraded'
                                  ? 'bg-amber-400 text-black font-bold shadow-[0_0_8px_rgba(251,191,36,0.7)]'
                                  : 'bg-rose-500 text-white font-bold shadow-[0_0_8px_rgba(244,63,94,0.7)]'
                                : 'bg-white/5 text-slate-400 hover:text-white'
                            }`}
                          >
                            {st === 'unavailable' ? 'Down' : st}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isSuccess ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Payment Authorized & Escrow Locked</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                ${itemPriceUsd} USD settled via {gateways[selectedGateway].name}. Receipt hash and stream access token minted to your permanent account ledger.
              </p>
            </div>
          ) : (
            <form onSubmit={handlePay} className="mt-6 space-y-6">
              {/* Order Item Summary Banner */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300">
                    Escrow Guaranteed Allocation
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{itemTitle}</h4>
                  <p className="text-xs text-slate-400">Patron: {user.fullName} ({user.tier})</p>
                </div>
                <div className="sm:text-right">
                  <span className="text-xs text-slate-400 block">Total Due</span>
                  <span className="text-2xl font-extrabold text-white font-mono tabular-nums">
                    ${itemPriceUsd}.00 USD
                  </span>
                </div>
              </div>

              {/* Multi-Option Payment Gateway Grid with LIVE STATUS STICKERS */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-3">
                  Select Payment Gateway (With Live Health Status)
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {(['express_wallet', 'credit_card', 'crypto'] as PaymentGatewayId[]).map((gId) => {
                    const g = gateways[gId];
                    const isSelected = selectedGateway === gId;
                    const isDown = g.status === 'unavailable';

                    return (
                      <div
                        key={gId}
                        onClick={() => {
                          if (isDown) return;
                          soundEngine.playClickTick();
                          setSelectedGateway(gId);
                        }}
                        className={`relative rounded-2xl border p-4 transition-all duration-200 select-none flex flex-col justify-between ${
                          isDown
                            ? 'opacity-55 cursor-not-allowed bg-black/40 border-rose-500/30'
                            : isSelected
                            ? 'bg-gradient-to-b from-cyan-500/20 to-blue-600/15 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)] cursor-pointer'
                            : 'bg-white/[0.03] border-white/10 hover:border-white/20 cursor-pointer'
                        }`}
                      >
                        {/* LIVE AVAILABILITY STATUS STICKER / BADGE ON TOP */}
                        <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/10">
                          {/* Live Status Badge */}
                          <div
                            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${
                              g.status === 'active'
                                ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                                : g.status === 'degraded'
                                ? 'bg-amber-500/15 border-amber-400/40 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                                : 'bg-rose-500/20 border-rose-400/40 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                g.status === 'active'
                                  ? 'bg-emerald-400 animate-pulse'
                                  : g.status === 'degraded'
                                  ? 'bg-amber-400 animate-ping'
                                  : 'bg-rose-500'
                              }`}
                            />
                            <span>
                              {g.status === 'active'
                                ? 'Active'
                                : g.status === 'degraded'
                                ? 'Degraded'
                                : 'Unavailable'}
                            </span>
                          </div>

                          {/* Latency or Uptime */}
                          <span className="text-[10px] font-mono text-slate-400">
                            {g.status === 'unavailable' ? 'Offline' : `${g.latencyMs}ms`}
                          </span>
                        </div>

                        {/* Gateway Details */}
                        <div className="pt-3">
                          <div className="flex items-center gap-2 mb-1">
                            {gId === 'express_wallet' && <Smartphone className="w-4 h-4 text-cyan-300" />}
                            {gId === 'credit_card' && <CreditCard className="w-4 h-4 text-cyan-300" />}
                            {gId === 'crypto' && <Wallet className="w-4 h-4 text-cyan-300" />}
                            <h4 className="text-sm font-bold text-white">{g.name}</h4>
                          </div>

                          <p className="text-[11px] text-slate-300 leading-relaxed mt-1">
                            {g.status === 'unavailable' ? (
                              <span className="text-rose-300 font-medium flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 shrink-0" />
                                <span>Temporarily unavailable</span>
                              </span>
                            ) : (
                              g.statusMessage
                            )}
                          </p>
                        </div>

                        {/* Supported Sub-Methods */}
                        <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap gap-1">
                          {g.supportedMethods.map((m) => (
                            <span
                              key={m}
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Gateway View Based on Active Selection */}

              {/* VIEW 1: Google Pay / Apple Pay */}
              {selectedGateway === 'express_wallet' && (
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-cyan-400" />
                        <span>Apple Pay & Google Wallet Express Checkout</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Instant biometric authorization via TouchID, FaceID, or Android Passkey.
                      </p>
                    </div>
                    <span className="text-xs font-mono text-emerald-400">Zero Redirect</span>
                  </div>

                  {gateways.express_wallet.status === 'degraded' && (
                    <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-200 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Wallet token vault experiencing slight upstream delay (1-2 min).</span>
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-0.5 text-center sm:text-left">
                      <p className="text-xs text-slate-300 font-semibold">Detected Payment Device</p>
                      <p className="text-xs text-slate-500 font-mono">Apple Pay (Secure Element #8912-US)</p>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing || gateways.express_wallet.status === 'unavailable'}
                      className="w-full sm:w-auto h-11 px-8 rounded-xl bg-white text-black hover:bg-slate-200 font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <span>Pay with</span>
                      <span className="font-extrabold font-display"> Pay / GPay</span>
                    </button>
                  </div>
                </div>
              )}

              {/* VIEW 2: Traditional Credit/Debit Card Form */}
              {selectedGateway === 'credit_card' && (
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-cyan-400" />
                        <span>Credit / Debit Card Details</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Processed via PCI-DSS Level 1 tokenized encrypted tunnel.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                      <span>Visa</span>
                      <span>·</span>
                      <span>MC</span>
                      <span>·</span>
                      <span>Amex</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1">
                        Cardholder Legal Name
                      </label>
                      <input
                        type="text"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white outline-none focus:border-cyan-400"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-6">
                        <label className="text-xs font-medium text-slate-300 block mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-mono outline-none focus:border-cyan-400"
                          required
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="text-xs font-medium text-slate-300 block mb-1">
                          Expires (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-mono outline-none focus:border-cyan-400 text-center"
                          required
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="text-xs font-medium text-slate-300 block mb-1">
                          CVC / CVV
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-mono outline-none focus:border-cyan-400 text-center"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 3: Cryptocurrency Payment (Wallet Address + High-Contrast QR Code) */}
              {selectedGateway === 'crypto' && (
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-cyan-400" />
                        <span>Cryptocurrency Settlement (USDC / ETH)</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Send exact funds to the multisig vault address below or scan via mobile wallet.
                      </p>
                    </div>

                    {/* Token selector */}
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10">
                      {(['USDC-Arb', 'USDC-Eth', 'ETH'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            soundEngine.playClickTick();
                            setCryptoToken(t);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                            cryptoToken === t
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    {/* High-Contrast SVG QR Code */}
                    <div className="md:col-span-4 p-3 rounded-2xl bg-white flex flex-col items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.2)]">
                      <div
                        className="w-36 h-36 bg-black p-2 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23ffffff'/%3E%3Cpath d='M10 10h30v30H10zm10 10h10v10H20zm40-10h30v30H60zm10 10h10v10H70zM10 60h30v30H10zm10 10h10v10H20zm40 0h10v10H60zm20 0h10v20H80zm-10 10h10v10H70zm-20 10h10v10H50zm30-20h10v10H80zM50 10h10v20H50zm0 30h20v10H50zm0 20h10v10H50zm-30-10h20v10H20zm30-10h10v10H50z' fill='%23000000'/%3E%3C/svg%3E")`,
                          backgroundSize: 'contain',
                        }}
                      />
                      <span className="text-[10px] text-black font-mono font-bold mt-1 uppercase tracking-wider">
                        Scan with Web3 Wallet
                      </span>
                    </div>

                    {/* Address & Settlement Proof Info */}
                    <div className="md:col-span-8 space-y-3">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                          Target Vault Address ({cryptoToken})
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="text"
                            readOnly
                            value={cryptoAddress}
                            className="flex-1 h-10 px-3 rounded-xl bg-black/60 border border-white/15 text-xs text-cyan-300 font-mono outline-none select-all"
                          />
                          <button
                            type="button"
                            onClick={copyCryptoAddress}
                            className="h-10 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                          >
                            {copiedAddress ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-300">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 text-xs font-mono">
                        <div className="flex justify-between text-slate-400">
                          <span>Amount Required:</span>
                          <span className="text-white font-bold">${itemPriceUsd}.00 USDC</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Network:</span>
                          <span className="text-cyan-300">Arbitrum One (Low Gas: ~$0.02)</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Escrow Time-to-Live:</span>
                          <span className="text-emerald-400">14:59 mins remaining</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-white/10">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>100% Escrow Protected · Instant Audit Hash</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessing || gateways[selectedGateway].status === 'unavailable'}
                    className={`h-11 px-6 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                      gateways[selectedGateway].status === 'unavailable'
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                        : 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.35)] active:scale-[0.98]'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying with Gateway...</span>
                      </>
                    ) : gateways[selectedGateway].status === 'unavailable' ? (
                      <span>Gateway Unavailable</span>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Authorize ${itemPriceUsd}.00 Escrow</span>
                      </>
                    )}
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
