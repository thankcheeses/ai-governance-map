🌐 AI Governance Map: The Rosetta Stone
A unified control plane for navigating the complex web of global AI regulations.
This tool operationalizes high-level policy into actionable logic gates. It cross-references 30+ legislative-grade controls across major global standards to help GRC teams visualize gaps, assess maturity, and plan remediation.
🚀 Launch Live Dashboard
🏛️ Supported Frameworks (The "Rosetta Stone")
Unlike other tools that focus on a single region, this platform maps relationships across Global, Regional, and Sector-Specific standards:
| Region / Sector | Framework | Focus Area |
|---|---|---|
| Global | ISO/IEC 42001 | AI Management Systems (AIMS) |
| Global | OECD AI Principles | Foundational Human Rights & Stewardship |
| United States | NIST AI RMF 1.0 | Risk Management (Map, Measure, Manage) |
| United States | US Banking (SR 11-7) | Model Risk Management (MRM) & Validation |
| European Union | EU AI Act | High-Risk Categorization & Fundamental Rights |
| North America | Canada AIDA | Harm Reduction & Biased Output |
| Asia-Pacific | Singapore Model FW | Governance & Human-in-the-Loop |
| Security | OWASP Top 10 LLM | Prompt Injection, Poisoning, & Theft |
📖 User Guide: How to Use This Tool
1. 🧭 The Control Map (Maturity Assessment)
Use the interactive dashboard to assess your organization's current standing against 30+ Legislative-Grade Controls.
 * Maturity Sliders (0-5): Rate each control using the CMMI scale (Initial → Optimized).
 * Remediation Tracking: Log specific gaps, evidence links, or Jira tickets in the text area.
 * Visual Indicators: Watch the "Compliance Score" ring update in real-time as you improve your maturity.
2. 🕸️ The Network Matrix (Cross-Walk)
Click the "Network" tab to visualize the density of overlap between frameworks.
 * Example: See how NIST MAP 1.1 connects to ISO 42001 Clause 8.2.
 * Dark Mode Optimization: Designed to highlight critical intersections (High/Critical risks) using heat-map styling.
3. 📊 Gap Analysis Engine
Click the "Gap Analysis" tab to audit your current posture.
 * Upload Manifest: Drag and drop your current controls (JSON format).
 * Instant Audit: The system automatically flags missing "Critical" controls required by the EU AI Act or Banking Regulations.
🛠️ Technical Stack
This project is built to demonstrate Full-Stack Governance Engineering—the intersection of Policy and Code.
 * Frontend: React.js (Component-based architecture)
 * Styling: Tailwind CSS (Enterprise Dark Mode / "Cyber" Aesthetic)
 * Icons: Lucide React (Clean, technical iconography)
 * Deployment: Vercel (CI/CD pipeline)
🔒 Privacy & Security
"Privacy by Design" is not just a policy; it is built into the architecture.
 * Client-Side Execution: All logic runs locally in your browser.
 * Zero Data Retention: No uploaded JSON files, maturity scores, or remediation notes are sent to any server. Refreshing the page wipes the session.
💻 Running Locally
If you want to customize the controls or integrate your own API:
# Clone the repository
git clone https://github.com/yourusername/ai-governance-map.git

# Install dependencies
npm install

# Run local development server
npm start

Built by Brianna Baynard to bridge the gap between Legal Policy and Engineering Reality.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

While this project uses React, Vite supports many popular JS frameworks. [See all the supported frameworks](https://vitejs.dev/guide/#scaffolding-your-first-vite-project).

## Deploy Your Own

Deploy your own Vite project with Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/framework-boilerplates/vite-react&template=vite-react)

_Live Example: https://vite-react-example.vercel.app_

### Deploying From Your Terminal

You can deploy your new Vite project with a single command from your terminal using [Vercel CLI](https://vercel.com/download):

```shell
$ vercel
```
