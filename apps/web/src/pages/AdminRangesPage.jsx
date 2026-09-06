import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Crosshair, Check, X, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext';

const STATUS_FILTERS = ['pending', 'approved', 'rejected', 'all'];

function StatusBadge({ status }) {
  const map = {
    pending: { label: 'Pending', cls: 'bg-amber-100 text-amber-800 border-amber-200', Icon: Clock },
    approved: { label: 'Approved', cls: 'bg-emerald-100 text-emerald-800 border-emerald-200', Icon: Check },
    rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-800 border-red-200', Icon: X },
  };
  const s = map[status] || map.pending;
  const Icon = s.Icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.cls}`}>
      <Icon className="h-3 w-3" /> {s.label}
    </span>
  );
}

function DetailRow({ label, value }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="flex gap-2 py-0.5 text-[13px]">
      <span className="w-40 shrink-0 text-[#777]">{label}</span>
      <span className="text-[#222]">{String(value)}</span>
    </div>
  );
}

function listFromJson(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'object') return Object.keys(value).filter((k) => value[k]);
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === 'object') return Object.keys(parsed).filter((k) => parsed[k]);
  } catch (_) {}
  return [];
}

export default function AdminRangesPage() {
  const { user, logout } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [expanded, setExpanded] = useState(null);
  const [notes, setNotes] = useState({});
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const list = await pb.collection('range_submissions').getFullList({
        sort: '-created',
      });
      setRecords(list);
    } catch (err) {
      setError('Could not load submissions. Make sure you are signed in as an admin.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (filter === 'all') return records;
    return records.filter((r) => r.status === filter);
  }, [records, filter]);

  const counts = useMemo(() => {
    const c = { pending: 0, approved: 0, rejected: 0, all: records.length };
    for (const r of records) c[r.status] = (c[r.status] || 0) + 1;
    return c;
  }, [records]);

  const setDecision = async (record, status) => {
    setBusyId(record.id);
    setError('');
    try {
      const updated = await pb.collection('range_submissions').update(record.id, {
        status,
        reviewer_notes: notes[record.id] || '',
        reviewed_by: pb.authStore.record?.id || '',
        reviewed_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
      });
      setRecords((prev) => prev.map((r) => (r.id === record.id ? updated : r)));
      setExpanded(null);
    } catch (err) {
      setError('Failed to update submission. Check your admin permissions.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef2f6] text-[#222]">
      <Helmet>
        <title>Approval Dashboard | DMV Ranges</title>
        <meta
          name="description"
          content="Owner approval dashboard for reviewing, approving, and rejecting shooting range listings submitted to the DMV Ranges directory."
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
                Approval dashboard
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-white/80">
            <span className="hidden sm:inline">{user?.email}</span>
            <button
              onClick={() => logout()}
              className="rounded border border-white/30 px-3 py-1 text-xs uppercase tracking-wider text-white/90 transition hover:bg-white/10"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold uppercase tracking-[0.18em] text-[#1a1a1a]">
            Range Submissions
          </h1>
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition ${
                  filter === s
                    ? 'border-[#5d7186] bg-[#5d7186] text-white'
                    : 'border-[#d4dde4] bg-white text-[#555] hover:border-[#5d7186]'
                }`}
              >
                {s} ({counts[s] ?? 0})
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {loading ? (
          <p className="py-12 text-center text-sm text-[#777]">Loading submissions…</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border border-[#d4dde4] bg-white px-6 py-12 text-center text-sm text-[#777]">
            No {filter === 'all' ? '' : filter} submissions.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => {
              const isOpen = expanded === r.id;
              const comps = listFromJson(r.competitions);
              const svcs = listFromJson(r.services);
              const hunt = listFromJson(r.hunting);
              return (
                <div key={r.id} className="rounded-lg border border-[#d4dde4] bg-white shadow-sm">
                  <button
                    onClick={() => setExpanded(isOpen ? null : r.id)}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="truncate text-[15px] font-semibold text-[#1a1a1a]">
                          {r.range_name}
                        </span>
                        <StatusBadge status={r.status} />
                      </div>
                      <div className="mt-1 text-xs text-[#777]">
                        {[r.city, r.state].filter(Boolean).join(', ')}
                        {r.primary_first_name || r.primary_last_name
                          ? ` · ${r.primary_first_name} ${r.primary_last_name}`.trim()
                          : ''}
                        {r.primary_email ? ` · ${r.primary_email}` : ''}
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 shrink-0 text-[#888]" />
                    ) : (
                      <ChevronDown className="h-5 w-5 shrink-0 text-[#888]" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="border-t border-[#eef2f6] px-5 py-5">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#888]">
                            Facility
                          </h3>
                          <DetailRow label="Applicant title" value={r.title} />
                          <DetailRow label="Facility access" value={r.facility_access} />
                          <DetailRow label="Type of facility" value={r.type_of_facility} />
                          <DetailRow label="Website" value={r.website} />
                          <DetailRow label="General email" value={r.general_email} />
                          <DetailRow label="Handicap accessible" value={r.handicap_accessible} />
                          <DetailRow label="Public access" value={r.public_access} />
                          <DetailRow label="Members only" value={r.members_only} />
                        </div>
                        <div>
                          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#888]">
                            Location & Contact
                          </h3>
                          <DetailRow
                            label="Address"
                            value={[r.street_number, r.street_name, r.city, r.state, r.zip]
                              .filter(Boolean)
                              .join(' ')}
                          />
                          <DetailRow label="Coordinates" value={r.latitude && r.longitude ? `${r.latitude}, ${r.longitude}` : ''} />
                          <DetailRow label="Main phone" value={r.main_phone} />
                          <DetailRow label="Toll free" value={r.toll_free} />
                          <DetailRow label="Fax" value={r.fax} />
                          <DetailRow label="Contact title" value={r.primary_contact_title} />
                          <DetailRow label="Contact phone" value={r.primary_phone} />
                        </div>
                      </div>

                      <div className="mt-5 grid gap-6 md:grid-cols-3">
                        <div>
                          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#888]">
                            Competitions
                          </h3>
                          {comps.length ? (
                            <p className="text-[13px] text-[#333]">{comps.join(', ')}</p>
                          ) : (
                            <p className="text-[13px] text-[#aaa]">None selected</p>
                          )}
                        </div>
                        <div>
                          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#888]">
                            Services
                          </h3>
                          {svcs.length ? (
                            <p className="text-[13px] text-[#333]">{svcs.join(', ')}</p>
                          ) : (
                            <p className="text-[13px] text-[#aaa]">None selected</p>
                          )}
                        </div>
                        <div>
                          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#888]">
                            Hunting
                          </h3>
                          {hunt.length ? (
                            <p className="text-[13px] text-[#333]">{hunt.join(', ')}</p>
                          ) : (
                            <p className="text-[13px] text-[#aaa]">None selected</p>
                          )}
                        </div>
                      </div>

                      {r.status !== 'pending' && (r.reviewer_notes || r.reviewed_at) && (
                        <div className="mt-5 rounded border border-[#eef2f6] bg-[#f8fafc] px-4 py-3">
                          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#888]">
                            Review
                          </h3>
                          {r.reviewer_notes && (
                            <p className="text-[13px] text-[#333]">{r.reviewer_notes}</p>
                          )}
                          {r.reviewed_at && (
                            <p className="mt-1 text-xs text-[#999]">Reviewed: {r.reviewed_at}</p>
                          )}
                        </div>
                      )}

                      <div className="mt-5">
                        <label className="mb-1.5 block text-[13px] text-[#222]">
                          Reviewer notes (sent to submitter on decision)
                        </label>
                        <textarea
                          value={notes[r.id] ?? ''}
                          onChange={(e) =>
                            setNotes((n) => ({ ...n, [r.id]: e.target.value }))
                          }
                          rows={2}
                          className="w-full border border-[#c8c8c8] bg-white px-3 py-2 text-sm text-black outline-none focus:border-[#5d7186]"
                          placeholder="Optional message for the submitter…"
                        />
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          onClick={() => setDecision(r, 'approved')}
                          disabled={busyId === r.id}
                          className="inline-flex items-center gap-1.5 bg-emerald-600 px-6 py-2 text-[13px] tracking-wide text-white transition hover:bg-emerald-700 disabled:opacity-60"
                        >
                          <Check className="h-4 w-4" /> Approve
                        </button>
                        <button
                          onClick={() => setDecision(r, 'rejected')}
                          disabled={busyId === r.id}
                          className="inline-flex items-center gap-1.5 bg-[#b03a3a] px-6 py-2 text-[13px] tracking-wide text-white transition hover:bg-[#962f2f] disabled:opacity-60"
                        >
                          <X className="h-4 w-4" /> Reject
                        </button>
                        {r.status !== 'pending' && (
                          <button
                            onClick={() => setDecision(r, 'pending')}
                            disabled={busyId === r.id}
                            className="inline-flex items-center gap-1.5 border border-[#c8c8c8] bg-white px-6 py-2 text-[13px] tracking-wide text-[#555] transition hover:border-[#5d7186] disabled:opacity-60"
                          >
                            <Clock className="h-4 w-4" /> Reset to pending
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
