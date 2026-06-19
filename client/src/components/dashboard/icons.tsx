// Hand-crafted inline SVG marks for concepts that don't map to a generic
// icon-library glyph (shield+waveform fusion, layered trust stack,
// provenance chain links, radar control nodes, prohibition glyph).

export function ShieldWaveformIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path
        d="M24 4 L42 11 V23 C42 34 34.5 41.5 24 44 C13.5 41.5 6 34 6 23 V11 Z"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M10 25 H17 L20 17 L25 32 L28 22 L31 27 H38"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.92"
      />
    </svg>
  );
}

export function TrustStackGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={6 + i * 1.5}
          y={8 + i * 8}
          width={36 - i * 3}
          height="6"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
          fill={i === 1 ? 'currentColor' : 'none'}
          fillOpacity={i === 1 ? 0.18 : 1}
        />
      ))}
    </svg>
  );
}

export function ProvenanceChainIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <rect x="6" y="16" width="16" height="16" rx="8" stroke="currentColor" strokeWidth="2.25" />
      <rect x="26" y="16" width="16" height="16" rx="8" stroke="currentColor" strokeWidth="2.25" />
      <path d="M20 24 H28" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
    </svg>
  );
}

export function RadarNodeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1.75" opacity="0.4" />
      <circle cx="24" cy="24" r="11" stroke="currentColor" strokeWidth="1.75" opacity="0.65" />
      <circle cx="24" cy="24" r="4" stroke="currentColor" strokeWidth="1.75" />
      {[[24, 6], [40, 30], [10, 32]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="currentColor" />
      ))}
      <path d="M24 24 L24 6 M24 24 L40 30 M24 24 L10 32" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}

export function ProhibitionIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M6 6 L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
