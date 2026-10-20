import React, { useState } from 'react';
import { UserProfile, LedgerEntry, LedgerType, LedgerStatus } from '../types';
import { ARTISTS_DATA } from '../data/artists';
import { RequestStatusBadge } from './RequestStatusBadge';
import {
  History,
  Calendar,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  Video,
  FileCode,
  User,
  AtSign,
  PlusCircle,
  X,
  Radio,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

interface AccountLedgerViewProps {
  user: UserProfile;
  ledger: LedgerEntry[];
  onOpenRegistration: () => void;
  onOpenArchitecture: () => void;
  onAddLedgerRecord: (record: Omit<LedgerEntry, 'id' | 'hash' | 'createdAt'>) => void;
  onUpdateEntryStatus?: (
    id: string,
    newStatus: LedgerStatus,
    reviewerDetails?: {
      reviewerName?: string;
      reviewerRole?: 'artist' | 'management' | 'system';
      reason?: string;
    }
  ) => void;
}

export const AccountLedgerView: React.FC<AccountLedgerViewProps> = ({
  user,
  ledger,
  onOpenRegistration,
  onOpenArchitecture,
  onAddLedgerRecord,
  onUpdateEntryStatus,
}) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // New Shoutout / Booking Form state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [reqType, setReqType] = useState<LedgerType>('shoutout');
  const [reqArtistId, setReqArtistId] = useState<string>(ARTISTS_DATA[0].id);
  const [reqRecipient, setReqRecipient] = useState<string>(user.fullName);
  const [reqOccasion, setReqOccasion] = useState<string>('Album Launch');
  const [reqFormat, setReqFormat] = useState<string>('Video Shoutout');
  const [reqNotes, setReqNotes] = useState<string>('');
  const [reqDate, setReqDate] = useState<string>('2026-11-12');

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    soundEngine.playClickTick();
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filteredLedger = ledger.filter((entry) => {
    if (filterType === 'All') return true;
    return entry.type === filterType;
  });

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClickTick();
    const targetArtist = ARTISTS_DATA.find((a) => a.id === reqArtistId) || ARTISTS_DATA[0];

    const amount = reqType === 'booking' ? 350 : reqType === 'shoutout' ? 180 : 95;
    const title =
      reqType === 'shoutout'
        ? `${targetArtist.name} Personalized ${reqFormat}`
        : reqType === 'booking'
        ? `1-on-1 VIP Spatial Studio Session with ${targetArtist.name}`
        : `${targetArtist.name} Master Stem & Acoustic Interaction`;

    onAddLedgerRecord({
      userId: user.id,
      artistId: targetArtist.id,
      artistName: targetArtist.name,
      artistImage: targetArtist.image,
      type: reqType,
      title,
      description: reqNotes.trim() || `Requested by ${user.fullName} for occasion: ${reqOccasion}.`,
      status: 'pending',
      statusMetadata: {
        responseDeadlineAt: new Date(Date.now() + 48 * 3600000).toISOString(),
        escrowStatus: 'held',
      },
      scheduledFor: `${reqDate}T18:00:00Z`,
      amountUsd: amount,
      details: {
        format: reqFormat as any,
        occasion: reqOccasion,
        recipientName: reqRecipient,
        customNote: reqNotes,
        streamKey: `hlg_${targetArtist.id}_${Math.floor(1000 + Math.random() * 9000)}`,
        deliverableUrl: `https://infiniti.firm/vault/${reqType}s/${targetArtist.id}.mp4`,
      },
    });

    setIsRequestModalOpen(false);
    setReqNotes('');
  };

  const handleStatusTransition = (
    id: string,
    newStatus: LedgerStatus,
    reason?: string
  ) => {
    soundEngine.playClickTick();
    if (onUpdateEntryStatus) {
      onUpdateEntryStatus(id, newStatus, {
        reviewerName: `${selectedEntry?.artistName || 'Celebrity'} Management Guild`,
        reviewerRole: 'management',
        reason,
      });

      // Synchronize modal view entry
      if (selectedEntry && selectedEntry.id === id) {
        setSelectedEntry((prev) =>
          prev
            ? {
                ...prev,
                status: newStatus,
                statusMetadata: {
                  ...prev.statusMetadata,
                  reviewedAt: new Date().toISOString(),
                  reviewedBy: `${prev.artistName} Management Guild`,
                  reviewerRole: 'management',
                  escrowStatus: newStatus === 'approved' ? 'settled' : newStatus === 'rejected' ? 'refunded' : 'held',
                  rejectionReason: newStatus === 'rejected' ? (reason || 'Schedule conflict during target window.') : undefined,
                },
              }
            : null
        );
      }
    }
  };

  return (
    <section className="relative z-10 py-10 max-w-7xl mx-auto px-6 space-y-8">
      {/* Top Header Split: User Profile & Permanent Ledger Status */}
      <div className="p-8 rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.08] via-[#090d19]/90 to-[#04060c] backdrop-blur-3xl shadow-[0_20px_70px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-sky-400/20 to-indigo-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-200 text-2xl font-bold font-display shadow-[0_0_25px_rgba(0,240,255,0.25)]">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-white font-display">{user.fullName}</h1>
                <span className="text-xs font-mono py-0.5 px-2.5 rounded-md bg-cyan-400/10 border border-cyan-400/20 text-cyan-300">
                  {user.tier}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                <span>{user.email}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{user.phone}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-slate-300">Fan Key: {user.fanPassId}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenRegistration}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Update Registration
            </button>
            <button
              onClick={onOpenArchitecture}
              className="px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-xs font-semibold text-cyan-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>State Machine & DB Schema</span>
            </button>
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-slate-950 text-xs font-bold shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Direct Request</span>
            </button>
          </div>
        </div>

        {/* State Machine Legend / Status Explanation Bar */}
        <div className="mt-6 p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white font-display">Live Meetup State Machine:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-mono text-amber-300 text-[11px]">Unapproved / Request Sent</span>
            </div>
            <span className="text-slate-600">➔</span>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-mono text-emerald-300 text-[11px]">Request Approved / Accepted</span>
            </div>
            <span className="text-slate-600">/</span>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="font-mono text-rose-300 text-[11px]">Rejected / Declined</span>
            </div>
          </div>
        </div>

        {/* Social Handles Bar */}
        <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
          <span className="text-slate-500 uppercase tracking-wider text-[10px]">Verified Accounts:</span>
          {user.socialHandles.instagram && (
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1">
              <AtSign className="w-3 h-3 text-pink-400" />
              <span>{user.socialHandles.instagram}</span>
            </span>
          )}
          {user.socialHandles.twitter && (
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1">
              <AtSign className="w-3 h-3 text-sky-400" />
              <span>{user.socialHandles.twitter}</span>
            </span>
          )}
          {user.socialHandles.tiktok && (
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1">
              <AtSign className="w-3 h-3 text-teal-400" />
              <span>{user.socialHandles.tiktok}</span>
            </span>
          )}
          {user.socialHandles.telegram && (
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1">
              <AtSign className="w-3 h-3 text-blue-400" />
              <span>{user.socialHandles.telegram}</span>
            </span>
          )}
        </div>
      </div>

      {/* Ledger Records Table / Cards */}
      <div className="p-8 rounded-3xl border border-white/15 bg-gradient-to-b from-[#080c18] via-[#050812] to-[#020409] backdrop-blur-3xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-white font-display">
                Permanent Request & Ledger History
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Append-only cryptographic event trail tracking meetups, shoutouts, approvals, and settlements.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 self-start sm:self-auto overflow-x-auto max-w-full">
            {[
              { id: 'All', label: 'All Records' },
              { id: 'booking', label: 'Bookings' },
              { id: 'shoutout', label: 'Shoutouts' },
              { id: 'interaction', label: 'Interactions' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Items */}
        <div className="space-y-3">
          {filteredLedger.length === 0 ? (
            <div className="py-12 text-center rounded-2xl border border-white/10 bg-white/[0.02]">
              <p className="text-xs text-slate-400">No ledger entries match this category.</p>
            </div>
          ) : (
            filteredLedger.map((entry) => (
              <div
                key={entry.id}
                className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                {/* Left: Icon, Artist & Title */}
                <div className="flex items-start gap-4">
                  <img
                    src={entry.artistImage}
                    alt={entry.artistName}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover object-top border border-white/15 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-300 py-0.5 px-2 rounded bg-cyan-400/10 border border-cyan-400/20">
                        {entry.type}
                      </span>
                      <span className="text-xs text-slate-400">with</span>
                      <span className="text-xs font-bold text-white">{entry.artistName}</span>
                    </div>

                    <h3 className="text-sm font-bold text-white mt-1 group-hover:text-cyan-200 transition-colors">
                      {entry.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {entry.description}
                    </p>

                    {/* Unboxed Metadata */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 font-mono">
                      <span>Logged: {new Date(entry.createdAt).toLocaleDateString()}</span>
                      <span aria-hidden="true">·</span>
                      <span>Hash: {entry.hash.substring(0, 10)}...{entry.hash.substring(entry.hash.length - 6)}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Price, Status Badge, & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-white/10 shrink-0">
                  <div className="flex flex-col items-start md:items-end gap-1">
                    <p className="text-sm font-bold text-white font-mono tabular-nums">
                      ${entry.amountUsd} USD
                    </p>

                    {/* Live Status Badge Component */}
                    <RequestStatusBadge
                      status={entry.status}
                      metadata={entry.statusMetadata}
                      size="sm"
                      showDetails={false}
                      interactiveActions={
                        onUpdateEntryStatus
                          ? {
                              onApprove: () => handleStatusTransition(entry.id, 'approved'),
                              onReject: () => handleStatusTransition(entry.id, 'rejected'),
                              onResetPending: () => handleStatusTransition(entry.id, 'pending'),
                            }
                          : undefined
                      }
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyHash(entry.hash)}
                      title="Copy Cryptographic Ledger Hash"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedHash === entry.hash ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        soundEngine.playClickTick();
                        setSelectedEntry(entry);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Inspect Audit Proof
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Audit Proof & Status State Machine Inspection Modal */}
      {selectedEntry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-[#04060d]/85 backdrop-blur-xl"
            onClick={() => setSelectedEntry(null)}
          />
          <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-gradient-to-b from-[#0e1324] via-[#080b16] to-[#04060c] backdrop-blur-3xl shadow-[0_20px_70px_rgba(0,0,0,0.9)] p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-display">Cryptographic Audit & State Inspection</h3>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Live State Badge Card */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/15 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">
                Current Booking Status
              </span>
              <div className="flex items-center justify-between">
                <RequestStatusBadge
                  status={selectedEntry.status}
                  metadata={selectedEntry.statusMetadata}
                  size="md"
                  showDetails={true}
                />
                <span className="text-xs font-mono text-slate-400">
                  Escrow: <strong className="text-white">{selectedEntry.statusMetadata?.escrowStatus?.toUpperCase() || 'LOCKED'}</strong>
                </span>
              </div>
            </div>

            {/* Management Decision Simulation Panel */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/20 to-purple-950/40 border border-cyan-400/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-200 font-display flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Celebrity / Management Action Hub</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">Test Live Transitions</span>
              </div>
              <p className="text-xs text-slate-300">
                Simulate management review actions to observe instant state machine updates across the ledger:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusTransition(selectedEntry.id, 'approved', 'Authorized by Talent Management Team')}
                  className="py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Accept Request</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusTransition(selectedEntry.id, 'rejected', 'Touring conflict during target date window')}
                  className="py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Decline Request</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusTransition(selectedEntry.id, 'pending')}
                  className="py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reset Pending</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                  Immutable Transaction Hash
                </span>
                <p className="text-xs font-mono text-cyan-300 break-all select-all">
                  {selectedEntry.hash}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Record ID:</span>
                  <span className="font-mono text-white">{selectedEntry.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Artist / Influencer:</span>
                  <span className="font-semibold text-white">{selectedEntry.artistName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Activity Type:</span>
                  <span className="font-mono text-cyan-300 uppercase">{selectedEntry.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Settled Amount:</span>
                  <span className="font-mono text-white">${selectedEntry.amountUsd} USD</span>
                </div>
                {selectedEntry.scheduledFor && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Scheduled Target Date:</span>
                    <span className="font-mono text-cyan-300">
                      {new Date(selectedEntry.scheduledFor).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {selectedEntry.details.streamKey && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hologram Stream Key:</span>
                    <span className="font-mono text-emerald-300">{selectedEntry.details.streamKey}</span>
                  </div>
                )}
                {selectedEntry.details.deliverableUrl && (
                  <div className="flex justify-between items-center pt-1 border-t border-white/5">
                    <span className="text-slate-400">Deliverable Media:</span>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Opening verified media storage: ${selectedEntry.details.deliverableUrl}`);
                      }}
                      className="text-cyan-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      <span>Access Stream</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedEntry(null)}
              className="w-full h-10 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Close Ledger Audit
            </button>
          </div>
        </div>
      )}

      {/* New Booking / Shoutout Request Modal */}
      {isRequestModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-[#04060d]/85 backdrop-blur-2xl"
            onClick={() => setIsRequestModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-xl rounded-3xl border border-white/15 bg-gradient-to-b from-[#0c1020] via-[#080b16] to-[#04060c] backdrop-blur-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-lg font-bold text-white font-display">New Booking / Artist Shoutout</h3>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Select Interaction Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'shoutout', label: 'Artist Shoutout' },
                    { id: 'booking', label: '1-on-1 VIP Session' },
                    { id: 'interaction', label: 'Stem Access' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setReqType(t.id as LedgerType)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        reqType === t.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                          : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Target Artist
                </label>
                <select
                  value={reqArtistId}
                  onChange={(e) => setReqArtistId(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-white/[0.05] border border-white/15 text-xs text-white outline-none focus:border-cyan-400"
                >
                  {ARTISTS_DATA.map((a) => (
                    <option key={a.id} value={a.id} className="bg-[#0b0e1b] text-white">
                      {a.name} ({a.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={reqDate}
                    onChange={(e) => setReqDate(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-white/[0.05] border border-white/15 text-xs text-white font-mono outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Occasion / Purpose
                  </label>
                  <input
                    type="text"
                    value={reqOccasion}
                    onChange={(e) => setReqOccasion(e.target.value)}
                    placeholder="e.g. Creative Review"
                    className="w-full h-11 px-3.5 rounded-xl bg-white/[0.05] border border-white/15 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Detailed Prompt or Note
                </label>
                <textarea
                  rows={3}
                  value={reqNotes}
                  onChange={(e) => setReqNotes(e.target.value)}
                  placeholder="Provide instructions for the artist or management team..."
                  className="w-full p-3.5 rounded-xl bg-white/[0.05] border border-white/15 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-[11px] font-mono text-amber-300 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Notice: New submissions start in 'Unapproved / Request Sent' until approved by management.</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 text-xs font-bold shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  Submit with Escrow Lock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
