import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import {
  Crosshair,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Target,
  ExternalLink,
  ChevronRight,
  Building2,
  Users,
} from 'lucide-react';
import { RANGES } from '@/data/ranges';
import Seo from '@/components/Seo';
import { slugify } from '@/lib/format';

const STATE_LINK = {
  MD: { to: '/maryland', label: 'Maryland' },
  VA: { to: '/virginia', label: 'Virginia' },
  DC: { to: '/washington-dc', label: 'Washington, DC' },
};

export default function RangeDetailPage() {
  const { slug } = useParams();

  const range = useMemo(
    () => RANGES.find((r) => slugify(r.name) === slug),
    [slug]
  );

  if (!range) {
    return (
      <div className="flex min-h-screen flex-col bg-white text-[#2f3b3a]">
        <Helmet>
          <title>Range Not Found | DMV Ranges</title>
          <meta name="description" content="The shooting range you were looking for could not be found. Browse the full DMV directory of ranges in Maryland, Virginia, and near Washington, DC." />
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <header className="bg-[#2a3340]">
          <div className="mx-auto flex max-w-6xl items-center px-6 py-5">
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/40">
                <Crosshair className="h-6 w-6 text-white" strokeWidth={1.75} />
              </span>
              <span className="block text-lg font-extrabold tracking-wide text-white">
                DMV<span className="text-[#8fa3b8]">RANGES</span>
              </span>
            </Link>
          </div>
        </header>
        <main className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
          <Target className="h-12 w-12 text-[#9fc3bd]" strokeWidth={1.5} />
          <h1 className="mt-5 text-2xl font-semibold">Range not found</h1>
          <p className="mt-3 text-sm text-[#5c6a58]">
            We couldn’t find that range. It may have been renamed or removed.
          </p>
          <Link
            to="/"
            className="mt-8 rounded-sm bg-[#40554f] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#35473f]"
          >
            Back to directory
          </Link>
        </main>
      </div>
    );
  }

  const stateLink = STATE_LINK[range.state] || STATE_LINK.DC;
  const title = `${range.name} in ${range.city}, ${range.state} | Hours, Services & Directions`;
  const description = `View ${range.name} in ${range.city}, ${range.state}. Check range types, available services, training, rentals, hours, visitor requirements, contact details, and directions.`;
  const ogTitle = `${range.name} in ${range.city}, ${range.state}`;
  const ogDescription = `Get accurate details about ${range.name}, including services, hours, requirements, contact information, and directions.`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${range.name}, ${range.address}, ${range.city}, ${range.state} ${range.zip}`
  )}`;

  const related = RANGES.filter(
    (r) => r.state === range.state && r.id !== range.id
  )
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white text-[#2f3b3a]">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Seo
        title={ogTitle}
        description={ogDescription}
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

      {/* Breadcrumb */}
      <div className="border-b border-[#e4eae4] bg-[#eef2f6]">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-1.5 px-6 py-3 text-xs text-[#5c6a58]">
          <Link to="/" className="transition hover:text-[#40554f]">Home</Link>
          <ChevronRight className="h-3 w-3 text-[#9aa894]" />
          <Link to={stateLink.to} className="transition hover:text-[#40554f]">
            {stateLink.label}
          </Link>
          <ChevronRight className="h-3 w-3 text-[#9aa894]" />
          <span className="font-medium text-[#2f3b3a]">{range.name}</span>
        </nav>
      </div>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left: details */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-sm bg-[#eef3ee] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#4a6b66]">
                {range.type} range
              </span>
              <span className="rounded-sm bg-[#eef3ee] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#4a6b66]">
                {range.access === 'public' ? 'Open to public' : 'Members only'}
              </span>
            </div>
            <h1 className="font-display mt-4 text-3xl italic tracking-[0.04em] text-[#2f3b3a] sm:text-4xl">
              {range.name}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-[#5c6a58]">
              <MapPin className="h-4 w-4 text-[#4a6b66]" />
              {range.address}, {range.city}, {range.state} {range.zip}
            </p>

            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-[#3a4757]">
              {range.description}
            </p>

            {/* Quick facts */}
            <div className="mt-8 grid gap-px overflow-hidden rounded-sm ring-1 ring-[#d5ddd5] sm:grid-cols-2">
              <Fact icon={Clock} label="Hours" value={range.hours} />
              <Fact icon={Target} label="Maximum distance" value={range.distanceMax} />
              <Fact
                icon={Building2}
                label="Range type"
                value={`${range.type} — ${range.access === 'public' ? 'open to the public' : 'members only'}`}
              />
              <Fact icon={Users} label="Access" value={range.access === 'public' ? 'Public' : 'Members only'} />
            </div>

            {/* Amenities */}
            <h2 className="mt-10 text-sm font-bold uppercase tracking-[0.25em] text-[#2f3b3a]">
              Services &amp; amenities
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {range.amenities.map((a) => (
                <span
                  key={a}
                  className="rounded-sm bg-[#eef3ee] px-3 py-1 text-xs font-medium text-[#4a6b66] ring-1 ring-[#d5ddd5]"
                >
                  {a}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-sm bg-[#40554f] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#35473f] active:scale-[0.98]"
              >
                <MapPin className="h-4 w-4" /> Get Directions
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <a
                href={range.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-sm border border-[#40554f] px-6 py-2.5 text-sm font-semibold text-[#40554f] transition hover:bg-[#40554f] hover:text-white"
              >
                <Globe className="h-4 w-4" /> Visit website
              </a>
            </div>
          </div>

          {/* Right: contact card */}
          <aside className="lg:col-span-1">
            <div className="rounded-sm bg-[#eef2f6] p-6 ring-1 ring-[#d4dde4]">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#2f3b3a]">
                Contact &amp; location
              </h2>
              <dl className="mt-5 space-y-4 text-sm">
                <ContactRow icon={MapPin} label="Address">
                  {range.address}
                  <br />
                  {range.city}, {range.state} {range.zip}
                </ContactRow>
                <ContactRow icon={Phone} label="Phone">
                  <a href={`tel:${range.phone.replace(/[^0-9+]/g, '')}`} className="transition hover:text-[#40554f]">
                    {range.phone}
                  </a>
                </ContactRow>
                <ContactRow icon={Mail} label="Email">
                  <a href={`mailto:${range.email}`} className="break-all transition hover:text-[#40554f]">
                    {range.email}
                  </a>
                </ContactRow>
                <ContactRow icon={Globe} label="Website">
                  <a
                    href={range.website}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-[#40554f] underline decoration-[#9fc3bd] underline-offset-2 hover:text-[#2f3b3a]"
                  >
                    {range.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </a>
                </ContactRow>
                <ContactRow icon={Clock} label="Hours">
                  {range.hours}
                </ContactRow>
              </dl>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-[#8a968c]">
              Hours, services, and visitor requirements can change. Always confirm details
              directly with {range.name} before visiting, and follow all range rules and
              applicable local laws.
            </p>
          </aside>
        </div>

        {/* Related ranges */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-[#e4eae4] pt-10">
            <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-[#2f3b3a]">
              More ranges in {stateLink.label}
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    to={`/ranges/${slugify(r.name)}`}
                    className="flex items-center justify-between rounded-sm border border-[#d5ddd5] bg-white px-4 py-3 text-sm transition hover:border-[#40554f] hover:bg-[#f4f7f3]"
                  >
                    <span>
                      <span className="block font-semibold text-[#2f3b3a]">{r.name}</span>
                      <span className="block text-xs text-[#5c6a58]">
                        {r.city}, {r.state} · {r.type}
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-[#9aa894]" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
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

function Fact({ icon: Icon, label, value }) {
  return (
    <div className="bg-white px-4 py-3.5">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#8a968c]">
        <Icon className="h-3.5 w-3.5 text-[#4a6b66]" /> {label}
      </div>
      <div className="mt-1 text-sm text-[#2f3b3a]">{value}</div>
    </div>
  );
}

function ContactRow({ icon: Icon, label, children }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#4a6b66]" />
      <div>
        <dt className="text-[11px] font-semibold uppercase tracking-wider text-[#8a968c]">{label}</dt>
        <dd className="mt-0.5 text-[#2f3b3a]">{children}</dd>
      </div>
    </div>
  );
}
