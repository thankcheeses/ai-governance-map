# 🌐 The AI Governance Map: A Unified Control Plane

> **💡 The Core Thesis** > Compliance is not about checking boxes. It is about interoperability.  
> A single well-designed control (e.g., "Adversarial Red Teaming") should satisfy requirements across NIST, ISO, and the EU AI Act simultaneously.

### 🚀 [Launch the Interactive Dashboard](https://ai-governance-map.vercel.app/)

---

## 🛑 The Problem: Regulatory Fragmentation

Managing AI governance today is a nightmare of disconnected spreadsheets.

- 🛠️ **The Engineers** are looking at Python code and Model Cards.
- 📋 **The Auditors** are looking at NIST 800-53 and ISO 42001.
- ⚖️ **The Lawyers** are looking at the EU AI Act and State Bills.

Nobody is speaking the same language.

## ✅ The Solution: The Rosetta Stone

I built the **AI Governance Map** to translate high-level legal policy into actionable engineering logic gates. It is an open-source "Control Plane" that harmonizes **30+ legislative-grade controls** into a single view.

---

## 🏛️ Supported Frameworks (v2.1 Global Edition)

This is not just a US-centric tool. It maps requirements for **Global Enterprise** operations:

| Region | Standard | Why it matters |
| --- | --- | --- |
| 🌍 Global | **ISO/IEC 42001** | The first certifiable AIMS standard. |
| 🇺🇸 USA | **NIST AI RMF 1.0** | The gold standard for risk management. |
| 🇪🇺 EU | **EU AI Act** | Mandatory requirements for High-Risk AI. |
| 🏦 Finance | **SR 11-7 (MRM)** | Critical for Banking & Fintech hiring. |
| 🇨🇦 Canada | **AIDA** | Emerging harm-reduction laws. |
| 🇸🇬 APAC | **Singapore Model** | Governance leadership in Asia. |

---

## ⚡ How to Use the Dashboard

### 1. The Maturity Engine (Assess)

Go to the **"Control Map"** tab. Instead of a binary "Yes/No," we use the **CMMI Maturity Scale (0-5)**:

- **Level 0 (Non-Existent):** No process in place.
- **Level 3 (Defined):** Documented, standard process exists.
- **Level 5 (Optimized):** Continuous, automated improvement.

> **🧠 Pro Tip:** Use the Remediation text area to log evidence (e.g., links to Jira tickets or Pen Test reports).

### 2. The Cross-Walk Matrix (Visualize)

Go to the **"Network"** tab. This interactive heatmap shows **Regulatory Convergence**.

- *Example:* If you implement **"Data Drift Detection,"** the matrix shows you are simultaneously satisfying `NIST MEASURE 2.7`, `ISO Annex A.9`, and `SR 11-7`.

### 3. The Gap Analysis (Audit)

Go to the **"Gap Analysis"** tab. This simulates a 3rd-party audit. You can upload a JSON manifest of your current controls, and the system will instantly flag **Critical Gaps**.

- *Example:* "You have Model Monitoring, but you are missing a Decommissioning Plan required by ISO 42001."

---

## 🔒 Security & Architecture

- **Client-Side Only:** This tool runs entirely in your browser. No data is sent to the cloud.
- **Open Source:** The code is transparent and available for audit.

---

### 📚 Related Resources

- [View the GitHub Repository](https://github.com/thankcheeses/ai-governance-map)

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