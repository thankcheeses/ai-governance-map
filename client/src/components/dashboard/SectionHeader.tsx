import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  action?: ReactNode;
}

export default function SectionHeader({ icon, title, subtitle, action }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex items-center justify-between mb-5 flex-wrap gap-3"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-muted text-foreground border border-border flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="text-heading-lg text-foreground leading-tight">{title}</h2>
          <span className="block w-8 h-[3px] rounded-full section-accent-rule my-1" />
          <p className="text-body-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {action}
    </motion.div>
  );
}
