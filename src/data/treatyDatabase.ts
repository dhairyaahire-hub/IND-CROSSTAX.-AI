import { TreatyRateInfo, CountryTPProfile } from '../types/tax';

export interface CountryTreatyPair {
  id: string;
  sourceCountry: string; // Paying country
  residentCountry: string; // Beneficiary country
  treatyName: string;
  treatyRateInfo: TreatyRateInfo;
}

// Global Transfer Pricing Legal Profiles for Countries
export const GLOBAL_COUNTRY_TP_PROFILES: Record<string, CountryTPProfile> = {
  'US': {
    countryCode: 'US',
    countryName: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    citRate: 21,
    domesticWhtRate: 30, // 30% default FDAP withholding
    tpLawTitle: 'IRC §482 & Treas. Reg. §1.482 (Arm\'s Length Allocation of Income)',
    governingAuthority: 'Internal Revenue Service (IRS)',
    safeHarbourSummary: 'Services Cost Method (SCM) under Treas. Reg. §1.482-9 allows 0% markup for covered routine low-margin support services.',
    safeHarbourThreshold: 5.0,
    mandatoryDocumentation: [
      'Form W-8BEN-E (Treaty Withholding Exemption)',
      'IRC §482 Contemporaneous Transfer Pricing Study',
      'Form 5472 (25% Foreign-Owned US Corporation)',
      'BEAT (Base Erosion & Anti-Abuse Tax) Assessment'
    ],
    statutoryPenaltyNotice: '20% to 40% gross valuation misstatement penalty under IRC §6662(e) & (h).'
  },
  'IN': {
    countryCode: 'IN',
    countryName: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    citRate: 25,
    domesticWhtRate: 20, // 20% on Royalties/FTS under Sec 115A (plus surcharge/cess)
    tpLawTitle: 'Income-tax Act, 2025 (New Overhaul) & Chapter X (Sections 92 to 92F)',
    governingAuthority: 'Central Board of Direct Taxes (CBDT) / Ministry of Finance',
    safeHarbourSummary: 'Income-tax Act 2025 Modernized Framework & Rule 10TD: 17% for routine IT/software services (< INR 200 Cr), 18% (INR 200-500 Cr), and 24% for KPO services with simplified GCC transfer pricing benchmarks.',
    safeHarbourThreshold: 17.0,
    mandatoryDocumentation: [
      'Form 10F Electronic Self-Declaration (Rule 21AB / 2025 Digital Portal)',
      'Tax Residency Certificate (TRC) under Section 90(4)',
      'Form 3CEB Accountant Audit Report (Section 92E / 2025 Code)',
      'Local File (Rule 10D) & Master File (Rule 10DA)'
    ],
    statutoryPenaltyNotice: 'Up to 200% penalty for under-reporting under Section 270A; 2% value penalty under Section 271AA.'
  },
  'UK': {
    countryCode: 'UK',
    countryName: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    citRate: 25,
    domesticWhtRate: 20, // 20% domestic rate on royalties
    tpLawTitle: 'Taxation (International and Other Provisions) Act 2010 (TIOPA) Part 4',
    governingAuthority: 'HM Revenue & Customs (HMRC)',
    safeHarbourSummary: 'HMRC follows OECD 5% simplified cost-plus markup for low value-adding intra-group services. Small & Medium Enterprises (SMEs) enjoy statutory exemption unless transactions touch uncooperative jurisdictions.',
    safeHarbourThreshold: 5.0,
    mandatoryDocumentation: [
      'HMRC Certificate of Residence',
      'Double Taxation Treaty Passport (DTTP)',
      'Local File & Master File (mandatory for large MNEs from 2023)',
      'Diverted Profits Tax (DPT) Review'
    ],
    statutoryPenaltyNotice: 'Up to 100% of lost tax for deliberate inaccuracy under Schedule 24 FA 2007; £3,000 document failure penalty.'
  },
  'SG': {
    countryCode: 'SG',
    countryName: 'Singapore',
    flag: '🇸🇬',
    currency: 'SGD',
    citRate: 17,
    domesticWhtRate: 10, // 10% on royalties; 17% prevailing on non-resident services
    tpLawTitle: 'Singapore Income Tax Act 1947 Section 34D & IRAS Transfer Pricing Guidelines (6th Ed.)',
    governingAuthority: 'Inland Revenue Authority of Singapore (IRAS)',
    safeHarbourSummary: 'IRAS 5% Cost Mark-up Safe Harbour for routine intra-group support services (administrative, HR, accounting, IT support).',
    safeHarbourThreshold: 5.0,
    mandatoryDocumentation: [
      'Certificate of Residence (COR) from IRAS',
      'Section 34D Contemp. TP Documentation (if turnover > SGD 10m)',
      'Form IR37 Electronic Withholding Tax Filing',
      'Country-by-Country Report (CbCR) if group revenue > SGD 1,125m'
    ],
    statutoryPenaltyNotice: '5% surcharge on transfer pricing adjustments under Section 34E; fines up to SGD 10,000 under Section 34F.'
  },
  'AE': {
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    flag: '🇦🇪',
    currency: 'AED',
    citRate: 9, // 9% above AED 375,000; 0% for Qualifying Free Zone Persons
    domesticWhtRate: 0, // 0% domestic withholding currently
    tpLawTitle: 'Federal Decree-Law No. 47 of 2022 on Taxation of Corporations (Articles 34 & 55) & Ministerial Decision 97/2023',
    governingAuthority: 'Federal Tax Authority (FTA)',
    safeHarbourSummary: 'Small Business Relief applies if revenue < AED 3m. For intercompany service transactions, arm\'s length test applies to all Related Parties and Connected Persons.',
    safeHarbourThreshold: 5.0,
    mandatoryDocumentation: [
      'FTA Transfer Pricing Disclosure Form alongside Tax Return',
      'Local File (Mandatory if revenue >= AED 200m or group revenue >= AED 3.15b)',
      'Master File (same threshold as Local File)',
      'Tax Residency Certificate via EmaraTax portal'
    ],
    statutoryPenaltyNotice: 'Administrative penalties under Cabinet Decision No. 75 of 2023 (AED 10,000 to AED 50,000 for failing to maintain TP files).'
  },
  'DE': {
    countryCode: 'DE',
    countryName: 'Germany',
    flag: '🇩🇪',
    currency: 'EUR',
    citRate: 30, // Combined KSt + GewSt approx 30%
    domesticWhtRate: 15, // 15.825% with solidarity surcharge
    tpLawTitle: 'Foreign Tax Act §1 (Außensteuergesetz - AStG) & General Fiscal Code §90 (3) AO',
    governingAuthority: 'Federal Central Tax Office (Bundeszentralamt für Steuern - BZSt)',
    safeHarbourSummary: 'Administrative Principles on Transfer Pricing 2021 (Verwaltungsgrundsätze). Strict interquartile range testing and relocation of functions (Funktionsverlagerung) rules.',
    safeHarbourThreshold: 5.0,
    mandatoryDocumentation: [
      '§50d (1) EStG Withholding Exemption Certificate (Freistellungsbescheinigung)',
      'Statutory TP Documentation under §90 Abs. 3 AO',
      'Relocation of Function Valuation Dossier',
      'Ansässigkeitsbescheinigung (Tax Residence Certificate)'
    ],
    statutoryPenaltyNotice: '5% to 10% penalty on income adjustment under §162 (4) AO; minimum penalty of €5,000.'
  },
  'CA': {
    countryCode: 'CA',
    countryName: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    citRate: 26.5, // Combined Federal 15% + Provincial average 11.5%
    domesticWhtRate: 25, // 25% Part XIII withholding
    tpLawTitle: 'Income Tax Act (Canada) Section 247 (Part XVI.1)',
    governingAuthority: 'Canada Revenue Agency (CRA)',
    safeHarbourSummary: 'CRA follows OECD Guidelines for low value-adding intra-group services (5% cost markup). Qualifying non-resident services require Regulation 102/105 waiver to avoid 15% withholding.',
    safeHarbourThreshold: 5.0,
    mandatoryDocumentation: [
      'Form T106 Information Return of Non-Arm\'s Length Transactions',
      'Regulation 105 Withholding Waiver Application',
      'Section 247 (4) Contemporaneous Documentation',
      'Form NR4 Statement of Amounts Paid to Non-Residents'
    ],
    statutoryPenaltyNotice: 'Section 247(3) penalty: 10% of transfer pricing adjustment if exceeding $5m or 10% of gross revenue.'
  },
  'AU': {
    countryCode: 'AU',
    countryName: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD',
    citRate: 30, // 25% for base rate entities, 30% general
    domesticWhtRate: 30, // 30% on unfranked dividends/royalties
    tpLawTitle: 'Income Tax Assessment Act 1997 (ITAA 1997) Division 815',
    governingAuthority: 'Australian Taxation Office (ATO)',
    safeHarbourSummary: 'ATO Practical Compliance Guideline (PCG 2017/2): Low value-adding services safe harbour allows 5% markup without benchmarking if total expenses < AUD 1m.',
    safeHarbourThreshold: 5.0,
    mandatoryDocumentation: [
      'International Dealings Schedule (IDS)',
      'ATO Local File (Short form or Detailed) & Master File',
      'Subdivision 284-E Contemporaneous Documentation',
      'Certificate of Residency from ATO'
    ],
    statutoryPenaltyNotice: 'Administrative penalties up to 50% for scheme shortfall under Section 284-160 of Taxation Administration Act 1953.'
  },
  'NL': {
    countryCode: 'NL',
    countryName: 'Netherlands',
    flag: '🇳🇱',
    currency: 'EUR',
    citRate: 25.8,
    domesticWhtRate: 15,
    tpLawTitle: 'Corporate Income Tax Act 1969 Article 8b & Decree on Transfer Pricing 2022',
    governingAuthority: 'Dutch Tax Administration (Belastingdienst)',
    safeHarbourSummary: 'OECD 5% markup accepted for low value-adding intra-group services. Advanced Pricing Agreements (APAs) available for intercompany remuneration.',
    safeHarbourThreshold: 5.0,
    mandatoryDocumentation: [
      'Local File & Master File (Mandatory if group revenue > €50m)',
      'Belastingdienst Tax Residency Certificate',
      'Substance & Nexus Confirmation under ATAD 3'
    ],
    statutoryPenaltyNotice: 'Fines up to €900,000 or 100% of tax under Section 67f of the State Taxes Act.'
  },
  'IE': {
    countryCode: 'IE',
    countryName: 'Ireland',
    flag: '🇮🇪',
    currency: 'EUR',
    citRate: 12.5, // 12.5% trading income; 15% minimum under OECD Pillar Two
    domesticWhtRate: 20,
    tpLawTitle: 'Taxes Consolidation Act 1997 (TCA 1997) Section 835C (Part 35A)',
    governingAuthority: 'Irish Revenue Commissioners',
    safeHarbourSummary: 'Revenue accepts OECD 5% safe harbour for qualifying low value-adding intra-group services. Domestic transactions between Irish trading entities exempt from TP adjustments.',
    safeHarbourThreshold: 5.0,
    mandatoryDocumentation: [
      'Local File & Master File under Section 835G (if global turnover > €50m)',
      'Form 11 / CT1 Non-Resident Trading Schedules',
      'Certificate of Residence from Irish Revenue'
    ],
    statutoryPenaltyNotice: 'Fixed penalty of €4,000 plus €100/day for failing to provide records within 30 days.'
  },
  'JP': {
    countryCode: 'JP',
    countryName: 'Japan',
    flag: '🇯🇵',
    currency: 'JPY',
    citRate: 29.74, // Effective national & local corporate tax rate
    domesticWhtRate: 20.42, // Includes 2.1% reconstruction surtax
    tpLawTitle: 'Act on Special Measures Concerning Taxation (ASMT) Article 66-4',
    governingAuthority: 'National Tax Agency (NTA)',
    safeHarbourSummary: 'OECD 5% cost markup adopted for routine administrative support services. Stringent intangibles valuation and DCF testing under 2019 TP reforms.',
    safeHarbourThreshold: 5.0,
    mandatoryDocumentation: [
      'Schedule 17-4 (Detailed Statement on Foreign Affiliated Transactions)',
      'Local File & Master File under ASMT Art 66-4-4',
      'NTA Certificate of Tax Residence'
    ],
    statutoryPenaltyNotice: 'Heavy additional tax of 35% to 40% for concealment; statutory interest under General Law of National Taxes.'
  },
  'CH': {
    countryCode: 'CH',
    countryName: 'Switzerland',
    flag: '🇨🇭',
    currency: 'CHF',
    citRate: 14.7, // Combined Federal and Cantonal average
    domesticWhtRate: 35, // 35% Anticipatory Tax (Verrechnungssteuer) on dividends/interest
    tpLawTitle: 'Federal Direct Tax Act (DBG) Art 58 & Cantonal Direct Tax Harmonization Act (StHG) Art 24',
    governingAuthority: 'Federal Tax Administration (ESTV / FTA)',
    safeHarbourSummary: 'ESTV annual circulars provide safe harbour interest rates for intercompany loans and financing entities. OECD 5% accepted for management services.',
    safeHarbourThreshold: 5.0,
    mandatoryDocumentation: [
      'Form 85 / Form 108 Anticipatory Tax Relief Claim',
      'Swiss Cantonal TP Dossier & Intercompany Service Agreement',
      'ESTV Certificate of Tax Residence'
    ],
    statutoryPenaltyNotice: 'Up to 3x evaded tax amount in cases of intent; 1/3 to 1x for negligence.'
  },
  'BR': {
    countryCode: 'BR',
    countryName: 'Brazil',
    flag: '🇧🇷',
    currency: 'BRL',
    citRate: 34, // IRPJ + CSLL combined
    domesticWhtRate: 15, // 25% if beneficiary in tax haven
    tpLawTitle: 'Federal Law No. 14,596 of 2023 (New OECD-Aligned Transfer Pricing Framework)',
    governingAuthority: 'Receita Federal do Brasil (RFB)',
    safeHarbourSummary: 'Replaces historic fixed statutory margins with OECD Arm\'s Length Principle, comparable search, and interquartile range from 2024 tax year.',
    safeHarbourThreshold: 5.0,
    mandatoryDocumentation: [
      'RFB Normative Instruction 2,161/2023 Local File & Master File',
      'Declaration of Operations Abroad (ECF Bloco X)',
      'Certidão de Residência Fiscal (Tax Residency Certificate)'
    ],
    statutoryPenaltyNotice: 'Up to 150% penalty on unpaid taxes for fraud/omission; 75% standard penalty.'
  },
  'ZA': {
    countryCode: 'ZA',
    countryName: 'South Africa',
    flag: '🇿🇦',
    currency: 'ZAR',
    citRate: 27,
    domesticWhtRate: 15,
    tpLawTitle: 'Income Tax Act No. 58 of 1962 Section 31',
    governingAuthority: 'South African Revenue Service (SARS)',
    safeHarbourSummary: 'SARS Practice Note 7 aligns with OECD Guidelines. 5% cost markup accepted for qualifying low value-adding intra-group services.',
    safeHarbourThreshold: 5.0,
    mandatoryDocumentation: [
      'Public Notice 111 TP Master File & Local File (if cross-border > ZAR 100m)',
      'ITR14 Comprehensive Cross-Border Dealing Schedule',
      'SARS Tax Residence Certificate'
    ],
    statutoryPenaltyNotice: 'Understatement penalty up to 200% under Chapter 16 of the Tax Administration Act 2011.'
  },
  'MX': {
    countryCode: 'MX',
    countryName: 'Mexico',
    flag: '🇲🇽',
    currency: 'MXN',
    citRate: 30,
    domesticWhtRate: 25,
    tpLawTitle: 'Mexican Income Tax Law (LISR) Articles 179, 180, and 181',
    governingAuthority: 'Servicio de Administración Tributaria (SAT)',
    safeHarbourSummary: 'Maquiladora safe harbour (Art 182 LISR) or APA required. Intercompany service fees require proof of material business benefit (business reason / materialidad).',
    safeHarbourThreshold: 6.5,
    mandatoryDocumentation: [
      'SAT Multiple Informative Return (DIM Annex 9)',
      'Local File & Master File under Article 76-A LISR',
      'Constancia de Residencia Fiscal (TRC)'
    ],
    statutoryPenaltyNotice: 'Fines of 55% to 75% of omitted tax; strict rejection of deductibility without materiality proof.'
  },
  'SA': {
    countryCode: 'SA',
    countryName: 'Saudi Arabia',
    flag: '🇸🇦',
    currency: 'SAR',
    citRate: 20, // 20% for foreign investors; 2.5% Zakat for GCC nationals
    domesticWhtRate: 15, // 15% on technical services, 20% management fees
    tpLawTitle: 'ZATCA Transfer Pricing Bylaws (Board Resolution No. 6-1-19 as amended by 8-2-23)',
    governingAuthority: 'Zakat, Tax and Customs Authority (ZATCA)',
    safeHarbourSummary: 'Transfer Pricing Bylaws extended to Zakat payers from 2023. Arm\'s length test applies to related persons with disclosure form required in annual return.',
    safeHarbourThreshold: 5.0,
    mandatoryDocumentation: [
      'ZATCA Controlled Transaction Disclosure Form (with tax return)',
      'Local File & Master File (Mandatory if aggregate value >= SAR 6m)',
      'Chartered Accountant Certificate of Arm\'s Length Compliance'
    ],
    statutoryPenaltyNotice: 'Up to 25% tax penalty for failure to submit documentation or misstatement.'
  }
};

// Bilateral Treaties Database for Major World Corridors
export const TREATY_DATABASE: Record<string, TreatyRateInfo> = {
  // India <-> US
  'US-IN': {
    royaltyTreatyRate: 15,
    royaltyDomesticRate: 20,
    ftsTreatyRate: 15,
    ftsDomesticRate: 20,
    servicePeDaysThreshold: 90,
    hasMakeAvailableClause: true,
    articlePE: 'Article 5 (Permanent Establishment - 90 days for related, 90 days aggregated)',
    articleBusinessProfits: 'Article 7 (Business Profits)',
    articleFTS: 'Article 12 (Royalties and Fees for Included Services)',
    whtInterest: 15,
    whtDividends: 25,
    keyConditions: [
      'TRC (Form 6166 from US IRS) is mandatory for treaty benefit in India under Sec 90(4)',
      'Indian Form 10F electronic portal submission required',
      'Make Available clause applies: technical consultancy exempt unless it enables recipient to apply technology independently',
      'PE threshold: 90 days within any 12-month period for service personnel'
    ]
  },
  'IN-US': {
    royaltyTreatyRate: 15,
    royaltyDomesticRate: 30,
    ftsTreatyRate: 0, // US does not tax general services unless PE exists
    ftsDomesticRate: 30,
    servicePeDaysThreshold: 90,
    hasMakeAvailableClause: true,
    articlePE: 'Article 5',
    articleBusinessProfits: 'Article 7',
    articleFTS: 'Article 12',
    whtInterest: 15,
    whtDividends: 15,
    keyConditions: [
      'US Form W-8BEN-E required by US payor to eliminate 30% withholding under IRC 1441/1442',
      'Services performed entirely outside US not subject to US sourcing (IRC Sec 861/862)',
      'Valid Tax ID (ITIN/EIN) required on Form W-8BEN-E to certify treaty position'
    ]
  },

  // US <-> UK
  'UK-US': {
    royaltyTreatyRate: 0,
    royaltyDomesticRate: 30,
    ftsTreatyRate: 0,
    ftsDomesticRate: 30,
    servicePeDaysThreshold: 183,
    hasMakeAvailableClause: false,
    articlePE: 'Article 5 (PE threshold 183 days)',
    articleBusinessProfits: 'Article 7 (Business Profits - 0% withholding)',
    articleFTS: 'Article 12 (Royalties - 0% rate)',
    whtInterest: 0,
    whtDividends: 0,
    keyConditions: [
      'US Form W-8BEN-E with UK Limitative of Benefits (LOB) Article 23 certification',
      '0% withholding on royalties and business services under treaty',
      'Contemporaneous IRC §482 and TIOPA transfer pricing study recommended'
    ]
  },
  'US-UK': {
    royaltyTreatyRate: 0,
    royaltyDomesticRate: 20,
    ftsTreatyRate: 0,
    ftsDomesticRate: 20,
    servicePeDaysThreshold: 183,
    hasMakeAvailableClause: false,
    articlePE: 'Article 5',
    articleBusinessProfits: 'Article 7',
    articleFTS: 'Article 12',
    whtInterest: 0,
    whtDividends: 0,
    keyConditions: [
      'HMRC Double Taxation Treaty Passport (DTTP) scheme streamlines UK withholding exemption',
      'US IRS Form 6166 Certificate of Residence required'
    ]
  },

  // US <-> Singapore
  'SG-US': {
    royaltyTreatyRate: 10,
    royaltyDomesticRate: 30,
    ftsTreatyRate: 0,
    ftsDomesticRate: 30,
    servicePeDaysThreshold: 90,
    hasMakeAvailableClause: true,
    articlePE: 'Article 5',
    articleBusinessProfits: 'Article 7',
    articleFTS: 'Article 12',
    whtInterest: 10,
    whtDividends: 15,
    keyConditions: [
      'Singapore Certificate of Residence (COR) required by IRAS',
      'Form W-8BEN-E with Singapore UEN and tax status required by US client'
    ]
  },
  'US-SG': {
    royaltyTreatyRate: 10,
    royaltyDomesticRate: 10,
    ftsTreatyRate: 0,
    ftsDomesticRate: 17,
    servicePeDaysThreshold: 90,
    hasMakeAvailableClause: true,
    articlePE: 'Article 5',
    articleBusinessProfits: 'Article 7',
    articleFTS: 'Article 12',
    whtInterest: 10,
    whtDividends: 0,
    keyConditions: [
      'IRAS Form IR37 submitted for withholding tax',
      'Pure business services exempt under Article 7 with no Singapore office'
    ]
  },

  // Singapore <-> UAE
  'AE-SG': {
    royaltyTreatyRate: 0,
    royaltyDomesticRate: 0,
    ftsTreatyRate: 0,
    ftsDomesticRate: 0,
    servicePeDaysThreshold: 183,
    hasMakeAvailableClause: false,
    articlePE: 'Article 5 (183 days within 12 months)',
    articleBusinessProfits: 'Article 7 (Exempt in UAE/Singapore without PE)',
    articleFTS: 'Article 12 (0% withholding)',
    whtInterest: 0,
    whtDividends: 0,
    keyConditions: [
      'Singapore-UAE DTAA provides 0% withholding tax across services and royalties',
      'Substance requirements and commercial justification mandated by UAE FTA Corporate Tax Law',
      'Arm\'s length transfer pricing benchmarking required between Connected Persons'
    ]
  },
  'SG-AE': {
    royaltyTreatyRate: 0,
    royaltyDomesticRate: 10,
    ftsTreatyRate: 0,
    ftsDomesticRate: 17,
    servicePeDaysThreshold: 183,
    hasMakeAvailableClause: false,
    articlePE: 'Article 5',
    articleBusinessProfits: 'Article 7',
    articleFTS: 'Article 12',
    whtInterest: 0,
    whtDividends: 0,
    keyConditions: [
      'UAE Tax Residency Certificate from FTA required to claim 0% withholding in Singapore',
      'IRAS Section 34D transfer pricing documentation maintained'
    ]
  },

  // Germany <-> US
  'DE-US': {
    royaltyTreatyRate: 0,
    royaltyDomesticRate: 30,
    ftsTreatyRate: 0,
    ftsDomesticRate: 30,
    servicePeDaysThreshold: 183,
    hasMakeAvailableClause: false,
    articlePE: 'Article 5',
    articleBusinessProfits: 'Article 7',
    articleFTS: 'Article 12',
    whtInterest: 0,
    whtDividends: 5,
    keyConditions: [
      'Form W-8BEN-E with German Steuernummer and LOB Article 28 certification',
      '0% withholding on royalties and software under treaty'
    ]
  },
  'US-DE': {
    royaltyTreatyRate: 0,
    royaltyDomesticRate: 15.825,
    ftsTreatyRate: 0,
    ftsDomesticRate: 15.825,
    servicePeDaysThreshold: 183,
    hasMakeAvailableClause: false,
    articlePE: 'Article 5',
    articleBusinessProfits: 'Article 7',
    articleFTS: 'Article 12',
    whtInterest: 0,
    whtDividends: 5,
    keyConditions: [
      'German BZSt Exemption Certificate (§50d EStG) mandatory prior to payment to avoid withholding',
      'US IRS Form 6166 required'
    ]
  },

  // Australia <-> US
  'AU-US': {
    royaltyTreatyRate: 5,
    royaltyDomesticRate: 30,
    ftsTreatyRate: 0,
    ftsDomesticRate: 30,
    servicePeDaysThreshold: 90,
    hasMakeAvailableClause: false,
    articlePE: 'Article 5',
    articleBusinessProfits: 'Article 7',
    articleFTS: 'Article 12',
    whtInterest: 10,
    whtDividends: 0,
    keyConditions: [
      'Form W-8BEN-E with Australian ABN/TFN required',
      'Division 815 arm\'s length transfer pricing compliance'
    ]
  },

  // Canada <-> US
  'CA-US': {
    royaltyTreatyRate: 0,
    royaltyDomesticRate: 30,
    ftsTreatyRate: 0,
    ftsDomesticRate: 30,
    servicePeDaysThreshold: 183,
    hasMakeAvailableClause: false,
    articlePE: 'Article V (Permanent Establishment - 183 days)',
    articleBusinessProfits: 'Article VII',
    articleFTS: 'Article XII',
    whtInterest: 0,
    whtDividends: 5,
    keyConditions: [
      'US-Canada Treaty Fifth Protocol provides 0% withholding on royalties and computer software',
      'Regulation 102/105 non-resident withholding waiver rules apply'
    ]
  },

  // UK <-> India
  'UK-IN': {
    royaltyTreatyRate: 15,
    royaltyDomesticRate: 20,
    ftsTreatyRate: 15,
    ftsDomesticRate: 20,
    servicePeDaysThreshold: 90,
    hasMakeAvailableClause: true,
    articlePE: 'Article 5 (PE - Service PE threshold 90 days)',
    articleBusinessProfits: 'Article 7 (Business Profits)',
    articleFTS: 'Article 13 (Royalties and Fees for Technical Services)',
    whtInterest: 15,
    whtDividends: 15,
    keyConditions: [
      'HMRC Certificate of Residence required',
      'Make Available test strictly upheld in landmark rulings (e.g. Guy Carpenter, De Beers)',
      'Form 10F electronic self-declaration needed if TRC does not have all Sec 90(5) details'
    ]
  },
  'IN-UK': {
    royaltyTreatyRate: 15,
    royaltyDomesticRate: 20,
    ftsTreatyRate: 0,
    ftsDomesticRate: 20,
    servicePeDaysThreshold: 90,
    hasMakeAvailableClause: true,
    articlePE: 'Article 5',
    articleBusinessProfits: 'Article 7',
    articleFTS: 'Article 13',
    whtInterest: 15,
    whtDividends: 0,
    keyConditions: [
      'UK does not levy withholding tax on standard technical or business service fees under domestic law unless derived through a UK branch'
    ]
  },

  // Singapore <-> India
  'SG-IN': {
    royaltyTreatyRate: 10,
    royaltyDomesticRate: 20,
    ftsTreatyRate: 10,
    ftsDomesticRate: 20,
    servicePeDaysThreshold: 90,
    hasMakeAvailableClause: true,
    articlePE: 'Article 5 (Service PE 90 days threshold)',
    articleBusinessProfits: 'Article 7 (Business Profits)',
    articleFTS: 'Article 12 (Royalties and Fees for Technical Services)',
    whtInterest: 15,
    whtDividends: 10,
    keyConditions: [
      'IRAS Certificate of Residence required for Section 90(4) DTAA relief',
      'Form 10F electronic self-declaration required on Indian Income Tax portal',
      'Beneficial ownership must be established (substance test in Singapore)'
    ]
  },
  'IN-SG': {
    royaltyTreatyRate: 10,
    royaltyDomesticRate: 10,
    ftsTreatyRate: 0,
    ftsDomesticRate: 17,
    servicePeDaysThreshold: 90,
    hasMakeAvailableClause: true,
    articlePE: 'Article 5',
    articleBusinessProfits: 'Article 7',
    articleFTS: 'Article 12',
    whtInterest: 10,
    whtDividends: 0,
    keyConditions: [
      'Singapore does not tax foreign service fees if services are delivered wholly from India with no Singapore branch',
      'Indian Tax Residency Certificate required by Singapore customer for auditor clearance'
    ]
  },

  // UAE <-> India
  'AE-IN': {
    royaltyTreatyRate: 10,
    royaltyDomesticRate: 20,
    ftsTreatyRate: 10, // Note: UAE-India treaty lacks dedicated FTS article, treated as Article 7 Business Profits
    ftsDomesticRate: 20,
    servicePeDaysThreshold: 90,
    hasMakeAvailableClause: false,
    articlePE: 'Article 5 (Permanent Establishment)',
    articleBusinessProfits: 'Article 7 (Business Profits - Exempt in India without PE)',
    articleFTS: 'Article 12 (Royalties)',
    whtInterest: 10,
    whtDividends: 10,
    keyConditions: [
      'UAE Ministry of Finance / FTA Tax Residency Certificate required',
      'Absence of FTS Article in UAE-India DTAA means managerial/technical services taxed only under Article 7 (0% in India if no PE)',
      'Substance & physical commercial presence in UAE scrutinized by Indian tax authorities'
    ]
  },
  'IN-AE': {
    royaltyTreatyRate: 10,
    royaltyDomesticRate: 0,
    ftsTreatyRate: 0,
    ftsDomesticRate: 0,
    servicePeDaysThreshold: 90,
    hasMakeAvailableClause: false,
    articlePE: 'Article 5',
    articleBusinessProfits: 'Article 7',
    articleFTS: 'Article 12',
    whtInterest: 10,
    whtDividends: 0,
    keyConditions: [
      'UAE does not levy withholding tax on foreign payments under Federal Decree-Law No. 47 of 2022',
      'Transactions must be at arm\'s length if between Related Parties or Connected Persons'
    ]
  },

  // Germany <-> India
  'DE-IN': {
    royaltyTreatyRate: 10,
    royaltyDomesticRate: 20,
    ftsTreatyRate: 10,
    ftsDomesticRate: 20,
    servicePeDaysThreshold: 183,
    hasMakeAvailableClause: false,
    articlePE: 'Article 5 (183 days threshold)',
    articleBusinessProfits: 'Article 7 (Business Profits)',
    articleFTS: 'Article 12 (Royalties and Technical Services)',
    whtInterest: 10,
    whtDividends: 10,
    keyConditions: [
      'German BZSt Tax Residency Certificate required',
      'PE threshold is 183 days (more generous than US/UK 90 days)',
      'FTS taxed at flat 10% rate without make-available carve-out'
    ]
  }
};

// Complete List of Supported Global Jurisdictions
export const GLOBAL_COUNTRIES = [
  // North & South America
  { code: 'US', name: 'United States', flag: '🇺🇸', region: 'Americas', currency: 'USD' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', region: 'Americas', currency: 'CAD' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', region: 'Americas', currency: 'MXN' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', region: 'Americas', currency: 'BRL' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', region: 'Americas', currency: 'CLP' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', region: 'Americas', currency: 'COP' },

  // Europe
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', region: 'Europe', currency: 'GBP' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', region: 'Europe', currency: 'EUR' },
  { code: 'FR', name: 'France', flag: '🇫🇷', region: 'Europe', currency: 'EUR' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', region: 'Europe', currency: 'EUR' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', region: 'Europe', currency: 'EUR' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', region: 'Europe', currency: 'CHF' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', region: 'Europe', currency: 'EUR' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', region: 'Europe', currency: 'EUR' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', region: 'Europe', currency: 'EUR' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', region: 'Europe', currency: 'SEK' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', region: 'Europe', currency: 'PLN' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', region: 'Europe', currency: 'EUR' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', region: 'Europe', currency: 'EUR' },

  // Asia-Pacific & Middle East
  { code: 'IN', name: 'India', flag: '🇮🇳', region: 'Asia-Pacific', currency: 'INR' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', region: 'Asia-Pacific', currency: 'SGD' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', region: 'Asia-Pacific', currency: 'AUD' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', region: 'Asia-Pacific', currency: 'JPY' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', region: 'Asia-Pacific', currency: 'HKD' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', region: 'Middle East', currency: 'AED' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', region: 'Middle East', currency: 'SAR' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', region: 'Asia-Pacific', currency: 'KRW' },
  { code: 'CN', name: 'China', flag: '🇨🇳', region: 'Asia-Pacific', currency: 'CNY' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', region: 'Asia-Pacific', currency: 'IDR' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', region: 'Asia-Pacific', currency: 'MYR' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', region: 'Asia-Pacific', currency: 'NZD' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', region: 'Middle East', currency: 'ILS' },

  // Africa
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', region: 'Africa', currency: 'ZAR' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', region: 'Africa', currency: 'NGN' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', region: 'Africa', currency: 'KES' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺', region: 'Africa', currency: 'MUR' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', region: 'Africa', currency: 'EGP' }
];

export const POPULAR_COUNTRIES = GLOBAL_COUNTRIES;

export function getCountryTPProfile(countryCode: string): CountryTPProfile {
  const code = (countryCode || '').toUpperCase();
  if (GLOBAL_COUNTRY_TP_PROFILES[code]) {
    return GLOBAL_COUNTRY_TP_PROFILES[code];
  }

  // Intelligent fallback for any other country using OECD Model standards
  const match = GLOBAL_COUNTRIES.find((c) => c.code === code);
  return {
    countryCode: code,
    countryName: match ? match.name : code,
    flag: match ? match.flag : '🌐',
    currency: match ? match.currency : 'USD',
    citRate: 20,
    domesticWhtRate: 20,
    tpLawTitle: 'Domestic Transfer Pricing Legislation (OECD Model Compliant)',
    governingAuthority: 'National Revenue Authority',
    safeHarbourSummary: 'OECD 5% cost-plus markup benchmark for qualifying routine low-value intra-group services.',
    safeHarbourThreshold: 5.0,
    mandatoryDocumentation: [
      'OECD Transfer Pricing Local File & Master File',
      'Official Certificate of Tax Residence (TRC)',
      'Intercompany Arm\'s Length Agreement'
    ],
    statutoryPenaltyNotice: 'Standard domestic tax penalties apply for unbenchmarked profit shifting.'
  };
}

// Universal Treaty Rate & PE Rule Resolver for ANY Country Pair
export function getTreatyInfo(residentCountry: string, sourceCountry: string): TreatyRateInfo {
  const r = (residentCountry || 'IN').toUpperCase();
  const s = (sourceCountry || 'US').toUpperCase();
  const key = `${r}-${s}`;
  const reverseKey = `${s}-${r}`;

  if (TREATY_DATABASE[key]) {
    return TREATY_DATABASE[key];
  }
  if (TREATY_DATABASE[reverseKey]) {
    return TREATY_DATABASE[reverseKey];
  }

  // Country-aware OECD Model default
  const sourceProfile = getCountryTPProfile(s);
  const residentProfile = getCountryTPProfile(r);

  return {
    royaltyTreatyRate: 10,
    royaltyDomesticRate: sourceProfile.domesticWhtRate,
    ftsTreatyRate: 10,
    ftsDomesticRate: sourceProfile.domesticWhtRate,
    servicePeDaysThreshold: 183,
    hasMakeAvailableClause: false,
    articlePE: `Article 5 (Permanent Establishment - 183-day OECD Threshold between ${residentProfile.countryName} & ${sourceProfile.countryName})`,
    articleBusinessProfits: `Article 7 (Business Profits - 0% Source Tax without PE)`,
    articleFTS: `Article 12 (Royalties & Technical Fees capped at 10%)`,
    whtInterest: 10,
    whtDividends: 15,
    keyConditions: [
      `Tax Residency Certificate (TRC) issued by ${residentProfile.governingAuthority} required to claim double taxation relief`,
      `Statutory compliance under ${sourceProfile.tpLawTitle} for local source-state deduction`,
      `Service PE threshold: Maximum 183 physical days presence in ${sourceProfile.countryName} within any 12-month period`,
      `Arm\'s length pricing must be defended under ${residentProfile.tpLawTitle} and ${sourceProfile.tpLawTitle}`
    ]
  };
}

export const PRESET_CONTRACTS = [
  {
    name: 'India → US (IT & Cloud Engineering)',
    desc: 'Associated Enterprise setup. Cross-border software services with Chapter X vs US IRC §482.',
    data: {
      clientName: 'CloudWave Technologies Pvt Ltd',
      clientEmail: 'cfo@cloudwave.io',
      entityType: 'sme' as const,
      residentCountry: 'IN',
      sourceCountry: 'US',
      transactionCategory: 'software_it' as const,
      contractTitle: 'Master Cloud Architecture & Software Support Agreement',
      annualValue: 350000,
      currency: 'USD',
      isPartOfSameGroup: true,
      relationshipNature: '100% Wholly Owned Subsidiary of US Inc',
      directCostBase: 220000,
      indirectCostBase: 60000,
      currentInvoicedMarginPct: 15,
      durationDaysInSource: 20,
      hasPhysicalOfficeInSource: false,
      hasDependentAgentInSource: false,
      hasVirtualServerInSource: false,
      serviceMakeAvailable: false,
      hasTRC: true,
      hasForm10F: true,
      hasPANorTaxID: true,
      notes: 'Parent US entity reimburses costs plus 15%. Need transfer pricing arm length validation under IRC §482 and Chapter X.'
    }
  },
  {
    name: 'Singapore SaaS → UAE Distribution Hub',
    desc: 'SaaS Reseller & IP Licensing. UAE Corporate Tax Law No. 47/2022 vs IRAS §34D.',
    data: {
      clientName: 'SaaSFlow Global Pte Ltd',
      clientEmail: 'compliance@saasflow.sg',
      entityType: 'startup' as const,
      residentCountry: 'SG',
      sourceCountry: 'AE',
      transactionCategory: 'digital_saas' as const,
      contractTitle: 'Regional SaaS Distribution & Platform Licensing Agreement',
      annualValue: 850000,
      currency: 'USD',
      isPartOfSameGroup: true,
      relationshipNature: 'Regional Dubai Subsidiary under common holding',
      directCostBase: 500000,
      indirectCostBase: 120000,
      currentInvoicedMarginPct: 14,
      durationDaysInSource: 12,
      hasPhysicalOfficeInSource: false,
      hasDependentAgentInSource: false,
      hasVirtualServerInSource: false,
      serviceMakeAvailable: false,
      hasTRC: true,
      hasForm10F: true,
      hasPANorTaxID: true,
      notes: 'Evaluating UAE corporate tax transfer pricing rules (Article 34 Connected Persons) and Singapore IRAS Section 34D.'
    }
  },
  {
    name: 'US Tech Corp → UK Branch & Services',
    desc: 'Intra-group IT DevOps & Management Fees. HMRC TIOPA 2010 vs US IRC §482.',
    data: {
      clientName: 'Apex Data Platforms Inc',
      clientEmail: 'treasury@apexdata.com',
      entityType: 'enterprise' as const,
      residentCountry: 'US',
      sourceCountry: 'UK',
      transactionCategory: 'management_services' as const,
      contractTitle: 'Transatlantic Shared Platform & R&D Services Agreement',
      annualValue: 1200000,
      currency: 'GBP',
      isPartOfSameGroup: true,
      relationshipNature: 'UK Operating Subsidiary',
      directCostBase: 800000,
      indirectCostBase: 200000,
      currentInvoicedMarginPct: 18,
      durationDaysInSource: 15,
      hasPhysicalOfficeInSource: true,
      hasDependentAgentInSource: false,
      hasVirtualServerInSource: false,
      serviceMakeAvailable: false,
      hasTRC: true,
      hasForm10F: false,
      hasPANorTaxID: true,
      notes: 'UK TIOPA transfer pricing study, Form W-8BEN-E, and HMRC DTTP exemption passport.'
    }
  },
  {
    name: 'German Precision Engineering → Australia',
    desc: 'Industrial Automation Calibration. German §1 AStG vs Australian ITAA 1997 Division 815.',
    data: {
      clientName: 'Krupp Precision Engineering GmbH',
      clientEmail: 'tax@krupp-precision.de',
      entityType: 'enterprise' as const,
      residentCountry: 'DE',
      sourceCountry: 'AU',
      transactionCategory: 'technical_consultancy_fts' as const,
      contractTitle: 'Automated Factory Robotics Calibration & Remote Telemetry',
      annualValue: 750000,
      currency: 'EUR',
      isPartOfSameGroup: false,
      relationshipNature: 'Independent German supplier',
      directCostBase: 480000,
      indirectCostBase: 90000,
      currentInvoicedMarginPct: 28,
      durationDaysInSource: 45,
      hasPhysicalOfficeInSource: false,
      hasDependentAgentInSource: false,
      hasVirtualServerInSource: false,
      serviceMakeAvailable: true,
      hasTRC: true,
      hasForm10F: false,
      hasPANorTaxID: true,
      notes: 'Under Australian Division 815 arm\'s length guidelines and German Foreign Tax Act §1 AStG.'
    }
  }
];
