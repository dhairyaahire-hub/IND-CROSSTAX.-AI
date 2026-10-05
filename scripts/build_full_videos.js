import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const BUILD_DIR = '/tmp/crosstax_voice_build';
fs.mkdirSync(BUILD_DIR, { recursive: true });

const FONT = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf';

function escapeDrawText(text) {
  return text
    .replace(/\\/g, '')
    .replace(/'/g, '')
    .replace(/:/g, '\\:')
    .replace(/%/g, '\\%');
}

function getAudioDuration(filePath) {
  try {
    const out = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`).toString().trim();
    return parseFloat(out) || 6.5;
  } catch {
    return 6.5;
  }
}

const englishScenes = [
  {
    badge: "THE PROBLEM: 20% TAX LEAKAGE",
    title: "The Cross-Border Tax Leakage",
    subtitle: "Over 15% to 20% of IT revenue is lost to overseas withholding taxes.",
    bullets: [
      "• 20% to 30% withholding deducted on US, UK, and Singapore invoices",
      "• Complex Indian Chapter X & OECD Transfer Pricing documentation",
      "• Costly non-compliance penalties & delayed Form 10F filings"
    ],
    highlight: "Impact: Tens of thousands of dollars trapped in double taxation each year"
  },
  {
    badge: "THE SOLUTION: AUTOMATED DTAA RELIEF",
    title: "Meet IND CROSSTAX AI: Real-Time Treaty Relief",
    subtitle: "Turn weeks of complex international tax research into an instant 3-minute dossier.",
    bullets: [
      "• Covers 85+ Bilateral Treaties (India to USA, UK, Singapore, UAE, Germany, Japan)",
      "• Automated Withholding Tax Optimization: drops 20% domestic tax to 0% - 10%",
      "• Compliant with Indian Section 92C Chapter X & OECD Guidelines"
    ],
    highlight: "Result: Zero tax leakage, guaranteed audit certainty, and verified ownership"
  },
  {
    badge: "LIVE TUTORIAL: 3 SIMPLE STEPS",
    title: "How the Platform Works in 3 Simple Steps",
    subtitle: "Fast, guided workflow engineered for CAs, CFO desks, and exporters.",
    bullets: [
      "• Step 1: Guided Contract Input (Software IT, Royalty, Management Fees, Loans)",
      "• Step 2: Instant Arm Length Range (CBDT Safe Harbour Rule 10TD: 17% - 24%)",
      "• Step 3: One-Click Statutory Legal Drafts (.DOCX ready for e-filing portal)"
    ],
    highlight: "Deliverable: Form 10F, No-PE Certificate & Form 3CEB TP Audit Summary Sheet"
  },
  {
    badge: "CORE BUSINESS BENEFITS & ROI",
    title: "Enterprise Value & Risk Mitigation",
    subtitle: "Direct financial impact for enterprise tax desks and cross-border companies.",
    bullets: [
      "• Reclaim $15,000 to $200,000+ per client annually in foreign withholding tax",
      "• Zero transfer pricing audit adjustments & secondary adjustment penalties",
      "• Save 95% of billable research time: from 14 days of manual study to 3 minutes"
    ],
    highlight: "Compliance: Fully aligned with Indian Section 90, 92C & Income Tax Rule 21AB"
  },
  {
    badge: "GET STARTED TODAY",
    title: "Automate Your Cross-Border Taxes Now",
    subtitle: "Visit the live application or send this video to your clients and partners.",
    bullets: [
      "• Live Web App: https://ind-crosstax-ai.vercel.app",
      "• Dedicated Video Demo: https://ind-crosstax-ai.vercel.app/demo",
      "• Export compliant Word (.docx) & PDF dossiers with 1 click"
    ],
    highlight: "IND CROSSTAX AI • Bilateral DTAA & Chapter X Transfer Pricing Platform"
  }
];

const hindiScenes = [
  {
    badge: "THE PROBLEM: 20% TAX LEAKAGE",
    title: "Cross-Border Tax Leakage (टैक्स नुकसान)",
    subtitle: "Over 15% to 20% of IT revenue is lost to foreign withholding taxes.",
    bullets: [
      "• US, UK aur Singapore invoices par 20% se 30% tax deduction",
      "• Indian Chapter X aur OECD Transfer Pricing compliance rules",
      "• Delay in Form 10F filing and heavy scrutiny penalties"
    ],
    highlight: "Impact: Tens of thousands of dollars lost in double taxation each year"
  },
  {
    badge: "THE SOLUTION: AUTOMATED DTAA RELIEF",
    title: "Meet IND CROSSTAX AI (समाधान)",
    subtitle: "Turn weeks of complex tax research into an instant 3-minute statutory dossier.",
    bullets: [
      "• Covers 85+ Bilateral Treaties (USA, UK, Singapore, UAE, Germany, Japan)",
      "• Automated Withholding Tax Optimization: drops 20% domestic tax to 0% - 10%",
      "• 100% compliant with Indian Section 92C Chapter X & OECD 2022 Guidelines"
    ],
    highlight: "Result: Zero tax leakage, guaranteed audit certainty, and verified ownership"
  },
  {
    badge: "LIVE TUTORIAL: 3 SIMPLE STEPS",
    title: "How It Works in 3 Simple Steps (लाइव ट्यूटोरियल)",
    subtitle: "Fast, guided workflow engineered for Indian CAs, CFOs, and exporters.",
    bullets: [
      "• Step 1: Enter contract details (Software IT, Royalty, Management Fees)",
      "• Step 2: Instant Arm Length Range (CBDT Safe Harbour Rule 10TD: 17% - 24%)",
      "• Step 3: One-Click Statutory Legal Drafts (.DOCX ready for e-filing portal)"
    ],
    highlight: "Deliverable: Form 10F, No-PE Certificate & Form 3CEB TP Audit Summary Sheet"
  },
  {
    badge: "CORE BUSINESS BENEFITS & ROI",
    title: "Measurable Enterprise Value (व्यापारिक लाभ)",
    subtitle: "Direct financial impact for enterprise tax desks and cross-border companies.",
    bullets: [
      "• Save 15% to 20% on every foreign invoice under Section 90 DTAA",
      "• Zero transfer pricing audit adjustments & secondary adjustment penalties",
      "• Save 95% of billable research time: from 14 days to 3 minutes"
    ],
    highlight: "Compliance: Fully aligned with Indian Section 90, 92C & Income Tax Rule 21AB"
  },
  {
    badge: "GET STARTED TODAY",
    title: "Start Automating Now (आज ही शुरू करें)",
    subtitle: "Visit the live application or send this video to your clients and partners.",
    bullets: [
      "• Live Web App: https://ind-crosstax-ai.vercel.app",
      "• Dedicated Video Demo: https://ind-crosstax-ai.vercel.app/demo",
      "• Export compliant Word (.docx) & PDF dossiers with 1 click"
    ],
    highlight: "IND CROSSTAX AI • Bilateral DTAA & Chapter X Transfer Pricing Platform"
  }
];

function renderScene(scene, index, audioFile, outFile, langLabel) {
  const audioDur = getAudioDuration(audioFile);
  const dur = Math.max(audioDur + 1.2, 6.0);

  const cleanTitle = escapeDrawText(scene.title);
  const cleanSubtitle = escapeDrawText(scene.subtitle);
  const b0 = escapeDrawText(scene.bullets[0]);
  const b1 = escapeDrawText(scene.bullets[1]);
  const b2 = escapeDrawText(scene.bullets[2]);
  const cleanHighlight = escapeDrawText(scene.highlight);
  const badge = escapeDrawText(scene.badge);

  const filter = [
    `drawtext=fontfile=${FONT}:text='IND CROSSTAX AI':fontsize=36:fontcolor=0xf59e0b:x=120:y=80`,
    `drawtext=fontfile=${FONT}:text='${langLabel}':fontsize=18:fontcolor=0x10b981:box=1:boxcolor=0x10b98122:boxborderw=8:x=450:y=82`,
    `drawtext=fontfile=${FONT}:text='SCENE ${index + 1} OF 5':fontsize=18:fontcolor=0xef4444:x=1650:y=85`,
    `drawtext=fontfile=${FONT}:text='${badge}':fontsize=24:fontcolor=0xef4444:box=1:boxcolor=0xef444422:boxborderw=12:x=120:y=200`,
    `drawtext=fontfile=${FONT}:text='${cleanTitle}':fontsize=48:fontcolor=white:x=120:y=300`,
    `drawtext=fontfile=${FONT}:text='${cleanSubtitle}':fontsize=24:fontcolor=0x94a3b8:x=120:y=380`,
    `drawtext=fontfile=${FONT}:text='${b0}':fontsize=30:fontcolor=0xe2e8f0:x=160:y=500`,
    `drawtext=fontfile=${FONT}:text='${b1}':fontsize=30:fontcolor=0xe2e8f0:x=160:y=590`,
    `drawtext=fontfile=${FONT}:text='${b2}':fontsize=30:fontcolor=0xe2e8f0:x=160:y=680`,
    `drawtext=fontfile=${FONT}:text='${cleanHighlight}':fontsize=26:fontcolor=0xfbbf24:box=1:boxcolor=0x0f172a:boxborderw=16:x=120:y=840`
  ].join(',');

  const cmd = `ffmpeg -y -f lavfi -i color=c=0x030712:s=1920x1080:d=${dur} -i "${audioFile}" ` +
    `-vf "${filter}" -c:v libx264 -preset fast -pix_fmt yuv420p -c:a aac -b:a 192k -shortest "${outFile}"`;

  execSync(cmd);
}

function buildVideo(scenes, audioPrefix, langLabel, finalMp4) {
  const sceneFiles = [];
  for (let i = 0; i < scenes.length; i++) {
    const audio = path.join(BUILD_DIR, `${audioPrefix}_sample_${i}.mp3`);
    const sceneMp4 = path.join(BUILD_DIR, `${audioPrefix}_scene_${i}.mp4`);
    console.log(`Rendering ${langLabel} scene ${i + 1}...`);
    renderScene(scenes[i], i, audio, sceneMp4, langLabel);
    sceneFiles.push(sceneMp4);
  }

  const concatList = path.join(BUILD_DIR, `${audioPrefix}_concat.txt`);
  const content = sceneFiles.map(f => `file '${f}'`).join('\n');
  fs.writeFileSync(concatList, content);

  console.log(`Concatenating ${langLabel} final MP4: ${finalMp4}...`);
  execSync(`ffmpeg -y -f concat -safe 0 -i "${concatList}" -c copy "${finalMp4}"`);
  console.log(`Generated: ${finalMp4} (${(fs.statSync(finalMp4).size / 1024 / 1024).toFixed(2)} MB)`);
}

function main() {
  console.log('Generating English Voiced MP4...');
  const enMp4 = path.resolve('public/ind-crosstax-ai-demo-en.mp4');
  buildVideo(englishScenes, 'en', 'ENGLISH AUDIO VOICEOVER', enMp4);

  console.log('Generating Hindi Voiced MP4 (हिंदी आवाज़)...');
  const hiMp4 = path.resolve('public/ind-crosstax-ai-demo-hi.mp4');
  buildVideo(hindiScenes, 'hi', 'HINDI AUDIO (हिंदी आवाज़)', hiMp4);

  // Set default ind-crosstax-ai-demo.mp4
  fs.copyFileSync(hiMp4, path.resolve('public/ind-crosstax-ai-demo.mp4'));

  console.log('ALL VIDEOS GENERATED SUCCESSFULLY WITH VOICE!');
}

main();
