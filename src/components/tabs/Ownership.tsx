import { useState } from 'react';
import { useMarketPlayers } from '../../hooks/useData';
import { useAppStore } from '../../store';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const OWNERSHIP_DATA = {
  solar: { private: 79, psu: 21 },
  wind: { private: 91, psu: 9 },
};

const CATEGORIES = [
  { key: 'central', label: 'Central PSU', emoji: '🏛️', color: '#005B75', filter: 'PSU-Central' },
  { key: 'state', label: 'State PSU', emoji: '🏢', color: '#007A9E', filter: 'PSU-State' },
  { key: 'private', label: 'Private Sector', emoji: '🏭', color: '#F99D27', filter: 'Private' },
];

export default function Ownership() {
  const filter = useAppStore((s) => s.filter);
  const { data } = useMarketPlayers() as { data: any };
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!data) return <div className="text-center py-10">Loading...</div>;

  const solarPie = [
    { name: 'Private', value: OWNERSHIP_DATA.solar.private },
    { name: 'PSU', value: OWNERSHIP_DATA.solar.psu },
  ];
  const windPie = [
    { name: 'Private', value: OWNERSHIP_DATA.wind.private },
    { name: 'PSU', value: OWNERSHIP_DATA.wind.psu },
  ];

  const getCompanies = (type: string) => {
    return data.players.filter((p: any) => {
      if (type === 'Private') return p.ownership === 'Private' || p.ownership === 'Private-Foreign';
      if (type === 'PSU-Central') return p.ownership === 'PSU-Central';
      return p.ownership === 'PSU-State';
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-[#F99D27]">
        <p className="text-lg font-bold text-[#005B75]">Key Insight</p>
        <p className="text-sm text-gray-600 mt-1">
          Private sector drives 85%+ of all RE capacity additions. PSU participation is growing 
          (led by NTPC REL, SJVN, NHPC) but remains minority in installed base.
        </p>
      </div>

      {/* Ownership Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(filter === 'solar' || filter === 'all') && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg text-[#F99D27] mb-2">☀️ Solar Ownership</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={solarPie} dataKey="value" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name} ${value}%`}>
                  <Cell fill="#F99D27" />
                  <Cell fill="#005B75" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2 text-sm">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#F99D27]" /> Private {OWNERSHIP_DATA.solar.private}%</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#005B75]" /> PSU {OWNERSHIP_DATA.solar.psu}%</span>
            </div>
          </div>
        )}
        {(filter === 'wind' || filter === 'all') && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg text-[#007A9E] mb-2">🌬️ Wind Ownership</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={windPie} dataKey="value" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name} ${value}%`}>
                  <Cell fill="#007A9E" />
                  <Cell fill="#005B75" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2 text-sm">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#007A9E]" /> Private {OWNERSHIP_DATA.wind.private}%</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#005B75]" /> PSU {OWNERSHIP_DATA.wind.psu}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Ownership Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => {
          const companies = getCompanies(cat.filter);
          const isExpanded = expanded === cat.key;
          return (
            <div
              key={cat.key}
              className="bg-white rounded-xl p-5 shadow-sm card-hover cursor-pointer transition"
              onClick={() => setExpanded(isExpanded ? null : cat.key)}
            >
              <div className="text-3xl mb-2">{cat.emoji}</div>
              <p className="font-bold text-lg" style={{ color: cat.color }}>{cat.label}</p>
              <p className="text-sm text-gray-500">{companies.length} companies</p>
              <p className="text-xs text-gray-400 mt-1">Click to expand</p>
              {isExpanded && (
                <div className="mt-4 pt-3 border-t border-gray-100 animate-fadeIn">
                  {companies.map((c: any) => (
                    <div key={c.rank} className="flex justify-between items-center py-1 text-sm">
                      <span>{c.name}</span>
                      <span className="font-semibold">{c.totalRE.toLocaleString()} MW</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Proportional Bars */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-[#005B75] mb-4">Installed Capacity Share by Ownership</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-1">☀️ Solar</p>
            <div className="h-8 flex rounded-lg overflow-hidden">
              <div className="bg-[#F99D27] flex items-center justify-center text-white text-xs font-bold" style={{ width: '79%' }}>Private 79%</div>
              <div className="bg-[#005B75] flex items-center justify-center text-white text-xs font-bold" style={{ width: '21%' }}>PSU 21%</div>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-1">🌬️ Wind</p>
            <div className="h-8 flex rounded-lg overflow-hidden">
              <div className="bg-[#007A9E] flex items-center justify-center text-white text-xs font-bold" style={{ width: '91%' }}>Private 91%</div>
              <div className="bg-[#005B75] flex items-center justify-center text-white text-xs font-bold" style={{ width: '9%' }}>PSU 9%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
