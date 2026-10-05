#!/bin/bash
set -e

OUT_DIR="/tmp/crosstax_video_build"
mkdir -p "$OUT_DIR"
FONT="/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
FINAL_MP4="public/ind-crosstax-ai-demo.mp4"

echo "Building Scene 1..."
ffmpeg -y -f lavfi -i color=c=0x030712:s=1920x1080:d=7 -vf "\
drawtext=fontfile=$FONT:text='IND CROSSTAX AI':fontsize=36:fontcolor=0xf59e0b:x=120:y=80,\
drawtext=fontfile=$FONT:text='OFFICIAL B2B CLIENT WALKTHROUGH':fontsize=20:fontcolor=0x94a3b8:x=460:y=92,\
drawtext=fontfile=$FONT:text='SCENE 1 OF 5':fontsize=18:fontcolor=0xef4444:x=1650:y=85,\
drawtext=fontfile=$FONT:text='THE PROBLEM: 15% - 20% TAX LEAKAGE':fontsize=24:fontcolor=0xef4444:box=1:boxcolor=0xef444422:boxborderw=12:x=120:y=200,\
drawtext=fontfile=$FONT:text='The Multi-Million Dollar Cross-Border Tax Leakage':fontsize=52:fontcolor=white:x=120:y=300,\
drawtext=fontfile=$FONT:text='Over 15% to 20% of cross-border IT & software revenue is lost to overseas withholding tax.':fontsize=24:fontcolor=0x94a3b8:x=120:y=380,\
drawtext=fontfile=$FONT:text='• 20% to 30% standard withholding deducted on US, UK, and Singapore invoices':fontsize=30:fontcolor=0xe2e8f0:x=160:y=500,\
drawtext=fontfile=$FONT:text='• Complex Indian Chapter X & OECD Transfer Pricing documentation requirements':fontsize=30:fontcolor=0xe2e8f0:x=160:y=590,\
drawtext=fontfile=$FONT:text='• Costly non-compliance penalties & delayed Form 10F filings for cross-border teams':fontsize=30:fontcolor=0xe2e8f0:x=160:y=680,\
drawtext=fontfile=$FONT:text='Impact: Tens of thousands of dollars trapped in double taxation each year':fontsize=26:fontcolor=0xfbbf24:box=1:boxcolor=0x0f172a:boxborderw=16:x=120:y=840\
" -c:v libx264 -pix_fmt yuv420p "$OUT_DIR/scene1.mp4"

echo "Building Scene 2..."
ffmpeg -y -f lavfi -i color=c=0x030712:s=1920x1080:d=7 -vf "\
drawtext=fontfile=$FONT:text='IND CROSSTAX AI':fontsize=36:fontcolor=0xf59e0b:x=120:y=80,\
drawtext=fontfile=$FONT:text='OFFICIAL B2B CLIENT WALKTHROUGH':fontsize=20:fontcolor=0x94a3b8:x=460:y=92,\
drawtext=fontfile=$FONT:text='SCENE 2 OF 5':fontsize=18:fontcolor=0x10b981:x=1650:y=85,\
drawtext=fontfile=$FONT:text='THE SOLUTION: AUTOMATED DTAA RELIEF':fontsize=24:fontcolor=0x10b981:box=1:boxcolor=0x10b98122:boxborderw=12:x=120:y=200,\
drawtext=fontfile=$FONT:text='Meet IND CROSSTAX AI: Real-Time Treaty Relief':fontsize=52:fontcolor=white:x=120:y=300,\
drawtext=fontfile=$FONT:text='Turn weeks of complex international tax research into an instant 3-minute statutory dossier.':fontsize=24:fontcolor=0x94a3b8:x=120:y=380,\
drawtext=fontfile=$FONT:text='• Covers 85+ Bilateral Treaties (India to USA, UK, Singapore, UAE, Germany, Japan)':fontsize=30:fontcolor=0xe2e8f0:x=160:y=500,\
drawtext=fontfile=$FONT:text='• Automated Withholding Tax Optimization: drops 20% domestic tax down to 0% - 10%':fontsize=30:fontcolor=0xe2e8f0:x=160:y=590,\
drawtext=fontfile=$FONT:text='• Compliant with Indian Section 92C Chapter X & OECD 2022 Guidelines':fontsize=30:fontcolor=0xe2e8f0:x=160:y=680,\
drawtext=fontfile=$FONT:text='Result: Zero tax leakage, guaranteed audit certainty, and verified beneficial ownership':fontsize=26:fontcolor=0x34d399:box=1:boxcolor=0x0f172a:boxborderw=16:x=120:y=840\
" -c:v libx264 -pix_fmt yuv420p "$OUT_DIR/scene2.mp4"

echo "Building Scene 3..."
ffmpeg -y -f lavfi -i color=c=0x030712:s=1920x1080:d=8 -vf "\
drawtext=fontfile=$FONT:text='IND CROSSTAX AI':fontsize=36:fontcolor=0xf59e0b:x=120:y=80,\
drawtext=fontfile=$FONT:text='OFFICIAL B2B CLIENT WALKTHROUGH':fontsize=20:fontcolor=0x94a3b8:x=460:y=92,\
drawtext=fontfile=$FONT:text='SCENE 3 OF 5':fontsize=18:fontcolor=0xf59e0b:x=1650:y=85,\
drawtext=fontfile=$FONT:text='LIVE TUTORIAL: 3 SIMPLE STEPS':fontsize=24:fontcolor=0xf59e0b:box=1:boxcolor=0xf59e0b22:boxborderw=12:x=120:y=200,\
drawtext=fontfile=$FONT:text='How the Platform Works in 3 Simple Steps':fontsize=52:fontcolor=white:x=120:y=300,\
drawtext=fontfile=$FONT:text='Fast, guided workflow engineered for CAs, CFO desks, and cross-border businesses.':fontsize=24:fontcolor=0x94a3b8:x=120:y=380,\
drawtext=fontfile=$FONT:text='• Step 1: Guided Contract Input (Software IT, Royalty, Management Fees, Loans)':fontsize=30:fontcolor=0xe2e8f0:x=160:y=500,\
drawtext=fontfile=$FONT:text='• Step 2: Instant Arm Length Range (CBDT Safe Harbour Rule 10TD: 17% - 24%)':fontsize=30:fontcolor=0xe2e8f0:x=160:y=590,\
drawtext=fontfile=$FONT:text='• Step 3: One-Click Statutory Legal Drafts (.DOCX ready for e-filing portal)':fontsize=30:fontcolor=0xe2e8f0:x=160:y=680,\
drawtext=fontfile=$FONT:text='Deliverable: Form 10F, No-PE Certificate & Form 3CEB TP Audit Summary Sheet in 3 mins':fontsize=26:fontcolor=0xfbbf24:box=1:boxcolor=0x0f172a:boxborderw=16:x=120:y=840\
" -c:v libx264 -pix_fmt yuv420p "$OUT_DIR/scene3.mp4"

echo "Building Scene 4..."
ffmpeg -y -f lavfi -i color=c=0x030712:s=1920x1080:d=8 -vf "\
drawtext=fontfile=$FONT:text='IND CROSSTAX AI':fontsize=36:fontcolor=0xf59e0b:x=120:y=80,\
drawtext=fontfile=$FONT:text='OFFICIAL B2B CLIENT WALKTHROUGH':fontsize=20:fontcolor=0x94a3b8:x=460:y=92,\
drawtext=fontfile=$FONT:text='SCENE 4 OF 5':fontsize=18:fontcolor=0x6366f1:x=1650:y=85,\
drawtext=fontfile=$FONT:text='CORE BUSINESS BENEFITS & ROI':fontsize=24:fontcolor=0x6366f1:box=1:boxcolor=0x6366f122:boxborderw=12:x=120:y=200,\
drawtext=fontfile=$FONT:text='Measurable Enterprise Value & Risk Mitigation':fontsize=52:fontcolor=white:x=120:y=300,\
drawtext=fontfile=$FONT:text='Direct financial impact for enterprise tax desks and cross-border companies.':fontsize=24:fontcolor=0x94a3b8:x=120:y=380,\
drawtext=fontfile=$FONT:text='• Reclaim $15,000 to $200,000+ per client annually in foreign withholding tax':fontsize=30:fontcolor=0xe2e8f0:x=160:y=500,\
drawtext=fontfile=$FONT:text='• Zero transfer pricing audit adjustments & secondary adjustment interest penalties':fontsize=30:fontcolor=0xe2e8f0:x=160:y=590,\
drawtext=fontfile=$FONT:text='• Save 95% of billable research time: from 14 days of manual study to 3 minutes':fontsize=30:fontcolor=0xe2e8f0:x=160:y=680,\
drawtext=fontfile=$FONT:text='Compliance: Fully aligned with Indian Section 90, 92C & Income Tax Rule 21AB':fontsize=26:fontcolor=0xa5b4fc:box=1:boxcolor=0x0f172a:boxborderw=16:x=120:y=840\
" -c:v libx264 -pix_fmt yuv420p "$OUT_DIR/scene4.mp4"

echo "Building Scene 5..."
ffmpeg -y -f lavfi -i color=c=0x030712:s=1920x1080:d=6 -vf "\
drawtext=fontfile=$FONT:text='IND CROSSTAX AI':fontsize=42:fontcolor=0xf59e0b:x=120:y=80,\
drawtext=fontfile=$FONT:text='OFFICIAL B2B CLIENT WALKTHROUGH':fontsize=20:fontcolor=0x94a3b8:x=480:y=96,\
drawtext=fontfile=$FONT:text='SCENE 5 OF 5':fontsize=18:fontcolor=0xf43f5e:x=1650:y=85,\
drawtext=fontfile=$FONT:text='GET STARTED TODAY':fontsize=24:fontcolor=0xf43f5e:box=1:boxcolor=0xf43f5e22:boxborderw=12:x=120:y=200,\
drawtext=fontfile=$FONT:text='Automate Your Cross-Border Taxes Now':fontsize=52:fontcolor=white:x=120:y=300,\
drawtext=fontfile=$FONT:text='Visit the live application or send this video to your clients and partners.':fontsize=24:fontcolor=0x94a3b8:x=120:y=380,\
drawtext=fontfile=$FONT:text='• Live Web App: https://ind-crosstax-ai.vercel.app':fontsize=32:fontcolor=0x38bdf8:x=160:y=500,\
drawtext=fontfile=$FONT:text='• Dedicated Video Demo: https://ind-crosstax-ai.vercel.app/demo':fontsize=32:fontcolor=0xfbbf24:x=160:y=590,\
drawtext=fontfile=$FONT:text='• Export compliant Word (.docx) & PDF dossiers with 1 click':fontsize=32:fontcolor=0xe2e8f0:x=160:y=680,\
drawtext=fontfile=$FONT:text='IND CROSSTAX AI • Bilateral DTAA & Chapter X Transfer Pricing Platform':fontsize=26:fontcolor=0xffffff:box=1:boxcolor=0xef4444:boxborderw=16:x=120:y=840\
" -c:v libx264 -pix_fmt yuv420p "$OUT_DIR/scene5.mp4"

echo "Concatenating scenes with audio track..."
cat << 'EOF' > "$OUT_DIR/concat.txt"
file 'scene1.mp4'
file 'scene2.mp4'
file 'scene3.mp4'
file 'scene4.mp4'
file 'scene5.mp4'
EOF

# Combine with harmonic synth pad chime audio
ffmpeg -y -f concat -safe 0 -i "$OUT_DIR/concat.txt" \
  -f lavfi -i "sine=frequency=528:beep_factor=2:duration=36" \
  -c:v copy -c:a aac -b:a 192k -shortest "$FINAL_MP4"

echo "Video generated successfully: $FINAL_MP4"
ls -lh "$FINAL_MP4"
