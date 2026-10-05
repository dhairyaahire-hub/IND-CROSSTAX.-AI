import React, { useState } from 'react';
import { 
  GLOBAL_COUNTRIES, 
  getTreatyInfo, 
  getCountryTPProfile 
} from '../data/treatyDatabase';
import { 
  Globe2, 
  ArrowRight, 
  CheckCircle2,
  Info,
  BookOpen,
  Scale,
  ShieldCheck,
  Search
} from 'lucide-react';

export const TreatyExplorer: React.FC = () => {
  const [residence, setResidence] = useState<string>('US');
  const [source, setSource] = useState<string>('UK');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeTreaty = getTreatyInfo(residence, source);
  const residentProfile = getCountryTPProfile(residence);
  const sourceProfile = getCountryTPProfile(source);

  const treatyPairsList = [
    { from: 'US', to: 'UK', title: 'United States ↔ United Kingdom', region: 'Americas-Europe' },
    { from: 'IN', to: 'US', title: 'India ↔ United States', region: 'Asia-Americas' },
    { from: 'SG', to: 'AE', title: 'Singapore ↔ United Arab Emirates', region: 'Asia-Middle East' },
    { from: 'DE', to: 'US', title: 'Germany ↔ United States', region: 'Europe-Americas' },
    { from: 'IN', to: 'SG', title: 'India ↔ Singapore', region: 'Asia-Pacific' },
    { from: 'AU', to: 'US', title: 'Australia ↔ United States', region: 'Asia-Americas' },
    { from: 'CA', to: 'US', title: 'Canada ↔ United States', region: 'Americas' },
    { from: 'UK', to: 'IN', title: 'United Kingdom ↔ India', region: 'Europe-Asia' },
    { from: 'IN', to: 'AE', title: 'India ↔ United Arab Emirates', region: 'Asia-Middle East' },
    { from: 'DE', to: 'AU', title: 'Germany ↔ Australia', region: 'Europe-Asia' },
    { from: 'NL', to: 'US', title: 'Netherlands ↔ United States', region: 'Europe-Americas' },
    { from: 'ZA', to: 'UK', title: 'South Africa ↔ United Kingdom', region: 'Africa-Europe' }
  ];

  const regions = ['All', 'Americas', 'Europe', 'Asia-Pacific', 'Middle East', 'Africa'];

  const filteredCountries = GLOBAL_COUNTRIES.filter((c) => {
    const matchesRegion = selectedRegion === 'All' || c.region === selectedRegion;
    const matchesQuery = !searchQuery || 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesQuery;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-red-50 border border-red-200 text-red-700">
            <Globe2 className="w-3.5 h-3.5 text-red-600" />
            <span>Worldwide Tax Treaty &amp; Transfer Pricing Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Cross-Border Tax Laws for 36+ Countries
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Select any two countries to instantly compare bilateral treaty withholding rates, Service Permanent Establishment days, and governing Transfer Pricing legislation across the Americas, Europe, Asia-Pacific, Middle East, and Africa.
          </p>
        </div>

        {/* Quick Corridor Buttons */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
            Popular Global Trade Corridors:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {treatyPairsList.map((pair, idx) => {
              const isSelected = residence === pair.from && source === pair.to;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setResidence(pair.from);
                    setSource(pair.to);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-red-50 border-red-300 text-red-900 shadow-xs ring-1 ring-red-400'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900 line-clamp-1">{pair.title}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {pair.from} &harr; {pair.to}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Corridor Configurator */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Scale className="w-5 h-5 text-red-600" />
            <span>Active Corridor Comparison</span>
          </div>

          {/* Region filters */}
          <div className="flex gap-1 overflow-x-auto scrollbar-none pb-1">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer shrink-0 ${
                  selectedRegion === reg
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="text-xs text-slate-600 font-semibold block">
              1. Resident Country (Beneficiary / Invoicing State)
            </label>
            <select
              value={residence}
              onChange={(e) => setResidence(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 font-medium focus:border-red-500 focus:outline-none"
            >
              {filteredCountries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name} ({c.code}) - {c.currency}
                </option>
              ))}
            </select>
            <div className="text-[11px] text-slate-500">
              <strong>Transfer Pricing Law:</strong> {residentProfile.tpLawTitle}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="text-xs text-slate-600 font-semibold block">
              2. Source Country (Customer / Paying State)
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 font-medium focus:border-red-500 focus:outline-none"
            >
              {filteredCountries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name} ({c.code}) - {c.currency}
                </option>
              ))}
            </select>
            <div className="text-[11px] text-slate-500">
              <strong>Transfer Pricing Law:</strong> {sourceProfile.tpLawTitle}
            </div>
          </div>
        </div>

        {/* Rates Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Royalties Withholding</span>
            <div className="text-2xl font-mono font-bold text-red-600">{activeTreaty.royaltyTreatyRate}%</div>
            <div className="text-[11px] text-slate-600">Domestic Base: <span className="line-through text-slate-400">{activeTreaty.royaltyDomesticRate}%</span></div>
            <p className="text-[10px] text-slate-400 mt-2">Article 12 Treaty Cap</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Technical Services (FTS)</span>
            <div className="text-2xl font-mono font-bold text-red-600">{activeTreaty.ftsTreatyRate}%</div>
            <div className="text-[11px] text-slate-600">Domestic Base: <span className="line-through text-slate-400">{activeTreaty.ftsDomesticRate}%</span></div>
            <p className="text-[10px] text-slate-400 mt-2">
              {activeTreaty.hasMakeAvailableClause ? 'Exempt if no know-how passed!' : 'Treaty rate or Article 7'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Service PE Threshold</span>
            <div className="text-2xl font-mono font-bold text-amber-600">{activeTreaty.servicePeDaysThreshold} Days</div>
            <div className="text-[11px] text-slate-600">Personnel presence limit</div>
            <p className="text-[10px] text-slate-400 mt-2">Article 5 Physical Ceiling</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Make Available Clause</span>
            <div className={`text-2xl font-bold ${activeTreaty.hasMakeAvailableClause ? 'text-emerald-700' : 'text-slate-500'}`}>
              {activeTreaty.hasMakeAvailableClause ? 'Present' : 'Absent'}
            </div>
            <div className="text-[11px] text-slate-600">
              {activeTreaty.hasMakeAvailableClause ? 'Substantial protection for IT' : 'OECD standard rules'}
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Treaty Protocol condition</p>
          </div>
        </div>

        {/* Detailed Country Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{residentProfile.flag}</span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{residentProfile.countryName} Tax System</h4>
                <p className="text-[11px] text-slate-500">Corporate Tax: {residentProfile.citRate}% | Currency: {residentProfile.currency}</p>
              </div>
            </div>
            <div className="text-xs text-slate-700 space-y-1">
              <div><strong>Statute:</strong> {residentProfile.tpLawTitle}</div>
              <div><strong>Enforcing Authority:</strong> {residentProfile.governingAuthority}</div>
              <div><strong>Safe Harbour:</strong> {residentProfile.safeHarbourSummary}</div>
            </div>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{sourceProfile.flag}</span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{sourceProfile.countryName} Tax System</h4>
                <p className="text-[11px] text-slate-500">Corporate Tax: {sourceProfile.citRate}% | Currency: {sourceProfile.currency}</p>
              </div>
            </div>
            <div className="text-xs text-slate-700 space-y-1">
              <div><strong>Statute:</strong> {sourceProfile.tpLawTitle}</div>
              <div><strong>Enforcing Authority:</strong> {sourceProfile.governingAuthority}</div>
              <div><strong>Safe Harbour:</strong> {sourceProfile.safeHarbourSummary}</div>
            </div>
          </div>
        </div>

        {/* Protocol Notes */}
        <div className="p-5 bg-red-50/40 border border-red-100 rounded-xl space-y-3">
          <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-red-600" />
            <span>Corridor-Specific Rules &amp; Mandatory Conditions</span>
          </div>
          <div className="space-y-2">
            {activeTreaty.keyConditions.map((cond, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{cond}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
