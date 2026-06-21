import { motion } from 'framer-motion';
import { BookOpenCheck, ArrowUpRight } from 'lucide-react';
import { FRAMEWORKS } from '@/data/governance';
import SectionHeader from './SectionHeader';

const EASE = [0.16, 1, 0.3, 1] as const;

interface FrameworksSectionProps {
  frameworkFilter: string;
  onFrameworkFilterChange: (fw: string) => void;
}

export default function FrameworksSection({ frameworkFilter, onFrameworkFilterChange }: FrameworksSectionProps) {
  const handleSelect = (shortCode: string) => {
    onFrameworkFilterChange(frameworkFilter === shortCode ? 'all' : shortCode);
    document.getElementById('heatmap')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="frameworks" className="scroll-mt-24">
      <SectionHeader
        icon={<BookOpenCheck size={18} />}
        title="Frameworks"
        subtitle="Click a framework to filter the heatmap and obligations timeline"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FRAMEWORKS.map((fw, i) => {
          const active = frameworkFilter === fw.shortCode;
          return (
            <motion.button
              key={fw.slug}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              whileHover={{ y: -2 }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: EASE }}
              onClick={() => handleSelect(fw.shortCode)}
              className={`text-left card-elevated p-5 transition-colors duration-200 ${
                active ? 'border-[#0F172A]/40 ring-1 ring-[#0F172A]/20' : 'hover:border-primary/30'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {fw.shortCode}
                </span>
                <ArrowUpRight size={14} className={active ? 'text-primary' : 'text-muted-foreground'} />
              </div>
              <p className="font-semibold text-sm text-foreground mb-1 leading-snug">{fw.name}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{fw.summary}</p>
              <div className="flex items-center gap-2 text-[0.65rem] text-muted-foreground mb-2">
                <span>{fw.type}</span>
                <span>·</span>
                <span>{fw.jurisdiction}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${fw.coverage}%` }} />
                </div>
                <span className="font-mono text-[0.65rem] text-muted-foreground">{fw.coverage}%</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
