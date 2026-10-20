import React, { useState } from 'react';
import { X, Copy, Check, Database, GitBranch, Shield, Server, FileText, CheckCircle2, XCircle, Clock, TrendingUp } from 'lucide-react';
import { RequestStatusBadge } from './RequestStatusBadge';

interface ArchitectureSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureSchemaModal: React.FC<ArchitectureSchemaModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'statemachine' | 'flow' | 'sql' | 'nosql' | 'security'>('statemachine');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const stateMachineCode = `/**
 * ============================================================================
 * INFINITI FIRM: MEETUP & SHOUTOUT REQUEST STATE MACHINE & API ROUTER
 * Express / Node.js + PostgreSQL Atomic Status Update Endpoint
 * ============================================================================
 */

import { Router, Request, Response } from 'express';
import { db } from '../db';
import { meetupBookings, ledgerAuditTrail, users } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { createHmac } from 'crypto';

export const meetupStatusRouter = Router();

// 1. STATE MACHINE TRANSITIONS CONTRACT
export const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
  // Initial state immediately upon submission
  pending: ['approved', 'rejected', 'expired'],
  // Approved state when accepted by celebrity or management
  approved: ['completed', 'cancelled_dispute'],
  // Terminal states
  rejected: [],
  expired: [],
  completed: []
};

/**
 * PUT /api/v1/meetups/:id/status
 * Updates meetup or shoutout request status with atomic escrow handling and audit trail
 */
meetupStatusRouter.put('/api/v1/meetups/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newStatus, rejectionReason, approvalNotes } = req.body;
    const authUser = (req as any).user; // Authenticated actor from JWT / Passkey

    // Step A: Fetch current booking record with lock
    const booking = await db.query.meetupBookings.findFirst({
      where: eq(meetupBookings.id, id)
    });

    if (!booking) {
      return res.status(404).json({ error: 'Meetup booking request not found.' });
    }

    // Step B: Authorization Guard: Only assigned artist or their verified manager can approve/reject
    const isArtist = authUser.id === booking.artistId;
    const isManager = authUser.managedArtistIds?.includes(booking.artistId);
    const isSystemCron = authUser.isSystemWorker;

    if (!isArtist && !isManager && !isSystemCron) {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges to review request.' });
    }

    // Step C: State Machine Guard: Validate transition
    const allowedTargets = VALID_STATUS_TRANSITIONS[booking.status] || [];
    if (!allowedTargets.includes(newStatus)) {
      return res.status(400).json({
        error: \`Illegal state transition from '\${booking.status}' to '\${newStatus}'.\`,
        allowedTransitions: allowedTargets
      });
    }

    // Step D: Atomic Database Transaction (Status + Escrow + Cryptographic Audit Log)
    const result = await db.transaction(async (tx) => {
      const now = new Date();
      let newEscrowStatus = booking.escrowStatus;

      // Handle Escrow settlement vs refund
      if (newStatus === 'approved') {
        newEscrowStatus = 'settled_locked'; // Funds committed, released upon session completion
      } else if (newStatus === 'rejected' || newStatus === 'expired') {
        newEscrowStatus = 'refunded';
        // Execute atomic wallet credit back to patron's wallet
        await tx
          .update(users)
          .set({ walletBalanceCents: sql\`wallet_balance_cents + \${booking.amountCents}\` })
          .where(eq(users.id, booking.userId));
      }

      // Generate Cryptographic Audit Hash for status transition (Keccak256 / SHA-256)
      const auditPayload = \`\${booking.id}:\${booking.status}->\${newStatus}:\${now.toISOString()}:\${authUser.id}\`;
      const transitionHash = '0x' + createHmac('sha256', process.env.LEDGER_SALT || 'infiniti')
        .update(auditPayload)
        .digest('hex');

      // Update meetup booking record with reviewer signature
      const [updated] = await tx
        .update(meetupBookings)
        .set({
          status: newStatus,
          reviewedAt: now,
          reviewedById: authUser.id,
          reviewerRole: isArtist ? 'celebrity' : isManager ? 'management' : 'system',
          rejectionReason: newStatus === 'rejected' ? (rejectionReason || 'Declined by talent management.') : null,
          approvalNotes: newStatus === 'approved' ? (approvalNotes || 'Sanctuary acoustic clearance approved.') : null,
          escrowStatus: newEscrowStatus,
          updatedAt: now
        })
        .where(eq(meetupBookings.id, id))
        .returning();

      // Append immutable audit log event
      await tx.insert(ledgerAuditTrail).values({
        bookingId: id,
        fromStatus: booking.status,
        toStatus: newStatus,
        actorId: authUser.id,
        actorRole: isArtist ? 'celebrity' : isManager ? 'management' : 'system',
        transitionHash,
        reason: rejectionReason || approvalNotes || 'Status updated via management dashboard',
        timestamp: now
      });

      return updated;
    });

    // Step E: Dispatch real-time WebSocket / Push Notification to fan
    // wsHub.broadcastToUser(booking.userId, {
    //   event: 'MEETUP_STATUS_UPDATED',
    //   bookingId: booking.id,
    //   status: newStatus
    // });

    return res.status(200).json({
      success: true,
      message: \`Meetup request successfully transitioned to '\${newStatus}'.\`,
      booking: result
    });
  } catch (err: any) {
    console.error('Failed to update meetup status:', err);
    return res.status(500).json({ error: 'Internal server error processing status transition.' });
  }
});
`;

  const sqlCode = `-- ============================================================================
-- INFINITI FIRM: PRODUCTION RELATIONAL DATABASE SCHEMA (POSTGRESQL 16+)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- 1. ENUMS FOR STRICT TYPING
CREATE TYPE patron_tier AS ENUM ('obsidian_tier_1', 'astral_tier_2', 'celestial_tier_3');
CREATE TYPE ledger_activity_type AS ENUM ('booking', 'interaction', 'shoutout', 'stem_unlock');

-- STATUS STATE MACHINE ENUM
CREATE TYPE meetup_request_status AS ENUM (
    'pending',   -- Initial State: Yellow badge 'Unapproved / Request Sent'
    'approved',  -- Approved State: Green badge 'Request Approved / Accepted'
    'rejected',  -- Rejected State: Red badge 'Rejected / Declined'
    'expired',   -- Automatic timeout (48h window)
    'completed'  -- Concluded session
);

CREATE TYPE reviewer_role_type AS ENUM ('celebrity', 'management', 'system');
CREATE TYPE escrow_status_type AS ENUM ('held', 'settled_locked', 'refunded');

-- 2. USERS TABLE (Core Identity)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email CITEXT NOT NULL UNIQUE,
    full_name VARCHAR(120) NOT NULL,
    phone_e164 VARCHAR(24) NOT NULL UNIQUE,
    phone_verified BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    fan_pass_address VARCHAR(44) NOT NULL UNIQUE,
    current_tier patron_tier NOT NULL DEFAULT 'obsidian_tier_1',
    wallet_balance_cents BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. MEETUP BOOKINGS & STATUS FIELDS TABLE
CREATE TABLE meetup_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE RESTRICT,
    
    -- Status State Machine Columns
    status meetup_request_status NOT NULL DEFAULT 'pending',
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    response_deadline_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '48 hours'),
    
    reviewed_at TIMESTAMPTZ NULL,
    reviewed_by_id UUID NULL REFERENCES users(id),
    reviewer_role reviewer_role_type NULL,
    rejection_reason TEXT NULL,
    approval_notes TEXT NULL,
    
    -- Escrow & Financial State
    amount_cents INT NOT NULL,
    escrow_status escrow_status_type NOT NULL DEFAULT 'held',
    
    -- Location details (Cascading hierarchy or Visit private address)
    is_custom_visit BOOLEAN NOT NULL DEFAULT FALSE,
    country VARCHAR(64) NULL,
    state_province VARCHAR(64) NULL,
    city VARCHAR(64) NULL,
    spot_name VARCHAR(128) NULL,
    custom_private_address TEXT NULL,
    preferred_time_window VARCHAR(64) NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. STATE TRANSITION AUDIT TRAIL
CREATE TABLE meetup_status_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES meetup_bookings(id) ON DELETE CASCADE,
    from_status meetup_request_status NOT NULL,
    to_status meetup_request_status NOT NULL,
    actor_id UUID NOT NULL REFERENCES users(id),
    actor_role reviewer_role_type NOT NULL,
    transition_hash VARCHAR(66) NOT NULL UNIQUE,
    reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

  const nosqlCode = `{
  "_id": "rec_bk_9102",
  "userId": "usr_infiniti_8f901",
  "artistId": "aurora-vane",
  "type": "booking",
  "status": "pending", // 'pending' | 'approved' | 'rejected' | 'completed'
  "statusMetadata": {
    "submittedAt": "2026-10-20T08:15:00.000Z",
    "responseDeadlineAt": "2026-10-22T08:15:00.000Z",
    "reviewedAt": null,
    "reviewedBy": null,
    "reviewerRole": null,
    "escrowStatus": "held", // 'held' | 'settled' | 'refunded'
    "rejectionReason": null,
    "approvalNotes": null,
    "transitionLogs": [
      {
        "timestamp": "2026-10-20T08:15:00.000Z",
        "fromStatus": "pending",
        "toStatus": "pending",
        "actorId": "usr_infiniti_8f901",
        "actorRole": "fan",
        "reason": "Submitted meetup request with atomic escrow deposit"
      }
    ]
  },
  "tier": "dinner",
  "amountUsd": 650,
  "scheduledFor": "2026-11-04T19:00:00.000Z"
}
`;

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-[#04060d]/85 backdrop-blur-2xl" onClick={onClose} />
      <div className="relative z-10 w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl border border-white/15 bg-gradient-to-b from-[#0c1020] via-[#080b18] to-[#04060c] backdrop-blur-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] p-6 sm:p-8 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-300">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-display">
                  INFINITI firm: State Machine & Database Architecture
                </h2>
                <p className="text-xs text-slate-400">
                  Full-stack architectural blueprint for meetup status lifecycles, API endpoints, and immutable ledgers.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5 p-1 rounded-xl bg-white/[0.04] border border-white/10 w-fit overflow-x-auto max-w-full">
            {[
              { id: 'statemachine', label: 'Status State Machine & API', icon: TrendingUp },
              { id: 'flow', label: 'User Flow Steps', icon: GitBranch },
              { id: 'sql', label: 'PostgreSQL Relational Schema', icon: Database },
              { id: 'nosql', label: 'NoSQL Document Model', icon: Server },
              { id: 'security', label: 'Security & Immutability', icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-white/15 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 0: State Machine & API Endpoints */}
          {activeTab === 'statemachine' && (
            <div className="mt-6 space-y-6">
              {/* Visual 3-State Badge Overview */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                <h4 className="text-sm font-bold text-white font-display">
                  Frontend Conditional Badge States & Visual Indicators
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 1. Pending */}
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/30 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-amber-300 font-bold block">
                      1. INITIAL STATE (SUBMITTED)
                    </span>
                    <RequestStatusBadge status="pending" size="md" />
                    <p className="text-xs text-slate-300 mt-2">
                      Immediately triggered upon user submission. Escrow funds held; 48-hour response countdown starts.
                    </p>
                  </div>

                  {/* 2. Approved */}
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-400/30 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-emerald-300 font-bold block">
                      2. APPROVED STATE (ACCEPTED)
                    </span>
                    <RequestStatusBadge status="approved" size="md" />
                    <p className="text-xs text-slate-300 mt-2">
                      Explicit acceptance by celebrity or talent management. Locks greenroom passes and venue clearance.
                    </p>
                  </div>

                  {/* 3. Rejected */}
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-400/30 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-rose-300 font-bold block">
                      3. REJECTED STATE (DECLINED)
                    </span>
                    <RequestStatusBadge status="rejected" size="md" />
                    <p className="text-xs text-slate-300 mt-2">
                      Triggered if celebrity declines or fails to respond before window expiry. Triggers instant 100% wallet refund.
                    </p>
                  </div>
                </div>
              </div>

              {/* API Endpoint Logic */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 border border-blue-400/40 text-blue-300 font-mono text-xs font-bold">
                      PUT
                    </span>
                    <span className="text-xs font-mono text-white">/api/v1/meetups/:id/status</span>
                  </div>
                  <button
                    onClick={() => copyCode(stateMachineCode)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Endpoint Code'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-black/70 border border-white/10 text-cyan-200 font-mono text-xs overflow-x-auto max-h-[380px] leading-relaxed">
                  {stateMachineCode}
                </pre>
              </div>
            </div>
          )}

          {/* Tab 1: Flow Steps */}
          {activeTab === 'flow' && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                    <span className="w-5 h-5 rounded-full bg-cyan-400/20 flex items-center justify-center font-bold">1</span>
                    <span>ONBOARDING & IDENTITY INTAKE</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Full Name, Email, Phone & Socials</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    First-time patrons submit legal name, email, E.164 phone, and verified social handles (Instagram, X, TikTok, Telegram/Discord).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                    <span className="w-5 h-5 rounded-full bg-cyan-400/20 flex items-center justify-center font-bold">2</span>
                    <span>CRYPTOGRAPHIC FAN KEY GENERATION</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Non-Custodial PassKey & Tier Minting</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    A deterministic WebAuthn credential pairs device biometrics with their Fan Pass ID (`0x...`).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                    <span className="w-5 h-5 rounded-full bg-cyan-400/20 flex items-center justify-center font-bold">3</span>
                    <span>PENDING SUBMISSION & ESCROW LOCK</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Initial State: Yellow 'Unapproved / Request Sent'</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Booking initiates with an atomic escrow lock. The request is queued for celebrity management with a 48h deadline.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                    <span className="w-5 h-5 rounded-full bg-cyan-400/20 flex items-center justify-center font-bold">4</span>
                    <span>DECISION ROUTING: APPROVE OR REJECT</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Green 'Approved' or Red 'Declined'</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Management signs off or declines. On rejection, escrow refunds immediately; on approval, greenroom pass keys decrypt.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: SQL Schema */}
          {activeTab === 'sql' && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300">PostgreSQL DDL & Status Columns</span>
                <button
                  onClick={() => copyCode(sqlCode)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy DDL'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-black/70 border border-white/10 text-cyan-200 font-mono text-xs overflow-x-auto max-h-[460px] leading-relaxed">
                {sqlCode}
              </pre>
            </div>
          )}

          {/* Tab 3: NoSQL Schema */}
          {activeTab === 'nosql' && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300">Firestore / MongoDB Status Document Schema</span>
                <button
                  onClick={() => copyCode(nosqlCode)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-black/70 border border-white/10 text-cyan-200 font-mono text-xs overflow-x-auto max-h-[460px] leading-relaxed">
                {nosqlCode}
              </pre>
            </div>
          )}

          {/* Tab 4: Security */}
          {activeTab === 'security' && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <span>State Transition RBAC</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Only verified artist wallets and accredited management agency IDs can execute approval or rejection endpoints.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <span>Atomic Escrow Guarantee</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Funds remain in trustless escrow until the request reaches a verified terminal state. Rejections execute instant programmatic refunds.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <span>Immutable Audit Hashes</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Each state transition is signed with an HMAC-SHA256 transition hash and logged into `meetup_status_audit_log`.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>INFINITI firm Architecture Spec v5.0</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
