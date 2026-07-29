import { useState } from 'react';
import { useMarketPlayers } from '../../hooks/useData';
import { useAppStore } from '../../store';

type PlayerFilter = 'all' | 'solar-led' | 'wind-led' | 'psu' | 'manufacturers';
type MfgTab = 'solar' | 'wind';

export default function MarketPlayers() {
  const filter = useAppStore((s) => s.filter);
  const { data } = useMarketPlayers() as { data: any };
  const [playerFilter, setPlayerFilter] = useState<PlayerFilter>('all');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [mfgTab, setMfgTab] = useState<MfgTab>('solar');

  if (!data) return <div className="text-center py-10">Loading...</div>;

  const filters: { label: string; value: PlayerFilter }[] = [
    { label: 'All IPPs', value: 'all' },
    { label: '☀️ Solar-Led', value: 'solar-led' },
    { label: '🌬️ Wind-Led', value: 'wind-led' },
    { label: '🏛️ PSU', value: 'psu' },
    { label: '🏭 Manufacturers', value: 'manufacturers' },
  ];

  let players = data.players.filter((p: any) => {
    if (filter === 'solar' && p.solar === 0) return false;
    if (filter === 'wind' && p.wind === 0) return false;
    if (playerFilter === 'solar-led') return p.solar > p.wind;
    if (playerFilter === 'wind-led') return p.wind > p.solar;
    if (playerFilter === 'psu') return p.ownership.includes('PSU');
    return true;
  });

  if (playerFilter === 'manufacturers') {
    return (
      <div className="space-y-6">
        {/* National Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-[#005B75]">
          <h3 className="font-bold text-[#005B75]">National RE Summary (MNRE, {data.nationalSummary.asOf})</h3>
          <div className="flex gap-6 mt-2 text-sm flex-wrap">
            <span>☀️ Solar: <strong>{(data.nationalSummary.solarInstalled / 1000).toFixed(0)} GW</strong></span>
            <span>🌬️ Wind: <strong>{(data.nationalSummary.windInstalled / 1000).toFixed(1)} GW</strong></span>
            <span>⚡ Total RE: <strong>{(data.nationalSummary.totalRE / 1000).toFixed(1)} GW</strong></span>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setPlayerFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                playerFilter === f.value
                  ? 'bg-[#005B75] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Manufacturers Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#005B75] mb-4">🏭 Manufacturers — Solar & Wind Equipment</h2>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMfgTab('solar')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                mfgTab === 'solar' ? 'bg-[#F99D27] text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              ☀️ Solar Module Makers ({data.manufacturers.solar.length})
            </button>
            <button
              onClick={() => setMfgTab('wind')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                mfgTab === 'wind' ? 'bg-[#007A9E] text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              🌬️ Wind Turbine OEMs ({data.manufacturers.wind.length})
            </button>
          </div>

          <div className="space-y-3">
            {(mfgTab === 'solar' ? data.manufacturers.solar : data.manufacturers.wind).map((m: any, i: number) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4 card-hover">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-[#005B75]">{m.name}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        m.listed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {m.listed ? '📈 Listed' : '🔒 Private'}
                      </span>
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{m.type}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1"><strong>Capacity:</strong> {m.capacity}</p>
                    <p className="text-sm text-gray-600"><strong>Tech:</strong> {m.technology}</p>
                    <p className="text-xs text-gray-500 mt-1 italic">{m.note}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* National Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-[#005B75]">
        <h3 className="font-bold text-[#005B75]">National RE Summary (MNRE, {data.nationalSummary.asOf})</h3>
        <div className="flex gap-6 mt-2 text-sm flex-wrap">
          <span>☀️ Solar: <strong>{(data.nationalSummary.solarInstalled / 1000).toFixed(0)} GW</strong></span>
          <span>🌬️ Wind: <strong>{(data.nationalSummary.windInstalled / 1000).toFixed(1)} GW</strong></span>
          <span>⚡ Total RE: <strong>{(data.nationalSummary.totalRE / 1000).toFixed(1)} GW</strong></span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setPlayerFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              playerFilter === f.value
                ? 'bg-[#005B75] text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Players Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F0F9FF]">
              <tr>
                <th className="text-left py-3 px-4 text-gray-500 font-semibold">#</th>
                <th className="text-left py-3 px-4 text-gray-500 font-semibold">Company</th>
                <th className="text-right py-3 px-4 text-gray-500 font-semibold">Total RE (MW)</th>
                <th className="text-right py-3 px-4 text-gray-500 font-semibold">Solar (MW)</th>
                <th className="text-right py-3 px-4 text-gray-500 font-semibold">Wind (MW)</th>
                <th className="text-right py-3 px-4 text-gray-500 font-semibold">Share %</th>
                <th className="text-center py-3 px-4 text-gray-500 font-semibold">Type</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p: any, i: number) => (
                <tr key={p.rank} className="border-b border-gray-50">
                  <td colSpan={7} className="p-0">
                    <div
                      className="flex items-center hover:bg-[#F0F9FF] cursor-pointer transition px-4 py-3"
                      onClick={() => setExpanded(expanded === p.rank ? null : p.rank)}
                    >
                      <span className="w-8 font-semibold text-[#005B75]">{i + 1}</span>
                      <span className="flex-1">
                        <span className="font-semibold">{p.name}</span>
                        <span className="text-xs text-gray-400 ml-2">{p.listed ? '📈' : '🔒'}</span>
                      </span>
                      <span className="w-24 text-right font-bold">{p.totalRE.toLocaleString()}</span>
                      <span className="w-24 text-right text-[#F99D27] font-semibold">{p.solar.toLocaleString()}</span>
                      <span className="w-24 text-right text-[#007A9E] font-semibold">{p.wind.toLocaleString()}</span>
                      <span className="w-16 text-right">{p.share}%</span>
                      <span className="w-28 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          p.ownership.includes('PSU') ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {p.ownership}
                        </span>
                      </span>
                    </div>
                    {expanded === p.rank && (
                      <div className="bg-[#F0F9FF] px-6 py-4 animate-fadeIn border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs">2030 Target</p>
                            <p className="font-bold text-[#005B75]">{p.target2030.toLocaleString()} MW</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Recent Project</p>
                            <p className="font-medium">{p.recentProject}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Capacity Mix</p>
                            <div className="flex gap-1 mt-1 h-3 rounded overflow-hidden">
                              {p.solar > 0 && <div className="bg-[#F99D27]" style={{ width: `${(p.solar / p.totalRE) * 100}%` }} title={`Solar ${p.solar} MW`} />}
                              {p.wind > 0 && <div className="bg-[#007A9E]" style={{ width: `${(p.wind / p.totalRE) * 100}%` }} title={`Wind ${p.wind} MW`} />}
                            </div>
                            <div className="flex gap-2 mt-1 text-xs">
                              <span className="text-[#F99D27]">☀️ {Math.round((p.solar/p.totalRE)*100)}%</span>
                              <span className="text-[#007A9E]">🌬️ {Math.round((p.wind/p.totalRE)*100)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-4 py-2 text-xs text-gray-400 text-right">
          Showing {players.length} companies • Click to expand
        </div>
      </div>
    </div>
  );
}
