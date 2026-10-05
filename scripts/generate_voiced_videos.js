import https from 'https';
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

function fetchTtsChunk(text, lang) {
  return new Promise((resolve, reject) => {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      const data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
      res.on('error', reject);
    });
  });
}

async function fetchFullTts(text, lang, outPath) {
  const parts = text.match(/[^.?!।]+[.?!।]+/g) || [text];
  const buffers = [];
  for (const p of parts) {
    const trimmed = p.trim();
    if (trimmed) {
      const buf = await fetchTtsChunk(trimmed, lang);
      buffers.push(buf);
      await new Promise(r => setTimeout(r, 200));
    }
  }
  fs.writeFileSync(outPath, Buffer.concat(buffers));
}

function getAudioDuration(filePath) {
  try {
    const out = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`).toString().trim();
    return parseFloat(out) || 7.0;
  } catch {
    return 7.0;
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
    highlight: "Impact: Tens of thousands of dollars trapped in double taxation each year",
    speech: "Is your cross-border business losing 15 to 20 percent on overseas invoices to foreign withholding taxes? Complex transfer pricing and compliance penalties cost companies millions every year."
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
    highlight: "Result: Zero tax leakage, guaranteed audit certainty, and verified ownership",
    speech: "Meet IND CROSSTAX AI: your automated tax treaty and transfer pricing platform. Covering 85 plus bilateral treaties, reducing domestic withholding taxes down to 0 to 10 percent with full OECD compliance."
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
    highlight: "Deliverable: Form 10F, No-PE Certificate & Form 3CEB TP Audit Summary Sheet",
    speech: "In three simple steps: enter your contract details, calculate instant arm's length ranges under Safe Harbour Rule 10TD, and download statutory Form 10F and No-PE certificates in Word format ready for e-filing."
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
    highlight: "Compliance: Fully aligned with Indian Section 90, 92C & Income Tax Rule 21AB",
    speech: "Stop tax leakage, eliminate audit adjustments, and cut 14 days of manual tax research to just 3 minutes with bank-approved legal filings."
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
    highlight: "IND CROSSTAX AI • Bilateral DTAA & Chapter X Transfer Pricing Platform",
    speech: "Get started today at ind-crosstax-ai.vercel.app. Protect your overseas revenue and simplify international tax compliance now."
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
    highlight: "Impact: Tens of thousands of dollars lost in double taxation each year",
    speech: "क्या आपकी कंपनी विदेशी इनवॉइस पर 15 से 20 प्रतिशत टैक्स कटौती का नुकसान उठा रही है? जटिल ट्रांसफर प्राइसिंग नियम और नोटिस हर साल लाखों रुपये का नुकसान कराते हैं।"
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
    highlight: "Result: Zero tax leakage, guaranteed audit certainty, and verified ownership",
    speech: "पेश है इंड क्रॉसटैक्स एआई। 85 से अधिक देशों के साथ डीटीएए ट्रीटी रिलीफ, जो 20 प्रतिशत विदहोल्डिंग टैक्स को घटाकर शून्य से 10 प्रतिशत तक कम करता है।"
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
    highlight: "Deliverable: Form 10F, No-PE Certificate & Form 3CEB TP Audit Summary Sheet",
    speech: "केवल तीन आसान स्टेप्स में: कॉन्ट्रैक्ट विवरण भरें, सेफ हार्बर रूल 10 टीडी के तहत आर्म्स लेंथ मार्जिन जांचें, और ई-फाइलिंग के लिए फॉर्म 10 एफ और नो-पीई सर्टिफिकेट तुरंत डाउनलोड करें।"
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
    highlight: "Compliance: Fully aligned with Indian Section 90, 92C & Income Tax Rule 21AB",
    speech: "टैक्स लीकेज रोकें, ऑडिट पेनल्टी से बचें, और 14 दिनों के जटिल टैक्स रिसर्च को सिर्फ 3 मिनट में पूरा करें।"
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
    highlight: "IND CROSSTAX AI • Bilateral DTAA & Chapter X Transfer Pricing Platform",
    speech: "आज ही शुरू करें ind-crosstax-ai.vercel.app पर। अपने विदेशी रेवेन्यू को सुरक्षित करें और अंतरराष्ट्रीय टैक्स फाइलिंग आसान बनाएं।"
  }
];

async function renderSceneVideo(scene, index, audioFile, outputFile) {
  const duration = Math.max(Math.ceil(getAudioDuration(audioFile)) + 0.8, 6.0);

  const cleanTitle = escapeDrawText(scene.title);
  const cleanSubtitle = escapeDrawText(scene.subtitle);
  const b0 = escapeDrawText(scene.bullets[0]);
  const b1 = escapeDrawText(scene.bullets[1]);
  const b2 = escapeDrawText(scene.bullets[2]);
  const cleanHighlight = escapeDrawText(scene.highlight);
  const badge = escapeDrawText(scene.badge);

  const filter = [
    `drawtext=fontfile=${FONT}:text='IND CROSSTAX AI':fontsize=36:fontcolor=0xf59e0b:x=120:y=80`,
    `drawtext=fontfile=${FONT}:text='OFFICIAL B2B CLIENT WALKTHROUGH':fontsize=20:fontcolor=0x94a3b8:x=460:y=92`,
    `drawtext=fontfile=${FONT}:text='SCENE ${index + 1} OF 5':fontsize=18:fontcolor=0xef4444:x=1650:y=85`,
    `drawtext=fontfile=${FONT}:text='${badge}':fontsize=24:fontcolor=0xef4444:box=1:boxcolor=0xef444422:boxborderw=12:x=120:y=200`,
    `drawtext=fontfile=${FONT}:text='${cleanTitle}':fontsize=48:fontcolor=white:x=120:y=300`,
    `drawtext=fontfile=${FONT}:text='${cleanSubtitle}':fontsize=24:fontcolor=0x94a3b8:x=120:y=380`,
    `drawtext=fontfile=${FONT}:text='${b0}':fontsize=30:fontcolor=0xe2e8f0:x=160:y=500`,
    `drawtext=fontfile=${FONT}:text='${b1}':fontsize=30:fontcolor=0xe2e8f0:x=160:y=590`,
    `drawtext=fontfile=${FONT}:text='${b2}':fontsize=30:fontcolor=0xe2e8f0:x=160:y=680`,
    `drawtext=fontfile=${FONT}:text='${cleanHighlight}':fontsize=26:fontcolor=0xfbbf24:box=1:boxcolor=0x0f172a:boxborderw=16:x=120:y=840`
  ].join(',');

  const cmd = `ffmpeg -y -f lavfi -i color=c=0x030712:s=1920x1080:d=${duration} -i "${audioFile}" ` +
    `-vf "${filter}" -c:v libx264 -preset fast -pix_fmt yuv420p -c:a aac -b:a 192k -shortest "${outputFile}"`;

  execSync(cmd);
}

async function buildLanguageVideo(scenes, lang, langCode, finalPath) {
  console.log(`\n=== Building ${lang} Voiceover Video ===`);
  const sceneFiles = [];

  for (let i = 0; i < scenes.length; i++) {
    const audioPath = path.join(BUILD_DIR, `${langCode}_audio_${i}.mp3`);
    const sceneVideoPath = path.join(BUILD_DIR, `${langCode}_scene_${i}.mp4`);
    console.log(`[${lang}] Generating speech for scene ${i + 1}...`);
    await fetchFullTts(scenes[i].speech, langCode === 'hi' ? 'hi' : 'en-IN', audioPath);
    console.log(`[${lang}] Rendering scene ${i + 1} video with voiceover...`);
    await renderSceneVideo(scenes[i], i, audioPath, sceneVideoPath);
    sceneFiles.push(sceneVideoPath);
  }

  const concatList = path.join(BUILD_DIR, `${langCode}_concat.txt`);
  const concatContent = sceneFiles.map(f => `file '${f}'`).join('\n');
  fs.writeFileSync(concatList, concatContent);

  console.log(`Stitching final ${lang} MP4: ${finalPath}...`);
  execSync(`ffmpeg -y -f concat -safe 0 -i "${concatList}" -c copy "${finalPath}"`);
  const size = (fs.statSync(finalPath).size / 1024 / 1024).toFixed(2);
  console.log(`Success! ${lang} MP4 size: ${size} MB`);
}

async function main() {
  // 1. English Voiceover Video
  const enFinal = path.resolve('public/ind-crosstax-ai-demo-en.mp4');
  await buildLanguageVideo(englishScenes, 'English', 'en', enFinal);

  // 2. Hindi Voiceover Video
  const hiFinal = path.resolve('public/ind-crosstax-ai-demo-hi.mp4');
  await buildLanguageVideo(hindiScenes, 'Hindi', 'hi', hiFinal);

  // Set default ind-crosstax-ai-demo.mp4 to English voiceover
  fs.copyFileSync(enFinal, path.resolve('public/ind-crosstax-ai-demo.mp4'));

  console.log('\nBoth English and Hindi voiceover videos generated and deployed to public/ successfully!');
}

main().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
