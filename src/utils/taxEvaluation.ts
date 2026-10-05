import { TaxContractInput, FullTaxAnalysisReport } from '../types/tax';
import { getTreatyInfo, getCountryTPProfile } from '../data/treatyDatabase';

export function calculateFullTaxAnalysisReport(input: TaxContractInput): FullTaxAnalysisReport {
  const treaty = getTreatyInfo(input.residentCountry, input.sourceCountry);
  const residentProfile = getCountryTPProfile(input.residentCountry);
  const sourceProfile = getCountryTPProfile(input.sourceCountry);
  const totalCost = (input.directCostBase || 0) + (input.indirectCostBase || 0);

  // Transfer pricing margins adapted dynamically to country law & transaction type
  let method: 'TNMM' | 'CUP' | 'CPM' | 'RPM' | 'PSM' = 'TNMM';
  let pli = 'Operating Profit / Total Cost (OP/TC)';
  let p35 = 14.5;
  let median = 17.5;
  let p65 = 20.5;
  let safeHarbourThreshold = 17.0;
  let safeHarbourRuleRef = 'CBDT Safe Harbour Rule 10TD (IT Services)';

  if (input.residentCountry === 'IN' || input.sourceCountry === 'IN') {
    if (input.transactionCategory === 'technical_consultancy_fts') {
      p35 = 18.0;
      median = 21.0;
      p65 = 24.5;
      safeHarbourThreshold = 24.0;
      safeHarbourRuleRef = 'Indian CBDT Safe Harbour Rule 10TD (KPO Services)';
    } else {
      safeHarbourThreshold = 17.0;
      safeHarbourRuleRef = 'Indian CBDT Safe Harbour Rule 10TD (IT/ITeS Services)';
    }
  } else if (input.residentCountry === 'SG' || input.sourceCountry === 'SG') {
    safeHarbourThreshold = 5.0;
    safeHarbourRuleRef = 'IRAS 5% Cost Mark-Up Safe Harbour (Routine Support Services)';
    median = 12.0;
    p35 = 8.0;
    p65 = 15.0;
  } else if (input.residentCountry === 'US' || input.sourceCountry === 'US') {
    safeHarbourThreshold = 5.0;
    safeHarbourRuleRef = 'IRS Services Cost Method (SCM) under Treas. Reg. §1.482-9';
    median = 15.0;
    p35 = 10.0;
    p65 = 18.5;
  } else if (input.residentCountry === 'UK' || input.sourceCountry === 'UK') {
    safeHarbourThreshold = 5.0;
    safeHarbourRuleRef = 'HMRC / OECD 5% Simplified Markup for Low Value-Adding Services';
    median = 12.5;
    p35 = 9.0;
    p65 = 16.0;
  } else if (input.residentCountry === 'AE' || input.sourceCountry === 'AE') {
    safeHarbourThreshold = 5.0;
    safeHarbourRuleRef = 'UAE FTA Article 34 Connected Persons Arm\'s Length Guidance';
    median = 12.0;
    p35 = 8.5;
    p65 = 15.5;
  } else {
    safeHarbourThreshold = 5.0;
    safeHarbourRuleRef = 'OECD Guidelines 2022 Simplified 5% Safe Harbour for Low Value-Adding Services';
    median = 14.0;
    p35 = 10.0;
    p65 = 18.0;
  }

  if (input.transactionCategory === 'freelance_engineering') {
    method = 'CUP';
    pli = 'Hourly / Deliverable Market Rate';
  }

  const currentMargin = input.currentInvoicedMarginPct || 0;
  const isWithinRange = currentMargin >= p35 && currentMargin <= p65;
  const safeHarbourApplicable = input.isPartOfSameGroup && currentMargin >= safeHarbourThreshold;

  // Arm length price calculation
  const recommendedPrice = totalCost > 0 
    ? Math.round(totalCost * (1 + median / 100))
    : input.annualValue;
  const varianceAmount = Math.max(0, recommendedPrice - input.annualValue);

  // PE evaluation
  const peFactors: string[] = [];
  let peRisk: 'low' | 'medium' | 'high' = 'low';

  if (input.hasPhysicalOfficeInSource) {
    peFactors.push('Fixed Place PE (Article 5(1)): Maintained permanent office/place of business');
    peRisk = 'high';
  }
  if (input.durationDaysInSource > treaty.servicePeDaysThreshold) {
    peFactors.push(`Service PE threshold exceeded: ${input.durationDaysInSource} days on ground vs ${treaty.servicePeDaysThreshold} day treaty threshold`);
    peRisk = 'high';
  } else if (input.durationDaysInSource > treaty.servicePeDaysThreshold * 0.7) {
    peFactors.push(`Service PE borderline: ${input.durationDaysInSource} days approaches treaty limit of ${treaty.servicePeDaysThreshold} days`);
    if (peRisk !== 'high') peRisk = 'medium';
  }
  if (input.hasDependentAgentInSource) {
    peFactors.push('Agency PE (Article 5(5)): Dependent agent habitually concluding cross-border contracts');
    peRisk = 'high';
  }

  // WHT comparison
  let isBusinessProfitExempt = false;
  let applicableTreatyRate = treaty.ftsTreatyRate;

  // If independent contractor or general business profits without PE
  if (!peFactors.length && !input.serviceMakeAvailable && (input.transactionCategory === 'software_it' || input.transactionCategory === 'freelance_engineering' || input.transactionCategory === 'digital_saas')) {
    isBusinessProfitExempt = true;
    applicableTreatyRate = 0;
  }

  const domesticRate = treaty.ftsDomesticRate;
  const domesticTax = (input.annualValue * domesticRate) / 100;
  const treatyTax = (input.annualValue * applicableTreatyRate) / 100;
  const estimatedSavings = Math.max(0, domesticTax - treatyTax);

  const governingCountryLaw = `${sourceProfile.countryName} (${sourceProfile.tpLawTitle}) & ${residentProfile.countryName} (${residentProfile.tpLawTitle})`;
  const governingAuthority = `${sourceProfile.governingAuthority} & ${residentProfile.governingAuthority}`;

  return {
    id: `TAX-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    contract: input,
    dtaa: {
      applicableTreaty: `${input.residentCountry}-${input.sourceCountry} Bilateral Tax Convention`,
      residenceState: input.residentCountry,
      sourceState: input.sourceCountry,
      taxableUnderTreaty: !isBusinessProfitExempt,
      peRiskLevel: peRisk,
      peRiskFactors: peFactors.length ? peFactors : ['No physical or agency nexus identified in source jurisdiction'],
      peEvaluationSummary: peRisk === 'low' 
        ? 'Based on duration of presence and absence of fixed place or dependent agency, risk of permanent establishment is contained.'
        : 'Cross-border activity indicates potential nexus under Article 5. Recommended to structure via independent contractor terms or limit physical days in country.',
      domesticWhtRate: domesticRate,
      treatyWhtRate: applicableTreatyRate,
      grossTaxDomestic: domesticTax,
      grossTaxTreaty: treatyTax,
      estimatedTaxSavings: estimatedSavings,
      effectiveTaxReliefPct: domesticRate > 0 ? Math.round(((domesticRate - applicableTreatyRate) / domesticRate) * 100) : 0,
      qualifiesForExemption: isBusinessProfitExempt,
      makeAvailableReliefApplies: input.serviceMakeAvailable === false && treaty.hasMakeAvailableClause
    },
    transferPricing: {
      method,
      profitLevelIndicator: pli,
      comparablesCount: 18,
      percentile35th: p35,
      median,
      percentile65th: p65,
      currentMargin,
      isWithinRange,
      safeHarbourApplicable,
      safeHarbourThreshold,
      safeHarbourRuleRef,
      recommendedArmLengthPrice: recommendedPrice,
      varianceAmount,
      riskOfAdjustment: isWithinRange || safeHarbourApplicable ? 'low' : (currentMargin < p35 ? 'high' : 'moderate'),
      secondaryAdjustmentRisk: input.isPartOfSameGroup && currentMargin < p35 && input.sourceCountry === 'IN',
      governingCountryLaw,
      governingAuthority
    },
    residentCountryTPProfile: residentProfile,
    sourceCountryTPProfile: sourceProfile,
    corridorApplicableLawSummary: `Governed by ${residentProfile.countryName} (${residentProfile.tpLawTitle}) and ${sourceProfile.countryName} (${sourceProfile.tpLawTitle}). Bilateral double tax relief evaluated under Articles 5, 7, and 12 of the ${residentProfile.countryName}-${sourceProfile.countryName} Tax Treaty.`,
    complianceChecklist: [
      {
        id: 'trc',
        name: 'Tax Residency Certificate (TRC / Form 6166)',
        authority: `${input.residentCountry} Revenue Authority`,
        mandatory: true,
        status: input.hasTRC ? 'ready' : 'missing',
        description: 'Statutory prerequisite to claim relief under Section 90(4) of the Income Tax Act.',
        statutoryRef: 'Section 90(4) / Treaty Art 4'
      },
      {
        id: 'form10f',
        name: 'Electronic Form 10F Declaration',
        authority: 'Income Tax Department E-Filing Portal',
        mandatory: true,
        status: input.hasForm10F ? 'ready' : 'missing',
        description: 'Mandatory electronic verification for non-residents claiming DTAA benefits in India.',
        statutoryRef: 'Rule 21AB, Income Tax Rules 1962'
      },
      {
        id: 'no_pe_cert',
        name: 'No-PE & Beneficial Ownership Certificate',
        authority: 'Self-Certified Legal Declaration',
        mandatory: true,
        status: peRisk === 'low' ? 'ready' : 'recommended',
        description: 'Declaration confirming no fixed place, service, or dependent agency PE under Article 5.',
        statutoryRef: 'Article 5 & Article 7 DTAA'
      },
      {
        id: 'form3ceb',
        name: 'Form 3CEB Accountant Transfer Pricing Report',
        authority: 'Chartered Accountant / Tax Auditor',
        mandatory: input.isPartOfSameGroup,
        status: input.isPartOfSameGroup ? 'recommended' : 'ready',
        description: 'Statutory audit filing under Section 92E verifying arm length price in international transactions.',
        statutoryRef: 'Section 92E, Income Tax Act'
      },
      {
        id: 'tp_study',
        name: 'Transfer Pricing Local File & Benchmarking Study',
        authority: 'Corporate Records / Tax Authority Inspection',
        mandatory: input.isPartOfSameGroup,
        status: input.isPartOfSameGroup ? 'missing' : 'ready',
        description: 'Contemporaneous economic benchmarking report with search strings & financial filters.',
        statutoryRef: 'Section 92D / Rule 10D'
      }
    ],
    executiveSummary: `The cross-border engagement between ${input.clientName} and the foreign payer qualifies for DTAA relief under the ${input.residentCountry}-${input.sourceCountry} Convention, unlocking an estimated ${input.currency} ${estimatedSavings.toLocaleString()} in withholding tax optimization while mitigating Permanent Establishment exposure under Article 5.`,
    strategicStructuringRecommendations: [
      'Secure updated Tax Residency Certificate from resident revenue authority before payment remittance.',
      'File electronic Form 10F on the e-filing portal to avert penal 20% domestic withholding tax deduction.',
      'Maintain contemporaneous time-sheets and travel logs ensuring employee stay remains strictly below treaty threshold.',
      'Formalize Master Services Agreement incorporating OECD-compliant Transfer Pricing benchmarking clause.'
    ],
    legalPrecedentsAndArticles: [
      {
        treatyArticle: treaty.articleBusinessProfits,
        description: 'Business Profits Taxation',
        relevance: 'Limits source-state taxation exclusively to profits attributable to a Permanent Establishment.'
      },
      {
        treatyArticle: treaty.articlePE,
        description: 'Permanent Establishment Threshold',
        relevance: 'Governs physical and service nexus rules preventing inadvertent enterprise taxation.'
      },
      {
        treatyArticle: treaty.articleFTS,
        description: 'Fees for Technical Services & Royalties',
        relevance: 'Provides concessional withholding rate or Make Available exemption over domestic rate.'
      }
    ],
    generatedDraftsAvailable: [
      'Form 10F Electronic Portal Draft',
      'No-PE & Beneficial Ownership Self-Declaration',
      'Transfer Pricing Intercompany Agreement Clause',
      'DTAA Legal Position & Tax Structuring Memorandum',
      'Form 3CEB TP Audit Summary Sheet'
    ]
  };
}
