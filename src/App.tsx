// AI Governance Map v2 — Enterprise Cloud-AI Edition
// New dep: npm install recharts
// CCM v4.1.0 — verified against CCMv4_1_0-generated_at_2026_01_13.xlsx (CSA official release, Jan 2026)
// AIS-08 (API Security) confirmed new in v4.1 (Nov 2025 upgrade). CAIQ questions AIS-08.1 + AIS-08.2 confirmed.
// NHID-Clinical v2: AUTH-01 cryptographic authorization layer integrated. Layer 3+ enforcement active.

import React, { useState, useMemo, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Search, ChevronDown, CheckCircle, Shield, Activity, TrendingUp, FileText,
  Globe, Network, BarChart3, Upload, Save, RotateCcw, ArrowRight, Download,
  ExternalLink, Filter, AlertCircle, Zap, Radio, BookOpen, Moon, Sun, Printer,
  User, Calendar, Clock
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
.badge-shared { background: #FFFBEB; color: #92400E; border: 1px solid #FEF3C7; }
.badge-csp { background: #EFF6FF; color: #1E40AF; border: 1px solid #DBEAFE; }
.badge-csc { background: #ECFDF5; color: #065F46; border: 1px solid #D1FAE5; }
.indicator-field-label { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--accent); font-weight: 700; margin-top: 0.625rem; margin-bottom: 0.2rem; }
.indicator-slo { display: inline-block; margin-top: 0.375rem; font-family: var(--font-mono); font-size: 0.7rem; background: var(--accent-light); color: var(--accent); border: 1px solid #b8d9c8; padding: 2px 7px; border-radius: 3px; }
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

.indicator-card { background: rgba(27, 61, 46, 0.03); border: 1px dashed var(--accent-mid); border-radius: 8px; padding: 0.875rem 1rem; margin-bottom: 1rem; }
.indicator-name { font-size: 0.8125rem; font-weight: 600; color: var(--accent); margin-bottom: 0.375rem; }
.indicator-method { font-size: 0.75rem; color: var(--ink-2); line-height: 1.5; margin-top: 0.5rem; }

.change-flag { display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 0.875rem; background: #FFFBEB; border: 1px solid #FEF3C7; border-radius: 7px; margin-top: 0.75rem; cursor: pointer; }
.change-flag input { accent-color: var(--gold); cursor: pointer; }
.change-flag label { font-size: 0.75rem; color: #92400E; cursor: pointer; font-weight: 500; }
.change-flag-active { background: #FEF3C7; border-color: #F59E0B; }

.mappings-grid { display: flex; flex-wrap: wrap; gap: 0.375rem; margin-bottom: 1rem; }
.mapping-tag { font-family: var(--font-mono); font-size: 0.6rem; padding: 3px 8px; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; color: var(--ink-2); cursor: pointer; transition: all 0.12s; display: inline-flex; align-items: center; gap: 4px; text-decoration: none; }
.mapping-tag:hover { background: var(--accent-light); border-color: var(--accent-mid); color: var(--accent); }
.mapping-tag .ext-icon { width: 9px; height: 9px; opacity: 0.5; flex-shrink: 0; }
.ccm-tag { font-family: var(--font-mono); font-size: 0.6rem; padding: 3px 8px; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 4px; color: #1E40AF; display: inline-flex; align-items: center; }
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

/* Radar tab */
.radar-container { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
.radar-header { padding: 1.5rem; border-bottom: 1px solid var(--border-light); }
.radar-title { font-family: var(--font-display); font-size: 1.25rem; color: var(--ink); margin-bottom: 0.25rem; }
.radar-subtitle { font-size: 0.8125rem; color: var(--ink-3); }
.radar-body { padding: 1.5rem; display: grid; grid-template-columns: 1fr 320px; gap: 2rem; align-items: start; }
.radar-legend { display: flex; flex-direction: column; gap: 0.625rem; }
.radar-legend-item { display: flex; align-items: center; justify-content: space-between; padding: 0.625rem 0.875rem; background: var(--bg); border: 1px solid var(--border-light); border-radius: 7px; }
.radar-legend-domain { font-family: var(--font-mono); font-size: 0.7rem; font-weight: 500; color: var(--ink-2); }
.radar-legend-val { font-family: var(--font-mono); font-size: 0.7rem; color: var(--accent); font-weight: 600; }
.radar-ccm-note { padding: 0.75rem 1rem; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 7px; font-size: 0.75rem; color: #1E40AF; line-height: 1.5; margin-top: 1rem; }

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
  .desktop-nav { display: none !important; }
  .gap-stats { grid-template-columns: 1fr; }
  .radar-body { grid-template-columns: 1fr; }
  .header-actions .btn-ghost span { display: none; }
  .fw-coverage-grid { grid-template-columns: 1fr; }
  .guide-body { grid-template-columns: 1fr; }
  .owner-due-grid { grid-template-columns: 1fr; }
  .mobile-nav { display: flex !important; }
  .main { padding-bottom: 5rem; }
}

/* ── Card depth ─────────────────────────────────────────────────────────── */
.stat-card { box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04); }
.control-card { box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
.control-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.09) !important; border-color: var(--border) !important; }
.control-card.expanded { box-shadow: 0 4px 20px rgba(0,0,0,0.10) !important; }

/* ── Maturity dots ───────────────────────────────────────────────────────── */
.maturity-dots { display: flex; gap: 3px; align-items: center; margin-right: 0.5rem; flex-shrink: 0; }
.maturity-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--border); transition: background 0.15s; }
.maturity-dot.filled { background: var(--accent-mid); }
.maturity-dot.filled-critical { background: var(--red); }

/* ── Dark mode toggle ────────────────────────────────────────────────────── */
.dark-toggle { display: flex; align-items: center; gap: 0.375rem; padding: 0.4rem 0.625rem; font-size: 0.8rem; color: var(--ink-2); background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; transition: all 0.15s; font-family: var(--font-body); }
.dark-toggle:hover { background: var(--surface); color: var(--ink); }
.dark-toggle svg { width: 13px; height: 13px; }

/* ── Dark mode ───────────────────────────────────────────────────────────── */
.dark { --bg: #0E1117; --surface: #181D2A; --surface-2: #222840; --border: #2C3352; --border-light: #232840; --ink: #E4E2DC; --ink-2: #9BA3B8; --ink-3: #565E78; --accent: #4D9E75; --accent-light: #142A20; --accent-mid: #4D9E75; --gold: #C9972E; --gold-light: #251E0A; --red: #D04040; --red-light: #2A1010; }
.dark .header { background: var(--surface); }
.dark .control-card { box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
.dark .stat-card { box-shadow: 0 1px 3px rgba(0,0,0,0.3); }

/* ── Guide panel ─────────────────────────────────────────────────────────── */
.guide-panel { background: var(--accent-light); border: 1px solid #C2DCCA; border-radius: 10px; margin-bottom: 1.5rem; overflow: hidden; }
.dark .guide-panel { border-color: #2A4A37; }
.guide-header { display: flex; align-items: center; justify-content: space-between; padding: 0.875rem 1.25rem; cursor: pointer; user-select: none; }
.guide-title { font-weight: 600; font-size: 0.875rem; color: var(--accent); display: flex; align-items: center; gap: 0.5rem; }
.guide-title svg { width: 14px; height: 14px; }
.guide-body { padding: 0 1.25rem 1.25rem; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
.guide-step-num { font-family: var(--font-mono); font-size: 0.65rem; color: var(--accent-mid); font-weight: 600; margin-bottom: 0.375rem; letter-spacing: 0.06em; }
.guide-step-title { font-size: 0.8125rem; font-weight: 600; color: var(--ink); margin-bottom: 0.25rem; }
.guide-step-desc { font-size: 0.75rem; color: var(--ink-2); line-height: 1.55; }

/* ── Owner / Due date ────────────────────────────────────────────────────── */
.owner-due-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1rem; margin-bottom: 0.75rem; }
.field-label { font-size: 0.6375rem; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 0.3rem; display: flex; align-items: center; gap: 0.3rem; }
.field-label svg { width: 11px; height: 11px; }
.field-input { width: 100%; padding: 0.5rem 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; font-family: var(--font-body); font-size: 0.8125rem; color: var(--ink); outline: none; transition: border 0.15s; }
.field-input:focus { border-color: var(--accent-mid); }
.field-input-overdue { border-color: #FCA5A5 !important; background: var(--red-light) !important; }
.last-modified { font-family: var(--font-mono); font-size: 0.6rem; color: var(--ink-3); margin-top: 0.375rem; display: flex; align-items: center; gap: 0.3rem; }
.last-modified svg { width: 9px; height: 9px; }

/* ── Framework coverage ──────────────────────────────────────────────────── */
.fw-coverage-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin-top: 1rem; }
.fw-coverage-item { display: flex; align-items: center; gap: 0.625rem; padding: 0.5rem 0.75rem; background: var(--bg); border: 1px solid var(--border-light); border-radius: 7px; }
.fw-coverage-name { font-family: var(--font-mono); font-size: 0.625rem; color: var(--ink-2); flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fw-coverage-bar-wrap { width: 60px; height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; flex-shrink: 0; }
.fw-coverage-bar { height: 100%; border-radius: 2px; }
.fw-coverage-pct { font-family: var(--font-mono); font-size: 0.6rem; font-weight: 600; flex-shrink: 0; width: 26px; text-align: right; }

/* ── Overdue control highlight ───────────────────────────────────────────── */
.card-overdue { border-color: #FCA5A5 !important; }
.overdue-pill { display: inline-flex; align-items: center; gap: 3px; font-family: var(--font-mono); font-size: 0.58rem; padding: 2px 6px; background: var(--red-light); color: var(--red); border: 1px solid #FCA5A5; border-radius: 4px; white-space: nowrap; }

/* ── Mobile nav ──────────────────────────────────────────────────────────── */
.mobile-nav { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: var(--surface); border-top: 1px solid var(--border); z-index: 200; padding: 0.25rem 0; }
.mobile-nav .nav-btn { flex: 1; flex-direction: column; gap: 0.2rem; padding: 0.5rem 0.25rem; font-size: 0.55rem; border-right: none; border-radius: 0; justify-content: center; }
.mobile-nav .nav-btn svg { width: 18px; height: 18px; }

/* ── Radar empty state ───────────────────────────────────────────────────── */
.radar-empty { text-align: center; padding: 3rem 2rem; color: var(--ink-3); }
.radar-empty-icon { width: 52px; height: 52px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1rem; color: var(--ink-3); }
.radar-empty-title { font-family: var(--font-display); font-size: 1.1rem; color: var(--ink); margin-bottom: 0.5rem; }
.radar-empty-desc { font-size: 0.8125rem; color: var(--ink-3); max-width: 320px; margin: 0 auto; line-height: 1.5; }

/* ── Print ───────────────────────────────────────────────────────────────── */
@media print {
  .header-actions, .tier-filter-bar, .search-wrap, .guide-panel, .mobile-nav { display: none !important; }
  .desktop-nav { display: none !important; }
  .control-card { break-inside: avoid; box-shadow: none !important; border: 1px solid #ccc !important; }
  .control-body { display: block !important; }
  .app-wrapper { background: white !important; }
  .main { padding: 1rem !important; }
}
`;

// ─── Citations ────────────────────────────────────────────────────────────────
const CITATIONS: Record<string, string> = {
  'NIST AI RMF':   'https://airc.nist.gov/RMF/1',
  'NIST AI 600-1': 'https://airc.nist.gov/Docs/1',
  'ISO/IEC 42001': 'https://www.iso.org/standard/81230.html',
  'EU AI Act':     'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689',
  'OECD AI':       'https://oecd.ai/en/ai-principles',
  // Canada AIDA (Bill C-27) — LAPSED. Died on order paper Jan 6, 2025 when Parliament prorogued. No replacement enacted as of Mar 2026.
  'Canada AIDA':   'https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/responsible-use-ai/bill-c-27.html',
  // Singapore — Updated to IMDA Model AI Governance Framework for Generative AI (May 2024). Supersedes PDPC 2020 edition.
  'Singapore':     'https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/press-releases/2024/public-consult-model-ai-governance-framework-genai',
  'US Banking':    'https://www.federalreserve.gov/supervisionreg/srletters/sr1107.htm',
  'OCC/Fed/FDIC':  'https://www.occ.gov/news-issuances/news-releases/2023/nr-ia-2023-17.html',
  // OWASP LLM — 2025 edition. Entry numbers partially renumbered vs 2023. Verify LLM05 (now Supply Chain = LLM03), LLM07 (now System Prompt Leakage), LLM10 (now Unbounded Consumption).
  'OWASP LLM':     'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
  'GDPR':          'https://gdpr-info.eu/',
  // NIST CSF — v2.0 released Feb 26, 2024. Major revision from v1.1.
  'NIST CSF':      'https://www.nist.gov/cyberframework',
  'SOC 2':         'https://www.aicpa-cima.com/resources/landing/system-and-organization-controls-soc-suite-of-services',
  'FedRAMP':       'https://www.fedramp.gov/',
  'UK AI':         'https://www.gov.uk/government/publications/ai-regulation-a-pro-innovation-approach',
  'IEEE 7000':     'https://standards.ieee.org/ieee/7000/6781/',
  'Brazil LGPD':   'https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd',
  'China PIPL':    'https://www.newamerica.org/cybersecurity-initiative/digichina/blog/chinas-personal-information-protection-law/',
  // Japan AI — Updated to AI Guidelines for Business v1.1 (Mar 2025) + AI Promotion Act (effective Sep 2025).
  'Japan AI':      'https://www.meti.go.jp/english/policy/mono_info_service/AI/index.html',
  // Australia AI — Updated to Guidance for AI Adoption (GfAA, Oct 2025). Supersedes 2019 AI Ethics Framework.
  'Australia AI':  'https://www.industry.gov.au/publications/guidance-ai-adoption',
  'NYC Law 144':   'https://legistar.council.nyc.gov/LegislationDetail.aspx?ID=4344524',
  'Colorado AI':   'https://leg.colorado.gov/bills/sb26-189',
  'California AI': 'https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202520260SB1000',
  'Texas TRAIGA':  'https://www.nortonrosefulbright.com/en/knowledge/publications/c6c60e0c/the-texas-responsible-ai-governance-act',
  'G7 Hiroshima':  'https://www.g7hiroshima.go.jp/documents/pdf/G7AI_code_of_conduct_en.pdf',
  'EO 14110':      'https://www.whitehouse.gov/briefing-room/presidential-actions/2023/10/30/executive-order-on-the-safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence/',
  'US AI EO 2026': 'https://www.whitehouse.gov/presidential-actions/2026/06/promoting-advanced-artificial-intelligence-innovation-and-security/',
  // CCM v4.1.0 — Source: CCMv4_1_0-generated_at_2026_01_13.xlsx (CSA official, Jan 2026)
  'CSA CCM v4':    'https://cloudsecurityalliance.org/artifacts/cloud-controls-matrix-v4-1',
};

// ─── CCM v4.1.0 Domain Labels (17 domains, verified from CCMv4_1_0-generated_at_2026_01_13.xlsx) ──────────────
// Note: Infrastructure & Virtualization Security domain code is 'I&S' in v4.1 (not 'IVS')
const CCM_DOMAINS = ['A&A','AIS','BCR','CCC','CEK','DCS','DSP','GRC','HRS','IAM','IPY','I&S','LOG','SEF','STA','TVM','UEM'];

// ─── NHID Manifest (v2 — Behavioral + Cryptographic Authorization) ─────────────────
// v1.3 Behavioral Controls (Layer 2) + v2 Cryptographic Authorization (Layer 3)
const NHID_MANIFEST = [
  { concept: "Human Oversight", notes: "NHID-Clinical v2: Turing Boundary — AI must yield to human operator on request (Layer 2 Behavioral)" },
  { concept: "Agentic Action Boundaries", notes: "NHID-Clinical v2: Pre-Data Gate — non-human identity must be disclosed before PHI exchange (Layer 2 Behavioral)" },
  { concept: "Explainability", notes: "NHID-Clinical v2: AI agent must state its purpose and data needs when asked (Layer 2 Behavioral)" },
  { concept: "Privacy Assessment", notes: "NHID-Clinical v2: PHI disclosure controls required for all agentic payer interactions (Layer 2 Behavioral)" },
  { concept: "Vendor Risk", notes: "NHID-Clinical v2: Third-party AI voice agents must meet NHID-Clinical disclosure standards (Layer 2 Behavioral)" },
  { concept: "Data Governance", notes: "NHID-Clinical v2: PHI must not be transmitted before Pre-Data Gate passes (Layer 2 Behavioral)" },
  { concept: "Adversarial Testing", notes: "NHID-Clinical v2: Safe Failover — agent must gracefully transfer to human on failure (Layer 2 Behavioral)" },
  { concept: "Caller Authorization Verification (AUTH-01)", notes: "NHID-Clinical v2: Cryptographic authorization via Ed25519 delegation chain + DPoP nonce binding (Layer 3 Security). Prevents NPI spoofing attacks." },
];

const maturityLevels = [
  { level: 0, label: 'None' }, { level: 1, label: 'Initial' }, { level: 2, label: 'Managed' },
  { level: 3, label: 'Defined' }, { level: 4, label: 'Measured' }, { level: 5, label: 'Optimized' },
];

const ALL_TIERS = ['All', 'High-Risk', 'All Systems', 'GenAI', 'GPAI', 'Autonomous Agents', 'Critical'];
const frameworks = ['NIST AI RMF','NIST AI 600-1','ISO/IEC 42001','EU AI Act','OECD AI','Canada AIDA','Singapore','US Banking','OCC/Fed/FDIC','OWASP LLM','GDPR','NIST CSF','SOC 2','FedRAMP','UK AI','IEEE 7000','Brazil LGPD','China PIPL','Japan AI','Australia AI','NYC Law 144','Colorado AI','California AI','G7 Hiroshima','EO 14110','Texas TRAIGA','US AI EO 2026'];

// ─── Control Data ─────────────────────────────────────────────────────────────
// ccmMappings: verified CCM v4.1.0 control IDs from CCMv4_1_0-generated_at_2026_01_13.xlsx
// ownership: SSRM model per STA domain (Shared/CSP/CSC)
// indicator: Indicator Identity Card per CSA Code of Practice for Implementing and Maintaining Key Metrics (Jan 2026)
// Fields: name (Metric ID/name), method (Expression — formula or measurement rules), slo (SLO Recommendation)
// Note: "Tamper-proof" and "Repeatable & Reliable" are criteria ALL metrics must satisfy (criteria 7 & 8),
// not mutually exclusive type labels. Removed type badge per source document.
// ccmDomain: primary CCM domain for Posture Radar aggregation
const complianceData = [
  {
    id: 1, concept: "Risk Management System", riskTier: "High-Risk", priority: "Critical",
    ccmDomain: "GRC", ownership: "CSC",
    description: "Systematic approach to identify, assess, and mitigate AI-related risks throughout the lifecycle.",
    ccmMappings: { "GRC-02": "Risk Management Program", "A&A-03": "Risk Based Planning Assessment" },
    mappings: { "NIST AI RMF": ["MAP 1.1"], "ISO/IEC 42001": ["8.2"], "EU AI Act": ["Art 9"], "OECD AI": ["1.4"], "Singapore": ["Gov"], "NIST CSF": ["GOV-04"], "SOC 2": ["CC3.1"], "UK AI": ["RA"], "FedRAMP": ["RA-3"], "G7 Hiroshima": ["§3"], "EO 14110": ["§4.1"] },
    indicator: { name: "Open Risk Finding Resolution Rate", method: "Ratio of resolved-to-open risk register items per reporting cycle. Measured via GRC platform export.", slo: "≥90% resolved within SLA" },
    implementation: "Maintain living AI Risk Register with quarterly reviews. Align register schema to ISO 42001 Clause 8.2 for audit-readiness. EU AI Act Annex III (standalone high-risk) compliance deadline extended to Dec 2, 2027 per Digital Omnibus agreement (May 7, 2026)."
  },
  {
    id: 2, concept: "Human Oversight", riskTier: "High-Risk", priority: "Critical",
    ccmDomain: "GRC", ownership: "CSC",
    description: "Mechanisms ensuring human intervention and control over consequential AI decisions.",
    ccmMappings: { "GRC-06": "Governance Responsibility Model", "IAM-09": "Segregation of Privileged Access Roles" },
    mappings: { "NIST AI RMF": ["GOV 2.2"], "EU AI Act": ["Art 14"], "Canada AIDA": ["Sec 12"], "Singapore": ["HITL"], "UK AI": ["Oversight"], "NYC Law 144": ["Review"], "Colorado AI": ["SB26-189"], "Texas TRAIGA": ["§4"], "G7 Hiroshima": ["§7"], "EO 14110": ["§4.2"] },
    indicator: { name: "HITL Intervention Rate", method: "Log-derived ratio of human-overridden AI decisions to total automated decisions. Sourced from immutable audit trail.", slo: "Track trend; alert on >20% deviation" },
    implementation: "Establish oversight committee with documented intervention triggers and escalation paths."
  },
  {
    id: 3, concept: "Model Inventory", riskTier: "All Systems", priority: "High",
    ccmDomain: "GRC", ownership: "CSC",
    description: "Centralized registry of all AI models in production and development.",
    ccmMappings: { "GRC-05": "Information Security Program", "DCS-06": "Assets Cataloguing and Tracking" },
    mappings: { "US Banking": ["Inventory"], "OCC/Fed/FDIC": ["§III.B"], "ISO/IEC 42001": ["6.1.3"], "EU AI Act": ["Art 49"], "FedRAMP": ["CM-8"], "SOC 2": ["CC8.1"], "EO 14110": ["§4.6"] },
    indicator: { name: "Model Registry Completeness %", method: "Count of documented production models / total deployed models. Assessed via infrastructure scan vs registry.", slo: "100%" },
    implementation: "Maintain centralized GRC registry of models including version, owner, risk tier, and deployment status."
  },
  {
    id: 4, concept: "Data Governance", riskTier: "All Systems", priority: "High",
    ccmDomain: "DSP", ownership: "Shared",
    description: "Controls for data quality, lineage, consent, and lifecycle management.",
    ccmMappings: { "DSP-03": "Data Inventory", "DSP-04": "Data Classification", "DSP-06": "Data Ownership and Stewardship" },
    mappings: { "ISO/IEC 42001": ["A.7"], "EU AI Act": ["Art 10"], "OECD AI": ["1.2"], "NIST AI RMF": ["MAP 2.2"], "NIST AI 600-1": ["GV-6.1"], "Brazil LGPD": ["Art 6"], "China PIPL": ["Art 19"], "GDPR": ["Art 5"] },
    indicator: { name: "Data Inventory Coverage %", method: "Datasets with documented lineage and classification / total datasets in use.", slo: "≥95%" },
    implementation: "Encrypt data at rest and in transit. Maintain data lineage logs and consent records for all training datasets."
  },
  {
    id: 5, concept: "Model Validation", riskTier: "High-Risk", priority: "Critical",
    ccmDomain: "A&A", ownership: "CSC",
    description: "Independent validation by a separate team prior to production deployment.",
    ccmMappings: { "A&A-02": "Independent Assessments", "A&A-05": "Audit Management Process" },
    mappings: { "US Banking": ["Validation"], "OCC/Fed/FDIC": ["§IV.A"], "NIST AI RMF": ["MEAS 2.6"], "SOC 2": ["CC5.2"], "ISO/IEC 42001": ["9.1"] },
    indicator: { name: "Pre-Production Validation Coverage %", method: "Models with signed validation report / total models promoted to production. Logged in CI/CD audit trail.", slo: "100%" },
    implementation: "Second-line team validates models pre-deployment. Document validation methodology and sign-off. EU AI Act Annex III high-risk deadline extended to Dec 2, 2027 per Digital Omnibus (May 7, 2026); use the extended window to strengthen validation pipelines."
  },
  {
    id: 6, concept: "Privacy Assessment", riskTier: "All Systems", priority: "Critical",
    ccmDomain: "DSP", ownership: "Shared",
    description: "Data Protection Impact Assessments for AI systems processing personal data.",
    ccmMappings: { "DSP-08": "Data Privacy by Design and Default", "DSP-09": "Data Protection Impact Assessment" },
    mappings: { "GDPR": ["Art 35"], "ISO/IEC 42001": ["A.7"], "Canada AIDA": ["Anon"], "Brazil LGPD": ["Art 38"], "China PIPL": ["Art 55"], "FedRAMP": ["AR-2"], "California AI": ["SB-53"], "Texas TRAIGA": ["§6"] },
    indicator: { name: "DPIA Completion Rate", method: "AI systems with completed DPIA / systems processing personal data. Reviewed at least annually.", slo: "100% of in-scope systems" },
    implementation: "Conduct DPIA before processing personal data. Re-assess annually and after material model changes."
  },
  {
    id: 7, concept: "Explainability", riskTier: "High-Risk", priority: "High",
    ccmDomain: "GRC", ownership: "Shared",
    description: "Mechanisms to explain AI decisions to affected stakeholders in accessible terms.",
    ccmMappings: { "GRC-07": "Information System Regulatory Mapping", "AIS-03": "Application Security Metrics" },
    mappings: { "EU AI Act": ["Art 13"], "NIST AI RMF": ["GOV 3.1"], "NIST AI 600-1": ["MS-2.5"], "OECD AI": ["1.3"], "Singapore": ["Ops"], "NYC Law 144": ["Notice"], "IEEE 7000": ["Trans"], "Japan AI": ["Trans"] },
    indicator: { name: "Explanation Availability Rate", method: "High-risk decisions with logged SHAP/LIME artifacts / total high-risk decisions.", slo: "≥95%" },
    implementation: "Provide SHAP/LIME explanations for high-risk outputs. Store explanation artifacts alongside decision logs."
  },
  {
    id: 8, concept: "Data Drift Detection", riskTier: "High-Risk", priority: "Critical",
    ccmDomain: "LOG", ownership: "Shared",
    description: "Continuous monitoring of input distribution shifts in production environments.",
    ccmMappings: { "LOG-03": "Security Monitoring and Alerting", "LOG-05": "Audit Logs Monitoring and Response", "TVM-07": "Vulnerability Identification" },
    mappings: { "NIST AI RMF": ["MEAS 2.7"], "NIST AI 600-1": ["MS-2.6"], "ISO/IEC 42001": ["A.9.2"], "US Banking": ["Monitor"], "OCC/Fed/FDIC": ["§IV.C"], "SOC 2": ["CC7.2"] },
    indicator: { name: "Drift Alert Mean Time to Response (hrs)", method: "Average time from drift alert trigger to acknowledged remediation action. Logged in monitoring platform.", slo: "≤24 hrs" },
    implementation: "Alert when input distribution diverges >5% from training baseline. Trigger revalidation workflow automatically."
  },
  {
    id: 9, concept: "Model Versioning", riskTier: "High-Risk", priority: "High",
    ccmDomain: "CCC", ownership: "Shared",
    description: "Immutable version history enabling rollback to prior production states.",
    ccmMappings: { "CCC-06": "Change Management Baseline", "CCC-02": "Quality Testing" },
    mappings: { "ISO/IEC 42001": ["A.9.3"], "NIST AI RMF": ["MAN 3.3"], "FedRAMP": ["CM-2"], "SOC 2": ["CC8.1"], "EO 14110": ["§4.6"] },
    indicator: { name: "Version Rollback Success Rate", method: "Successful rollbacks / total rollback attempts. Verified via CI/CD audit log.", slo: "≥99%" },
    implementation: "Immutable version history with signed artifacts and linked validation reports."
  },
  {
    id: 10, concept: "Adversarial Testing", riskTier: "High-Risk", priority: "Critical",
    ccmDomain: "TVM", ownership: "CSC",
    description: "Structured red-team testing against prompt injection, jailbreaks, and adversarial inputs.",
    ccmMappings: { "TVM-06": "Penetration Testing", "AIS-05": "Automated Application Security Testing" },
    mappings: { "OWASP LLM": ["LLM01"], "NIST AI RMF": ["MEAS 2.5"], "NIST AI 600-1": ["MS-2.2"], "Canada AIDA": ["Harm"], "NIST CSF": ["DET-01"], "EO 14110": ["§4.2b"], "G7 Hiroshima": ["§5"], "US AI EO 2026": ["§2"] },
    indicator: { name: "Red Team Finding Resolution Rate", method: "Critical/High findings closed within SLA / total findings per engagement.", slo: "≥90% Critical/High within 30 days" },
    implementation: "Quarterly red-team exercises with documented findings. Pre-release red-teaming required for all GPAI models."
  },
  {
    id: 11, concept: "Bias Testing", riskTier: "High-Risk", priority: "Critical",
    ccmDomain: "A&A", ownership: "CSC",
    description: "Systematic testing for algorithmic bias across legally protected characteristics.",
    ccmMappings: { "A&A-02": "Independent Assessments", "AIS-03": "Application Security Metrics" },
    mappings: { "NIST AI RMF": ["MEAS 2.3"], "EU AI Act": ["Art 10(2)"], "Canada AIDA": ["Bias"], "OECD AI": ["1.2"], "NYC Law 144": ["Audit"], "Colorado AI": ["SB26-189"], "Texas TRAIGA": ["§3"], "IEEE 7000": ["Fair"], "California AI": ["AB-2013"] },
    indicator: { name: "Demographic Parity Deviation Score", method: "Max disparity in favorable outcome rates across protected groups. Computed from validation dataset.", slo: "≤5% disparity" },
    implementation: "Quarterly bias testing with external auditor sign-off. Publish bias audit summaries for high-risk consumer-facing systems. Texas TRAIGA (eff. Jan 1, 2026) explicitly prohibits discriminatory AI. Colorado SB 26-189 (signed May 14, 2026, eff. Jan 1, 2027) replaced SB 24-205 with a narrowed notice-based approach. The Global AI Regulation Summit (New Delhi, May 26, 2026) elevated algorithmic bias as a top international governance priority."
  },
  {
    id: 12, concept: "Secure Weights", riskTier: "Critical", priority: "Critical",
    ccmDomain: "CEK", ownership: "Shared",
    description: "Prevent model weight theft, unauthorized access, and supply-chain compromise.",
    ccmMappings: { "CEK-03": "Data Encryption", "CEK-10": "Key Generation", "DCS-08": "Equipment Identification" },
    mappings: { "OWASP LLM": ["LLM10"], "ISO/IEC 42001": ["A.13"], "NIST CSF": ["PROT-13"], "FedRAMP": ["SC-28"], "EO 14110": ["§4.2a"] },
    indicator: { name: "Unauthorized Weight Access Attempts", method: "Count of blocked or anomalous access attempts to model artifact storage per month. From HSM/SIEM logs.", slo: "0 unresolved incidents/month" },
    implementation: "Store weights in HSM with access logging. Implement Confidential Computing / TEE for inference protection."
  },
  {
    id: 13, concept: "Copyright Compliance", riskTier: "GenAI", priority: "High",
    ccmDomain: "GRC", ownership: "CSC",
    description: "IP rights management for training data ingestion and generated output.",
    ccmMappings: { "GRC-07": "Information System Regulatory Mapping", "DSP-06": "Data Ownership and Stewardship" },
    mappings: { "EU AI Act": ["Art 53"], "ISO/IEC 42001": ["A.5"], "UK AI": ["Copyright"], "G7 Hiroshima": ["§8"] },
    indicator: { name: "Training Data IP Clearance Rate", method: "Datasets with documented licensing / total training datasets ingested.", slo: "100%" },
    implementation: "Maintain IP ledger with training data provenance. Implement output filtering for copyrighted material reproduction."
  },
  {
    id: 14, concept: "Contestability", riskTier: "High-Risk", priority: "Medium",
    ccmDomain: "GRC", ownership: "CSC",
    description: "Documented process enabling users to challenge and appeal automated decisions.",
    ccmMappings: { "GRC-01": "Governance Program Policy and Procedures", "SEF-06": "Event Triage Processes" },
    mappings: { "GDPR": ["Art 22"], "Canada AIDA": ["Lang"], "Singapore": ["Cust"], "Brazil LGPD": ["Art 20"], "Australia AI": ["Contest"], "Colorado AI": ["SB26-189"], "Texas TRAIGA": ["§5"] },
    indicator: { name: "Appeal Resolution Time (hrs)", method: "Median hours from appeal submission to final disposition. Tracked in ticketing system.", slo: "≤72 hrs median" },
    implementation: "Human appeal workflow with <48hr SLA. Log all appeals and outcomes for regulatory reporting."
  },
  {
    id: 15, concept: "Environmental Impact", riskTier: "All Systems", priority: "Medium",
    ccmDomain: "GRC", ownership: "Shared",
    description: "Monitor, measure, and disclose AI compute carbon and energy footprint.",
    ccmMappings: { "GRC-01": "Governance Program Policy and Procedures" },
    mappings: { "EU AI Act": ["Art 40"], "OECD AI": ["1.1"], "IEEE 7000": ["Sustain"], "ISO/IEC 42001": ["A.6.2"] },
    indicator: { name: "Compute Carbon Intensity (kgCO₂e/10k inferences)", method: "Scope 2 equivalent emissions per 10,000 inference calls. Derived from cloud provider carbon reporting APIs.", slo: "Track trend; target YoY reduction" },
    implementation: "Log compute hours per model run. Report Scope 2 equivalent emissions quarterly to sustainability team."
  },
  {
    id: 16, concept: "Vendor Risk", riskTier: "All Systems", priority: "High",
    ccmDomain: "STA", ownership: "Shared",
    description: "Third-party AI provider oversight, due diligence, and ongoing monitoring.",
    ccmMappings: { "STA-08": "Supply Chain Risk Management", "STA-14": "Supply Chain Data Security Assessment" },
    mappings: { "NIST AI RMF": ["MAP 1.5"], "US Banking": ["Vendor"], "OCC/Fed/FDIC": ["§V"], "ISO/IEC 42001": ["8.4"], "SOC 2": ["CC9.2"], "FedRAMP": ["SA-9"], "OWASP LLM": ["LLM05"] },
    indicator: { name: "Third-Party Risk Assessment Coverage %", method: "AI vendors with current annual assessment / total active AI vendors.", slo: "100% of active vendors annually" },
    implementation: "Annual risk assessment for all 3rd-party AI providers. OCC/Fed/FDIC Joint Guidance requires documented concentration risk analysis for banking-sector deployments."
  },
  {
    id: 17, concept: "Hallucination Management", riskTier: "GenAI", priority: "Critical",
    ccmDomain: "AIS", ownership: "Shared",
    description: "Controls to detect, mitigate, and disclose AI-generated factual inaccuracies.",
    ccmMappings: { "AIS-02": "Application Security Baseline Requirements", "LOG-07": "Logging Scope" },
    mappings: { "NIST AI 600-1": ["MS-2.5", "GV-1.1"], "EU AI Act": ["Art 52"], "OWASP LLM": ["LLM09"], "ISO/IEC 42001": ["A.9.1"], "G7 Hiroshima": ["§4"] },
    indicator: { name: "Hallucination Incident Rate (per 10k outputs)", method: "User-reported or automated fact-check failures per 10,000 outputs. Logged in incident management system.", slo: "≤1.0 per 10k outputs" },
    implementation: "Implement RAG grounding and confidence scoring. Display uncertainty indicators in user-facing outputs."
  },
  {
    id: 18, concept: "Synthetic Content Detection", riskTier: "GenAI", priority: "High",
    ccmDomain: "LOG", ownership: "Shared",
    description: "Watermarking and provenance controls for AI-generated content.",
    ccmMappings: { "DSP-17": "Sensitive Data Protection", "LOG-11": "Transaction/Activity Logging" },
    mappings: { "NIST AI 600-1": ["GV-6.2"], "EU AI Act": ["Art 50"], "EO 14110": ["§4.5"], "G7 Hiroshima": ["§6"], "OECD AI": ["1.3"] },
    indicator: { name: "Watermark Detection Success Rate", method: "Content samples with recoverable provenance markers / total generated content samples tested.", slo: "≥95%" },
    implementation: "Apply cryptographic watermarking to all generated media. Maintain provenance chain-of-custody aligned to C2PA standard. Note: EU AI Act Art 50 machine-readable marking obligation postponed to Dec 2, 2026 per the Digital Omnibus agreement (May 7, 2026). New EU prohibition on AI-generated non-consensual intimate imagery (CSAM) takes effect Dec 2, 2026."
  },
  {
    id: 19, concept: "Dual-Use Foundation Model Reporting", riskTier: "GPAI", priority: "High",
    ccmDomain: "GRC", ownership: "CSC",
    description: "Safety test result reporting obligations for large-scale foundation model developers.",
    ccmMappings: { "GRC-07": "Information System Regulatory Mapping", "SEF-07": "Security Breach Notification" },
    mappings: { "EO 14110": ["§4.2c"], "EU AI Act": ["Art 55"], "NIST AI 600-1": ["GV-1.7"], "G7 Hiroshima": ["§2"], "US AI EO 2026": ["§1 voluntary 30-day"] },
    indicator: { name: "Regulatory Submission Timeliness %", method: "Submissions delivered within required regulatory window / total required submissions.", slo: "100%" },
    implementation: "Report red-team and safety evaluation results to government bodies prior to public release. Maintain audit trail of all submissions."
  },
  {
    id: 20, concept: "Shutdown / Decommissioning Plan", riskTier: "GPAI", priority: "High",
    ccmDomain: "BCR", ownership: "CSC",
    description: "Documented capability to safely halt AI systems exceeding defined risk thresholds.",
    ccmMappings: { "BCR-09": "Disaster Response Plan", "BCR-04": "Business Continuity Planning" },
    mappings: { "California AI": ["SB-53 lineage"], "ISO/IEC 42001": ["A.9.4"], "EU AI Act": ["Art 9(7)"], "NIST AI RMF": ["MAN 4.1"] },
    indicator: { name: "Runbook Test Pass Rate", method: "Successful shutdown procedure drills / total drills conducted annually.", slo: "100% annually" },
    implementation: "Documented kill-switch procedures with tested runbooks. Required for systems exceeding California SB 53 (TFAIA) compute thresholds (effective Jan 1, 2026). Test annually."
  },
  {
    id: 21, concept: "Agentic Action Boundaries", riskTier: "Autonomous Agents", priority: "Critical",
    ccmDomain: "AIS", ownership: "Shared",
    description: "Granular permissioning and safety guardrails for AI agents executing autonomous API calls, transactions, or system modifications.",
    // AIS-08 confirmed new in CCM v4.1.0 (Nov 2025). CAIQ v4.1 questions AIS-08.1 + AIS-08.2 confirmed via change analysis.
    // AIS-08.1: "Are processes, procedures, and technical measures defined and implemented to secure APIs?"
    // AIS-08.2: "Are reviews and updates conducted at least annually, or upon significant system changes?"
    ccmMappings: {
      "AIS-08": "API Security",
      "IAM-05": "Least Privilege",
      "IAM-16": "Authorization Mechanisms",
      "LOG-11": "Transaction/Activity Logging"
    },
    mappings: { "NIST AI 600-1": ["GV-2.1", "MS-1.1"], "EU AI Act": ["Art 14"], "ISO/IEC 42001": ["A.10.1"], "OWASP LLM": ["LLM07"], "OCC/Fed/FDIC": ["Auto-Txn"], "NIST CSF": ["PR.AC-04"], "Texas TRAIGA": ["§7 Behav"] },
    indicator: { name: "API Scoped Token Authorization Rate", method: "Agent API calls using least-privilege scoped tokens / total agent API calls. Derived from API gateway logs.", slo: "≥99% scoped; 0 unauthorized" },
    implementation: "Implement HITL confirmation triggers for any action exceeding a defined financial or system-impact threshold. Use scoped API tokens with least-privilege access. Per CCM v4.1 AIS-08: review and update at least annually or upon significant system changes. For healthcare agentic deployments, apply NHID-Clinical controls: Pre-Data Gate disclosure, Turing Boundary enforcement, and Safe Failover to human operators."
  },
  {
    id: 22, concept: "Caller Authorization Verification (AUTH-01)", riskTier: "Autonomous Agents", priority: "Critical",
    ccmDomain: "IAM", ownership: "Shared",
    description: "Cryptographic verification that AI agents are authorized by the provider they claim to represent. Closes the Layer 3 security gap via NHID-Auth v2 Ed25519 delegation chains and DPoP call-nonce binding.",
    ccmMappings: { "IAM-16": "Authorization Mechanisms", "IAM-05": "Least Privilege", "LOG-11": "Transaction/Activity Logging" },
    mappings: { "NHID-Clinical": ["AUTH-01"], "NIST AI RMF": ["GV-2.1"], "ISO/IEC 42001": ["A.10.1"], "EU AI Act": ["Art 14"] },
    indicator: { name: "Cryptographic Authorization Verification Rate", method: "Voice agent calls with valid Ed25519 delegation chain + DPoP nonce binding / total agent calls. Derived from Layer 3 verification logs.", slo: "100% of production calls" },
    implementation: "Implement NHID-Auth v2 reference layer: Provider-issued Ed25519-signed agent credentials with NPI binding, scoped delegation (max 3 hops), time-limited TTL, and real-time revocation. Bind each call with DPoP proof-of-possession nonce. Verify signature, NPI, expiry, revocation status, scope narrowing, and nonce before allowing data exchange. Layer 3 enforcement prevents NPI spoofing attacks. Integrate with Layer 4 FHIR AuditEvent logging to capture credential ID in every transaction."
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const tierBadge = (t: string) =>
  t === 'Autonomous Agents' ? 'badge badge-agentic' :
  t === 'GPAI' ? 'badge badge-gpai' :
  t === 'GenAI' ? 'badge badge-genai' : 'badge badge-tier';

const priorityStripe = (p: string) =>
  p === 'Critical' ? 'stripe-critical' : p === 'High' ? 'stripe-high' : 'stripe-medium';

const priorityBadge = (p: string) =>
  p === 'Critical' ? 'badge badge-critical' : p === 'High' ? 'badge badge-high' : 'badge badge-medium';

const ownershipBadge = (o: string) =>
  o === 'Shared' ? 'badge badge-shared' : o === 'CSP' ? 'badge badge-csp' : 'badge badge-csc';

// ─── Component ────────────────────────────────────────────────────────────────
const AIGovernancePlatform = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFrameworks, setSelectedFrameworks] = useState(['all']);
  const [selectedTier, setSelectedTier] = useState('All');
  const [expandedRows, setExpandedRows] = useState(new Set<number>());
  const [controlState, setControlState] = useState<Record<number, { maturity?: number; remediation?: string; flagged?: boolean }>>(() => {
    try { const s = localStorage.getItem('ai-gov-progress'); return s ? JSON.parse(s) : {}; } catch { return {}; }
  });
  const [userControls, setUserControls] = useState<{ concept?: string }[]>([]);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try { return localStorage.getItem('ai-gov-dark') === 'true'; } catch { return false; }
  });
  const [showGuide, setShowGuide] = useState<boolean>(() => {
    try { return localStorage.getItem('ai-gov-guide-seen') !== 'true'; } catch { return true; }
  });

  useEffect(() => {
    try { localStorage.setItem('ai-gov-progress', JSON.stringify(controlState)); } catch { /* storage unavailable */ }
  }, [controlState]);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    try { localStorage.setItem('ai-gov-dark', String(next)); } catch { /* storage unavailable */ }
  };

  const toggleGuide = () => {
    const next = !showGuide;
    setShowGuide(next);
    if (!next) { try { localStorage.setItem('ai-gov-guide-seen', 'true'); } catch { /* storage unavailable */ } }
  };

  const getMaturity = (id: number) => controlState[id]?.maturity || 0;
  const getRemediation = (id: number) => controlState[id]?.remediation || '';
  const getFlagged = (id: number) => controlState[id]?.flagged || false;
  const getOwner = (id: number) => controlState[id]?.owner || '';
  const getDueDate = (id: number) => controlState[id]?.dueDate || '';
  const getLastModified = (id: number) => controlState[id]?.lastModified || '';
  const updateMaturity = (id: number, lvl: number) => setControlState(p => ({ ...p, [id]: { ...p[id], maturity: lvl, lastModified: new Date().toISOString() } }));
  const updateRemediation = (id: number, txt: string) => setControlState(p => ({ ...p, [id]: { ...p[id], remediation: txt } }));
  const toggleFlag = (id: number) => setControlState(p => ({ ...p, [id]: { ...p[id], flagged: !p[id]?.flagged } }));
  const updateOwner = (id: number, owner: string) => setControlState(p => ({ ...p, [id]: { ...p[id], owner } }));
  const updateDueDate = (id: number, dueDate: string) => setControlState(p => ({ ...p, [id]: { ...p[id], dueDate } }));

  const isOverdue = (id: number) => {
    const d = getDueDate(id);
    if (!d) return false;
    return new Date(d) < new Date() && getMaturity(id) < 5;
  };

  const calculateDaysRemaining = (targetDate: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(targetDate);
    deadline.setHours(0, 0, 0, 0);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const overallScore = useMemo(() => {
    const total = Object.values(controlState).reduce((a, c) => a + (c.maturity || 0), 0);
    return Math.round((total / (complianceData.length * 5)) * 100);
  }, [controlState]);

  const criticalCount = complianceData.filter(d => d.priority === 'Critical').length;
  const assessedCount = Object.values(controlState).filter(c => (c.maturity || 0) > 0).length;

  // Radar: average maturity per CCM domain — uses actual state, no Math.random()
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

  const nextDeadline = useMemo(() => {
    const deadlines = [
      { name: 'EU Transparency Rules', date: '2026-08-02', framework: 'EU AI Act' },
      { name: 'Human oversight for high-risk', date: '2027-12-02', framework: 'EU AI Act' },
      { name: 'Logging & traceability', date: '2027-12-02', framework: 'EU AI Act' },
    ];
    const upcoming = deadlines
      .map(d => ({ ...d, daysRemaining: calculateDaysRemaining(d.date) }))
      .filter(d => d.daysRemaining > 0)
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
    return upcoming.length > 0 ? upcoming[0] : null;
  }, []);

  const frameworkCoverage = useMemo(() =>
    frameworks.map(fw => {
      const count = complianceData.filter(d => d.mappings[fw as keyof typeof d.mappings]).length;
      return { fw, count, pct: Math.round((count / complianceData.length) * 100) };
    }).sort((a, b) => b.count - a.count)
  , []);

  const printReport = () => window.print();

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const rows = [
      ['ID','Control','Risk Tier','Priority','CCM Domain','SSRM','Maturity','Maturity Label','Owner','Due Date','Flagged for Reassessment','Last Modified','Notes','Frameworks','CCM v4.1.0 Controls'].join(','),
      ...complianceData.map(item => {
        const mat = getMaturity(item.id);
        const ccmIds = Object.keys(item.ccmMappings).join('; ');
        return [item.id, `"${item.concept}"`, item.riskTier, item.priority, item.ccmDomain, item.ownership, mat, maturityLevels[mat].label, `"${getOwner(item.id)}"`, getDueDate(item.id), getFlagged(item.id) ? 'Yes' : 'No', getLastModified(item.id), `"${getRemediation(item.id).replace(/"/g,'""')}"`, `"${Object.keys(item.mappings).join(', ')}"`, `"${ccmIds}"`].join(',');
      })
    ].join('\n');
    triggerDownload(new Blob([rows], { type: 'text/csv' }), 'ai-governance-assessment-v2.csv');
  };

  const saveProgress = () => {
    triggerDownload(new Blob([JSON.stringify(controlState, null, 2)], { type: 'application/json' }), 'ai-governance-progress.json');
  };

  const downloadNHID = () => {
    // Download the template file AND immediately load it into the gap analysis
    triggerDownload(new Blob([JSON.stringify(NHID_MANIFEST, null, 2)], { type: 'application/json' }), 'nhid-clinical-controls.json');
    setUserControls(NHID_MANIFEST);
    setUploadedFile('nhid-clinical-controls.json (template loaded)');
  };

  const clearAll = () => {
    if (confirm('Clear all scores and notes?')) {
      setControlState({}); setUserControls([]); setUploadedFile(null);
      try { localStorage.removeItem('ai-gov-progress'); } catch { /* storage unavailable */ }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try { setUserControls(JSON.parse(ev.target?.result as string)); setUploadedFile(file.name); }
      catch { alert('Invalid JSON'); }
    };
    reader.readAsText(file);
  };

  const gapAnalysis = useMemo(() => {
    if (!userControls.length) return null;
    const implemented = userControls.map(c => (c.concept || '').toLowerCase());
    const gaps = complianceData.filter(item => !implemented.includes(item.concept.toLowerCase()));
    return { coverage: ((complianceData.length - gaps.length) / complianceData.length * 100).toFixed(0), implemented: complianceData.length - gaps.length, gaps, criticalGaps: gaps.filter(g => g.priority === 'Critical') };
  }, [userControls]);

  const filteredData = useMemo(() => complianceData.filter(item => {
    const s = searchTerm.toLowerCase();
    const matchSearch = !s || item.concept.toLowerCase().includes(s) || item.description.toLowerCase().includes(s) || Object.keys(item.mappings).some(fw => fw.toLowerCase().includes(s)) || Object.keys(item.ccmMappings).some(id => id.toLowerCase().includes(s));
    const matchFw = selectedFrameworks.includes('all') || selectedFrameworks.every(fw => item.mappings[fw as keyof typeof item.mappings]);
    const matchTier = selectedTier === 'All' || item.riskTier === selectedTier;
    return matchSearch && matchFw && matchTier;
  }), [searchTerm, selectedFrameworks, selectedTier]);

  const toggleRow = (id: number) => { const s = new Set(expandedRows); if (s.has(id)) { s.delete(id); } else { s.add(id); } setExpandedRows(s); };

  return (
    <>
      <style>{FONTS}</style>
      <div className={`app-wrapper${darkMode ? ' dark' : ''}`}>

        <header className="header">
          <div className="header-inner">
            <div className="header-brand">
              <span className="header-title">AI Governance Map</span>
              <span className="header-version">v2 · June 2026 · CCM v4.1.0 + NHID-Clinical v2</span>
            </div>
            <nav className="header-nav desktop-nav">
              {[
                { id:'map', icon:Shield, label:'Controls' },
                { id:'radar', icon:Radio, label:'Posture Radar' },
                { id:'network', icon:Network, label:'Matrix' },
                { id:'gap', icon:BarChart3, label:'Gap Analysis' }
              ].map(tab => (
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
              <button className="dark-toggle" onClick={toggleDarkMode} title="Toggle dark mode">
                {darkMode ? <Sun /> : <Moon />}
              </button>
              <button className="btn-ghost" onClick={printReport}><Printer /><span>Print</span></button>
              <button className="btn-ghost" onClick={exportCSV}><Download /><span>CSV</span></button>
              <button className="btn-ghost" onClick={saveProgress}><Save /><span>Save</span></button>
              <button className="btn-ghost" onClick={clearAll}><RotateCcw /><span>Reset</span></button>
            </div>
          </div>
        </header>

        <main className="main">
          <div className="stats-bar">
            <div className="stat-card"><div className="stat-label">Frameworks</div><div className="stat-value">27</div><div className="stat-sub">Global jurisdictions</div></div>
            <div className="stat-card"><div className="stat-label">Controls</div><div className="stat-value">22</div><div className="stat-sub">CMMI + CCM v4.1.0 + NHID</div></div>
            <div className="stat-card"><div className="stat-label">Critical</div><div className="stat-value">{criticalCount}</div><div className="stat-sub">High-priority controls</div></div>
            <div className="stat-card"><div className="stat-label">Assessed</div><div className="stat-value">{assessedCount}</div><div className="stat-sub">of {complianceData.length} controls</div></div>
            {nextDeadline && <div className="stat-card deadline-card"><div className="stat-label">Next Deadline</div><div className="stat-value">{nextDeadline.daysRemaining}d</div><div className="stat-sub">{nextDeadline.name} - {nextDeadline.framework}</div></div>}
          </div>

          {/* ── Controls Tab ─────────────────────────────────────────────────── */}
          {activeTab === 'map' && (
            <div>
              {/* ── How to Use Guide ──────────────────────────────────────── */}
              <div className="guide-panel">
                <div className="guide-header" onClick={toggleGuide}>
                  <span className="guide-title"><BookOpen />How to use this tool</span>
                  <ChevronDown size={14} className={`chevron ${showGuide?'open':''}`}/>
                </div>
                {showGuide && (
                  <div className="guide-body">
                    <div>
                      <div className="guide-step-num">STEP 1 · SCORE</div>
                      <div className="guide-step-title">Rate each control (0–5)</div>
                      <div className="guide-step-desc">Click any card to expand it. Use the CMMI maturity scale: <strong>0</strong> = nothing in place, <strong>1</strong> = ad hoc, <strong>2</strong> = repeatable, <strong>3</strong> = documented policy, <strong>4</strong> = measured with metrics, <strong>5</strong> = continuously optimized. Your scores auto-save to this browser.</div>
                    </div>
                    <div>
                      <div className="guide-step-num">STEP 2 · TRACK</div>
                      <div className="guide-step-title">Assign owners &amp; due dates</div>
                      <div className="guide-step-desc">Inside each card, add an owner name (person or team) and a remediation due date. Overdue controls with maturity &lt; 5 will be highlighted in red. Log evidence, Jira links, or audit report references in the Notes field. Flag controls after a Significant System Change for re-assessment.</div>
                    </div>
                    <div>
                      <div className="guide-step-num">STEP 3 · REPORT</div>
                      <div className="guide-step-title">Review posture &amp; export</div>
                      <div className="guide-step-desc">Use <strong>Posture Radar</strong> to visualize maturity by CCM domain and framework coverage. Use <strong>Gap Analysis</strong> to compare against your existing control manifest (upload a JSON file). Export to CSV for auditors, Print for a formatted report, or Save your progress as JSON to reload later.</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="search-wrap">
                <Search />
                <input type="text" className="search-input" placeholder="Search controls, frameworks, CCM IDs..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
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
                  const isFlagged = getFlagged(item.id);
                  return (
                    <div key={item.id} className={`control-card ${isOpen?'expanded':''} ${isOverdue(item.id)?'card-overdue':''}`}>
                      <div className="control-header" onClick={()=>toggleRow(item.id)}>
                        <div className={`priority-stripe ${priorityStripe(item.priority)}`}/>
                        <div className="control-meta">
                          <div className="control-name">
                            {item.concept}
                            <span className={tierBadge(item.riskTier)}>{item.riskTier}</span>
                            <span className={priorityBadge(item.priority)}>{item.priority}</span>
                            <span className={ownershipBadge(item.ownership)}>{item.ownership} SSRM</span>
                            {mat>0&&<span className="badge badge-maturity">L{mat} · {maturityLevels[mat].label}</span>}
                            {isFlagged&&<span className="badge" style={{background:'#FFFBEB',color:'#92400E',border:'1px solid #FEF3C7'}}>⚠ Re-assess</span>}
                            {isOverdue(item.id)&&<span className="overdue-pill"><AlertCircle size={9}/>Overdue</span>}
                          </div>
                          <div className="control-desc">{item.description}</div>
                        </div>
                        <div className="maturity-dots" title={`Maturity: ${mat}/5`}>
                          {[1,2,3,4,5].map(n=>(
                            <div key={n} className={`maturity-dot ${n<=mat?(item.priority==='Critical'&&mat<3?'filled-critical':'filled'):''}`}/>
                          ))}
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

                            <div className="section-label" style={{marginTop:'0.25rem'}}><Zap/>Indicator Identity Card</div>
                            <div className="indicator-card">
                              <div className="indicator-name">{item.indicator.name}</div>
                              <div className="indicator-field-label">Expression</div>
                              <div className="indicator-method">{item.indicator.method}</div>
                              <div className="indicator-field-label">SLO Recommendation</div>
                              <span className="indicator-slo">{item.indicator.slo}</span>
                            </div>

                            <div
                              className={`change-flag ${isFlagged?'change-flag-active':''}`}
                              onClick={()=>toggleFlag(item.id)}
                            >
                              <input type="checkbox" checked={isFlagged} onChange={()=>toggleFlag(item.id)} onClick={e=>e.stopPropagation()} />
                              <label><AlertCircle size={11} style={{display:'inline',marginRight:4}}/>Flag for re-assessment (Significant System Change)</label>
                            </div>

                            <div className="owner-due-grid">
                              <div>
                                <div className="field-label"><User/>Owner</div>
                                <input type="text" className="field-input" placeholder="Team or individual..." value={getOwner(item.id)} onChange={e=>updateOwner(item.id,e.target.value)}/>
                              </div>
                              <div>
                                <div className="field-label"><Calendar/>Remediation Due</div>
                                <input type="date" className={`field-input ${isOverdue(item.id)?'field-input-overdue':''}`} value={getDueDate(item.id)} onChange={e=>updateDueDate(item.id,e.target.value)}/>
                              </div>
                            </div>
                            {getLastModified(item.id) && (
                              <div className="last-modified"><Clock/>Last scored: {new Date(getLastModified(item.id)).toLocaleString()}</div>
                            )}
                            <div className="section-label" style={{marginTop:'1rem'}}><FileText/>Evidence / Notes</div>
                            <textarea className="remediation-area" placeholder="Log evidence, Jira links, pen test reports..." value={getRemediation(item.id)} onChange={e=>updateRemediation(item.id,e.target.value)}/>
                          </div>

                          <div>
                            <div className="section-label"><Globe/>Framework Mappings</div>
                            <div className="mappings-grid">
                              {Object.entries(item.mappings).map(([fw, codes]) => {
                                const url = CITATIONS[fw];
                                return url ? (
                                  <a key={fw} href={url} target="_blank" rel="noopener noreferrer" className="mapping-tag" title={`Open ${fw} source`}>
                                    {fw}: {(codes as string[]).join(', ')}<ExternalLink className="ext-icon"/>
                                  </a>
                                ) : (
                                  <span key={fw} className="mapping-tag" onClick={()=>setSelectedFrameworks([fw])} title={`Filter by ${fw}`}>
                                    {fw}: {(codes as string[]).join(', ')}
                                  </span>
                                );
                              })}
                            </div>

                            <div className="section-label" style={{marginTop:'0.75rem'}}><Shield/>CSA CCM v4.1.0 Controls</div>
                            <div className="mappings-grid" style={{marginBottom:'1rem'}}>
                              {Object.entries(item.ccmMappings).map(([id, title]) => (
                                <span key={id} className="ccm-tag" title={title as string}>{id}</span>
                              ))}
                            </div>

                            <div className="section-label"><Shield/>Implementation Guidance</div>
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

          {/* ── Posture Radar Tab ─────────────────────────────────────────────── */}
          {activeTab === 'radar' && (
            <div>
              <div className="radar-container">
                <div className="radar-header">
                  <div className="radar-title">Maturity Posture Radar</div>
                  <div className="radar-subtitle">Average CMMI maturity score per CCM v4.1.0 domain · Score controls in the Controls tab to populate</div>
                </div>
                {overallScore === 0 ? (
                  <div className="radar-empty">
                    <div className="radar-empty-icon"><Radio size={22}/></div>
                    <div className="radar-empty-title">No scores yet</div>
                    <div className="radar-empty-desc">Go to the <strong>Controls</strong> tab and score at least one control (0–5) to populate the radar chart.</div>
                  </div>
                ) : (
                  <div className="radar-body">
                    <div style={{height: 420}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData.filter(d => d.hasControls)}>
                          <PolarGrid strokeDasharray="3 3" stroke="#DDD9D0" />
                          <PolarAngleAxis
                            dataKey="domain"
                            tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono', fill: '#5C5751' }}
                          />
                          <Radar
                            name="Maturity"
                            dataKey="maturity"
                            stroke="#1B3D2E"
                            fill="#1B3D2E"
                            fillOpacity={0.25}
                            strokeWidth={2}
                          />
                          <Tooltip
                            formatter={(val: number) => [`${val} / 5`, 'Avg Maturity']}
                            contentStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 11, border: '1px solid #DDD9D0', borderRadius: 6 }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <div className="radar-legend">
                        {radarData.filter(d => d.hasControls).map(d => (
                          <div key={d.domain} className="radar-legend-item">
                            <span className="radar-legend-domain">{d.domain}</span>
                            <span className="radar-legend-val">{d.maturity > 0 ? `${d.maturity} / 5` : '—'}</span>
                          </div>
                        ))}
                      </div>
                      <div className="radar-ccm-note">
                        <strong>CCM v4.1.0 · 17 domains · 207 controls</strong><br/>
                        Radar plots the 9 domains with mapped AI governance controls. Remaining 8 CCM domains (DCS, HRS, IPY, I&S, SEF, TVM, UEM) are not plotted — no controls currently assigned. Source: CCMv4_1_0-generated_at_2026_01_13.xlsx (CSA, Jan 2026). AIS-08 API Security added in Nov 2025 v4.1 upgrade.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Framework Coverage ─────────────────────────────────────── */}
              <div className="radar-container" style={{marginTop:'1rem'}}>
                <div className="radar-header">
                  <div className="radar-title">Framework Coverage</div>
                  <div className="radar-subtitle">Number of the 21 AI governance controls mapped per framework · Click any framework in the Matrix tab to filter controls</div>
                </div>
                <div style={{padding:'1.5rem'}}>
                  <div className="fw-coverage-grid">
                    {frameworkCoverage.map(({fw, count, pct}) => {
                      const color = pct >= 70 ? 'var(--accent)' : pct >= 40 ? 'var(--gold)' : 'var(--red)';
                      return (
                        <div key={fw} className="fw-coverage-item">
                          <span className="fw-coverage-name" title={fw}>{fw}</span>
                          <div className="fw-coverage-bar-wrap">
                            <div className="fw-coverage-bar" style={{width:`${pct}%`, background: color}}/>
                          </div>
                          <span className="fw-coverage-pct" style={{color}}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Matrix Tab ────────────────────────────────────────────────────── */}
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

          {/* ── Gap Analysis Tab ──────────────────────────────────────────────── */}
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

        {/* ── Mobile bottom nav ──────────────────────────────────────────── */}
        <nav className="mobile-nav">
          {[
            { id:'map', icon:Shield, label:'Controls' },
            { id:'radar', icon:Radio, label:'Radar' },
            { id:'network', icon:Network, label:'Matrix' },
            { id:'gap', icon:BarChart3, label:'Gaps' }
          ].map(tab => (
            <button key={tab.id} className={`nav-btn ${activeTab===tab.id?'active':''}`} onClick={()=>setActiveTab(tab.id)}>
              <tab.icon />{tab.label}
            </button>
          ))}
        </nav>

      </div>
    </>
  );
};

export default AIGovernancePlatform;