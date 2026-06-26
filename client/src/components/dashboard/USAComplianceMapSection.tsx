import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { Map as MapIcon, ChevronDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { STATE_AI_LAWS, FRAMEWORKS, OBLIGATIONS, type Framework, type Obligation } from '@/data/governance';
import SectionHeader from './SectionHeader';
import usStates from 'us-atlas/states-10m.json';

const EASE = [0.16, 1, 0.3, 1] as const;

// National frameworks apply across every state (US-scoped or US/Global hybrid);
// Global frameworks apply regardless of jurisdiction. Both render as collapsible
// tiers under whatever State-specific law (if any) is mapped for the clicked state.
const NATIONAL_FRAMEWORKS = FRAMEWORKS.filter((f) => f.jurisdiction === 'US' || f.jurisdiction === 'US / Global');
const GLOBAL_FRAMEWORKS = FRAMEWORKS.filter((f) => f.jurisdiction === 'Global');

const TIER_STYLES: Record<'state' | 'national' | 'global', { badge: string; accent: string }> = {
  state: { badge: 'bg-primary/10 text-primary border-primary/20', accent: 'border-l-[#0F172A]' },
  national: { badge: 'bg-amber-100 text-amber-800 border-amber-300', accent: 'border-l-amber-500' },
  global: { badge: 'bg-violet-100 text-violet-800 border-violet-300', accent: 'border-l-violet-500' },
};

function FrameworkCard({ framework, obligations, tier }: { framework: Framework; obligations: Obligation[]; tier: 'state' | 'national' | 'global' }) {
  const style = TIER_STYLES[tier];
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`bg-secondary/50 border border-border rounded-lg p-4 border-l-2 ${style.accent}`}
    >
      <p className="font-semibold text-sm text-foreground mb-1">{framework.name}</p>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{framework.summary}</p>
      <div className="flex flex-col gap-2">
        {obligations.map((o) => (
          <div key={o.id} className="bg-background border border-border rounded-md p-3">
            <p className="font-semibold text-xs text-foreground mb-1">{o.title}</p>
            <p className="text-[0.7rem] text-muted-foreground leading-relaxed mb-2">{o.summary}</p>
            <div className="flex items-center gap-2 flex-wrap text-[0.65rem]">
              <span className={`px-2 py-0.5 rounded-full border font-mono ${style.badge}`}>{o.framework}</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">{o.type}</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">{o.severity}</span>
              <span className="text-muted-foreground">Effective {o.effective}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function TierSection({
  label,
  tier,
  expanded,
  onToggle,
  frameworks,
}: {
  label: string;
  tier: 'national' | 'global';
  expanded: boolean;
  onToggle: () => void;
  frameworks: Framework[];
}) {
  const style = TIER_STYLES[tier];
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground py-1 hover:text-foreground transition-colors"
      >
        <span className="flex items-center gap-1.5">
          {label}
          <span className={`px-1.5 rounded-full border text-[0.6rem] font-mono normal-case ${style.badge}`}>{frameworks.length}</span>
        </span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 pt-1.5">
              {frameworks.map((fw) => (
                <FrameworkCard key={fw.slug} framework={fw} obligations={OBLIGATIONS.filter((o) => o.framework === fw.shortCode)} tier={tier} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function USAComplianceMapSection() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [expandedTier, setExpandedTier] = useState({ national: false, global: false });

  const selectedLaw = selectedState ? STATE_AI_LAWS.find((s) => s.name === selectedState) : undefined;
  const selectedFramework = selectedLaw?.frameworkSlug ? FRAMEWORKS.find((f) => f.slug === selectedLaw.frameworkSlug) : undefined;
  const selectedObligations = selectedFramework ? OBLIGATIONS.filter((o) => o.framework === selectedFramework.shortCode) : [];

  const handleStateClick = (name: string) => {
    setSelectedState((s) => (s === name ? null : name));
    setExpandedTier({ national: false, global: false });
  };

  return (
    <section id="usa-map" className="scroll-mt-24">
      <SectionHeader
        icon={<MapIcon size={18} />}
        title="USA Compliance Map"
        subtitle="State-level AI regulation — hover a state for a quick read, click for the full obligation detail"
      />

      <div className="card-elevated p-5">
        <div className="w-full max-w-2xl mx-auto">
          <ComposableMap projection="geoAlbersUsa" className="w-full h-auto">
            <defs>
              <pattern id="usa-terrain" width="36" height="36" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
                <path d="M0 18 Q 9 9, 18 18 T 36 18" fill="none" stroke="var(--border)" strokeWidth="0.6" opacity="0.5" />
                <path d="M0 27 Q 9 18, 18 27 T 36 27" fill="none" stroke="var(--border)" strokeWidth="0.6" opacity="0.3" />
                <path d="M0 9 Q 9 0, 18 9 T 36 9" fill="none" stroke="var(--border)" strokeWidth="0.6" opacity="0.2" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#usa-terrain)" />
            <Geographies geography={usStates}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const law = STATE_AI_LAWS.find((s) => s.name === geo.properties.name);
                  const isBinding = law?.status === 'binding';
                  const framework = isBinding ? FRAMEWORKS.find((f) => f.slug === law?.frameworkSlug) : undefined;
                  const isSelected = selectedState === geo.properties.name;
                  return (
                    <Tooltip key={geo.id}>
                      <TooltipTrigger asChild>
                        <Geography
                          geography={geo}
                          onClick={() => handleStateClick(geo.properties.name)}
                          className={`outline-none transition-colors duration-200 cursor-pointer ${
                            isBinding
                              ? 'fill-primary/30 hover:fill-primary/50'
                              : 'fill-secondary hover:fill-secondary/70'
                          }`}
                          style={{
                            default: { stroke: isSelected ? '#0F172A' : 'var(--border)', strokeWidth: isSelected ? 1.5 : 0.5 },
                            hover: { stroke: '#0F172A', strokeWidth: 1 },
                            pressed: { stroke: '#0F172A', strokeWidth: 1.5 },
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-semibold">{geo.properties.name}</p>
                        <p className="text-[0.65rem] opacity-80">{framework ? framework.name : 'No AI-specific law tracked'}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>

        <div className="flex items-center gap-4 mt-4 text-[0.65rem] text-muted-foreground flex-wrap justify-center">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary/30 border border-border" />AI-specific law in effect</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-secondary border border-border" />No AI-specific law tracked</span>
        </div>

        <AnimatePresence mode="wait">
          {selectedState && (
            <motion.div
              key={selectedState}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-border space-y-3">
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{selectedState}</span>
                </p>

                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">State</p>
                  {selectedFramework ? (
                    <FrameworkCard framework={selectedFramework} obligations={selectedObligations} tier="state" />
                  ) : (
                    <p className="text-xs text-muted-foreground">No AI-specific obligations mapped for this state yet.</p>
                  )}
                </div>

                <TierSection
                  label="National"
                  tier="national"
                  frameworks={NATIONAL_FRAMEWORKS}
                  expanded={expandedTier.national}
                  onToggle={() => setExpandedTier((t) => ({ ...t, national: !t.national }))}
                />

                <TierSection
                  label="Global"
                  tier="global"
                  frameworks={GLOBAL_FRAMEWORKS}
                  expanded={expandedTier.global}
                  onToggle={() => setExpandedTier((t) => ({ ...t, global: !t.global }))}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
