import React, { useState } from 'react';
import { TaxContractInput, EntityType, TransactionCategory } from '../types/tax';
import { POPULAR_COUNTRIES, PRESET_CONTRACTS } from '../data/treatyDatabase';
import { 
  Building2, 
  MapPin, 
  FileText, 
  DollarSign, 
  ShieldCheck, 
  FileCheck2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  Layers,
  Percent,
  Clock,
  Briefcase
} from 'lucide-react';

interface OnboardingFlowProps {
  initialData: TaxContractInput;
  onComplete: (data: TaxContractInput) => void;
  isLoading: boolean;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  initialData,
  onComplete,
  isLoading
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<TaxContractInput>(initialData);

  const totalSteps = 5;

  const handleChange = (field: keyof TaxContractInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const loadPreset = (presetData: TaxContractInput) => {
    setFormData(presetData);
  };

  const stepsMeta = [
    { number: 1, title: 'Countries & Parties', subtitle: 'Where you & client are based' },
    { number: 2, title: 'Type of Work', subtitle: 'What service you deliver' },
    { number: 3, title: 'Contract Value & Margin', subtitle: 'Fees, costs, and profits' },
    { number: 4, title: 'Travel & Office Abroad', subtitle: 'Days spent in client country' },
    { number: 5, title: 'Tax Documents Ready', subtitle: 'TRC and Form 10F check' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Onboarding Header (White Card with Red Accents) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>Step-by-Step Cross-Border Tax Diagnostic</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Guided International Tax Onboarding
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              We guide you through the 5 critical data pillars required by tax authorities to grant DTAA double tax relief and defend transfer pricing arm&apos;s length margins.
            </p>
          </div>

          {/* Quick presets shortcut */}
          <div className="shrink-0">
            <span className="text-[11px] font-bold text-slate-500 block mb-1">Quick Sample:</span>
            <button
              type="button"
              onClick={() => loadPreset(PRESET_CONTRACTS[0].data)}
              className="text-xs px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-red-600" />
              <span>Autofill Indian SME &rarr; US</span>
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="grid grid-cols-5 gap-2 sm:gap-4">
            {stepsMeta.map((s) => {
              const isPast = currentStep > s.number;
              const isCurrent = currentStep === s.number;
              return (
                <button
                  key={s.number}
                  type="button"
                  onClick={() => setCurrentStep(s.number)}
                  className="text-left group cursor-pointer focus:outline-none"
                >
                  <div className={`h-2 rounded-full transition-all duration-300 ${
                    isPast ? 'bg-red-400' : isCurrent ? 'bg-red-600 shadow-sm' : 'bg-slate-200'
                  }`} />
                  <div className="mt-2 hidden sm:block">
                    <span className={`text-[10px] font-bold block ${
                      isCurrent ? 'text-red-600' : isPast ? 'text-red-500' : 'text-slate-400'
                    }`}>
                      Step {s.number}
                    </span>
                    <span className={`text-[11px] font-medium truncate block ${
                      isCurrent ? 'text-slate-900 font-bold' : 'text-slate-500'
                    }`}>
                      {s.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Content Container (White Card) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* STEP 1: Jurisdiction & Parties */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <Building2 className="w-5 h-5 text-red-600" />
                <span>Step 1: Jurisdictional Corridor &amp; Contracting Parties</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Establish the tax residences of both the service provider and the customer.
              </p>
            </div>

            {/* Why This Matters Callout */}
            <div className="p-4 bg-red-50/60 border border-red-100 rounded-xl flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-red-700 font-bold">Why this matters:</strong> Tax treaties (DTAAs) are bilateral agreements between two specific sovereign states. Article 4 (Resident) dictates which country has the primary taxing right and whether source-state withholding tax can be legally eliminated or reduced.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Legal Entity / Client Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => handleChange('clientName', e.target.value)}
                  placeholder="e.g. CloudTech Systems LLP"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Report Delivery Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.clientEmail}
                  onChange={(e) => handleChange('clientEmail', e.target.value)}
                  placeholder="tax-officer@company.com"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Entity Legal Structure
                </label>
                <select
                  value={formData.entityType}
                  onChange={(e) => handleChange('entityType', e.target.value as EntityType)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-red-500"
                >
                  <option value="sme">SME (Small or Medium Enterprise)</option>
                  <option value="freelancer">Independent Consultant / Freelancer</option>
                  <option value="startup">Growth-Stage Startup</option>
                  <option value="holding_co">International Holding Company</option>
                  <option value="enterprise">Multinational Enterprise (MNE)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Resident Country (Where You Pay Taxes)
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
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Source / Customer Country (Where Client Withholds Tax)
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
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Contract Nature */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <FileText className="w-5 h-5 text-red-600" />
                <span>Step 2: Transaction Scope &amp; Characterization</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Classify the services rendered to match DTAA Articles and domestic tax categories.
              </p>
            </div>

            {/* Why This Matters Callout */}
            <div className="p-4 bg-red-50/60 border border-red-100 rounded-xl flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-red-700 font-bold">Why this matters:</strong> International tax classifies income into distinct buckets. Pure &ldquo;Business Profits&rdquo; (Article 7) are completely exempt from tax in the customer&apos;s country unless you have a PE. However, &ldquo;Royalties&rdquo; or &ldquo;Fees for Technical Services (FTS)&rdquo; (Article 12) attract 10% to 20% withholding tax unless a &ldquo;Make Available&rdquo; exception applies.
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Transaction Classification
                </label>
                <select
                  value={formData.transactionCategory}
                  onChange={(e) => handleChange('transactionCategory', e.target.value as TransactionCategory)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-red-500"
                >
                  <option value="software_it">Software Development, DevOps &amp; Engineering Services</option>
                  <option value="technical_consultancy_fts">Technical &amp; Management Advisory (FTS / FIS)</option>
                  <option value="freelance_engineering">Independent Specialist / Freelance Professional</option>
                  <option value="digital_saas">Digital SaaS Subscription / Cloud Infrastructure</option>
                  <option value="ip_royalty">IP Licensing, Patent / Copyright Royalties</option>
                  <option value="intercompany_loan">Intra-Group Intercompany Loan / Financing</option>
                  <option value="management_services">Shared Corporate Management Services</option>
                  <option value="marketing_support">Marketing, Sales &amp; Distribution Representation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Formal Contract Title
                </label>
                <input
                  type="text"
                  value={formData.contractTitle}
                  onChange={(e) => handleChange('contractTitle', e.target.value)}
                  placeholder="e.g. Master Services Agreement for Full-Stack Software Engineering"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Key Scope Summary / Deliverables
                </label>
                <textarea
                  rows={3}
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Briefly describe what deliverables are delivered and whether code/reports are transferred..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Financials & Transfer Pricing */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <DollarSign className="w-5 h-5 text-red-600" />
                <span>Step 3: Financial Values &amp; Arm&apos;s Length Markup</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Provide contract value, cost structure, and current profit margin to test arm&apos;s length compliance.
              </p>
            </div>

            {/* Why This Matters Callout */}
            <div className="p-4 bg-red-50/60 border border-red-100 rounded-xl flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-red-700 font-bold">Why this matters:</strong> If you contract with a parent, subsidiary, or related entity (Associated Enterprise under Section 92A / OECD Art 9), tax authorities mandate that the pricing mirrors independent market conditions (the Arm&apos;s Length Principle). Inadequate margins trigger upward tax adjustments and interest penalties under Section 92CE!
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Is this an Associated Enterprise (Related Group)?
                </span>
                <span className="text-[11px] text-slate-500">
                  Shared ownership, parent-subsidiary, or common board control.
                </span>
              </div>
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Currency
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
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Total Annual Contract Sum
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.annualValue}
                  onChange={(e) => handleChange('annualValue', Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Direct Cost Base (Salaries/Tools)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.directCostBase}
                  onChange={(e) => handleChange('directCostBase', Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 font-mono focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Current Invoiced Profit Margin / Markup %
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
                <span>0%</span>
                <span>15% (OECD Software average)</span>
                <span>24% (CBDT KPO Safe Harbour)</span>
                <span>50%+</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Travel & Office Abroad */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <Clock className="w-5 h-5 text-red-600" />
                <span>Step 4: Physical Nexus &amp; Permanent Establishment (Article 5)</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Assess whether cross-border activities inadvertently trigger corporate tax presence abroad.
              </p>
            </div>

            {/* Why This Matters Callout */}
            <div className="p-4 bg-red-50/60 border border-red-100 rounded-xl flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-red-700 font-bold">Why this matters:</strong> Inadvertently creating a Permanent Establishment (PE) in the customer&apos;s country is the single biggest tax disaster for cross-border businesses. It subjects your entire company profits to source-country corporate income tax (up to 30%-40%) plus interest!
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Duration on Ground */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-700">
                    Days Spent in Customer Country
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
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-red-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Threshold is typically 90 days (India-US) or 183 days (OECD standard).
                </p>
              </div>

              {/* Fixed Office */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-1">
                    Maintains Fixed Office or Desk?
                  </span>
                  <p className="text-[10px] text-slate-500">
                    Triggers Fixed Place PE under Article 5(1).
                  </p>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleChange('hasPhysicalOfficeInSource', false)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      !formData.hasPhysicalOfficeInSource ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    No Office (Safe)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('hasPhysicalOfficeInSource', true)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      formData.hasPhysicalOfficeInSource ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    Yes (Fixed PE)
                  </button>
                </div>
              </div>

              {/* Dependent Agent */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-1">
                    Dependent Commercial Agent?
                  </span>
                  <p className="text-[10px] text-slate-500">
                    Agent habitually signing contracts on your behalf.
                  </p>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleChange('hasDependentAgentInSource', false)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      !formData.hasDependentAgentInSource ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    No Agent (Safe)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('hasDependentAgentInSource', true)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      formData.hasDependentAgentInSource ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    Yes (Agency PE)
                  </button>
                </div>
              </div>

              {/* Make Available Clause */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-1">
                    Transfers Technical Know-How?
                  </span>
                  <p className="text-[10px] text-slate-500">
                    If &quot;No&quot;, FTS tax can be exempted under Make Available clause.
                  </p>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleChange('serviceMakeAvailable', false)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      !formData.serviceMakeAvailable ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    No (Exempt FTS)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('serviceMakeAvailable', true)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      formData.serviceMakeAvailable ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    Yes (Taxable FTS)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Tax Documents Ready */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <FileCheck2 className="w-5 h-5 text-red-600" />
                <span>Step 5: Statutory Documentation Readiness</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Confirm statutory filings required by tax authorities to apply treaty relief.
              </p>
            </div>

            {/* Why This Matters Callout */}
            <div className="p-4 bg-red-50/60 border border-red-100 rounded-xl flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-red-700 font-bold">Why this matters:</strong> Even if a tax treaty legally grants you 0% tax, domestic tax law (Section 90(4) &amp; Rule 21AB) forbids the payor from applying treaty rates without a Tax Residency Certificate (TRC) and electronic Form 10F. Missing these forces 20% flat withholding!
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:border-red-300 transition-colors">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Tax Residency Certificate (TRC / Form 6166)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Issued by your national tax agency (e.g. IRS, HMRC, IRAS).
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.hasTRC}
                  onChange={(e) => handleChange('hasTRC', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:border-red-300 transition-colors">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Electronic Form 10F Self-Declaration
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Required on Indian Income Tax portal under Rule 21AB.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.hasForm10F}
                  onChange={(e) => handleChange('hasForm10F', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:border-red-300 transition-colors">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Tax Identification Number / Permanent Account Number (PAN)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Prevents penal 20% withholding under Section 206AA.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.hasPANorTaxID}
                  onChange={(e) => handleChange('hasPANorTaxID', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                />
              </label>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running Tax Engine...</span>
              </>
            ) : currentStep === totalSteps ? (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Generate Comprehensive Tax &amp; TP Report</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Continue to Step {currentStep + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
