import { useState } from 'react';
import { useAppStore } from '../store';

const CREDS: Record<string, { password: string; role: 'admin' | 'user' }> = {
  admin: { password: 'admin123', role: 'admin' },
  user: { password: 'user123', role: 'user' },
};

export default function Login() {
  const setUser = useAppStore((s) => s.setUser);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cred = CREDS[username];
    if (cred && cred.password === password) {
      setUser({ username, role: cred.role });
    } else {
      setError('Invalid credentials. Try admin/admin123 or user/user123');
    }
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
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B75] text-base"
              placeholder="admin or user"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B75] text-base"
              placeholder="••••••"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#005B75] to-[#007A9E] text-white font-bold rounded-xl hover:opacity-90 transition text-base"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 text-xs text-center text-gray-400">
          Admin: admin/admin123 &nbsp;|&nbsp; User: user/user123
        </div>
      </div>
    </div>
  );
}
