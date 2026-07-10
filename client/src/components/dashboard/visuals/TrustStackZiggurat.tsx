import { motion } from 'framer-motion';
import { NHID_LAYERS } from '@/data/governance';

interface TrustStackZigguratProps {
  activeLayer: number;
  onSelect: (idx: number) => void;
}

// Ziggurat geometry: six stacked slabs, widest at the base (Layer 0), narrowing
// upward to Layer 5. Each slab is a faux-3D extrusion: top face + front face.
const SLABS = NHID_LAYERS.map((_, i) => {
  const width = 300 - i * 38;
  const x = (340 - width) / 2;
  const y = 268 - i * 44;
  return { x, y, width, h: 30, depth: 9 };
});

/**
 * Hand-crafted premium SVG ziggurat of the NHID trust stack — navy stone, teal
 * energy veins, silver/gold accents. Zero external requests. Stays SVG (it is
 * interactive); static raster renders belong in the non-interactive panels —
 * see client/public/3d-renders/PROMPTS.md.
 */
export default function TrustStackZiggurat({ activeLayer, onSelect }: TrustStackZigguratProps) {
  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 340 320"
        role="group"
        aria-label="Illustrative conceptual 3D visualization of the NHID-Clinical trust stack — six stacked layers from NPI Registry at the base to OpenTelemetry observability at the top; conceptual render for clarity"
        className="w-full h-auto select-none"
      >
        <defs>
          <linearGradient id="zig-stone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#243b55" />
            <stop offset="1" stopColor="#16233a" />
          </linearGradient>
          <linearGradient id="zig-stone-core" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#134e4a" />
            <stop offset="1" stopColor="#0f3733" />
          </linearGradient>
          <linearGradient id="zig-top" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#33507a" />
            <stop offset="1" stopColor="#22385c" />
          </linearGradient>
          <linearGradient id="zig-top-core" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#14b8a6" />
            <stop offset="1" stopColor="#0d9488" />
          </linearGradient>
          <radialGradient id="zig-glow" cx="0.5" cy="0.35" r="0.75">
            <stop offset="0" stopColor="#14b8a6" stopOpacity="0.35" />
            <stop offset="1" stopColor="#14b8a6" stopOpacity="0" />
          </radialGradient>
          {/* glass sheen band for the top of each slab's front face (metallic highlight) */}
          <linearGradient id="zig-sheen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="zig-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* ambient glow behind the monument */}
        <ellipse cx="170" cy="180" rx="160" ry="150" fill="url(#zig-glow)" />
        {/* ground shadow */}
        <ellipse cx="170" cy="304" rx="150" ry="12" fill="#000000" opacity="0.35" />

        {SLABS.map((s, i) => {
          const layer = NHID_LAYERS[i];
          const isActive = activeLayer === i;
          const isCore = !!layer.isCore;
          return (
            <motion.g
              key={layer.layer}
              role="button"
              aria-label={`Layer ${layer.layer}: ${layer.title}`}
              aria-pressed={isActive}
              tabIndex={0}
              onClick={() => onSelect(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSelect(i);
              }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ delay: i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.015 }}
              style={{ cursor: 'pointer', transformOrigin: '170px 200px' }}
              filter="url(#zig-soft)"
            >
              {/* top face (parallelogram suggesting depth) */}
              <path
                d={`M ${s.x + s.depth} ${s.y - s.depth} H ${s.x + s.width + s.depth} L ${s.x + s.width} ${s.y} H ${s.x} Z`}
                fill={isCore ? 'url(#zig-top-core)' : 'url(#zig-top)'}
                stroke={isActive ? '#5eead4' : '#94a3b8'}
                strokeOpacity={isActive ? 0.9 : 0.35}
                strokeWidth="1"
              />
              {/* front face */}
              <rect
                x={s.x}
                y={s.y}
                width={s.width}
                height={s.h}
                rx="3"
                fill={isCore ? 'url(#zig-stone-core)' : 'url(#zig-stone)'}
                stroke={isActive ? '#5eead4' : isCore ? '#14b8a6' : '#334155'}
                strokeWidth={isActive ? 1.6 : 1}
              />
              {/* glass sheen highlight across the top of the front face */}
              <rect x={s.x + 1.5} y={s.y + 1.5} width={s.width - 3} height={s.h * 0.42} rx="2.5" fill="url(#zig-sheen)" />
              {/* teal energy vein */}
              <line
                x1={s.x + 8}
                y1={s.y + s.h - 6}
                x2={s.x + s.width - 8}
                y2={s.y + s.h - 6}
                stroke="#2dd4bf"
                strokeWidth={isActive ? 2 : 1}
                strokeOpacity={isActive ? 0.9 : 0.35}
                strokeDasharray={isActive ? 'none' : '6 5'}
              />
              {/* gold inlay tick for the core layer */}
              {isCore && <circle cx={s.x + s.width - 14} cy={s.y + 10} r="3" fill="#d4af7a" />}
              {/* layer label */}
              <text
                x={s.x + 10}
                y={s.y + 13}
                fontSize="8.5"
                fontFamily="ui-monospace, monospace"
                fill={isActive ? '#ccfbf1' : '#94a3b8'}
                fontWeight="700"
              >
                L{layer.layer}
              </text>
              <text
                x={s.x + 32}
                y={s.y + 13}
                fontSize="9.5"
                fontFamily="Inter, ui-sans-serif, sans-serif"
                fill={isActive ? '#f0fdfa' : '#cbd5e1'}
                fontWeight={isActive || isCore ? 700 : 500}
              >
                {layer.title.length > 34 ? layer.title.slice(0, 33) + '…' : layer.title}
              </text>
              {isCore && (
                <text x={s.x + 10} y={s.y + 25} fontSize="7.5" fontFamily="Inter, ui-sans-serif, sans-serif" fill="#5eead4">
                  ★ behavioral baseline (core)
                </text>
              )}
            </motion.g>
          );
        })}

        {/* observability beam rising from the top slab */}
        <motion.rect
          x="166"
          y="18"
          width="8"
          height="30"
          rx="4"
          fill="#2dd4bf"
          initial={{ opacity: 0.25 }}
          animate={{ opacity: [0.25, 0.7, 0.25] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
      <p className="text-[0.62rem] text-slate-400 mt-1 leading-snug">
        Illustrative conceptual visualization of the trust stack — click a layer for its scope and mapped controls.
      </p>
    </div>
  );
}
