import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const FONT_BOLD = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf';
const FONT_REG = '/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf';

function buildPamphlet1() {
  const out = path.resolve('public/pamphlet-1-b2b-sales.png');
  console.log('Generating Pamphlet 1 (B2B Enterprise Client Flyer)...');

  const cmd = `convert -size 1200x1600 xc:"#030712" \\
    -fill "#0f172a" -draw "roundrectangle 50,50 1150,1550 30,30" \\
    -stroke "#1e293b" -strokewidth 3 -fill none -draw "roundrectangle 50,50 1150,1550 30,30" \\
    -stroke none \\
    -fill "#f59e0b" -draw "roundrectangle 80,80 320,130 15,15" \\
    -fill "#030712" -font "${FONT_BOLD}" -pointsize 22 -annotate +100+112 "B2B SALES FLYER" \\
    -fill "#94a3b8" -font "${FONT_BOLD}" -pointsize 20 -annotate +350+112 "OFFICIAL CLIENT BROCHURE" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 56 -annotate +80+210 "IND CROSSTAX AI" \\
    -fill "#ef4444" -font "${FONT_BOLD}" -pointsize 56 -annotate +610+210 "TREATY RELIEF" \\
    -fill "#38bdf8" -font "${FONT_BOLD}" -pointsize 28 -annotate +80+260 "Automate Bilateral DTAA & Transfer Pricing Compliance" \\
    -fill "#ef444422" -draw "roundrectangle 80,300 1120,430 20,20" \\
    -stroke "#ef444466" -strokewidth 2 -fill none -draw "roundrectangle 80,300 1120,430 20,20" \\
    -stroke none \\
    -fill "#ef4444" -font "${FONT_BOLD}" -pointsize 26 -annotate +110+345 "THE PROBLEM: 15% - 20% TAX LEAKAGE ON OVERSEAS INVOICES" \\
    -fill "#e2e8f0" -font "${FONT_BOLD}" -pointsize 20 -annotate +110+395 "Foreign clients deduct 20% to 30% taxes on US, UK & Singapore tech invoices." \\
    -fill "#10b98122" -draw "roundrectangle 80,460 1120,590 20,20" \\
    -stroke "#10b98166" -strokewidth 2 -fill none -draw "roundrectangle 80,460 1120,590 20,20" \\
    -stroke none \\
    -fill "#10b981" -font "${FONT_BOLD}" -pointsize 26 -annotate +110+505 "THE SOLUTION: AUTOMATED DTAA ZERO TAX OPTIMIZATION" \\
    -fill "#e2e8f0" -font "${FONT_BOLD}" -pointsize 20 -annotate +110+555 "Reclaim deductions down to 0% - 10% under 85+ bilateral tax conventions." \\
    -fill "#1e293b" -draw "roundrectangle 80,620 1120,1100 24,24" \\
    -fill "#f59e0b" -font "${FONT_BOLD}" -pointsize 26 -annotate +110+670 "CORE PLATFORM CAPABILITIES FOR ENTERPRISES" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 22 -annotate +110+730 "[x] 85+ Bilateral Treaties: USA, UK, Singapore, UAE, Germany, Japan, Netherlands" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 22 -annotate +110+800 "[x] Indian Section 92C Chapter X: Instant Arm's Length Range (17% - 24%)" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 22 -annotate +110+870 "[x] 1-Click Form 10F Generation: Ready for Indian Income Tax E-filing Portal" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 22 -annotate +110+940 "[x] No-PE & Beneficial Ownership Declarations in Word (.docx) & PDF" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 22 -annotate +110+1010 "[x] 95% Advisory Time Saved: From 14 days of research to 3 minutes" \\
    -fill "#0284c722" -draw "roundrectangle 80,1130 1120,1320 20,20" \\
    -stroke "#0284c766" -strokewidth 2 -fill none -draw "roundrectangle 80,1130 1120,1320 20,20" \\
    -stroke none \\
    -fill "#38bdf8" -font "${FONT_BOLD}" -pointsize 28 -annotate +110+1180 "MEASURABLE ROI FOR YOUR CLIENTS" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 22 -annotate +110+1235 "* Save $15,000 to $200,000+ per foreign contract annually" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 22 -annotate +110+1285 "* Zero transfer pricing audit penalties & secondary adjustments" \\
    -fill "#ef4444" -draw "roundrectangle 80,1350 1120,1500 24,24" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 32 -annotate +260+1415 "START FREE AUDIT DOSSIER NOW" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 22 -annotate +330+1460 "Visit: ind-crosstax-ai.vercel.app" \\
    "${out}"`;

  execSync(cmd);
  console.log('Pamphlet 1 created successfully:', out);
}

function buildPamphlet2() {
  const out = path.resolve('public/pamphlet-2-ca-partner.png');
  console.log('Generating Pamphlet 2 (Chartered Accountant & Tax Professional Partner Flyer)...');

  const cmd = `convert -size 1200x1600 xc:"#020617" \\
    -fill "#0b1120" -draw "roundrectangle 50,50 1150,1550 30,30" \\
    -stroke "#1e293b" -strokewidth 3 -fill none -draw "roundrectangle 50,50 1150,1550 30,30" \\
    -stroke none \\
    -fill "#10b981" -draw "roundrectangle 80,80 440,130 15,15" \\
    -fill "#020617" -font "${FONT_BOLD}" -pointsize 22 -annotate +100+112 "FOR CHARTERED ACCOUNTANTS" \\
    -fill "#94a3b8" -font "${FONT_BOLD}" -pointsize 20 -annotate +470+112 "TAX FIRM PARTNER FLYER" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 54 -annotate +80+210 "CHARTERED ACCOUNTANT" \\
    -fill "#f59e0b" -font "${FONT_BOLD}" -pointsize 54 -annotate +770+210 "TOOLKIT" \\
    -fill "#a5b4fc" -font "${FONT_BOLD}" -pointsize 28 -annotate +80+260 "Indian Chapter X Transfer Pricing & Cross-Border DTAA Advisory" \\
    -fill "#6366f122" -draw "roundrectangle 80,300 1120,440 20,20" \\
    -stroke "#6366f166" -strokewidth 2 -fill none -draw "roundrectangle 80,300 1120,440 20,20" \\
    -stroke none \\
    -fill "#818cf8" -font "${FONT_BOLD}" -pointsize 26 -annotate +110+350 "EXPAND YOUR INTERNATIONAL TAX PRACTICE" \\
    -fill "#e2e8f0" -font "${FONT_BOLD}" -pointsize 20 -annotate +110+395 "Provide Fortune-500 level cross-border tax advice to your SME & startup clients." \\
    -fill "#94a3b8" -font "${FONT_BOLD}" -pointsize 18 -annotate +110+425 "Eliminate manual treaty cross-referencing and jurisprudence bottlenecks." \\
    -fill "#1e293b" -draw "roundrectangle 80,470 1120,1050 24,24" \\
    -fill "#f59e0b" -font "${FONT_BOLD}" -pointsize 26 -annotate +110+520 "STATUTORY COMPLIANCE DELIVERABLES GENERATED IN 3 MINS" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 22 -annotate +110+580 "[1] Form 10F Electronic Filing Draft (CBDT Rule 21AB Compliant)" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 22 -annotate +110+650 "[2] No-PE & Beneficial Ownership Legal Declarations" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 22 -annotate +110+720 "[3] Form 3CEB Transfer Pricing Accountant Briefing Dossier" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 22 -annotate +110+790 "[4] Safe Harbour Rule 10TD Margin Verification (17% to 24%)" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 22 -annotate +110+860 "[5] Bank Remittance Ready Form 15CA/CB Treaty Reference Sheet" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 22 -annotate +110+930 "[6] Downloadable in Official Microsoft Word (.docx) & PDF Formats" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 22 -annotate +110+1000 "[7] 85+ Bilateral Tax Treaties Fully Indexed & Grounded in Law" \\
    -fill "#10b98122" -draw "roundrectangle 80,1080 1120,1320 20,20" \\
    -stroke "#10b98166" -strokewidth 2 -fill none -draw "roundrectangle 80,1080 1120,1320 20,20" \\
    -stroke none \\
    -fill "#34d399" -font "${FONT_BOLD}" -pointsize 26 -annotate +110+1130 "WHY TAX PROFESSIONALS TRUST IND CROSSTAX AI" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 20 -annotate +110+1180 "* Built strictly on Indian Section 90, 92C & OECD 2022 Guidelines" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 20 -annotate +110+1225 "* Trusted by corporate finance desks, independent CAs, and exporters" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 20 -annotate +110+1270 "* Protects clients against reassessment notices and secondary adjustments" \\
    -fill "#16a34a" -draw "roundrectangle 80,1350 1120,1500 24,24" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 32 -annotate +290+1415 "ACCESS CA ADVISORY PORTAL" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 22 -annotate +330+1460 "Visit: ind-crosstax-ai.vercel.app" \\
    "${out}"`;

  execSync(cmd);
  console.log('Pamphlet 2 created successfully:', out);
}

function buildPamphlet3() {
  const out = path.resolve('public/pamphlet-3-features-roi.png');
  console.log('Generating Pamphlet 3 (Features & ROI Quick Summary Sheet)...');

  const cmd = `convert -size 1200x1600 xc:"#030712" \\
    -fill "#0f172a" -draw "roundrectangle 50,50 1150,1550 30,30" \\
    -stroke "#334155" -strokewidth 3 -fill none -draw "roundrectangle 50,50 1150,1550 30,30" \\
    -stroke none \\
    -fill "#38bdf8" -draw "roundrectangle 80,80 380,130 15,15" \\
    -fill "#030712" -font "${FONT_BOLD}" -pointsize 22 -annotate +100+112 "EXECUTIVE SUMMARY" \\
    -fill "#94a3b8" -font "${FONT_BOLD}" -pointsize 20 -annotate +410+112 "CROSS-BORDER TAX SAVINGS" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 52 -annotate +80+210 "WHY ENTERPRISES CHOOSE" \\
    -fill "#f59e0b" -font "${FONT_BOLD}" -pointsize 52 -annotate +80+270 "IND CROSSTAX AI" \\
    -fill "#94a3b8" -font "${FONT_BOLD}" -pointsize 24 -annotate +80+320 "The Complete Bilateral Tax Treaty & Transfer Pricing Suite" \\
    -fill "#1e293b" -draw "roundrectangle 80,360 580,680 20,20" \\
    -fill "#ef4444" -font "${FONT_BOLD}" -pointsize 24 -annotate +110+410 "OLD MANUAL METHOD" \\
    -fill "#94a3b8" -font "${FONT_BOLD}" -pointsize 19 -annotate +110+460 "- 10 to 14 days research" \\
    -fill "#94a3b8" -font "${FONT_BOLD}" -pointsize 19 -annotate +110+510 "- Manual treaty lookup" \\
    -fill "#94a3b8" -font "${FONT_BOLD}" -pointsize 19 -annotate +110+560 "- High audit scrutiny risk" \\
    -fill "#94a3b8" -font "${FONT_BOLD}" -pointsize 19 -annotate +110+610 "- Expensive advisory fees" \\
    -fill "#064e3b" -draw "roundrectangle 620,360 1120,680 20,20" \\
    -fill "#34d399" -font "${FONT_BOLD}" -pointsize 24 -annotate +650+410 "WITH IND CROSSTAX AI" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 19 -annotate +650+460 "+ 3 minutes instant audit" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 19 -annotate +650+510 "+ 85+ treaties pre-indexed" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 19 -annotate +650+560 "+ CBDT Safe Harbour verified" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 19 -annotate +650+610 "+ One-click legal export" \\
    -fill "#1e293b" -draw "roundrectangle 80,720 1120,1160 24,24" \\
    -fill "#f59e0b" -font "${FONT_BOLD}" -pointsize 26 -annotate +110+770 "PROVEN FINANCIAL IMPACT ACROSS CLIENT TRANSACTIONS" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 21 -annotate +110+830 "* Software & SaaS Exports: Withholding drops from 20% to 0% (USA/Singapore)" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 21 -annotate +110+890 "* IT Technical Services: Safe Harbour Rule 10TD margin locked at 17% - 18%" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 21 -annotate +110+950 "* Management & Royalty Fees: Article 12 relief reduces tax from 20% to 10%" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 21 -annotate +110+1010 "* Intercompany Loans: Arm's length interest rates aligned with SBI Base Rate" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 21 -annotate +110+1070 "* Direct Savings: $15,000 to $200,000+ reclaimed per corporate client" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 21 -annotate +110+1130 "* Bank & Statutory Ready: Accepted by foreign banks and Indian tax desks" \\
    -fill "#1e1b4b" -draw "roundrectangle 80,1190 1120,1320 20,20" \\
    -stroke "#6366f1" -strokewidth 2 -fill none -draw "roundrectangle 80,1190 1120,1320 20,20" \\
    -stroke none \\
    -fill "#a5b4fc" -font "${FONT_BOLD}" -pointsize 26 -annotate +110+1240 "WATCH THE OFFICIAL VIDEO WALKTHROUGH" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 20 -annotate +110+1285 "Watch the 2-minute tutorial online: ind-crosstax-ai.vercel.app/demo" \\
    -fill "#2563eb" -draw "roundrectangle 80,1350 1120,1500 24,24" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 32 -annotate +310+1415 "TRY LIVE CALCULATOR" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 22 -annotate +330+1460 "Visit: ind-crosstax-ai.vercel.app" \\
    "${out}"`;

  execSync(cmd);
  console.log('Pamphlet 3 created successfully:', out);
}

function main() {
  buildPamphlet1();
  buildPamphlet2();
  buildPamphlet3();
  console.log('All 3 marketing pamphlets generated successfully in public/ !');
}

main();
