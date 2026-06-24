import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PlayCircle, Sparkles, X } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1] as const;

interface IntroBannerProps {
  onStartDemo: () => void;
}

export default function IntroBanner({ onStartDemo }: IntroBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="card-elevated border-l-2 border-l-primary p-4 flex items-center gap-4 flex-wrap"
        >
          <Sparkles size={18} className="text-primary flex-shrink-0" />
          <p className="text-sm text-foreground flex-1 min-w-[240px]">
            This is a live reference — score your own controls below, or click{' '}
            <span className="font-semibold">Demo</span> to see a fully populated example posture.
          </p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStartDemo}
              className="flex items-center gap-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg px-3 py-2 hover:opacity-90 transition-opacity"
            >
              <PlayCircle size={13} />Start Demo
            </motion.button>
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss"
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <X size={15} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
