import { useState, type ReactNode } from 'react';
import { ChevronRight, ExternalLink, Info } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { NIST_PLAYBOOK_URL, type NistSubcategory, type PlaybookItem } from '@/data/nist-playbook';

/** The Playbook's own framing, required wherever its suggestions are shown. */
export function PlaybookNote({ className = '' }: { className?: string }) {
  return (
    <p className={`flex items-start gap-2 text-xs text-muted-foreground leading-relaxed ${className}`}>
      <Info size={13} className="mt-0.5 flex-shrink-0 text-primary" aria-hidden />
      <span>
        Text from the NIST AI RMF Playbook, verbatim. The Playbook is neither a checklist nor a set of steps to be
        followed in its entirety — its suggested actions are voluntary and meant to be adapted to context.{' '}
        <a
          href={NIST_PLAYBOOK_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-0.5 text-teal-900 underline-offset-2 hover:underline"
        >
          Source: NIST<ExternalLink size={11} aria-hidden />
        </a>
      </span>
    </p>
  );
}

function ItemList({ items }: { items: PlaybookItem[] }) {
  return (
    <ul className="flex flex-col gap-2 pl-4 list-disc marker:text-muted-foreground">
      {items.map((item, i) => (
        <li key={i} className="text-xs text-foreground/90 leading-relaxed pl-1">
          {item.text}
          {item.sub.length > 0 && (
            <ul className="mt-1.5 flex flex-col gap-1 pl-4 list-[circle] marker:text-muted-foreground">
              {item.sub.map((s, j) => (
                <li key={j} className="text-muted-foreground pl-1">{s}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

function Disclosure({ label, count, defaultOpen = false, children }: { label: string; count?: number; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="border-t border-border">
      <CollapsibleTrigger className="group flex w-full items-start gap-1.5 py-2.5 text-left text-[0.7rem] leading-snug font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-sm">
        <ChevronRight size={13} className={`mt-px flex-shrink-0 transition-transform ${open ? 'rotate-90' : ''}`} aria-hidden />
        <span>
          {label}
          {count !== undefined && <span className="ml-1.5 font-mono font-normal normal-case tracking-normal">· {count}</span>}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-3">{children}</CollapsibleContent>
    </Collapsible>
  );
}

interface NistSubcategoryDetailProps {
  sub: NistSubcategory;
  /** Open the suggested actions straight away (used where the user asked for this one subcategory). */
  actionsOpen?: boolean;
  /** Rendered between the statement and the Playbook disclosures. */
  children?: ReactNode;
  /** Hide the outcome statement where the surrounding UI already shows it in full. */
  showStatement?: boolean;
}

export default function NistSubcategoryDetail({ sub, actionsOpen = false, children, showStatement = true }: NistSubcategoryDetailProps) {
  return (
    <div className="flex flex-col gap-3">
      {showStatement && (
      <div>
        <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Subcategory outcome</p>
        <p className="text-sm text-foreground leading-relaxed border-l-2 border-primary/60 pl-3">{sub.statement}</p>
      </div>
      )}
      {children}
      <div>
        {sub.about.length > 0 && (
          <Disclosure label="About">
            <div className="flex flex-col gap-2">
              {sub.about.map((p, i) => (
                <p key={i} className="text-xs text-muted-foreground leading-relaxed">{p}</p>
              ))}
            </div>
          </Disclosure>
        )}
        <Disclosure label="Suggested actions" count={sub.actions.length} defaultOpen={actionsOpen}>
          {sub.actionsIntro && <p className="text-xs text-foreground/90 mb-2">{sub.actionsIntro}</p>}
          <ItemList items={sub.actions} />
        </Disclosure>
        <Disclosure label="Transparency & documentation questions" count={sub.documentation.length}>
          {sub.documentationIntro && <p className="text-xs text-foreground/90 mb-2">{sub.documentationIntro}</p>}
          <ItemList items={sub.documentation} />
        </Disclosure>
      </div>
    </div>
  );
}
