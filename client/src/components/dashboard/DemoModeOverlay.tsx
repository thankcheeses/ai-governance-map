import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, PlayCircle } from 'lucide-react';

const STEPS = [
  { id: 'overview', title: 'Overview', body: 'Live posture KPIs — frameworks tracked, controls assessed, critical obligations, and overall maturity score.' },
  { id: 'heatmap', title: 'Risk Heatmap', body: 'Click any cell to inspect the obligation mapped to that likelihood × impact combination. Filter by framework using the chips above.' },
  { id: 'nhid', title: 'NHID-Clinical', body: 'A 5-layer trust stack for healthcare voice agents, with conformance controls and a live event-trace example.' },
  { id: 'controls', title: 'Controls', body: '27 CCM v4.1.0 controls. Search, filter by tier, expand a row to score maturity and capture evidence notes.' },
  { id: 'maturity', title: 'Maturity & Trend', body: 'A radar of your average maturity per CCM domain, plus a trend line built from snapshots you record over time.' },
  { id: 'timeline', title: 'Obligations Timeline', body: 'The EU AI Act phase-in schedule and the full obligations register, filterable by framework.' },
  { id: 'crosswalk', title: 'Crosswalk', body: 'See how controls, topics, and actor duties map across NIST AI RMF, ISO/IEC 42001, the EU AI Act, and CCM v4.1.0.' },
  { id: 'frameworks', title: 'Frameworks', body: 'All seven tracked frameworks — click one to filter the heatmap and timeline down to just that framework.' },
];

interface DemoModeOverlayProps {
  active: boolean;
  onClose: () => void;
}

export default function DemoModeOverlay({ active, onClose }: DemoModeOverlayProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) return;
    setStep(0);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    document.getElementById(STEPS[step].id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [active, step]);

  if (!active) return null;
  const current = STEPS[step];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[min(92vw,420px)] card-elevated p-5 border-primary/40 shadow-lg"
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-widest text-primary">
            <PlayCircle size={12} />Demo · Step {step + 1} / {STEPS.length}
          </span>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={15} />
          </button>
        </div>
        <p className="font-semibold text-sm text-foreground mb-1">{current.title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4">{current.body}</p>
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground disabled:opacity-30 hover:text-foreground"
          >
            <ArrowLeft size={13} />Back
          </button>
          {step === STEPS.length - 1 ? (
            <button onClick={onClose} className="text-xs font-semibold bg-primary text-primary-foreground rounded-lg px-3 py-1.5">
              Finish
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="flex items-center gap-1 text-xs font-semibold bg-primary text-primary-foreground rounded-lg px-3 py-1.5"
            >
              Next<ArrowRight size={13} />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
