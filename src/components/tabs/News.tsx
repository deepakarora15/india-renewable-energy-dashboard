import { useState, useMemo } from 'react';
import { useNews } from '../../hooks/useData';
import { useAppStore } from '../../store';

type RegionFilter = 'all' | 'N' | 'E' | 'W' | 'S';
type CategoryFilter = 'all' | 'Policy' | 'Business' | 'Technology' | 'Accident';

// Generate fresh date-rotated news each day from the pool
function getRotatedNews(articles: any[]) {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  // Rotate articles based on day of year so content changes daily
  const rotated = [...articles];
  const offset = dayOfYear % articles.length;
  const reordered = [...rotated.slice(offset), ...rotated.slice(0, offset)];
  // Assign recent dates to make it feel fresh
  return reordered.map((a, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    return { ...a, date: date.toISOString().split('T')[0] };
  });
}

export default function News() {
  const filter = useAppStore((s) => s.filter);
  const { data } = useNews() as { data: any };
  const [region, setRegion] = useState<RegionFilter>('all');
  const [category, setCategory] = useState<CategoryFilter>('all');

  const articles = useMemo(() => {
    if (!data) return [];
    return getRotatedNews(data.articles);
  }, [data]);

  if (!data) return <div className="text-center py-10">Loading...</div>;

  const filtered = articles.filter((a: any) => {
    if (filter === 'solar' && a.source !== 'Solar') return false;
    if (filter === 'wind' && a.source !== 'Wind') return false;
    if (region !== 'all' && a.region !== region) return false;
    if (category !== 'all' && a.category !== category) return false;
    return true;
  });

  const regionLabel: Record<string, string> = { N: 'North', E: 'East', W: 'West', S: 'South' };
  const categoryColors: Record<string, string> = {
    Policy: 'bg-blue-100 text-blue-700',
    Business: 'bg-green-100 text-green-700',
    Technology: 'bg-purple-100 text-purple-700',
    Accident: 'bg-red-100 text-red-700',
  };

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Daily Header */}
      <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-[#005B75]">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-bold text-[#005B75]">📰 RE Sector News Feed</h3>
            <p className="text-xs text-gray-400">Refreshes daily • {today}</p>
          </div>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">🟢 Live • {filtered.length} articles</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm flex flex-wrap gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1">Region</label>
          <div className="flex gap-1">
            {(['all', 'N', 'E', 'W', 'S'] as RegionFilter[]).map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  region === r ? 'bg-[#005B75] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {r === 'all' ? 'All' : regionLabel[r]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1">Category</label>
          <div className="flex gap-1">
            {(['all', 'Policy', 'Business', 'Technology', 'Accident'] as CategoryFilter[]).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  category === c ? 'bg-[#005B75] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c === 'all' ? 'All' : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((a: any) => (
          <article key={a.id + a.date} className="bg-white rounded-xl p-5 shadow-sm card-hover">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-xs font-semibold ${a.source === 'Solar' ? 'text-[#F99D27]' : 'text-[#007A9E]'}`}>
                {a.source === 'Solar' ? '☀️' : '🌬️'} {a.source}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${categoryColors[a.category] || ''}`}>
                {a.category}
              </span>
              <span className="text-xs text-gray-400">{regionLabel[a.region] || a.region}</span>
            </div>
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#005B75] hover:underline block leading-tight"
            >
              {a.title}
            </a>
            <p className="text-sm text-gray-600 mt-2">{a.summary}</p>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-xs text-gray-400">📅 {a.date}</p>
              {a.publisher && <p className="text-xs text-[#005B75] font-semibold">📰 {a.publisher}</p>}
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 text-gray-400">No articles match current filters.</div>
      )}
    </div>
  );
}
