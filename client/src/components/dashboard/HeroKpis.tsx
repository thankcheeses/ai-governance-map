import { motion } from 'framer-motion';
import { ShieldCheck, ListChecks, AlertOctagon, Gauge } from 'lucide-react';
import { CONTROLS, FRAMEWORKS } from '@/data/governance';

interface HeroKpisProps {
  overallScore: number;
  assessedCount: number;
}

function ProgressRing({ value, size = 64, stroke = 6 }: { value: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--secondary)" strokeWidth={stroke} />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </svg>
  );
}

export default function HeroKpis({ overallScore, assessedCount }: HeroKpisProps) {
  const criticalCount = CONTROLS.filter((c) => c.priority === 'Critical').length;

  const kpis = [
    { label: 'Frameworks', value: FRAMEWORKS.length.toString(), sub: 'Global standards tracked', icon: ShieldCheck, ring: 100 },
    { label: 'Controls', value: CONTROLS.length.toString(), sub: 'CCM v4.1.0 mapped', icon: ListChecks, ring: 100 },
    { label: 'Critical', value: criticalCount.toString(), sub: 'High-priority controls', icon: AlertOctagon, ring: Math.round((criticalCount / CONTROLS.length) * 100) },
    { label: 'Posture', value: `${overallScore}%`, sub: `${assessedCount} / ${CONTROLS.length} assessed`, icon: Gauge, ring: overallScore },
  ];

  return (
    <section id="overview" className="scroll-mt-24">
      <div className="mb-4">
        <h2 className="text-heading-lg text-foreground">Governance Posture Overview</h2>
        <p className="text-body-sm text-muted-foreground">Multi-framework AI governance reference — local-only, no data leaves your browser</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.35, ease: 'easeOut' }}
            className="card-elevated p-5 flex items-center gap-4"
          >
            <div className="relative flex-shrink-0 w-16 h-16 flex items-center justify-center">
              <ProgressRing value={kpi.ring} />
              <kpi.icon size={18} className="absolute text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">{kpi.label}</p>
              <p className="text-2xl font-bold text-foreground leading-none font-mono">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1 truncate">{kpi.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
