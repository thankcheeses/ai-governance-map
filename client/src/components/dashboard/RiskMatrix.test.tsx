import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CONTROLS } from '@/data/governance';
import RiskMatrix from './RiskMatrix';

const renderMatrix = (controlState = {}) => render(<RiskMatrix controlState={controlState} />);

describe('RiskMatrix', () => {
  it('names the active matrix and metric in the heading', async () => {
    renderMatrix();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('AI use case × risk domain — inherent risk');

    await userEvent.click(screen.getByRole('button', { name: 'Residual risk' }));
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('residual risk after controls');
  });

  it('swaps the legend and the scoring rule with the metric', async () => {
    renderMatrix();
    expect(screen.queryByText(/effectiveness =/)).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Residual risk' }));
    expect(screen.getByText(/effectiveness =/)).toBeInTheDocument();
    expect(screen.getByText(/never falls back to the inherent band/i)).toBeInTheDocument();
  });

  it('switches matrix and resets to that matrix’s first metric', async () => {
    renderMatrix();
    await userEvent.click(screen.getByRole('button', { name: 'Jurisdictions' }));
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Jurisdiction × obligation status — obligations by status'
    );
    expect(screen.getByRole('button', { name: 'Obligation count' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('labels an unassessed residual cell as not assessed, never as low risk', async () => {
    renderMatrix();
    await userEvent.click(screen.getByRole('button', { name: 'Residual risk' }));
    const cells = screen.getAllByRole('button', { name: /Not assessed/i });
    expect(cells.length).toBeGreaterThan(0);
    expect(screen.queryAllByRole('button', { name: /risk domain.*Low\./i })).toHaveLength(0);
  });

  it('opens a drilldown with records, rationale and coverage', async () => {
    renderMatrix();
    const cell = screen.getByRole('button', {
      name: /AI use case Clinical triage, Risk domain Lawfulness & conformance/i,
    });
    await userEvent.click(cell);
    expect(screen.getByText('Clinical triage · Lawfulness & conformance')).toBeInTheDocument();
    expect(screen.getByText(/Rationale/)).toBeInTheDocument();
    expect(screen.getByText(/Mitigating controls:/)).toBeInTheDocument();
    expect(screen.getByText('Banned AI triage practice')).toBeInTheDocument();
  });

  it('explains an empty cell instead of showing a zero score', async () => {
    renderMatrix();
    const cell = screen.getByRole('button', {
      name: /AI use case Voice agent, Risk domain Data governance\. No data\./i,
    });
    await userEvent.click(cell);
    expect(screen.getByText(/No data is the finding, not a score of zero\./i)).toBeInTheDocument();
  });

  it('reflects browser-local control scores in the residual band', async () => {
    const scored = Object.fromEntries(CONTROLS.map((c) => [c.id, { maturity: 5 }]));
    renderMatrix(scored);
    await userEvent.click(screen.getByRole('button', { name: 'Residual risk' }));
    expect(screen.queryAllByRole('button', { name: /Not assessed/i })).toHaveLength(0);
  });

  it('offers a sortable table equivalent of the same cells', async () => {
    renderMatrix();
    await userEvent.click(screen.getByRole('button', { name: 'Table' }));
    const header = screen.getByRole('columnheader', { name: /Records/ });
    expect(within(header).getByRole('button')).toBeInTheDocument();
    await userEvent.click(within(header).getByRole('button'));
    expect(header).toHaveAttribute('aria-sort', 'ascending');
  });

  it('gives every grid cell an accessible name and a single tab stop', () => {
    renderMatrix();
    const cells = document.querySelectorAll('button[data-cell]');
    expect(cells.length).toBeGreaterThan(0);
    cells.forEach((cell) => expect(cell).toHaveAccessibleName());
    const tabbable = Array.from(cells).filter((c) => c.getAttribute('tabindex') === '0');
    expect(tabbable).toHaveLength(1);
  });

  it('moves focus across the grid with the arrow keys', async () => {
    renderMatrix();
    const cells = Array.from(document.querySelectorAll<HTMLButtonElement>('button[data-cell]'));
    cells[0].focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(cells[1]);
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(cells[1 + 7]);
    await userEvent.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(cells[7]);
  });
});
