import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, CheckCircle, Shield, Activity, TrendingUp, FileText, Globe, Network, BarChart3, Upload, Save, RotateCcw, ArrowRight, Download, ExternalLink, Filter } from 'lucide-react';

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #F5F3EE;
  --surface: #FFFFFF;
  --surface-2: #F0EDE6;
  --border: #DDD9D0;
  --border-light: #EAE7E0;
  --ink: #18140C;
  --ink-2: #5C5751;
  --ink-3: #9C9891;
  --accent: #1B3D2E;
  --accent-light: #E8F2EC;
  --accent-mid: #3A7D5C;
  --gold: #A0732A;
  --gold-light: #FBF3E4;
  --red: #9B2C2C;
  --red-light: #FEF2F2;
  --font-display: 'DM Serif Display', serif;
  --font-mono: 'IBM Plex Mono', monospace;
  --font-body: 'DM Sans', sans-serif;
}

body { background: var(--bg); color: var(--ink); font-family: var(--font-body); }
.app-wrapper { min-height: 100vh; background: var(--bg); }

.header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 0 2rem; position: sticky; top: 0; z-index: 100; }
.header-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 64px; gap: 1.5rem; }
.header-brand { display: flex; align-items: baseline; gap: 0.75rem; flex-shrink: 0; }
.header-title { font-family: var(--font-display); font-size: 1.375rem; color: var(--ink); letter-spacing: -0.01em; }
.header-version { font-family: var(--font-mono); font-size: 0.65rem; color: var(--ink-3); background: var(--surface-2); border: 1px solid var(--border); padding: 2px 6px; border-radius: 3px; }
.header-nav { display: flex; gap: 0; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; background: var(--surface-2); flex-shrink: 0; }
.nav-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1.125rem; font-family: var(--font-body); font-size: 0.8125rem; font-weight: 500; color: var(--ink-2); background: transparent; border: none; border-right: 1px solid var(--border); cursor: pointer; transition: all 0.15s ease; white-space: nowrap; }
.nav-btn:last-child { border-right: none; }
.nav-btn:hover { background: var(--surface); color: var(--ink); }
.nav-btn.active { background: var(--accent); color: #fff; }
.nav-btn svg { width: 14px; height: 14px; }
.header-actions { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }
.btn-ghost { display: flex; align-items: center; gap: 0.375rem; padding: 0.4rem 0.75rem; font-size: 0.8rem; font-weight: 500; color: var(--ink-2); background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; transition: all 0.15s; font-family: var(--font-body); white-space: nowrap; }
.btn-ghost:hover { background: var(--surface); color: var(--ink); }
.btn-ghost svg { width: 13px; height: 13px; }
.score-pill { display: flex; align-items: center; gap: 0.625rem; padding: 0.4rem 1rem; background: var(--accent-light); border: 1px solid #C2DCCA; border-radius: 6px; font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent); font-weight: 500; }
.score-bar-wrap { width: 60px; height: 4px; background: #C2DCCA; border-radius: 2px; overflow: hidden; }
.score-bar-fill { height: 100%; background: var(--accent); border-radius: 2px; transition: width 0.5s ease; }

.main { max-width: 1200px; margin: 0 auto; padding: 2rem; }

.stats-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
.stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 1.125rem 1.375rem; }
.stat-label { font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 0.375rem; }
.stat-value { font-family: var(--font-display); font-size: 2rem; color: var(--ink); line-height: 1; }
.stat-sub { font-size: 0.75rem; color: var(--ink-3); margin-top: 0.25rem; }

.tier-filter-bar { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
.tier-filter-label { font-size: 0.7rem; font-weight: 600; color: var(--ink-3); display: flex; align-items: center; gap: 0.25rem; text-transform: uppercase; letter-spacing: 0.06em; margin-right: 0.25rem; }
.tier-filter-label svg { width: 12px; height: 12px; }
.tier-chip { font-family: var(--font-mono); font-size: 0.65rem; padding: 4px 10px; border-radius: 20px; border: 1px solid var(--border); background: var(--surface); color: var(--ink-2); cursor: pointer; transition: all 0.15s; font-weight: 500; }
.tier-chip:hover { border-color: var(--accent-mid); color: var(--accent); background: var(--accent-light); }
.tier-chip.active-chip { background: var(--accent); border-color: var(--accent); color: #fff; }
.tier-chip.chip-agentic.active-chip { background: #3730A3; border-color: #3730A3; }
.tier-chip.chip-genai.active-chip { background: #7E22CE; border-color: #7E22CE; }
.tier-chip.chip-gpai.active-chip { background: #6D28D9; border-color: #6D28D9; }

.search-wrap { position: relative; margin-bottom: 1rem; }
.search-wrap svg { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--ink-3); width: 16px; height: 16px; pointer-events: none; }
.search-input { width: 100%; padding: 0.75rem 1rem 0.75rem 2.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; font-family: var(--font-body); font-size: 0.875rem; color: var(--ink); outline: none; transition: border 0.15s; }
.search-input:focus { border-color: var(--accent-mid); }
.search-input::placeholder { color: var(--ink-3); }

.filter-notice { display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1rem; background: var(--accent-light); border: 1px solid #C2DCCA; border-radius: 7px; margin-bottom: 1rem; font-size: 0.8125rem; color: var(--accent); }
.filter-notice button { margin-left: auto; font-size: 0.75rem; color: var(--accent); background: none; border: none; cursor: pointer; text-decoration: underline; font-family: var(--font-body); }

.controls-list { display: flex; flex-direction: column; gap: 0.5rem; }
.control-card { background: var(--surface); border: 1px solid var(--border-light); border-radius: 10px; overflow: hidden; transition: border-color 0.15s, box-shadow 0.15s; }
.control-card:hover { border-color: var(--border); }
.control-card.expanded { border-color: var(--border); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
.control-header { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; cursor: pointer; }
.priority-stripe { width: 3px; height: 36px; border-radius: 2px; flex-shrink: 0; }
.stripe-critical { background: var(--red); }
.stripe-high { background: var(--gold); }
.stripe-medium { background: var(--ink-3); }
.control-meta { flex: 1; min-width: 0; }
.control-name { font-weight: 600; font-size: 0.9375rem; color: var(--ink); margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.375rem; flex-wrap: wrap; }
.control-desc { font-size: 0.8125rem; color: var(--ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.badge { display: inline-flex; align-items: center; font-family: var(--font-mono); font-size: 0.6rem; padding: 2px 7px; border-radius: 4px; font-weight: 500; white-space: nowrap; }
.badge-tier { background: var(--surface-2); color: var(--ink-2); border: 1px solid var(--border); }
.badge-critical { background: var(--red-light); color: var(--red); border: 1px solid #FCA5A5; }
.badge-high { background: var(--gold-light); color: var(--gold); border: 1px solid #FCD34D; }
.badge-medium { background: var(--surface-2); color: var(--ink-2); border: 1px solid var(--border); }
.badge-agentic { background: #EEF2FF; color: #3730A3; border: 1px solid #A5B4FC; }
.badge-gpai { background: #F5F3FF; color: #6D28D9; border: 1px solid #C4B5FD; }
.badge-genai { background: #FDF4FF; color: #7E22CE; border: 1px solid #E9D5FF; }
.badge-maturity { background: var(--accent-light); color: var(--accent); border: 1px solid #C2DCCA; }
.chevron { color: var(--ink-3); transition: transform 0.2s; flex-shrink: 0; }
.chevron.open { transform: rotate(180deg); }

.control-body { border-top: 1px solid var(--border-light); padding: 1.5rem 1.25rem; background: var(--bg); display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
.section-label { font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.375rem; }
.section-label svg { width: 12px; height: 12px; }

.maturity-scale { display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.375rem; margin-bottom: 1.25rem; }
.mat-btn { display: flex; flex-direction: column; align-items: center; padding: 0.5rem 0.25rem; border-radius: 6px; border: 1px solid var(--border); cursor: pointer; background: var(--surface); transition: all 0.15s; font-family: var(--font-body); }
.mat-btn:hover { border-color: var(--accent-mid); }
.mat-btn.active-mat { background: var(--accent); border-color: var(--accent); }
.mat-num { font-family: var(--font-mono); font-size: 0.9rem; font-weight: 500; color: var(--ink-2); line-height: 1; }
.mat-btn.active-mat .mat-num { color: #fff; }
.mat-name { font-size: 0.55rem; color: var(--ink-3); margin-top: 2px; text-align: center; line-height: 1.2; }
.mat-btn.active-mat .mat-name { color: rgba(255,255,255,0.75); }
.remediation-area { width: 100%; padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 7px; font-family: var(--font-body); font-size: 0.8125rem; color: var(--ink); resize: vertical; min-height: 80px; outline: none; transition: border 0.15s; }
.remediation-area:focus { border-color: var(--accent-mid); }
.remediation-area::placeholder { color: var(--ink-3); }

.mappings-grid { display: flex; flex-wrap: wrap; gap: 0.375rem; margin-bottom: 1rem; }
.mapping-tag { font-family: var(--font-mono); font-size: 0.6rem; padding: 3px 8px; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; color: var(--ink-2); cursor: pointer; transition: all 0.12s; display: inline-flex; align-items: center; gap: 4px; text-decoration: none; }
.mapping-tag:hover { background: var(--accent-light); border-color: var(--accent-mid); color: var(--accent); }
.mapping-tag .ext-icon { width: 9px; height: 9px; opacity: 0.5; flex-shrink: 0; }
.implementation-block { padding: 0.75rem 1rem; background: var(--surface); border-left: 3px solid var(--accent-mid); border-radius: 0 6px 6px 0; font-size: 0.8125rem; color: var(--ink-2); line-height: 1.6; }

.matrix-container { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
.matrix-header-section { padding: 1.5rem; border-bottom: 1px solid var(--border-light); }
.matrix-title { font-family: var(--font-display); font-size: 1.25rem; color: var(--ink); margin-bottom: 0.25rem; }
.matrix-subtitle { font-size: 0.8125rem; color: var(--ink-3); }
.matrix-scroll { overflow-x: auto; padding: 1.5rem; }
.matrix-table { border-collapse: collapse; }
.matrix-table th { font-family: var(--font-mono); font-size: 0.6rem; font-weight: 500; color: var(--ink-3); text-align: center; padding: 0 0.375rem 0.75rem; writing-mode: vertical-rl; transform: rotate(180deg); height: 80px; min-width: 44px; vertical-align: bottom; }
.matrix-table td:first-child { font-family: var(--font-mono); font-size: 0.6875rem; color: var(--ink-2); text-align: right; padding-right: 1rem; white-space: nowrap; }
.matrix-cell { width: 44px; height: 36px; text-align: center; padding: 2px; }
.matrix-cell-btn { width: 40px; height: 32px; border-radius: 5px; border: 1px solid var(--border-light); font-family: var(--font-mono); font-size: 0.7rem; font-weight: 500; cursor: pointer; transition: all 0.15s; }
.matrix-cell-self { background: var(--bg); color: var(--ink-3); cursor: default; border-color: transparent; }
.matrix-cell-value { background: var(--accent-light); color: var(--accent); border-color: #C2DCCA; }
.matrix-cell-value:hover { background: var(--accent); color: #fff; border-color: var(--accent); transform: scale(1.05); }
.matrix-cell-zero { background: var(--surface-2); color: var(--ink-3); border-color: transparent; }

.upload-zone { background: var(--surface); border: 2px dashed var(--border); border-radius: 12px; padding: 2.5rem 2rem; text-align: center; margin-bottom: 1.5rem; transition: border-color 0.15s; }
.upload-zone:hover { border-color: var(--accent-mid); }
.upload-icon { width: 44px; height: 44px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1rem; color: var(--ink-3); }
.upload-title { font-family: var(--font-display); font-size: 1.25rem; color: var(--ink); margin-bottom: 0.5rem; }
.upload-desc { font-size: 0.8125rem; color: var(--ink-3); margin-bottom: 1.25rem; }
.upload-actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
.btn-primary { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1.375rem; background: var(--accent); color: #fff; border-radius: 7px; font-family: var(--font-body); font-size: 0.8125rem; font-weight: 600; cursor: pointer; border: none; transition: background 0.15s; }
.btn-primary:hover { background: #142E22; }
.btn-secondary { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1.375rem; background: var(--surface); color: var(--ink-2); border-radius: 7px; font-family: var(--font-body); font-size: 0.8125rem; font-weight: 600; cursor: pointer; border: 1px solid var(--border); transition: all 0.15s; }
.btn-secondary:hover { background: var(--surface-2); color: var(--ink); }
.upload-success { display: inline-flex; align-items: center; gap: 0.375rem; margin-top: 0.875rem; font-size: 0.8125rem; color: var(--accent-mid); }
.gap-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
.gap-stat { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 1.25rem 1.375rem; }
.gap-stat-label { font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 0.375rem; }
.gap-stat-value { font-family: var(--font-display); font-size: 2.25rem; color: var(--ink); line-height: 1; }
.gap-stat-sub { font-size: 0.75rem; color: var(--ink-3); margin-top: 0.25rem; }
.gap-stat.critical { border-color: #FCA5A5; background: var(--red-light); }
.gap-stat.critical .gap-stat-label { color: var(--red); }
.gap-list-title { font-family: var(--font-display); font-size: 1rem; color: var(--ink); margin-bottom: 1rem; }
.gap-item { display: flex; align-items: flex-start; gap: 0.875rem; padding: 1rem 1.125rem; background: var(--surface); border: 1px solid var(--border-light); border-radius: 8px; margin-bottom: 0.5rem; transition: border-color 0.12s; }
.gap-item:hover { border-color: var(--border); }
.gap-arrow { color: var(--ink-3); flex-shrink: 0; margin-top: 2px; }
.gap-item-name { font-weight: 600; font-size: 0.875rem; color: var(--ink); margin-bottom: 0.2rem; display: flex; align-items: center; gap: 0.375rem; flex-wrap: wrap; }
.gap-item-desc { font-size: 0.8rem; color: var(--ink-2); }

.empty-state { text-align: center; padding: 3rem; color: var(--ink-3); font-size: 0.875rem; }

@media (max-width: 768px) {
  .control-body { grid-template-columns: 1fr; }
  .stats-bar { grid-template-columns: repeat(2, 1fr); }
  .header-nav { display: none; }
  .gap-stats { grid-template-columns: 1fr; }
  .header-actions .btn-ghost span { display: none; }
}
`;

const CITATIONS: Record<string, string> = {
  'NIST AI RMF':   'https://airc.nist.gov/RMF/1',
  'NIST AI 600-1': 'https://airc.nist.gov/Docs/1',
  'ISO/IEC 42001': 'https://www.iso.org/standard/81230.html',
  'EU AI Act':     'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689',
  'OECD AI':       'https://oecd.ai/en/ai-principles',
  'Canada AIDA':   'https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/responsible-use-ai/bill-c-27.html',
  'Singapore':     'https://www.pdpc.gov.sg/Help-and-Resources/2020/01/Model-AI-Governance-Framework',
  'US Banking':    'https://www.federalreserve.gov/supervisionreg/srletters/sr1107.htm',
  'OCC/Fed/FDIC':  'https://www.occ.gov/news-issuances/news-releases/2023/nr-ia-2023-17.html',
  'OWASP LLM':     'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
  'GDPR':          'https://gdpr-info.eu/',
  'NIST CSF':      'https://www.nist.gov/cyberframework',
  'SOC 2':         'https://www.aicpa-cima.com/resources/landing/system-and-organization-controls-soc-suite-of-services',
  'FedRAMP':       'https://www.fedramp.gov/',
  'UK AI':         'https://www.gov.uk/government/publications/ai-regulation-a-pro-innovation-approach',
  'IEEE 7000':     'https://standards.ieee.org/ieee/7000/6781/',
  'Brazil LGPD':   'https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd',
  'China PIPL':    'https://www.newamerica.org/cybersecurity-initiative/digichina/blog/chinas-personal-information-protection-law/',
  'Japan AI':      'https://www.meti.go.jp/english/press/2023/0427_002.html',
  'Australia AI':  'https://www.industry.gov.au/publications/australias-artificial-intelligence-ethics-framework',
  'NYC Law 144':   'https://legistar.council.nyc.gov/LegislationDetail.aspx?ID=4344524',
  'Colorado AI':   'https://leg.colorado.gov/bills/sb24-205',
  'California AI': 'https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202320240SB1047',
  'G7 Hiroshima':  'https://www.g7hiroshima.go.jp/documents/pdf/G7AI_code_of_conduct_en.pdf',
  'EO 14110':      'https://www.whitehouse.gov/briefing-room/presidential-actions/2023/10/30/executive-order-on-the-safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence/',
};

const NHID_MANIFEST = [
  { concept: "Human Oversight", notes: "NHID-Clinical: Turing Boundary — AI must yield to human operator on request" },
  { concept: "Agentic Action Boundaries", notes: "NHID-Clinical: Pre-Data Gate — non-human identity must be disclosed before PHI exchange" },
  { concept: "Explainability", notes: "NHID-Clinical: AI agent must state its purpose and data needs when asked" },
  { concept: "Privacy Assessment", notes: "NHID-Clinical: PHI disclosure controls required for all agentic payer interactions" },
  { concept: "Vendor Risk", notes: "NHID-Clinical: Third-party AI voice agents must meet NHID-Clinical disclosure standards" },
  { concept: "Data Governance", notes: "NHID-Clinical: PHI must not be transmitted before Pre-Data Gate passes" },
  { concept: "Adversarial Testing", notes: "NHID-Clinical: Safe Failover — agent must gracefully transfer to human on failure" },
];

const maturityLevels = [
  { level: 0, label: 'None' }, { level: 1, label: 'Initial' }, { level: 2, label: 'Managed' },
  { level: 3, label: 'Defined' }, { level: 4, label: 'Measured' }, { level: 5, label: 'Optimized' },
];

const ALL_TIERS = ['All', 'High-Risk', 'All Systems', 'GenAI', 'GPAI', 'Autonomous Agents', 'Critical'];

const frameworks = ['NIST AI RMF','NIST AI 600-1','ISO/IEC 42001','EU AI Act','OECD AI','Canada AIDA','Singapore','US Banking','OCC/Fed/FDIC','OWASP LLM','GDPR','NIST CSF','SOC 2','FedRAMP','UK AI','IEEE 7000','Brazil LGPD','China PIPL','Japan AI','Australia AI','NYC Law 144','Colorado AI','California AI','G7 Hiroshima','EO 14110'];

const complianceData = [
  { id: 1, concept: "Risk Management System", riskTier: "High-Risk", priority: "Critical", description: "Systematic approach to identify, assess, and mitigate AI-related risks throughout the lifecycle.", mappings: { "NIST AI RMF": ["MAP 1.1"], "ISO/IEC 42001": ["8.2"], "EU AI Act": ["Art 9"], "OECD AI": ["1.4"], "Singapore": ["Gov"], "NIST CSF": ["GOV-04"], "SOC 2": ["CC3.1"], "UK AI": ["RA"], "FedRAMP": ["RA-3"], "G7 Hiroshima": ["§3"], "EO 14110": ["§4.1"] }, implementation: "Maintain living AI Risk Register with quarterly reviews. Align register schema to ISO 42001 Clause 8.2 for audit-readiness." },
  { id: 2, concept: "Human Oversight", riskTier: "High-Risk", priority: "Critical", description: "Mechanisms ensuring human intervention and control over consequential AI decisions.", mappings: { "NIST AI RMF": ["GOV 2.2"], "EU AI Act": ["Art 14"], "Canada AIDA": ["Sec 12"], "Singapore": ["HITL"], "UK AI": ["Oversight"], "NYC Law 144": ["Review"], "Colorado AI": ["Human"], "G7 Hiroshima": ["§7"], "EO 14110": ["§4.2"] }, implementation: "Establish oversight committee with documented intervention triggers and escalation paths." },
  { id: 3, concept: "Model Inventory", riskTier: "All Systems", priority: "High", description: "Centralized registry of all AI models in production and development.", mappings: { "US Banking": ["Inventory"], "OCC/Fed/FDIC": ["§III.B"], "ISO/IEC 42001": ["6.1.3"], "EU AI Act": ["Art 49"], "FedRAMP": ["CM-8"], "SOC 2": ["CC8.1"], "EO 14110": ["§4.6"] }, implementation: "Maintain centralized GRC registry of models including version, owner, risk tier, and deployment status." },
  { id: 4, concept: "Data Governance", riskTier: "All Systems", priority: "High", description: "Controls for data quality, lineage, consent, and lifecycle management.", mappings: { "ISO/IEC 42001": ["A.7"], "EU AI Act": ["Art 10"], "OECD AI": ["1.2"], "NIST AI RMF": ["MAP 2.2"], "NIST AI 600-1": ["GV-6.1"], "Brazil LGPD": ["Art 6"], "China PIPL": ["Art 19"], "GDPR": ["Art 5"] }, implementation: "Encrypt data at rest and in transit. Maintain data lineage logs and consent records for all training datasets." },
  { id: 5, concept: "Model Validation", riskTier: "High-Risk", priority: "Critical", description: "Independent validation by a separate team prior to production deployment.", mappings: { "US Banking": ["Validation"], "OCC/Fed/FDIC": ["§IV.A"], "NIST AI RMF": ["MEAS 2.6"], "SOC 2": ["CC5.2"], "ISO/IEC 42001": ["9.1"] }, implementation: "Second-line team validates models pre-deployment. Document validation methodology and sign-off." },
  { id: 6, concept: "Privacy Assessment", riskTier: "All Systems", priority: "Critical", description: "Data Protection Impact Assessments for AI systems processing personal data.", mappings: { "GDPR": ["Art 35"], "ISO/IEC 42001": ["A.7"], "Canada AIDA": ["Anon"], "Brazil LGPD": ["Art 38"], "China PIPL": ["Art 55"], "FedRAMP": ["AR-2"], "California AI": ["§1798.91.05"] }, implementation: "Conduct DPIA before processing personal data. Re-assess annually and after material model changes." },
  { id: 7, concept: "Explainability", riskTier: "High-Risk", priority: "High", description: "Mechanisms to explain AI decisions to affected stakeholders in accessible terms.", mappings: { "EU AI Act": ["Art 13"], "NIST AI RMF": ["GOV 3.1"], "NIST AI 600-1": ["MS-2.5"], "OECD AI": ["1.3"], "Singapore": ["Ops"], "NYC Law 144": ["Notice"], "IEEE 7000": ["Trans"], "Japan AI": ["Trans"] }, implementation: "Provide SHAP/LIME explanations for high-risk outputs. Store explanation artifacts alongside decision logs." },
  { id: 8, concept: "Data Drift Detection", riskTier: "High-Risk", priority: "Critical", description: "Continuous monitoring of input distribution shifts in production environments.", mappings: { "NIST AI RMF": ["MEAS 2.7"], "NIST AI 600-1": ["MS-2.6"], "ISO/IEC 42001": ["A.9.2"], "US Banking": ["Monitor"], "OCC/Fed/FDIC": ["§IV.C"], "SOC 2": ["CC7.2"] }, implementation: "Alert when input distribution diverges >5% from training baseline. Trigger revalidation workflow automatically." },
  { id: 9, concept: "Model Versioning", riskTier: "High-Risk", priority: "High", description: "Immutable version history enabling rollback to prior production states.", mappings: { "ISO/IEC 42001": ["A.9.3"], "NIST AI RMF": ["MAN 3.3"], "FedRAMP": ["CM-2"], "SOC 2": ["CC8.1"], "EO 14110": ["§4.6"] }, implementation: "Immutable version history with signed artifacts and linked validation reports." },
  { id: 10, concept: "Adversarial Testing", riskTier: "High-Risk", priority: "Critical", description: "Structured red-team testing against prompt injection, jailbreaks, and adversarial inputs.", mappings: { "OWASP LLM": ["LLM01"], "NIST AI RMF": ["MEAS 2.5"], "NIST AI 600-1": ["MS-2.2"], "Canada AIDA": ["Harm"], "NIST CSF": ["DET-01"], "EO 14110": ["§4.2b"], "G7 Hiroshima": ["§5"] }, implementation: "Quarterly red-team exercises with documented findings. Pre-release red-teaming required for all GPAI models." },
  { id: 11, concept: "Bias Testing", riskTier: "High-Risk", priority: "Critical", description: "Systematic testing for algorithmic bias across legally protected characteristics.", mappings: { "NIST AI RMF": ["MEAS 2.3"], "EU AI Act": ["Art 10(2)"], "Canada AIDA": ["Bias"], "OECD AI": ["1.2"], "NYC Law 144": ["Audit"], "Colorado AI": ["Discrim"], "IEEE 7000": ["Fair"], "California AI": ["§1798.91.06"] }, implementation: "Quarterly bias testing with external auditor sign-off. Publish bias audit summaries for high-risk consumer-facing systems." },
  { id: 12, concept: "Secure Weights", riskTier: "Critical", priority: "Critical", description: "Prevent model weight theft, unauthorized access, and supply-chain compromise.", mappings: { "OWASP LLM": ["LLM10"], "ISO/IEC 42001": ["A.13"], "NIST CSF": ["PROT-13"], "FedRAMP": ["SC-28"], "EO 14110": ["§4.2a"] }, implementation: "Store weights in HSM with access logging. Implement Confidential Computing / TEE for real-time inference protection against side-channel attacks." },
  { id: 13, concept: "Copyright Compliance", riskTier: "GenAI", priority: "High", description: "IP rights management for training data ingestion and generated output.", mappings: { "EU AI Act": ["Art 53"], "ISO/IEC 42001": ["A.5"], "UK AI": ["Copyright"], "G7 Hiroshima": ["§8"] }, implementation: "Maintain IP ledger with training data provenance. Implement output filtering for copyrighted material reproduction." },
  { id: 14, concept: "Contestability", riskTier: "High-Risk", priority: "Medium", description: "Documented process enabling users to challenge and appeal automated decisions.", mappings: { "GDPR": ["Art 22"], "Canada AIDA": ["Lang"], "Singapore": ["Cust"], "Brazil LGPD": ["Art 20"], "Australia AI": ["Contest"], "Colorado AI": ["Appeal"] }, implementation: "Human appeal workflow with <48hr SLA. Log all appeals and outcomes for regulatory reporting." },
  { id: 15, concept: "Environmental Impact", riskTier: "All Systems", priority: "Medium", description: "Monitor, measure, and disclose AI compute carbon and energy footprint.", mappings: { "EU AI Act": ["Art 40"], "OECD AI": ["1.1"], "IEEE 7000": ["Sustain"], "ISO/IEC 42001": ["A.6.2"] }, implementation: "Log compute hours per model run. Report Scope 2 equivalent emissions quarterly to sustainability team." },
  { id: 16, concept: "Vendor Risk", riskTier: "All Systems", priority: "High", description: "Third-party AI provider oversight, due diligence, and ongoing monitoring.", mappings: { "NIST AI RMF": ["MAP 1.5"], "US Banking": ["Vendor"], "OCC/Fed/FDIC": ["§V"], "ISO/IEC 42001": ["8.4"], "SOC 2": ["CC9.2"], "FedRAMP": ["SA-9"], "OWASP LLM": ["LLM05"] }, implementation: "Annual risk assessment for all 3rd-party AI providers. OCC/Fed/FDIC 2025 Joint Guidance requires documented concentration risk analysis for banking-sector deployments." },
  { id: 17, concept: "Hallucination Management", riskTier: "GenAI", priority: "Critical", description: "Controls to detect, mitigate, and disclose AI-generated factual inaccuracies.", mappings: { "NIST AI 600-1": ["MS-2.5", "GV-1.1"], "EU AI Act": ["Art 52"], "OWASP LLM": ["LLM09"], "ISO/IEC 42001": ["A.9.1"], "G7 Hiroshima": ["§4"] }, implementation: "Implement RAG grounding and confidence scoring. Display uncertainty indicators in user-facing outputs. Log hallucination incidents for ongoing calibration." },
  { id: 18, concept: "Synthetic Content Detection", riskTier: "GenAI", priority: "High", description: "Watermarking and provenance controls for AI-generated content.", mappings: { "NIST AI 600-1": ["GV-6.2"], "EU AI Act": ["Art 50"], "EO 14110": ["§4.5"], "G7 Hiroshima": ["§6"], "OECD AI": ["1.3"] }, implementation: "Apply cryptographic watermarking to all generated media. Maintain content provenance chain-of-custody aligned to C2PA standard." },
  { id: 19, concept: "Dual-Use Foundation Model Reporting", riskTier: "GPAI", priority: "High", description: "Safety test result reporting obligations for large-scale foundation model developers.", mappings: { "EO 14110": ["§4.2c"], "EU AI Act": ["Art 55"], "NIST AI 600-1": ["GV-1.7"], "G7 Hiroshima": ["§2"] }, implementation: "Report red-team and safety evaluation results to relevant government bodies prior to public release. Maintain audit trail of submissions." },
  { id: 20, concept: "Shutdown / Decommissioning Plan", riskTier: "GPAI", priority: "High", description: "Documented capability to safely halt AI systems exceeding defined risk thresholds.", mappings: { "California AI": ["SB-1047 lineage"], "ISO/IEC 42001": ["A.9.4"], "EU AI Act": ["Art 9(7)"], "NIST AI RMF": ["MAN 4.1"] }, implementation: "Documented kill-switch procedures with tested runbooks. Required for systems exceeding California's defined compute thresholds. Test annually." },
  { id: 21, concept: "Agentic Action Boundaries", riskTier: "Autonomous Agents", priority: "Critical", description: "Granular permissioning and safety guardrails for AI agents executing autonomous API calls, transactions, or system modifications.", mappings: { "NIST AI 600-1": ["GV-2.1", "MS-1.1"], "EU AI Act": ["Art 14"], "ISO/IEC 42001": ["A.10.1"], "OWASP LLM": ["LLM07"], "OCC/Fed/FDIC": ["Auto-Txn"], "NIST CSF": ["PR.AC-04"] }, implementation: "Implement HITL confirmation triggers for any action exceeding a defined financial or system-impact threshold. Use scoped API tokens with least-privilege access. Maintain tamper-proof execution logs. For healthcare agentic deployments, apply NHID-Clinical controls: Pre-Data Gate disclosure, Turing Boundary enforcement, and Safe Failover to human operators." },
];

const tierBadge = (t: string) => t === 'Autonomous Agents' ? 'badge badge-agentic' : t === 'GPAI' ? 'badge badge-gpai' : t === 'GenAI' ? 'badge badge-genai' : 'badge badge-tier';
const priorityStripe = (p: string) => p === 'Critical' ? 'stripe-critical' : p === 'High' ? 'stripe-high' : 'stripe-medium';
const priorityBadge = (p: string) => p === 'Critical' ? 'badge badge-critical' : p === 'High' ? 'badge badge-high' : 'badge badge-medium';

const AIGovernancePlatform = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFrameworks, setSelectedFrameworks] = useState(['all']);
  const [selectedTier, setSelectedTier] = useState('All');
  const [expandedRows, setExpandedRows] = useState(new Set<number>());
  const [controlState, setControlState] = useState<Record<number, { maturity?: number; remediation?: string }>>({});
  const [userControls, setUserControls] = useState<any[]>([]);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const getMaturity = (id: number) => controlState[id]?.maturity || 0;
  const getRemediation = (id: number) => controlState[id]?.remediation || '';
  const updateMaturity = (id: number, lvl: number) => setControlState(p => ({ ...p, [id]: { ...p[id], maturity: lvl } }));
  const updateRemediation = (id: number, txt: string) => setControlState(p => ({ ...p, [id]: { ...p[id], remediation: txt } }));

  const overallScore = useMemo(() => {
    const total = Object.values(controlState).reduce((a, c) => a + (c.maturity || 0), 0);
    return Math.round((total / (complianceData.length * 5)) * 100);
  }, [controlState]);

  const criticalCount = complianceData.filter(d => d.priority === 'Critical').length;
  const assessedCount = Object.values(controlState).filter(c => (c.maturity || 0) > 0).length;

  const exportCSV = () => {
    const rows = [
      ['ID','Control','Risk Tier','Priority','Maturity','Maturity Label','Notes','Frameworks'].join(','),
      ...complianceData.map(item => {
        const mat = getMaturity(item.id);
        return [item.id, `"${item.concept}"`, item.riskTier, item.priority, mat, maturityLevels[mat].label, `"${getRemediation(item.id).replace(/"/g,'""')}"`, `"${Object.keys(item.mappings).join(', ')}"`].join(',');
      })
    ].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([rows], { type: 'text/csv' }));
    a.download = 'ai-governance-assessment.csv'; a.click();
  };

  const saveProgress = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(controlState, null, 2)], { type: 'application/json' }));
    a.download = 'ai-governance-progress.json'; a.click();
  };

  const downloadNHID = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(NHID_MANIFEST, null, 2)], { type: 'application/json' }));
    a.download = 'nhid-clinical-controls.json'; a.click();
  };

  const clearAll = () => { if (confirm('Clear all scores and notes?')) { setControlState({}); setUserControls([]); setUploadedFile(null); } };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { try { setUserControls(JSON.parse(ev.target?.result as string)); setUploadedFile(file.name); } catch { alert('Invalid JSON'); } };
    reader.readAsText(file);
  };

  const gapAnalysis = useMemo(() => {
    if (!userControls.length) return null;
    const implemented = userControls.map((c: any) => (c.concept || '').toLowerCase());
    const gaps = complianceData.filter(item => !implemented.includes(item.concept.toLowerCase()));
    return { coverage: ((complianceData.length - gaps.length) / complianceData.length * 100).toFixed(0), implemented: complianceData.length - gaps.length, gaps, criticalGaps: gaps.filter(g => g.priority === 'Critical') };
  }, [userControls]);

  const filteredData = useMemo(() => complianceData.filter(item => {
    const s = searchTerm.toLowerCase();
    const matchSearch = !s || item.concept.toLowerCase().includes(s) || item.description.toLowerCase().includes(s) || Object.keys(item.mappings).some(fw => fw.toLowerCase().includes(s));
    const matchFw = selectedFrameworks.includes('all') || selectedFrameworks.every(fw => item.mappings[fw as keyof typeof item.mappings]);
    const matchTier = selectedTier === 'All' || item.riskTier === selectedTier;
    return matchSearch && matchFw && matchTier;
  }), [searchTerm, selectedFrameworks, selectedTier]);

  const toggleRow = (id: number) => { const s = new Set(expandedRows); s.has(id) ? s.delete(id) : s.add(id); setExpandedRows(s); };

  return (
    <>
      <style>{FONTS}</style>
      <div className="app-wrapper">

        <header className="header">
          <div className="header-inner">
            <div className="header-brand">
              <span className="header-title">AI Governance Map</span>
              <span className="header-version">v2.3</span>
            </div>
            <nav className="header-nav">
              {[{id:'map',icon:Shield,label:'Controls'},{id:'network',icon:Network,label:'Matrix'},{id:'gap',icon:BarChart3,label:'Gap Analysis'}].map(tab => (
                <button key={tab.id} className={`nav-btn ${activeTab===tab.id?'active':''}`} onClick={()=>setActiveTab(tab.id)}>
                  <tab.icon />{tab.label}
                </button>
              ))}
            </nav>
            <div className="header-actions">
              <div className="score-pill">
                <Activity size={13}/><span>{overallScore}%</span>
                <div className="score-bar-wrap"><div className="score-bar-fill" style={{width:`${overallScore}%`}}/></div>
              </div>
              <button className="btn-ghost" onClick={exportCSV}><Download /><span>CSV</span></button>
              <button className="btn-ghost" onClick={saveProgress}><Save /><span>Save</span></button>
              <button className="btn-ghost" onClick={clearAll}><RotateCcw /><span>Reset</span></button>
            </div>
          </div>
        </header>

        <main className="main">
          <div className="stats-bar">
            <div className="stat-card"><div className="stat-label">Frameworks</div><div className="stat-value">25</div><div className="stat-sub">Global jurisdictions</div></div>
            <div className="stat-card"><div className="stat-label">Controls</div><div className="stat-value">21</div><div className="stat-sub">CMMI maturity model</div></div>
            <div className="stat-card"><div className="stat-label">Critical</div><div className="stat-value">{criticalCount}</div><div className="stat-sub">High-priority controls</div></div>
            <div className="stat-card"><div className="stat-label">Assessed</div><div className="stat-value">{assessedCount}</div><div className="stat-sub">of {complianceData.length} controls</div></div>
          </div>

          {activeTab === 'map' && (
            <div>
              <div className="search-wrap">
                <Search />
                <input type="text" className="search-input" placeholder="Search controls, frameworks, descriptions..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
              </div>

              <div className="tier-filter-bar">
                <span className="tier-filter-label"><Filter />Tier</span>
                {ALL_TIERS.map(tier => (
                  <button key={tier} onClick={()=>setSelectedTier(tier)}
                    className={`tier-chip ${selectedTier===tier?'active-chip':''} ${tier==='Autonomous Agents'?'chip-agentic':''} ${tier==='GenAI'?'chip-genai':''} ${tier==='GPAI'?'chip-gpai':''}`}>
                    {tier}
                  </button>
                ))}
              </div>

              {!selectedFrameworks.includes('all') && (
                <div className="filter-notice">
                  <Globe size={13}/><span>Framework: {selectedFrameworks.join(' + ')}</span>
                  <button onClick={()=>setSelectedFrameworks(['all'])}>Clear</button>
                </div>
              )}

              <div className="controls-list">
                {filteredData.length === 0 && <div className="empty-state">No controls match your current filters.</div>}
                {filteredData.map(item => {
                  const mat = getMaturity(item.id);
                  const isOpen = expandedRows.has(item.id);
                  return (
                    <div key={item.id} className={`control-card ${isOpen?'expanded':''}`}>
                      <div className="control-header" onClick={()=>toggleRow(item.id)}>
                        <div className={`priority-stripe ${priorityStripe(item.priority)}`}/>
                        <div className="control-meta">
                          <div className="control-name">
                            {item.concept}
                            <span className={tierBadge(item.riskTier)}>{item.riskTier}</span>
                            <span className={priorityBadge(item.priority)}>{item.priority}</span>
                            {mat>0&&<span className="badge badge-maturity">L{mat} · {maturityLevels[mat].label}</span>}
                          </div>
                          <div className="control-desc">{item.description}</div>
                        </div>
                        <ChevronDown size={16} className={`chevron ${isOpen?'open':''}`}/>
                      </div>

                      {isOpen && (
                        <div className="control-body">
                          <div>
                            <div className="section-label"><TrendingUp/>Maturity Level</div>
                            <div className="maturity-scale">
                              {maturityLevels.map(lvl => (
                                <button key={lvl.level} className={`mat-btn ${mat===lvl.level?'active-mat':''}`} onClick={()=>updateMaturity(item.id,lvl.level)}>
                                  <span className="mat-num">{lvl.level}</span>
                                  <span className="mat-name">{lvl.label}</span>
                                </button>
                              ))}
                            </div>
                            <div className="section-label"><FileText/>Evidence / Notes</div>
                            <textarea className="remediation-area" placeholder="Log evidence, Jira links, pen test reports..." value={getRemediation(item.id)} onChange={e=>updateRemediation(item.id,e.target.value)}/>
                          </div>
                          <div>
                            <div className="section-label"><Globe/>Framework Mappings</div>
                            <div className="mappings-grid">
                              {Object.entries(item.mappings).map(([fw, codes]) => {
                                const url = CITATIONS[fw];
                                return url ? (
                                  <a key={fw} href={url} target="_blank" rel="noopener noreferrer" className="mapping-tag" title={`Open ${fw} source`}>
                                    {fw}: {(codes as string[]).join(', ')}
                                    <ExternalLink className="ext-icon"/>
                                  </a>
                                ) : (
                                  <span key={fw} className="mapping-tag" onClick={()=>setSelectedFrameworks([fw])} title={`Filter by ${fw}`}>
                                    {fw}: {(codes as string[]).join(', ')}
                                  </span>
                                );
                              })}
                            </div>
                            <div className="section-label" style={{marginTop:'1rem'}}><Shield/>Implementation Guidance</div>
                            <div className="implementation-block">{item.implementation}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'network' && (
            <div className="matrix-container">
              <div className="matrix-header-section">
                <div className="matrix-title">Framework Overlap Matrix</div>
                <div className="matrix-subtitle">Click any cell to filter controls satisfying both frameworks simultaneously</div>
              </div>
              <div className="matrix-scroll">
                <table className="matrix-table">
                  <thead>
                    <tr>
                      <th style={{width:140}}></th>
                      {frameworks.slice(0,12).map(fw=><th key={fw}>{fw}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {frameworks.slice(0,12).map((fw1,i)=>(
                      <tr key={fw1}>
                        <td>{fw1}</td>
                        {frameworks.slice(0,12).map((fw2,j)=>{
                          const overlap = complianceData.filter(d=>d.mappings[fw1 as keyof typeof d.mappings]&&d.mappings[fw2 as keyof typeof d.mappings]).length;
                          const isSelf = i===j;
                          return (
                            <td key={j} className="matrix-cell">
                              <button disabled={isSelf} onClick={()=>{if(!isSelf){setSelectedFrameworks([fw1,fw2]);setActiveTab('map');}}}
                                className={`matrix-cell-btn ${isSelf?'matrix-cell-self':overlap>0?'matrix-cell-value':'matrix-cell-zero'}`}>
                                {isSelf?'—':overlap||'·'}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'gap' && (
            <div>
              <div className="upload-zone">
                <div className="upload-icon"><Upload size={20}/></div>
                <div className="upload-title">Gap Analysis</div>
                <div className="upload-desc">Upload your controls manifest — or start with the NHID-Clinical healthcare template</div>
                <div className="upload-actions">
                  <label>
                    <span className="btn-primary"><Upload size={14}/>Upload JSON</span>
                    <input type="file" accept=".json" onChange={handleFileUpload} style={{display:'none'}}/>
                  </label>
                  <button className="btn-secondary" onClick={downloadNHID}>
                    <Download size={14}/>NHID-Clinical Starter
                  </button>
                </div>
                {uploadedFile && <div className="upload-success"><CheckCircle size={14}/>{uploadedFile}</div>}
                {!uploadedFile && <div style={{marginTop:'0.75rem',fontSize:'0.7rem',color:'var(--ink-3)',fontFamily:'var(--font-mono)'}}>Format: [{"{ "}"concept": "Control Name"{"}" }]</div>}
              </div>

              {gapAnalysis && (
                <>
                  <div className="gap-stats">
                    <div className="gap-stat"><div className="gap-stat-label">Coverage</div><div className="gap-stat-value">{gapAnalysis.coverage}%</div><div className="gap-stat-sub">{gapAnalysis.implemented} of {complianceData.length} controls</div></div>
                    <div className="gap-stat critical"><div className="gap-stat-label">Critical Gaps</div><div className="gap-stat-value">{gapAnalysis.criticalGaps.length}</div><div className="gap-stat-sub">Immediate action required</div></div>
                    <div className="gap-stat"><div className="gap-stat-label">Total Gaps</div><div className="gap-stat-value">{gapAnalysis.gaps.length}</div><div className="gap-stat-sub">Controls to implement</div></div>
                  </div>
                  {gapAnalysis.gaps.length > 0 && (
                    <>
                      <div className="gap-list-title">Missing Controls</div>
                      {gapAnalysis.gaps.map(gap=>(
                        <div key={gap.id} className="gap-item">
                          <ArrowRight size={14} className="gap-arrow"/>
                          <div>
                            <div className="gap-item-name">
                              {gap.concept}
                              <span className={priorityBadge(gap.priority)}>{gap.priority}</span>
                              <span className={tierBadge(gap.riskTier)}>{gap.riskTier}</span>
                            </div>
                            <div className="gap-item-desc">{gap.description}</div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          )}

        </main>
      </div>
    </>
  );
};

export default AIGovernancePlatform;
