import { useSolarData, useGeography } from '../../hooks/useData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#F99D27', '#FF6B35', '#FFC107', '#4CAF50', '#9C27B0'];

export default function SolarDeepDive() {
  const { data: solar } = useSolarData() as { data: any };
  const { data: geo } = useGeography() as { data: any };

  if (!solar || !geo) return <div className="text-center py-10">Loading...</div>;

  const stateData = [...geo.states]
    .sort((a: any, b: any) => b.solar - a.solar)
    .slice(0, 10)
    .map((s: any) => ({ name: s.name, solar: s.solar }));

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border-t-4 border-[#F99D27] card-hover">
          <p className="text-sm text-gray-500">Total Solar Capacity</p>
          <p className="text-2xl font-bold text-[#F99D27]">{(solar.totalCapacity / 1000).toFixed(1)} GW</p>
          <p className="text-xs text-gray-400">FY2025</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-t-4 border-[#FF6B35] card-hover">
          <p className="text-sm text-gray-500">Annual Generation</p>
          <p className="text-2xl font-bold text-[#FF6B35]">{solar.generation.value} BU</p>
          <p className="text-xs text-gray-400">FY2025</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-t-4 border-[#FFC107] card-hover">
          <p className="text-sm text-gray-500">CUF</p>
          <p className="text-2xl font-bold text-[#FFC107]">{solar.cuf}%</p>
          <p className="text-xs text-gray-400">Capacity Utilization Factor</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-t-4 border-[#4CAF50] card-hover">
          <p className="text-sm text-gray-500">2030 Target</p>
          <p className="text-2xl font-bold text-[#4CAF50]">280 GW</p>
          <p className="text-xs text-gray-400">32% achieved</p>
        </div>
      </div>

      {/* Sub-categories */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-[#005B75] mb-4">Capacity Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(solar.subcategories).map(([key, val]: [string, any]) => (
            <div key={key} className="bg-[#F0F9FF] rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
              <p className="text-xl font-bold text-[#005B75]">{(val.capacity / 1000).toFixed(1)} GW</p>
              <p className="text-sm text-[#F99D27] font-semibold">{val.share}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Year-wise Additions */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-[#005B75] mb-4">Annual Solar Additions (GW)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={solar.annualAdditions}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(val: any) => `${val} GW`} />
            <Bar dataKey="added" fill="#F99D27" radius={[4, 4, 0, 0]} name="Added (GW)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Technology Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg text-[#005B75] mb-4">Technology Market Share</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={solar.technology} dataKey="share" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, share }: any) => `${name} ${share}%`}>
                {solar.technology.map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg text-[#005B75] mb-4">Tariff Evolution (₹/kWh)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={solar.tariffHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val: any) => `₹${val}/kWh`} />
              <Line type="monotone" dataKey="tariff" stroke="#F99D27" strokeWidth={2.5} dot={{ r: 3 }} name="Tariff" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Solar Parks */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-[#005B75] mb-4">Top 10 Solar Parks</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-gray-500">#</th>
                <th className="text-left py-2 px-3 text-gray-500">Name</th>
                <th className="text-left py-2 px-3 text-gray-500">State</th>
                <th className="text-right py-2 px-3 text-gray-500">Capacity (MW)</th>
              </tr>
            </thead>
            <tbody>
              {solar.topParks.map((park: any, i: number) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-[#F0F9FF]">
                  <td className="py-2 px-3 font-semibold text-[#F99D27]">{i + 1}</td>
                  <td className="py-2 px-3">{park.name}</td>
                  <td className="py-2 px-3 text-gray-500">{park.state}</td>
                  <td className="py-2 px-3 text-right font-semibold">{park.capacity.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* State-wise Capacity */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-[#005B75] mb-4">State-wise Solar Capacity (Top 10)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stateData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(val: any) => `${Number(val).toLocaleString()} MW`} />
            <Bar dataKey="solar" fill="#F99D27" radius={[0, 4, 4, 0]} name="Solar (MW)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance & Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg text-[#005B75] mb-4">Performance Metrics</h3>
          <div className="space-y-3">
            {Object.entries(solar.performanceMetrics).map(([key, val]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="text-sm font-semibold text-[#005B75]">{val as string}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg text-[#005B75] mb-4">Key Challenges</h3>
          <ul className="space-y-2">
            {solar.challenges.map((c: string, i: number) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="text-red-400 mt-0.5">⚠️</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* BESS Integration */}
      <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-[#F99D27]">
        <h3 className="font-bold text-lg text-[#005B75] mb-2">🔋 BESS Integration — Solving Solar Intermittency</h3>
        <p className="text-sm text-gray-600">
          Battery Energy Storage Systems (BESS) are the key to making solar dispatchable. By storing excess mid-day generation 
          and releasing it during evening peak (5–9 PM), BESS transforms solar from an intermittent source to a reliable one. 
          India targets 40 GWh of BESS by 2030. Current SECI tenders mandate solar+storage at tariffs of ₹3.5–4.0/kWh.
        </p>
      </div>
    </div>
  );
}
