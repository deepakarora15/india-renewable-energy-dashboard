import { useAppStore } from '../store';
import Header from './Header';
import IndustryOverview from './tabs/IndustryOverview';
import SolarDeepDive from './tabs/SolarDeepDive';
import WindDeepDive from './tabs/WindDeepDive';
import MarketPlayers from './tabs/MarketPlayers';
import Ownership from './tabs/Ownership';
import Geography from './tabs/Geography';
import RiskAnalysis from './tabs/RiskAnalysis';
import News from './tabs/News';
import REQuiz from './tabs/REQuiz';
import AuditLogs from './tabs/AuditLogs';

const TABS = [
  { label: '🏭 Overview', component: IndustryOverview },
  { label: '☀️ Solar', component: SolarDeepDive },
  { label: '🌬️ Wind', component: WindDeepDive },
  { label: '🏢 Players', component: MarketPlayers },
  { label: '🏛️ Ownership', component: Ownership },
  { label: '🗺️ Geography', component: Geography },
  { label: '🛡️ Risk', component: RiskAnalysis },
  { label: '📰 News', component: News },
  { label: '🎮 Quiz', component: REQuiz },
  { label: '🔐 Audit Logs', component: AuditLogs, adminOnly: true },
];

export default function Dashboard() {
  const { activeTab, setActiveTab, user } = useAppStore();
  const visibleTabs = TABS.filter((t) => {
    if ((t as any).adminOnly && user?.role !== 'admin') return false;
    return true;
  });

  const ActiveComponent = visibleTabs[activeTab]?.component || IndustryOverview;

  return (
    <div className="min-h-screen bg-[#F0F9FF]">
      <Header />
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40 no-print">
        <div className="max-w-[1400px] mx-auto px-4 flex gap-1 overflow-x-auto py-2">
          {visibleTabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition ${
                activeTab === i
                  ? 'bg-[#005B75] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
      <main className="max-w-[1400px] mx-auto px-4 py-6 pb-16 animate-fadeIn">
        <ActiveComponent />
      </main>
      {/* Footer Ribbon — Always visible, fixed at bottom */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#1E3A4F] text-white py-2 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.15)] no-print border-t border-gray-600">
        <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between">
          <span className="text-xs text-gray-300">ICICI Lombard General Insurance Company Ltd.</span>
          <span className="text-xs text-yellow-400 font-semibold">For Internal Use Only</span>
          <span className="text-xs text-gray-300">Designed by <span className="text-white font-semibold">Deepak Arora</span></span>
        </div>
      </footer>
    </div>
  );
}
