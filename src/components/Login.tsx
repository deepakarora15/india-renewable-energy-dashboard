import { useState } from 'react';
import { useAppStore } from '../store';

export default function Login() {
  const setUser = useAppStore((s) => s.setUser);
  const [name, setName] = useState('');

  const handleEnter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setUser({ username: name.trim(), role: 'admin' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#005B75] to-[#003D50] p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fadeIn">
        <div className="text-center mb-8">
          <img
            src="https://www.icicilombard.com/content/dam/icicilombard/logos/IL-logo.svg"
            alt="ICICI Lombard"
            className="h-12 mx-auto mb-4"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="text-5xl mb-3">⚡</div>
          <h1 className="text-2xl font-bold text-[#005B75]">India Renewable Energy</h1>
          <p className="text-sm text-gray-500 mt-1">Solar & Wind Sector Dashboard</p>
          <p className="text-xs text-gray-400 mt-1">ICICI Lombard GIC Ltd</p>
        </div>
        <form onSubmit={handleEnter} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Enter Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B75] text-base"
              placeholder="Your name"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3 bg-gradient-to-r from-[#005B75] to-[#007A9E] text-white font-bold rounded-xl hover:opacity-90 transition text-base disabled:opacity-50"
          >
            Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
