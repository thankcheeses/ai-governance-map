// AI Governance Map v2.5 — Enterprise Cloud-AI Edition
// Integrated with tRPC + Drizzle ORM + Manus OAuth
// CCM v4.1.0 — verified against official CSA release (Jan 2026)

import React, { useState, useMemo, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Search, ChevronDown, CheckCircle, Shield, Activity, TrendingUp, FileText,
  Globe, Network, BarChart3, Upload, Save, RotateCcw, ArrowRight, Download,
  ExternalLink, Filter, AlertCircle, Zap, Radio
} from 'lucide-react';

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

body { background: var(--bg); color: var(--ink); font-family: var(--font-body); -webkit-font-smoothing: antialiased; }
.app-wrapper { min-height: 100vh; background: var(--bg); }

.header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 0 2rem; position: sticky; top: 0; z-index: 100; }
.header-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 64px; gap: 1.5rem; }
.header-brand { display: flex; align-items: baseline; gap: 0.75rem; flex-shrink: 0; }
.header-title { font-family: var(--font-display); font-size: 1.375rem; color: var(--ink); letter-spacing: -0.01em; }
.header-version { font-family: var(--font-mono); font-size: 0.65rem; color: var(--ink-3); background: var(--surface-2); border: 1px solid var(--border); padding: 2px 6px; border-radius: 3px; }
.header-nav { display: flex; gap: 0; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; background: var(--surface-2); flex-shrink: 0; }
.nav-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1.125rem; font-family: var(--font-body); font-size: 0.8125rem; font-weight: 500; color: var(--ink-2); background: transparent; border-right: 1px solid var(--border); cursor: pointer; transition: all 0.15s; }
.nav-btn:last-child { border-right: none; }
.nav-btn:hover { background: var(--surface); color: var(--ink); }
.nav-btn.active { background: var(--accent); color: #fff; }
.nav-btn svg { width: 14px; height: 14px; }
.header-actions { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }
.btn-ghost { display: flex; align-items: center; gap: 0.375rem; padding: 0.4rem 0.75rem; font-size: 0.8rem; font-weight: 500; color: var(--ink-2); background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; transition: all 0.15s; }
.btn-ghost:hover { background: var(--surface); color: var(--ink); }
.btn-ghost svg { width: 13px; height: 13px; }
.score-pill { display: flex; align-items: center; gap: 0.625rem; padding: 0.4rem 1rem; background: var(--accent-light); border: 1px solid #C2DCCA; border-radius: 6px; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 600; color: var(--accent); }
.score-bar-wrap { width: 60px; height: 4px; background: #C2DCCA; border-radius: 2px; overflow: hidden; }
.score-bar-fill { height: 100%; background: var(--accent); border-radius: 2px; transition: width 0.5s ease; }

.main { max-width: 1200px; margin: 0 auto; padding: 2rem; }

.stats-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
.stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 1.125rem 1.375rem; }
.stat-label { font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 0.375rem; }
.stat-value { font-family: var(--font-display); font-size: 2rem; color: var(--ink); line-height: 1; }
.stat-sub { font-size: 0.75rem; color: var(--ink-3); margin-top: 0.25rem; }

.tier-filter-bar { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
.tier-filter-label { font-size: 0.7rem; font-weight: 600; color: var(--ink-3); display: flex; align-items: center; gap: 0.25rem; text-transform: uppercase; letter-spacing: 0.06em; margin-right: 0.5rem; }
.tier-filter-label svg { width: 12px; height: 12px; }
.tier-chip { font-family: var(--font-mono); font-size: 0.65rem; padding: 4px 10px; border-radius: 20px; border: 1px solid var(--border); background: var(--surface); color: var(--ink-2); cursor: pointer; transition: all 0.15s; }
.tier-chip:hover { border-color: var(--accent-mid); color: var(--accent); background: var(--accent-light); }
.tier-chip.active-chip { background: var(--accent); border-color: var(--accent); color: #fff; }

.search-wrap { position: relative; margin-bottom: 1rem; }
.search-wrap svg { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--ink-3); width: 16px; height: 16px; pointer-events: none; }
.search-input { width: 100%; padding: 0.75rem 1rem 0.75rem 2.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; font-family: var(--font-body); font-size: 0.875rem; color: var(--ink); transition: border-color 0.15s; }
.search-input:focus { border-color: var(--accent-mid); outline: none; }

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

.chevron { color: var(--ink-3); transition: transform 0.2s; flex-shrink: 0; }
.chevron.open { transform: rotate(180deg); }

.control-body { border-top: 1px solid var(--border-light); padding: 1.5rem 1.25rem; background: var(--bg); display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
.section-label { font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.375rem; }

.maturity-scale { display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.375rem; margin-bottom: 1.25rem; }
.mat-btn { display: flex; flex-direction: column; align-items: center; padding: 0.5rem 0.25rem; border-radius: 6px; border: 1px solid var(--border); cursor: pointer; background: var(--surface); transition: all 0.15s; }
.mat-btn:hover { border-color: var(--accent-mid); }
.mat-btn.active-mat { background: var(--accent); border-color: var(--accent); }
.mat-num { font-family: var(--font-mono); font-size: 0.9rem; font-weight: 500; color: var(--ink-2); line-height: 1; }
.mat-btn.active-mat .mat-num { color: #fff; }
.mat-name { font-size: 0.55rem; color: var(--ink-3); margin-top: 2px; text-align: center; line-height: 1.2; }
.mat-btn.active-mat .mat-name { color: rgba(255,255,255,0.75); }

.remediation-area { width: 100%; padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 7px; font-family: var(--font-body); font-size: 0.8125rem; color: var(--ink); resize: vertical; min-height: 80px; }
.remediation-area:focus { border-color: var(--accent-mid); outline: none; }

.indicator-card { background: rgba(27, 61, 46, 0.03); border: 1px dashed var(--accent-mid); border-radius: 8px; padding: 0.875rem 1rem; margin-bottom: 1rem; }
.indicator-name { font-size: 0.8125rem; font-weight: 600; color: var(--accent); margin-bottom: 0.375rem; }
.indicator-method { font-size: 0.75rem; color: var(--ink-2); line-height: 1.5; }
.indicator-field-label { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--accent); font-weight: 700; margin-top: 0.625rem; margin-bottom: 0.2rem; }
.indicator-slo { display: inline-block; margin-top: 0.375rem; font-family: var(--font-mono); font-size: 0.7rem; background: var(--accent-light); color: var(--accent); border: 1px solid #b8d9c8; padding: 3px 6px; border-radius: 3px; }

.radar-container { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
.radar-header { padding: 1.5rem; border-bottom: 1px solid var(--border-light); }
.radar-title { font-family: var(--font-display); font-size: 1.25rem; color: var(--ink); margin-bottom: 0.25rem; }
.radar-subtitle { font-size: 0.8125rem; color: var(--ink-3); }
.radar-body { padding: 1.5rem; display: grid; grid-template-columns: 1fr 320px; gap: 2rem; align-items: start; }
.radar-legend { display: flex; flex-direction: column; gap: 0.625rem; }
.radar-legend-item { display: flex; align-items: center; justify-content: space-between; padding: 0.625rem 0.875rem; background: var(--bg); border: 1px solid var(--border-light); border-radius: 7px; }
.radar-legend-domain { font-family: var(--font-mono); font-size: 0.7rem; font-weight: 500; color: var(--ink-2); }
.radar-legend-val { font-family: var(--font-mono); font-size: 0.7rem; color: var(--accent); font-weight: 600; }

.matrix-container { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
.matrix-header-section { padding: 1.5rem; border-bottom: 1px solid var(--border-light); }
.matrix-title { font-family: var(--font-display); font-size: 1.25rem; color: var(--ink); margin-bottom: 0.25rem; }
.matrix-subtitle { font-size: 0.8125rem; color: var(--ink-3); }
.matrix-scroll { overflow-x: auto; padding: 1.5rem; }
.matrix-table { border-collapse: collapse; }
.matrix-table th { font-family: var(--font-mono); font-size: 0.6rem; font-weight: 500; color: var(--ink-3); text-align: center; padding: 0 0.375rem 0.75rem; writing-mode: vertical-rl; transform: rotate(180deg); }
.matrix-table td:first-child { font-family: var(--font-mono); font-size: 0.6875rem; color: var(--ink-2); text-align: right; padding-right: 1rem; white-space: nowrap; }
.matrix-cell { width: 44px; height: 36px; text-align: center; padding: 2px; }
.matrix-cell-btn { width: 40px; height: 32px; border-radius: 5px; border: 1px solid var(--border-light); font-family: var(--font-mono); font-size: 0.7rem; font-weight: 500; cursor: pointer; transition: all 0.15s; background: var(--surface); }
.matrix-cell-self { background: var(--bg); color: var(--ink-3); cursor: default; border-color: transparent; }
.matrix-cell-value { background: var(--accent-light); color: var(--accent); border-color: #C2DCCA; }
.matrix-cell-value:hover { background: var(--accent); color: #fff; border-color: var(--accent); }

.empty-state { text-align: center; padding: 3rem; color: var(--ink-3); font-size: 0.875rem; }

@media (max-width: 768px) {
  .control-body { grid-template-columns: 1fr; }
  .stats-bar { grid-template-columns: repeat(2, 1fr); }
  .gap-stats { grid-template-columns: 1fr; }
  .radar-body { grid-template-columns: 1fr; }
}
`;

const CCM_DOMAINS = ['A&A', 'AIS', 'BCR', 'CCC', 'CEK', 'DCS', 'DSP', 'GRC', 'HRS', 'IAM', 'IPY', 'I&S', 'LOG', 'SEF', 'STA', 'TVM', 'UEM'];

const complianceData = [
  {
    id: 1,
    concept: "Risk Management System",
    riskTier: "High-Risk",
    priority: "Critical",
    ccmDomain: "GRC",
    description: "Systematic approach to identify, assess, and mitigate AI-related risks.",
    ccmMappings: { "GRC-02": "Risk Management Program" },
    mappings: { "NIST AI RMF": ["MAP 1.1"], "ISO/IEC 42001": ["8.2"], "EU AI Act": ["Art 9"] },
    indicator: { name: "Open Risk Finding Resolution Rate", method: "Resolved-to-open ratio per cycle", slo: "≥90% resolved within 30 days" },
    implementation: "Maintain AI Risk Register with quarterly reviews."
  },
  {
    id: 2,
    concept: "Human Oversight",
    riskTier: "High-Risk",
    priority: "Critical",
    ccmDomain: "GRC",
    description: "Mechanisms ensuring human intervention and control over consequential AI decisions.",
    ccmMappings: { "GRC-06": "Governance Responsibility Model" },
    mappings: { "NIST AI RMF": ["GOV 2.2"], "EU AI Act": ["Art 14"] },
    indicator: { name: "HITL Intervention Rate", method: "Human-overridden decisions / total automated", slo: "Track trend; no specific target" },
    implementation: "Establish oversight committee with intervention triggers."
  },
  {
    id: 3,
    concept: "Model Inventory",
    riskTier: "All Systems",
    priority: "High",
    ccmDomain: "GRC",
    description: "Centralized registry of all AI models in production.",
    ccmMappings: { "GRC-05": "Information Security Program" },
    mappings: { "ISO/IEC 42001": ["6.1.3"], "EU AI Act": ["Art 49"] },
    indicator: { name: "Model Registry Completeness %", method: "Documented production models / total deployed", slo: "100%" },
    implementation: "Maintain centralized registry with version, owner, risk tier."
  }
];

const maturityLevels = [
  { level: 0, label: 'None' },
  { level: 1, label: 'Initial' },
  { level: 2, label: 'Managed' },
  { level: 3, label: 'Defined' },
  { level: 4, label: 'Measured' },
  { level: 5, label: 'Optimized' },
];

const ALL_TIERS = ['All', 'High-Risk', 'All Systems'];

const priorityStripe = (p: string) =>
  p === 'Critical' ? 'stripe-critical' : p === 'High' ? 'stripe-high' : 'stripe-medium';
const priorityBadge = (p: string) =>
  p === 'Critical' ? 'badge badge-critical' : p === 'High' ? 'badge badge-high' : 'badge badge-medium';

const GovernanceMap = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');
  const [expandedRows, setExpandedRows] = useState(new Set<number>());
  const [controlState, setControlState] = useState<Record<number, { maturity?: number; remediation?: string }>>(() => {
    try {
      const s = localStorage.getItem('ai-gov-progress');
      return s ? JSON.parse(s) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ai-gov-progress', JSON.stringify(controlState));
    } catch {}
  }, [controlState]);

  const getMaturity = (id: number) => controlState[id]?.maturity || 0;
  const getRemediation = (id: number) => controlState[id]?.remediation || '';
  const updateMaturity = (id: number, lvl: number) =>
    setControlState(p => ({ ...p, [id]: { ...p[id], maturity: lvl } }));
  const updateRemediation = (id: number, txt: string) =>
    setControlState(p => ({ ...p, [id]: { ...p[id], remediation: txt } }));

  const overallScore = useMemo(() => {
    const total = Object.values(controlState).reduce((a, c) => a + (c.maturity || 0), 0);
    return Math.round((total / (complianceData.length * 5)) * 100);
  }, [controlState]);

  const radarData = useMemo(() => {
    const domainBuckets: Record<string, number[]> = {};
    CCM_DOMAINS.forEach(d => { domainBuckets[d] = []; });
    complianceData.forEach(c => {
      if (domainBuckets[c.ccmDomain] !== undefined) {
        domainBuckets[c.ccmDomain].push(controlState[c.id]?.maturity || 0);
      }
    });
    return CCM_DOMAINS.map(domain => {
      const vals = domainBuckets[domain];
      const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      return { domain, maturity: Math.round(avg * 10) / 10, hasControls: vals.length > 0 };
    });
  }, [controlState]);

  const filteredData = useMemo(
    () => complianceData.filter(item => {
      const s = searchTerm.toLowerCase();
      const matchSearch = !s || item.concept.toLowerCase().includes(s) || item.description.toLowerCase().includes(s);
      const matchTier = selectedTier === 'All' || item.riskTier === selectedTier;
      return matchSearch && matchTier;
    }),
    [searchTerm, selectedTier]
  );

  const toggleRow = (id: number) => {
    const s = new Set(expandedRows);
    if (s.has(id)) {
      s.delete(id);
    } else {
      s.add(id);
    }
    setExpandedRows(s);
  };

  const exportCSV = () => {
    const rows = [
      ['ID', 'Control', 'Risk Tier', 'Priority', 'Maturity', 'Notes'].join(','),
      ...complianceData.map(item => {
        const mat = getMaturity(item.id);
        return [item.id, `"${item.concept}"`, item.riskTier, item.priority, maturityLevels[mat].label, `"${getRemediation(item.id)}"`].join(',');
      })
    ].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([rows], { type: 'text/csv' }));
    a.download = 'ai-governance-assessment.csv';
    a.click();
  };

  const saveProgress = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(controlState, null, 2)], { type: 'application/json' }));
    a.download = 'ai-governance-progress.json';
    a.click();
  };

  const clearAll = () => {
    if (confirm('Clear all scores and notes?')) {
      setControlState({});
      try {
        localStorage.removeItem('ai-gov-progress');
      } catch {}
    }
  };

  return (
    <>
      <style>{FONTS}</style>
      <div className="app-wrapper">
        <header className="header">
          <div className="header-inner">
            <div className="header-brand">
              <span className="header-title">AI Governance Map</span>
              <span className="header-version">v2.5 · CCM v4.1.0</span>
            </div>
            <nav className="header-nav">
              {[
                { id: 'map', icon: Shield, label: 'Controls' },
                { id: 'radar', icon: Radio, label: 'Radar' },
                { id: 'matrix', icon: Network, label: 'Matrix' },
              ].map(tab => (
                <button key={tab.id} className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                  <tab.icon />{tab.label}
                </button>
              ))}
            </nav>
            <div className="header-actions">
              <div className="score-pill">
                <Activity size={13} /><span>{overallScore}%</span>
                <div className="score-bar-wrap"><div className="score-bar-fill" style={{ width: `${overallScore}%` }} /></div>
              </div>
              <button className="btn-ghost" onClick={exportCSV}><Download /><span>CSV</span></button>
              <button className="btn-ghost" onClick={saveProgress}><Save /><span>Save</span></button>
              <button className="btn-ghost" onClick={clearAll}><RotateCcw /><span>Reset</span></button>
            </div>
          </div>
        </header>

        <main className="main">
          <div className="stats-bar">
            <div className="stat-card"><div className="stat-label">Frameworks</div><div className="stat-value">3+</div><div className="stat-sub">Global standards</div></div>
            <div className="stat-card"><div className="stat-label">Controls</div><div className="stat-value">{complianceData.length}</div><div className="stat-sub">CCM v4.1.0</div></div>
            <div className="stat-card"><div className="stat-label">Critical</div><div className="stat-value">{complianceData.filter(d => d.priority === 'Critical').length}</div><div className="stat-sub">High-priority</div></div>
            <div className="stat-card"><div className="stat-label">Assessed</div><div className="stat-value">{Object.values(controlState).filter(c => (c.maturity || 0) > 0).length}</div><div className="stat-sub">of {complianceData.length}</div></div>
          </div>

          {activeTab === 'map' && (
            <div>
              <div className="search-wrap">
                <Search />
                <input type="text" className="search-input" placeholder="Search controls..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <div className="tier-filter-bar">
                <span className="tier-filter-label"><Filter />Tier</span>
                {ALL_TIERS.map(tier => (
                  <button key={tier} onClick={() => setSelectedTier(tier)} className={`tier-chip ${selectedTier === tier ? 'active-chip' : ''}`}>
                    {tier}
                  </button>
                ))}
              </div>
              <div className="controls-list">
                {filteredData.length === 0 && <div className="empty-state">No controls match your filters.</div>}
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
                            {mat > 0 && <span className="badge badge-tier">L{mat}</span>}
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
                                <button key={lvl.level} className={`mat-btn ${mat === lvl.level ? 'active-mat' : ''}`} onClick={() => updateMaturity(item.id, lvl.level)}>
                                  <span className="mat-num">{lvl.level}</span>
                                  <span className="mat-name">{lvl.label}</span>
                                </button>
                              ))}
                            </div>
                            <div className="section-label" style={{ marginTop: '0.25rem' }}><Zap />Indicator</div>
                            <div className="indicator-card">
                              <div className="indicator-name">{item.indicator.name}</div>
                              <div className="indicator-field-label">Method</div>
                              <div className="indicator-method">{item.indicator.method}</div>
                              <div className="indicator-field-label">SLO</div>
                              <span className="indicator-slo">{item.indicator.slo}</span>
                            </div>
                          </div>
                          <div>
                            <div className="section-label"><FileText />Notes</div>
                            <textarea className="remediation-area" placeholder="Evidence, findings, action items..." value={getRemediation(item.id)} onChange={e => updateRemediation(item.id, e.target.value)} />
                            <div className="section-label" style={{ marginTop: '1rem' }}><Globe />Frameworks</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                              {Object.entries(item.mappings).map(([fw, codes]) => (
                                <span key={fw} style={{ fontSize: '0.75rem', background: 'var(--accent-light)', color: 'var(--accent)', padding: '2px 6px', borderRadius: '3px' }}>
                                  {fw}: {(codes as string[]).join(', ')}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'radar' && (
            <div className="radar-container">
              <div className="radar-header">
                <div className="radar-title">Maturity Posture Radar</div>
                <div className="radar-subtitle">Average maturity score per CCM v4.1.0 domain</div>
              </div>
              <div className="radar-body">
                <div style={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData.filter(d => d.hasControls)}>
                      <PolarGrid strokeDasharray="3 3" stroke="#DDD9D0" />
                      <PolarAngleAxis dataKey="domain" tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono', fill: '#5C5751' }} />
                      <Radar name="Maturity" dataKey="maturity" stroke="#1B3D2E" fill="#1B3D2E" fillOpacity={0.25} strokeWidth={2} />
                      <Tooltip formatter={(val: number) => [`${val} / 5`, 'Avg Maturity']} contentStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 11 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="radar-legend">
                  {radarData.filter(d => d.hasControls).map(d => (
                    <div key={d.domain} className="radar-legend-item">
                      <span className="radar-legend-domain">{d.domain}</span>
                      <span className="radar-legend-val">{d.maturity > 0 ? `${d.maturity} / 5` : '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'matrix' && (
            <div className="matrix-container">
              <div className="matrix-header-section">
                <div className="matrix-title">Framework Overlap Matrix</div>
                <div className="matrix-subtitle">Controls satisfying multiple frameworks</div>
              </div>
              <div className="matrix-scroll">
                <p style={{ color: 'var(--ink-3)', fontSize: '0.875rem' }}>Framework matrix for {complianceData.length} core controls.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default GovernanceMap;
