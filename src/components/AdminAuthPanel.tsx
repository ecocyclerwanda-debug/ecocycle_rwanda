import React, { useState } from 'react';
import { getCurrentAdmin, loginAdmin, logoutAdmin } from '../lib/appwrite';

type Props = {
  currentAdminEmail: string | null;
  onLoggedIn: (email: string) => void;
  onLoggedOut: () => void;
};

export default function AdminAuthPanel({
  currentAdminEmail,
  onLoggedIn,
  onLoggedOut,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');

    try {
      setLoading(true);
      const user = await loginAdmin(email, password);
      onLoggedIn(user.email);
      setMessage('Admin login successful.');
      setPassword('');
    } catch (error) {
      const text =
        error instanceof Error ? error.message : 'Failed to log in.';
      setMessage(text);
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = async () => {
    setMessage('');

    try {
      setLoading(true);
      const user = await getCurrentAdmin();

      if (user) {
        onLoggedIn(user.email);
        setMessage(`Logged in as ${user.email}`);
      } else {
        onLoggedOut();
        setMessage('No active admin session.');
      }
    } catch (error) {
      const text =
        error instanceof Error ? error.message : 'Could not check session.';
      setMessage(text);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setMessage('');

    try {
      setLoading(true);
      await logoutAdmin();
      onLoggedOut();
      setMessage('Logged out successfully.');
      setEmail('');
      setPassword('');
    } catch (error) {
      const text =
        error instanceof Error ? error.message : 'Failed to log out.';
      setMessage(text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 md:p-10 rounded-3xl border border-emerald-900/10 shadow-sm max-w-4xl mx-auto mb-10">
      <h3 className="text-2xl font-bold text-emerald-900 mb-4">Admin Access</h3>

      <p className="text-slate-600 mb-6">
        {currentAdminEmail
          ? `Logged in as ${currentAdminEmail}`
          : 'Log in with your Appwrite admin account.'}
      </p>

      {!currentAdminEmail && (
        <form onSubmit={handleLogin} className="grid grid-cols-1 gap-4 mb-6">
          <input
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-6 py-4 rounded-xl border border-emerald-900/10 focus:outline-none focus:border-emerald-500"
          />

          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-6 py-4 rounded-xl border border-emerald-900/10 focus:outline-none focus:border-emerald-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-4 rounded-xl bg-emerald-900 text-white font-bold hover:bg-emerald-800 transition-colors disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Log in as admin'}
          </button>
        </form>
      )}

      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleCheck}
          disabled={loading}
          className="px-6 py-3 rounded-xl border border-emerald-900/20 text-emerald-900 font-bold hover:bg-emerald-50 transition-colors disabled:opacity-60"
        >
          Check session
        </button>

        <button
          onClick={handleLogout}
          disabled={loading || !currentAdminEmail}
          className="px-6 py-3 rounded-xl border border-red-200 text-red-700 font-bold hover:bg-red-50 transition-colors disabled:opacity-60"
        >
          Log out
        </button>
      </div>

      {message && <p className="mt-4 text-sm text-slate-600">{message}</p>}
    </div>
  );
}