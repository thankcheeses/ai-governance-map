🗺️ AI Governance Map v2.4
Enterprise Cloud-AI Edition
AI Governance Map is a high-fidelity, browser-based GRC (Governance, Risk, and Compliance) platform designed to bridge the gap between high-level AI policy and technical cloud infrastructure.

Version 2.4 is strictly grounded in the January 2026 official releases from the Cloud Security Alliance (CSA).
🚀 Launch the Live Map
💎 What’s New in v2.4
 * Verified CCM v4.1.0 Baseline: Fully updated against the Nov 2025 upgrade and Jan 2026 release.
 * Agentic-API Bridge (AIS-08): Integrated the brand-new API Security control. This provides the technical "Ground Truth" for securing Autonomous Agents.
 * Maturity Posture Radar: Live visualization of maturity averages across 17 Cloud-AI domains using recharts.
 * Indicator Identity Cards: Formalized measurement structures (Expression, Rules, SLO) based on the Jan 2026 CSA Code of Practice for Key Metrics.
 * Significant Change Triggers: Integrated the new auditing standard requiring re-assessment after material system modifications.
🛠️ How to Use the Map
1. Assessment (Controls Tab)
 * Score Maturity: Open any of the 21 controls and assign a CMMI Maturity Level (0–5).
 * Define Metrics: Use the Indicator Identity Card section to document exactly how you measure this control (e.g., "API Scoped Token Authorization Rate").
 * Flag for Re-assessment: If your AI agents or underlying APIs change materially, check the "Significant System Change" flag. This reflects the latest 2026 compliance mandates.
2. Visualization (Posture Radar Tab)
 * The Radar Chart automatically aggregates your maturity scores by CCM Domain (AIS, GRC, DSP, etc.).
 * Instantly identify "thin" areas in your governance posture where technical debt may be accumulating.
3. Cross-Framework Discovery (Matrix Tab)
 * View the overlap between 25 global frameworks (EU AI Act, NIST, SOC 2, etc.).
 * Filtering: Click any numeric cell in the matrix to view only the controls that satisfy both frameworks simultaneously. Use this to "Test Once, Comply Many."
4. Gap Analysis (Gap Analysis Tab)
 * Upload Manifest: Upload a JSON file of your current implemented controls.
 * Healthcare Benchmark: Download and import the NHID-Clinical Starter to see how your agentic workflows stack up against specialized Non-Human Identity Disclosure standards.
🛡️ Key Technical Definitions (v2.4)
Control #21: Agentic Action Boundaries
This is the "Enterprise Flex" of v2.4. It maps the Autonomous Agents risk tier directly to CCM v4.1 Control AIS-08 (API Security).
 * The Logic: You cannot govern an AI agent's actions if you do not govern the APIs it uses to act.
 * SSRM: This is a Shared (Dependent) control; both the Cloud Provider and the Customer have specific configuration responsibilities.
Indicator Identity Cards
Every control now includes structured fields from the Jan 21, 2026 Code of Practice:
 * Expression: The mathematical formula for the metric.
 * Logic & Rules: The constraints of the measurement.
 * SLO Recommendation: The Service Level Objective targets for 2026 audits.
⚙️ Installation & Tech Stack
This tool runs entirely in the browser. No signup required. Data is persisted via localStorage.
Local Development
# 1. Clone the repo
git clone https://github.com/thankcheeses/ai-governance-map.git

# 2. Install dependencies
npm install lucide-react recharts framer-motion

# 3. Start the dev server
npm run dev

Technical Stack:
 * Framework: React
 * Visuals: Recharts (Radar/Spider charts)
 * Icons: Lucide-react
 * Standards: CSA CCM v4.1.0, NIST AI 600-1, ISO 42001, NHID-Clinical.
📄 Open Source & Attribution
 * Author: Brianna Baynard
 * Framework Baseline: Cloud Controls Matrix (CCM) v4.1.0 by Cloud Security Alliance.
 * Healthcare Reference: NHID-Clinical (Non-Human Identity Disclosure).
⚖️ License
MIT License Copyright (c) 2026 Brianna Baynard
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.