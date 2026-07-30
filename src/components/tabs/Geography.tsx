import { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography as Geo } from 'react-simple-maps';
import { useGeography } from '../../hooks/useData';
import { useAppStore } from '../../store';

const INDIA_TOPO = `${import.meta.env.BASE_URL}data/geography/india-states.json`;

export default function Geography() {
  const filter = useAppStore((s) => s.filter);
  const { data } = useGeography() as { data: any };
  const [selectedState, setSelectedState] = useState<any>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const [geoError, setGeoError] = useState(false);

  useEffect(() => {
    fetch(INDIA_TOPO)
      .then((r) => r.json())
      .then((d) => setGeoData(d))
      .catch(() => setGeoError(true));
  }, []);

  if (!data) return <div className="text-center py-10">Loading...</div>;

  const normalizeStateName = (name: string) => {
    return name.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, ' ').trim();
  };

  const getColor = (geoName: string) => {
    if (!geoName) return '#E5E7EB';
    const gn = normalizeStateName(geoName);
    const state = data.states.find((s: any) => {
      const sn = normalizeStateName(s.name);
      return gn.includes(sn) || sn.includes(gn);
    });
    if (!state) return '#E5E7EB';
    if (filter === 'solar') return state.solar > 1000 ? '#F99D27' : state.solar > 200 ? '#FED7AA' : '#F5F5F5';
    if (filter === 'wind') return state.wind > 1000 ? '#007A9E' : state.wind > 100 ? '#BAE6FD' : '#F5F5F5';
    return state.dominant === 'wind' ? '#007A9E' : '#F99D27';
  };

  const handleStateClick = (geoName: string) => {
    if (!geoName) return;
    const gn = normalizeStateName(geoName);
    const state = data.states.find((s: any) => {
      const sn = normalizeStateName(s.name);
      return gn.includes(sn) || sn.includes(gn);
    });
    setSelectedState(state || null);
  };

  const topStates = [...data.states]
    .sort((a: any, b: any) => (b.solar + b.wind) - (a.solar + a.wind))
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Filter Info */}
      <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 text-sm flex-wrap">
        <span className="font-semibold text-[#005B75]">Map View:</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#F99D27]" /> Solar Dominant</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#007A9E]" /> Wind Dominant</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#E5E7EB]" /> Low RE</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-bold text-lg text-[#005B75] mb-2">India RE Map — State-wise Solar & Wind</h3>
          {geoError ? (
            <div className="flex items-center justify-center h-[500px] bg-[#F0F9FF] rounded-lg">
              <div className="text-center">
                <p className="text-4xl mb-2">🗺️</p>
                <p className="text-gray-500">Map data could not be loaded.</p>
                <p className="text-xs text-gray-400 mt-1">Please check your internet connection.</p>
              </div>
            </div>
          ) : !geoData ? (
            <div className="flex items-center justify-center h-[500px] bg-[#F0F9FF] rounded-lg">
              <p className="text-gray-500">Loading map...</p>
            </div>
          ) : (
            <div style={{ width: '100%', maxHeight: '600px' }}>
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{ scale: 1000, center: [82, 23] }}
                width={700}
                height={650}
                style={{ width: '100%', height: 'auto' }}
              >
                <Geographies geography={geoData}>
                  {({ geographies }: any) =>
                    geographies.map((geo: any) => {
                      const props = geo.properties || {};
                      const geoName = props.ST_NM || props.NAME_1 || props.name || props.NAME || props.st_nm || props.State || '';
                      return (
                        <Geo
                          key={geo.rsmKey}
                          geography={geo}
                          fill={getColor(geoName)}
                          stroke="#FFFFFF"
                          strokeWidth={0.6}
                          style={{
                            default: { outline: 'none' },
                            hover: { fill: '#005B75', outline: 'none', cursor: 'pointer' },
                            pressed: { outline: 'none' },
                          }}
                          onClick={() => handleStateClick(geoName)}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
            </div>
          )}
        </div>

        {/* State Info Panel */}
        <div className="space-y-4">
          {selectedState ? (
            <div className="bg-white rounded-xl p-5 shadow-sm animate-fadeIn border-l-4 border-[#005B75]">
              <h4 className="font-bold text-lg text-[#005B75]">{selectedState.name}</h4>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>☀️ Solar</span>
                  <span className="font-bold text-[#F99D27]">{selectedState.solar.toLocaleString()} MW</span>
                </div>
                <div className="flex justify-between">
                  <span>🌬️ Wind</span>
                  <span className="font-bold text-[#007A9E]">{selectedState.wind.toLocaleString()} MW</span>
                </div>
                <div className="flex justify-between">
                  <span>🏆 Top Project</span>
                  <span className="text-xs text-right max-w-[150px]">{selectedState.topProject}</span>
                </div>
                <div className="flex justify-between">
                  <span>📊 Policy Rating</span>
                  <span className="font-bold text-[#005B75]">{selectedState.policyRating}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-gray-200">
              <p className="text-sm text-gray-500">👆 Click a state on the map to see details</p>
            </div>
          )}

          {/* Top 10 States Table */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h4 className="font-bold text-[#005B75] mb-3">Top 10 States (Total RE)</h4>
            <div className="space-y-2">
              {topStates.map((s: any, i: number) => (
                <div
                  key={s.code}
                  className="flex items-center gap-2 text-sm cursor-pointer hover:bg-[#F0F9FF] rounded p-1 transition"
                  onClick={() => setSelectedState(s)}
                >
                  <span className="w-5 text-xs text-gray-400 font-semibold">{i + 1}</span>
                  <span className="flex-1">{s.name}</span>
                  <span className="text-xs text-[#F99D27]">{(s.solar / 1000).toFixed(1)}G</span>
                  <span className="text-xs text-[#007A9E]">{(s.wind / 1000).toFixed(1)}G</span>
                </div>
              ))}
            </div>
          </div>

          {/* Belts */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h4 className="font-bold text-[#005B75] mb-2">RE Belts</h4>
            <div className="text-sm space-y-2">
              <div>
                <p className="font-semibold text-[#F99D27] text-xs">☀️ Solar Belt:</p>
                <p className="text-gray-600">{data.solarBelt.join(', ')}</p>
              </div>
              <div>
                <p className="font-semibold text-[#007A9E] text-xs">🌬️ Wind Belt:</p>
                <p className="text-gray-600">{data.windBelt.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
