import { useState } from 'react';
import type { ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, ExternalLink, Github, PlayCircle, Zap } from 'lucide-react';
import { ShieldWaveformIcon } from './icons';
import {
  IdentityDisclosureIcon,
  PreDataGateIcon,
  DeceptiveBehaviorIcon,
  HumanEscalationIcon,
  AuditTrailIcon,
  ImpersonationLatencyIcon,
  CasGaugeIcon,
} from './nhid-icons';
import {
  CONTROLS,
  NHID_CONFORMANCE_CONTROLS,
  NHID_EVENT_TRACE,
  NHID_EVENT_TRACE_FAIL,
  NHID_LAYERS,
  NHID_SIMULATOR_URL,
} from '@/data/governance';
import SectionHeader from './SectionHeader';
import TrustStackZiggurat from './visuals/TrustStackZiggurat';
import ImpersonationLatencySplit from './visuals/ImpersonationLatencySplit';

const EASE = [0.16, 1, 0.3, 1] as const;

// Each permanent NHID control has a dedicated glyph from the NHID icon system.
const CONTROL_ICON: Record<string, (p: { className?: string; size?: number }) => ReactElement> = {
  'IDG-01': IdentityDisclosureIcon,
  'PDX-01': PreDataGateIcon,
  'DBC-01': DeceptiveBehaviorIcon,
  'EIT-01': HumanEscalationIcon,
  'ATR-01': AuditTrailIcon,
};

// Non-human-identity controls elsewhere in the library that the Voice Agent view surfaces.
const NON_HUMAN_IDENTITY_CODES = ['CTRL-IAM-001', 'CTRL-CEK-001', 'CTRL-UEM-001'];

// Editorial layer -> CCM control mapping (Layer 3 is derived from the canonical
// 'NHID-Clinical' tags already present in CONTROLS[].mappings; the rest are
// curated here and labeled as editorial in the UI).
const LAYER_CCM: Record<number, string[]> = {
  0: ['CTRL-IAM-002'],
  1: ['CTRL-UEM-001'],
  2: ['CTRL-STA-003', 'CTRL-HRS-001'],
  4: ['CTRL-LOG-001'],
  5: ['CTRL-LOG-002', 'CTRL-SEF-001'],
};

function layerControls(layerIdx: number) {
  const codes =
    layerIdx === 3
      ? CONTROLS.filter((c) => c.mappings['NHID-Clinical']).map((c) => c.code)
      : (LAYER_CCM[layerIdx] ?? []);
  return codes
    .map((code) => CONTROLS.find((c) => c.code === code))
    .filter((c): c is (typeof CONTROLS)[number] => !!c);
}

const scrollToControls = () => document.getElementById('controls')?.scrollIntoView({ behavior: 'smooth' });

export default function NhidTrustStack() {
  const [activeLayer, setActiveLayer] = useState(2);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [traceMode, setTraceMode] = useState<'pass' | 'fail'>('pass');
  const active = NHID_LAYERS[activeLayer];
  const trace = traceMode === 'pass' ? NHID_EVENT_TRACE : NHID_EVENT_TRACE_FAIL;
  const mapped = layerControls(activeLayer);

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
        title="NHID-Clinical v2.0 — Voice Agent & Non-Human Identity"
        subtitle="Healthcare-Voice Trust Stack Explorer — five permanent controls, a five-layer trust stack, and impersonation latency as a first-class risk primitive"
      />

      {/* Print-only compact summary for the posture snapshot (hidden on screen) */}
      <div className="print-only border border-border rounded-lg p-4 mb-4 text-xs">
        <p className="font-bold mb-2">NHID-Clinical Trust Stack — print summary</p>
        <ol className="list-decimal list-inside space-y-0.5">
          {NHID_LAYERS.map((l) => (
            <li key={l.layer}>
              <span className="font-semibold">L{l.layer} {l.title}{l.isCore ? ' ★' : ''}:</span> {l.scope}
            </li>
          ))}
        </ol>
        <p className="font-bold mt-3 mb-1">
          Layer 2 conformance: {NHID_CONFORMANCE_CONTROLS.length}/{NHID_CONFORMANCE_CONTROLS.length}
        </p>
        <ul className="space-y-0.5">
          {NHID_CONFORMANCE_CONTROLS.map((c) => (
            <li key={c.code}>
              <span className="font-mono font-semibold">{c.code}</span> — {c.requirement} ({c.kind}; SLO:{' '}
              {c.indicator.slo})
            </li>
          ))}
        </ul>
        <p className="mt-2 opacity-70">
          Open voluntary proposal — NIST-2025-0035-0026, CC BY 4.0. Not law, not an official standard, not a
          certification. Scope is B2B payer–provider administrative voice calls; patient-facing calls and clinical
          decision support are out of scope. Any mapping to legal requirements is interpretive and does not
          establish regulatory compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-5">
        {/* Premium ziggurat stack */}
        <div className="section-premium p-6 flex flex-col">
          <p className="relative z-10 text-xs font-semibold tracking-widest uppercase text-slate-400 mb-4">
            Five-Layer Trust Stack · over the NPI foundation
          </p>
          <div className="relative z-10">
            <TrustStackZiggurat activeLayer={activeLayer} onSelect={setActiveLayer} />
          </div>
          <p className="relative z-10 text-[0.68rem] text-slate-400 mt-4 leading-relaxed">
            The five trust layers (1–5) rest on the NPI Registry foundation (Layer 0). NHID-Clinical
            v2.0 is the behavioral baseline at Layer 2 ★; cryptographic NPI-delegation verification
            lives in NHID-Auth v2 at Layer 3 — a separate, optional authorization layer.
          </p>
          {/* Status note: signals that work has moved past the published spec, without
              asserting any results, metrics, or evaluation figures. */}
          <p className="relative z-10 text-[0.66rem] text-slate-400/90 mt-3 leading-relaxed border-l-2 border-teal-400/30 pl-3">
            <span className="font-semibold text-slate-300">Status:</span> reference-implementation,
            evaluation-corpus and Audit Event Spec work has continued past the published v1.3
            behavioral baseline. The v1.3 specification remains the citable public-comment artifact
            (NIST-2025-0035-0026); conformance evidence below is still prototype / simulation only.
          </p>
          {/* Bidirectional open-source CTAs (no product CTAs) */}
          <div className="relative z-10 flex flex-wrap gap-2 mt-4">
            <a href="https://nhid-clinical.org/specification.html" target="_blank" rel="noopener noreferrer" className="btn-premium-dark">
              <BookOpen size={13} /> Read the v1.3 Specification
            </a>
            <a href="https://nhid-clinical.org/simulator.html" target="_blank" rel="noopener noreferrer" className="btn-premium-dark">
              <PlayCircle size={13} /> Launch Governance Simulator
            </a>
            <a href="https://github.com/NHID-Clinical/NHID-Clinical" target="_blank" rel="noopener noreferrer" className="btn-ghost-dark">
              <Github size={13} /> GitHub • Contribute
            </a>
          </div>
          <p className="relative z-10 disclaimer-small">
            NHID-Clinical is an open voluntary proposal and reference implementation (public comment
            NIST-2025-0035-0026, CC BY 4.0). Not a product. Not a certification. Not an organization.
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

              {mapped.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-[0.6rem] font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">
                    Related CCM controls{activeLayer === 3 ? '' : ' (editorial mapping)'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {mapped.map((c) => (
                      <button
                        key={c.code}
                        onClick={scrollToControls}
                        title={`${c.title} — jump to Controls section`}
                        className="inline-flex items-center gap-1.5 text-[0.65rem] bg-secondary border border-border rounded-full px-2.5 py-1 hover:border-primary/50 hover:text-primary transition-colors"
                      >
                        <span className="font-mono font-semibold">{c.code}</span>
                        <span className="text-muted-foreground max-w-[150px] truncate">{c.title}</span>
                        <span className="font-mono text-[0.55rem] bg-primary/10 text-primary rounded px-1">{c.ccmDomain}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeLayer === 2 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-[0.6rem] font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">
                    Test a scenario in the open simulator
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {NHID_CONFORMANCE_CONTROLS.map((c) => (
                      <a
                        key={c.code}
                        href={`https://nhid-clinical.org/simulator.html?scenario=${c.code.toLowerCase()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[0.65rem] font-mono font-semibold bg-primary/5 border border-primary/30 text-primary rounded-full px-2.5 py-1 hover:bg-primary/10 transition-colors"
                      >
                        {c.code}
                        <ExternalLink size={9} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="card-elevated p-5">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                Permanent Controls — {NHID_CONFORMANCE_CONTROLS.length} / {NHID_CONFORMANCE_CONTROLS.length}
              </p>
              <span
                className="inline-flex items-center gap-1.5 text-[0.65rem] font-mono font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5"
                title="Call Authorization Score — permanent controls met / total, in the conformant example trace"
              >
                <CasGaugeIcon size={13} /> CAS {NHID_CONFORMANCE_CONTROLS.length}/{NHID_CONFORMANCE_CONTROLS.length}
              </span>
            </div>
            <p className="text-[0.62rem] text-muted-foreground mb-3">
              Evidence across all five is <span className="font-semibold">Prototype / Simulation only</span> — an
              open reference implementation, not deployed-at-scale conformance.
            </p>
            <div className="flex flex-col gap-2">
              {NHID_CONFORMANCE_CONTROLS.map((c, i) => {
                const isOpen = expandedRows.has(c.code);
                const Icon = CONTROL_ICON[c.code] ?? IdentityDisclosureIcon;
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
                      <Icon size={16} className="text-primary flex-shrink-0" />
                      <span className="font-mono text-[0.65rem] text-muted-foreground">{c.code}</span>
                      <span className="text-foreground flex-1">{c.requirement}</span>
                      <span className="hidden sm:inline text-[0.55rem] font-medium text-amber-700 bg-amber-100 border border-amber-300 rounded px-1.5 py-0.5 flex-shrink-0" title="Evidence / maturity level">
                        {c.evidence}
                      </span>
                      <ChevronDown size={13} className={`text-muted-foreground transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: EASE }}
                          className="overflow-hidden"
                        >
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
                        </motion.div>
                      )}
                    </AnimatePresence>
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

      {/* Voice Agent & Non-Human Identity — related controls + evidence legend */}
      <div className="card-elevated p-5 mt-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">
              Voice Agent &amp; Non-Human Identity — related controls
            </p>
            <div className="flex flex-wrap gap-1.5">
              {NON_HUMAN_IDENTITY_CODES.map((code) => {
                const c = CONTROLS.find((x) => x.code === code);
                if (!c) return null;
                return (
                  <button
                    key={code}
                    onClick={scrollToControls}
                    title={`${c.title} — jump to Controls`}
                    className="inline-flex items-center gap-1.5 text-[0.65rem] bg-secondary border border-border rounded-full px-2.5 py-1 hover:border-primary/50 hover:text-primary transition-colors"
                  >
                    <span className="font-mono font-semibold">{c.code}</span>
                    <span className="text-muted-foreground max-w-[160px] truncate">{c.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="text-[0.6rem] text-muted-foreground sm:text-right">
            <p className="font-semibold tracking-widest uppercase mb-1">Evidence scale</p>
            <p className="leading-relaxed">
              <span className="font-medium text-amber-700">Prototype / Simulation only</span> ·
              Framework-level · Some production usage · Strong evidence
            </p>
          </div>
        </div>
      </div>

      {/* Impersonation Latency — first-class risk primitive (illustrative premium panel) */}
      <div id="nhid-latency" className="section-premium p-6 mt-5">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-semibold tracking-widest uppercase text-cyan-300/90 bg-cyan-400/10 border border-cyan-400/25 rounded-full px-2 py-0.5">
              <ImpersonationLatencyIcon size={12} /> Risk Primitive
            </span>
            <p className="text-xs font-semibold tracking-widest uppercase text-slate-400">
              the problem NHID-Clinical addresses
            </p>
          </div>
          <h3 className="text-heading-sm text-slate-100 mb-2 flex items-center gap-2">
            <ImpersonationLatencyIcon size={20} className="text-teal-300" /> Impersonation Latency
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl mb-4">
            Impersonation latency is the measurable trust delay between an AI agent initiating a call and
            the receiving system verifying that the caller is authorized to represent the claimed provider
            organization; in many current healthcare workflows, that delay is effectively infinite because
            no standard verification pathway exists.
          </p>
          <ImpersonationLatencySplit />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4 text-xs text-slate-300">
            <div>
              <p className="font-semibold text-rose-300/90 mb-1.5">Without a standard</p>
              <ul className="space-y-1 list-disc list-inside text-slate-400">
                <li>No proactive identity disclosure</li>
                <li>PHI potentially exchanged before verification</li>
                <li>No consistent escalation or audit trail</li>
                <li>Infinite trust delay for the receiving system</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-teal-300/90 mb-1.5">With NHID-Clinical v2.0</p>
              <ul className="space-y-1 list-disc list-inside text-slate-400">
                <li>Mandatory early disclosure gate (IDG-01)</li>
                <li>Pre-data-exchange verification checkpoint</li>
                <li>Defined human handoff + full audit requirements</li>
                <li>Measurable, testable trust pathway</li>
              </ul>
            </div>
          </div>
          <p className="disclaimer-small">
            Conceptual illustration only — this panel describes an open voluntary reference implementation,
            not a product or certification, and paints no data onto the compliance maps above.
          </p>
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
  "pre_exchange_authorization_verified": ${trace.pre_exchange_authorization_verified}, // PDX-01
  "human_handoff_requested": ${trace.human_handoff_requested},
  "handoff_time": ${trace.handoff_time ? `"${trace.handoff_time}"` : 'null'},
  "audit_log_complete": ${trace.audit_log_complete},
  "deceptive_artifacts_detected": ${trace.deceptive_artifacts_detected},
  "npi_delegation_verified": ${trace.npi_delegation_verified}, // NHID-Auth v2 (Layer 3)
  "call_authorization_score": "${trace.nhid_clinical_score}" // CAS
}`}
        </pre>
      </div>
    </section>
  );
}
