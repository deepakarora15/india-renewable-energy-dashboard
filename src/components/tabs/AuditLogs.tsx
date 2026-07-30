import { useState } from 'react';
import { useAppStore } from '../../store';
import type { ManagedUser } from '../../types';

export default function AuditLogs() {
  const { user, managedUsers, loginLogs, addManagedUser, removeManagedUser } = useAppStore();
  const [subTab, setSubTab] = useState<'users' | 'logs'>('users');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isAdmin = user?.role === 'admin';

  const handleCreateUser = () => {
    if (!newUsername.trim() || !newPassword.trim()) {
      setError('Username and password are required.');
      return;
    }
    if (managedUsers.find((u) => u.username === newUsername)) {
      setError('Username already exists.');
      return;
    }
    const newUser: ManagedUser = {
      username: newUsername.trim(),
      email: newEmail.trim() || `${newUsername.trim().toLowerCase()}@icicilombard.com`,
      password: newPassword,
      role: newRole,
      createdAt: new Date().toISOString().split('T')[0],
    };
    addManagedUser(newUser);
    setNewUsername('');
    setNewEmail('');
    setNewPassword('');
    setNewRole('user');
    setError('');
    setSuccess(`User "${newUser.username}" created successfully!`);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteUser = (username: string) => {
    removeManagedUser(username);
  };

  const copyLink = () => {
    const url = window.location.href.split('#')[0];
    navigator.clipboard.writeText(url);
    setSuccess('Dashboard link copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-20">
        <span className="text-5xl">🔒</span>
        <p className="text-lg font-bold text-[#005B75] mt-4">Admin Access Required</p>
        <p className="text-sm text-gray-500 mt-1">Only administrators can access Audit Logs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Share Dashboard */}
      <div className="bg-white rounded-xl p-5 shadow-sm flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-bold text-[#005B75] flex items-center gap-2">🔗 Share Dashboard</h3>
          <p className="text-xs text-gray-500">Share with authorized users only</p>
        </div>
        <button
          onClick={copyLink}
          className="px-5 py-2.5 bg-green-700 text-white font-bold rounded-lg hover:bg-green-800 transition text-sm"
        >
          📋 Copy Link
        </button>
      </div>

      {success && (
        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold animate-fadeIn">
          ✅ {success}
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setSubTab('users')}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold transition ${
            subTab === 'users' ? 'bg-[#005B75] text-white' : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          👥 User Management
        </button>
        <button
          onClick={() => setSubTab('logs')}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold transition ${
            subTab === 'logs' ? 'bg-[#005B75] text-white' : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          📋 Login Audit Logs
        </button>
      </div>

      {subTab === 'users' && (
        <div className="space-y-6">
          {/* Create New User */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-[#005B75] mb-4">+ Create New User</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Username</label>
                <div className="flex">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => { setNewUsername(e.target.value); setError(''); }}
                    className="flex-1 px-3 py-2.5 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#005B75] text-sm"
                    placeholder="firstname.lastname"
                  />
                  <span className="px-2 py-2.5 bg-gray-100 border border-l-0 border-gray-200 rounded-r-lg text-xs text-gray-500 whitespace-nowrap">@icicilombard.com</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Password</label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005B75] text-sm"
                  placeholder="Set password"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'admin' | 'user')}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005B75] text-sm"
                >
                  <option value="user">👤 User</option>
                  <option value="admin">👑 Admin</option>
                </select>
              </div>
              <button
                onClick={handleCreateUser}
                className="px-5 py-2.5 bg-green-700 text-white font-bold rounded-lg hover:bg-green-800 transition text-sm"
              >
                ✓ Create User
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          {/* All Users Table */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-[#005B75] mb-4">👥 All Users ({managedUsers.length})</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F0F9FF]">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">USERNAME</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">EMAIL</th>
                    <th className="text-center py-3 px-4 text-gray-500 font-semibold">ROLE</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">CREATED</th>
                    <th className="text-center py-3 px-4 text-gray-500 font-semibold">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {managedUsers.map((u) => (
                    <tr key={u.username} className="border-b border-gray-50 hover:bg-[#F0F9FF]">
                      <td className="py-3 px-4 font-semibold">{u.username}</td>
                      <td className="py-3 px-4 text-gray-600">{u.email}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{u.createdAt}</td>
                      <td className="py-3 px-4 text-center">
                        {u.isDefault ? (
                          <span className="text-xs text-gray-400">Default</span>
                        ) : (
                          <button
                            onClick={() => handleDeleteUser(u.username)}
                            className="text-xs text-red-500 hover:text-red-700 font-semibold"
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {subTab === 'logs' && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h4 className="font-bold text-[#005B75] mb-4">📋 Login Audit Logs</h4>
          {loginLogs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No login activity recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F0F9FF]">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">USERNAME</th>
                    <th className="text-center py-3 px-4 text-gray-500 font-semibold">ROLE</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">ACTION</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">TIMESTAMP</th>
                  </tr>
                </thead>
                <tbody>
                  {loginLogs.map((log, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-[#F0F9FF]">
                      <td className="py-3 px-4 font-semibold">{log.username}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          log.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {log.role === 'admin' ? '👑 Admin' : '👤 User'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-semibold ${log.action === 'login' ? 'text-green-600' : 'text-red-600'}`}>
                          {log.action === 'login' ? '🟢 Login' : '🔴 Logout'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
