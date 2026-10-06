export type EntityType = 'sme' | 'freelancer' | 'startup' | 'holding_co' | 'enterprise';

export type TransactionCategory =
  | 'software_it'
  | 'technical_consultancy_fts'
  | 'ip_royalty'
  | 'freelance_engineering'
  | 'intercompany_loan'
  | 'management_services'
  | 'digital_saas'
  | 'marketing_support';

export interface TaxContractInput {
  clientName: string;
  clientEmail: string;
  entityType: EntityType;
  residentCountry: string; // Origin / Service Provider jurisdiction
  sourceCountry: string;   // Customer / Service Recipient jurisdiction
  transactionCategory: TransactionCategory;
  contractTitle: string;
  annualValue: number;
  currency: string;
  
  // Associated Enterprise / Transfer Pricing parameters
  isPartOfSameGroup: boolean; // Section 92A / Associated Enterprise (AE) / IRC 482 Control
  relationshipNature?: string; // Parent-Sub, Brother-Sister, Common Shareholding
  directCostBase: number;
  indirectCostBase: number;
  currentInvoicedMarginPct: number;
  
  // Physical / Nexus parameters for PE check
  durationDaysInSource: number; // Days spent in source state
  hasPhysicalOfficeInSource: boolean;
  hasDependentAgentInSource: boolean;
  hasVirtualServerInSource: boolean;
  serviceMakeAvailable: boolean; // Does it transfer technical know-how? (Make Available clause)
  
  // Documentation in possession
  hasTRC: boolean; // Tax Residency Certificate
  hasForm10F: boolean;
  hasPANorTaxID: boolean;
  taxIdNumber?: string; // Tax ID (PAN, EIN, UEN, TRN, etc.)
  fiscalYear?: string;  // Fiscal / Accounting Year (e.g. FY 2025-26, CY 2026)
  notes?: string;
}

export interface TreatyRateInfo {
  royaltyTreatyRate: number; // e.g., 10% or 15%
  royaltyDomesticRate: number; // e.g., 20%
  ftsTreatyRate: number; // Fees for Technical Services
  ftsDomesticRate: number;
  servicePeDaysThreshold: number; // e.g., 90 days or 183 days
  hasMakeAvailableClause: boolean;
  articlePE: string; // e.g. "Article 5"
  articleBusinessProfits: string; // "Article 7"
  articleFTS: string; // "Article 12"
  whtInterest: number;
  whtDividends: number;
  keyConditions: string[];
}

export interface CountryTPProfile {
  countryCode: string;
  countryName: string;
  flag: string;
  currency: string;
  citRate: number; // Standard Corporate Income Tax %
  domesticWhtRate: number; // Domestic WHT on foreign services
  tpLawTitle: string; // e.g. "US Internal Revenue Code §482"
  governingAuthority: string; // e.g. "Internal Revenue Service (IRS)"
  safeHarbourSummary: string; // Country specific safe harbour rule
  safeHarbourThreshold?: number; // Markup threshold %
  mandatoryDocumentation: string[]; // e.g. ["Local File", "Master File", "Form 5472"]
  statutoryPenaltyNotice: string; // Penalty provision
}

export interface ArmLengthBenchmark {
  method: 'TNMM' | 'CUP' | 'CPM' | 'RPM' | 'PSM';
  profitLevelIndicator: string; // e.g. "Operating Profit / Total Cost (OP/TC)"
  comparablesCount: number;
  percentile35th: number; // e.g. 14.5%
  median: number;         // e.g. 17.2%
  percentile65th: number; // e.g. 19.8%
  currentMargin: number;
  isWithinRange: boolean;
  safeHarbourApplicable: boolean;
  safeHarbourThreshold?: number; // e.g. 17% for IT / 24% for KPO / 5% Singapore routine
  safeHarbourRuleRef?: string;
  recommendedArmLengthPrice: number;
  varianceAmount: number;
  riskOfAdjustment: 'low' | 'moderate' | 'high';
  secondaryAdjustmentRisk: boolean;
  governingCountryLaw: string; // Law of the evaluating country
  governingAuthority: string;
}

export interface DTAAReliefEvaluation {
  applicableTreaty: string;
  residenceState: string;
  sourceState: string;
  taxableUnderTreaty: boolean;
  peRiskLevel: 'low' | 'medium' | 'high';
  peRiskFactors: string[];
  peEvaluationSummary: string;
  domesticWhtRate: number;
  treatyWhtRate: number;
  grossTaxDomestic: number;
  grossTaxTreaty: number;
  estimatedTaxSavings: number;
  effectiveTaxReliefPct: number;
  qualifiesForExemption: boolean; // If no PE and not FTS/Royalty, Art 7 business profit is 0% taxed at source!
  makeAvailableReliefApplies: boolean;
}

export interface ComplianceRequirement {
  id: string;
  name: string;
  authority: string;
  mandatory: boolean;
  status: 'ready' | 'missing' | 'recommended';
  description: string;
  statutoryRef: string;
}

export interface FullTaxAnalysisReport {
  id: string;
  createdAt: string;
  contract: TaxContractInput;
  dtaa: DTAAReliefEvaluation;
  transferPricing: ArmLengthBenchmark;
  residentCountryTPProfile?: CountryTPProfile;
  sourceCountryTPProfile?: CountryTPProfile;
  corridorApplicableLawSummary?: string;
  complianceChecklist: ComplianceRequirement[];
  executiveSummary: string;
  strategicStructuringRecommendations: string[];
  legalPrecedentsAndArticles: {
    treatyArticle: string;
    description: string;
    relevance: string;
  }[];
  generatedDraftsAvailable: string[];
}

export interface WebhookDispatchLog {
  id: string;
  timestamp: string;
  targetUrl: string;
  status: 'success' | 'failed' | 'simulated';
  clientEmail: string;
  payloadSummary: {
    contractValue: string;
    taxSavings: string;
    peRisk: string;
    tpMethod: string;
  };
}
