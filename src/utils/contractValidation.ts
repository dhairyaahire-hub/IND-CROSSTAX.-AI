import { TaxContractInput } from '../types/tax';
import { GLOBAL_COUNTRY_TP_PROFILES, GLOBAL_COUNTRIES } from '../data/treatyDatabase';

export interface ValidationIssue {
  field: keyof TaxContractInput | 'taxIdNumber' | 'fiscalYear' | 'currency' | 'costs';
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion?: string;
}

export interface CountryTaxIdSpec {
  countryCode: string;
  countryName: string;
  taxIdName: string;
  placeholder: string;
  helpText: string;
  example: string;
  validator: (val: string) => boolean;
  cleaner?: (val: string) => string;
}

export interface CountryFiscalYearSpec {
  countryCode: string;
  cycleName: string;
  standardPeriod: string;
  presets: string[];
  explanation: string;
  validator: (val: string) => { isValid: boolean; suggestion?: string; warning?: string };
}

// Country Tax ID Specifications
export const COUNTRY_TAX_ID_SPECS: Record<string, CountryTaxIdSpec> = {
  IN: {
    countryCode: 'IN',
    countryName: 'India',
    taxIdName: 'PAN / GSTIN',
    placeholder: 'e.g. ABCDE1234F or 27ABCDE1234F1Z5',
    helpText: 'Permanent Account Number (PAN) is 10 alphanumeric characters (5 letters, 4 digits, 1 letter). GSTIN is 15 characters.',
    example: 'AAACU1234D',
    validator: (val: string) => {
      const clean = val.trim().toUpperCase();
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
      const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
      return panRegex.test(clean) || gstinRegex.test(clean);
    },
    cleaner: (val: string) => val.trim().toUpperCase()
  },
  US: {
    countryCode: 'US',
    countryName: 'United States',
    taxIdName: 'EIN / SSN / ITIN',
    placeholder: 'e.g. 12-3456789 or 123-45-6789',
    helpText: 'Employer Identification Number (EIN) is 9 digits (XX-XXXXXXX). SSN/ITIN is 9 digits (XXX-XX-XXXX).',
    example: '12-3456789',
    validator: (val: string) => {
      const clean = val.trim();
      const einRegex = /^(\d{2}-\d{7}|\d{9})$/;
      const ssnRegex = /^(\d{3}-\d{2}-\d{4})$/;
      return einRegex.test(clean) || ssnRegex.test(clean);
    }
  },
  UK: {
    countryCode: 'UK',
    countryName: 'United Kingdom',
    taxIdName: 'UTR / VAT Number',
    placeholder: 'e.g. 1234567890 or GB123456789',
    helpText: 'Unique Taxpayer Reference (UTR) is 10 digits. UK VAT is 9 digits (optional GB prefix).',
    example: '1234567890',
    validator: (val: string) => {
      const clean = val.trim().toUpperCase().replace(/\s+/g, '');
      const utrRegex = /^\d{10}$/;
      const vatRegex = /^(GB)?\d{9}$/;
      return utrRegex.test(clean) || vatRegex.test(clean);
    }
  },
  SG: {
    countryCode: 'SG',
    countryName: 'Singapore',
    taxIdName: 'UEN (Unique Entity Number)',
    placeholder: 'e.g. 201512345A or T08LL1234A',
    helpText: 'ACRA Unique Entity Number (UEN) is 9 or 10 characters (businesses: 9 digits + letter, companies: year + 5 digits + letter).',
    example: '201512345A',
    validator: (val: string) => {
      const clean = val.trim().toUpperCase();
      // Singapore UEN formats: Businesses, Local Companies, Other Entities
      const uenRegex = /^(\d{8}[A-Z]|\d{9}[A-Z]|[TSR]\d{2}[A-Z]{2}\d{4}[A-Z])$/;
      return uenRegex.test(clean);
    }
  },
  AE: {
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    taxIdName: 'Corporate Tax TRN',
    placeholder: 'e.g. 100123456789003',
    helpText: '15-digit Tax Registration Number (TRN) issued by the Federal Tax Authority (FTA), usually starting with 100.',
    example: '100123456789003',
    validator: (val: string) => {
      const clean = val.trim().replace(/\s+/g, '');
      return /^100\d{12}$/.test(clean);
    }
  },
  AU: {
    countryCode: 'AU',
    countryName: 'Australia',
    taxIdName: 'ABN / TFN',
    placeholder: 'e.g. 51 824 753 556',
    helpText: 'Australian Business Number (ABN) is 11 digits. Tax File Number (TFN) is 9 digits.',
    example: '51 824 753 556',
    validator: (val: string) => {
      const clean = val.trim().replace(/\s+/g, '');
      return /^\d{11}$/.test(clean) || /^\d{9}$/.test(clean);
    }
  },
  CA: {
    countryCode: 'CA',
    countryName: 'Canada',
    taxIdName: 'Business Number (BN)',
    placeholder: 'e.g. 123456789 or 123456789RC0001',
    helpText: 'CRA Business Number (BN) is 9 digits, or 15 characters including 2-letter program identifier (e.g. RC, RT).',
    example: '123456789',
    validator: (val: string) => {
      const clean = val.trim().toUpperCase().replace(/\s+/g, '');
      return /^\d{9}$/.test(clean) || /^\d{9}[A-Z]{2}\d{4}$/.test(clean);
    }
  },
  DE: {
    countryCode: 'DE',
    countryName: 'Germany',
    taxIdName: 'Steuernummer / USt-IdNr',
    placeholder: 'e.g. DE123456789 or 12/345/67890',
    helpText: 'USt-IdNr is DE + 9 digits. Steuernummer is 10 to 13 digits.',
    example: 'DE123456789',
    validator: (val: string) => {
      const clean = val.trim().toUpperCase().replace(/\s+/g, '');
      return /^(DE)?\d{9}$/.test(clean) || /^[\d\/]{10,14}$/.test(clean);
    }
  },
  JP: {
    countryCode: 'JP',
    countryName: 'Japan',
    taxIdName: 'Corporate Number (法人番号)',
    placeholder: 'e.g. 1234567890123',
    helpText: '13-digit National Tax Agency (NTA) Corporate Number.',
    example: '1234567890123',
    validator: (val: string) => {
      const clean = val.trim().replace(/\s+/g, '');
      return /^\d{13}$/.test(clean);
    }
  },
  NL: {
    countryCode: 'NL',
    countryName: 'Netherlands',
    taxIdName: 'RSIN / BTW-ID',
    placeholder: 'e.g. 123456789 or NL123456789B01',
    helpText: 'RSIN is 9 digits. BTW-identificatienummer is NL + 9 digits + B + 2 digits.',
    example: 'NL123456789B01',
    validator: (val: string) => {
      const clean = val.trim().toUpperCase().replace(/\s+/g, '');
      return /^\d{9}$/.test(clean) || /^NL\d{9}B\d{2}$/.test(clean);
    }
  }
};

export function getTaxIdSpec(countryCode: string): CountryTaxIdSpec {
  const code = (countryCode || '').toUpperCase();
  if (COUNTRY_TAX_ID_SPECS[code]) {
    return COUNTRY_TAX_ID_SPECS[code];
  }
  const match = GLOBAL_COUNTRIES.find(c => c.code === code);
  return {
    countryCode: code,
    countryName: match ? match.name : code,
    taxIdName: 'Tax ID / Registration Number',
    placeholder: 'e.g. Tax Registration No.',
    helpText: 'Official taxpayer identification number issued by national revenue authority (5 to 25 characters).',
    example: 'TAX-12345678',
    validator: (val: string) => {
      const clean = val.trim();
      return /^[A-Za-z0-9\-\.\/\s]{5,25}$/.test(clean);
    }
  };
}

// Country Fiscal Year Specifications
export const COUNTRY_FISCAL_YEAR_SPECS: Record<string, CountryFiscalYearSpec> = {
  IN: {
    countryCode: 'IN',
    cycleName: 'Indian Financial Year (Apr 1 – Mar 31)',
    standardPeriod: '1 April to 31 March',
    presets: ['FY 2025-26', 'FY 2026-27', 'FY 2024-25'],
    explanation: 'Section 3 of the Indian Income-tax Act strictly defines the tax year from April 1 to March 31. Single calendar years (e.g. "2026") are invalid for statutory tax reporting.',
    validator: (val: string) => {
      const clean = val.trim();
      if (!clean) return { isValid: false, warning: 'Fiscal year is required for statutory filing.' };
      
      // Match FY 2025-26, 2025-26, FY 2025-2026, AY 2026-27
      const fyRegex = /(?:FY|AY)?\s*20\d{2}\s*[-/]\s*(?:20)?\d{2}/i;
      if (fyRegex.test(clean)) {
        return { isValid: true };
      }
      
      // Check if user entered a single year like "2025" or "2026"
      if (/^20\d{2}$/.test(clean)) {
        const yr = parseInt(clean, 10);
        const nextYr = (yr + 1).toString().slice(-2);
        return {
          isValid: false,
          suggestion: `FY ${yr}-${nextYr}`,
          warning: `Indian tax law does not accept single calendar years. Please use "FY ${yr}-${nextYr}" (1 Apr ${yr} to 31 Mar ${yr + 1}).`
        };
      }
      
      return {
        isValid: false,
        warning: 'Format should be "FY YYYY-YY" (e.g. FY 2025-26) to align with CBDT rules.'
      };
    }
  },
  AU: {
    countryCode: 'AU',
    cycleName: 'Australian Tax Year (Jul 1 – Jun 30)',
    standardPeriod: '1 July to 30 June',
    presets: ['FY 2025-26', 'FY 2026-27', 'FY 2024-25'],
    explanation: 'The Australian tax year runs from 1 July to 30 June. Cross-border services spanning calendar years must be apportioned.',
    validator: (val: string) => {
      const clean = val.trim();
      if (!clean) return { isValid: false, warning: 'Fiscal year is required.' };
      const fyRegex = /(?:FY)?\s*20\d{2}\s*[-/]\s*(?:20)?\d{2}/i;
      if (fyRegex.test(clean)) return { isValid: true };
      if (/^20\d{2}$/.test(clean)) {
        const yr = parseInt(clean, 10);
        return {
          isValid: false,
          suggestion: `FY ${yr}-${(yr + 1).toString().slice(-2)}`,
          warning: `Standard Australian tax year runs July to June (e.g. FY ${yr}-${(yr + 1).toString().slice(-2)}).`
        };
      }
      return { isValid: true };
    }
  },
  UK: {
    countryCode: 'UK',
    cycleName: 'UK Tax / Accounting Period',
    standardPeriod: '6 April to 5 April (Individual/LLP) or Calendar/Accounting Period (Corp Tax)',
    presets: ['CY 2026', 'FY 2025-26', 'CY 2025'],
    explanation: 'UK accepts calendar year accounting periods for Corporation Tax (HMRC), or 6 April – 5 April for individuals and LLPs.',
    validator: (val: string) => {
      const clean = val.trim();
      if (!clean) return { isValid: false, warning: 'Accounting period is required.' };
      return { isValid: true };
    }
  },
  US: {
    countryCode: 'US',
    cycleName: 'US Calendar / Fiscal Year',
    standardPeriod: 'Calendar Year (Jan 1 – Dec 31) or Fiscal Year',
    presets: ['CY 2026', 'CY 2025', 'FY 2025-26'],
    explanation: 'Most US corporations and foreign vendor Form W-8BEN-E treaty certifications align with the calendar year ending December 31.',
    validator: (val: string) => {
      const clean = val.trim();
      if (!clean) return { isValid: false, warning: 'Tax year is required.' };
      return { isValid: true };
    }
  }
};

export function getFiscalYearSpec(countryCode: string): CountryFiscalYearSpec {
  const code = (countryCode || '').toUpperCase();
  if (COUNTRY_FISCAL_YEAR_SPECS[code]) {
    return COUNTRY_FISCAL_YEAR_SPECS[code];
  }
  return {
    countryCode: code,
    cycleName: 'Standard Accounting / Fiscal Year',
    standardPeriod: 'Calendar or Financial Year',
    presets: ['CY 2026', 'FY 2025-26', 'CY 2025'],
    explanation: 'Statutory accounting year under local commercial and corporate tax law.',
    validator: (val: string) => {
      const clean = val.trim();
      if (!clean) return { isValid: false, warning: 'Fiscal year is required.' };
      return { isValid: true };
    }
  };
}

// Complete Validation Engine
export function validateContractIntake(formData: TaxContractInput): {
  isValid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  info: ValidationIssue[];
} {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const info: ValidationIssue[] = [];

  const resident = formData.residentCountry?.toUpperCase() || 'IN';
  const source = formData.sourceCountry?.toUpperCase() || 'US';
  const residentSpec = getTaxIdSpec(resident);
  const sourceSpec = getTaxIdSpec(source);
  const residentFYSpec = getFiscalYearSpec(resident);

  // 1. Client Details Validation
  if (!formData.clientName?.trim()) {
    errors.push({
      field: 'clientName',
      severity: 'error',
      message: 'Client or Company Name is required for statutory contracts.'
    });
  }

  if (!formData.clientEmail?.trim()) {
    errors.push({
      field: 'clientEmail',
      severity: 'error',
      message: 'Recipient email address is required for dispatching audit reports.'
    });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail.trim())) {
    errors.push({
      field: 'clientEmail',
      severity: 'error',
      message: 'Please provide a valid corporate email format (e.g. cfo@company.com).'
    });
  }

  // 2. Tax ID Format Validation
  const taxId = (formData.taxIdNumber || '').trim();
  if (taxId) {
    if (!residentSpec.validator(taxId)) {
      errors.push({
        field: 'taxIdNumber',
        severity: 'error',
        message: `Invalid ${residentSpec.taxIdName} format for ${residentSpec.countryName}.`,
        suggestion: `Expected format: ${residentSpec.helpText} (Example: ${residentSpec.example})`
      });
    } else {
      info.push({
        field: 'taxIdNumber',
        severity: 'info',
        message: `Valid ${residentSpec.taxIdName} format verified for ${residentSpec.countryName}.`
      });
    }
  } else if (formData.hasPANorTaxID) {
    warnings.push({
      field: 'taxIdNumber',
      severity: 'warning',
      message: `You marked "PAN / Taxpayer ID in possession", but the Tax ID number field is empty.`,
      suggestion: `Enter your ${residentSpec.taxIdName} (e.g. ${residentSpec.example}) for Form 10F and treaty relief.`
    });
  }

  // 3. Fiscal Year Alignment Validation
  const fiscalYear = (formData.fiscalYear || '').trim();
  if (fiscalYear) {
    const fyResult = residentFYSpec.validator(fiscalYear);
    if (!fyResult.isValid) {
      if (resident === 'IN' && fyResult.warning) {
        errors.push({
          field: 'fiscalYear',
          severity: 'error',
          message: fyResult.warning,
          suggestion: fyResult.suggestion
        });
      } else {
        warnings.push({
          field: 'fiscalYear',
          severity: 'warning',
          message: fyResult.warning || 'Please verify fiscal year format.',
          suggestion: fyResult.suggestion
        });
      }
    } else {
      info.push({
        field: 'fiscalYear',
        severity: 'info',
        message: `Aligned with ${residentFYSpec.cycleName} convention.`
      });
    }
  } else {
    warnings.push({
      field: 'fiscalYear',
      severity: 'warning',
      message: `Fiscal Year is empty. Standard for ${residentSpec.countryName} is ${residentFYSpec.presets[0]}.`,
      suggestion: residentFYSpec.presets[0]
    });
  }

  // 4. Financials & Currency Validation
  const annualVal = Number(formData.annualValue) || 0;
  const directCost = Number(formData.directCostBase) || 0;
  const indirectCost = Number(formData.indirectCostBase) || 0;
  const totalCost = directCost + indirectCost;
  const currency = formData.currency || 'USD';

  if (annualVal <= 0) {
    errors.push({
      field: 'annualValue',
      severity: 'error',
      message: 'Annual invoiced contract value must be a positive number greater than 0.'
    });
  } else if (annualVal < 1000) {
    warnings.push({
      field: 'annualValue',
      severity: 'warning',
      message: `Contract value (${currency} ${annualVal}) is unusually low for commercial cross-border contracts.`
    });
  }

  // Cost Base vs Annual Value Check
  if (totalCost > 0 && annualVal > 0) {
    if (totalCost > annualVal) {
      errors.push({
        field: 'costs',
        severity: 'error',
        message: `Total Cost Base (${currency} ${totalCost.toLocaleString()}) exceeds Annual Contract Value (${currency} ${annualVal.toLocaleString()}).`,
        suggestion: formData.isPartOfSameGroup
          ? 'Associated Enterprises cannot invoice at a loss without triggering severe transfer pricing audit adjustments.'
          : 'Providing services below cost creates permanent establishment and commercial substance scrutiny.'
      });
    } else if (totalCost === annualVal) {
      warnings.push({
        field: 'costs',
        severity: 'warning',
        message: 'Contract is priced at exact cost recovery (0% profit margin).',
        suggestion: formData.isPartOfSameGroup
          ? 'Under OECD Guidelines and CBDT Section 92C, transactions between related parties require an arm\'s length profit margin.'
          : 'Third-party contracts normally yield an operating margin.'
      });
    }
  }

  // Corridor Currency Alignment Check
  const residentProfile = GLOBAL_COUNTRY_TP_PROFILES[resident];
  const sourceProfile = GLOBAL_COUNTRY_TP_PROFILES[source];
  const residentCur = residentProfile?.currency || 'USD';
  const sourceCur = sourceProfile?.currency || 'USD';
  const customaryCurrencies = new Set([residentCur, sourceCur, 'USD', 'EUR', 'GBP']);

  if (!customaryCurrencies.has(currency)) {
    warnings.push({
      field: 'currency',
      severity: 'warning',
      message: `${currency} is neither the local currency of ${resident} (${residentCur}) nor ${source} (${sourceCur}).`,
      suggestion: `Cross-border contracts in third-party currencies introduce secondary foreign exchange volatility under Section 43A.`
    });
  }

  // Transfer Pricing Margin Alignment (Associated Enterprises)
  if (formData.isPartOfSameGroup) {
    const margin = Number(formData.currentInvoicedMarginPct) || 0;
    const threshold = residentProfile?.safeHarbourThreshold || 5.0;

    if (resident === 'IN' && formData.transactionCategory === 'software_it') {
      const inThreshold = 17.0; // CBDT Rule 10TD
      if (margin < inThreshold) {
        warnings.push({
          field: 'currentInvoicedMarginPct',
          severity: 'warning',
          message: `Invoiced margin (${margin}%) is below the Indian CBDT Safe Harbour Rule 10TD threshold (17.0% for IT/Software services).`,
          suggestion: 'Transactions below 17% carry high scrutiny risk during Form 3CEB transfer pricing audits.'
        });
      } else {
        info.push({
          field: 'currentInvoicedMarginPct',
          severity: 'info',
          message: `Invoiced margin (${margin}%) meets or exceeds the Indian CBDT Rule 10TD Safe Harbour (17.0%).`
        });
      }
    } else if (margin < threshold) {
      warnings.push({
        field: 'currentInvoicedMarginPct',
        severity: 'warning',
        message: `Invoiced margin (${margin}%) is below the customary ${resident} Safe Harbour benchmark (${threshold}%).`,
        suggestion: `Consider aligning with the ${threshold}% arm's length benchmark to avoid upward adjustments.`
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    info
  };
}
