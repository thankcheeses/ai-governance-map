import { motion } from 'framer-motion';
import { BookOpenCheck, ArrowUpRight } from 'lucide-react';
import { FRAMEWORKS } from '@/data/governance';

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
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <BookOpenCheck size={18} />
        </div>
        <div>
          <h2 className="text-heading-lg text-foreground">Frameworks</h2>
          <p className="text-body-sm text-muted-foreground">Click a framework to filter the heatmap and obligations timeline</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FRAMEWORKS.map((fw, i) => {
          const active = frameworkFilter === fw.shortCode;
          return (
            <motion.button
              key={fw.slug}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              onClick={() => handleSelect(fw.shortCode)}
              className={`text-left card-elevated p-5 transition-all ${
                active ? 'border-primary ring-1 ring-primary/30' : 'hover:border-primary/30'
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
