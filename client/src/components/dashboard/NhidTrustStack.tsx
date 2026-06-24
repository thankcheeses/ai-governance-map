import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronDown, ExternalLink, Star, Zap } from 'lucide-react';
import { ShieldWaveformIcon } from './icons';
import {
  NHID_CONFORMANCE_CONTROLS,
  NHID_EVENT_TRACE,
  NHID_EVENT_TRACE_FAIL,
  NHID_LAYERS,
  NHID_SIMULATOR_URL,
} from '@/data/governance';
import SectionHeader from './SectionHeader';

const LAYER_WIDTHS = [100, 92, 84, 76, 68, 60];
const EASE = [0.16, 1, 0.3, 1] as const;

export default function NhidTrustStack() {
  const [activeLayer, setActiveLayer] = useState(2);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [traceMode, setTraceMode] = useState<'pass' | 'fail'>('pass');
  const active = NHID_LAYERS[activeLayer];
  const trace = traceMode === 'pass' ? NHID_EVENT_TRACE : NHID_EVENT_TRACE_FAIL;

  const toggleRow = (code: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  };

  return (
    <section id="nhid" className="scroll-mt-24">
      <SectionHeader
        icon={<ShieldWaveformIcon className="w-5 h-5" />}
        title="NHID-Clinical v1.3 — Voice Agent Conformance"
        subtitle="5-layer trust stack for B2B healthcare voice channels"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-5">
        {/* Layered stack diagram */}
        <div className="card-elevated p-6 flex flex-col items-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-5 self-start">
            5-Layer Trust Stack
          </p>
          <div className="w-full flex flex-col items-center gap-2.5">
            {NHID_LAYERS.map((layer, idx) => (
              <motion.button
                key={layer.layer}
                initial={{ opacity: 0, scaleX: 0.6 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ delay: idx * 0.08, duration: 0.45, ease: EASE }}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setActiveLayer(idx)}
                style={{ width: `${LAYER_WIDTHS[idx]}%` }}
                className={`relative rounded-lg border px-4 py-3 text-left transition-colors duration-200 ${
                  layer.isCore
                    ? 'bg-primary/10 border-primary text-primary shadow-sm'
                    : activeLayer === idx
                      ? 'bg-secondary border-[#0F172A]/30 text-foreground'
                      : 'bg-card border-border text-muted-foreground hover:border-primary/30'
                }`}
              >
                {activeLayer === idx && (
                  <motion.span
                    layoutId="nhid-active-indicator"
                    className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-lg bg-[#0F172A]"
                    transition={{ duration: 0.3, ease: EASE }}
                  />
                )}
                <span className="flex items-center gap-1.5 text-[0.7rem] font-bold">
                  Layer {layer.layer}
                  {layer.isCore && <Star size={11} className="fill-primary text-primary" />}
                </span>
                <span className="block text-xs font-semibold mt-0.5 truncate">{layer.title}</span>
              </motion.button>
            ))}
          </div>
          <p className="text-[0.68rem] text-muted-foreground mt-5 leading-relaxed text-center">
            NHID-Clinical v1.3 is the behavioral baseline at Layer 2 ★. Cryptographic NPI delegation
            verification lives in NHID-Auth v2 at Layer 3 — a separate, optional authorization layer.
          </p>
        </div>

        {/* Active layer detail + conformance */}
        <div className="flex flex-col gap-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.layer}
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="card-elevated p-5 border-l-2 border-l-[#0F172A]"
            >
              <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-primary mb-1">Layer {active.layer}</p>
              <h3 className="text-heading-sm text-foreground mb-1.5">{active.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{active.scope}</p>
            </motion.div>
          </AnimatePresence>

          <div className="card-elevated p-5">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
              {`Layer 2 Conformance — ${NHID_CONFORMANCE_CONTROLS.length} / ${NHID_CONFORMANCE_CONTROLS.length} Controls`}
            </p>
            <div className="flex flex-col gap-2">
              {NHID_CONFORMANCE_CONTROLS.map((c, i) => {
                const isOpen = expandedRows.has(c.code);
                return (
                  <motion.div
                    key={c.code}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ delay: i * 0.07, duration: 0.35, ease: EASE }}
                    className={`text-xs bg-secondary/50 border rounded-md overflow-hidden transition-colors ${isOpen ? 'border-primary/40' : 'border-border'}`}
                  >
                    <button
                      onClick={() => toggleRow(c.code)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-left"
                    >
                      <CheckCircle2 size={14} className="text-primary flex-shrink-0" />
                      <span className="font-mono text-[0.65rem] text-muted-foreground">{c.code}</span>
                      <span className="text-foreground flex-1">{c.requirement}</span>
                      <ChevronDown size={13} className={`text-muted-foreground transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="border-t border-border px-3 py-3 bg-background">
                        <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                          <Zap size={10} />Performance Indicator
                        </p>
                        <div className="bg-primary/5 border border-dashed border-primary/40 rounded-lg p-3 mb-3">
                          <p className="text-xs font-semibold text-primary mb-1">{c.indicator.name}</p>
                          <p className="text-[0.6rem] text-muted-foreground uppercase tracking-widest font-semibold mb-0.5 mt-1.5">Method</p>
                          <p className="text-[0.7rem] text-muted-foreground leading-relaxed">{c.indicator.method}</p>
                          <p className="text-[0.6rem] text-muted-foreground uppercase tracking-widest font-semibold mb-0.5 mt-1.5">SLO Target</p>
                          <span className="inline-block mt-0.5 font-mono text-[0.65rem] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded">
                            {c.indicator.slo}
                          </span>
                        </div>
                        <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">Implementation Guidance</p>
                        <p className="text-[0.7rem] text-muted-foreground leading-relaxed">{c.implementation}</p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
            <motion.a
              href={NHID_SIMULATOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold bg-primary text-primary-foreground rounded-lg py-2.5 hover:opacity-90 transition-opacity"
            >
              Test the Spoofed-Identity Gap — Open Simulator
              <ExternalLink size={13} />
            </motion.a>
          </div>
        </div>
      </div>

      <div className="card-elevated p-5 mt-5">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            {traceMode === 'pass' ? 'NHID-Clinical Compliant Event Trace Example' : 'NHID-Clinical Non-Conformant Event Trace Example'}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTraceMode('pass')}
              className={`font-mono text-[0.65rem] px-2.5 py-1 rounded-full border transition-all ${
                traceMode === 'pass'
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary'
              }`}
            >
              Conformant
            </button>
            <button
              onClick={() => setTraceMode('fail')}
              className={`font-mono text-[0.65rem] px-2.5 py-1 rounded-full border transition-all ${
                traceMode === 'fail'
                  ? 'bg-rose-500 border-rose-500 text-white'
                  : 'border-border bg-card text-muted-foreground hover:border-rose-400/50 hover:text-rose-500'
              }`}
            >
              Non-Conformant
            </button>
          </div>
        </div>
        <pre className="text-mono text-[0.7rem] bg-secondary/60 border border-border rounded-lg p-4 overflow-x-auto leading-relaxed">
{`{
  "call_id": "${trace.call_id}",
  "agent_id": "${trace.agent_id}",
  "start_time": "${trace.start_time}",
  "disclosure_time": ${trace.disclosure_time ? `"${trace.disclosure_time}"` : 'null'},
  "disclosure_text": "${trace.disclosure_text}",
  "human_handoff_requested": ${trace.human_handoff_requested},
  "handoff_time": ${trace.handoff_time ? `"${trace.handoff_time}"` : 'null'},
  "audit_log_complete": ${trace.audit_log_complete},
  "deceptive_artifacts_detected": ${trace.deceptive_artifacts_detected},
  "npi_delegation_verified": ${trace.npi_delegation_verified}, // NHID-Auth v2 (Layer 3)
  "nhid_clinical_score": "${trace.nhid_clinical_score}"
}`}
        </pre>
      </div>
    </section>
  );
}
