import React from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Calculator, 
  Scale, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  Briefcase, 
  Building2, 
  Globe2, 
  Award, 
  FileCheck2, 
  Layers, 
  Play, 
  Video,
  Download,
  Shield,
  Zap,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { TaxContractInput } from '../types/tax';
import { PRESET_CONTRACTS } from '../data/treatyDatabase';

interface HowItWorksAndBenefitsProps {
  onStartEvaluation: (presetData?: TaxContractInput) => void;
  onOpenDemo?: () => void;
}

export const HowItWorksAndBenefits: React.FC<HowItWorksAndBenefitsProps> = ({
  onStartEvaluation,
  onOpenDemo
}) => {
  const steps = [
    {
      step: '01',
      title: 'Enter Contract & Jurisdictions',
      duration: '1 Minute',
      icon: FileText,
      accent: 'border-amber-500 text-amber-600 bg-amber-50',
      description: 'Input your resident entity (e.g. India) and foreign paying customer (e.g. USA, UK, Singapore, UAE, Germany).',
      bullets: [
        'Real-time validation of Tax ID formats (Indian PAN/GSTIN, US EIN, Singapore UEN, UAE TRN)',
        'Statutory Financial Year alignment (April–March for India, Calendar Year for US/UK)',
        'Specify transaction nature: Software IT, Royalties, FTS/Consultancy, or Management Fees'
      ],
      tip: 'Over 85 bilateral treaty pairs pre-indexed and ready.'
    },
    {
      step: '02',
      title: 'Automated DTAA Treaty Optimization',
      duration: '30 Seconds',
      icon: ShieldCheck,
      accent: 'border-red-500 text-red-600 bg-red-50',
      description: 'The AI engine evaluates bilateral tax conventions under Article 5, 7, and 12 to eliminate double taxation.',
      bullets: [
        'Drops 20% to 30% domestic withholding taxes down to 0% - 10%',
        'Comprehensive Article 5 PE Diagnostics (Service PE, Fixed Place, Dependent Agent)',
        'Tests "Make Available" know-how transfer clauses to shield service revenue'
      ],
      tip: 'Average client savings: $15,000 to $200,000+ per foreign contract.'
    },
    {
      step: '03',
      title: 'Arm’s Length & Transfer Pricing',
      duration: '1 Minute',
      icon: Calculator,
      accent: 'border-blue-500 text-blue-600 bg-blue-50',
      description: 'Benchmarks intercompany transactions between Associated Enterprises under Indian Chapter X and OECD Guidelines.',
      bullets: [
        'Checks CBDT Safe Harbour Rule 10TD margins (17% for IT, 24% for KPO services)',
        'Computes Arm’s Length range (35th percentile, Median, 65th percentile)',
        'Protects against secondary adjustment penalties under Section 92CE'
      ],
      tip: '100% audit-proof documentation for tax assessing officers.'
    },
    {
      step: '04',
      title: '1-Click Statutory Legal Drafts',
      duration: 'Instant',
      icon: Scale,
      accent: 'border-emerald-500 text-emerald-600 bg-emerald-50',
      description: 'Generates bank-ready, e-filing ready legal declarations in official Microsoft Word (.docx) and PDF formats.',
      bullets: [
        'CBDT Form 10F Electronic Self-Declaration under Rule 21AB',
        'Affidavit & No-Permanent Establishment (No-PE) Declarations',
        'Form 3CEB Accountant Transfer Pricing Summary Dossier'
      ],
      tip: 'Direct 1-click email dispatch to clients and banking compliance desks.'
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: 'Stop 15% – 20% Foreign Tax Leakage',
      desc: 'Eliminate overseas tax deductions on foreign invoices under Section 90 DTAA, ensuring companies receive 100% of their billings.',
      tag: 'Direct Revenue Impact'
    },
    {
      icon: Clock,
      title: 'Save 95% of Research Time',
      desc: 'Compress 10 to 14 days of tedious manual treaty study, commentary lookups, and circular cross-referencing into 3 minutes.',
      tag: 'Extreme Efficiency'
    },
    {
      icon: Shield,
      title: 'Zero Transfer Pricing Penalties',
      desc: 'Lock in CBDT Safe Harbour Rule 10TD compliance (17%–24% margins) to prevent costly tax scrutiny notices and adjustments.',
      tag: 'Audit Protection'
    },
    {
      icon: FileCheck2,
      title: 'E-Filing & Bank Ready Form 10F',
      desc: 'Pre-formatted, legally binding statutory drafts ready for the Indian IT portal and international wire transfers (Form 15CA/CB).',
      tag: 'Statutory Compliance'
    },
    {
      icon: Globe2,
      title: '85+ Global Bilateral Treaties',
      desc: 'Indexed coverage across USA, UK, Singapore, UAE, Germany, Japan, Netherlands, Australia, Canada, Switzerland, and more.',
      tag: 'Global Coverage'
    },
    {
      icon: Award,
      title: 'Trusted by CAs, CFOs & Tech Exporters',
      desc: 'Built specifically for Chartered Accountants, corporate finance desks, SaaS founders, and cross-border tech agencies.',
      tag: 'Enterprise Grade'
    }
  ];

  const audienceValue = [
    {
      title: 'For Indian IT Exporters & Tech SaaS',
      icon: Building2,
      points: [
        'Receive full foreign invoice amounts without 20%–30% US/UK/Singapore tax cuts',
        'Provide instant No-PE & Form 10F certificates required by foreign corporate clients',
        'Maintain clean intercompany contracts with overseas subsidiary entities'
      ]
    },
    {
      title: 'For Chartered Accountants & Tax Firms',
      icon: Briefcase,
      points: [
        'Expand high-margin international tax and cross-border advisory services',
        'Generate instant client briefing dossiers, Form 3CEB summaries & position papers',
        'Standardize junior staff workflows with automated Section 92C verification'
      ]
    },
    {
      title: 'For Corporate CFOs & Finance Desks',
      icon: TrendingUp,
      points: [
        'Audit-proof international remittances and intercompany service charges',
        'Satisfy statutory auditor and foreign banking compliance requirements',
        'Model transfer pricing margin impacts with real-time currency conversion'
      ]
    }
  ];

  return (
    <div className="space-y-10 py-2">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-red-950 text-white p-6 sm:p-10 border border-slate-800 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Complete Platform Blueprint &amp; Guide</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            How IND CROSSTAX AI Works in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-red-500">4 Simple Steps</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Turn complex cross-border taxation, bilateral DTAA treaties, and Chapter X Transfer Pricing into an automated, bank-ready advisory dossier in less than 3 minutes.
          </p>

          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <button
              type="button"
              onClick={() => onStartEvaluation(PRESET_CONTRACTS[0].data)}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <span>Load Sample Contract &amp; Test Flow</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onOpenDemo && (
              <button
                type="button"
                onClick={onOpenDemo}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <Video className="w-4 h-4 text-amber-400" />
                <span>Watch 2-Min Video Demo</span>
              </button>
            )}
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Step by Step Process Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-red-600" />
              <span>Step-by-Step Workflow</span>
            </h3>
            <p className="text-xs text-slate-500">From raw contract details to bank-ready statutory documentation in minutes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div 
                key={st.step}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative group"
              >
                <div className="space-y-3">
                  {/* Step Header */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      STEP {st.step}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {st.duration}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl border ${st.accent} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">{st.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{st.description}</p>
                    </div>
                  </div>

                  {/* Bullets */}
                  <ul className="space-y-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600 leading-relaxed">
                    {st.bullets.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Tip */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-md block leading-tight">
                    💡 {st.tip}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Core Measurable Benefits */}
      <div className="space-y-4 pt-2">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-5 h-5 text-red-600" />
            <span>Why Companies &amp; Tax Professionals Choose IND CROSSTAX AI</span>
          </h3>
          <p className="text-xs text-slate-500">Measurable return on investment and statutory compliance certainty</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-red-300 transition-colors space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {b.tag}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{b.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audience-Specific Value Proposition */}
      <div className="space-y-4 pt-2">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-red-600" />
            <span>Tailored Value for Every Stakeholder</span>
          </h3>
          <p className="text-xs text-slate-500">Designed for seamless collaboration across cross-border operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {audienceValue.map((aud, idx) => {
            const Icon = aud.icon;
            return (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{aud.title}</h4>
                </div>

                <ul className="space-y-2 text-xs text-slate-600">
                  {aud.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="text-red-500 font-bold shrink-0">•</span>
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Call to Action Bar */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-50 via-white to-amber-50 border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-bold text-slate-900 text-sm sm:text-base">Ready to evaluate your international tax contract?</h4>
          <p className="text-xs text-slate-600">Test an instant diagnostic with real-time tax ID and treaty rate validation.</p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-center">
          <button
            type="button"
            onClick={() => onStartEvaluation(PRESET_CONTRACTS[0].data)}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm transition shadow-md shadow-red-600/20 flex items-center gap-2 cursor-pointer"
          >
            <span>Start Free Contract Intake</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
