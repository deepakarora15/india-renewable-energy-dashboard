import { useAppStore } from '../store';
import type { EnergyFilter } from '../types';

const FILTERS: { label: string; value: EnergyFilter; icon: string }[] = [
  { label: 'Solar', value: 'solar', icon: '☀️' },
  { label: 'Wind', value: 'wind', icon: '🌬️' },
  { label: 'All RE', value: 'all', icon: '⚡' },
];

function ICICILogo() {
  return (
    <div className="flex items-center gap-1 bg-gradient-to-r from-[#E85D04] via-[#F77F00] to-[#FCBF49] rounded-lg px-3 py-1.5 shadow-md">
      <span className="text-white font-black text-lg italic tracking-tight" style={{ fontFamily: 'Arial, sans-serif' }}>
        ICICI
      </span>
      <span className="text-white font-bold text-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
        Lombard
      </span>
    </div>
  );
}

export default function Header() {
  const { user, filter, setFilter, setUser } = useAppStore();

  return (
    <div className="no-print">
      {/* Main Dashboard Header */}
      <header className="bg-gradient-to-r from-[#005B75] to-[#003D50] text-white">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <ICICILogo />
            <div>
              <h1 className="text-xl font-bold leading-tight">India Renewable Energy Dashboard</h1>
              <p className="text-xs text-blue-200">Solar & Wind Sector Analysis • FY2025</p>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex bg-white/10 rounded-lg p-1">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
                    filter === f.value
                      ? 'bg-white text-[#005B75] shadow'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {f.icon} {f.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm bg-white/10 px-3 py-1 rounded-full">
                {user?.role === 'admin' ? '👑' : '👤'} {user?.username}
              </span>
              <button
                onClick={() => setUser(null)}
                className="text-sm bg-red-500/80 hover:bg-red-500 px-3 py-1 rounded-full transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
