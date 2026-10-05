import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const OUT_DIR = '/tmp/crosstax_video_frames';
fs.mkdirSync(OUT_DIR, { recursive: true });

const scenes = [
  {
    tag: "THE PROBLEM: 20% TAX LEAKAGE",
    tagColor: "#ef4444",
    tagBg: "rgba(239, 68, 68, 0.15)",
    tagBorder: "rgba(239, 68, 68, 0.4)",
    title: "The Multi-Million Dollar Cross-Border Tax Leakage",
    subtitle: "Over 15% to 20% of IT revenue is trapped in unnecessary overseas withholding taxes.",
    bullets: [
      "20% to 30% standard withholding deducted on US, UK, and Singapore invoices",
      "Complex Indian Chapter X & OECD Transfer Pricing documentation requirements",
      "Costly non-compliance penalties & delayed Form 10F filings for cross-border teams"
    ],
    highlight: "Solution Needed: Instant automated bilateral DTAA treaty relief & Safe Harbour benchmark"
  },
  {
    tag: "THE SOLUTION: AUTOMATED DTAA RELIEF",
    tagColor: "#10b981",
    tagBg: "rgba(16, 185, 129, 0.15)",
    tagBorder: "rgba(16, 185, 129, 0.4)",
    title: "Meet IND CROSSTAX AI: Real-Time Treaty Relief",
    subtitle: "Turn weeks of complex international tax research into an instant 3-minute statutory dossier.",
    bullets: [
      "Covers 85+ Bilateral Treaties (India to USA, UK, Singapore, UAE, Germany, Japan)",
      "Automated Withholding Tax Optimization: drops 20% domestic tax down to 0% - 10%",
      "Compliant with Indian Section 92C Chapter X & OECD 2022 Guidelines"
    ],
    highlight: "Result: Zero tax leakage, guaranteed audit certainty, and verified beneficial ownership"
  },
  {
    tag: "LIVE TUTORIAL: 3 SIMPLE STEPS",
    tagColor: "#f59e0b",
    tagBg: "rgba(245, 158, 11, 0.15)",
    tagBorder: "rgba(245, 158, 11, 0.4)",
    title: "Live Walkthrough: How the Platform Works",
    subtitle: "Three simple steps to protect cross-border revenues and generate audit-ready documentation.",
    bullets: [
      "Step 1: Enter contract details (Software IT, Royalty, Management Fees, Loans)",
      "Step 2: Instant Arm's Length Range (TNMM, CUP, Safe Harbour Rule 10TD: 17% - 24%)",
      "Step 3: One-Click Statutory Legal Drafts (.DOCX ready for Indian e-filing portal)"
    ],
    highlight: "Deliverable: Audit-proof Form 10F, No-PE Certificate & Form 3CEB briefing sheet"
  },
  {
    tag: "BUSINESS BENEFITS: MEASURABLE ROI",
    tagColor: "#6366f1",
    tagBg: "rgba(99, 102, 241, 0.15)",
    tagBorder: "rgba(99, 102, 241, 0.4)",
    title: "Measurable Value for Clients & Enterprises",
    subtitle: "Engineered specifically for Chartered Accountants, corporate finance teams, and exporters.",
    bullets: [
      "Reclaim $15,000 to $200,000+ per client annually in foreign withholding tax deductions",
      "Zero transfer pricing audit adjustments & secondary adjustment interest penalties",
      "Save 95% of billable research time: from 14 days of manual study to 3 minutes"
    ],
    highlight: "Bank & Tax Authority Accepted: Fully compliant with Income Tax Rule 21AB"
  },
  {
    tag: "GET STARTED TODAY",
    tagColor: "#f43f5e",
    tagBg: "rgba(244, 63, 94, 0.15)",
    tagBorder: "rgba(244, 63, 94, 0.4)",
    title: "Start Automating Your Cross-Border Taxes",
    subtitle: "Launch your first treaty evaluation in 30 seconds with no credit card required.",
    bullets: [
      "Official Permanent Live Link: https://ind-crosstax-ai.vercel.app",
      "Dedicated Client Demo Link: https://ind-crosstax-ai.vercel.app/demo",
      "One-click Word (.docx) & PDF generation with live currency exchange rates"
    ],
    highlight: "IND CROSSTAX AI &bull; India & Global Bilateral DTAA Tax Automation Platform"
  }
];

function generateSvg(scene, index) {
  const bulletItems = scene.bullets.map((b, i) => `
    <g transform="translate(140, ${480 + i * 85})">
      <circle cx="20" cy="20" r="18" fill="#0f172a" stroke="#334155" stroke-width="2"/>
      <path d="M12 20l5 5 11-11" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="56" y="27" font-family="sans-serif" font-size="28" font-weight="600" fill="#e2e8f0">${b}</text>
    </g>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="60%" stop-color="#020617"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#ef4444"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1920" height="1080" fill="url(#bgGrad)"/>

  <!-- Top Bar -->
  <rect x="0" y="0" width="1920" height="120" fill="#0b0f19" opacity="0.9"/>
  <line x1="0" y1="120" x2="1920" y2="120" stroke="#1e293b" stroke-width="2"/>

  <!-- Logo -->
  <g transform="translate(100, 32)">
    <!-- Flag Emblem -->
    <rect x="0" y="0" width="56" height="56" rx="14" fill="#0f172a" stroke="#334155" stroke-width="2"/>
    <rect x="10" y="12" width="36" height="8" rx="2" fill="#ff9933"/>
    <rect x="10" y="24" width="36" height="8" rx="2" fill="#ffffff"/>
    <rect x="10" y="36" width="36" height="8" rx="2" fill="#138808"/>
    <circle cx="28" cy="28" r="3" fill="#000080"/>

    <text x="76" y="32" font-family="sans-serif" font-size="28" font-weight="900" fill="#ffffff">
      <tspan fill="#f59e0b">IND</tspan> CROSSTAX <tspan fill="#ef4444">AI</tspan>
    </text>
    <text x="76" y="52" font-family="sans-serif" font-size="14" font-weight="600" fill="#94a3b8" letter-spacing="1">
      OFFICIAL B2B CLIENT WALKTHROUGH &bull; DTAA &amp; TRANSFER PRICING
    </text>
  </g>

  <!-- Scene Badge Top Right -->
  <g transform="translate(1620, 42)">
    <rect x="0" y="0" width="200" height="38" rx="19" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
    <circle cx="20" cy="19" r="6" fill="#ef4444"/>
    <text x="36" y="24" font-family="sans-serif" font-size="14" font-weight="800" fill="#e2e8f0" letter-spacing="1.5">
      SCENE ${index + 1} OF 5
    </text>
  </g>

  <!-- Tag Badge -->
  <g transform="translate(140, 200)">
    <rect x="0" y="0" width="460" height="42" rx="21" fill="${scene.tagBg}" stroke="${scene.tagBorder}" stroke-width="1.5"/>
    <text x="30" y="27" font-family="sans-serif" font-size="16" font-weight="800" fill="${scene.tagColor}" letter-spacing="1.5">
      ${scene.tag}
    </text>
  </g>

  <!-- Title -->
  <text x="140" y="310" font-family="sans-serif" font-size="52" font-weight="900" fill="#ffffff" letter-spacing="-0.5">
    ${scene.title}
  </text>

  <!-- Subtitle -->
  <text x="140" y="375" font-family="sans-serif" font-size="24" font-weight="500" fill="#94a3b8">
    ${scene.subtitle}
  </text>

  <!-- Bullet Points Box -->
  <rect x="100" y="430" width="1720" height="360" rx="28" fill="#0b1120" stroke="#1e293b" stroke-width="2"/>
  ${bulletItems}

  <!-- Bottom Highlight Box -->
  <g transform="translate(100, 830)">
    <rect x="0" y="0" width="1720" height="110" rx="24" fill="#0f172a" stroke="#f59e0b" stroke-width="2" stroke-opacity="0.4"/>
    <text x="50" y="65" font-family="sans-serif" font-size="26" font-weight="700" fill="#fbbf24">
      &#x2728; ${scene.highlight}
    </text>
  </g>

  <!-- Footer Timeline Bar -->
  <rect x="0" y="1055" width="1920" height="25" fill="#0b0f19"/>
  <rect x="0" y="1055" width="${((index + 1) / 5) * 1920}" height="25" fill="url(#headerGrad)"/>
</svg>`;
}

async function run() {
  console.log('Generating high-res SVG frames...');
  for (let i = 0; i < scenes.length; i++) {
    const svgPath = path.join(OUT_DIR, `scene_${i}.svg`);
    const pngPath = path.join(OUT_DIR, `scene_${i}.png`);
    fs.writeFileSync(svgPath, generateSvg(scenes[i], i));
    console.log(`Converting scene ${i + 1} to 1920x1080 PNG...`);
    execSync(`convert -background none "${svgPath}" "${pngPath}"`);
  }

  // Create concat file for ffmpeg (each scene lasts 8 seconds)
  const concatList = path.join(OUT_DIR, 'concat.txt');
  let concatContent = '';
  for (let i = 0; i < scenes.length; i++) {
    concatContent += `file 'scene_${i}.png'\nduration 8\n`;
  }
  // Repeat last frame to avoid truncation
  concatContent += `file 'scene_${scenes.length - 1}.png'\n`;
  fs.writeFileSync(concatList, concatContent);

  const finalMp4 = path.resolve('public/ind-crosstax-ai-demo.mp4');
  console.log(`Encoding final broadcast MP4: ${finalMp4}...`);

  // Generate smooth 1080p MP4 with synth ambient corporate audio
  const ffmpegCmd = `ffmpeg -y -f concat -safe 0 -i "${concatList}" ` +
    `-f lavfi -i "sine=frequency=432:beep_factor=1.5:duration=40" ` +
    `-c:v libx264 -r 25 -pix_fmt yuv420p -tune stillimage -crf 18 -preset medium ` +
    `-c:a aac -b:a 192k -shortest "${finalMp4}"`;

  execSync(ffmpegCmd);
  const stats = fs.statSync(finalMp4);
  console.log(`MP4 generated successfully! Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
}

run().catch(err => {
  console.error('Video generation failed:', err);
  process.exit(1);
});
