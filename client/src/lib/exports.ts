import { CONTROLS, MATURITY_LEVELS } from '@/data/governance';
import type { ControlState } from '@/hooks/useGovernanceState';

function downloadBlob(content: string, mime: string, filename: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type: mime }));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function exportControlsCSV(controlState: ControlState) {
  const rows = [
    ['Code', 'Control', 'CCM Domain', 'Risk Tier', 'Priority', 'Maturity Level', 'Notes'].join(','),
    ...CONTROLS.map((item) => {
      const maturity = controlState[item.id]?.maturity || 0;
      const notes = controlState[item.id]?.notes || '';
      return [
        item.code,
        `"${item.title}"`,
        item.ccmDomain,
        item.riskTier,
        item.priority,
        MATURITY_LEVELS[maturity].label,
        `"${notes.replace(/"/g, '""')}"`,
      ].join(',');
    }),
  ].join('\n');
  downloadBlob(rows, 'text/csv', 'ai-governance-assessment.csv');
}

export function exportProgressJSON(controlState: ControlState) {
  downloadBlob(JSON.stringify(controlState, null, 2), 'application/json', 'ai-governance-progress.json');
}

export function printPostureSnapshot() {
  window.print();
}
