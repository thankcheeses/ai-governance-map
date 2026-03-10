AI Governance Map v2.4 — Enterprise Cloud-AI Edition
A high-fidelity, browser-based GRC (Governance, Risk, and Compliance) platform designed to bridge the gap between high-level AI policy and technical cloud infrastructure. This version is technically grounded in the January 2026 official releases from the Cloud Security Alliance (CSA).
🚀 Overview
The AI Governance Map v2.4 transitions from a standard "checklist" into a Technical Governance Operating System. It maps 21 core AI controls across 25 global frameworks (NIST, EU AI Act, ISO 42001) while anchored to the technical infrastructure requirements of CCM v4.1.0.
Key Technical Pillars:
 * CCM v4.1.0 Baseline: Fully verified against the January 2026 official release.
 * Agentic-API Bridge (AIS-08): Direct mapping between autonomous agent boundaries and the new API Security standard.
 * Indicator Identity Cards: Structured measurement metadata (Expression, Logic, SLO) derived from the 2026 Code of Practice for Key Metrics.
 * Maturity Posture Radar: Live CMMI visualization (0-5) across technical domains using recharts.
🛠️ How to Use
1. Execute an Assessment (Controls Tab)
 * Score Maturity: Select a control and assign a CMMI level (0–5).
 * Flag for Change: Use the "Significant System Change" toggle if your agentic architecture or underlying APIs have materially changed since the last audit—reflecting the 2026 standard for continuous compliance.
 * Document Evidence: Log your Jira links, audit logs, or pen-test artifacts directly into the remediation area.
2. Define Technical Metrics (Indicator Section)
Each control includes a structured Indicator Identity Card. To satisfy technical audits:
 * Expression: Define the mathematical formula (e.g., Unauthorized_Attempts / Total_Calls).
 * Logic & Rules: Establish the constraints of the measurement.
 * SLO Recommendation: Set your Service Level Objective targets.
3. Visualize Your Posture (Radar Tab)
The Posture Radar aggregates your scores by CCM domain (e.g., AIS, GRC, LOG).
 * Identify technical gaps where maturity is lagging.
 * The radar plots domains with mapped AI controls to provide an immediate view of technical risk debt.
4. Optimize Compliance (Matrix Tab)
Use the Framework Overlap Matrix to discover efficiencies.
 * Click a numeric cell to see which controls satisfy two frameworks simultaneously.
 * Use this for a "Test Once, Comply Many" workflow to reduce audit fatigue across 25 jurisdictions.
5. Benchmark against Healthcare (Gap Analysis Tab)
 * Custom Manifests: Upload your existing control set in JSON format to identify coverage gaps.
 * NHID-Clinical: Download the NHID-Clinical Starter template to benchmark your autonomous agents against specialized Non-Human Identity Disclosure standards for clinical workflows.
⚙️ Installation
The tool is browser-based and persists data locally. To run it in your own environment:
# Install dependencies
npm install lucide-react recharts framer-motion

# Start the application
npm run dev

⚖️ License
MIT License
Copyright (c) 2026 Brianna Baynard
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.