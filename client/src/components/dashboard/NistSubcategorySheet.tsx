import { useMemo } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { CONTROLS } from '@/data/governance';
import { controlsBySubcategory, useNistPlaybook } from '@/data/nist-playbook';
import NistSubcategoryDetail, { PlaybookNote } from './NistSubcategoryDetail';

interface NistSubcategorySheetProps {
  /** Subcategory id to show, or null when closed. */
  id: string | null;
  onClose: () => void;
}

const BY_SUB = controlsBySubcategory(CONTROLS);

export default function NistSubcategorySheet({ id, onClose }: NistSubcategorySheetProps) {
  const playbook = useNistPlaybook(id !== null);
  const sub = useMemo(() => playbook?.subcategories.find((s) => s.id === id) ?? null, [playbook, id]);
  const citedBy = id ? BY_SUB.get(id) ?? [] : [];

  return (
    <Sheet open={id !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl gap-0 overflow-y-auto">
        <SheetHeader className="border-b border-border pr-10">
          <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
            NIST AI RMF Playbook · {id?.split(' ')[0]} function
          </p>
          <SheetTitle className="font-mono text-base">{id}</SheetTitle>
          <SheetDescription className="sr-only">Official subcategory statement, suggested actions and documentation questions from the NIST AI RMF Playbook.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 p-4">
          {!sub ? (
            <div className="flex flex-col gap-2" aria-busy="true">
              <Skeleton className="bg-secondary h-4 w-full" />
              <Skeleton className="bg-secondary h-4 w-5/6" />
              <Skeleton className="bg-secondary h-4 w-2/3" />
            </div>
          ) : (
            <NistSubcategoryDetail sub={sub} actionsOpen>
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                  Cited by {citedBy.length} {citedBy.length === 1 ? 'control' : 'controls'}
                </p>
                <ul className="flex flex-col gap-1">
                  {citedBy.map((c) => (
                    <li key={c.id} className="text-xs text-foreground">
                      <span className="font-mono text-[0.65rem] text-muted-foreground mr-1.5">{c.code}</span>
                      {c.title}
                    </li>
                  ))}
                </ul>
              </div>
            </NistSubcategoryDetail>
          )}
          <PlaybookNote className="border-t border-border pt-3" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
