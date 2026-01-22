# 🌐 AI Governance Map: The Rosetta Stone

![Status](https://img.shields.io/badge/Status-Live_Beta-green)
![License](https://img.shields.io/badge/License-MIT-purple)
![Privacy](https://img.shields.io/badge/Data-Local_Only-blue)

**A unified control plane for navigating the complex web of global AI regulations.**

This tool operationalizes high-level policy into actionable logic gates. It cross-references **30+ legislative-grade controls** across major global standards to help GRC teams visualize gaps, assess maturity, and plan remediation.

### 🚀 **[Launch Live Dashboard](https://ai-governance-map.vercel.app/)**

---

## 🏛️ Supported Frameworks
Unlike tools that focus on a single region, the **Rosetta Stone** maps relationships across the entire global landscape:

* **🇺🇸 United States:** NIST AI RMF 1.0, Banking (SR 11-7)
* **🇪🇺 European Union:** EU AI Act (High-Risk Categories)
* **🌍 Global:** ISO/IEC 42001, OECD AI Principles
* **🇨🇦 North America:** Canada AIDA
* **🇸🇬 Asia-Pacific:** Singapore Model AI Framework
* **🛡️ Security:** OWASP Top 10 for LLMs

---

## ⚡ Key Features

### 1. 🧭 Maturity Assessment (Control Map)
* **Rate Your Posture:** Use the CMMI slider (0-5 scale) to rate controls from *Initial* to *Optimized*.
* **Track Remediation:** Log specific gaps and evidence directly in the dashboard.
* **Visual Scoring:** Watch your "Compliance Ring" update in real-time.

### 2. 🕸️ The Network Matrix
* **Visualize Overlap:** See exactly how a single control (e.g., *Human Oversight*) satisfies requirements across NIST, ISO, and the EU AI Act simultaneously.
* **Heat Mapping:** Brighter cells indicate stronger regulatory convergence.

### 3. 📊 Gap Analysis Engine
* **Instant Audit:** Drag and drop your current control manifest (JSON).
* **Automated Findings:** The system flags missing "Critical" controls required by Banking or Safety regulations.

---

## 🔒 Privacy & Security
**Privacy by Design:** This tool runs 100% in your browser (Client-Side).
* No data is sent to any server.
* No cookies or tracking.
* Refreshing the page wipes your session data instantly.

---

## 💻 Running Locally
Want to customize the controls?

```bash
git clone [https://ai-governance-map.vercel.app/](https://ai-governance-map.vercel.app/)
npm install
npm start
 
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
