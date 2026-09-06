import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  Crosshair,
  Scale,
  Gavel,
  Landmark,
  FileText,
  Calendar,
  Users,
  ExternalLink,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import Seo from '@/components/Seo';

const LAST_REVIEWED = 'September 2026';

const RECENT_UPDATES = [
  {
    date: '2025–2026',
    title: 'Maryland permit-to-purchase and carry framework',
    summary:
      'Maryland continues to administer its Handgun Qualification License (HQL) and wear-and-carry permit system. Following the Supreme Court’s 2022 ruling in New York State Rifle & Pistol Assn. v. Bruen, Maryland adjusted its carry-permit standards to remove the “good and substantial reason” requirement. Application volumes and processing timelines have changed as a result.',
    source: 'Maryland State Police, Licensing Division',
    href: 'https://mdsp.maryland.gov/OrganizationalStructure/SupportServicesBureau/LicensingDivision/Pages/default.aspx',
  },
  {
    date: '2024–2026',
    title: 'Virginia firearm transaction and carry policy changes',
    summary:
      'Virginia has seen shifts in its handgun-purchase limit law and concealed-handgun-permit reciprocity framework across recent legislative sessions. The state’s background-check process for private sales and the handling of permit applications are administered by the Virginia State Police Firearms Transaction Center.',
    source: 'Virginia State Police, Firearms Transaction Center',
    href: 'https://vsp.virginia.gov/firearms-transaction-center/',
  },
  {
    date: '2025–2026',
    title: 'District of Columbia firearm registration and carry licensing',
    summary:
      'The District of Columbia maintains a firearm-registration system and a concealed-carry license program administered by the Metropolitan Police Department. Application requirements, training standards, and approved-firearm lists are periodically updated; readers should confirm current procedures directly with MPD.',
    source: 'DC Metropolitan Police Department, Firearms Registration',
    href: 'https://mpdc.dc.gov/service/firearms-registration',
  },
];

const COURT_DECISIONS = [
  {
    case: 'New York State Rifle & Pistol Assn. v. Bruen (2022)',
    summary:
      'The U.S. Supreme Court held that firearm-carry regulations must be consistent with the historical tradition of firearm regulation. This decision prompted Maryland, Virginia, and DC to revisit their concealed-carry licensing standards.',
  },
  {
    case: 'District of Columbia v. Heller (2008)',
    summary:
      'The Supreme Court recognized an individual right to keep a handgun in the home for self-defense under the Second Amendment, the foundation for subsequent challenges to local firearm laws in the District.',
  },
  {
    case: 'McDonald v. City of Chicago (2010)',
    summary:
      'The Court applied the Second Amendment to state and local governments through the Fourteenth Amendment, shaping how Maryland and Virginia firearm laws may be challenged.',
  },
  {
    case: 'Maryland assault-weapon and magazine litigation',
    summary:
      'Maryland’s Firearm Safety Act provisions have been the subject of ongoing litigation in federal courts. Courts have issued rulings at various stages; the status of specific provisions should be verified through current court records.',
  },
];

const STATE_LAWS = [
  {
    state: 'Maryland',
    icon: Landmark,
    points: [
      'Handgun Qualification License (HQL) required to purchase or rent a handgun.',
      'Wear-and-carry permit required to carry a handgun; training and background checks apply.',
      'Regulated firearms (certain semi-automatic rifles and shotguns) are subject to additional restrictions.',
      'Private firearm transfers generally require a background check through a licensed dealer or the Maryland State Police.',
      'Carry is prohibited in specified sensitive locations; consult current statutes for the list.',
    ],
    href: 'https://mdsp.maryland.gov/OrganizationalStructure/SupportServicesBureau/LicensingDivision/Pages/default.aspx',
    label: 'Maryland State Police — Licensing Division',
  },
  {
    state: 'Virginia',
    icon: Landmark,
    points: [
      'No permit required to purchase a firearm, but a background check is conducted through the Virginia State Police.',
      'Concealed Handgun Permit (CHP) issued by the circuit court; training and background requirements apply.',
      'Open carry is generally permitted for individuals 18 and older who may lawfully possess a firearm.',
      'Reciprocity for out-of-state concealed-carry permits is recognized for many states; verify current reciprocity lists.',
      'Certain locations (schools, courthouses, government buildings) restrict possession.',
    ],
    href: 'https://vsp.virginia.gov/firearms-transaction-center/',
    label: 'Virginia State Police — Firearms Transaction Center',
  },
  {
    state: 'Washington, DC',
    icon: Landmark,
    points: [
      'All firearms must be registered with the Metropolitan Police Department before possession.',
      'A Concealed Carry License (CCL) is required to carry a firearm; application, training, and background checks apply.',
      'Only firearms on the MPD-approved roster may generally be registered.',
      'Carry is prohibited in numerous sensitive locations defined by DC law.',
      'Ammunition purchases are tied to registered firearms; confirm current procedures with MPD.',
    ],
    href: 'https://mpdc.dc.gov/service/firearms-registration',
    label: 'DC MPD — Firearms Registration',
  },
];

const AFFECTED = [
  'First-time firearm purchasers applying for licenses or permits.',
  'Current permit holders whose credentials may be subject to renewal or reciprocity changes.',
  'Range owners and instructors adapting training requirements to updated standards.',
  'Visitors and travelers crossing DC, Maryland, and Virginia with firearms.',
  'Individuals seeking to carry for self-defense under each jurisdiction’s licensing rules.',
];

const OFFICIAL_SOURCES = [
  { label: 'Maryland State Police — Licensing Division', href: 'https://mdsp.maryland.gov/OrganizationalStructure/SupportServicesBureau/LicensingDivision/Pages/default.aspx' },
  { label: 'Virginia State Police — Firearms Transaction Center', href: 'https://vsp.virginia.gov/firearms-transaction-center/' },
  { label: 'DC Metropolitan Police Department — Firearms Registration', href: 'https://mpdc.dc.gov/service/firearms-registration' },
  { label: 'Maryland General Assembly — Statutes', href: 'https://mgaleg.maryland.gov/' },
  { label: 'Virginia Legislative Information System', href: 'https://lis.virginia.gov/' },
  { label: 'DC Council — Code of the District of Columbia', href: 'https://code.dccouncil.gov/' },
  { label: 'U.S. Supreme Court — Opinions', href: 'https://www.supremecourt.gov/opinions/opinions.aspx' },
  { label: 'ATF — Federal Firearms Regulations', href: 'https://www.atf.gov/rules-and-regulations' },
];

export default function FirearmsLawPage() {
  return (
    <div className="min-h-screen bg-white text-[#2f3b3a]">
      <Helmet>
        <title>Firearms Law Updates & Second Amendment Rights | Maryland, Virginia & DC</title>
        <meta
          name="description"
          content="Follow major firearms law updates and Second Amendment developments affecting Maryland, Virginia, and Washington, DC. Review official sources and practical summaries."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Seo
        title="Firearms Law Updates & Second Amendment Rights"
        description="Track important firearms legislation, court decisions, and Second Amendment developments across Maryland, Virginia, and Washington, DC."
        siteName="DMV Ranges"
        type="article"
      />

      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/40">
              <Crosshair className="h-6 w-6 text-white" strokeWidth={1.75} />
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-extrabold tracking-wide text-white">
                DMV<span className="text-[#9fc3bd]">RANGES</span>
              </span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-white/70">
                DC · Maryland · Virginia directory
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-white md:flex">
            <Link to="/" className="transition hover:text-[#9fc3bd]">Find a Range</Link>
            <Link to="/list-your-range" className="transition hover:text-[#9fc3bd]">List Your Range</Link>
            <span className="h-5 w-px bg-white/30" />
            <Link
              to="/firearms-law"
              className="rounded border border-white/60 px-4 py-2 transition hover:bg-white hover:text-[#2f3b3a]"
            >
              Firearms Law
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-[52vh] items-center justify-center overflow-hidden bg-[#3a4757] px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3a4757] via-[#46586b] to-[#2f3a47]" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-10 bottom-0 h-80 w-80 rounded-full bg-[#9fc3bd]/20 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 ring-1 ring-white/30">
            <Scale className="h-3.5 w-3.5" /> Informational Resource
          </span>
          <h1 className="font-display mt-6 text-3xl italic tracking-[0.08em] text-white sm:text-5xl">
            Firearms Law &amp; Second Amendment Updates
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/80">
            Major legal developments affecting firearm owners, ranges, and instructors across
            Maryland, Virginia, and Washington, DC.
          </p>
        </div>
      </section>

      {/* Notice */}
      <div className="border-b border-[#d4dde4] bg-[#eef2f6]">
        <div className="mx-auto flex max-w-5xl items-start gap-3 px-6 py-4 text-sm text-[#46586b]">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#46586b]" />
          <p>
            <strong className="font-semibold">Informational only.</strong> This page summarizes
            publicly reported legal developments for general awareness. Laws and court rulings
            change frequently and vary by jurisdiction. It is not legal advice. For guidance on your
            specific situation, consult a qualified attorney or the official government source
            linked below.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-6 py-16">
        {/* Recent updates */}
        <section id="recent" className="scroll-mt-24">
          <SectionHeading
            kicker="Recent firearms law updates"
            icon={FileText}
            title="Recent firearms law updates"
          />
          <div className="mt-8 space-y-6">
            {RECENT_UPDATES.map((u) => (
              <article
                key={u.title}
                className="rounded-sm border border-[#d4dde4] bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-sm bg-[#eef2f6] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[#46586b]">
                    <Calendar className="h-3.5 w-3.5" /> {u.date}
                  </span>
                  <h3 className="text-lg font-semibold text-[#2f3a47]">{u.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#5c6a58]">{u.summary}</p>
                <a
                  href={u.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#46586b] underline decoration-[#8fa3b8] underline-offset-2 transition hover:text-[#2f3a47]"
                >
                  {u.source} <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* Court decisions */}
        <section id="court" className="mt-20 scroll-mt-24">
          <SectionHeading
            kicker="Major Second Amendment court decisions"
            icon={Gavel}
            title="Major Second Amendment court decisions"
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {COURT_DECISIONS.map((c) => (
              <div
                key={c.case}
                className="rounded-sm border border-[#d4dde4] bg-[#eef2f6] p-6"
              >
                <h3 className="font-display text-lg italic text-[#2f3a47]">{c.case}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#5c6a58]">{c.summary}</p>
              </div>
            ))}
          </div>
        </section>

        {/* State laws */}
        <section id="states" className="mt-20 scroll-mt-24">
          <SectionHeading
            kicker="Jurisdiction summaries"
            icon={Landmark}
            title="Maryland, Virginia & DC firearms laws"
          />
          <div className="mt-8 space-y-6">
            {STATE_LAWS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.state}
                  className="overflow-hidden rounded-sm border border-[#d4dde4] bg-white shadow-sm"
                >
                  <div className="flex items-center gap-3 bg-[#46586b] px-6 py-4 text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                    <h3 className="text-lg font-semibold tracking-wide">{s.state} firearms laws</h3>
                  </div>
                  <ul className="space-y-3 px-6 py-5">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-sm leading-relaxed text-[#5c6a58]">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#46586b]" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-[#d4dde4] px-6 py-4">
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#46586b] underline decoration-[#8fa3b8] underline-offset-2 transition hover:text-[#2f3a47]"
                    >
                      {s.label} <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* What changed & who is affected */}
        <section id="impact" className="mt-20 grid gap-8 md:grid-cols-2">
          <div className="rounded-sm border border-[#d4dde4] bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef2f6] text-[#46586b]">
                <Calendar className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold text-[#2f3a47]">What changed and when</h3>
            </div>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[#5c6a58]">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#46586b]" />
                <span><strong className="font-semibold text-[#2f3a47]">2022:</strong> Bruen decision reshaped carry-permit standards nationwide, including in MD, VA, and DC.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#46586b]" />
                <span><strong className="font-semibold text-[#2f3a47]">2023–2024:</strong> Adjustments to sensitive-location carry restrictions and application processing across the region.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#46586b]" />
                <span><strong className="font-semibold text-[#2f3a47]">2025–2026:</strong> Ongoing legislative sessions and litigation continue to affect purchase, registration, and carry procedures.</span>
              </li>
            </ul>
          </div>
          <div className="rounded-sm border border-[#d4dde4] bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef2f6] text-[#46586b]">
                <Users className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold text-[#2f3a47]">Who may be affected</h3>
            </div>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[#5c6a58]">
              {AFFECTED.map((a) => (
                <li key={a} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#46586b]" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Official sources */}
        <section id="sources" className="mt-20 scroll-mt-24">
          <SectionHeading
            kicker="Primary references"
            icon={ShieldCheck}
            title="Official government and court sources"
          />
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {OFFICIAL_SOURCES.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between gap-3 rounded-sm border border-[#d4dde4] bg-white px-5 py-4 text-sm font-medium text-[#2f3a47] shadow-sm transition hover:border-[#46586b] hover:shadow-md"
              >
                <span>{s.label}</span>
                <ExternalLink className="h-4 w-4 shrink-0 text-[#8fa3b8] transition group-hover:text-[#46586b]" />
              </a>
            ))}
          </div>
        </section>

        {/* Last reviewed */}
        <section className="mt-20 rounded-sm bg-[#46586b] px-8 py-10 text-center text-white">
          <div className="flex items-center justify-center gap-2 text-sm uppercase tracking-[0.2em] text-white/70">
            <Calendar className="h-4 w-4" /> Last reviewed
          </div>
          <p className="font-display mt-3 text-2xl italic">{LAST_REVIEWED}</p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/80">
            This page is reviewed periodically, but legal developments can occur at any time. Always
            confirm current requirements with the official government source or a qualified
            attorney before acting.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-5 text-xs font-semibold uppercase tracking-wider">
          <span className="text-white/90">Also of Interest:</span>
          <Link to="/" className="text-white/60 transition hover:text-white">Find a Range</Link>
          <Link to="/maryland" className="text-white/60 transition hover:text-white">Maryland Ranges</Link>
          <Link to="/virginia" className="text-white/60 transition hover:text-white">Virginia Ranges</Link>
          <Link to="/washington-dc" className="text-white/60 transition hover:text-white">Washington DC Ranges</Link>
          <Link to="/firearms-law" className="text-white/60 transition hover:text-white">Firearms Law</Link>
          <Link to="/list-your-range" className="text-white/60 transition hover:text-white">List Your Range</Link>
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

function SectionHeading({ kicker, title, icon: Icon }) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eef2f6] text-[#46586b]">
        <Icon className="h-6 w-6" strokeWidth={1.75} />
      </span>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#8fa3b8]">{kicker}</p>
        <h2 className="font-display mt-1 text-2xl italic text-[#2f3a47] sm:text-3xl">{title}</h2>
      </div>
    </div>
  );
}
