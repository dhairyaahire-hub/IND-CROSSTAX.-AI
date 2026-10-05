# 🇮🇳 IND CROSSTAX AI — Cross-Border Tax & Transfer Pricing Advisory Engine

[![Vercel Deployment](https://img.shields.io/badge/Live%20URL-ind--crosstax--ai.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://ind-crosstax-ai.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **Official Permanent Web Application URL:**  
> 🔗 **[https://ind-crosstax-ai.vercel.app](https://ind-crosstax-ai.vercel.app)**
>
> **Interactive Video Demo Link:**  
> 🎬 **[https://ind-crosstax-ai.vercel.app/?view=video](https://ind-crosstax-ai.vercel.app/?view=video)**

---

## 🚀 1-Click Deploy to Vercel

Deploy your own copy of IND CROSSTAX AI with your custom domain in 60 seconds:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdhairyaahire%2Find-crosstax-ai&project-name=ind-crosstax-ai&repository-name=ind-crosstax-ai)

### Manual Setup on Vercel:
1. Fork or push this repository to your GitHub account (`github.com/YOUR_USERNAME/ind-crosstax-ai`).
2. Log into [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Set the Project Name to **`ind-crosstax-ai`** (this automatically gives you **`https://ind-crosstax-ai.vercel.app`**).
5. Build settings are auto-detected via `vercel.json`:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**. Your app is live with 100% global uptime on Vercel's Edge Network!

---

## 🌟 Core Features

- 🇮🇳 **Indian Chapter X & 2025 Direct Tax Code Engine:**
  - Evaluates Sections 92 to 92F of the Indian Income-tax Act.
  - Safe Harbour Rule 10TD compliance brackets (17% / 18% / 24% for IT/KPO).
  - Form 3CEB Accountant certification triggers and Local File (Rule 10D) audit checks.
- 🌍 **Bilateral DTAA Relief & Withholding Mitigation:**
  - Full treaty matrix for India &harr; US, UK, Singapore, UAE, Germany, Japan, Australia, Canada, Netherlands, and Switzerland.
  - Withholding tax (WHT) mitigation on Royalties & Fees for Technical Services (FTS / FIS).
  - Article 5 Permanent Establishment (PE) exposure calculator (Fixed Place, Service PE, Agency PE).
  - "Make Available" clause defense analysis under DTAA Article 12.
- 💱 **Automated Real-Time Interbank Currency Converter:**
  - Live real-time exchange rates (USD &harr; INR, EUR &harr; INR, SGD &harr; INR, AED &harr; INR, etc.).
  - CBDT Rule 115 SBI TT Buying Rate standard verification.
  - Instant parity calculations for annual invoiced revenue and operating cost bases.
- ⚖️ **Arm's Length Benchmark Calculator (OECD & Indian TP):**
  - Most Appropriate Method (MAM) engine: TNMM, CUP, Cost Plus (CPM), Resale Price (RPM), Profit Split (PSM).
  - Interquartile 35th to 65th percentile range modeling.
- 📄 **Statutory Drafts & Automation:**
  - Form 10F Electronic Self-Declaration generator.
  - Tax Residency Certificate (TRC) Section 90(4) tracker.
  - Automated Transfer Pricing Local File dossier generator (.docx / Word export).
  - Client outreach and automated CA advisory email templates.
- 🎬 **Integrated Interactive Video Presentation Portal:**
  - Full audiovisual tutorial walkthrough of cross-border DTAA calculations.
  - Downloadable offline standalone HTML player (`IND-CROSSTAX-AI-Video-Demo.html`).

---

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/dhairyaahire/ind-crosstax-ai.git
cd ind-crosstax-ai

# Install dependencies
npm install

# Start the full-stack development server
npm run dev
```

Visit `http://localhost:3000` to access the application.

---

## 📦 Production Build

```bash
# Build Vite client & Node server
npm run build

# Start production server
node server.js
```

---

## 🌐 Custom Domain Mapping (`crosstax.ai` / `indcrosstax.in`)

To connect a custom domain on Vercel:
1. Navigate to **Project Settings &rarr; Domains** on Vercel.
2. Add your domain (e.g., `crosstax.ai`).
3. Set your DNS records at your registrar using the pre-configured `crosstax.ai.zone` zone file in this repo:
   - **Type A**: `@` &rarr; `76.76.21.21` (Vercel Anycast IP)
   - **Type CNAME**: `www` &rarr; `cname.vercel-dns.com`

---

## 📄 License
This project is open-source under the MIT License.
