import React, { useState } from 'react';
import { 
  TaxContractInput, 
  EntityType, 
  TransactionCategory 
} from '../types/tax';
import { POPULAR_COUNTRIES, PRESET_CONTRACTS } from '../data/treatyDatabase';
import { 
  Building2, 
  DollarSign, 
  Sparkles, 
  FileCheck2, 
  Layers, 
  Clock, 
  ShieldAlert, 
  ArrowRight,
  Info
} from 'lucide-react';
import { RealTimeCurrencyConverter } from './RealTimeCurrencyConverter';

interface ContractIntakeFormProps {
  initialData: TaxContractInput;
  onSubmit: (data: TaxContractInput) => void;
  isLoading: boolean;
}

export const ContractIntakeForm: React.FC<ContractIntakeFormProps> = ({
  initialData,
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState<TaxContractInput>(initialData);

  const handlePresetSelect = (presetData: TaxContractInput) => {
    setFormData(presetData);
  };

  const handleChange = (field: keyof TaxContractInput, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const currentTotalCost = (formData.directCostBase || 0) + (formData.indirectCostBase || 0);

  const handleApplyCurrencyValues = (newCurrency: string, newAnnualValue: number, newCostBase: number) => {
    const directRatio = currentTotalCost > 0 ? (formData.directCostBase || 0) / currentTotalCost : 0.8;
    const newDirect = Math.round(newCostBase * directRatio);
    const newIndirect = Math.round(newCostBase * (1 - directRatio));

    setFormData((prev) => ({
      ...prev,
      currency: newCurrency,
      annualValue: newAnnualValue,
      directCostBase: newDirect,
      indirectCostBase: newIndirect
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Header (White Card with Red Theme) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>Automated DTAA &amp; Arm&apos;s Length Advisory Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Cross-Border Tax Contract Ingestion
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Ingest international service contracts, intercompany transactions, and freelance engagements.
            The AI Tax Agent evaluates bilateral Double Taxation Avoidance Agreements (DTAA), checks Permanent Establishment (PE) exposure under Article 5, tests &ldquo;Make Available&rdquo; relief, benchmarks Arm&apos;s Length Prices under OECD and Indian Chapter X, and produces statutory drafts.
          </p>
        </div>

        {/* 1-Click Presets */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-red-600" />
            <span>Load Real-World Corridor Presets:</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {PRESET_CONTRACTS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetSelect(preset.data)}
                className="text-left p-3 rounded-xl bg-slate-50 hover:bg-red-50/60 border border-slate-200 hover:border-red-300 transition-all text-xs group cursor-pointer"
              >
                <div className="font-bold text-slate-900 group-hover:text-red-700 transition-colors line-clamp-1">
                  {preset.name}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {preset.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Entity & Corridor Origins (White Card) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
            <Building2 className="w-5 h-5 text-red-600" />
            <span>1. Enterprise Profile &amp; Jurisdictional Corridor</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Client / Business Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Client / Company Name
              </label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => handleChange('clientName', e.target.value)}
                placeholder="e.g. Acme Tech Solutions Pvt Ltd"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>

            {/* Email for Automated Report Dispatch */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email for Tax Structure Report
              </label>
              <input
                type="email"
                required
                value={formData.clientEmail}
                onChange={(e) => handleChange('clientEmail', e.target.value)}
                placeholder="cfo@acme.com"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>

            {/* Entity Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Entity Legal Structure
              </label>
              <select
                value={formData.entityType}
                onChange={(e) => handleChange('entityType', e.target.value as EntityType)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-red-500"
              >
                <option value="sme">SME (Small &amp; Medium Enterprise)</option>
                <option value="freelancer">Independent Contractor / Freelancer</option>
                <option value="startup">Venture-Backed Startup</option>
                <option value="holding_co">Cross-Border Holding Co</option>
                <option value="enterprise">Multinational Enterprise (MNE)</option>
              </select>
            </div>

            {/* Resident Country */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Resident / Service Provider Country (Origin)
              </label>
              <select
                value={formData.residentCountry}
                onChange={(e) => handleChange('residentCountry', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-red-500"
              >
                {POPULAR_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.code})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500 mt-1">
                Where the invoicing entity is tax resident and maintains place of effective management.
              </p>
            </div>

            {/* Source Country */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Source / Customer Country (Paying Jurisdiction)
              </label>
              <select
                value={formData.sourceCountry}
                onChange={(e) => handleChange('sourceCountry', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-red-500"
              >
                {POPULAR_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.code})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500 mt-1">
                Where the payor is located and withholds tax at source (TDS/WHT).
              </p>
            </div>

            {/* Transaction Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Transaction Nature &amp; Scope
              </label>
              <select
                value={formData.transactionCategory}
                onChange={(e) => handleChange('transactionCategory', e.target.value as TransactionCategory)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-red-500"
              >
                <option value="software_it">Software Development &amp; IT Services</option>
                <option value="technical_consultancy_fts">Technical &amp; Management Consultancy (FTS / FIS)</option>
                <option value="freelance_engineering">Freelance Professional / Engineering</option>
                <option value="digital_saas">Digital SaaS &amp; Cloud Subscription</option>
                <option value="ip_royalty">IP Licensing &amp; Royalties</option>
                <option value="intercompany_loan">Intra-Group Intercompany Loan / Financing</option>
                <option value="management_services">Shared Corporate Management Services</option>
                <option value="marketing_support">Marketing &amp; Distribution Support</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Contract Title / Engagement Description
            </label>
            <input
              type="text"
              value={formData.contractTitle}
              onChange={(e) => handleChange('contractTitle', e.target.value)}
              placeholder="e.g. Master Services Agreement for Cloud Infrastructure Engineering"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Section 2: Financials & Transfer Pricing (White Card) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <DollarSign className="w-5 h-5 text-red-600" />
              <span>2. Financial Values &amp; Transfer Pricing Parameters</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-700 font-medium">Associated Enterprise (AE)?</span>
              <button
                type="button"
                onClick={() => handleChange('isPartOfSameGroup', !formData.isPartOfSameGroup)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  formData.isPartOfSameGroup ? 'bg-red-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.isPartOfSameGroup ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {formData.isPartOfSameGroup ? (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs text-red-900">
                <span className="font-bold">Associated Enterprise Triggered:</span> Transactions between related entities are governed by Section 92 of India&apos;s Income Tax Act and OECD Transfer Pricing Guidelines. Mandatory requirements include Arm&apos;s Length Price justification, Form 3CEB accountant filing, and maintenance of TP documentation.
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600">
                <span className="font-bold text-slate-800">Third-Party Independent Transaction:</span> Presumed to be at arm&apos;s length. The engine will focus heavily on Withholding Tax (WHT) mitigation, DTAA Article 7 business profits exemption, and Permanent Establishment defense.
              </div>
            </div>
          )}

          {/* Automated Real-Time Currency Converter Component */}
          <RealTimeCurrencyConverter
            residentCountry={formData.residentCountry}
            sourceCountry={formData.sourceCountry}
            currentCurrency={formData.currency}
            currentAnnualValue={formData.annualValue}
            currentCostBase={currentTotalCost}
            onApplyValues={handleApplyCurrencyValues}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Contract Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-red-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="SGD">SGD (S$)</option>
                <option value="AED">AED (AED)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="AUD">AUD (A$)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Annual Invoiced Value ({formData.currency})
              </label>
              <input
                type="number"
                min="1000"
                step="1000"
                required
                value={formData.annualValue}
                onChange={(e) => handleChange('annualValue', Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-red-500 font-mono font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Direct Cost Base ({formData.currency})
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={formData.directCostBase}
                onChange={(e) => handleChange('directCostBase', Number(e.target.value))}
                placeholder="Salaries, direct cloud costs"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-red-500 font-mono font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Indirect Overhead Cost ({formData.currency})
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={formData.indirectCostBase}
                onChange={(e) => handleChange('indirectCostBase', Number(e.target.value))}
                placeholder="Overhead, rent, utilities"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-red-500 font-mono font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Current Invoiced Markup / Margin %
                </label>
                <span className="text-xs font-mono font-bold text-red-600">
                  {formData.currentInvoicedMarginPct}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="0.5"
                value={formData.currentInvoicedMarginPct}
                onChange={(e) => handleChange('currentInvoicedMarginPct', Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0% (Cost recovery)</span>
                <span>15% (OECD standard)</span>
                <span>24% (CBDT KPO Safe Harbour)</span>
                <span>50%+ (High Margin)</span>
              </div>
            </div>

            {formData.isPartOfSameGroup && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Intercompany Relationship Nature
                </label>
                <input
                  type="text"
                  value={formData.relationshipNature || ''}
                  onChange={(e) => handleChange('relationshipNature', e.target.value)}
                  placeholder="e.g. 100% Wholly Owned Subsidiary, Sister Entity under Common Control"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-red-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Permanent Establishment (PE) Nexus (White Card) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <span>3. Permanent Establishment (Article 5) &amp; Nexus Diagnostics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Days in Source State */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-red-600" />
                  Service Days on Ground
                </span>
                <span className="text-xs font-mono font-bold text-red-600">
                  {formData.durationDaysInSource} days
                </span>
              </div>
              <input
                type="number"
                min="0"
                max="365"
                value={formData.durationDaysInSource}
                onChange={(e) => handleChange('durationDaysInSource', Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-red-500"
              />
              <p className="text-[10px] text-slate-500 mt-1.5">
                Treaties trigger Service PE if presence exceeds 90 or 183 days.
              </p>
            </div>

            {/* Fixed Place PE */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-1">
                  Fixed Place / Branch in Source?
                </span>
                <p className="text-[10px] text-slate-500">
                  Maintained office, desk, or workshop in source state (Article 5(1)).
                </p>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleChange('hasPhysicalOfficeInSource', true)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    formData.hasPhysicalOfficeInSource ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  Yes (PE Risk)
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('hasPhysicalOfficeInSource', false)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    !formData.hasPhysicalOfficeInSource ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  No (Safe)
                </button>
              </div>
            </div>

            {/* Dependent Agent PE */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-1">
                  Dependent Commercial Agent?
                </span>
                <p className="text-[10px] text-slate-500">
                  Agent habitually concluding sales contracts in source state (Article 5(5)).
                </p>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleChange('hasDependentAgentInSource', true)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    formData.hasDependentAgentInSource ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  Yes (Agency PE)
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('hasDependentAgentInSource', false)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    !formData.hasDependentAgentInSource ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  No (Safe)
                </button>
              </div>
            </div>

            {/* Make Available Clause */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-1">
                  Transfers Know-How (&ldquo;Make Available&rdquo;)?
                </span>
                <p className="text-[10px] text-slate-500">
                  Does the recipient gain technical skill to perform task independently?
                </p>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleChange('serviceMakeAvailable', true)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    formData.serviceMakeAvailable ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  Yes (FTS)
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('serviceMakeAvailable', false)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    !formData.serviceMakeAvailable ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  No (Exempt)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Statutory Documentation (White Card) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
            <FileCheck2 className="w-5 h-5 text-red-600" />
            <span>4. Existing Statutory Credentials</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:border-red-300 transition-colors">
              <input
                type="checkbox"
                checked={formData.hasTRC}
                onChange={(e) => handleChange('hasTRC', e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Tax Residency Certificate (TRC)
                </span>
                <span className="text-[11px] text-slate-500">
                  Issued by local revenue service (e.g. IRS Form 6166, HMRC, IRAS).
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:border-red-300 transition-colors">
              <input
                type="checkbox"
                checked={formData.hasForm10F}
                onChange={(e) => handleChange('hasForm10F', e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Electronic Form 10F Filed
                </span>
                <span className="text-[11px] text-slate-500">
                  Mandatory self-declaration on Indian IT portal under Rule 21AB.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:border-red-300 transition-colors">
              <input
                type="checkbox"
                checked={formData.hasPANorTaxID}
                onChange={(e) => handleChange('hasPANorTaxID', e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  PAN / Taxpayer ID Number
                </span>
                <span className="text-[11px] text-slate-500">
                  Prevents punitive 20% domestic withholding under Section 206AA.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Action Button (Red Gradient) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-gradient-to-r from-red-50 via-white to-red-50 border border-red-200 rounded-2xl shadow-sm">
          <div>
            <div className="font-bold text-slate-900 text-sm">
              Ready to execute AI DTAA &amp; Transfer Pricing diagnostic
            </div>
            <div className="text-xs text-slate-500">
              Evaluates Article 5/7/12 treaties, computes arm&apos;s length range, and prepares drafts.
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Evaluating DTAA &amp; Arm&apos;s Length Price...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Run Complete Tax &amp; TP Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
