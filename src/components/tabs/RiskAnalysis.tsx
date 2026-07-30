import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSolarRisks, useWindRisks } from '../../hooks/useData';
import { useAppStore } from '../../store';

const SUB_TABS = ['Insurable Risks', 'Risk Framework', 'Emerging Tech', 'Best Practices', 'Case Studies'];

function RiskBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    Low: 'bg-green-100 text-green-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    High: 'bg-orange-100 text-orange-700',
    'Very High': 'bg-red-100 text-red-700',
    Critical: 'bg-red-200 text-red-800',
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[level] || 'bg-gray-100 text-gray-600'}`}>{level}</span>;
}

export default function RiskAnalysis() {
  const filter = useAppStore((s) => s.filter);
  const { data: solarRisks } = useSolarRisks() as { data: any };
  const { data: windRisks } = useWindRisks() as { data: any };
  const { data: caseData } = useQuery({ queryKey: ['caseStudies'], queryFn: async () => { const r = await fetch(`${import.meta.env.BASE_URL}data/risks/case-studies.json`); return r.json(); } }) as { data: any };
  const [subTab, setSubTab] = useState(0);
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);

  if (!solarRisks || !windRisks) return <div className="text-center py-10">Loading...</div>;

  const renderInsurableRisks = () => {
    const showSolar = filter === 'solar' || filter === 'all';
    const showWind = filter === 'wind' || filter === 'all';

    const allRisks = [
      ...(showSolar ? [...solarRisks.insurableRisks.aogPerils, ...solarRisks.insurableRisks.nonAogPerils].map((r: any) => ({ ...r, source: 'Solar' })) : []),
      ...(showWind ? [...windRisks.insurableRisks.aogPerils, ...windRisks.insurableRisks.nonAogPerils].map((r: any) => ({ ...r, source: 'Wind' })) : []),
    ];

    return (
      <div className="space-y-4">
        <h3 className="font-bold text-[#005B75]">AOG & Non-AOG Perils — Insurable Risk Register</h3>
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
          <table className="w-full text-sm table-fixed">
            <thead className="bg-[#F0F9FF]">
              <tr>
                <th className="text-left py-3 px-3 text-gray-500 w-[60px]">ID</th>
                <th className="text-left py-3 px-3 text-gray-500 w-[140px]">Peril</th>
                <th className="text-left py-3 px-3 text-gray-500 w-[70px]">Source</th>
                <th className="text-center py-3 px-3 text-gray-500 w-[100px]">Probability</th>
                <th className="text-center py-3 px-3 text-gray-500 w-[100px]">Impact</th>
                <th className="text-right py-3 px-3 text-gray-500 w-[90px]">EMV (₹ Cr)</th>
                <th className="text-left py-3 px-3 text-gray-500">Mitigation</th>
              </tr>
            </thead>
            <tbody>
              {allRisks.map((r: any) => (
                <>
                  <tr
                    key={r.id}
                    className="border-b border-gray-50 hover:bg-[#F0F9FF] cursor-pointer transition"
                    onClick={() => setExpandedRisk(expandedRisk === r.id ? null : r.id)}
                  >
                    <td className="py-2.5 px-3 font-mono text-xs text-gray-500">{r.id}</td>
                    <td className="py-2.5 px-3 font-semibold">{r.peril}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-xs font-semibold ${r.source === 'Solar' ? 'text-[#F99D27]' : 'text-[#007A9E]'}`}>
                        {r.source === 'Solar' ? '☀️' : '🌬️'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center"><RiskBadge level={r.probability} /></td>
                    <td className="py-2.5 px-3 text-center"><RiskBadge level={r.impact} /></td>
                    <td className="py-2.5 px-3 text-right font-bold text-red-600">₹{r.emv}</td>
                    <td className="py-2.5 px-3 text-xs text-gray-600 truncate">{r.mitigation}</td>
                  </tr>
                  {expandedRisk === r.id && (
                    <tr key={`exp-${r.id}`}>
                      <td colSpan={7} className="bg-blue-50 px-6 py-4 text-sm text-gray-700 animate-fadeIn border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-semibold text-[#005B75] text-xs mb-1">Risk Details</p>
                            <p>{r.details}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-green-700 text-xs mb-1">Mitigation Strategy</p>
                            <p>{r.mitigation}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400">Click any risk to expand details. EMV = Expected Monetary Value of loss.</p>
      </div>
    );
  };

  const renderRiskFramework = () => {
    const showSolar = filter === 'solar' || filter === 'all';
    const showWind = filter === 'wind' || filter === 'all';

    const allRisks = [
      ...(showSolar ? [...solarRisks.insurableRisks.aogPerils, ...solarRisks.insurableRisks.nonAogPerils].map((r: any) => ({ ...r, source: 'Solar' })) : []),
      ...(showWind ? [...windRisks.insurableRisks.aogPerils, ...windRisks.insurableRisks.nonAogPerils].map((r: any) => ({ ...r, source: 'Wind' })) : []),
    ];

    const probRank: Record<string, number> = { Low: 1, Medium: 2, High: 3, 'Very High': 4 };
    const impactRank: Record<string, number> = { Low: 1, Medium: 2, High: 3, 'Very High': 4 };

    const matrix = [
      { prob: 'Very High', level: 4 },
      { prob: 'High', level: 3 },
      { prob: 'Medium', level: 2 },
      { prob: 'Low', level: 1 },
    ];

    const getMatrixColor = (score: number) => {
      if (score >= 12) return 'bg-red-600 text-white';
      if (score >= 8) return 'bg-red-400 text-white';
      if (score >= 6) return 'bg-orange-400 text-white';
      if (score >= 4) return 'bg-yellow-400 text-black';
      if (score >= 2) return 'bg-yellow-200 text-black';
      return 'bg-green-200 text-black';
    };

    const getRisksInCell = (probLevel: number, impLevel: number) => {
      return allRisks.filter((r: any) => probRank[r.probability] === probLevel && impactRank[r.impact] === impLevel);
    };

    const riskOwners = [
      { role: 'Project Developer / IPP', responsibilities: 'O&M standards, asset integrity, preventive maintenance, risk surveys', riskTypes: 'All operational risks' },
      { role: 'EPC Contractor', responsibilities: 'Design adequacy, construction quality, defects liability', riskTypes: 'Construction phase, latent defects' },
      { role: 'OEM / Manufacturer', responsibilities: 'Equipment warranty, serial defect, performance guarantee', riskTypes: 'Equipment failure, design defects' },
      { role: 'Insurance Broker', responsibilities: 'Policy design, coverage adequacy, claims advocacy', riskTypes: 'Transfer of residual risk' },
      { role: 'O&M Contractor', responsibilities: 'Preventive/corrective maintenance, CMS monitoring, spare management', riskTypes: 'Availability, response time' },
      { role: 'Grid Operator (SLDC)', responsibilities: 'Grid stability, curtailment management, evacuation infra', riskTypes: 'Grid-related losses' },
    ];

    const insuranceProducts = [
      { product: 'CAR / EAR', phase: 'Construction', covers: 'All risks during construction, testing, commissioning', applicability: 'Both Solar & Wind' },
      { product: 'Material Damage (MD)', phase: 'Operations', covers: 'Physical loss/damage from all perils (fire, flood, cyclone, machinery breakdown)', applicability: 'Both Solar & Wind' },
      { product: 'MLOP / ALOP', phase: 'Operations', covers: 'Loss of revenue due to insured damage (after waiting period)', applicability: 'Both Solar & Wind' },
      { product: 'Marine Cargo', phase: 'Transit', covers: 'Damage during transport of modules, turbines, transformers', applicability: 'Both Solar & Wind' },
      { product: 'General Liability', phase: 'Operations', covers: 'Third-party bodily injury, property damage', applicability: 'Both (esp. Wind — blade throw)' },
      { product: 'BESS Fire Cover', phase: 'Operations', covers: 'Thermal runaway, battery fire, cascade failure', applicability: 'Solar + Storage' },
      { product: 'Marine Cover (Offshore)', phase: 'Construction + Ops', covers: 'Offshore installation, subsea cables, marine perils', applicability: 'Offshore Wind' },
      { product: 'Professional Indemnity', phase: 'Design', covers: 'Errors in engineering design, structural assessment', applicability: 'Both Solar & Wind' },
      { product: 'Warranty Gap (WGBI)', phase: 'Operations', covers: 'Gap between manufacturer warranty failure and insurance', applicability: 'Solar (module degradation)' },
      { product: 'Cyber Insurance', phase: 'Operations', covers: 'SCADA breach, digital twin manipulation, ransomware', applicability: 'Both Solar & Wind' },
    ];

    const strategies = [
      { strategy: 'Avoid', description: 'Eliminate the risk by not undertaking the activity', example: 'Not building in cyclone Zone V', color: 'bg-red-100 text-red-700' },
      { strategy: 'Mitigate', description: 'Reduce probability or impact through controls', example: 'CMS monitoring, hail-resistant modules, LPS upgrades', color: 'bg-orange-100 text-orange-700' },
      { strategy: 'Transfer', description: 'Shift financial impact to another party', example: 'Insurance, OEM warranty, indemnity clauses in EPC contracts', color: 'bg-blue-100 text-blue-700' },
      { strategy: 'Accept', description: 'Retain the risk within risk appetite', example: 'Low-probability events within deductible threshold', color: 'bg-green-100 text-green-700' },
    ];

    return (
      <div className="space-y-6">
        <h3 className="font-bold text-[#005B75] text-lg">ISO 31000 Risk Management Framework</h3>
        <p className="text-sm text-gray-600">Comprehensive risk assessment following ISO 31000:2018 principles — Identify, Analyze, Evaluate, Treat.</p>

        {/* Probability × Impact Matrix */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h4 className="font-bold text-[#005B75] mb-4">Probability × Impact Matrix</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center border-collapse">
              <thead>
                <tr>
                  <th className="py-2 px-2 text-gray-500 border border-gray-200">Probability ↓ / Impact →</th>
                  <th className="py-2 px-2 border border-gray-200">Low (1)</th>
                  <th className="py-2 px-2 border border-gray-200">Medium (2)</th>
                  <th className="py-2 px-2 border border-gray-200">High (3)</th>
                  <th className="py-2 px-2 border border-gray-200">Very High (4)</th>
                </tr>
              </thead>
              <tbody>
                {matrix.map((row) => (
                  <tr key={row.prob}>
                    <td className="py-2 px-2 font-semibold text-gray-600 border border-gray-200">{row.prob} ({row.level})</td>
                    {[1, 2, 3, 4].map((imp) => {
                      const score = row.level * imp;
                      const risksHere = getRisksInCell(row.level, imp);
                      return (
                        <td key={imp} className="py-2 px-2 border border-gray-200">
                          <div className={`rounded p-2 min-h-[60px] ${getMatrixColor(score)}`}>
                            <div className="text-xs font-bold">{score}</div>
                            {risksHere.length > 0 && (
                              <div className="mt-1 space-y-0.5">
                                {risksHere.slice(0, 3).map((r: any) => (
                                  <div key={r.id} className="text-[10px] leading-tight opacity-90">
                                    {r.source === 'Solar' ? '☀️' : '🌬️'} {r.peril}
                                  </div>
                                ))}
                                {risksHere.length > 3 && <div className="text-[10px]">+{risksHere.length - 3} more</div>}
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-2 mt-3 text-xs flex-wrap">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-600" /> Critical (12-16)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-400" /> High (6-9)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-400" /> Medium (4)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-200" /> Low (1-3)</span>
          </div>
        </div>

        {/* EMV Table with Risk Owners */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h4 className="font-bold text-[#005B75] mb-4">EMV Summary & Risk Owners</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F0F9FF]">
                <tr>
                  <th className="text-left py-2 px-3 text-gray-500">Risk</th>
                  <th className="text-left py-2 px-3 text-gray-500">Source</th>
                  <th className="text-center py-2 px-3 text-gray-500">Score</th>
                  <th className="text-right py-2 px-3 text-gray-500">EMV (₹ Cr)</th>
                  <th className="text-left py-2 px-3 text-gray-500">Strategy</th>
                  <th className="text-left py-2 px-3 text-gray-500">Risk Owner</th>
                </tr>
              </thead>
              <tbody>
                {allRisks
                  .sort((a: any, b: any) => b.emv - a.emv)
                  .map((r: any) => {
                    const score = (probRank[r.probability] || 1) * (impactRank[r.impact] || 1);
                    return (
                      <tr key={r.id} className="border-b border-gray-50 hover:bg-[#F0F9FF]">
                        <td className="py-2 px-3 font-semibold">{r.peril}</td>
                        <td className="py-2 px-3">
                          <span className={r.source === 'Solar' ? 'text-[#F99D27]' : 'text-[#007A9E]'}>
                            {r.source === 'Solar' ? '☀️' : '🌬️'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${getMatrixColor(score)}`}>{score}</span>
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-red-600">₹{r.emv}</td>
                        <td className="py-2 px-3 text-xs">
                          {score >= 8 ? '🔄 Transfer + Mitigate' : score >= 4 ? '🛡️ Mitigate' : '✅ Accept'}
                        </td>
                        <td className="py-2 px-3 text-xs text-gray-500">
                          {r.peril.includes('Gearbox') || r.peril.includes('Blade') || r.peril.includes('Inverter') ? 'O&M + OEM' : 'IPP + Insurer'}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Risk Treatment Strategies */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h4 className="font-bold text-[#005B75] mb-4">Risk Treatment Strategies (ISO 31000)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {strategies.map((s) => (
              <div key={s.strategy} className={`rounded-lg p-4 ${s.color}`}>
                <p className="font-bold text-sm">{s.strategy}</p>
                <p className="text-xs mt-1">{s.description}</p>
                <p className="text-xs mt-1 italic">Example: {s.example}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Insurance Products */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h4 className="font-bold text-[#005B75] mb-4">Insurance Products for RE Sector</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F0F9FF]">
                <tr>
                  <th className="text-left py-2 px-3 text-gray-500">Product</th>
                  <th className="text-left py-2 px-3 text-gray-500">Phase</th>
                  <th className="text-left py-2 px-3 text-gray-500">Coverage</th>
                  <th className="text-left py-2 px-3 text-gray-500">Applicability</th>
                </tr>
              </thead>
              <tbody>
                {insuranceProducts.map((p, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-[#F0F9FF]">
                    <td className="py-2 px-3 font-semibold text-[#005B75]">{p.product}</td>
                    <td className="py-2 px-3 text-xs">{p.phase}</td>
                    <td className="py-2 px-3 text-xs text-gray-600">{p.covers}</td>
                    <td className="py-2 px-3 text-xs">{p.applicability}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Risk Owners */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h4 className="font-bold text-[#005B75] mb-4">Risk Ownership Matrix</h4>
          <div className="space-y-3">
            {riskOwners.map((o, i) => (
              <div key={i} className="bg-[#F0F9FF] rounded-lg p-4">
                <p className="font-bold text-sm text-[#005B75]">{o.role}</p>
                <p className="text-xs text-gray-600 mt-1"><strong>Responsibilities:</strong> {o.responsibilities}</p>
                <p className="text-xs text-gray-500"><strong>Risk Types:</strong> {o.riskTypes}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderEmerging = () => {
    const showSolar = filter === 'solar' || filter === 'all';
    const showWind = filter === 'wind' || filter === 'all';
    const risks = [
      ...(showSolar ? solarRisks.emergingRisks.map((r: any) => ({ ...r, source: 'Solar' })) : []),
      ...(showWind ? windRisks.emergingRisks.map((r: any) => ({ ...r, source: 'Wind' })) : []),
    ];

    return (
      <div className="space-y-4">
        <h3 className="font-bold text-[#005B75]">Emerging Technology & New Risks</h3>
        <p className="text-sm text-gray-600">Risks arising from new technologies, operational models, and changing climate patterns.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {risks.map((r: any, i: number) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm card-hover border-l-4" style={{ borderLeftColor: r.source === 'Solar' ? '#F99D27' : '#007A9E' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-gray-400">{r.source === 'Solar' ? '☀️' : '🌬️'} {r.category}</span>
                <RiskBadge level={r.severity} />
              </div>
              <p className="font-bold text-[#005B75]">{r.risk}</p>
              <p className="text-sm text-gray-600 mt-1">{r.description}</p>
              <p className="text-xs text-[#007A9E] mt-2 font-semibold">🛡️ Insurance: {r.insurance}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBestPractices = () => {
    const showSolar = filter === 'solar' || filter === 'all';
    const showWind = filter === 'wind' || filter === 'all';

    return (
      <div className="space-y-6">
        {showSolar && (
          <div>
            <h3 className="font-bold text-[#F99D27] mb-3">☀️ Solar Best Practices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {solarRisks.bestPractices.map((p: any, i: number) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-[#F99D27]">
                  <p className="font-semibold text-sm text-[#005B75]">{p.practice}</p>
                  <p className="text-xs text-gray-500 mt-1">📅 Frequency: {p.frequency}</p>
                  <p className="text-xs text-gray-600 mt-1">✅ {p.benefit}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {showWind && (
          <div>
            <h3 className="font-bold text-[#007A9E] mb-3">🌬️ Wind Best Practices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {windRisks.bestPractices.map((p: any, i: number) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-[#007A9E]">
                  <p className="font-semibold text-sm text-[#005B75]">{p.practice}</p>
                  <p className="text-xs text-gray-500 mt-1">📅 Frequency: {p.frequency}</p>
                  <p className="text-xs text-gray-600 mt-1">✅ {p.benefit}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCaseStudies = () => {
    if (!caseData) return <div className="text-center py-10">Loading case studies...</div>;
    const showSolar = filter === 'solar' || filter === 'all';
    const showWind = filter === 'wind' || filter === 'all';
    const cases = caseData.caseStudies.filter((c: any) => {
      if (!showSolar && c.source === 'Solar') return false;
      if (!showWind && c.source === 'Wind') return false;
      return true;
    }).sort((a: any, b: any) => {
      const dateA = new Date(a.date.replace(/(\w+)\s(\d{4})/, '1 $1 $2')).getTime();
      const dateB = new Date(b.date.replace(/(\w+)\s(\d{4})/, '1 $1 $2')).getTime();
      return dateB - dateA;
    });

    return (
      <div className="space-y-4">
        <h3 className="font-bold text-[#005B75] text-lg">📋 Case Studies — Major Claims & Learnings</h3>
        <p className="text-sm text-gray-600">Real-world claims from India's RE sector with root cause analysis and industry impact.</p>
        <div className="space-y-3">
          {cases.map((c: any) => {
            const isExp = expandedRisk === `case-${c.id}`;
            return (
              <div key={c.id} className="bg-white rounded-xl shadow-sm overflow-hidden card-hover">
                <div
                  className="p-4 cursor-pointer hover:bg-[#F0F9FF] transition"
                  onClick={() => setExpandedRisk(isExp ? null : `case-${c.id}`)}
                >
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.source === 'Solar' ? 'bg-orange-100 text-orange-700' : 'bg-cyan-100 text-cyan-700'}`}>
                      {c.source === 'Solar' ? '☀️' : '🌬️'} {c.source}
                    </span>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">₹{c.loss} Cr</span>
                    <span className="text-xs text-gray-400">{c.date} • {c.location}</span>
                  </div>
                  <p className="font-bold text-[#005B75]">{c.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{c.summary}</p>
                </div>
                {isExp && (
                  <div className="border-t border-gray-100 animate-fadeIn">
                    <div className="p-4 bg-[#F0F9FF] text-sm"><strong className="text-[#005B75]">Details:</strong> {c.details}</div>
                    <div className="p-4 border-t text-sm"><strong className="text-red-600">Root Cause:</strong> {c.rootCause}</div>
                    <div className="p-4 bg-yellow-50 border-t text-sm"><strong className="text-yellow-700">Insurance Lessons:</strong> {c.insuranceLessons}</div>
                    <div className="p-4 border-t text-sm"><strong className="text-green-700">Mitigation:</strong> {c.mitigation}</div>
                    <div className="p-4 bg-blue-50 border-t text-sm"><strong className="text-blue-700">Industry Impact:</strong> {c.industry_impact}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex gap-2 flex-wrap bg-white rounded-xl p-2 shadow-sm">
        {SUB_TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setSubTab(i)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              subTab === i ? 'bg-[#005B75] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {subTab === 0 && renderInsurableRisks()}
      {subTab === 1 && renderRiskFramework()}
      {subTab === 2 && renderEmerging()}
      {subTab === 3 && renderBestPractices()}
      {subTab === 4 && renderCaseStudies()}
    </div>
  );
}
