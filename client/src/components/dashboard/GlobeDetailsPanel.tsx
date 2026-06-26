import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { COUNTRY_AI_LAWS, FRAMEWORKS, OBLIGATIONS } from '@/data/governance';

interface GlobePanelProps {
  country: string | null;
  onClose?: () => void;
}

export default function GlobeDetailsPanel({ country, onClose }: GlobePanelProps) {
  const law = country ? COUNTRY_AI_LAWS.find((c) => c.name === country) : undefined;
  const framework = law?.frameworkSlug ? FRAMEWORKS.find((f) => f.slug === law.frameworkSlug) : undefined;
  const obligations = framework ? OBLIGATIONS.filter((o) => o.framework === framework.shortCode) : [];

  return (
    <AnimatePresence>
      {country && (
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          transition={{ duration: 0.2 }}
          className="absolute top-0 right-0 w-96 max-w-full h-full bg-background border-l border-border shadow-lg overflow-y-auto"
        >
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{country}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {law?.status === 'binding' && '✓ AI-specific law in effect'}
                  {law?.status === 'none' && '○ No AI-specific law'}
                </p>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {framework && (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Framework
                </div>
                <div className="card-elevated p-3 space-y-2">
                  <p className="font-semibold text-sm text-foreground">{framework.name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{framework.summary}</p>
                  <div className="text-xs text-muted-foreground space-y-1 pt-2">
                    <p>
                      <span className="font-medium">Type:</span> {framework.type}
                    </p>
                    <p>
                      <span className="font-medium">Jurisdiction:</span> {framework.jurisdiction}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {obligations.length > 0 && (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Key Obligations ({obligations.length})
                </div>
                <div className="space-y-2">
                  {obligations.slice(0, 5).map((obl) => (
                    <div
                      key={obl.id}
                      className="card-elevated p-2 text-xs border-l-2 border-primary/30"
                    >
                      <p className="font-medium text-foreground">{obl.title}</p>
                      <p className="text-muted-foreground mt-1 leading-relaxed">{obl.summary}</p>
                    </div>
                  ))}
                  {obligations.length > 5 && (
                    <p className="text-xs text-muted-foreground text-center pt-2">
                      +{obligations.length - 5} more obligation{obligations.length - 6 !== 0 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            )}

            {!framework && (
              <div className="card-elevated p-3 bg-secondary/5 text-xs text-muted-foreground">
                <p>No specific AI framework found. Research status: {law?.status}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
