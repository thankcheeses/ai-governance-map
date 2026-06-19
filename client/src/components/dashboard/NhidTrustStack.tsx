import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ExternalLink, Star } from 'lucide-react';
import { ShieldWaveformIcon } from './icons';
import {
  NHID_CONFORMANCE_CONTROLS,
  NHID_EVENT_TRACE,
  NHID_LAYERS,
  NHID_SIMULATOR_URL,
} from '@/data/governance';

const LAYER_WIDTHS = [100, 92, 84, 76, 68, 60];

export default function NhidTrustStack() {
  const [activeLayer, setActiveLayer] = useState(2);
  const active = NHID_LAYERS[activeLayer];

  return (
    <section id="nhid" className="scroll-mt-24">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <ShieldWaveformIcon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-heading-lg text-foreground">NHID-Clinical v1.3 — Voice Agent Conformance</h2>
          <p className="text-body-sm text-muted-foreground">5-layer trust stack for B2B healthcare voice channels</p>
        </div>
      </div>

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
                viewport={{ once: true }}
                transition={{ delay: idx * 0.09, duration: 0.4, ease: 'easeOut' }}
                onClick={() => setActiveLayer(idx)}
                style={{ width: `${LAYER_WIDTHS[idx]}%` }}
                className={`relative rounded-lg border px-4 py-3 text-left transition-all ${
                  layer.isCore
                    ? 'bg-primary/10 border-primary text-primary shadow-sm'
                    : activeLayer === idx
                      ? 'bg-secondary border-primary/40 text-foreground'
                      : 'bg-card border-border text-muted-foreground hover:border-primary/30'
                }`}
              >
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
          <motion.div
            key={active.layer}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="card-elevated p-5"
          >
            <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-primary mb-1">Layer {active.layer}</p>
            <h3 className="text-heading-sm text-foreground mb-1.5">{active.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{active.scope}</p>
          </motion.div>

          <div className="card-elevated p-5">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Layer 2 Conformance — 4 / 4 Controls</p>
            <div className="flex flex-col gap-2">
              {NHID_CONFORMANCE_CONTROLS.map((c, i) => (
                <motion.div
                  key={c.code}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-2.5 text-xs bg-secondary/50 border border-border rounded-md px-3 py-2"
                >
                  <CheckCircle2 size={14} className="text-primary flex-shrink-0" />
                  <span className="font-mono text-[0.65rem] text-muted-foreground">{c.code}</span>
                  <span className="text-foreground flex-1">{c.requirement}</span>
                </motion.div>
              ))}
            </div>
            <a
              href={NHID_SIMULATOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold bg-primary text-primary-foreground rounded-lg py-2.5 hover:opacity-90 transition-opacity"
            >
              Test the Spoofed-Identity Gap — Open Simulator
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>

      <div className="card-elevated p-5 mt-5">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">NHID-Clinical Compliant Event Trace Example</p>
        <pre className="text-mono text-[0.7rem] bg-secondary/60 border border-border rounded-lg p-4 overflow-x-auto leading-relaxed">
{`{
  "call_id": "${NHID_EVENT_TRACE.call_id}",
  "agent_id": "${NHID_EVENT_TRACE.agent_id}",
  "start_time": "${NHID_EVENT_TRACE.start_time}",
  "disclosure_time": "${NHID_EVENT_TRACE.disclosure_time}",
  "disclosure_text": "${NHID_EVENT_TRACE.disclosure_text}",
  "human_handoff_requested": ${NHID_EVENT_TRACE.human_handoff_requested},
  "audit_log_complete": ${NHID_EVENT_TRACE.audit_log_complete},
  "npi_delegation_verified": ${NHID_EVENT_TRACE.npi_delegation_verified}, // NHID-Auth v2 (Layer 3)
  "nhid_clinical_score": "${NHID_EVENT_TRACE.nhid_clinical_score}"
}`}
        </pre>
      </div>
    </section>
  );
}
