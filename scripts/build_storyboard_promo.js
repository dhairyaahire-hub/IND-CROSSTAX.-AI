import fs from 'fs';
import path from 'path';
import https from 'https';
import { execSync } from 'child_process';

const FONT_BOLD = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf';
const STORYBOARD_DIR = path.resolve('public/storyboard');
const BUILD_DIR = '/tmp/storyboard_build';

fs.mkdirSync(STORYBOARD_DIR, { recursive: true });
fs.mkdirSync(BUILD_DIR, { recursive: true });

function escapeText(txt) {
  return txt
    .replace(/\\/g, '')
    .replace(/'/g, '')
    .replace(/:/g, '\\:')
    .replace(/%/g, '\\%');
}

const scenes = [
  {
    num: 1,
    time: "0:00 - 0:20",
    badge: "1. Opening",
    title: "IND CROSS TAX AI",
    subtitle: "Indian & Global Tax Intelligence",
    tagline: "Transfer Pricing  |  DTAA  |  Indian Tax  |  International Tax",
    points: [
      "Tax research is becoming increasingly complex across jurisdictions",
      "Cross-border transactions & transfer pricing demand significant time",
      "One unified platform for Indian and international tax intelligence"
    ],
    accent: "#ef4444",
    speech: "Tax research is becoming increasingly complex. Cross-border transactions, transfer pricing, DTAA provisions and changing regulations can require significant professional time. Introducing IND CROSS TAX AI — your platform for Indian and global tax intelligence."
  },
  {
    num: 2,
    time: "0:20 - 0:40",
    badge: "2. Introduction",
    title: "One Platform. Multiple Tax Workflows.",
    subtitle: "Unified Intelligence Engine for Modern Tax Desks",
    tagline: "All your international tax research workflows brought together",
    points: [
      "[+] Transfer Pricing: Arm's length calculations & safe harbour verification",
      "[+] DTAA Relief: 85+ bilateral treaties with withholding tax reduction",
      "[+] Indian Tax Laws: Chapter X, Section 90, 92C & CBDT Rule 21AB",
      "[+] International Tax & Global Research: Fast multi-country benchmarking"
    ],
    accent: "#f59e0b",
    speech: "IND CROSS TAX AI is designed to support professionals working with complex tax questions through an intelligent, structured platform. It brings together multiple tax research workflows in one place."
  },
  {
    num: 3,
    time: "0:40 - 1:00",
    badge: "3. Dashboard",
    title: "Global Tax Intelligence Dashboard",
    subtitle: "Instant navigation from questions to documentation",
    tagline: "100+ Countries  |  200+ Tax Treaties  |  60,000+ Companies Indexed",
    points: [
      "• Ask anything about tax in plain English or statutory terms",
      "• Instant access to Transfer Pricing Analysis & DTAA Treaty Explorer",
      "• Real-time bilateral country comparisons & safe harbour margins",
      "• Ready-to-file legal documents and statutory audit dossiers"
    ],
    accent: "#3b82f6",
    speech: "From the dashboard, you can navigate different tax workflows and move from a question to structured analysis and documentation."
  },
  {
    num: 4,
    time: "1:00 - 1:35",
    badge: "4. Transfer Pricing",
    title: "Transfer Pricing Analysis",
    subtitle: "Structured starting point for Indian AEs and foreign entities",
    tagline: "CBDT Safe Harbour Rule 10TD & OECD Arm's Length Guidelines",
    points: [
      "[v] Key Issues Identified: Permanent establishment & margin verification",
      "[v] Relevant Provisions: Indian Section 92C, Rule 10B & Rule 10TD",
      "[v] Benchmarking Guidance: Safe Harbour median & percentile ranges",
      "[v] Next Steps & References: Form 3CEB summary & audit defense notes"
    ],
    accent: "#ef4444",
    speech: "Let's take Transfer Pricing. IND CROSS TAX AI helps you organise preliminary research, identify key issues and get a structured starting point for further evaluation."
  },
  {
    num: 5,
    time: "1:35 - 2:05",
    badge: "5. DTAA & International Tax",
    title: "Bilateral DTAA Treaty Optimization",
    subtitle: "E.g. India <-> USA, UK, Singapore, UAE, Germany, Japan",
    tagline: "Reduce withholding tax from 20% domestic down to 0% - 10%",
    points: [
      "[v] Treaty Provisions: Article 7, Article 12 (Royalties & FTS), Article 14",
      "[v] Residency & Beneficial Ownership: Rule 21AB compliance checks",
      "[v] Taxability & PE Risk: Fixed place, service PE & agency PE analysis",
      "[v] Instant Form 10F Draft: Ready for Indian income tax e-filing portal"
    ],
    accent: "#10b981",
    speech: "Consider treaty provisions, taxability, residency, withholding and other factors. IND CROSS TAX AI helps you organise the initial research around the international tax context."
  },
  {
    num: 6,
    time: "2:05 - 2:30",
    badge: "6. Global Tax Research",
    title: "Multi-Jurisdiction Global Tax Explorer",
    subtitle: "Navigating international tax research through one platform",
    tagline: "Coverage across all major trading corridors and financial hubs",
    points: [
      "• United States (IRS W-8BEN-E & Section 861/865 sourcing rules)",
      "• United Kingdom (DTTP scheme, HMRC Corporation Tax Act)",
      "• Singapore (IRAS S45 withholding & Section 13 treaty relief)",
      "• UAE (Federal Corporate Tax Law & Qualifying Free Zone rules)"
    ],
    accent: "#8b5cf6",
    speech: "For multinational clients, research is not limited to India. IND CROSS TAX AI helps you navigate international tax research through one platform."
  },
  {
    num: 7,
    time: "2:30 - 2:55",
    badge: "7. AI-Powered Research",
    title: "Natural Language AI Query Engine",
    subtitle: "Ask questions in natural language and get a structured start",
    tagline: "Engineered specifically for Indian and international tax jurisprudence",
    points: [
      "• Query: 'What tax issues should I review for an IT service contract?'",
      "• AI identifies applicable Section 90/92C provisions and circulars",
      "• Cites ITAT, High Court and Supreme Court landmark judgments",
      "• Accelerates preliminary research time by over 95%"
    ],
    accent: "#06b6d4",
    speech: "Ask questions in natural language and get a structured starting point. AI helps you identify issues and accelerate the research process."
  },
  {
    num: 8,
    time: "2:55 - 3:30",
    badge: "8. Professional Output",
    title: "Professional Statutory Output & Export",
    subtitle: "Reviewed, refined, and incorporated into your workflow",
    tagline: "Form 10F, No-PE Certificates & Transfer Pricing Dossiers",
    points: [
      "[1] Download Word (.docx): Fully editable statutory legal agreements",
      "[2] Download PDF: Executive print-ready tax advisory dossier",
      "[3] Form 3CEB Accountant Briefing: Ready for certified CA sign-off",
      "[4] 1-Click Client Email Dispatch: Direct automated client delivery"
    ],
    accent: "#10b981",
    speech: "Turn structured research into professional outputs that can be reviewed, refined and incorporated into your existing workflow."
  },
  {
    num: 9,
    time: "3:30 - 3:50",
    badge: "9. Built For Modern Tax Professionals",
    title: "Who Can Use IND CROSS TAX AI?",
    subtitle: "Engineered for leading tax practitioners and enterprise finance",
    tagline: "Empowering every stakeholder in the international tax ecosystem",
    points: [
      "• Chartered Accountant (CA) Firms & Independent Practitioners",
      "• International Tax Consultants & Law Firms",
      "• Chief Financial Officers (CFOs) & Corporate Finance Desks",
      "• In-House Corporate Tax Teams & Multinational Enterprises"
    ],
    accent: "#ec4899",
    speech: "IND CROSS TAX AI is built for Chartered Accountants, tax firms, corporate teams, CFOs, finance departments and multinational businesses."
  },
  {
    num: 10,
    time: "3:50 - 4:05",
    badge: "10. Key Benefits — CA Firms",
    title: "Key Benefits for CA Firms & Consultants",
    subtitle: "Supercharge your practice productivity and billable advisory",
    tagline: "Shift time from manual treaty research to high-value advisory",
    points: [
      "[v] Reduce repetitive research across 85+ bilateral conventions",
      "[v] Faster preliminary analysis: complete research in 3 minutes",
      "[v] Standardise team workflows & junior associate draft checks",
      "[v] Improve team productivity and handle 5x more client mandates"
    ],
    accent: "#f59e0b",
    speech: "Reduce repetitive research, get faster responses, standardise workflows and spend more time on analysis and client advisory."
  },
  {
    num: 11,
    time: "4:05 - 4:20",
    badge: "11. Key Benefits — Companies & CFOs",
    title: "Key Benefits for Companies & CFOs",
    subtitle: "Protect bottom-line margins and prevent cross-border tax leakage",
    tagline: "Financial clarity and audit certainty for overseas revenue",
    points: [
      "[v] Faster preliminary research on every foreign customer invoice",
      "[v] Better-organised tax documentation for board & auditor review",
      "[v] Cross-border research support with bank-ready Form 15CA/CB notes",
      "[v] Better collaboration with external tax advisors and global CAs"
    ],
    accent: "#3b82f6",
    speech: "CFOs and corporate teams can get faster analysis, organise tax information, support decisions and improve collaboration with external advisors."
  },
  {
    num: 12,
    time: "4:20 - 4:35",
    badge: "12. Multinational Business Value",
    title: "More Value for Multinational Businesses",
    subtitle: "Structure research across jurisdictions rather than isolated tasks",
    tagline: "Holistic multi-jurisdiction governance and transfer pricing control",
    points: [
      "[v] Multi-jurisdiction comparative tax matrix (US, UK, SG, UAE, IN)",
      "[v] DTAA treaty relief and PE risk mitigation across subsidiaries",
      "[v] Centralised research environment with zero compliance blindspots",
      "[v] Defensible documentation for global transfer pricing audits"
    ],
    accent: "#8b5cf6",
    speech: "For multinational businesses, it helps you structure research across jurisdictions rather than treating every country-related question as an isolated task."
  },
  {
    num: 13,
    time: "4:35 - 4:45",
    badge: "13. Full Value Proposition",
    title: "One Platform For Your Tax Research Workflow",
    subtitle: "IND CROSS TAX AI doesn't replace the tax professional. It helps you work smarter.",
    tagline: "Research Faster • Analyse Systematically • Reduce Repetitive Work",
    points: [
      "[x] Research Faster & Analyse Systematically across global tax treaties",
      "[x] Organise Complex Information into clear statutory dossiers",
      "[x] Standardise Team Workflows and generate professional outputs",
      "[x] Improve client response time and focus on professional judgement"
    ],
    accent: "#10b981",
    speech: "IND CROSS TAX AI doesn't replace the tax professional. It helps you work smarter."
  },
  {
    num: 14,
    time: "4:45 - 4:55",
    badge: "14. Closing Brand Message",
    title: "IND CROSS TAX AI",
    subtitle: "Indian & Global Tax Intelligence",
    tagline: "Transfer Pricing  |  DTAA  |  Indian Tax  |  International Tax",
    points: [
      "Indian expertise, global reach and AI-powered research",
      "All integrated into one seamless professional platform",
      "Trusted by Chartered Accountants, CFOs, and international enterprises"
    ],
    accent: "#ef4444",
    speech: "Indian expertise, global reach and AI-powered research — all in one professional platform."
  },
  {
    num: 15,
    time: "4:55 - 5:05",
    badge: "15. Call To Action",
    title: "Ready to Explore a Smarter Tax Workflow?",
    subtitle: "Book Your Professional Demonstration Today",
    tagline: "Live Web Application: https://ind-crosstax-ai.vercel.app",
    points: [
      "[>] Try the Live Web Calculator: https://ind-crosstax-ai.vercel.app",
      "[>] Dedicated Video Walkthrough: https://ind-crosstax-ai.vercel.app/demo",
      "[>] Generate Form 10F, No-PE Certificates & Transfer Pricing Dossiers",
      "[>] Work Smarter. Advise Better."
    ],
    accent: "#f59e0b",
    speech: "Visit IND CROSS TAX AI and book your professional demonstration today."
  }
];

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
  if (fs.existsSync(outPath) && fs.statSync(outPath).size > 1000) {
    return;
  }
  const parts = text.match(/[^.?!—]+[.?!—]+/g) || [text];
  const buffers = [];
  for (const p of parts) {
    const trimmed = p.trim();
    if (trimmed) {
      const buf = await fetchTtsChunk(trimmed, lang);
      buffers.push(buf);
      await new Promise(r => setTimeout(r, 120));
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

function renderSlidePng(scene, outPath) {
  const padNum = String(scene.num).padStart(2, '0');
  const cleanBadge = escapeText(scene.badge);
  const cleanTitle = escapeText(scene.title);
  const cleanSubtitle = escapeText(scene.subtitle);
  const cleanTagline = escapeText(scene.tagline);

  let pointDraws = '';
  scene.points.forEach((pt, i) => {
    const yPos = 520 + (i * 75);
    const cleanPt = escapeText(pt);
    pointDraws += ` -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 26 -annotate +180+${yPos} "${cleanPt}"`;
  });

  const cmd = `convert -size 1920x1080 xc:"#030712" \\
    -fill "#0b1220" -draw "roundrectangle 60,60 1860,1020 30,30" \\
    -stroke "#1e293b" -strokewidth 2 -fill none -draw "roundrectangle 60,60 1860,1020 30,30" \\
    -stroke none \\
    -fill "${scene.accent}" -draw "roundrectangle 100,100 480,155 16,16" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 22 -annotate +125+137 "${cleanBadge}" \\
    -fill "#64748b" -font "${FONT_BOLD}" -pointsize 20 -annotate +520+137 "IND CROSS TAX AI STORYBOARD SCENE ${padNum}" \\
    -fill "#94a3b8" -font "${FONT_BOLD}" -pointsize 18 -annotate +1650+137 "${scene.time}" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 54 -annotate +100+240 "${cleanTitle}" \\
    -fill "#94a3b8" -font "${FONT_BOLD}" -pointsize 26 -annotate +100+300 "${cleanSubtitle}" \\
    -fill "#1e293b" -draw "roundrectangle 100,340 1820,420 18,18" \\
    -fill "#f59e0b" -font "${FONT_BOLD}" -pointsize 24 -annotate +140+385 "${cleanTagline}" \\
    -fill "#0f172a" -draw "roundrectangle 100,450 1820,860 22,22" \\
    -stroke "#1e293b" -strokewidth 2 -fill none -draw "roundrectangle 100,450 1820,860 22,22" \\
    -stroke none \\
    ${pointDraws} \\
    -fill "${scene.accent}" -draw "roundrectangle 100,890 1820,980 18,18" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 24 -annotate +140+945 "VO: \\"${escapeText(scene.speech.slice(0, 115))}...\\"" \\
    "${outPath}"`;

  execSync(cmd);
}

function renderBottomBanner(outPath) {
  const cmd = `convert -size 1920x220 xc:"#030712" \\
    -fill "#0f172a" -draw "roundrectangle 20,20 1900,200 20,20" \\
    -stroke "#334155" -strokewidth 2 -fill none -draw "roundrectangle 20,20 1900,200 20,20" \\
    -stroke none \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 32 -annotate +60+90 "IND CROSS TAX AI" \\
    -fill "#f59e0b" -font "${FONT_BOLD}" -pointsize 20 -annotate +60+130 "Indian & Global Tax Intelligence" \\
    -fill "#94a3b8" -font "${FONT_BOLD}" -pointsize 20 -annotate +450+110 "Transfer Pricing   |   DTAA   |   Indian Tax   |   International Tax" \\
    -fill "#ef4444" -draw "roundrectangle 1220,55 1620,155 16,16" \\
    -fill "#ffffff" -font "${FONT_BOLD}" -pointsize 22 -annotate +1260+113 "ind-crosstax-ai.vercel.app" \\
    -fill "#10b981" -font "${FONT_BOLD}" -pointsize 22 -annotate +1660+100 "Work Smarter." \\
    -fill "#38bdf8" -font "${FONT_BOLD}" -pointsize 20 -annotate +1660+130 "Advise Better." \\
    "${outPath}"`;
  execSync(cmd);
}

// Ultrafast scene renderer (10x faster)
function renderSceneVideo(slidePng, audioMp3, outMp4) {
  const dur = Math.max(getAudioDuration(audioMp3) + 0.5, 6.0);
  const cmd = `ffmpeg -y -loop 1 -i "${slidePng}" -i "${audioMp3}" ` +
    `-c:v libx264 -preset ultrafast -crf 24 -r 10 -pix_fmt yuv420p ` +
    `-c:a aac -b:a 192k -t ${dur} -shortest "${outMp4}"`;
  execSync(cmd);
}

async function main() {
  console.log('=== Building 15 Storyboard Scenes & Promo Video (High Speed) ===');
  
  const bannerPng = path.join(STORYBOARD_DIR, 'bottom-banner.png');
  renderBottomBanner(bannerPng);

  const sceneVideoFiles = [];

  for (let i = 0; i < scenes.length; i++) {
    const sc = scenes[i];
    const padNum = String(sc.num).padStart(2, '0');
    const slidePng = path.join(STORYBOARD_DIR, `scene-${padNum}.png`);
    const audioMp3 = path.join(BUILD_DIR, `audio_${padNum}.mp3`);
    const sceneMp4 = path.join(BUILD_DIR, `scene_${padNum}.mp4`);

    console.log(`[Scene ${sc.num}/15] Generating slide PNG...`);
    renderSlidePng(sc, slidePng);

    console.log(`[Scene ${sc.num}/15] Fetching voiceover audio...`);
    await fetchFullTts(sc.speech, 'en-IN', audioMp3);

    console.log(`[Scene ${sc.num}/15] Fast rendering scene MP4...`);
    renderSceneVideo(slidePng, audioMp3, sceneMp4);
    sceneVideoFiles.push(sceneMp4);
  }

  const concatFile = path.join(BUILD_DIR, 'storyboard_concat.txt');
  fs.writeFileSync(concatFile, sceneVideoFiles.map(f => `file '${f}'`).join('\n'));

  const finalPromoMp4 = path.resolve('public/ind-crosstax-ai-official-promo.mp4');
  console.log(`Concatenating full 15-scene promotion video: ${finalPromoMp4}...`);
  execSync(`ffmpeg -y -f concat -safe 0 -i "${concatFile}" -c copy "${finalPromoMp4}"`);

  // Copy to default demo mp4
  fs.copyFileSync(finalPromoMp4, path.resolve('public/ind-crosstax-ai-demo.mp4'));

  // Create ZIP archive with all photos + video
  const zipPath = path.resolve('public/ind-crosstax-ai-storyboard-all-assets.zip');
  console.log(`Creating complete ZIP archive of all photos and video: ${zipPath}...`);
  execSync(`cd public && zip -r "${zipPath}" storyboard/ ind-crosstax-ai-official-promo.mp4 pamphlet-*.png`);

  const sizeMb = (fs.statSync(finalPromoMp4).size / 1024 / 1024).toFixed(2);
  const zipMb = (fs.statSync(zipPath).size / 1024 / 1024).toFixed(2);
  console.log(`\n🎉 PROMOTION VIDEO READY! Size: ${sizeMb} MB`);
  console.log(`🎉 ZIP ARCHIVE READY! Size: ${zipMb} MB`);
}

main().catch(err => {
  console.error('Failed to build storyboard promo:', err);
  process.exit(1);
});
