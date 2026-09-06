import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Crosshair } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const from = location.state?.from?.pathname || '/admin/ranges';

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#eef2f6] text-[#222]">
      <Helmet>
        <title>Owner Login | DMV Ranges</title>
        <meta
          name="description"
          content="Owner login for the DMV Ranges approval dashboard to review and approve submitted shooting range listings."
        />
      </Helmet>

      <header className="bg-[#2a3340]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/40">
              <Crosshair className="h-6 w-6 text-white" strokeWidth={1.75} />
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-extrabold tracking-wide text-white">
                DMV<span className="text-[#8fa3b8]">RANGES</span>
              </span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-white/70">
                DC · Maryland · Virginia directory
              </span>
            </span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm rounded-lg border border-[#d4dde4] bg-white p-8 shadow-sm">
          <h1 className="text-lg font-semibold uppercase tracking-[0.18em] text-[#1a1a1a]">
            Owner Login
          </h1>
          <p className="mt-2 text-sm text-[#555]">
            Sign in to review and approve submitted range listings.
          </p>

          {error && (
            <div className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-[13px] text-[#222]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-9 w-full border border-[#c8c8c8] bg-white px-3 text-sm text-black outline-none focus:border-[#5d7186]"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-[13px] text-[#222]">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-9 w-full border border-[#c8c8c8] bg-white px-3 text-sm text-black outline-none focus:border-[#5d7186]"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-[#5d7186] px-6 py-2.5 text-[13px] tracking-wide text-white shadow-[0_4px_10px_rgba(0,0,0,0.22)] transition hover:bg-[#46586b] disabled:opacity-60"
            >
              {busy ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <Link
            to="/"
            className="mt-6 block text-center text-xs uppercase tracking-wider text-[#5d7186] hover:underline"
          >
            Back to directory
          </Link>
        </div>
      </main>
    </div>
  );
}
