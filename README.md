# 🌐 AI Governance Map

![Status](https://img.shields.io/badge/Status-Live_Beta-green)
![Coverage](https://img.shields.io/badge/Coverage-Global_Enterprise-blue)
![License](https://img.shields.io/badge/License-MIT-purple)
![Stack](https://img.shields.io/badge/Tech-React_%7C_Vite_%7C_Tailwind-black)

**A unified control plane for navigating global AI regulations.**

This platform operationalizes high-level legal policy into actionable engineering logic. It cross-references **30+ legislative-grade controls** across major global standards to help GRC teams visualize gaps, assess maturity, and plan remediation in real-time.

### 🚀 **[Launch Live Dashboard](https://ai-governance-map.vercel.app/)**

---

## 🏛️ Supported Frameworks

This tool maps regulatory requirements across **Global, Regional, and Sector-Specific** standards, enabling a "test once, comply many" approach:

| Region / Sector | Framework | Focus Area |
| :--- | :--- | :--- |
| **Global** | **ISO/IEC 42001** | AI Management Systems (AIMS) |
| **Global** | **OECD AI Principles** | Human Rights & Stewardship |
| **United States** | **NIST AI RMF 1.0** | Risk Management (Map, Measure, Manage) |
| **Finance** | **US Banking (SR 11-7)** | Model Risk Management (MRM) & Validation |
| **European Union** | **EU AI Act** | High-Risk Categorization & Fundamental Rights |
| **North America** | **Canada AIDA** | Harm Reduction & Biased Output |
| **Asia-Pacific** | **Singapore Model FW** | Governance & Human-in-the-Loop |
| **Security** | **OWASP Top 10 LLM** | Prompt Injection, Poisoning, & Theft |

---

## ⚡ Key Features

### 1. 🧭 Maturity Assessment Engine
* **CMMI Scoring:** Rate controls on a 0-5 scale (*Initial* to *Optimized*).
* **Remediation Tracking:** Log specific gaps, evidence links, and next steps directly in the dashboard.
* **Real-Time KPIs:** Dynamic visualization of compliance scores and maturity distribution.

### 2. 🕸️ Cross-Framework Matrix
* **Interoperability Mapping:** Visualize how a single control (e.g., *Data Drift Detection*) satisfies requirements across NIST, ISO, and Banking regulations simultaneously.
* **Heat Map:** Identify high-density areas of regulatory convergence.

### 3. 📊 Automated Gap Analysis
* **JSON Ingestion:** Drag and drop a control manifest to run an instant audit.
* **Critical Path Detection:** Automatically flags missing "Critical" controls required for High-Risk systems.

---

## 🔒 Privacy & Architecture
**Privacy by Design:** This tool runs 100% Client-Side.
* **Zero Data Retention:** No data is sent to any server.
* **Ephemeral Session:** Refreshing the page wipes all sensitive assessment data instantly.

---

## 💻 Running Locally

This project is built with **React + TypeScript + Vite** for high-performance rendering.

### 1. Clone the Repository
```bash
git clone [https://ai-governance-map.vercel.app/](https://ai-governance-map.vercel.app/)
cd ai-governance-map


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