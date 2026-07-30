import { useState } from 'react';
import { useAppStore } from '../store';

export default function Login() {
  const { setUser, managedUsers, addLoginLog } = useAppStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = managedUsers.find((u) => u.username === username && u.password === password);
    if (user) {
      setUser({ username: user.username, role: user.role });
      addLoginLog({ username: user.username, role: user.role, timestamp: new Date().toISOString(), action: 'login' });
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#005B75] to-[#003D50] p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fadeIn">
        <div className="text-center mb-8">
          <img
            src={`${import.meta.env.BASE_URL}icici-lombard-logo.jpg`}
            alt="ICICI Lombard"
            className="h-12 mx-auto mb-4 rounded-lg"
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
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B75] text-base"
              placeholder="Enter username"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B75] text-base"
              placeholder="Enter password"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={!username.trim() || !password.trim()}
            className="w-full py-3 bg-gradient-to-r from-[#005B75] to-[#007A9E] text-white font-bold rounded-xl hover:opacity-90 transition text-base disabled:opacity-50"
          >
            Sign In
          </button>
        </form>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 max-w-lg text-center">
        <p className="text-xs text-blue-200 font-semibold mb-1">Internal & Confidentiality Notice</p>
        <p className="text-[11px] text-blue-100/80 leading-relaxed">
          This portal and its contents are intended solely for internal use by authorized personnel. 
          The information provided herein is compiled from third-party and public external sources for 
          informational and analytical purposes only. While reasonable efforts are made to ensure accuracy, 
          ICICI Lombard makes no representations or warranties regarding the completeness, reliability, or 
          accuracy of the data. By logging in, you acknowledge that this information should not be solely 
          relied upon for legal, commercial, or financial decisions, and you agree not to distribute or 
          circulate any content externally without prior written authorization.
        </p>
      </div>
    </div>
  );
}
