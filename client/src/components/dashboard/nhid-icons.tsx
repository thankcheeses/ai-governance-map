// NHID-Clinical icon system — stroke-based, rounded terminals, 1.75px, 24 viewBox.
// Lucide-compatible so they sit in one coherent family beside the lucide icons already
// used across the dashboard. currentColor throughout; transparent; brand-neutral (color
// is applied by the caller via text color). One precise concept per icon, legible at 16px.
//
// Set: Identity Disclosure · Pre-Data Exchange Gate · Deceptive Behavior · Human Escalation
//      Audit Trail · Impersonation Latency · Call Authorization Score (CAS) · Trust Stack.

interface IconProps {
  className?: string;
  size?: number;
}

import type { ReactNode } from 'react';

function Svg({ className, size = 20, children, label }: IconProps & { children: ReactNode; label: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role="img"
      aria-label={label}
    >
      {children}
    </svg>
  );
}

/** IDG-01 — proactive disclosure of AI identity: an ID card broadcasting a signal. */
export function IdentityDisclosureIcon(p: IconProps) {
  return (
    <Svg {...p} label="Identity disclosure">
      <rect x="3" y="6" width="12" height="12" rx="2.5" />
      <circle cx="7.5" cy="10.5" r="1.75" />
      <path d="M6 15c.4-1.4 2.6-1.4 3 0" />
      <path d="M11 10.5h1.5" opacity="0.7" />
      <path d="M18 8.5a5 5 0 0 1 0 7" />
      <path d="M20.5 6a8.5 8.5 0 0 1 0 12" opacity="0.6" />
    </Svg>
  );
}

/** PDX-01 — verify authorization before any data exchange: a checkpoint gate a packet passes. */
export function PreDataGateIcon(p: IconProps) {
  return (
    <Svg {...p} label="Pre-data exchange gate">
      <path d="M5 4v16" />
      <path d="M5 6h9l-2.5 2.5L14 11H5" />
      <rect x="16.5" y="13.5" width="5" height="5" rx="1" />
      <path d="M17.6 16l1 1 1.8-2" />
    </Svg>
  );
}

/** DBC-01 — no voice mimicry / deceptive behavior: an impersonation mask, prohibited. */
export function DeceptiveBehaviorIcon(p: IconProps) {
  return (
    <Svg {...p} label="Deceptive behavior">
      <path d="M4 7c3-1 5-1 8 0 3-1 5-1 8 0v2c0 4-3 6-5 6-1.4 0-2.2-.8-3-1.6-.8.8-1.6 1.6-3 1.6-2 0-5-2-5-6Z" />
      <circle cx="8.5" cy="10.5" r="0.75" fill="currentColor" />
      <circle cx="15.5" cy="10.5" r="0.75" fill="currentColor" />
      <path d="M3.5 3.5l17 17" opacity="0.85" />
    </Svg>
  );
}

/** EIT-01 — offer human handoff on request: escalate to a person. */
export function HumanEscalationIcon(p: IconProps) {
  return (
    <Svg {...p} label="Human escalation">
      <circle cx="9" cy="7" r="3" />
      <path d="M3.5 19c.6-3.4 3-5 5.5-5s4.9 1.6 5.5 5" />
      <path d="M19 15V7" />
      <path d="M16 10l3-3 3 3" />
    </Svg>
  );
}

/** ATR-01 — audit trail: a ledger of logged, attested events. */
export function AuditTrailIcon(p: IconProps) {
  return (
    <Svg {...p} label="Audit trail">
      <path d="M6 3h9l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M14 3v4h4" opacity="0.7" />
      <path d="M8 12h5" />
      <path d="M8 15.5h7" />
      <path d="M7.5 8.5l1 1 1.8-2" />
    </Svg>
  );
}

/** Impersonation latency: a clock whose verification delay is unbounded (∞). */
export function ImpersonationLatencyIcon(p: IconProps) {
  return (
    <Svg {...p} label="Impersonation latency">
      <circle cx="9.5" cy="9.5" r="6.5" />
      <path d="M9.5 6v3.5l2.3 1.4" />
      <path d="M15.5 19c-1 0-1.6-1-1.6-1.6 0-1 .8-1.4 1.6-1.4s1.6.4 1.6 1.4c0 .6-.6 1.6-1.6 1.6Zm0 0c1 0 1.6 1 1.6 1.6 0 1-.8 1.4-1.6 1.4s-1.6-.4-1.6-1.4c0-.6.6-1.6 1.6-1.6Z" opacity="0.9" />
    </Svg>
  );
}

/** Call Authorization Score (CAS): a verification gauge. */
export function CasGaugeIcon(p: IconProps) {
  return (
    <Svg {...p} label="Call Authorization Score">
      <path d="M4 17a8 8 0 0 1 16 0" />
      <path d="M4 17h1.5M18.5 17H20M6.5 10.5l1 1M17.5 10.5l-1 1M12 6.5V8" opacity="0.6" />
      <path d="M12 17l4-3.5" />
      <circle cx="12" cy="17" r="1.5" fill="currentColor" />
    </Svg>
  );
}

/** Trust Stack layers: the layered trust architecture. */
export function TrustStackIcon(p: IconProps) {
  return (
    <Svg {...p} label="Trust stack layers">
      <path d="M12 3l8 4-8 4-8-4 8-4Z" />
      <path d="M4 12l8 4 8-4" opacity="0.8" />
      <path d="M4 17l8 4 8-4" opacity="0.6" />
    </Svg>
  );
}
