import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { Map as MapIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { STATE_AI_LAWS, FRAMEWORKS, OBLIGATIONS } from '@/data/governance';
import SectionHeader from './SectionHeader';
import usStates from 'us-atlas/states-10m.json';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function USAComplianceMapSection() {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const selectedLaw = selectedState ? STATE_AI_LAWS.find((s) => s.name === selectedState) : undefined;
  const selectedFramework = selectedLaw?.frameworkSlug ? FRAMEWORKS.find((f) => f.slug === selectedLaw.frameworkSlug) : undefined;
  const selectedObligations = selectedFramework ? OBLIGATIONS.filter((o) => o.framework === selectedFramework.shortCode) : [];

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
                          onClick={() => setSelectedState((s) => (s === geo.properties.name ? null : geo.properties.name))}
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
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">
                  <span className="font-semibold text-foreground">{selectedState}</span>
                </p>
                {selectedFramework ? (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05, duration: 0.2 }}
                    className="bg-secondary/50 border border-border rounded-lg p-4 border-l-2 border-l-[#0F172A]"
                  >
                    <p className="font-semibold text-sm text-foreground mb-1">{selectedFramework.name}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">{selectedFramework.summary}</p>
                    <div className="flex flex-col gap-2">
                      {selectedObligations.map((o) => (
                        <div key={o.id} className="bg-background border border-border rounded-md p-3">
                          <p className="font-semibold text-xs text-foreground mb-1">{o.title}</p>
                          <p className="text-[0.7rem] text-muted-foreground leading-relaxed mb-2">{o.summary}</p>
                          <div className="flex items-center gap-2 flex-wrap text-[0.65rem]">
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">{o.framework}</span>
                            <span className="px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">{o.type}</span>
                            <span className="px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">{o.severity}</span>
                            <span className="text-muted-foreground">Effective {o.effective}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <p className="text-xs text-muted-foreground">No AI-specific obligations mapped for this state yet.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
