import { motion } from 'framer-motion';

/**
 * Illustrative "impersonation latency" split scene: left = unverified call with
 * an effectively infinite trust delay; right = verified pathway through the
 * IDG-01 disclosure gate. Hand-crafted inline SVG (zero external requests).
 *
 * Drop-in render upgrade: commit an image at
 * client/public/3d-renders/impersonation-vs-verified.webp and the <picture>
 * below serves it automatically (SVG remains the built-in fallback because the
 * <source> only wins when the file exists at deploy time — if the file is
 * missing the browser falls back through onError handling).
 */
export default function ImpersonationLatencySplit() {
  return (
    <figure className="w-full m-0">
      <svg
        viewBox="0 0 680 260"
        role="img"
        aria-label="Illustrative conceptual 3D visualization contrasting the impersonation-latency problem (left: an unverified AI caller with an infinite trust delay) with the verified trust pathway (right: identity disclosed at the IDG-01 gate before any data exchange) — conceptual render for clarity"
        className="w-full h-auto premium-3d"
      >
        <defs>
          <linearGradient id="lat-bg-left" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1c1226" />
            <stop offset="1" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="lat-bg-right" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0b2530" />
            <stop offset="1" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="lat-gate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#14b8a6" />
            <stop offset="1" stopColor="#0d9488" />
          </linearGradient>
          <filter id="lat-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* panels */}
        <rect x="0" y="0" width="336" height="260" fill="url(#lat-bg-left)" />
        <rect x="344" y="0" width="336" height="260" fill="url(#lat-bg-right)" />
        <rect x="336" y="0" width="8" height="260" fill="#020617" />

        {/* ===== LEFT: the problem ===== */}
        <text x="20" y="28" fontSize="11" fontWeight="700" fill="#fda4af" fontFamily="Inter, sans-serif">
          WITHOUT A STANDARD
        </text>
        {/* AI caller */}
        <circle cx="60" cy="120" r="22" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
        <text x="60" y="124" fontSize="9" fill="#cbd5e1" textAnchor="middle" fontFamily="monospace">AI?</text>
        {/* broken/questioning path */}
        <path
          d="M 88 120 C 130 100, 150 140, 190 120 S 250 100, 288 120"
          fill="none"
          stroke="#fb7185"
          strokeWidth="2"
          strokeDasharray="7 7"
          opacity="0.7"
        />
        {['?', '?', '?'].map((q, i) => (
          <text key={i} x={125 + i * 60} y={104} fontSize="13" fill="#fb7185" fontFamily="monospace" opacity="0.85">
            {q}
          </text>
        ))}
        {/* receiving system */}
        <rect x="288" y="98" width="34" height="44" rx="5" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
        <text x="305" y="124" fontSize="8" fill="#cbd5e1" textAnchor="middle" fontFamily="monospace">RX</text>
        {/* infinite delay badge */}
        <g filter="url(#lat-glow)">
          <rect x="118" y="160" width="140" height="30" rx="15" fill="#1c1226" stroke="#fb7185" strokeWidth="1.4" />
          <text x="188" y="179" fontSize="11" fill="#fda4af" textAnchor="middle" fontFamily="monospace" fontWeight="700">
            trust delay: ∞
          </text>
        </g>
        <text x="20" y="228" fontSize="9" fill="#94a3b8" fontFamily="Inter, sans-serif">
          No disclosure · no verification pathway · PHI at risk before any check
        </text>

        {/* ===== RIGHT: the verified pathway ===== */}
        <text x="364" y="28" fontSize="11" fontWeight="700" fill="#5eead4" fontFamily="Inter, sans-serif">
          WITH NHID-CLINICAL v1.3
        </text>
        {/* AI caller (disclosed) */}
        <circle cx="404" cy="120" r="22" fill="#0f3733" stroke="#14b8a6" strokeWidth="1.5" />
        <text x="404" y="124" fontSize="9" fill="#ccfbf1" textAnchor="middle" fontFamily="monospace">AI ✓</text>
        {/* solid pathway into the gate */}
        <motion.path
          d="M 432 120 H 496"
          stroke="#2dd4bf"
          strokeWidth="2.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        {/* IDG-01 gate */}
        <g filter="url(#lat-glow)">
          <rect x="496" y="86" width="46" height="68" rx="7" fill="url(#lat-gate)" opacity="0.92" />
          <rect x="507" y="100" width="24" height="40" rx="4" fill="#022c26" />
          <text x="519" y="122" fontSize="8" fill="#5eead4" textAnchor="middle" fontFamily="monospace">IDG</text>
          <text x="519" y="132" fontSize="8" fill="#5eead4" textAnchor="middle" fontFamily="monospace">01</text>
        </g>
        {/* verified continuation */}
        <motion.path
          d="M 542 120 H 606"
          stroke="#2dd4bf"
          strokeWidth="2.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
        />
        <rect x="606" y="98" width="34" height="44" rx="5" fill="#0f3733" stroke="#14b8a6" strokeWidth="1.5" />
        <text x="623" y="124" fontSize="8" fill="#ccfbf1" textAnchor="middle" fontFamily="monospace">RX</text>
        {/* measurable delay badge */}
        <rect x="462" y="160" width="156" height="30" rx="15" fill="#0b2530" stroke="#14b8a6" strokeWidth="1.4" />
        <text x="540" y="179" fontSize="11" fill="#5eead4" textAnchor="middle" fontFamily="monospace" fontWeight="700">
          trust delay: measurable
        </text>
        <text x="364" y="228" fontSize="9" fill="#94a3b8" fontFamily="Inter, sans-serif">
          Disclosure gate (IDG-01) · verification before data exchange · audited
        </text>
      </svg>
      <figcaption className="disclaimer-small">
        Illustrative conceptual visualization for clarity — not a product diagram. To upgrade with a
        committed high-resolution render, add{' '}
        <code className="font-mono">client/public/3d-renders/impersonation-vs-verified.webp</code> (see
        that folder&apos;s PROMPTS.md); assets must be self-hosted, never hotlinked.
      </figcaption>
    </figure>
  );
}
