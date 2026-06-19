import { useEffect, useMemo, useState } from 'react';
import { CONTROLS } from '@/data/governance';

export interface ControlProgress {
  maturity?: number;
  notes?: string;
}

export type ControlState = Record<number, ControlProgress>;

export interface AuditSnapshot {
  timestamp: string;
  score: number;
  assessedCount: number;
}

export interface SavedView {
  id: string;
  name: string;
  createdAt: string;
  searchTerm: string;
  tier: string;
  domain: string;
}

const PROGRESS_KEY = 'ai-gov-progress-v3';
const AUDIT_KEY = 'ai-gov-audit-trail-v1';
const VIEWS_KEY = 'ai-gov-saved-views-v1';

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useGovernanceState() {
  const [controlState, setControlState] = useState<ControlState>(() => readJSON(PROGRESS_KEY, {}));
  const [auditTrail, setAuditTrail] = useState<AuditSnapshot[]>(() => readJSON(AUDIT_KEY, []));
  const [savedViews, setSavedViews] = useState<SavedView[]>(() => readJSON(VIEWS_KEY, []));

  useEffect(() => {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(controlState)); } catch { /* storage unavailable */ }
  }, [controlState]);

  useEffect(() => {
    try { localStorage.setItem(AUDIT_KEY, JSON.stringify(auditTrail)); } catch { /* storage unavailable */ }
  }, [auditTrail]);

  useEffect(() => {
    try { localStorage.setItem(VIEWS_KEY, JSON.stringify(savedViews)); } catch { /* storage unavailable */ }
  }, [savedViews]);

  const overallScore = useMemo(() => {
    const total = Object.values(controlState).reduce((a, c) => a + (c.maturity || 0), 0);
    return Math.round((total / (CONTROLS.length * 5)) * 100);
  }, [controlState]);

  const assessedCount = useMemo(
    () => Object.values(controlState).filter((c) => (c.maturity || 0) > 0).length,
    [controlState],
  );

  const getMaturity = (id: number) => controlState[id]?.maturity || 0;
  const getNotes = (id: number) => controlState[id]?.notes || '';

  const updateMaturity = (id: number, level: number) => {
    setControlState((prev) => {
      const next = { ...prev, [id]: { ...prev[id], maturity: level } };
      return next;
    });
  };

  const updateNotes = (id: number, notes: string) =>
    setControlState((prev) => ({ ...prev, [id]: { ...prev[id], notes } }));

  const recordSnapshot = () => {
    setAuditTrail((prev) => {
      const snap: AuditSnapshot = { timestamp: new Date().toISOString(), score: overallScore, assessedCount };
      const next = [...prev, snap];
      return next.slice(-24);
    });
  };

  const clearAll = () => {
    setControlState({});
    try { localStorage.removeItem(PROGRESS_KEY); } catch { /* storage unavailable */ }
  };

  const saveView = (view: Omit<SavedView, 'id' | 'createdAt'>) => {
    setSavedViews((prev) => [
      ...prev,
      { ...view, id: `view-${Date.now()}`, createdAt: new Date().toISOString() },
    ]);
  };

  const deleteView = (id: string) => setSavedViews((prev) => prev.filter((v) => v.id !== id));

  return {
    controlState,
    overallScore,
    assessedCount,
    getMaturity,
    getNotes,
    updateMaturity,
    updateNotes,
    recordSnapshot,
    clearAll,
    auditTrail,
    savedViews,
    saveView,
    deleteView,
  };
}
