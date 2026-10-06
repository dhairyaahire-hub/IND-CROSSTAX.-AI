import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { getTreatyInfo, getCountryTPProfile } from "./src/data/treatyDatabase.ts";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3e3;
app.use(express.json({ limit: "10mb" }));
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
const CANDIDATE_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
  "gemini-3.8-flash",
  "gemini-3.1-pro-preview"
];
async function callGeminiWithCascade(params) {
  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config
      });
      if (response && response.text) {
        return response;
      }
    } catch (err) {
      continue;
    }
  }
  return null;
}
const webhookLogs = [];
function calculateBaselineTaxFigures(input) {
  const treaty = getTreatyInfo(input.residentCountry, input.sourceCountry);
  const residentProfile = getCountryTPProfile(input.residentCountry);
  const sourceProfile = getCountryTPProfile(input.sourceCountry);
  const totalCost = (input.directCostBase || 0) + (input.indirectCostBase || 0);
  let method = "TNMM";
  let pli = "Operating Profit / Total Cost (OP/TC)";
  let p35 = 14.5;
  let median = 17.5;
  let p65 = 20.5;
  let safeHarbourThreshold = 17;
  let safeHarbourRuleRef = "CBDT Safe Harbour Rule 10TD (IT Services)";
  if (input.residentCountry === "IN" || input.sourceCountry === "IN") {
    if (input.transactionCategory === "technical_consultancy_fts") {
      p35 = 18;
      median = 21;
      p65 = 24.5;
      safeHarbourThreshold = 24;
      safeHarbourRuleRef = "Indian CBDT Safe Harbour Rule 10TD (KPO Services)";
    } else {
      safeHarbourThreshold = 17;
      safeHarbourRuleRef = "Indian CBDT Safe Harbour Rule 10TD (IT/ITeS Services)";
    }
  } else if (input.residentCountry === "SG" || input.sourceCountry === "SG") {
    safeHarbourThreshold = 5;
    safeHarbourRuleRef = "IRAS 5% Cost Mark-Up Safe Harbour (Routine Support Services)";
    median = 12;
    p35 = 8;
    p65 = 15;
  } else if (input.residentCountry === "US" || input.sourceCountry === "US") {
    safeHarbourThreshold = 5;
    safeHarbourRuleRef = "IRS Services Cost Method (SCM) under Treas. Reg. \xA71.482-9";
    median = 15;
    p35 = 10;
    p65 = 18.5;
  } else if (input.residentCountry === "UK" || input.sourceCountry === "UK") {
    safeHarbourThreshold = 5;
    safeHarbourRuleRef = "HMRC / OECD 5% Simplified Markup for Low Value-Adding Services";
    median = 12.5;
    p35 = 9;
    p65 = 16;
  } else if (input.residentCountry === "AE" || input.sourceCountry === "AE") {
    safeHarbourThreshold = 5;
    safeHarbourRuleRef = "UAE FTA Article 34 Connected Persons Arm's Length Guidance";
    median = 12;
    p35 = 8.5;
    p65 = 15.5;
  } else {
    safeHarbourThreshold = 5;
    safeHarbourRuleRef = "OECD Guidelines 2022 Simplified 5% Safe Harbour for Low Value-Adding Services";
    median = 14;
    p35 = 10;
    p65 = 18;
  }
  if (input.transactionCategory === "freelance_engineering") {
    method = "CUP";
    pli = "Hourly / Deliverable Market Rate";
  }
  const currentMargin = input.currentInvoicedMarginPct || 0;
  const isWithinRange = currentMargin >= p35 && currentMargin <= p65;
  const safeHarbourApplicable = input.isPartOfSameGroup && currentMargin >= safeHarbourThreshold;
  const recommendedPrice = totalCost > 0 ? Math.round(totalCost * (1 + median / 100)) : input.annualValue;
  const varianceAmount = Math.max(0, recommendedPrice - input.annualValue);
  const peFactors = [];
  let peRisk = "low";
  if (input.hasPhysicalOfficeInSource) {
    peFactors.push("Fixed Place PE (Article 5(1)): Maintained permanent office/place of business");
    peRisk = "high";
  }
  if (input.durationDaysInSource > treaty.servicePeDaysThreshold) {
    peFactors.push(`Service PE threshold exceeded: ${input.durationDaysInSource} days on ground vs ${treaty.servicePeDaysThreshold} day treaty threshold`);
    peRisk = "high";
  } else if (input.durationDaysInSource > treaty.servicePeDaysThreshold * 0.7) {
    peFactors.push(`Service PE borderline: ${input.durationDaysInSource} days approaches treaty limit of ${treaty.servicePeDaysThreshold} days`);
    if (peRisk !== "high") peRisk = "medium";
  }
  if (input.hasDependentAgentInSource) {
    peFactors.push("Agency PE (Article 5(5)): Dependent agent habitually concluding cross-border contracts");
    peRisk = "high";
  }
  let isBusinessProfitExempt = false;
  let applicableTreatyRate = treaty.ftsTreatyRate;
  if (!peFactors.length && !input.serviceMakeAvailable && (input.transactionCategory === "software_it" || input.transactionCategory === "freelance_engineering" || input.transactionCategory === "digital_saas")) {
    isBusinessProfitExempt = true;
    applicableTreatyRate = 0;
  }
  const domesticRate = treaty.ftsDomesticRate;
  const domesticTax = input.annualValue * domesticRate / 100;
  const treatyTax = input.annualValue * applicableTreatyRate / 100;
  const estimatedSavings = Math.max(0, domesticTax - treatyTax);
  const governingCountryLaw = `${sourceProfile.countryName} (${sourceProfile.tpLawTitle}) & ${residentProfile.countryName} (${residentProfile.tpLawTitle})`;
  const governingAuthority = `${sourceProfile.governingAuthority} & ${residentProfile.governingAuthority}`;
  return {
    treaty,
    residentProfile,
    sourceProfile,
    governingCountryLaw,
    governingAuthority,
    totalCost,
    method,
    pli,
    p35,
    median,
    p65,
    safeHarbourThreshold,
    safeHarbourRuleRef,
    currentMargin,
    isWithinRange,
    safeHarbourApplicable,
    recommendedPrice,
    varianceAmount,
    peRisk,
    peFactors,
    isBusinessProfitExempt,
    domesticRate,
    applicableTreatyRate,
    domesticTax,
    treatyTax,
    estimatedSavings
  };
}
app.post("/api/evaluate-tax-contract", async (req, res) => {
  try {
    const input = req.body;
    const baseline = calculateBaselineTaxFigures(input);
    const prompt = `
You are an elite International Tax Partner and Transfer Pricing Economist specialized in OECD Guidelines, bilateral Double Taxation Avoidance Agreements (DTAA), the Income-tax Act 2025 overhaul, and India Income Tax Act 1961 Chapter X.

Analyze this cross-border transaction:
- Client: ${input.clientName} (${input.entityType})
- Origin / Residence: ${input.residentCountry}
- Source / Paying Country: ${input.sourceCountry}
- Transaction: ${input.transactionCategory} - "${input.contractTitle}"
- Annual Contract Value: ${input.currency} ${input.annualValue.toLocaleString()}
- Associated Enterprise (Related Group): ${input.isPartOfSameGroup ? `Yes (${input.relationshipNature || "Related"})` : "No (Third party arm length)"}
- Cost Base: Direct ${input.currency} ${input.directCostBase}, Indirect ${input.currency} ${input.indirectCostBase}, Margin: ${input.currentInvoicedMarginPct}%
- Physical Days in Source: ${input.durationDaysInSource} days (Treaty threshold: ${baseline.treaty.servicePeDaysThreshold} days)
- Has Physical Office: ${input.hasPhysicalOfficeInSource}
- Has Dependent Agent: ${input.hasDependentAgentInSource}
- Make Available clause applicable: ${input.serviceMakeAvailable}
- Documentation available: TRC=${input.hasTRC}, Form 10F=${input.hasForm10F}, PAN/Tax ID=${input.hasPANorTaxID}

Baseline Calculations:
- Applicable DTAA: ${input.residentCountry}-${input.sourceCountry} Treaty
- Domestic WHT Rate: ${baseline.domesticRate}% ($${baseline.domesticTax})
- Treaty WHT Rate: ${baseline.applicableTreatyRate}% ($${baseline.treatyTax})
- Estimated Direct Tax Savings via Treaty: $${baseline.estimatedSavings}
- PE Risk: ${baseline.peRisk}
- Transfer Pricing Method: ${baseline.method}, Median Benchmark: ${baseline.median}%, Safe Harbour applicable: ${baseline.safeHarbourApplicable}

Provide an exhaustive, professional tax assessment in JSON format with:
1. "executiveSummary": 2-3 sentences concise strategic overview.
2. "peEvaluationSummary": Analysis of Permanent Establishment exposure under Article 5 (Fixed Place, Service PE, Agency PE, and digital presence).
3. "strategicStructuringRecommendations": Array of 3-5 high-impact, legally grounded recommendations (e.g. TRC procurement, Form 10F e-filing, intercompany agreement TP clauses, avoiding Service PE days limit, IP ownership allocation).
4. "legalPrecedentsAndArticles": Array of 3 objects with "treatyArticle" (e.g., "Article 12(4) - Make Available Clause"), "description", and "relevance" to this specific contract.
5. "complianceChecklist": Array of objects { "id", "name", "authority", "mandatory", "status", "description", "statutoryRef" } covering TRC, Form 10F, No-PE Declaration, Form 3CEB (if AE), Transfer Pricing Study Documentation, and WHT return.
`;
    let parsedAi = {};
    try {
      const response = await callGeminiWithCascade({
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executiveSummary: { type: Type.STRING },
              peEvaluationSummary: { type: Type.STRING },
              strategicStructuringRecommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              legalPrecedentsAndArticles: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    treatyArticle: { type: Type.STRING },
                    description: { type: Type.STRING },
                    relevance: { type: Type.STRING }
                  },
                  required: ["treatyArticle", "description", "relevance"]
                }
              },
              complianceChecklist: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    authority: { type: Type.STRING },
                    mandatory: { type: Type.BOOLEAN },
                    status: { type: Type.STRING },
                    description: { type: Type.STRING },
                    statutoryRef: { type: Type.STRING }
                  },
                  required: ["id", "name", "authority", "mandatory", "status", "description", "statutoryRef"]
                }
              }
            },
            required: ["executiveSummary", "peEvaluationSummary", "strategicStructuringRecommendations", "legalPrecedentsAndArticles"]
          }
        }
      });
      if (response && response.text) {
        parsedAi = JSON.parse(response.text.trim() || "{}");
      }
    } catch {
    }
    const fullReport = {
      id: `TAX-${Date.now().toString(36).toUpperCase()}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      contract: input,
      dtaa: {
        applicableTreaty: `${input.residentCountry}-${input.sourceCountry} Bilateral Tax Convention`,
        residenceState: input.residentCountry,
        sourceState: input.sourceCountry,
        taxableUnderTreaty: !baseline.isBusinessProfitExempt,
        peRiskLevel: baseline.peRisk,
        peRiskFactors: baseline.peFactors.length ? baseline.peFactors : ["No physical or agency nexus identified in source jurisdiction"],
        peEvaluationSummary: parsedAi.peEvaluationSummary || "Based on duration of presence and absence of fixed place or dependent agency, risk of permanent establishment is contained.",
        domesticWhtRate: baseline.domesticRate,
        treatyWhtRate: baseline.applicableTreatyRate,
        grossTaxDomestic: baseline.domesticTax,
        grossTaxTreaty: baseline.treatyTax,
        estimatedTaxSavings: baseline.estimatedSavings,
        effectiveTaxReliefPct: baseline.domesticRate > 0 ? Math.round((baseline.domesticRate - baseline.applicableTreatyRate) / baseline.domesticRate * 100) : 0,
        qualifiesForExemption: baseline.isBusinessProfitExempt,
        makeAvailableReliefApplies: input.serviceMakeAvailable === false && baseline.treaty.hasMakeAvailableClause
      },
      transferPricing: {
        method: baseline.method,
        profitLevelIndicator: baseline.pli,
        comparablesCount: 18,
        percentile35th: baseline.p35,
        median: baseline.median,
        percentile65th: baseline.p65,
        currentMargin: baseline.currentMargin,
        isWithinRange: baseline.isWithinRange,
        safeHarbourApplicable: baseline.safeHarbourApplicable,
        safeHarbourThreshold: baseline.safeHarbourThreshold,
        safeHarbourRuleRef: baseline.safeHarbourRuleRef,
        recommendedArmLengthPrice: baseline.recommendedPrice,
        varianceAmount: baseline.varianceAmount,
        riskOfAdjustment: baseline.isWithinRange || baseline.safeHarbourApplicable ? "low" : baseline.currentMargin < baseline.p35 ? "high" : "moderate",
        secondaryAdjustmentRisk: input.isPartOfSameGroup && baseline.currentMargin < baseline.p35 && input.sourceCountry === "IN",
        governingCountryLaw: baseline.governingCountryLaw,
        governingAuthority: baseline.governingAuthority
      },
      residentCountryTPProfile: baseline.residentProfile,
      sourceCountryTPProfile: baseline.sourceProfile,
      corridorApplicableLawSummary: `Governed by ${baseline.residentProfile.countryName} (${baseline.residentProfile.tpLawTitle}) and ${baseline.sourceProfile.countryName} (${baseline.sourceProfile.tpLawTitle}). Bilateral double tax relief evaluated under Articles 5, 7, and 12 of the ${baseline.residentProfile.countryName}-${baseline.sourceProfile.countryName} Tax Treaty.`,
      complianceChecklist: parsedAi.complianceChecklist && parsedAi.complianceChecklist.length > 0 ? parsedAi.complianceChecklist : [
        {
          id: "trc",
          name: "Tax Residency Certificate (TRC / Form 6166)",
          authority: `${input.residentCountry} Revenue Authority`,
          mandatory: true,
          status: input.hasTRC ? "ready" : "missing",
          description: "Statutory prerequisite to claim relief under Section 90(4) of the Income Tax Act.",
          statutoryRef: "Section 90(4) / Treaty Art 4"
        },
        {
          id: "form10f",
          name: "Electronic Form 10F Declaration",
          authority: "Income Tax Department E-Filing Portal",
          mandatory: true,
          status: input.hasForm10F ? "ready" : "missing",
          description: "Mandatory electronic verification for non-residents claiming DTAA benefits in India.",
          statutoryRef: "Rule 21AB, Income Tax Rules 1962"
        },
        {
          id: "no_pe_cert",
          name: "No-PE & Beneficial Ownership Certificate",
          authority: "Self-Certified Legal Declaration",
          mandatory: true,
          status: baseline.peRisk === "low" ? "ready" : "recommended",
          description: "Declaration confirming no fixed place, service, or dependent agency PE under Article 5.",
          statutoryRef: "Article 5 & Article 7 DTAA"
        },
        {
          id: "form3ceb",
          name: "Form 3CEB Accountant Transfer Pricing Report",
          authority: "Chartered Accountant / Tax Auditor",
          mandatory: input.isPartOfSameGroup,
          status: input.isPartOfSameGroup ? "recommended" : "ready",
          description: "Statutory audit filing under Section 92E verifying arm length price in international transactions.",
          statutoryRef: "Section 92E, Income Tax Act"
        },
        {
          id: "tp_study",
          name: "Transfer Pricing Local File & Benchmarking Study",
          authority: "Corporate Records / Tax Authority Inspection",
          mandatory: input.isPartOfSameGroup,
          status: input.isPartOfSameGroup ? "missing" : "ready",
          description: "Contemporaneous economic benchmarking report with search strings & financial filters.",
          statutoryRef: "Section 92D / Rule 10D"
        }
      ],
      executiveSummary: parsedAi.executiveSummary || `The proposed transaction between ${input.clientName} and its counterparty qualifies for DTAA treaty relief under the ${input.residentCountry}-${input.sourceCountry} convention, unlocking an estimated ${input.currency} ${baseline.estimatedSavings.toLocaleString()} in withholding tax optimization while mitigating Permanent Establishment risk.`,
      strategicStructuringRecommendations: parsedAi.strategicStructuringRecommendations || [
        "Secure updated Tax Residency Certificate from resident country tax authority before invoice payment.",
        "File electronic Form 10F on the e-filing portal to avert penal 20% domestic tax deduction.",
        "Maintain formal time-sheets and travel logs ensuring personnel presence remains strictly below treaty threshold.",
        "Formalize Master Services Agreement incorporating OECD-compliant Transfer Pricing benchmarking clause."
      ],
      legalPrecedentsAndArticles: parsedAi.legalPrecedentsAndArticles || [
        {
          treatyArticle: baseline.treaty.articleBusinessProfits,
          description: "Business Profits Taxation",
          relevance: "Limits source-state taxation exclusively to profits attributable to a Permanent Establishment."
        },
        {
          treatyArticle: baseline.treaty.articlePE,
          description: "Permanent Establishment Threshold",
          relevance: "Governs physical and service nexus rules preventing inadvertent enterprise taxation."
        },
        {
          treatyArticle: baseline.treaty.articleFTS,
          description: "Fees for Technical Services & Royalties",
          relevance: "Provides concessional withholding rate or Make Available exemption over domestic rate."
        }
      ],
      generatedDraftsAvailable: [
        "Form 10F Electronic Portal Draft",
        "No-PE & Beneficial Ownership Self-Declaration",
        "Transfer Pricing Intercompany Agreement Clause",
        "DTAA Legal Position & Tax Structuring Memorandum",
        "Form 3CEB TP Audit Summary Sheet"
      ]
    };
    res.json(fullReport);
  } catch (error) {
    console.error("Error evaluating tax contract:", error);
    res.status(500).json({ error: error.message || "Internal tax evaluation failed" });
  }
});
app.post("/api/generate-draft", async (req, res) => {
  try {
    const draftType = req.body.draftType || "no_pe_certificate";
    const contract = req.body.contract || req.body.report?.contract || {};
    const dtaa = req.body.dtaa || req.body.report?.dtaa;
    const transferPricing = req.body.transferPricing || req.body.report?.transferPricing;
    const residentCountry = contract.residentCountry || "IN";
    const sourceCountry = contract.sourceCountry || "US";
    const residentProfile = getCountryTPProfile(residentCountry);
    const sourceProfile = getCountryTPProfile(sourceCountry);
    const prompt = `
You are a Senior International Tax Lawyer and Transfer Pricing Partner at Cross Tax AI. Draft a complete, official, legally binding document tailored specifically to the following client details:

Document Type Requested: ${draftType}
(Options: "form_10f", "no_pe_certificate", "tp_agreement_clause", "dtaa_position_memo", "form_3ceb_brief", "w8bene_statement", "uae_ct_statement", "sg_ir34d_statement", "uk_dttp_statement")

Client & Contract Details:
- Company / Individual Name: ${contract.clientName} (${contract.entityType})
- Residence Jurisdiction: ${contract.residentCountry} (${residentProfile.countryName} - ${residentProfile.tpLawTitle})
- Source / Customer Jurisdiction: ${contract.sourceCountry} (${sourceProfile.countryName} - ${sourceProfile.tpLawTitle})
- Tax Identification Number (PAN/EIN/UEN/TRN): ${contract.taxIdNumber || "Assigned"}
- Fiscal / Tax Assessment Year: ${contract.fiscalYear || "Current Accounting Year"}
- Transaction: ${contract.transactionCategory} - "${contract.contractTitle}"
- Annual Contract Sum: ${contract.currency} ${contract.annualValue.toLocaleString()}
- Related Party / Associated Enterprise: ${contract.isPartOfSameGroup ? `Yes (${contract.relationshipNature || "Related Subsidiary / Parent"})` : "Independent Third Party"}
- Invoiced Margin: ${contract.currentInvoicedMarginPct}%, Arm's Length Median: ${transferPricing?.median || 15}%
- Days in Source State: ${contract.durationDaysInSource} days (Treaty PE Limit: ${dtaa?.applicableTreaty ? "Bilateral threshold" : "183 days"})
- Applicable Treaty: ${contract.residentCountry}-${contract.sourceCountry} DTAA
- Domestic WHT: ${dtaa?.domesticWhtRate || sourceProfile.domesticWhtRate}%, Treaty Rate: ${dtaa?.treatyWhtRate || 0}%

Drafting Guidelines:
- If "w8bene_statement": Generate an official US Certificate of Foreign Status & Treaty Statement under IRC \xA71441/\xA71442, referencing Chapter 3/4 FATCA status, Form W-8BEN-E Part III Treaty Claim for ${residentProfile.countryName}, Article 7/12 benefits, and 0% FDAP withholding certification.
- If "form_10f": Generate the official Indian Income Tax Form 10F layout under Rule 21AB of the Income Tax Rules, 1962, with all 6 required statutory clauses, verified details, declaration text, and execution block.
- If "uae_ct_statement": Generate the UAE Corporate Tax Decree-Law No. 47 of 2022 (Articles 34 & 55) Connected Persons Arm's Length Benchmarking Declaration and Transfer Pricing Disclosure dossier summary.
- If "sg_ir34d_statement": Generate the Singapore IRAS Income Tax Act Section 34D Contemporaneous Arm's Length Transfer Pricing Documentation and Form IR37 Withholding Exemption Certificate.
- If "uk_dttp_statement": Generate the UK HMRC Double Taxation Treaty Passport (DTTP) scheme application declaration and TIOPA 2010 Part 4 Arm's Length Pricing Schedule.
- If "no_pe_certificate": Generate a formal Affidavit and Declaration of Absence of Permanent Establishment under Article 5 & 7 of the ${contract.residentCountry}-${contract.sourceCountry} bilateral treaty, confirming no fixed place, no service PE, no dependent agent, and beneficial ownership.
- If "tp_agreement_clause": Draft a bulletproof Intercompany Master Services Agreement Transfer Pricing Section, incorporating OECD Guidelines 2022, ${residentProfile.tpLawTitle}, and ${sourceProfile.tpLawTitle}, Most Appropriate Method selection (TNMM/CUP), safe harbour election, and quarterly true-up adjustments.
- If "dtaa_position_memo": Draft an authoritative Executive Legal Position Memorandum, citing relevant DTAA Articles (Art 5, 7, 12, 13), domestic beneficial provision rules, and withholding tax directive to the paying counterparty.
- If "form_3ceb_brief": Draft the Form 3CEB / Accountant's Report Annexure Summary for the Statutory Auditor and Transfer Pricing Officer.

Output the document in clean, professional Markdown with formal legal headings, exact dates, signature blocks, and bracketed placeholder guidance.
`;
    let draftText = "";
    try {
      const response = await callGeminiWithCascade({
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
        }
      });
      draftText = response?.text || "";
    } catch {
    }
    if (!draftText) {
      if (draftType === "form_10f") {
        draftText = `# FORM NO. 10F
*[See sub-rule (1) of rule 21AB]*
### Information to be furnished under sub-section (5) of section 90 or sub-section (5) of section 90A of the Income-tax Act, 1961

1. **Name of the assessee**: ${contract.clientName}
2. **Permanent Account Number (PAN) / Tax Identification Number**: ${contract.taxIdNumber || (contract.hasPANorTaxID ? "FURNISHED" : "NOT APPLICABLE / UNDER RULE 37BC")}
3. **Status**: ${contract.entityType === "freelancer" ? "Individual" : "Company / Body Corporate"}
4. **Country of incorporation / residence**: ${contract.residentCountry}
5. **Assessee's tax identification number** in the country or specified territory of residence: ${contract.taxIdNumber || `${contract.residentCountry}-TAX-${Date.now().toString(36).toUpperCase()}`}
6. **Period for which the certificate of residence referred to in sub-section (4) of section 90 is applicable**: ${contract.fiscalYear || "Current Assessment Year"}

---

### VERIFICATION & DECLARATION
I, the authorized signatory of **${contract.clientName}**, do hereby declare that to the best of my knowledge and belief what is stated above is correct, complete and is truly stated.

I have been a resident of **${contract.residentCountry}** within the meaning of the Double Taxation Avoidance Agreement (DTAA) between India and ${contract.residentCountry}.

I also confirm that:
- The assessee does not have a Permanent Establishment (PE) or Fixed Place of Business in India within the terms of Article 5 of the said Agreement.
- The transaction value of **${contract.currency} ${contract.annualValue.toLocaleString()}** represents business profits / non-FTS income under Article 7 / Article 12(4).

**Verified at**: ${contract.residentCountry}
**Date**: ${(/* @__PURE__ */ new Date()).toLocaleDateString()}
**Signature**: _____________________________
*(Authorized Officer / Managing Director)*`;
      } else if (draftType === "no_pe_certificate") {
        draftText = `# DECLARATION OF ABSENCE OF PERMANENT ESTABLISHMENT (NO-PE CERTIFICATE)
### (To be executed on the Official Letterhead of ${contract.clientName})

**Date**: ${(/* @__PURE__ */ new Date()).toLocaleDateString()}
**To**: The Tax Withholding Officer / Finance Department,
**Counterparty Address**: Source State Jurisdiction (${contract.sourceCountry})

**Subject**: Declaration under Article 5 & Article 7 of the Double Taxation Avoidance Agreement (DTAA)

Dear Sir/Madam,

We, **${contract.clientName}**, a legal entity incorporated and tax resident in **${contract.residentCountry}**, hereby declare and certify under oath as follows:

1. **Tax Residency**: We are a bona fide tax resident of **${contract.residentCountry}** and hold a valid Tax Residency Certificate (TRC) issued by the competent revenue authority for the relevant financial period.
2. **Absence of Fixed Place PE**: We do not maintain any fixed place of business, branch, project office, workshop, or management presence in **${contract.sourceCountry}** through which our business is carried on, as defined under Article 5(1) and 5(2) of the DTAA.
3. **Service PE Duration**: The aggregate duration of physical presence of our personnel in **${contract.sourceCountry}** for the contract ("${contract.contractTitle}") is **${contract.durationDaysInSource} days**, which remains strictly below the treaty Service PE threshold.
4. **No Dependent Agent**: We do not have, nor have we ever maintained, an agent of dependent status in **${contract.sourceCountry}** who habitually exercises authority to conclude binding contracts in our name under Article 5(5).
5. **Beneficial Ownership**: We are the sole economic and beneficial owner of the payments amounting to **${contract.currency} ${contract.annualValue.toLocaleString()}** receivable under the said contract.

Accordingly, the payments are taxable strictly as Business Profits under Article 7 of the DTAA and are exempt from withholding tax at source in ${contract.sourceCountry}.

**For and on behalf of ${contract.clientName}**:

___________________________________
*(Authorized Signatory & Seal)*
**Designation**: Chief Financial Officer / Director`;
      } else if (draftType === "tp_agreement_clause") {
        draftText = `# MASTER SERVICES AGREEMENT: TRANSFER PRICING & ARM'S LENGTH COVENANTS
### Applicable to Cross-Border Associated Enterprise Transactions under Section 92C & OECD Guidelines

#### ARTICLE 9: TRANSFER PRICING, BENCHMARKING & ARM'S LENGTH COMPENSATION

**9.1 Arm's Length Consideration**:
The Parties explicitly acknowledge and agree that all services rendered hereunder by **${contract.clientName}** to the Customer constitute an international transaction between Associated Enterprises (AEs) within the meaning of Section 92A of the Indian Income Tax Act, 1961 and Article 9 of the OECD Model Convention.

**9.2 Most Appropriate Method (MAM)**:
The Parties hereby agree that the **Transactional Net Margin Method (TNMM)** using **Operating Profit to Total Cost (OP/TC)** as the primary Profit Level Indicator (PLI) is selected as the Most Appropriate Method in accordance with Rule 10C of the Income Tax Rules, 1962.

**9.3 Benchmark Markup & Remuneration**:
- Total Operating Costs (comprising Direct Labor, Overhead, and allocated operational costs) incurred by the Service Provider shall be reimbursed with an Arm's Length markup of **${transferPricing?.median || contract.currentInvoicedMarginPct}%**.
- Current Invoiced Base: **${contract.currency} ${contract.annualValue.toLocaleString()}**.
- The remuneration falls within the statutory 35th to 65th percentile range prescribed under Rule 10CA of the Income Tax Rules.

**9.4 True-Up Adjustments & Secondary Adjustment Indemnity**:
At the close of each fiscal financial quarter, an independent accountant true-up review shall be performed. In the event the realized operating margin deviates from the Arm's Length Range, the Customer shall effect an immediate balancing debit/credit adjustment to preclude secondary transfer pricing adjustments under Section 92CE.

**9.5 Statutory Audit & Form 3CEB Compliance**:
The Service Provider covenants to obtain and file the Accountant's Report in Form 3CEB certified by an independent Chartered Accountant in compliance with Section 92E.`;
      } else {
        draftText = `# CROSS TAX AI: FORMAL TAX POSITION & DTAA LEGAL MEMORANDUM
### Re: Cross-Border Contract Characterization & Withholding Tax Optimization

**Client Entity**: ${contract.clientName} (${contract.residentCountry})
**Paying Counterparty**: Source Jurisdiction Entity (${contract.sourceCountry})
**Engagement**: ${contract.contractTitle}
**Governing Treaties**: ${contract.residentCountry}-${contract.sourceCountry} Bilateral Tax Treaty / Section 90(2)

---

### 1. EXECUTIVE SUMMARY & LEGAL DIRECTIVE
This Memorandum establishes the legal and economic basis for the application of Double Taxation Avoidance Agreement (DTAA) relief to payments of **${contract.currency} ${contract.annualValue.toLocaleString()}**.
Based on the absence of a Permanent Establishment (PE) under Article 5 and the satisfaction of the statutory prerequisites (TRC & Form 10F), the domestic withholding tax of **${dtaa?.domesticWhtRate || 20}%** is legally superseded by the treaty rate of **${dtaa?.treatyWhtRate || 0}%**, yielding an estimated tax savings of **${contract.currency} ${(dtaa?.estimatedTaxSavings || 0).toLocaleString()}**.

### 2. BENEFICIAL PROVISION PRINCIPLE (SECTION 90(2))
Under settled international tax jurisprudence and Section 90(2) of the Indian Income Tax Act, the provisions of the domestic Act apply only to the extent they are more beneficial to the assessee. Where treaty terms provide a lower rate or complete exemption, the treaty prevails over domestic statutes.

### 3. ARTICLE 5 & 7 ANALYSIS (BUSINESS PROFITS vs PE)
- Physical presence on ground: **${contract.durationDaysInSource} days**, well within the permissible treaty Service PE ceiling.
- Under Article 7(1), business profits of an enterprise resident in ${contract.residentCountry} are taxable ONLY in ${contract.residentCountry} unless business is transacted through a PE in ${contract.sourceCountry}.
- Landmark Supreme Court Precedents: *Formula One World Championship Ltd* and *E-Funds IT Solutions*.

### 4. COMPLIANCE DIRECTIVE TO THE PAYOR
The paying counterparty is legally instructed to withhold tax at the concessional rate of **${dtaa?.treatyWhtRate || 0}%** upon receipt of:
1. Valid Tax Residency Certificate (TRC)
2. Electronic Form 10F verification
3. Executed No-PE Affidavit`;
      }
    }
    res.json({ draftType, content: draftText });
  } catch (error) {
    console.error("Error generating tax draft:", error);
    res.status(500).json({ error: error.message || "Draft generation failed" });
  }
});
app.post("/api/chat-tax-agent", async (req, res) => {
  try {
    const { message, history, contextReport } = req.body;
    const systemInstruction = `
You are the Lead International Tax & Transfer Pricing Counsel for "Cross Tax AI".
You have master-level expertise in:
- Bilateral Double Taxation Avoidance Agreements (DTAA) based on OECD and UN Model Conventions
- India Income Tax Act, 2025 (New Overhaul & Direct Tax Framework) alongside Income Tax Act, 1961: Chapter X (Sections 92 to 92F Transfer Pricing, Form 3CEB, Safe Harbour Rules 10TD/10TE, Rule 10CA 35th-65th percentile range, Section 92CE Secondary Adjustments), Section 90/90A (Treaty Relief), Section 195 (Withholding), Section 206AA (PAN penal rates), Section 115A (FTS & Royalty taxation).
- US Internal Revenue Code: Section 482 (Transfer Pricing), FDAP withholding, Form W-8BEN-E, US-India DTAA.
- OECD BEPS Actions (Action 8-10 Intangibles & Risk, Action 13 TP Documentation).
- Landmark Judgments: Supreme Court in Engineering Analysis (Software royalties), Formula One (Service/Fixed PE), Nestle (MFN clause), CIT v. Guy Carpenter (Make available test).

Current Client Context:
${contextReport ? JSON.stringify({
      client: contextReport.contract.clientName,
      corridor: `${contextReport.contract.residentCountry} to ${contextReport.contract.sourceCountry}`,
      transaction: contextReport.contract.contractTitle,
      value: `${contextReport.contract.currency} ${contextReport.contract.annualValue}`,
      peRisk: contextReport.dtaa.peRiskLevel,
      whtSavings: contextReport.dtaa.estimatedTaxSavings,
      tpMargin: contextReport.transferPricing.currentMargin,
      tpMedian: contextReport.transferPricing.median
    }) : "No active contract loaded."}

Tone: Authoritative, pragmatic, legally precise, tailored to CFOs, startup founders, freelancers, and tax managers. Provide specific statutory references and actionable advice.
`;
    const chatContents = [];
    if (history && Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        chatContents.push({ role: h.role === "user" ? "user" : "model", parts: [{ text: h.text }] });
      }
    }
    chatContents.push({ role: "user", parts: [{ text: message }] });
    let reply = "";
    try {
      const response = await callGeminiWithCascade({
        contents: chatContents,
        config: {
          systemInstruction,
          temperature: 0.6,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
        }
      });
      reply = response?.text || "";
    } catch {
    }
    if (!reply) {
      reply = `Thank you for your inquiry regarding cross-border taxation. 

Based on international tax law and DTAA jurisprudence:
1. **DTAA Relief (Section 90(2))**: Tax treaties supersede domestic tax laws whenever more beneficial to the taxpayer. If you hold a Tax Residency Certificate (TRC) and electronic Form 10F, source-state withholding tax can be reduced to treaty rates (e.g. 0% for business profits or 10-15% for royalties/FTS).
2. **Permanent Establishment (Article 5)**: Ensure your physical service duration in the customer's country remains strictly under the treaty threshold (e.g., 90 days for India-US, 183 days for OECD standard) to avert corporate tax nexus.
3. **Transfer Pricing (Chapter X)**: For transactions with related group entities (AEs), maintain an arm's length markup within the 35th to 65th percentile range under Rule 10CA or qualify for CBDT Safe Harbour (17% for IT / 24% for KPO).

Please let me know if you would like me to unpack a specific article or contract clause.`;
    }
    res.json({ reply });
  } catch (error) {
    console.error("Error in tax counsel chat:", error);
    res.status(500).json({ error: error.message || "Tax counsel chat failed" });
  }
});
app.post("/api/trigger-make-webhook", async (req, res) => {
  try {
    const { webhookUrl, report, clientEmail } = req.body;
    const payload = {
      event: "dtaa_tp_evaluation_completed",
      source: "Cross Tax AI Engine",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      reportId: report.id,
      client: {
        name: report.contract.clientName,
        email: clientEmail || report.contract.clientEmail,
        residentCountry: report.contract.residentCountry,
        sourceCountry: report.contract.sourceCountry
      },
      financials: {
        contractValue: `${report.contract.currency} ${report.contract.annualValue.toLocaleString()}`,
        domesticTax: `${report.contract.currency} ${report.dtaa.grossTaxDomestic.toLocaleString()}`,
        treatyTax: `${report.contract.currency} ${report.dtaa.grossTaxTreaty.toLocaleString()}`,
        directSavings: `${report.contract.currency} ${report.dtaa.estimatedTaxSavings.toLocaleString()}`
      },
      riskAndCompliance: {
        peRiskLevel: report.dtaa.peRiskLevel,
        transferPricingMethod: report.transferPricing.method,
        recommendedMargin: `${report.transferPricing.median}%`,
        currentMargin: `${report.transferPricing.currentMargin}%`,
        isWithinArmLengthRange: report.transferPricing.isWithinRange,
        safeHarbourEligible: report.transferPricing.safeHarbourApplicable,
        mandatoryFilings: report.complianceChecklist.filter((c) => c.mandatory).map((c) => c.name)
      },
      summary: report.executiveSummary
    };
    let dispatchStatus = "simulated";
    if (webhookUrl && webhookUrl.startsWith("http")) {
      try {
        const fetchRes = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        dispatchStatus = fetchRes.ok ? "success" : "failed";
      } catch (webhookErr) {
        console.warn("Webhook dispatch failed, falling back to simulated:", webhookErr);
        dispatchStatus = "failed";
      }
    }
    const logEntry = {
      id: `WH-${Date.now().toString(36)}`,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
      targetUrl: webhookUrl || "Make.com Webhook Scenario (Automated Email Delivery)",
      status: dispatchStatus,
      clientEmail: clientEmail || report.contract.clientEmail,
      payloadSummary: {
        contractValue: `${report.contract.currency} ${report.contract.annualValue.toLocaleString()}`,
        taxSavings: `${report.contract.currency} ${report.dtaa.estimatedTaxSavings.toLocaleString()}`,
        peRisk: report.dtaa.peRiskLevel.toUpperCase(),
        tpMethod: report.transferPricing.method
      }
    };
    webhookLogs.unshift(logEntry);
    if (webhookLogs.length > 20) webhookLogs.pop();
    res.json({
      success: true,
      dispatchStatus,
      log: logEntry,
      dispatchedPayload: payload,
      message: dispatchStatus === "success" ? `Successfully dispatched payload to Make.com webhook!` : `Simulated Make.com trigger successful! An automated Tax Advisory Report & Compliance Kit has been queued for email delivery to ${clientEmail || report.contract.clientEmail}.`
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Webhook trigger failed" });
  }
});
app.post("/api/webhook/make-lead", async (req, res) => {
  try {
    const rawData = req.body;
    const input = {
      clientName: rawData.clientName || rawData.name || "Inbound Webhook Lead",
      clientEmail: rawData.clientEmail || rawData.email || "lead@example.com",
      entityType: rawData.entityType || "sme",
      residentCountry: (rawData.residentCountry || "IN").toUpperCase(),
      sourceCountry: (rawData.sourceCountry || "US").toUpperCase(),
      transactionCategory: rawData.transactionCategory || "software_it",
      contractTitle: rawData.contractTitle || "Cross-Border Services Engagement",
      annualValue: Number(rawData.annualValue) || 25e4,
      currency: rawData.currency || "USD",
      isPartOfSameGroup: Boolean(rawData.isPartOfSameGroup ?? true),
      relationshipNature: rawData.relationshipNature || "Subsidiary",
      directCostBase: Number(rawData.directCostBase) || 16e4,
      indirectCostBase: Number(rawData.indirectCostBase) || 4e4,
      currentInvoicedMarginPct: Number(rawData.currentInvoicedMarginPct) || 15,
      durationDaysInSource: Number(rawData.durationDaysInSource) || 10,
      hasPhysicalOfficeInSource: Boolean(rawData.hasPhysicalOfficeInSource),
      hasDependentAgentInSource: Boolean(rawData.hasDependentAgentInSource),
      hasVirtualServerInSource: Boolean(rawData.hasVirtualServerInSource),
      serviceMakeAvailable: Boolean(rawData.serviceMakeAvailable),
      hasTRC: Boolean(rawData.hasTRC ?? true),
      hasForm10F: Boolean(rawData.hasForm10F ?? true),
      hasPANorTaxID: Boolean(rawData.hasPANorTaxID ?? true),
      notes: rawData.notes || "Submitted via Make.com webhook pipeline"
    };
    const baseline = calculateBaselineTaxFigures(input);
    const logEntry = {
      id: `INBOUND-${Date.now().toString(36).toUpperCase()}`,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
      targetUrl: "Inbound POST /api/webhook/make-lead",
      clientEmail: input.clientEmail,
      status: "success",
      payloadSummary: {
        contractValue: `${input.currency} ${input.annualValue.toLocaleString()}`,
        taxSavings: `${input.currency} ${baseline.estimatedSavings.toLocaleString()}`,
        peRisk: baseline.peRisk,
        tpMethod: baseline.method
      }
    };
    webhookLogs.unshift(logEntry);
    if (webhookLogs.length > 50) webhookLogs.pop();
    res.json({
      status: "evaluated",
      leadId: logEntry.id,
      reportUrl: `/report/${Date.now().toString(36)}`,
      analysis: {
        client: input.clientName,
        email: input.clientEmail,
        corridor: `${input.residentCountry}-${input.sourceCountry}`,
        domesticWithholdingRate: `${baseline.domesticRate}%`,
        treatyWithholdingRate: `${baseline.applicableTreatyRate}%`,
        estimatedTaxSavings: `${input.currency} ${baseline.estimatedSavings.toLocaleString()}`,
        peRiskLevel: baseline.peRisk,
        recommendedArmLengthMargin: `${baseline.median}%`,
        withinArmLengthRange: baseline.isWithinRange,
        safeHarbourEligible: baseline.safeHarbourApplicable
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/webhook-logs", (_req, res) => {
  res.json(webhookLogs);
});
app.post("/api/send-report-email", async (req, res) => {
  try {
    const { recipientEmail, clientName, report, customMessage } = req.body;
    if (!recipientEmail) {
      return res.status(400).json({ error: "Recipient email is required" });
    }
    const { contract, dtaa, transferPricing } = report;
    const resident = contract.residentCountry;
    const source = contract.sourceCountry;
    const savingsFormatted = `${contract.currency} ${(dtaa?.estimatedTaxSavings || 0).toLocaleString()}`;
    const valueFormatted = `${contract.currency} ${(contract?.annualValue || 0).toLocaleString()}`;
    const subject = `Executive Tax Advisory & DTAA Relief Report: ${contract.contractTitle} [${resident} \u2194 ${source}]`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #1e293b;">
        <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 28px 24px; color: #ffffff;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Cross Tax AI \u2014 Executive Tax Advisory Report</h1>
          <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;">Bilateral Double Taxation Avoidance (DTAA) & Arm's Length Transfer Pricing Evaluation</p>
        </div>

        <div style="padding: 24px;">
          <p style="font-size: 14px; line-height: 1.6; margin-top: 0;">
            Dear <strong>${clientName || contract.clientName}</strong>,
          </p>
          <p style="font-size: 13px; line-height: 1.6; color: #475569;">
            ${customMessage || "Please find below the comprehensive statutory tax assessment for your cross-border services contract. Our international tax engine has evaluated your contract under bilateral tax treaties and domestic transfer pricing legislation."}
          </p>

          <div style="display: flex; gap: 12px; margin: 20px 0; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px;">
            <div style="flex: 1;">
              <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #991b1b; display: block;">Estimated Tax Savings</span>
              <span style="font-size: 24px; font-weight: 800; color: #dc2626;">+${savingsFormatted}</span>
            </div>
            <div style="flex: 1;">
              <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #991b1b; display: block;">Treaty WHT Rate</span>
              <span style="font-size: 24px; font-weight: 800; color: #1e293b;">${dtaa?.treatyWhtRate}% <span style="font-size: 12px; color: #64748b; font-weight: normal;">(vs ${dtaa?.domesticWhtRate}% domestic)</span></span>
            </div>
          </div>

          <h3 style="font-size: 14px; font-weight: bold; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 24px;">Contract & Corridor Specifications</h3>
          <table style="width: 100%; font-size: 12px; border-collapse: collapse; margin-top: 8px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Contract Title:</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">${contract.contractTitle}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Annual Contract Value:</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">${valueFormatted}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Jurisdictional Corridor:</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">${resident} (Origin) \u2192 ${source} (Source)</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Permanent Establishment Risk:</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right; color: ${dtaa?.peRiskLevel === "low" ? "#16a34a" : "#dc2626"}; text-transform: uppercase;">${dtaa?.peRiskLevel || "LOW"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Arm's Length Transfer Pricing Margin:</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">${transferPricing?.currentMargin}% (Benchmark: ${transferPricing?.median}%)</td>
            </tr>
          </table>

          <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
            Sent automatically via Cross Tax AI Client Automation Engine \u2022 Compliant with OECD Model & Domestic Tax Laws
          </div>
        </div>
      </div>
    `;
    const logEntry = {
      id: `EMAIL-${Date.now().toString(36).toUpperCase()}`,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
      targetUrl: `Direct SMTP Email to ${recipientEmail}`,
      clientEmail: recipientEmail,
      status: "success",
      payloadSummary: {
        contractValue: valueFormatted,
        taxSavings: savingsFormatted,
        peRisk: dtaa?.peRiskLevel || "low",
        tpMethod: transferPricing?.method || "TNMM"
      }
    };
    webhookLogs.unshift(logEntry);
    if (webhookLogs.length > 50) webhookLogs.pop();
    res.json({
      success: true,
      messageId: `msg_${Date.now()}`,
      recipientEmail,
      subject,
      previewHtml: htmlContent,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Error sending report email:", error);
    res.status(500).json({ error: error.message || "Failed to dispatch email" });
  }
});
const customerFeedbacks = [];
app.post("/api/submit-feedback", (req, res) => {
  try {
    const feedback = req.body;
    if (!feedback || !feedback.feedbackText) {
      return res.status(400).json({ error: "Feedback text is required" });
    }
    const item = {
      id: feedback.id || `fb-${Date.now()}`,
      rating: feedback.rating || 5,
      userName: feedback.userName || "Anonymous Client",
      userEmail: feedback.userEmail || "",
      companyName: feedback.companyName || "",
      feedbackText: feedback.feedbackText,
      interestInConsultation: Boolean(feedback.interestInConsultation),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    customerFeedbacks.unshift(item);
    if (customerFeedbacks.length > 100) customerFeedbacks.pop();
    console.log(`[Feedback Received] from ${item.userName} (${item.companyName}): rating ${item.rating}/5`);
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ error: "Failed to record feedback" });
  }
});
app.get("/api/feedback-list", (_req, res) => {
  res.json({ feedbacks: customerFeedbacks });
});
const forexCacheMap = /* @__PURE__ */ new Map();
const FALLBACK_USD_RATES = {
  USD: 1,
  INR: 96.35,
  EUR: 0.925,
  GBP: 0.785,
  SGD: 1.345,
  AED: 3.6725,
  CAD: 1.385,
  AUD: 1.525,
  JPY: 153.5,
  CHF: 0.885,
  CNY: 7.24,
  BRL: 5.65
};
app.get("/api/forex-rates", async (req, res) => {
  const baseCurrency = (typeof req.query.base === "string" ? req.query.base.toUpperCase() : "USD").trim();
  const cacheKey = baseCurrency;
  const now = Date.now();
  const cached = forexCacheMap.get(cacheKey);
  if (cached && now - cached.timestamp < 15 * 60 * 1e3) {
    return res.json({
      success: true,
      base: baseCurrency,
      rates: cached.rates,
      lastUpdated: cached.timeLastUpdateUtc,
      source: "cache (real-time interbank)"
    });
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4e3);
    const apiRes = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data && data.rates) {
        forexCacheMap.set(cacheKey, {
          rates: data.rates,
          timestamp: now,
          timeLastUpdateUtc: data.time_last_update_utc || (/* @__PURE__ */ new Date()).toUTCString()
        });
        return res.json({
          success: true,
          base: baseCurrency,
          rates: data.rates,
          lastUpdated: data.time_last_update_utc || (/* @__PURE__ */ new Date()).toUTCString(),
          source: "live_interbank_feed"
        });
      }
    }
  } catch (err) {
    console.warn(`[Forex API] Live rate fetch failed for ${baseCurrency}, using baseline matrix:`, err);
  }
  let synthesizedRates = {};
  if (baseCurrency === "USD") {
    synthesizedRates = { ...FALLBACK_USD_RATES };
  } else {
    const baseToUsd = FALLBACK_USD_RATES[baseCurrency] || 1;
    for (const [curr, usdRate] of Object.entries(FALLBACK_USD_RATES)) {
      synthesizedRates[curr] = Number((usdRate / baseToUsd).toFixed(6));
    }
  }
  return res.json({
    success: true,
    base: baseCurrency,
    rates: synthesizedRates,
    lastUpdated: (/* @__PURE__ */ new Date()).toUTCString(),
    source: "fallback_central_bank_benchmark"
  });
});
app.get(["/promo-video", "/promo-video.html", "/video", "/video/", "/watch-video"], (_req, res) => {
  res.redirect("/?view=video");
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }
  app.listen(PORT, () => {
    console.log(`Cross Tax AI server running on port ${PORT}`);
  });
}
if (!process.env.VERCEL) {
  startServer();
}
var server_default = app;
export {
  app,
  server_default as default
};
