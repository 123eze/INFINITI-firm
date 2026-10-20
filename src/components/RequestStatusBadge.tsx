import React from 'react';
import { LedgerStatus, StatusMetadata } from '../types';
import { Clock, CheckCircle2, XCircle, AlertTriangle, Sparkles, ShieldCheck } from 'lucide-react';

interface RequestStatusBadgeProps {
  status: LedgerStatus;
  metadata?: StatusMetadata;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  interactiveActions?: {
    onApprove?: () => void;
    onReject?: () => void;
    onResetPending?: () => void;
  };
}

export const RequestStatusBadge: React.FC<RequestStatusBadgeProps> = ({
  status,
  metadata,
  size = 'md',
  showDetails = false,
  interactiveActions,
}) => {
  // Normalize status for state machine
  const isPending = status === 'pending';
  const isApproved = status === 'approved' || status === 'confirmed';
  const isRejected = status === 'rejected';
  const isCompleted = status === 'completed' || status === 'delivered';

  // Badge size styles
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-3 py-1 gap-2',
    lg: 'text-sm px-4 py-1.5 gap-2.5',
  }[size];

  const dotSize = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }[size];

  return (
    <div className="inline-flex flex-col gap-1.5">
      {/* --------------------------------------------------------------------- */}
      {/* 1. INITIAL STATE: PENDING ('Unapproved / Request Sent')              */}
      {/* --------------------------------------------------------------------- */}
      {isPending && (
        <div className="inline-flex items-center">
          <span
            className={`inline-flex items-center font-mono font-semibold uppercase tracking-wider rounded-full border transition-all duration-300 ${sizeClasses}
              bg-amber-500/15 border-amber-400/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:border-amber-400/60`}
          >
            {/* Pulsing Yellow Indicator Dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className={`relative inline-flex rounded-full bg-amber-400 ${dotSize}`} />
            </span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Unapproved / Request Sent</span>
          </span>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 2. APPROVED STATE: ACCEPTED ('Request Approved / Accepted')          */}
      {/* --------------------------------------------------------------------- */}
      {isApproved && (
        <div className="inline-flex items-center">
          <span
            className={`inline-flex items-center font-mono font-semibold uppercase tracking-wider rounded-full border transition-all duration-300 ${sizeClasses}
              bg-emerald-500/15 border-emerald-400/40 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:border-emerald-400/60`}
          >
            {/* Steady Emerald Glow Indicator */}
            <span className={`relative inline-flex rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] ${dotSize}`} />
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Request Approved / Accepted</span>
          </span>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 3. REJECTED STATE: DECLINED ('Rejected / Declined')                   */}
      {/* --------------------------------------------------------------------- */}
      {isRejected && (
        <div className="inline-flex items-center">
          <span
            className={`inline-flex items-center font-mono font-semibold uppercase tracking-wider rounded-full border transition-all duration-300 ${sizeClasses}
              bg-rose-500/15 border-rose-400/40 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)] hover:border-rose-400/60`}
          >
            {/* Alert Indicator */}
            <span className={`relative inline-flex rounded-full bg-rose-400 ${dotSize}`} />
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Rejected / Declined</span>
          </span>
        </div>
      )}

      {/* 4. COMPLETED / DELIVERED FALLBACK */}
      {isCompleted && (
        <div className="inline-flex items-center">
          <span
            className={`inline-flex items-center font-mono font-semibold uppercase tracking-wider rounded-full border transition-all duration-300 ${sizeClasses}
              bg-cyan-500/15 border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Session Completed / Fulfilled</span>
          </span>
        </div>
      )}

      {/* Extended State Details (Timestamps, Reviewer Role, Escrow) */}
      {showDetails && (
        <div className="text-[11px] font-mono text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
          {isPending && (
            <span className="text-amber-400/90 flex items-center gap-1">
              <span>Awaiting celebrity/management confirmation</span>
              <span aria-hidden="true">·</span>
              <span>48h window</span>
            </span>
          )}
          {isApproved && (
            <span className="text-emerald-400/90 flex items-center gap-1">
              <span>Greenroom clearance locked</span>
              {metadata?.reviewedBy && <span>· By {metadata.reviewedBy}</span>}
            </span>
          )}
          {isRejected && (
            <span className="text-rose-400/90 flex items-center gap-1">
              <span>{metadata?.rejectionReason || 'Schedule conflict · 100% Escrow refunded to wallet'}</span>
            </span>
          )}
        </div>
      )}

      {/* Interactive Testing Controls (Celebrity / Management simulation) */}
      {interactiveActions && (
        <div className="flex items-center gap-1.5 pt-1 text-[10px] font-mono">
          <span className="text-slate-500">Simulate:</span>
          {interactiveActions.onApprove && !isApproved && (
            <button
              type="button"
              onClick={interactiveActions.onApprove}
              className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 cursor-pointer transition-colors"
            >
              Accept
            </button>
          )}
          {interactiveActions.onReject && !isRejected && (
            <button
              type="button"
              onClick={interactiveActions.onReject}
              className="px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 cursor-pointer transition-colors"
            >
              Decline
            </button>
          )}
          {interactiveActions.onResetPending && !isPending && (
            <button
              type="button"
              onClick={interactiveActions.onResetPending}
              className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 cursor-pointer transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      )}
    </div>
  );
};
