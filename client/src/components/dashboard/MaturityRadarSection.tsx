import { useMemo } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { motion } from 'framer-motion';
import { Radio, History, Camera } from 'lucide-react';
import { RadarNodeIcon } from './icons';
import { CCM_DOMAINS, CONTROLS } from '@/data/governance';
import { useGovernanceState } from '@/hooks/useGovernanceState';
import SectionHeader from './SectionHeader';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function MaturityRadarSection() {
  const { controlState, overallScore, assessedCount, auditTrail, recordSnapshot } = useGovernanceState();

  const radarData = useMemo(() => {
    const buckets: Record<string, number[]> = {};
    CCM_DOMAINS.forEach((d) => { buckets[d] = []; });
    CONTROLS.forEach((c) => {
      if (buckets[c.ccmDomain] !== undefined) buckets[c.ccmDomain].push(controlState[c.id]?.maturity || 0);
    });
    return CCM_DOMAINS.map((domain) => {
      const vals = buckets[domain];
      const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      return { domain, maturity: Math.round(avg * 10) / 10, hasControls: vals.length > 0 };
    }).filter((d) => d.hasControls);
  }, [controlState]);

  const trendData = useMemo(
    () => auditTrail.map((snap, i) => ({
      label: `#${i + 1}`,
      date: new Date(snap.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      score: snap.score,
    })),
    [auditTrail],
  );

  return (
    <section id="maturity" className="scroll-mt-24">
      <SectionHeader
        icon={<RadarNodeIcon className="w-5 h-5" />}
        title="Maturity &amp; Trend"
        subtitle="Average maturity per CCM v4.1.0 domain — score controls to populate"
        action={
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={recordSnapshot}
            className="flex items-center gap-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg px-3 py-2 hover:opacity-90 transition-opacity"
          >
            <Camera size={13} />Record Snapshot ({overallScore}%)
          </motion.button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 mb-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, ease: EASE }}
          className="card-elevated p-6"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4 flex items-center gap-1.5">
            <Radio size={11} />Posture Radar
          </p>
          {radarData.length === 0 ? (
            <div className="h-[360px] flex items-center justify-center text-sm text-muted-foreground">
              Score at least one control in the Controls section to populate the radar.
            </div>
          ) : (
            <div style={{ height: 360 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <PolarAngleAxis dataKey="domain" tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono', fill: 'var(--muted-foreground)' }} />
                  <Radar name="Maturity" dataKey="maturity" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.22} strokeWidth={2} />
                  <Tooltip
                    formatter={(val: number) => [`${val} / 5`, 'Avg Maturity']}
                    contentStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 11, background: 'var(--card)', border: '1px solid var(--border)' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex flex-col gap-1.5"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">Domain Scores</p>
          {radarData.length === 0 && <p className="text-xs text-muted-foreground">No assessed controls yet.</p>}
          {radarData.map((d, i) => (
            <motion.div
              key={d.domain}
              initial={{ opacity: 0, x: 8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ delay: Math.min(i, 8) * 0.05, duration: 0.3, ease: EASE }}
              className="flex items-center justify-between px-3 py-2 bg-card border border-border rounded-lg"
            >
              <span className="font-mono text-xs font-medium text-muted-foreground">{d.domain}</span>
              <span className="font-mono text-xs text-primary font-semibold">{d.maturity > 0 ? `${d.maturity} / 5` : '—'}</span>
            </motion.div>
          ))}
          <div className="mt-3 px-3 py-2.5 bg-primary/5 border border-dashed border-primary/30 rounded-lg">
            <p className="text-xs text-muted-foreground">Assessed</p>
            <p className="font-mono text-sm font-semibold text-foreground">{assessedCount} / {CONTROLS.length} controls</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, ease: EASE }}
        className="card-elevated p-6"
      >
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4 flex items-center gap-1.5">
          <History size={11} />Posture Trend — Local Audit Trail
        </p>
        {trendData.length < 2 ? (
          <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground text-center px-6">
            Record at least two snapshots (via the button above) to see your posture trend over time. Snapshots are stored locally in your browser.
          </div>
        ) : (
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono', fill: 'var(--muted-foreground)' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono', fill: 'var(--muted-foreground)' }} />
                <Tooltip
                  formatter={(val: number) => [`${val}%`, 'Posture Score']}
                  contentStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 11, background: 'var(--card)', border: '1px solid var(--border)' }}
                />
                <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>
    </section>
  );
}
