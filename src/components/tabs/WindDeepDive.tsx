import { useWindData, useGeography } from '../../hooks/useData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function WindDeepDive() {
  const { data: wind } = useWindData() as { data: any };
  const { data: geo } = useGeography() as { data: any };

  if (!wind || !geo) return <div className="text-center py-10">Loading...</div>;

  const stateData = [...geo.states]
    .filter((s: any) => s.wind > 0)
    .sort((a: any, b: any) => b.wind - a.wind)
    .slice(0, 8)
    .map((s: any) => ({ name: s.name, wind: s.wind }));

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border-t-4 border-[#007A9E] card-hover">
          <p className="text-sm text-gray-500">Total Wind Capacity</p>
          <p className="text-2xl font-bold text-[#007A9E]">{(wind.totalCapacity / 1000).toFixed(1)} GW</p>
          <p className="text-xs text-gray-400">FY2025 • 100% Onshore</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-t-4 border-[#005B75] card-hover">
          <p className="text-sm text-gray-500">Annual Generation</p>
          <p className="text-2xl font-bold text-[#005B75]">{wind.generation.value} BU</p>
          <p className="text-xs text-gray-400">FY2025</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-t-4 border-[#10B981] card-hover">
          <p className="text-sm text-gray-500">CUF</p>
          <p className="text-2xl font-bold text-[#10B981]">{wind.cuf}%</p>
          <p className="text-xs text-gray-400">Capacity Utilization Factor</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-t-4 border-[#6366F1] card-hover">
          <p className="text-sm text-gray-500">2030 Target</p>
          <p className="text-2xl font-bold text-[#6366F1]">130 GW</p>
          <p className="text-xs text-gray-400">Onshore 100 + Offshore 30</p>
        </div>
      </div>

      {/* Year-wise Additions */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-[#005B75] mb-4">Annual Wind Additions (GW)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={wind.annualAdditions}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(val: any) => `${val} GW`} />
            <Bar dataKey="added" fill="#007A9E" radius={[4, 4, 0, 0]} name="Added (GW)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Turbine Evolution */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-[#005B75] mb-4">Turbine Technology Evolution</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-gray-500">Era</th>
                <th className="text-left py-2 px-3 text-gray-500">Turbine Capacity</th>
                <th className="text-left py-2 px-3 text-gray-500">Hub Height</th>
                <th className="text-left py-2 px-3 text-gray-500">Visual</th>
              </tr>
            </thead>
            <tbody>
              {wind.turbineEvolution.map((t: any, i: number) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-[#F0F9FF]">
                  <td className="py-2 px-3 font-semibold text-[#007A9E]">{t.era}</td>
                  <td className="py-2 px-3">{t.capacity}</td>
                  <td className="py-2 px-3">{t.hubHeight}m</td>
                  <td className="py-2 px-3">
                    <div className="h-3 bg-[#007A9E] rounded" style={{ width: `${(t.hubHeight / 160) * 100}%`, minWidth: '20px' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seasonal Pattern */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-[#005B75] mb-4">Seasonal Generation Pattern (BU/month)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={wind.seasonalPattern}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(val: any) => `${val} BU`} />
            <Line type="monotone" dataKey="generation" stroke="#007A9E" strokeWidth={2.5} dot={{ r: 4 }} name="Generation" />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-400 mt-2">Peak: Jun–Sep (monsoon winds) • Low: Dec–Mar</p>
      </div>

      {/* Repowering + Offshore */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-[#007A9E]">
          <h3 className="font-bold text-lg text-[#005B75] mb-3">♻️ Repowering Opportunity</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-semibold">Eligible:</span> {wind.repoweringOpportunity.eligibleCapacity.toLocaleString()} MW of old turbines ({'<'}1 MW)</p>
            <p><span className="font-semibold">Potential:</span> {wind.repoweringOpportunity.potentialNewCapacity.toLocaleString()} MW with modern turbines</p>
            <p className="text-xs text-gray-400 mt-2">{wind.repoweringOpportunity.note}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-[#005B75]">
          <h3 className="font-bold text-lg text-[#005B75] mb-3">🌊 Offshore Wind</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-semibold">Potential:</span> {wind.offshoreWind.potential}</p>
            <p><span className="font-semibold">First Tenders:</span> {wind.offshoreWind.firstTenders}</p>
            <div className="mt-2">
              <p className="text-xs font-semibold text-gray-500">Challenges:</p>
              <ul className="list-disc list-inside text-xs text-gray-400 mt-1">
                {wind.offshoreWind.challenges.map((c: string, i: number) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Key Corridors */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-[#005B75] mb-4">Key Wind Corridors</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {wind.keyCorridors.map((c: any, i: number) => (
            <div key={i} className="bg-[#F0F9FF] rounded-lg p-4 text-center card-hover">
              <p className="text-lg font-bold text-[#007A9E]">{c.name}</p>
              <p className="text-sm text-gray-500">{c.state}</p>
              <p className="text-lg font-bold text-[#005B75] mt-1">{c.capacity.toLocaleString()} MW</p>
            </div>
          ))}
        </div>
      </div>

      {/* State-wise Wind */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-[#005B75] mb-4">State-wise Wind Capacity (Top 8)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={stateData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(val: any) => `${Number(val).toLocaleString()} MW`} />
            <Bar dataKey="wind" fill="#007A9E" radius={[0, 4, 4, 0]} name="Wind (MW)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Challenges */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-[#005B75] mb-4">Key Challenges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {wind.challenges.map((c: string, i: number) => (
            <div key={i} className="flex gap-2 text-sm text-gray-600 bg-red-50 rounded-lg p-3">
              <span className="text-red-400">⚠️</span>
              <span>{c}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
