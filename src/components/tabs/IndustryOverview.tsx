import { useAppStore } from '../../store';
import { useSolarData, useWindData, useHistoricalData } from '../../hooks/useData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm card-hover border-t-4" style={{ borderTopColor: color }}>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold mt-1" style={{ color }}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}

export default function IndustryOverview() {
  const filter = useAppStore((s) => s.filter);
  const { data: solar } = useSolarData() as { data: any };
  const { data: wind } = useWindData() as { data: any };
  const { data: historical } = useHistoricalData() as { data: any };

  if (!solar || !wind || !historical) return <div className="text-center py-10">Loading...</div>;

  const totalCapacity = filter === 'solar' ? solar.totalCapacity : filter === 'wind' ? wind.totalCapacity : solar.totalCapacity + wind.totalCapacity;
  const totalGen = filter === 'solar' ? solar.generation.value : filter === 'wind' ? wind.generation.value : solar.generation.value + wind.generation.value;
  const avgCuf = filter === 'solar' ? solar.cuf : filter === 'wind' ? wind.cuf : ((solar.cuf + wind.cuf) / 2).toFixed(1);

  const solarShare = ((solar.totalCapacity / (solar.totalCapacity + wind.totalCapacity)) * 100).toFixed(1);
  const windShare = (100 - parseFloat(solarShare)).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total RE Capacity" value={`${(totalCapacity / 1000).toFixed(1)} GW`} sub={filter === 'all' ? 'Solar + Wind' : filter} color="#005B75" />
        <StatCard label="Annual Generation" value={`${totalGen.toFixed(1)} BU`} sub="FY2025" color="#F99D27" />
        <StatCard label="Avg. CUF" value={`${avgCuf}%`} sub="Capacity Utilization" color="#007A9E" />
        <StatCard label="YoY Growth" value="18.5%" sub="Capacity Addition FY25" color="#10B981" />
      </div>

      {/* Solar vs Wind Split */}
      {filter === 'all' && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg text-[#005B75] mb-4">Solar vs Wind — Capacity Share</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>☀️ Solar ({solarShare}%)</span>
                <span>{(solar.totalCapacity / 1000).toFixed(1)} GW</span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#F99D27] rounded-full transition-all" style={{ width: `${solarShare}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>🌬️ Wind ({windShare}%)</span>
                <span>{(wind.totalCapacity / 1000).toFixed(1)} GW</span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#007A9E] rounded-full transition-all" style={{ width: `${windShare}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Growth Timeline */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-[#005B75] mb-4">Growth Timeline (2010–2025)</h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={historical.timeline}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} label={{ value: 'MW', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} />
            <Tooltip formatter={(val: any) => `${(Number(val) / 1000).toFixed(1)} GW`} />
            <Legend />
            {(filter === 'solar' || filter === 'all') && (
              <Line type="monotone" dataKey="solar" stroke="#F99D27" strokeWidth={2.5} name="Solar" dot={{ r: 3 }} />
            )}
            {(filter === 'wind' || filter === 'all') && (
              <Line type="monotone" dataKey="wind" stroke="#007A9E" strokeWidth={2.5} name="Wind" dot={{ r: 3 }} />
            )}
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-400 mt-2">Source: MNRE Physical Progress Reports, CEA Monthly Reports</p>
      </div>

      {/* Key Facts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm card-hover">
          <p className="text-sm font-semibold text-gray-500">☀️ Cheapest Solar Tariff</p>
          <p className="text-xl font-bold text-[#F99D27] mt-1">₹1.99/kWh</p>
          <p className="text-xs text-gray-400 mt-1">Down from ₹17/kWh in 2010 (88% reduction)</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm card-hover">
          <p className="text-sm font-semibold text-gray-500">🌬️ Wind Tariff Range</p>
          <p className="text-xl font-bold text-[#007A9E] mt-1">₹2.5–3.5/kWh</p>
          <p className="text-xs text-gray-400 mt-1">Competitive with new coal (₹4.5–5.5/kWh)</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm card-hover">
          <p className="text-sm font-semibold text-gray-500">🎯 RE Target 2030</p>
          <p className="text-xl font-bold text-[#005B75] mt-1">500 GW</p>
          <p className="text-xs text-gray-400 mt-1">Solar 280 GW + Wind 130 GW (Onshore + Offshore)</p>
        </div>
      </div>

      {/* Projections */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-[#005B75] mb-4">Projections to 2030</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-[#F99D27] animate-pulse-ring">
              <span className="text-lg font-bold text-[#F99D27]">280 GW</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-600">Solar Target</p>
            <p className="text-xs text-gray-400">Current: 90.6 GW (32%)</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-[#007A9E] animate-pulse-ring">
              <span className="text-lg font-bold text-[#007A9E]">100 GW</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-600">Wind Onshore Target</p>
            <p className="text-xs text-gray-400">Current: 47.7 GW (48%)</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-[#005B75] animate-pulse-ring">
              <span className="text-lg font-bold text-[#005B75]">30 GW</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-600">Offshore Wind</p>
            <p className="text-xs text-gray-400">Current: 0 GW (Tenders issued)</p>
          </div>
        </div>
      </div>

      {/* Sector Story */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-[#005B75] mb-3">Sector Story</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-l-4 border-[#F99D27] pl-4">
            <p className="font-semibold text-[#F99D27]">☀️ Solar — Zero to Hero</p>
            <p className="text-sm text-gray-600 mt-1">
              From just 161 MW in 2010 to 90,570 MW in 2025 — India added more solar in 12 years than most countries have in total.
              Tariffs crashed 88% from ₹17 to ₹1.99/kWh, making solar the cheapest source of new electricity globally.
              The Bhadla Solar Park alone (2,245 MW) is larger than many countries' total solar capacity.
            </p>
          </div>
          <div className="border-l-4 border-[#007A9E] pl-4">
            <p className="font-semibold text-[#007A9E]">🌬️ Wind — The Early Adopter</p>
            <p className="text-sm text-gray-600 mt-1">
              India was among the first developing nations to embrace wind energy in the 1990s. From 250 kW turbines to today's
              5.5 MW machines, the evolution has been remarkable. With 47,650 MW installed, India is the 4th largest wind market globally.
              Repowering of 10 GW+ of old turbines represents the next frontier.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
