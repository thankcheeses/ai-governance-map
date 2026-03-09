import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, CheckCircle, Shield, Activity, TrendingUp, FileText, Globe, Network, BarChart3, Upload, Save, RotateCcw, AlertTriangle, ArrowRight } from 'lucide-react';

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
  --amber: #92400E;
  --amber-light: #FFFBEB;
  --font-display: 'DM Serif Display', serif;
  --font-mono: 'IBM Plex Mono', monospace;
  --font-body: 'DM Sans', sans-serif;
}

body { background: var(--bg); color: var(--ink); font-family: var(--font-body); }

.app-wrapper {
  min-height: 100vh;
  background: var(--bg);
}

/* HEADER */
.header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  gap: 2rem;
}
.header-brand {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
}
.header-title {
  font-family: var(--font-display);
  font-size: 1.375rem;
  color: var(--ink);
  letter-spacing: -0.01em;
}
.header-version {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--ink-3);
  background: var(--surface-2);
  border: 1px solid var(--border);
  padding: 2px 6px;
  border-radius: 3px;
}
.header-nav {
  display: flex;
  gap: 0;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--surface-2);
}
.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.125rem;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--ink-2);
  background: transparent;
  border: none;
  border-right: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}
.nav-btn:last-child { border-right: none; }
.nav-btn:hover { background: var(--surface); color: var(--ink); }
.nav-btn.active {
  background: var(--accent);
  color: #fff;
}
.nav-btn svg { width: 14px; height: 14px; }

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}
.btn-ghost {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4rem 0.875rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--ink-2);
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  font-family: var(--font-body);
}
.btn-ghost:hover { background: var(--surface); color: var(--ink); }
.btn-ghost svg { width: 13px; height: 13px; }

.score-pill {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.4rem 1rem;
  background: var(--accent-light);
  border: 1px solid #C2DCCA;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--accent);
  font-weight: 500;
}
.score-bar-wrap {
  width: 60px;
  height: 4px;
  background: #C2DCCA;
  border-radius: 2px;
  overflow: hidden;
}
.score-bar-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: width 0.5s ease;
}

/* MAIN */
.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* STATS BAR */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}
.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1.125rem 1.375rem;
}
.stat-label {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 0.375rem;
  font-family: var(--font-body);
}
.stat-value {
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--ink);
  line-height: 1;
}
.stat-sub {
  font-size: 0.75rem;
  color: var(--ink-3);
  margin-top: 0.25rem;
}

/* SEARCH */
.search-wrap {
  position: relative;
  margin-bottom: 1.25rem;
}
.search-wrap svg {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--ink-3);
  width: 16px;
  height: 16px;
}
.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--ink);
  outline: none;
  transition: border 0.15s;
}
.search-input:focus { border-color: var(--accent-mid); }
.search-input::placeholder { color: var(--ink-3); }

/* FILTER NOTICE */
.filter-notice {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: var(--accent-light);
  border: 1px solid #C2DCCA;
  border-radius: 7px;
  margin-bottom: 1.25rem;
  font-size: 0.8125rem;
  color: var(--accent);
}
.filter-notice button {
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--accent);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  font-family: var(--font-body);
}

/* CONTROL CARDS */
.controls-list { display: flex; flex-direction: column; gap: 0.5rem; }

.control-card {
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.control-card:hover { border-color: var(--border); }
.control-card.expanded {
  border-color: var(--border);
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}

.control-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  cursor: pointer;
}
.priority-stripe {
  width: 3px;
  height: 36px;
  border-radius: 2px;
  flex-shrink: 0;
}
.stripe-critical { background: var(--red); }
.stripe-high { background: var(--gold); }
.stripe-medium { background: var(--ink-3); }

.control-meta { flex: 1; min-width: 0; }
.control-name {
  font-weight: 600;
  font-size: 0.9375rem;
  color: var(--ink);
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.control-desc {
  font-size: 0.8125rem;
  color: var(--ink-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.badge {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  padding: 2px 7px;
  border-radius: 4px;
  font-weight: 500;
}
.badge-tier {
  background: var(--surface-2);
  color: var(--ink-2);
  border: 1px solid var(--border);
}
.badge-critical {
  background: var(--red-light);
  color: var(--red);
  border: 1px solid #FCA5A5;
}
.badge-high {
  background: var(--gold-light);
  color: var(--gold);
  border: 1px solid #FCD34D;
}
.badge-medium {
  background: var(--surface-2);
  color: var(--ink-2);
  border: 1px solid var(--border);
}
.badge-maturity {
  background: var(--accent-light);
  color: var(--accent);
  border: 1px solid #C2DCCA;
}

.chevron {
  color: var(--ink-3);
  transition: transform 0.2s;
  flex-shrink: 0;
}
.chevron.open { transform: rotate(180deg); }

/* EXPANDED CONTENT */
.control-body {
  border-top: 1px solid var(--border-light);
  padding: 1.5rem 1.25rem;
  background: var(--bg);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
@media (max-width: 768px) {
  .control-body { grid-template-columns: 1fr; }
  .stats-bar { grid-template-columns: repeat(2, 1fr); }
  .header-nav { display: none; }
}

.section-label {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}
.section-label svg { width: 12px; height: 12px; }

/* MATURITY SCALE */
.maturity-scale {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.375rem;
  margin-bottom: 1.25rem;
}
.mat-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 0.25rem;
  border-radius: 6px;
  border: 1px solid var(--border);
  cursor: pointer;
  background: var(--surface);
  transition: all 0.15s;
  font-family: var(--font-body);
}
.mat-btn:hover { border-color: var(--accent-mid); }
.mat-btn.active-mat {
  background: var(--accent);
  border-color: var(--accent);
}
.mat-num {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--ink-2);
  line-height: 1;
}
.mat-btn.active-mat .mat-num { color: #fff; }
.mat-name {
  font-size: 0.55rem;
  color: var(--ink-3);
  margin-top: 2px;
  text-align: center;
  line-height: 1.2;
}
.mat-btn.active-mat .mat-name { color: rgba(255,255,255,0.75); }

.remediation-area {
  width: 100%;
  padding: 0.75rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 7px;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--ink);
  resize: vertical;
  min-height: 80px;
  outline: none;
  transition: border 0.15s;
}
.remediation-area:focus { border-color: var(--accent-mid); }
.remediation-area::placeholder { color: var(--ink-3); }

/* MAPPINGS */
.mappings-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 1rem;
}
.mapping-tag {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  padding: 3px 8px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--ink-2);
  cursor: pointer;
  transition: all 0.12s;
}
.mapping-tag:hover {
  background: var(--accent-light);
  border-color: var(--accent-mid);
  color: var(--accent);
}

.implementation-block {
  padding: 0.75rem 1rem;
  background: var(--surface);
  border-left: 3px solid var(--accent-mid);
  border-radius: 0 6px 6px 0;
  font-size: 0.8125rem;
  color: var(--ink-2);
  line-height: 1.5;
}

/* MATRIX TAB */
.matrix-container {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}
.matrix-header-section {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-light);
}
.matrix-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--ink);
  margin-bottom: 0.25rem;
}
.matrix-subtitle { font-size: 0.8125rem; color: var(--ink-3); }
.matrix-scroll { overflow-x: auto; padding: 1.5rem; }
.matrix-table { border-collapse: collapse; }
.matrix-table th {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 500;
  color: var(--ink-3);
  text-align: center;
  padding: 0 0.375rem 0.75rem;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  height: 80px;
  min-width: 44px;
  vertical-align: bottom;
}
.matrix-table td:first-child {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--ink-2);
  text-align: right;
  padding-right: 1rem;
  white-space: nowrap;
}
.matrix-cell {
  width: 44px;
  height: 36px;
  text-align: center;
  padding: 2px;
}
.matrix-cell-btn {
  width: 40px;
  height: 32px;
  border-radius: 5px;
  border: 1px solid var(--border-light);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.matrix-cell-self {
  background: var(--bg);
  color: var(--ink-3);
  cursor: default;
  border-color: transparent;
}
.matrix-cell-value {
  background: var(--accent-light);
  color: var(--accent);
  border-color: #C2DCCA;
}
.matrix-cell-value:hover {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
  transform: scale(1.05);
}
.matrix-cell-zero {
  background: var(--surface-2);
  color: var(--ink-3);
  border-color: transparent;
}

/* GAP TAB */
.upload-zone {
  background: var(--surface);
  border: 2px dashed var(--border);
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  transition: border-color 0.15s;
}
.upload-zone:hover { border-color: var(--accent-mid); }
.upload-icon {
  width: 44px;
  height: 44px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: var(--ink-3);
}
.upload-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--ink);
  margin-bottom: 0.5rem;
}
.upload-desc { font-size: 0.8125rem; color: var(--ink-3); margin-bottom: 1.25rem; }
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.375rem;
  background: var(--accent);
  color: #fff;
  border-radius: 7px;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background 0.15s;
}
.btn-primary:hover { background: #142E22; }
.upload-success {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.875rem;
  font-size: 0.8125rem;
  color: var(--accent-mid);
}

.gap-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.gap-stat {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1.25rem 1.375rem;
}
.gap-stat-label { font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 0.375rem; }
.gap-stat-value { font-family: var(--font-display); font-size: 2.25rem; color: var(--ink); line-height: 1; }
.gap-stat-sub { font-size: 0.75rem; color: var(--ink-3); margin-top: 0.25rem; }
.gap-stat.critical { border-color: #FCA5A5; background: var(--red-light); }
.gap-stat.critical .gap-stat-label { color: var(--red); }

.gap-list-title {
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--ink);
  margin-bottom: 1rem;
}
.gap-item {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1rem 1.125rem;
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: border-color 0.12s;
}
.gap-item:hover { border-color: var(--border); }
.gap-arrow { color: var(--ink-3); flex-shrink: 0; margin-top: 2px; }
.gap-item-name { font-weight: 600; font-size: 0.875rem; color: var(--ink); margin-bottom: 0.2rem; }
.gap-item-desc { font-size: 0.8rem; color: var(--ink-2); }
`;

const maturityLevels = [
  { level: 0, label: 'None' },
  { level: 1, label: 'Initial' },
  { level: 2, label: 'Managed' },
  { level: 3, label: 'Defined' },
  { level: 4, label: 'Measured' },
  { level: 5, label: 'Optimized' },
];

const frameworks = ['NIST AI RMF','ISO/IEC 42001','EU AI Act','OECD AI','Canada AIDA','Singapore','US Banking','OWASP LLM','GDPR','NIST CSF','SOC 2','FedRAMP','UK AI','IEEE 7000','Brazil LGPD','China PIPL','Japan AI','Australia AI','NYC Law 144','Colorado AI'];

const complianceData = [
  { id: 1, concept: "Risk Management System", riskTier: "High-Risk", priority: "Critical", description: "Systematic approach to identify, assess, and mitigate AI-related risks.", mappings: { "NIST AI RMF": ["MAP 1.1"], "ISO/IEC 42001": ["8.2"], "EU AI Act": ["Art 9"], "OECD AI": ["1.4"], "Singapore": ["Gov"], "NIST CSF": ["GOV-04"], "SOC 2": ["CC3.1"], "UK AI": ["RA"], "FedRAMP": ["RA-3"] }, implementation: "Maintain living AI Risk Register with quarterly reviews." },
  { id: 2, concept: "Human Oversight", riskTier: "High-Risk", priority: "Critical", description: "Mechanisms ensuring human intervention over AI decisions.", mappings: { "NIST AI RMF": ["GOV 2.2"], "EU AI Act": ["Art 14"], "Canada AIDA": ["Sec 12"], "Singapore": ["HITL"], "UK AI": ["Oversight"], "NYC Law 144": ["Review"], "Colorado AI": ["Human"] }, implementation: "Establish oversight committee with intervention triggers." },
  { id: 3, concept: "Model Inventory", riskTier: "All Systems", priority: "High", description: "Centralized inventory of all AI models.", mappings: { "US Banking": ["Inventory"], "ISO/IEC 42001": ["6.1.3"], "EU AI Act": ["Art 49"], "FedRAMP": ["CM-8"], "SOC 2": ["CC8.1"] }, implementation: "Maintain centralized GRC registry of models." },
  { id: 4, concept: "Data Governance", riskTier: "All Systems", priority: "High", description: "Controls for data quality and lineage.", mappings: { "ISO/IEC 42001": ["A.7"], "EU AI Act": ["Art 10"], "OECD AI": ["1.2"], "NIST AI RMF": ["MAP 2.2"], "Brazil LGPD": ["Art 6"], "China PIPL": ["Art 19"], "GDPR": ["Art 5"] }, implementation: "Encrypt data at rest and in transit." },
  { id: 5, concept: "Model Validation", riskTier: "High-Risk", priority: "Critical", description: "Independent validation by a separate team.", mappings: { "US Banking": ["Validation"], "NIST AI RMF": ["MEAS 2.6"], "SOC 2": ["CC5.2"] }, implementation: "Second line validates models pre-deployment." },
  { id: 6, concept: "Privacy Assessment", riskTier: "All Systems", priority: "Critical", description: "GDPR-compliant privacy impact assessments.", mappings: { "GDPR": ["Art 35"], "ISO/IEC 42001": ["A.7"], "Canada AIDA": ["Anon"], "Brazil LGPD": ["Art 38"], "China PIPL": ["Art 55"], "FedRAMP": ["AR-2"] }, implementation: "Conduct DPIA before processing personal data." },
  { id: 7, concept: "Explainability", riskTier: "High-Risk", priority: "High", description: "Explain AI decisions to stakeholders.", mappings: { "EU AI Act": ["Art 13"], "NIST AI RMF": ["GOV 3.1"], "OECD AI": ["1.3"], "Singapore": ["Ops"], "NYC Law 144": ["Notice"], "IEEE 7000": ["Trans"], "Japan AI": ["Trans"] }, implementation: "Provide SHAP/LIME explanations for all high-risk outputs." },
  { id: 8, concept: "Data Drift Detection", riskTier: "High-Risk", priority: "Critical", description: "Monitor input distribution shifts in production.", mappings: { "NIST AI RMF": ["MEAS 2.7"], "ISO/IEC 42001": ["A.9.2"], "US Banking": ["Monitor"], "SOC 2": ["CC7.2"] }, implementation: "Alert when distribution diverges >5% from baseline." },
  { id: 9, concept: "Model Versioning", riskTier: "High-Risk", priority: "High", description: "Maintain immutable version history for rollback.", mappings: { "ISO/IEC 42001": ["A.9.3"], "NIST AI RMF": ["MAN 3.3"], "FedRAMP": ["CM-2"], "SOC 2": ["CC8.1"] }, implementation: "Immutable version history with signed artifacts." },
  { id: 10, concept: "Adversarial Testing", riskTier: "High-Risk", priority: "Critical", description: "Red-team testing against prompt injection and jailbreaks.", mappings: { "OWASP LLM": ["LLM01"], "NIST AI RMF": ["MEAS 2.5"], "Canada AIDA": ["Harm"], "NIST CSF": ["DET-01"] }, implementation: "Quarterly red-team exercises with documented findings." },
  { id: 11, concept: "Bias Testing", riskTier: "High-Risk", priority: "Critical", description: "Test for algorithmic bias across protected classes.", mappings: { "NIST AI RMF": ["MEAS 2.3"], "EU AI Act": ["Art 10(2)"], "Canada AIDA": ["Bias"], "OECD AI": ["1.2"], "NYC Law 144": ["Audit"], "Colorado AI": ["Discrim"], "IEEE 7000": ["Fair"] }, implementation: "Quarterly bias testing with external auditor sign-off." },
  { id: 12, concept: "Secure Weights", riskTier: "Critical", priority: "Critical", description: "Prevent model theft and unauthorized weight access.", mappings: { "OWASP LLM": ["LLM10"], "ISO/IEC 42001": ["A.13"], "NIST CSF": ["PROT-13"], "FedRAMP": ["SC-28"] }, implementation: "Store model weights in HSM with access logging." },
  { id: 13, concept: "Copyright Compliance", riskTier: "GenAI", priority: "High", description: "Respect IP laws in training data and generated output.", mappings: { "EU AI Act": ["Art 53"], "ISO/IEC 42001": ["A.5"], "UK AI": ["Copyright"] }, implementation: "Maintain IP ledger and training data provenance records." },
  { id: 14, concept: "Contestability", riskTier: "High-Risk", priority: "Medium", description: "Enable users to challenge automated decisions.", mappings: { "GDPR": ["Art 22"], "Canada AIDA": ["Lang"], "Singapore": ["Cust"], "Brazil LGPD": ["Art 20"], "Australia AI": ["Contest"] }, implementation: "Human appeal workflow with <48hr SLA." },
  { id: 15, concept: "Environmental Impact", riskTier: "All Systems", priority: "Medium", description: "Monitor and report AI compute carbon footprint.", mappings: { "EU AI Act": ["Art 40"], "OECD AI": ["1.1"], "IEEE 7000": ["Sustain"] }, implementation: "Log compute hours and report quarterly." },
  { id: 16, concept: "Vendor Risk", riskTier: "All Systems", priority: "High", description: "Third-party AI provider oversight and due diligence.", mappings: { "NIST AI RMF": ["MAP 1.5"], "US Banking": ["Vendor"], "ISO/IEC 42001": ["8.4"], "SOC 2": ["CC9.2"], "FedRAMP": ["SA-9"], "OWASP LLM": ["LLM05"] }, implementation: "Annual risk assessment for all 3rd-party AI providers." }
];

const priorityStripe = (p: string) => {
  if (p === 'Critical') return 'stripe-critical';
  if (p === 'High') return 'stripe-high';
  return 'stripe-medium';
};
const priorityBadge = (p: string) => {
  if (p === 'Critical') return 'badge badge-critical';
  if (p === 'High') return 'badge badge-high';
  return 'badge badge-medium';
};

const AIGovernancePlatform = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFrameworks, setSelectedFrameworks] = useState(['all']);
  const [expandedRows, setExpandedRows] = useState(new Set<number>());
  const [controlState, setControlState] = useState<Record<number, { maturity?: number; remediation?: string }>>({});
  const [userControls, setUserControls] = useState<any[]>([]);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const getMaturity = (id: number) => controlState[id]?.maturity || 0;
  const getRemediation = (id: number) => controlState[id]?.remediation || '';
  const updateMaturity = (id: number, level: number) =>
    setControlState(prev => ({ ...prev, [id]: { ...prev[id], maturity: level } }));
  const updateRemediation = (id: number, text: string) =>
    setControlState(prev => ({ ...prev, [id]: { ...prev[id], remediation: text } }));

  const overallScore = useMemo(() => {
    const total = Object.values(controlState).reduce((acc, curr) => acc + (curr.maturity || 0), 0);
    return Math.round((total / (complianceData.length * 5)) * 100);
  }, [controlState]);

  const criticalCount = complianceData.filter(d => d.priority === 'Critical').length;
  const assessedCount = Object.values(controlState).filter(c => (c.maturity || 0) > 0).length;

  const saveProgress = () => {
    const blob = new Blob([JSON.stringify(controlState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'ai-governance-progress.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    if (confirm('Clear all scores and notes?')) { setControlState({}); setUserControls([]); setUploadedFile(null); }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try { setUserControls(JSON.parse(ev.target?.result as string)); setUploadedFile(file.name); }
      catch { alert('Invalid JSON file'); }
    };
    reader.readAsText(file);
  };

  const gapAnalysis = useMemo(() => {
    if (!userControls.length) return null;
    const implemented = userControls.map((c: any) => (c.concept || '').toLowerCase());
    const gaps = complianceData.filter(item => !implemented.includes(item.concept.toLowerCase()));
    return {
      coverage: ((complianceData.length - gaps.length) / complianceData.length * 100).toFixed(0),
      implemented: complianceData.length - gaps.length,
      gaps,
      criticalGaps: gaps.filter(g => g.priority === 'Critical')
    };
  }, [userControls]);

  const filteredData = useMemo(() => complianceData.filter(item => {
    const matchesSearch = !searchTerm || item.concept.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFramework = selectedFrameworks.includes('all') || selectedFrameworks.every(fw => item.mappings[fw as keyof typeof item.mappings]);
    return matchesSearch && matchesFramework;
  }), [searchTerm, selectedFrameworks]);

  const toggleRow = (id: number) => {
    const s = new Set(expandedRows);
    s.has(id) ? s.delete(id) : s.add(id);
    setExpandedRows(s);
  };

  return (
    <>
      <style>{FONTS}</style>
      <div className="app-wrapper">

        {/* HEADER */}
        <header className="header">
          <div className="header-inner">
            <div className="header-brand">
              <span className="header-title">AI Governance Map</span>
              <span className="header-version">v2.1</span>
            </div>

            <nav className="header-nav">
              {[
                { id: 'map', icon: Shield, label: 'Controls' },
                { id: 'network', icon: Network, label: 'Matrix' },
                { id: 'gap', icon: BarChart3, label: 'Gap Analysis' },
              ].map(tab => (
                <button key={tab.id} className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                  <tab.icon /> {tab.label}
                </button>
              ))}
            </nav>

            <div className="header-actions">
              <div className="score-pill">
                <Activity size={13} />
                <span>{overallScore}%</span>
                <div className="score-bar-wrap">
                  <div className="score-bar-fill" style={{ width: `${overallScore}%` }} />
                </div>
              </div>
              <button className="btn-ghost" onClick={saveProgress}><Save />Save</button>
              <button className="btn-ghost" onClick={clearAll}><RotateCcw />Reset</button>
            </div>
          </div>
        </header>

        <main className="main">

          {/* STATS */}
          <div className="stats-bar">
            <div className="stat-card">
              <div className="stat-label">Frameworks</div>
              <div className="stat-value">20</div>
              <div className="stat-sub">Global jurisdictions</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Controls</div>
              <div className="stat-value">16</div>
              <div className="stat-sub">CMMI maturity model</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Critical</div>
              <div className="stat-value">{criticalCount}</div>
              <div className="stat-sub">High-priority controls</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Assessed</div>
              <div className="stat-value">{assessedCount}</div>
              <div className="stat-sub">of {complianceData.length} controls</div>
            </div>
          </div>

          {/* CONTROLS TAB */}
          {activeTab === 'map' && (
            <div>
              <div className="search-wrap">
                <Search />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search controls, frameworks, or risk tiers..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              {!selectedFrameworks.includes('all') && (
                <div className="filter-notice">
                  <Globe size={13} />
                  <span>Filtered: {selectedFrameworks.join(' + ')}</span>
                  <button onClick={() => setSelectedFrameworks(['all'])}>Clear filter</button>
                </div>
              )}

              <div className="controls-list">
                {filteredData.map(item => {
                  const mat = getMaturity(item.id);
                  const isOpen = expandedRows.has(item.id);
                  return (
                    <div key={item.id} className={`control-card ${isOpen ? 'expanded' : ''}`}>
                      <div className="control-header" onClick={() => toggleRow(item.id)}>
                        <div className={`priority-stripe ${priorityStripe(item.priority)}`} />
                        <div className="control-meta">
                          <div className="control-name">
                            {item.concept}
                            <span className="badge badge-tier">{item.riskTier}</span>
                            <span className={priorityBadge(item.priority)}>{item.priority}</span>
                            {mat > 0 && <span className="badge badge-maturity">L{mat} · {maturityLevels[mat].label}</span>}
                          </div>
                          <div className="control-desc">{item.description}</div>
                        </div>
                        <ChevronDown size={16} className={`chevron ${isOpen ? 'open' : ''}`} />
                      </div>

                      {isOpen && (
                        <div className="control-body">
                          <div>
                            <div className="section-label"><TrendingUp />Maturity Level</div>
                            <div className="maturity-scale">
                              {maturityLevels.map(lvl => (
                                <button
                                  key={lvl.level}
                                  className={`mat-btn ${mat === lvl.level ? 'active-mat' : ''}`}
                                  onClick={() => updateMaturity(item.id, lvl.level)}
                                >
                                  <span className="mat-num">{lvl.level}</span>
                                  <span className="mat-name">{lvl.label}</span>
                                </button>
                              ))}
                            </div>
                            <div className="section-label"><FileText />Evidence / Notes</div>
                            <textarea
                              className="remediation-area"
                              placeholder="Log evidence, Jira links, pen test reports..."
                              value={getRemediation(item.id)}
                              onChange={e => updateRemediation(item.id, e.target.value)}
                            />
                          </div>
                          <div>
                            <div className="section-label"><Globe />Framework Mappings</div>
                            <div className="mappings-grid">
                              {Object.entries(item.mappings).map(([fw, codes]) => (
                                <span
                                  key={fw}
                                  className="mapping-tag"
                                  onClick={() => { setSelectedFrameworks([fw]); setActiveTab('map'); }}
                                  title={`Filter by ${fw}`}
                                >
                                  {fw}: {(codes as string[]).join(', ')}
                                </span>
                              ))}
                            </div>
                            <div className="section-label" style={{ marginTop: '1rem' }}><Shield />Implementation Guidance</div>
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

          {/* MATRIX TAB */}
          {activeTab === 'network' && (
            <div className="matrix-container">
              <div className="matrix-header-section">
                <div className="matrix-title">Framework Overlap Matrix</div>
                <div className="matrix-subtitle">Click a cell to filter controls that satisfy both frameworks simultaneously</div>
              </div>
              <div className="matrix-scroll">
                <table className="matrix-table">
                  <thead>
                    <tr>
                      <th style={{ width: 140 }}></th>
                      {frameworks.slice(0, 10).map(fw => (
                        <th key={fw}>{fw}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {frameworks.slice(0, 10).map((fw1, i) => (
                      <tr key={fw1}>
                        <td>{fw1}</td>
                        {frameworks.slice(0, 10).map((fw2, j) => {
                          const overlap = complianceData.filter(d => d.mappings[fw1 as keyof typeof d.mappings] && d.mappings[fw2 as keyof typeof d.mappings]).length;
                          const isSelf = i === j;
                          return (
                            <td key={j} className="matrix-cell">
                              <button
                                disabled={isSelf}
                                onClick={() => { if (!isSelf) { setSelectedFrameworks([fw1, fw2]); setActiveTab('map'); } }}
                                className={`matrix-cell-btn ${isSelf ? 'matrix-cell-self' : overlap > 0 ? 'matrix-cell-value' : 'matrix-cell-zero'}`}
                              >
                                {isSelf ? '—' : overlap || '·'}
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

          {/* GAP ANALYSIS TAB */}
          {activeTab === 'gap' && (
            <div>
              <div className="upload-zone">
                <div className="upload-icon"><Upload size={20} /></div>
                <div className="upload-title">Gap Analysis</div>
                <div className="upload-desc">Upload a JSON manifest of your current controls to identify coverage gaps</div>
                <label>
                  <span className="btn-primary" style={{ display: 'inline-flex' }}>
                    <Upload size={14} /> Upload JSON
                  </span>
                  <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>
                {uploadedFile && (
                  <div className="upload-success">
                    <CheckCircle size={14} /> {uploadedFile}
                  </div>
                )}
                {!uploadedFile && (
                  <div style={{ marginTop: '0.875rem', fontSize: '0.75rem', color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>
                    Format: [{'{'}  "concept": "Control Name"  {'}'}]
                  </div>
                )}
              </div>

              {gapAnalysis && (
                <>
                  <div className="gap-stats">
                    <div className="gap-stat">
                      <div className="gap-stat-label">Coverage</div>
                      <div className="gap-stat-value">{gapAnalysis.coverage}%</div>
                      <div className="gap-stat-sub">{gapAnalysis.implemented} of {complianceData.length} controls</div>
                    </div>
                    <div className="gap-stat critical">
                      <div className="gap-stat-label">Critical Gaps</div>
                      <div className="gap-stat-value">{gapAnalysis.criticalGaps.length}</div>
                      <div className="gap-stat-sub">Immediate action required</div>
                    </div>
                    <div className="gap-stat">
                      <div className="gap-stat-label">Total Gaps</div>
                      <div className="gap-stat-value">{gapAnalysis.gaps.length}</div>
                      <div className="gap-stat-sub">Controls to implement</div>
                    </div>
                  </div>

                  {gapAnalysis.gaps.length > 0 && (
                    <>
                      <div className="gap-list-title">Missing Controls</div>
                      {gapAnalysis.gaps.map(gap => (
                        <div key={gap.id} className="gap-item">
                          <ArrowRight size={14} className="gap-arrow" />
                          <div>
                            <div className="gap-item-name">
                              {gap.concept}
                              <span className={priorityBadge(gap.priority)} style={{ marginLeft: '0.5rem' }}>{gap.priority}</span>
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
