import { FullTaxAnalysisReport } from '../types/tax';

/**
 * Downloads plain text / markdown file
 */
export function downloadMarkdown(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.md') ? filename : `${filename}.md`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Downloads a rich Microsoft Word (.doc) compatible document with HTML formatting
 */
export function downloadWordDoc(filename: string, title: string, htmlBody: string) {
  const docHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${title}</title>
        <style>
          body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #1e293b; padding: 24pt; }
          h1 { color: #dc2626; font-size: 20pt; border-bottom: 2pt solid #dc2626; padding-bottom: 6pt; }
          h2 { color: #991b1b; font-size: 15pt; margin-top: 18pt; border-bottom: 1pt solid #cbd5e1; padding-bottom: 4pt; }
          h3 { color: #0f172a; font-size: 12pt; margin-top: 12pt; }
          table { width: 100%; border-collapse: collapse; margin: 12pt 0; }
          th { background-color: #f1f5f9; color: #0f172a; text-align: left; padding: 8pt; border: 1pt solid #cbd5e1; font-weight: bold; }
          td { padding: 8pt; border: 1pt solid #cbd5e1; }
          .callout { background-color: #fef2f2; border-left: 4pt solid #dc2626; padding: 10pt; margin: 12pt 0; }
          pre { background-color: #f8fafc; border: 1pt solid #cbd5e1; padding: 10pt; font-family: 'Courier New', monospace; font-size: 9.5pt; white-space: pre-wrap; }
          .footer { font-size: 9pt; color: #94a3b8; border-top: 1pt solid #e2e8f0; margin-top: 24pt; padding-top: 8pt; text-align: center; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="callout">
          <strong>Official Cross Tax AI Statutory Document</strong><br/>
          Generated for international tax compliance and audit defense.
        </div>
        ${htmlBody}
        <div class="footer">
          Cross Tax AI • Global Transfer Pricing & Bilateral DTAA Advisory Engine • Generated on ${new Date().toLocaleDateString()}
        </div>
      </body>
    </html>
  `;

  const blob = new Blob([docHtml], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.doc') ? filename : `${filename}.doc`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Triggers direct Print-to-PDF with clean printable stylesheet
 */
export function printToPdf(title: string, printableHtml: string) {
  const fullHtml = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #1e293b; padding: 10px; }
          h1 { color: #dc2626; font-size: 22pt; margin-bottom: 4px; }
          h2 { color: #991b1b; font-size: 14pt; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 4px; margin-top: 18px; }
          h3 { color: #0f172a; font-size: 12pt; margin-top: 12px; }
          table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 10.5pt; }
          th { background: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 10px; font-weight: bold; text-align: left; }
          td { border: 1px solid #cbd5e1; padding: 6px 10px; }
          .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 9pt; background: #fee2e2; color: #991b1b; }
          pre { background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; font-family: Courier, monospace; font-size: 9pt; white-space: pre-wrap; }
          .header-box { border-bottom: 2px solid #dc2626; padding-bottom: 12px; margin-bottom: 18px; }
          .footer-box { margin-top: 30px; padding-top: 10px; border-top: 1px solid #cbd5e1; font-size: 8.5pt; color: #64748b; text-align: center; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header-box">
          <h1>${title}</h1>
          <p style="margin: 0; font-size: 10pt; color: #64748b;">Cross Tax AI — Global Transfer Pricing & Bilateral DTAA Advisor</p>
        </div>
        ${printableHtml}
        <div class="footer-box">
          Official statutory advisory document generated on ${new Date().toLocaleDateString()}. Retain in corporate tax records for transfer pricing audit defense.
        </div>
      </body>
    </html>
  `;

  // First try window.open
  let printWindow: Window | null = null;
  try {
    printWindow = window.open('', '_blank');
  } catch {
    printWindow = null;
  }

  if (printWindow) {
    printWindow.document.write(fullHtml);
    printWindow.document.close();
    setTimeout(() => {
      printWindow?.focus();
      printWindow?.print();
    }, 400);
    return;
  }

  // Graceful fallback for sandboxed iframes: hidden iframe printing
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (doc) {
    doc.open();
    doc.write(fullHtml);
    doc.close();
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 500);
  }
}

/**
 * Generates comprehensive HTML representation of FullTaxAnalysisReport
 */
export function generateFullReportHtml(report: FullTaxAnalysisReport): string {
  const { contract, dtaa, transferPricing } = report;

  return `
    <h2>1. Executive Summary & Legal Directive</h2>
    <p>${report.executiveSummary}</p>
    <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:8px; padding:12px; margin:14px 0;">
      <strong style="color:#dc2626; font-size:14pt;">Estimated Tax Savings: ${contract.currency} ${dtaa.estimatedTaxSavings.toLocaleString()}</strong><br/>
      <span>Treaty Withholding Rate: <strong>${dtaa.treatyWhtRate}%</strong> (Domestic Law Base: <strong>${dtaa.domesticWhtRate}%</strong>)</span>
    </div>

    <h2>2. Transaction & Contract Specifications</h2>
    <table>
      <tr><th>Parameter</th><th>Assessment Value</th></tr>
      <tr><td>Client Entity</td><td><strong>${contract.clientName}</strong> (${contract.entityType})</td></tr>
      <tr><td>Contract Title</td><td>${contract.contractTitle}</td></tr>
      <tr><td>Annual Transaction Value</td><td><strong>${contract.currency} ${contract.annualValue.toLocaleString()}</strong></td></tr>
      <tr><td>Jurisdictional Corridor</td><td><strong>${contract.residentCountry} (Residence) → ${contract.sourceCountry} (Source)</strong></td></tr>
      <tr><td>Associated Enterprise (AE) / Group</td><td>${contract.isPartOfSameGroup ? `Yes (${contract.relationshipNature || 'Subsidiary'})` : 'Independent Third Party'}</td></tr>
      <tr><td>Physical Days in Source State</td><td>${contract.durationDaysInSource} Days (Safe Ceiling: ${dtaa.treatyWhtRate > 0 ? 'Protocol threshold' : 'Exempt under Art 7'})</td></tr>
      <tr><td>Permanent Establishment Risk</td><td><strong style="color:${dtaa.peRiskLevel === 'low' ? '#16a34a' : '#dc2626'}; text-transform:uppercase;">${dtaa.peRiskLevel}</strong></td></tr>
    </table>

    <h2>3. Arm's Length Transfer Pricing Evaluation</h2>
    <table>
      <tr><th>Metric</th><th>Economic Value</th></tr>
      <tr><td>Methodology Selected</td><td><strong>${transferPricing.method}</strong> (Most Appropriate Method)</td></tr>
      <tr><td>Profit Level Indicator (PLI)</td><td>${transferPricing.profitLevelIndicator}</td></tr>
      <tr><td>Invoiced Profit Margin</td><td><strong>${transferPricing.currentMargin}%</strong></td></tr>
      <tr><td>Comparable 35th Percentile</td><td>${transferPricing.percentile35th}%</td></tr>
      <tr><td>Arm's Length Median Benchmark</td><td><strong>${transferPricing.median}%</strong></td></tr>
      <tr><td>Comparable 65th Percentile</td><td>${transferPricing.percentile65th}%</td></tr>
      <tr><td>Safe Harbour Benchmark</td><td>${transferPricing.safeHarbourThreshold}% (${transferPricing.safeHarbourRuleRef || 'Standard Safe Harbour'})</td></tr>
      <tr><td>Audit Risk Level</td><td><strong style="text-transform:uppercase;">${transferPricing.riskOfAdjustment}</strong></td></tr>
    </table>

    <h2>4. Strategic Tax Structuring Recommendations</h2>
    <ul>
      ${(report.strategicStructuringRecommendations || []).map((r) => `<li>${r}</li>`).join('')}
    </ul>

    <h2>5. Mandatory Statutory Compliance Checklist</h2>
    <table>
      <tr><th>Document / Requirement</th><th>Enforcing Authority</th><th>Status</th><th>Statutory Ref</th></tr>
      ${report.complianceChecklist.map((c) => `
        <tr>
          <td><strong>${c.name}</strong><br/><span style="font-size:9pt; color:#64748b;">${c.description}</span></td>
          <td>${c.authority}</td>
          <td><span class="badge">${c.status.toUpperCase()}</span></td>
          <td>${c.statutoryRef}</td>
        </tr>
      `).join('')}
    </table>
  `;
}
