import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { COUNTRY_AI_LAWS } from '@/data/governance';
import CountryPanel from './CountryPanel';

const show = (country: string) => render(<CountryPanel country={country} onClose={vi.fn()} />);

describe('CountryPanel', () => {
  it('names the instrument for a jurisdiction with binding law', () => {
    const binding = COUNTRY_AI_LAWS.find((c) => c.status === 'binding' && c.frameworkSlug === 'eu-ai-act')!;
    show(binding.name);
    expect(screen.getByText('Binding AI-specific law in effect')).toBeInTheDocument();
    expect(screen.getByText('EU Artificial Intelligence Act')).toBeInTheDocument();
  });

  it('separates a researched absence from a binding instrument', () => {
    const none = COUNTRY_AI_LAWS.find((c) => c.status === 'none');
    if (!none) return;
    show(none.name);
    expect(screen.getByText('Researched — no binding AI-specific law')).toBeInTheDocument();
  });

  // The important one: an unresearched country must never read as "no law".
  it('calls an unresearched jurisdiction a gap in the register, not a finding', () => {
    show('Atlantis');
    expect(screen.getByText('Not yet researched in this register')).toBeInTheDocument();
    expect(screen.getByText(/a gap here, not a finding about the country/i)).toBeInTheDocument();
    expect(screen.queryByText(/no binding AI-specific law/i)).not.toBeInTheDocument();
  });

  it('shows the next dated obligation with its source', () => {
    const eu = COUNTRY_AI_LAWS.find((c) => c.frameworkSlug === 'eu-ai-act')!;
    show(eu.name);
    expect(screen.getByText('Next clock')).toBeInTheDocument();
    // Provenance travels with the obligation into the map panel.
    expect(screen.getAllByText(/Primary text|Official guidance|No source recorded/).length).toBeGreaterThan(0);
  });

  it('lists institutions located in the selected jurisdiction', () => {
    show('United States');
    expect(screen.getByText('Institutions here')).toBeInTheDocument();
    expect(screen.getByText('NIST')).toBeInTheDocument();
  });
});
