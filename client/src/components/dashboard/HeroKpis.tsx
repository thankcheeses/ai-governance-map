import { motion } from 'framer-motion';
import { ShieldCheck, ListChecks, AlertOctagon, Gauge } from 'lucide-react';
import { CONTROLS, FRAMEWORKS } from '@/data/governance';
import SectionHeader from './SectionHeader';

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
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

export default function HeroKpis({ overallScore, assessedCount }: HeroKpisProps) {
  const criticalCount = CONTROLS.filter((c) => c.priority === 'Critical').length;

  const isUnassessed = assessedCount === 0;

  const kpis = [
    { label: 'Frameworks', value: FRAMEWORKS.length.toString(), sub: 'Global standards tracked', icon: ShieldCheck, ring: 100 },
    { label: 'Controls', value: CONTROLS.length.toString(), sub: 'CCM v4.1.0 mapped', icon: ListChecks, ring: 100 },
    { label: 'Critical', value: criticalCount.toString(), sub: 'High-priority controls', icon: AlertOctagon, ring: Math.round((criticalCount / CONTROLS.length) * 100) },
    {
      label: 'Posture',
      value: isUnassessed ? '—' : `${overallScore}%`,
      sub: isUnassessed ? 'Not yet assessed' : `${assessedCount} / ${CONTROLS.length} assessed`,
      icon: Gauge,
      ring: isUnassessed ? 0 : overallScore,
    },
  ];

  return (
    <section id="overview" className="scroll-mt-24">
      <SectionHeader
        icon={<ShieldCheck size={18} />}
        title="Governance Posture Overview"
        subtitle="Multi-framework AI governance reference — local-only, no data leaves your browser"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            whileHover={{ y: -3 }}
            transition={{ delay: i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="stat-accent card-elevated p-5 flex items-center gap-4"
          >
            <div className="relative flex-shrink-0 w-16 h-16 flex items-center justify-center">
              <ProgressRing value={kpi.ring} />
              <kpi.icon size={18} className="absolute text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-muted-foreground mb-1">{kpi.label}</p>
              <p className="text-2xl font-bold text-foreground leading-none font-mono">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1 truncate">{kpi.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
