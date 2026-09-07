import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  Crosshair,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Target,
  ExternalLink,
} from 'lucide-react';
import { RANGES, haversineMiles } from '@/data/ranges';
import Seo from '@/components/Seo';
import { slugify } from '@/lib/format';

const DC_CENTER = [38.9072, -77.0369];

const STATE_CONFIG = {
  MD: {
    label: 'Maryland',
    title: 'Shooting Ranges in Maryland | Indoor & Outdoor Ranges',
    description:
      'Explore shooting ranges throughout Maryland, including indoor and outdoor facilities, firearm training, rentals, memberships, hours, and visitor information.',
    ogTitle: 'Shooting Ranges in Maryland',
    ogDescription:
      'Find Maryland shooting ranges and compare locations, services, training, memberships, and visitor requirements.',
    heading: 'Shooting Ranges in Maryland',
    intro:
      'Browse indoor and outdoor shooting ranges across Maryland — from Montgomery and Prince George’s County indoor facilities to public outdoor ranges and shotgun sports centers in Carroll and Baltimore counties. Compare range types, services, training, rentals, hours, and visitor requirements.',
    filter: (r) => r.state === 'MD',
    nearby: false,
  },
  VA: {
    label: 'Virginia',
    title: 'Shooting Ranges in Virginia | Find Local Ranges',
    description:
      'Find shooting ranges across Virginia, including indoor and outdoor facilities, firearm training, rentals, memberships, hours, and directions.',
    ogTitle: 'Shooting Ranges in Virginia',
    ogDescription:
      'Compare Virginia shooting ranges by location, range type, services, training, memberships, and visitor information.',
    heading: 'Shooting Ranges in Virginia',
    intro:
      'Browse indoor and outdoor shooting ranges across Northern and Central Virginia — from public indoor ranges in Fairfax, Ashburn, and Manassas to private outdoor clubs with rifle, pistol, shotgun, and archery facilities. Compare services, training, rentals, memberships, hours, and directions.',
    filter: (r) => r.state === 'VA',
    nearby: false,
  },
  DC: {
    label: 'Washington, DC',
    title: 'Shooting Ranges Near Washington, DC | Find Local Facilities',
    description:
      'Find shooting ranges near Washington, DC, including facilities in the surrounding Maryland and Virginia area. Compare services, training, rentals, hours, and directions.',
    ogTitle: 'Shooting Ranges Near Washington, DC',
    ogDescription:
      'Explore shooting ranges near Washington, DC, with information about locations, training, rentals, memberships, hours, and visitor requirements.',
    heading: 'Shooting Ranges Near Washington, DC',
    intro:
      'There are no public shooting ranges inside the District of Columbia itself. The closest options are in nearby Maryland and Northern Virginia — use this directory to compare facilities within easy driving distance of DC, including services, training, rentals, hours, and directions.',
    filter: () => true,
    nearby: true,
  },
};

export default function StatePage({ stateCode }) {
  const cfg = STATE_CONFIG[stateCode];
  const [expandedId, setExpandedId] = useState(null);

  const ranges = useMemo(() => {
    let list = RANGES.filter(cfg.filter).map((r) => ({
      ...r,
      distance: cfg.nearby ? haversineMiles(DC_CENTER[0], DC_CENTER[1], r.lat, r.lng) : null,
    }));
    if (cfg.nearby) list = list.sort((a, b) => a.distance - b.distance);
    else list = list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [cfg]);

  return (
    <div className="min-h-screen bg-white text-[#2f3b3a]">
      <Helmet>
        <title>{cfg.title}</title>
        <meta name="description" content={cfg.description} />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Seo
        title={cfg.ogTitle}
        description={cfg.ogDescription}
        siteName="DMV Ranges"
        type="website"
      />

      {/* Header */}
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
          <nav className="hidden items-center gap-6 text-sm font-medium text-white md:flex">
            <Link to="/" className="transition hover:text-[#8fa3b8]">Home</Link>
            <Link to="/maryland" className="transition hover:text-[#8fa3b8]">Maryland</Link>
            <Link to="/virginia" className="transition hover:text-[#8fa3b8]">Virginia</Link>
            <Link to="/washington-dc" className="transition hover:text-[#8fa3b8]">Washington DC</Link>
            <Link
              to="/list-your-range"
              className="rounded border border-white/60 px-4 py-2 transition hover:bg-white hover:text-[#2f3b3a]"
            >
              List Your Range
            </Link>
          </nav>
        </div>
      </header>

      {/* Banner */}
      <section className="bg-[#3a4757] px-6 py-16 text-center text-white">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">
          DC · Maryland · Virginia directory
        </p>
        <h1 className="font-display mt-3 text-3xl italic tracking-[0.06em] sm:text-5xl">
          {cfg.heading}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
          {cfg.intro}
        </p>
      </section>

      {/* Range list */}
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-[#2f3b3a]">
            {ranges.length} range{ranges.length === 1 ? '' : 's'} listed
          </h2>
          <Link
            to="/"
            className="text-sm font-medium text-[#40554f] transition hover:text-[#2f3b3a]"
          >
            ← Back to full directory
          </Link>
        </div>

        <div className="overflow-hidden rounded-sm ring-1 ring-black/5">
          <ul className="divide-y divide-[#e4eae4] bg-white">
            {ranges.map((r, i) => {
              const expanded = expandedId === r.id;
              return (
                <li key={r.id} id={`range-${r.id}`}>
                  <button
                    type="button"
                    onClick={() => setExpandedId(expanded ? null : r.id)}
                    className="flex w-full items-start gap-4 p-5 text-left transition hover:bg-[#f4f7f3]"
                  >
                    <span
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                        r.access === 'public' ? 'bg-[#4a6b66]' : 'bg-[#2f3b3a]'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-[15px] font-semibold">{r.name}</span>
                        <span className="shrink-0 rounded-sm bg-[#eef3ee] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#4a6b66]">
                          {r.type}
                        </span>
                      </span>
                      <span className="mt-1 block text-sm text-[#5c6a58]">
                        {r.address}
                        <br />
                        {r.city}, {r.state}, {r.zip}
                        <br />
                        {r.phone}
                        {r.distance != null && (
                          <span className="mt-0.5 block font-medium text-[#4a6b66]">
                            {r.distance.toFixed(1)} miles from DC
                          </span>
                        )}
                      </span>
                    </span>
                    <ChevronDown
                      className={`mt-2 h-4 w-4 shrink-0 text-[#8a968c] transition-transform ${
                        expanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expanded && (
                    <div className="border-t border-[#e4eae4] bg-[#f8faf7] px-5 py-4 pl-[4.5rem]">
                      <p className="text-sm leading-relaxed text-[#5c6a58]">{r.description}</p>
                      <dl className="mt-3 space-y-1.5 text-sm">
                        <div className="flex items-center gap-2 text-[#5c6a58]">
                          <Clock className="h-3.5 w-3.5 text-[#4a6b66]" /> {r.hours}
                        </div>
                        <div className="flex items-center gap-2 text-[#5c6a58]">
                          <Target className="h-3.5 w-3.5 text-[#4a6b66]" /> Max distance: {r.distanceMax}
                        </div>
                        <div className="flex items-center gap-2 text-[#5c6a58]">
                          <Mail className="h-3.5 w-3.5 text-[#4a6b66]" /> {r.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-3.5 w-3.5 text-[#4a6b66]" />
                          <a
                            href={r.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#40554f] underline decoration-[#9fc3bd] underline-offset-2 hover:text-[#2f3b3a]"
                          >
                            Visit website
                          </a>
                        </div>
                      </dl>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {r.amenities.map((a) => (
                          <span
                            key={a}
                            className="rounded-sm bg-white px-2 py-0.5 text-[11px] font-medium text-[#5c6a58] ring-1 ring-[#d5ddd5]"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            `${r.name}, ${r.address}, ${r.city}, ${r.state} ${r.zip}`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-sm bg-[#40554f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#35473f]"
                        >
                          <MapPin className="h-3.5 w-3.5" /> Get Directions
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <Link
                          to={`/ranges/${slugify(r.name)}`}
                          className="inline-flex items-center gap-1.5 rounded-sm border border-[#40554f] px-4 py-2 text-xs font-semibold text-[#40554f] transition hover:bg-[#40554f] hover:text-white"
                        >
                          View full details
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Cross-links */}
        <div className="mt-10 flex flex-wrap items-center gap-3 text-sm">
          <span className="font-semibold uppercase tracking-wider text-[#8a968c]">
            Also browse:
          </span>
          {stateCode !== 'MD' && (
            <Link to="/maryland" className="font-medium text-[#40554f] hover:text-[#2f3b3a]">
              Maryland ranges
            </Link>
          )}
          {stateCode !== 'VA' && (
            <Link to="/virginia" className="font-medium text-[#40554f] hover:text-[#2f3b3a]">
              Virginia ranges
            </Link>
          )}
          {stateCode !== 'DC' && (
            <Link to="/washington-dc" className="font-medium text-[#40554f] hover:text-[#2f3b3a]">
              Ranges near Washington, DC
            </Link>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-5 text-xs font-semibold uppercase tracking-wider">
          <span className="text-white/90">Also of Interest:</span>
          <Link to="/maryland" className="text-white/60 transition hover:text-white">Maryland Ranges</Link>
          <Link to="/virginia" className="text-white/60 transition hover:text-white">Virginia Ranges</Link>
          <Link to="/washington-dc" className="text-white/60 transition hover:text-white">Washington DC Ranges</Link>
          <Link to="/list-your-range" className="text-white/60 transition hover:text-white">List Your Range</Link>
          <Link to="/login" className="text-white/60 transition hover:text-white">Owner Login</Link>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-4 text-xs text-white/50">
            <span>© {new Date().getFullYear()} DMV Ranges — Where to Shoot in DC, Maryland & Virginia.</span>
            <span>Always follow range rules and applicable local laws.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
