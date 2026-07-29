import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '../../store';

function useCaseStudies() {
  return useQuery({ queryKey: ['caseStudies'], queryFn: async () => {
    const res = await fetch('/data/risks/case-studies.json');
    return res.json();
  }});
}

export default function CaseStudies() {
  const filter = useAppStore((s) => s.filter);
  const { data } = useCaseStudies() as { data: any };
  const [expanded, setExpanded] = useState<number | null>(null);
  const [sourceFilter, setSourceFilter] = useState<'all' | 'Solar' | 'Wind'>('all');

  if (!data) return <div className="text-center py-10">Loading...</div>;

  let cases = data.caseStudies.filter((c: any) => {
    if (filter === 'solar' && c.source !== 'Solar') return false;
    if (filter === 'wind' && c.source !== 'Wind') return false;
    if (sourceFilter !== 'all' && c.source !== sourceFilter) return false;
    return true;
  });

  const totalLoss = cases.reduce((acc: number, c: any) => acc + c.loss, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-[#005B75]">
        <h2 className="text-xl font-bold text-[#005B75]">📋 Case Studies — Solar & Wind Claims</h2>
        <p className="text-sm text-gray-600 mt-1">
          Detailed analysis of major insurance claims in India's renewable energy sector. 
          Each case includes root cause, insurance lessons, and industry impact.
        </p>
        <div className="flex gap-4 mt-3 text-sm">
          <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full font-semibold">
            💰 Total Losses: ₹{totalLoss} Cr ({cases.length} cases)
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'Solar', 'Wind'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setSourceFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              sourceFilter === f
                ? 'bg-[#005B75] text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? '⚡ All' : f === 'Solar' ? '☀️ Solar' : '🌬️ Wind'}
          </button>
        ))}
      </div>

      {/* Case Study Cards */}
      <div className="space-y-4">
        {cases.map((c: any) => {
          const isExpanded = expanded === c.id;
          return (
            <div key={c.id} className="bg-white rounded-xl shadow-sm overflow-hidden card-hover">
              {/* Summary Header */}
              <div
                className="p-5 cursor-pointer hover:bg-[#F0F9FF] transition"
                onClick={() => setExpanded(isExpanded ? null : c.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        c.source === 'Solar' ? 'bg-orange-100 text-orange-700' : 'bg-cyan-100 text-cyan-700'
                      }`}>
                        {c.source === 'Solar' ? '☀️' : '🌬️'} {c.source}
                      </span>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                        ₹{c.loss} Cr
                      </span>
                      <span className="text-xs text-gray-400">{c.date}</span>
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{c.claimType}</span>
                    </div>
                    <h3 className="font-bold text-[#005B75] text-lg leading-tight">{c.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">📍 {c.location}</p>
                    <p className="text-sm text-gray-600 mt-2">{c.summary}</p>
                  </div>
                  <div className="text-2xl text-gray-300">
                    {isExpanded ? '▼' : '▶'}
                  </div>
                </div>
              </div>

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="border-t border-gray-100 animate-fadeIn">
                  {/* Detailed Description */}
                  <div className="p-5 bg-[#F0F9FF]">
                    <h4 className="font-bold text-sm text-[#005B75] mb-2">📖 Full Details</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{c.details}</p>
                  </div>

                  {/* Root Cause */}
                  <div className="p-5 border-t border-gray-100">
                    <h4 className="font-bold text-sm text-red-600 mb-2">🔍 Root Cause Analysis</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{c.rootCause}</p>
                  </div>

                  {/* Insurance Lessons */}
                  <div className="p-5 bg-yellow-50 border-t border-gray-100">
                    <h4 className="font-bold text-sm text-yellow-700 mb-2">⚖️ Insurance & Claims Lessons</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{c.insuranceLessons}</p>
                  </div>

                  {/* Mitigation */}
                  <div className="p-5 border-t border-gray-100">
                    <h4 className="font-bold text-sm text-green-700 mb-2">🛡️ Mitigation Measures Adopted</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{c.mitigation}</p>
                  </div>

                  {/* Industry Impact */}
                  <div className="p-5 bg-blue-50 border-t border-gray-100">
                    <h4 className="font-bold text-sm text-blue-700 mb-2">🌐 Industry Impact</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{c.industry_impact}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {cases.length === 0 && (
        <div className="text-center py-10 text-gray-400">No case studies match the current filter.</div>
      )}
    </div>
  );
}
