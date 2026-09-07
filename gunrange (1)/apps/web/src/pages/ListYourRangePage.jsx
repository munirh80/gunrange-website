import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Crosshair, ChevronLeft, ChevronRight } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const HERO_IMG =
  'https://www.wheretoshoot.org/wp-content/uploads/2017/08/Resources-Header-Image-with-overlay.jpg';

const US_STATES = [
  'AL','AK','AR','AZ','CA','CO','CT','DC','DE','FL','GA','HI','IA','ID','IL','IN','KS','KY','LA',
  'MA','MD','ME','MI','MN','MO','MS','MT','NC','NE','NH','NJ','NM','NV','NY','ND','OH','OK','OR',
  'PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WI','WV','WY',
];

const YES_NO = ['', 'Yes', 'No'];
const DIST_IN = ['', '50 ft', '75 ft', '50 yd/mtr', '100 yd/mtr', '150 yd/mtr', '200 yd/mtr'];
const DIST_OUT = [
  '',
  '50 ft',
  '75 ft',
  '50 yd/mtr',
  '100 yd/mtr',
  '200 yd/mtr',
  '300 yd/mtr',
  '500 yd/mtr',
  '1000 yd/mtr',
];
const PHONE_TYPES = [
  '',
  'Daytime',
  'Cell',
  'Registration',
  'Evening',
  'General',
  'Primary',
  'Secondary',
  'Range',
  'Contact',
  'Info',
  'Voicemail',
  'Clubhouse',
];
const CONTACT_TITLES = [
  '',
  'Owner',
  'Full-Time Paid Manager',
  'Part-Time Paid Manager',
  'Volunteer (Club Officer, etc.)',
];

const TOTAL_STEPS = 15;

const initialForm = {
  title: '',
  range_name: '',
  general_email: '',
  email_on_web: false,
  website: '',
  website_on_web: false,
  facility_access: '',
  type_of_facility: '',
  commercial_range: false,
  law_enforcement_facility: false,
  municipal_facility: false,
  gun_sportsmans_club: false,
  military_facility: false,
  hunting_preserve: false,
  handicap_accessible: '',
  public_access: '',
  members_only: '',
  memberships_available: '',
  events_open_to_public: '',
  address: '',
  street_number: '',
  street_name: '',
  city: '',
  state: '',
  country: '',
  zip: '',
  latitude: '',
  longitude: '',
  mailing_address: '',
  mailing_city: '',
  mailing_state: '',
  mailing_zip: '',
  mailing_country: '',
  main_phone: '',
  main_phone_on_web: false,
  toll_free: '',
  toll_free_on_web: false,
  fax: '',
  fax_on_web: false,
  other_phone: '',
  other_phone_type: '',
  other_phone_on_web: false,
  primary_first_name: '',
  primary_last_name: '',
  primary_email: '',
  primary_contact_title: '',
  primary_phone: '',
  primary_address: '',
  primary_city: '',
  primary_state: '',
  primary_zip: '',
  primary_country: 'USA',
  bullet_points: true,
  first_shots: true,
  pull_the_trigger: true,
  trap: false,
  skeet: false,
  informal_practice_area: false,
  bunker_trap: false,
  international_skeet: false,
  other_shotgun: false,
  five_stand: false,
  sporting_clays: false,
  cfr_indoor: false,
  cfr_max_indoor: '',
  cfr_outdoor: false,
  cfr_max_outdoor: '',
  handgun_indoor: false,
  handgun_max_indoor: '',
  handgun_outdoor: false,
  handgun_max_outdoor: '',
  archery_indoor: false,
  archery_outdoor_field: false,
  archery_outdoor_3d: false,
  airgun: false,
  muzzle_loaders_outdoor: false,
  range_simulators: false,
  competitions: {},
  services: {},
  hunting: {},
  member_info: false,
  first_shots_program: false,
};

const COMPETITIONS = [
  '3-D Archery',
  '3 Gun / Multi Gun',
  'Airgun',
  'Bench Rest',
  'Cowboy Action Shooting',
  'Handgun Metallic Silhouette',
  'Hi-Power Rifle Matches',
  'Muzzle Loading Events',
  'Practical/Action Pistol',
  'Precision Pistol',
  'Rifle Metallic Silhouette',
  'Rimfire Challenge',
  'Skeet',
  'Smallbore',
  'Sporting Clays/FITASC',
  'Trap',
];

const SERVICES = [
  'Camper/RV Sites',
  'Clubhouse/Lounge/Lodge',
  'Equipment Rentals',
  'Food Service/Snacks',
  'Hunter Education',
  'Instruction Available',
  'Junior Rifle',
  'Lodging Available',
  'Picnic Area',
  'Retail Store',
  "Women's Programs",
  'Youth Programs',
];

const HUNTING = [
  'Chukar',
  'Deer',
  'Dove',
  'Duck',
  'Geese',
  'Grouse',
  'Hun',
  'Partridge',
  'Pheasant',
  'Prairie Chicken',
  'Quail',
  'Sage Grouse',
  'Sharp-Tailed Grouse',
  'Snipe',
  'Turkey',
  'Woodcock',
  'Other',
  'Fishing Opportunities',
];

function FieldLabel({ children, required }) {
  return (
    <span className="mb-1.5 block text-[13px] text-[#222]">
      {children}
      {required ? <span className="text-[#c0392b]">*</span> : null}
    </span>
  );
}

function TextInput({ id, value, onChange, type = 'text', required, readOnly, className = '' }) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      readOnly={readOnly}
      required={required}
      onChange={(e) => onChange(e.target.value)}
      className={`h-9 w-full border border-[#c8c8c8] bg-white px-3 text-xs text-black outline-none focus:border-[#5d7186] ${
        readOnly ? 'bg-[#f3f3f3] text-[#666]' : ''
      } ${className}`}
    />
  );
}

function SelectInput({ id, value, onChange, options, placeholder = 'None', required }) {
  return (
    <select
      id={id}
      value={value}
      required={required}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 w-full appearance-none border border-[#c8c8c8] bg-white bg-[length:12px] bg-[right_12px_center] bg-no-repeat px-3 pr-8 text-xs text-black outline-none focus:border-[#5d7186]"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23333' d='M1 1l5 5 5-5'/%3E%3C/svg%3E\")",
      }}
    >
      <option value="">{placeholder}</option>
      {options
        .filter((o) => o !== '')
        .map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
    </select>
  );
}

function CheckRow({ id, checked, onChange, children }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-2 py-1 text-[13px] text-[#222]">
      <input
        id={id}
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#46586b]"
      />
      <span>{children}</span>
    </label>
  );
}

function Half({ children }) {
  return <div className="min-w-0 flex-1 basis-[calc(50%-0.5rem)]">{children}</div>;
}

function Row({ children }) {
  return <div className="flex flex-wrap gap-x-4 gap-y-4">{children}</div>;
}

function Block({ children, className = '' }) {
  return <div className={`mb-5 ${className}`}>{children}</div>;
}

export default function ListYourRangePage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);
  const [addressError, setAddressError] = useState(false);
  const [addressLookedUp, setAddressLookedUp] = useState(false);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setMap = (group, key, value) =>
    setForm((f) => ({ ...f, [group]: { ...f[group], [key]: value } }));

  const validateStep = (s) => {
    const e = [];
    if (s === 1) {
      if (!form.title) e.push("Applicant's Title is required.");
      if (!form.range_name.trim()) e.push('Shooting Facility/ Range Name is required.');
      if (!form.facility_access) e.push('Facility Access is required.');
      if (!form.type_of_facility) e.push('Type of Facility is required.');
    }
    if (s === 2) {
      if (!form.street_number || !form.city || !form.state || !form.zip) {
        e.push('Please enter a range address and run Address Lookup.');
      }
    }
    if (s === 4) {
      if (!form.main_phone.trim()) e.push('Main Phone is required.');
    }
    if (s === 5) {
      if (!form.primary_first_name.trim()) e.push('First Name is required.');
      if (!form.primary_last_name.trim()) e.push('Last Name is required.');
      if (!form.primary_email.trim()) e.push('Email is required.');
    }
    return e;
  };

  const goNext = () => {
    const e = validateStep(step);
    setErrors(e);
    if (e.length) return;
    setStep((x) => Math.min(TOTAL_STEPS, x + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goPrev = () => {
    setErrors([]);
    setStep((x) => Math.max(1, x - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAddress = () => {
    setForm((f) => ({
      ...f,
      address: '',
      street_number: '',
      street_name: '',
      city: '',
      state: '',
      country: '',
      zip: '',
      latitude: '',
      longitude: '',
    }));
    setAddressLookedUp(false);
    setAddressError(false);
  };

  const addressLookup = () => {
    const raw = form.address.trim();
    if (!raw) {
      setAddressError(true);
      setAddressLookedUp(false);
      return;
    }
    // Lightweight parse for demo (no Google Places key): "123 Main St, City, ST 12345"
    const m = raw.match(
      /^(\d+)\s+([^,]+),\s*([^,]+),\s*([A-Za-z]{2})\s+(\d{5}(?:-\d{4})?)(?:\s*,?\s*(USA|United States))?$/i
    );
    if (!m) {
      setAddressError(true);
      setAddressLookedUp(false);
      return;
    }
    const [, num, street, city, state, zip] = m;
    setForm((f) => ({
      ...f,
      street_number: num,
      street_name: street.trim(),
      city: city.trim(),
      state: state.toUpperCase(),
      country: 'USA',
      zip,
      latitude: '38.9072',
      longitude: '-77.0369',
    }));
    setAddressError(false);
    setAddressLookedUp(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // final required already covered in earlier steps; re-check key ones
    const all = [
      ...validateStep(1),
      ...validateStep(2),
      ...validateStep(4),
      ...validateStep(5),
    ];
    if (all.length) {
      setErrors(all);
      setStep(1);
      return;
    }
    setErrors([]);
    setSubmitError('');
    setSubmitting(true);
    try {
      const payload = { ...form, status: 'pending' };
      // Convert the checkbox-group maps into JSON arrays of selected labels.
      payload.competitions = Object.keys(form.competitions || {}).filter(
        (k) => form.competitions[k],
      );
      payload.services = Object.keys(form.services || {}).filter((k) => form.services[k]);
      payload.hunting = Object.keys(form.hunting || {}).filter((k) => form.hunting[k]);
      await pb.collection('range_submissions').create(payload);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError(
        'We could not submit your listing right now. Please try again in a moment.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const stepTitle = useMemo(() => {
    const titles = {
      1: 'Facility or Range Information',
      2: 'Physical Location Information',
      3: 'Mailing Information',
      4: 'Phone Information',
      5: 'Primary Contact',
      6: 'Publications',
      7: 'Range Details- Shooting Available - Shotgun',
      8: 'Range Details- Shooting Available - Center Fire Rifle',
      9: 'Range Details- Shooting Available - Handgun/Smallbore Rifle',
      10: 'Range Details- Shooting Available - Archery',
      11: 'Range Details - Shooting Available',
      12: 'Organized Competitions',
      13: 'Services Available',
      14: 'Hunting Available',
      15: 'Membership & First Shots',
    };
    return titles[step];
  }, [step]);

  return (
    <div className="min-h-screen bg-white text-[#222]">
      <Helmet>
        <title>List Your Range | DMV Ranges</title>
        <meta
          name="description"
          content="List your shooting range in the DMV directory covering Washington DC, Maryland, and Virginia. Free multi-step facility listing form."
        />
      </Helmet>

      <header className="absolute inset-x-0 top-0 z-30">
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
            <Link to="/#finder" className="transition hover:text-[#8fa3b8]">
              Find a Range
            </Link>
            <span className="h-5 w-px bg-white/30" />
            <span className="text-white/90">List/Edit Your Range</span>
          </nav>
        </div>
      </header>

      <section className="relative flex min-h-[220px] items-center justify-center overflow-hidden bg-[#2a3340] sm:min-h-[280px]">
        <img
          src={HERO_IMG}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/55" />
        <h1 className="relative z-10 px-4 text-center text-2xl font-light uppercase tracking-[0.45em] text-white sm:text-3xl">
          List Your Range
        </h1>
      </section>

      <main className="mx-auto max-w-[720px] px-6 pb-24 pt-14 sm:pt-16">
        {submitted ? (
          <div className="text-center">
            <h2 className="text-lg font-semibold uppercase tracking-[0.2em] text-[#1a1a1a]">
              Thank You
            </h2>
            <p className="mt-4 font-serif text-sm leading-6 text-[#444]">
              Your range listing request has been received and is now pending owner review. A
              confirmation email is on its way. Once our team reviews your submission, you'll get
              an email letting you know whether your listing has been approved and published in the
              DMV directory.
            </p>
            <Link
              to="/"
              className="mt-8 inline-block bg-[#5d7186] px-12 py-2.5 text-[13px] tracking-wide text-white shadow-[0_4px_10px_rgba(0,0,0,0.22)] transition hover:bg-[#46586b]"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <h2 className="mb-8 text-lg font-semibold uppercase tracking-[0.18em] text-[#1a1a1a]">
              {stepTitle}
            </h2>

            {errors.length > 0 && (
              <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                <ul className="list-disc pl-4">
                  {errors.map((err) => (
                    <li key={err}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {submitError && (
              <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {submitError}
              </div>
            )}

            {step === 1 && (
              <>
                <Block>
                  <FieldLabel required>Applicant&apos;s Title</FieldLabel>
                  <SelectInput
                    id="title"
                    value={form.title}
                    onChange={(v) => set('title', v)}
                    options={['Employee', 'Customer', 'Owner']}
                    required
                  />
                </Block>

                <h3 className="mb-3 font-serif text-[28px] font-light tracking-tight text-[#222]">
                  Directions
                </h3>
                <p className="mb-4 font-serif text-sm leading-6 text-[#333]">
                  Range owners, here&apos;s an opportunity to bring more customers to your range. Get
                  listed in the DMV on-line directory of shooting ranges.
                </p>
                <p className="mb-6 font-serif text-sm leading-6 text-[#333]">
                  Please submit this form to be included in the most comprehensive local shooting
                  range directory for Washington DC, Maryland, and Virginia.
                </p>

                <Block>
                  <FieldLabel required>Shooting Facility/ Range Name </FieldLabel>
                  <TextInput
                    id="range_name"
                    value={form.range_name}
                    onChange={(v) => set('range_name', v)}
                    required
                  />
                </Block>

                <Block>
                  <FieldLabel>General Email</FieldLabel>
                  <TextInput
                    id="general_email"
                    type="email"
                    value={form.general_email}
                    onChange={(v) => set('general_email', v)}
                  />
                </Block>
                <Block>
                  <CheckRow
                    id="email_on_web"
                    checked={form.email_on_web}
                    onChange={(v) => set('email_on_web', v)}
                  >
                    Display email on directory listing
                  </CheckRow>
                </Block>

                <Block>
                  <FieldLabel>Web Site Address</FieldLabel>
                  <TextInput
                    id="website"
                    value={form.website}
                    onChange={(v) => set('website', v)}
                  />
                </Block>
                <Block>
                  <CheckRow
                    id="website_on_web"
                    checked={form.website_on_web}
                    onChange={(v) => set('website_on_web', v)}
                  >
                    Display your website on directory listing
                  </CheckRow>
                </Block>

                <Block>
                  <Row>
                    <Half>
                      <FieldLabel required>Facility Access </FieldLabel>
                      <SelectInput
                        id="facility_access"
                        value={form.facility_access}
                        onChange={(v) => set('facility_access', v)}
                        options={['Public', 'Private']}
                        required
                      />
                    </Half>
                    <Half>
                      <FieldLabel required>Type of Facility </FieldLabel>
                      <SelectInput
                        id="type_of_facility"
                        value={form.type_of_facility}
                        onChange={(v) => set('type_of_facility', v)}
                        options={['Indoor', 'Outdoor', 'Indoor/Outdoor']}
                        required
                      />
                    </Half>
                  </Row>
                </Block>

                <Block className="space-y-0.5">
                  <CheckRow
                    id="commercial_range"
                    checked={form.commercial_range}
                    onChange={(v) => set('commercial_range', v)}
                  >
                    Commercial Range
                  </CheckRow>
                  <CheckRow
                    id="law_enforcement_facility"
                    checked={form.law_enforcement_facility}
                    onChange={(v) => set('law_enforcement_facility', v)}
                  >
                    Law Enforcement Facility
                  </CheckRow>
                  <CheckRow
                    id="municipal_facility"
                    checked={form.municipal_facility}
                    onChange={(v) => set('municipal_facility', v)}
                  >
                    Municipal Facility (includes state, county, local government, or parks dept)
                  </CheckRow>
                  <CheckRow
                    id="gun_sportsmans_club"
                    checked={form.gun_sportsmans_club}
                    onChange={(v) => set('gun_sportsmans_club', v)}
                  >
                    Gun/Sportsman&apos;s Club
                  </CheckRow>
                  <CheckRow
                    id="military_facility"
                    checked={form.military_facility}
                    onChange={(v) => set('military_facility', v)}
                  >
                    Military Facility
                  </CheckRow>
                  <CheckRow
                    id="hunting_preserve"
                    checked={form.hunting_preserve}
                    onChange={(v) => set('hunting_preserve', v)}
                  >
                    Hunting Preserve
                  </CheckRow>
                </Block>

                <Block>
                  <Row>
                    <Half>
                      <FieldLabel>Handicap Accessible</FieldLabel>
                      <SelectInput
                        id="handicap_accessible"
                        value={form.handicap_accessible}
                        onChange={(v) => set('handicap_accessible', v)}
                        options={YES_NO}
                      />
                    </Half>
                    <Half>
                      <FieldLabel>Public Access</FieldLabel>
                      <SelectInput
                        id="public_access"
                        value={form.public_access}
                        onChange={(v) => set('public_access', v)}
                        options={YES_NO}
                      />
                    </Half>
                    <Half>
                      <FieldLabel>Members Only</FieldLabel>
                      <SelectInput
                        id="members_only"
                        value={form.members_only}
                        onChange={(v) => set('members_only', v)}
                        options={YES_NO}
                      />
                    </Half>
                    <Half>
                      <FieldLabel>Memberships Available </FieldLabel>
                      <SelectInput
                        id="memberships_available"
                        value={form.memberships_available}
                        onChange={(v) => set('memberships_available', v)}
                        options={YES_NO}
                      />
                    </Half>
                    <Half>
                      <FieldLabel>Host Events Open To Public / Non-Members </FieldLabel>
                      <SelectInput
                        id="events_open_to_public"
                        value={form.events_open_to_public}
                        onChange={(v) => set('events_open_to_public', v)}
                        options={YES_NO}
                      />
                    </Half>
                  </Row>
                </Block>
              </>
            )}

            {step === 2 && (
              <>
                <p className="mb-5 font-serif text-sm leading-6 text-[#333]">
                  Enter the physical address of your range in the &apos;Range Address&apos; box and
                  click &quot;Address Lookup.&quot; The form will populate with the information
                  needed to map your location appropriately. Please note,{' '}
                  <em>only google-validated style addresses are accepted</em> (example:{' '}
                  <span className="whitespace-nowrap">123 Main St, Rockville, MD 20850</span>).
                </p>
                <Block>
                  <FieldLabel required>Range Address </FieldLabel>
                  <TextInput
                    id="address"
                    value={form.address}
                    onChange={(v) => set('address', v)}
                    required
                  />
                </Block>
                <div className="mb-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={clearAddress}
                    className="bg-[#5d7186] px-8 py-2 text-[13px] tracking-wide text-white shadow-[0_4px_10px_rgba(0,0,0,0.22)] transition hover:bg-[#46586b]"
                  >
                    Clear Address
                  </button>
                  <button
                    type="button"
                    onClick={addressLookup}
                    className="bg-[#5d7186] px-8 py-2 text-[13px] tracking-wide text-white shadow-[0_4px_10px_rgba(0,0,0,0.22)] transition hover:bg-[#46586b]"
                  >
                    Address Lookup
                  </button>
                </div>
                {addressError && (
                  <div className="mb-6 text-sm text-[#c0392b]">
                    The address you entered cannot be validated and mapped properly. Use the format
                    Street, City, ST ZIP.
                  </div>
                )}
                {addressLookedUp && (
                  <div className="mt-2">
                    <Row>
                      {[
                        ['street_number', 'Street Number'],
                        ['street_name', 'Street Name'],
                        ['city', 'City'],
                        ['state', 'State'],
                        ['country', 'Country'],
                        ['zip', 'Zip'],
                        ['latitude', 'Latitude'],
                        ['longitude', 'Longitude'],
                      ].map(([key, label]) => (
                        <Half key={key}>
                          <FieldLabel required>{label} </FieldLabel>
                          <TextInput
                            id={key}
                            value={form[key]}
                            onChange={() => {}}
                            readOnly
                          />
                        </Half>
                      ))}
                    </Row>
                  </div>
                )}
              </>
            )}

            {step === 3 && (
              <>
                <p className="mb-5 font-serif text-sm leading-6 text-[#333]">
                  Fill out only IF different than physical location.
                </p>
                <Row>
                  <Half>
                    <FieldLabel>Address</FieldLabel>
                    <TextInput
                      id="mailing_address"
                      value={form.mailing_address}
                      onChange={(v) => set('mailing_address', v)}
                    />
                  </Half>
                  <Half>
                    <FieldLabel>City</FieldLabel>
                    <TextInput
                      id="mailing_city"
                      value={form.mailing_city}
                      onChange={(v) => set('mailing_city', v)}
                    />
                  </Half>
                  <Half>
                    <FieldLabel>State</FieldLabel>
                    <SelectInput
                      id="mailing_state"
                      value={form.mailing_state}
                      onChange={(v) => set('mailing_state', v)}
                      options={US_STATES}
                      placeholder="--Select State--"
                    />
                  </Half>
                  <Half>
                    <FieldLabel>Zip</FieldLabel>
                    <TextInput
                      id="mailing_zip"
                      value={form.mailing_zip}
                      onChange={(v) => set('mailing_zip', v)}
                    />
                  </Half>
                  <Half>
                    <FieldLabel>Country</FieldLabel>
                    <TextInput
                      id="mailing_country"
                      value={form.mailing_country}
                      onChange={(v) => set('mailing_country', v)}
                    />
                  </Half>
                </Row>
              </>
            )}

            {step === 4 && (
              <>
                <Row>
                  <Half>
                    <FieldLabel required>Main Phone </FieldLabel>
                    <TextInput
                      id="main_phone"
                      value={form.main_phone}
                      onChange={(v) => set('main_phone', v)}
                      required
                    />
                    <div className="mt-2">
                      <CheckRow
                        id="main_phone_on_web"
                        checked={form.main_phone_on_web}
                        onChange={(v) => set('main_phone_on_web', v)}
                      >
                        Display Main Phone on website?
                      </CheckRow>
                    </div>
                  </Half>
                  <Half>
                    <FieldLabel>Toll Free</FieldLabel>
                    <TextInput
                      id="toll_free"
                      value={form.toll_free}
                      onChange={(v) => set('toll_free', v)}
                    />
                    <div className="mt-2">
                      <CheckRow
                        id="toll_free_on_web"
                        checked={form.toll_free_on_web}
                        onChange={(v) => set('toll_free_on_web', v)}
                      >
                        Display Toll Free# on website?
                      </CheckRow>
                    </div>
                  </Half>
                  <Half>
                    <FieldLabel>FAX</FieldLabel>
                    <TextInput id="fax" value={form.fax} onChange={(v) => set('fax', v)} />
                    <div className="mt-2">
                      <CheckRow
                        id="fax_on_web"
                        checked={form.fax_on_web}
                        onChange={(v) => set('fax_on_web', v)}
                      >
                        Display FAX on website?
                      </CheckRow>
                    </div>
                  </Half>
                </Row>
                <div className="mt-6">
                  <Row>
                    <Half>
                      <FieldLabel>Other Phone 1</FieldLabel>
                      <TextInput
                        id="other_phone"
                        value={form.other_phone}
                        onChange={(v) => set('other_phone', v)}
                      />
                    </Half>
                    <Half>
                      <FieldLabel>Other Phone 1 Type</FieldLabel>
                      <SelectInput
                        id="other_phone_type"
                        value={form.other_phone_type}
                        onChange={(v) => set('other_phone_type', v)}
                        options={PHONE_TYPES}
                        placeholder="--None--"
                      />
                      <div className="mt-2">
                        <CheckRow
                          id="other_phone_on_web"
                          checked={form.other_phone_on_web}
                          onChange={(v) => set('other_phone_on_web', v)}
                        >
                          Display Other Phone 1 on website?
                        </CheckRow>
                      </div>
                    </Half>
                  </Row>
                </div>
              </>
            )}

            {step === 5 && (
              <>
                <Row>
                  <Half>
                    <FieldLabel required>First Name </FieldLabel>
                    <TextInput
                      id="primary_first_name"
                      value={form.primary_first_name}
                      onChange={(v) => set('primary_first_name', v)}
                      required
                    />
                  </Half>
                  <Half>
                    <FieldLabel required>Last Name </FieldLabel>
                    <TextInput
                      id="primary_last_name"
                      value={form.primary_last_name}
                      onChange={(v) => set('primary_last_name', v)}
                      required
                    />
                  </Half>
                  <Half>
                    <FieldLabel required>Email </FieldLabel>
                    <TextInput
                      id="primary_email"
                      type="email"
                      value={form.primary_email}
                      onChange={(v) => set('primary_email', v)}
                      required
                    />
                  </Half>
                  <Half>
                    <FieldLabel>Contact Title</FieldLabel>
                    <SelectInput
                      id="primary_contact_title"
                      value={form.primary_contact_title}
                      onChange={(v) => set('primary_contact_title', v)}
                      options={CONTACT_TITLES}
                      placeholder="--None--"
                    />
                  </Half>
                  <Half>
                    <FieldLabel>Phone</FieldLabel>
                    <TextInput
                      id="primary_phone"
                      value={form.primary_phone}
                      onChange={(v) => set('primary_phone', v)}
                    />
                  </Half>
                  <Half>
                    <FieldLabel>Address</FieldLabel>
                    <TextInput
                      id="primary_address"
                      value={form.primary_address}
                      onChange={(v) => set('primary_address', v)}
                    />
                  </Half>
                  <Half>
                    <FieldLabel>City</FieldLabel>
                    <TextInput
                      id="primary_city"
                      value={form.primary_city}
                      onChange={(v) => set('primary_city', v)}
                    />
                  </Half>
                  <Half>
                    <FieldLabel>State</FieldLabel>
                    <SelectInput
                      id="primary_state"
                      value={form.primary_state}
                      onChange={(v) => set('primary_state', v)}
                      options={US_STATES}
                      placeholder="--Select State--"
                    />
                  </Half>
                  <Half>
                    <FieldLabel>Zip</FieldLabel>
                    <TextInput
                      id="primary_zip"
                      value={form.primary_zip}
                      onChange={(v) => set('primary_zip', v)}
                    />
                  </Half>
                  <Half>
                    <FieldLabel>Country</FieldLabel>
                    <SelectInput
                      id="primary_country"
                      value={form.primary_country}
                      onChange={(v) => set('primary_country', v)}
                      options={['USA']}
                      placeholder="USA"
                    />
                  </Half>
                </Row>
              </>
            )}

            {step === 6 && (
              <>
                <p className="mb-3 font-serif text-sm leading-6 text-[#333]">
                  You are also entitled to receive the following online newsletters.
                </p>
                <p className="mb-3 font-serif text-sm leading-6 text-[#333]">
                  If you do not want to take advantage of these offers, please un-check the
                  appropriate boxes.
                </p>
                <p className="mb-6 font-serif text-sm leading-6 text-[#333]">
                  Note: Bullet Points, First Shots and Pull The Trigger will be delivered to the
                  Primary Contact&apos;s email address.
                </p>
                <CheckRow
                  id="bullet_points"
                  checked={form.bullet_points}
                  onChange={(v) => set('bullet_points', v)}
                >
                  Bullet Points
                </CheckRow>
                <CheckRow
                  id="first_shots"
                  checked={form.first_shots}
                  onChange={(v) => set('first_shots', v)}
                >
                  First Shots
                </CheckRow>
                <CheckRow
                  id="pull_the_trigger"
                  checked={form.pull_the_trigger}
                  onChange={(v) => set('pull_the_trigger', v)}
                >
                  Pull The Trigger
                </CheckRow>
              </>
            )}

            {step === 7 && (
              <>
                <p className="mb-4 font-serif text-sm leading-6 text-[#333]">Check all that apply</p>
                <div className="space-y-0.5">
                  {[
                    ['trap', 'Trap'],
                    ['skeet', 'Skeet'],
                    ['informal_practice_area', 'Informal Practice Area'],
                    ['bunker_trap', 'Bunker Trap'],
                    ['international_skeet', 'International Skeet'],
                    ['other_shotgun', 'Other Shotgun'],
                    ['five_stand', '5-Stand'],
                    ['sporting_clays', 'Sporting Clays'],
                  ].map(([k, label]) => (
                    <CheckRow key={k} id={k} checked={form[k]} onChange={(v) => set(k, v)}>
                      {label}
                    </CheckRow>
                  ))}
                </div>
              </>
            )}

            {step === 8 && (
              <Row>
                <Half>
                  <CheckRow
                    id="cfr_indoor"
                    checked={form.cfr_indoor}
                    onChange={(v) => set('cfr_indoor', v)}
                  >
                    Indoor
                  </CheckRow>
                  <div className="mt-2">
                    <FieldLabel>Maximum Indoor Shooting Distance</FieldLabel>
                    <SelectInput
                      id="cfr_max_indoor"
                      value={form.cfr_max_indoor}
                      onChange={(v) => set('cfr_max_indoor', v)}
                      options={DIST_IN}
                      placeholder="--None--"
                    />
                  </div>
                </Half>
                <Half>
                  <CheckRow
                    id="cfr_outdoor"
                    checked={form.cfr_outdoor}
                    onChange={(v) => set('cfr_outdoor', v)}
                  >
                    Outdoor
                  </CheckRow>
                  <div className="mt-2">
                    <FieldLabel>Maximum Outdoor Shooting Distance</FieldLabel>
                    <SelectInput
                      id="cfr_max_outdoor"
                      value={form.cfr_max_outdoor}
                      onChange={(v) => set('cfr_max_outdoor', v)}
                      options={DIST_OUT}
                      placeholder="--None--"
                    />
                  </div>
                </Half>
              </Row>
            )}

            {step === 9 && (
              <Row>
                <Half>
                  <CheckRow
                    id="handgun_indoor"
                    checked={form.handgun_indoor}
                    onChange={(v) => set('handgun_indoor', v)}
                  >
                    Indoor
                  </CheckRow>
                  <div className="mt-2">
                    <FieldLabel>Maximum Indoor Shooting Distance</FieldLabel>
                    <SelectInput
                      id="handgun_max_indoor"
                      value={form.handgun_max_indoor}
                      onChange={(v) => set('handgun_max_indoor', v)}
                      options={DIST_IN}
                      placeholder="--None--"
                    />
                  </div>
                </Half>
                <Half>
                  <CheckRow
                    id="handgun_outdoor"
                    checked={form.handgun_outdoor}
                    onChange={(v) => set('handgun_outdoor', v)}
                  >
                    Outdoor
                  </CheckRow>
                  <div className="mt-2">
                    <FieldLabel>Maximum Outdoor Shooting Distance</FieldLabel>
                    <SelectInput
                      id="handgun_max_outdoor"
                      value={form.handgun_max_outdoor}
                      onChange={(v) => set('handgun_max_outdoor', v)}
                      options={DIST_OUT}
                      placeholder="--None--"
                    />
                  </div>
                </Half>
              </Row>
            )}

            {step === 10 && (
              <div className="space-y-0.5">
                <CheckRow
                  id="archery_indoor"
                  checked={form.archery_indoor}
                  onChange={(v) => set('archery_indoor', v)}
                >
                  Indoor
                </CheckRow>
                <CheckRow
                  id="archery_outdoor_field"
                  checked={form.archery_outdoor_field}
                  onChange={(v) => set('archery_outdoor_field', v)}
                >
                  Outdoor Field
                </CheckRow>
                <CheckRow
                  id="archery_outdoor_3d"
                  checked={form.archery_outdoor_3d}
                  onChange={(v) => set('archery_outdoor_3d', v)}
                >
                  Outdoor 3-D
                </CheckRow>
              </div>
            )}

            {step === 11 && (
              <div className="space-y-0.5">
                <CheckRow id="airgun" checked={form.airgun} onChange={(v) => set('airgun', v)}>
                  Airgun
                </CheckRow>
                <CheckRow
                  id="muzzle_loaders_outdoor"
                  checked={form.muzzle_loaders_outdoor}
                  onChange={(v) => set('muzzle_loaders_outdoor', v)}
                >
                  Outdoor
                </CheckRow>
                <CheckRow
                  id="range_simulators"
                  checked={form.range_simulators}
                  onChange={(v) => set('range_simulators', v)}
                >
                  Range Simulators
                </CheckRow>
              </div>
            )}

            {step === 12 && (
              <div className="space-y-0.5">
                {COMPETITIONS.map((label) => (
                  <CheckRow
                    key={label}
                    id={`comp-${label}`}
                    checked={!!form.competitions[label]}
                    onChange={(v) => setMap('competitions', label, v)}
                  >
                    {label}
                  </CheckRow>
                ))}
              </div>
            )}

            {step === 13 && (
              <div className="space-y-0.5">
                {SERVICES.map((label) => (
                  <CheckRow
                    key={label}
                    id={`svc-${label}`}
                    checked={!!form.services[label]}
                    onChange={(v) => setMap('services', label, v)}
                  >
                    {label}
                  </CheckRow>
                ))}
              </div>
            )}

            {step === 14 && (
              <div className="space-y-0.5">
                {HUNTING.map((label) => (
                  <CheckRow
                    key={label}
                    id={`hunt-${label}`}
                    checked={!!form.hunting[label]}
                    onChange={(v) => setMap('hunting', label, v)}
                  >
                    {label}
                  </CheckRow>
                ))}
              </div>
            )}

            {step === 15 && (
              <>
                <h2 className="mb-4 text-lg font-semibold uppercase tracking-[0.18em] text-[#1a1a1a]">
                  Interested in standing out in the directory?
                </h2>
                <p className="mb-3 font-serif text-sm leading-6 text-[#333]">
                  Would you like your business to appear at the top of our list in bold type?
                </p>
                <p className="mb-5 font-serif text-sm leading-6 text-[#333]">
                  Featured placement is available for verified range partners. Check the box below
                  if you would like more information.
                </p>
                <CheckRow
                  id="member_info"
                  checked={form.member_info}
                  onChange={(v) => set('member_info', v)}
                >
                  <strong>Please check box to receive information on featured listing options.</strong>
                </CheckRow>

                <hr className="my-8 border-[#ddd]" />

                <h2 className="mb-4 text-lg font-semibold uppercase tracking-[0.18em] text-[#1a1a1a]">
                  First Shots
                </h2>
                <p className="mb-5 font-serif text-sm leading-7 text-[#333]">
                  Do you want more customers? Is your facility equipped to introduce first-time
                  shooters to safe and fun shooting? Do you have instructors and range officers who
                  enjoy working with new shooters? Then a First Shots style program is perfect for
                  you. As a host range, you&apos;ll have access to resources to encourage first-time
                  customers to become repeat visitors.
                </p>
                <CheckRow
                  id="first_shots_program"
                  checked={form.first_shots_program}
                  onChange={(v) => set('first_shots_program', v)}
                >
                  <strong>
                    YES! I am interested in more information about First Shots style programs.
                  </strong>
                </CheckRow>

                <p className="mt-8 font-serif text-xs text-[#666]">
                  By submitting, you confirm the information is accurate for a range in the DC, MD,
                  or VA area.
                </p>
              </>
            )}

            <div className="mt-10 flex flex-wrap items-center gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={goPrev}
                  className="inline-flex items-center gap-1 bg-[#5d7186] px-10 py-2.5 text-[13px] tracking-wide text-white shadow-[0_4px_10px_rgba(0,0,0,0.22)] transition hover:bg-[#46586b]"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
              )}
              {step < TOTAL_STEPS ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center gap-1 bg-[#5d7186] px-12 py-2.5 text-[13px] tracking-wide text-white shadow-[0_4px_10px_rgba(0,0,0,0.22)] transition hover:bg-[#46586b]"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#5d7186] px-12 py-2.5 text-[13px] tracking-wide text-white shadow-[0_4px_10px_rgba(0,0,0,0.22)] transition hover:bg-[#46586b] disabled:opacity-60"
                >
                  {submitting ? 'Submitting…' : 'Submit'}
                </button>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-[#c5c5c5]">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((n, idx) => (
                <React.Fragment key={n}>
                  {idx > 0 && <span className="px-0.5">-</span>}
                  <button
                    type="button"
                    onClick={() => {
                      setErrors([]);
                      setStep(n);
                    }}
                    className={`min-w-[1.1rem] text-center transition ${
                      n === step ? 'font-semibold text-[#5d7186]' : 'hover:text-[#888]'
                    }`}
                  >
                    {n}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </form>
        )}
      </main>

      <footer className="bg-black text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-5 text-xs font-semibold uppercase tracking-wider">
          <span className="text-white/90">Also of Interest:</span>
          <Link to="/#finder" className="text-white/60 transition hover:text-white">
            Find Shooting Ranges Near You
          </Link>
          <Link to="/#mission" className="text-white/60 transition hover:text-white">
            Our Mission
          </Link>
          <Link to="/list-your-range" className="text-white/60 transition hover:text-white">
            List Your Range
          </Link>
          <Link to="/login" className="text-white/60 transition hover:text-white">
            Owner Login
          </Link>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-4 text-xs text-white/50">
            <span>
              © {new Date().getFullYear()} DMV Ranges — Where to Shoot in DC, Maryland & Virginia.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
