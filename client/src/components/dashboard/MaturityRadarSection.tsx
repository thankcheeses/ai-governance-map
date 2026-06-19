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
        eyebrow="Module 05 · Maturity &amp; Trend"
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
        <div className="card-elevated p-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4 flex items-center gap-1.5">
            <Radio size={11} />Posture Radar
          </p>
          {radarData.length === 0 ? (
            <div className="h-[360px] flex items-center justify-center text-sm text-muted-foreground">
              Score at least one control in the Controls section to populate the radar.
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-lg" style={{ height: 360 }}>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'repeating-radial-gradient(circle at 50% 50%, transparent, transparent 37px, rgba(20,184,166,0.07) 38px, rgba(20,184,166,0.07) 39px)',
                }}
              />
              <motion.div
                className="absolute inset-0 pointer-events-none origin-center"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(103,232,249,0.16), transparent 18%)',
                }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 9, ease: 'linear' }}
              />
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
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">Domain Scores</p>
          {radarData.length === 0 && <p className="text-xs text-muted-foreground">No assessed controls yet.</p>}
          {radarData.map((d) => (
            <div key={d.domain} className="flex items-center justify-between px-3 py-2 bg-card border border-border rounded-lg">
              <span className="font-mono text-xs font-medium text-muted-foreground">{d.domain}</span>
              <span className="font-mono text-xs text-primary font-semibold">{d.maturity > 0 ? `${d.maturity} / 5` : '—'}</span>
            </div>
          ))}
          <div className="mt-3 px-3 py-2.5 bg-primary/5 border border-dashed border-primary/30 rounded-lg">
            <p className="text-xs text-muted-foreground">Assessed</p>
            <p className="font-mono text-sm font-semibold text-foreground">{assessedCount} / {CONTROLS.length} controls</p>
          </div>
        </div>
      </div>

      <div className="card-elevated p-6">
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
      </div>
    </section>
  );
}
