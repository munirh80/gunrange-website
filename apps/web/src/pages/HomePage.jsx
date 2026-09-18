import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ChevronDown, Crosshair, MapPin, Phone, Mail, Globe, Clock, SlidersHorizontal, Search as SearchIcon, ExternalLink, Target, Map as MapIcon, List, LocateFixed, Plus, Minus, RotateCcw, Navigation } from 'lucide-react';
import { RANGES, AMENITY_FILTERS, haversineMiles, resolveSearchCenter } from '@/data/ranges';
import Seo from '@/components/Seo';
import { slugify } from '@/lib/format';
const YOUTUBE_HERO = 'https://www.youtube.com/embed/JnempufjTdw?autoplay=1&mute=1&loop=1&playlist=JnempufjTdw&playsinline=1&controls=0&modestbranding=1&rel=0';
const FIRST_SHOTS_IMG = 'https://images.hostinger.com/0675c579-f742-4140-b3bd-1bd5e079e47a.png';
const MILES_OPTIONS = [5, 10, 20, 40, 80, 160];

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// Map projection bounds (covers DC, central MD, northern VA)
const MAP = {
  west: -78.0,
  east: -76.4,
  north: 39.75,
  south: 38.2
};
const project = (lat, lng) => ({
  x: (lng - MAP.west) / (MAP.east - MAP.west) * 800,
  y: (MAP.north - lat) / (MAP.north - MAP.south) * 600
});
const MAP_LABELS = [{
  name: 'Baltimore',
  lat: 39.2904,
  lng: -76.6122
}, {
  name: 'Westminster',
  lat: 39.62,
  lng: -77.02
}, {
  name: 'Rockville',
  lat: 39.084,
  lng: -77.1528
}, {
  name: 'Washington, DC',
  lat: 38.9072,
  lng: -77.0369
}, {
  name: 'Annapolis',
  lat: 38.9784,
  lng: -76.4922
}, {
  name: 'Fairfax',
  lat: 38.8462,
  lng: -77.3064
}, {
  name: 'Manassas',
  lat: 38.7509,
  lng: -77.4753
}, {
  name: 'Fredericksburg',
  lat: 38.3032,
  lng: -77.4605
}];
const DEFAULT_CENTER = [38.9072, -77.0369];

const PIN_BASE = 1.4; // baseline pin scale for clearer markers

function RangeMap({
  results,
  activeId,
  hoveredId,
  onSelect,
  onHover,
  onShowInList,
  center,
  miles
}) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const pointersRef = useRef(new Map());
  const gestureRef = useRef({ mode: 'idle', moved: false });
  const suppressClickRef = useRef(false);
  const stateRef = useRef({ zoom: 1, pan: { x: 0, y: 0 } });

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  stateRef.current = { zoom, pan };

  const cLat = center ? center[0] : DEFAULT_CENTER[0];
  const cLng = center ? center[1] : DEFAULT_CENTER[1];
  const cp = project(cLat, cLng);

  // ~5.61 px per mile (latitude). Use this to size the zoom window to the radius.
  const pxPerMile = 600 / (MAP.north - MAP.south) / 69.0;
  const targetRadius = 260;
  let baseScale = center ? targetRadius / (miles * pxPerMile) : 1;
  baseScale = clamp(baseScale, 0.35, 9);
  const scale = baseScale * zoom;

  // Reset user zoom/pan whenever the search framing changes.
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [center, miles]);

  const screen = (lat, lng) => {
    const p = project(lat, lng);
    return {
      x: 400 + (p.x - cp.x) * scale + pan.x,
      y: 300 + (p.y - cp.y) * scale + pan.y
    };
  };
  const inView = s => s.x > -40 && s.x < 840 && s.y > -40 && s.y < 640;
  const groupTransform = `translate(${400 + pan.x} ${300 + pan.y}) scale(${scale}) translate(${-cp.x} ${-cp.y})`;

  const clientToViewBox = (clientX, clientY) => {
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left) / rect.width * 800,
      y: (clientY - rect.top) / rect.height * 600
    };
  };

  const zoomToward = (newZoom, vbX, vbY) => {
    const { zoom: z, pan: p } = stateRef.current;
    const nz = clamp(newZoom, 0.5, 8);
    const k = nz / z;
    setZoom(nz);
    setPan({
      x: vbX - 400 - (vbX - 400 - p.x) * k,
      y: vbY - 300 - (vbY - 300 - p.y) * k
    });
  };

  const zoomByButton = factor => {
    const { zoom: z, pan: p } = stateRef.current;
    const nz = clamp(z * factor, 0.5, 8);
    const k = nz / z;
    setZoom(nz);
    setPan({ x: p.x * k, y: p.y * k });
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Native non-passive wheel listener so we can preventDefault for zoom-to-cursor.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = e => {
      e.preventDefault();
      const v = clientToViewBox(e.clientX, e.clientY);
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      zoomToward(stateRef.current.zoom * factor, v.x, v.y);
    };
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPointerDown = e => {
    if (svgRef.current) svgRef.current.setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointersRef.current.size === 1) {
      gestureRef.current = {
        mode: 'pan',
        moved: false,
        startClient: { x: e.clientX, y: e.clientY },
        startPan: { ...stateRef.current.pan }
      };
    } else if (pointersRef.current.size === 2) {
      const pts = [...pointersRef.current.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      gestureRef.current = {
        mode: 'pinch',
        moved: false,
        startDist: dist || 1,
        startZoom: stateRef.current.zoom,
        startMid: { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 },
        startPan: { ...stateRef.current.pan }
      };
    }
  };

  const onPointerMove = e => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gestureRef.current;
    if (g.mode === 'pan' && pointersRef.current.size === 1) {
      const rect = svgRef.current.getBoundingClientRect();
      const dx = (e.clientX - g.startClient.x) * (800 / rect.width);
      const dy = (e.clientY - g.startClient.y) * (600 / rect.height);
      if (Math.abs(e.clientX - g.startClient.x) > 4 || Math.abs(e.clientY - g.startClient.y) > 4) g.moved = true;
      setPan({ x: g.startPan.x + dx, y: g.startPan.y + dy });
    } else if (g.mode === 'pinch' && pointersRef.current.size >= 2) {
      const pts = [...pointersRef.current.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
      g.moved = true;
      const factor = dist / g.startDist;
      const nz = clamp(g.startZoom * factor, 0.5, 8);
      const k = nz / g.startZoom;
      const midView = clientToViewBox(g.startMid.x, g.startMid.y);
      setZoom(nz);
      setPan({
        x: midView.x - 400 - (midView.x - 400 - g.startPan.x) * k,
        y: midView.y - 300 - (midView.y - 300 - g.startPan.y) * k
      });
    }
  };

  const onPointerUp = e => {
    pointersRef.current.delete(e.pointerId);
    if (gestureRef.current.moved) {
      suppressClickRef.current = true;
      window.setTimeout(() => { suppressClickRef.current = false; }, 60);
    }
    if (pointersRef.current.size < 2) {
      gestureRef.current = { mode: pointersRef.current.size === 1 ? 'pan' : 'idle', moved: false };
    }
  };

  const activeRange = results.find(r => r.id === activeId) || null;

  return <div ref={containerRef} className="relative h-[400px] overflow-hidden bg-[#dde4ec] sm:h-[500px] lg:h-[580px]">
      <svg ref={svgRef} viewBox="0 0 800 600" className="absolute inset-0 h-full w-full touch-none select-none" preserveAspectRatio="xMidYMid slice" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onPointerLeave={() => onHover && onHover(null)}>
        <defs>
          <linearGradient id="atlasBase" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e4eaf1" />
            <stop offset="100%" stopColor="#d2dbe6" />
          </linearGradient>
          <radialGradient id="atlasVignette" cx="50%" cy="42%" r="75%">
            <stop offset="60%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#2a3647" stopOpacity="0.18" />
          </radialGradient>
          <filter id="markerShadow" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#1f2a38" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Zoomable base layer (land, terrain, boundaries, water, roads, beltway) */}
        <g transform={groupTransform}>
          <rect width="800" height="600" fill="url(#atlasBase)" />

          {/* subtle terrain shading */}
          <ellipse cx="150" cy="140" rx="180" ry="110" fill="#cfd9e4" opacity="0.55" />
          <ellipse cx="660" cy="470" rx="190" ry="120" fill="#cfd9e4" opacity="0.55" />
          <ellipse cx="640" cy="110" rx="130" ry="80" fill="#d6deea" opacity="0.5" />
          <ellipse cx="120" cy="500" rx="160" ry="90" fill="#d6deea" opacity="0.45" />

          {/* county / district boundaries (decorative) */}
          <g stroke="#b9c5d4" strokeWidth="1" fill="none" opacity="0.7">
            <path d="M 0 150 C 120 140, 240 160, 360 150 C 480 140, 600 165, 800 150" />
            <path d="M 0 360 C 140 350, 280 380, 420 365 C 560 350, 680 380, 800 365" />
            <path d="M 300 0 C 310 120, 330 240, 320 360 C 315 460, 330 540, 325 600" />
            <path d="M 560 0 C 570 140, 555 300, 565 460 C 570 520, 560 560, 562 600" />
          </g>

          {/* Potomac River */}
          <path d="M 50 58 C 130 100, 230 140, 325 252 C 380 300, 440 315, 485 329 C 500 350, 495 370, 485 387 C 520 420, 550 445, 575 465 C 630 505, 680 535, 725 561" fill="none" stroke="#aebfd2" strokeWidth="14" strokeLinecap="round" opacity="0.95" />
          <path d="M 50 58 C 130 100, 230 140, 325 252 C 380 300, 440 315, 485 329 C 500 350, 495 370, 485 387 C 520 420, 550 445, 575 465 C 630 505, 680 535, 725 561" fill="none" stroke="#c3d0e0" strokeWidth="6" strokeLinecap="round" opacity="0.7" />

          {/* Chesapeake Bay hint */}
          <path d="M 800 410 C 740 450, 720 520, 760 600 L 800 600 Z" fill="#aebfd2" opacity="0.75" />
          <path d="M 800 410 C 740 450, 720 520, 760 600 L 800 600 Z" fill="#c3d0e0" opacity="0.5" />

          {/* highways */}
          <g stroke="#ffffff" strokeWidth="4.5" opacity="0.85" strokeLinecap="round">
            <path d="M 485 329 L 470 600" fill="none" />
            <path d="M 485 329 L 425 60" fill="none" />
            <path d="M 485 329 L 120 380" fill="none" />
            <path d="M 485 329 L 800 300" fill="none" />
            <path d="M 425 60 L 620 30" fill="none" />
          </g>
          <g stroke="#c2cdda" strokeWidth="1.5" opacity="0.8">
            <path d="M 0 200 L 800 180" fill="none" />
            <path d="M 200 0 L 260 600" fill="none" />
            <path d="M 0 480 L 800 430" fill="none" />
          </g>

          {/* Beltway ring around DC */}
          <circle cx="485" cy="329" r="52" fill="none" stroke="#e0b452" strokeWidth="3.5" opacity="0.8" strokeDasharray="3 5" />

          {/* radius circle around the active center */}
          {center && <circle cx={cp.x} cy={cp.y} r={miles * pxPerMile} fill="#46586b" fillOpacity="0.06" stroke="#46586b" strokeWidth="1.5" strokeDasharray="4 5" opacity="0.55" />}
        </g>

        {/* vignette overlay (fixed) */}
        <rect width="800" height="600" fill="url(#atlasVignette)" pointerEvents="none" />

        {/* state labels (only when zoomed out enough) */}
        {scale < 1.8 && <>
            {(() => {
          const s = screen(39.45, -76.6);
          return inView(s) ? <text x={s.x} y={s.y} fontSize="20" letterSpacing="7" fill="#8492a6" fontWeight="600" fontFamily="'DM Sans', sans-serif" textAnchor="middle" pointerEvents="none">MARYLAND</text> : null;
        })()}
            {(() => {
          const s = screen(38.5, -77.5);
          return inView(s) ? <text x={s.x} y={s.y} fontSize="20" letterSpacing="7" fill="#8492a6" fontWeight="600" fontFamily="'DM Sans', sans-serif" textAnchor="middle" pointerEvents="none">VIRGINIA</text> : null;
        })()}
          </>}

        {/* city labels (fixed size, reprojected) */}
        {MAP_LABELS.map(c => {
        const s = screen(c.lat, c.lng);
        if (!inView(s)) return null;
        return <g key={c.name} pointerEvents="none">
              <circle cx={s.x} cy={s.y} r="2.5" fill="#6b7a8e" />
              <circle cx={s.x} cy={s.y} r="5" fill="none" stroke="#6b7a8e" strokeWidth="0.8" opacity="0.5" />
              <text x={s.x + 8} y={s.y + 4} fontSize="12" fill="#46586b" fontWeight="500" fontFamily="'DM Sans', sans-serif" style={{
            letterSpacing: '0.02em'
          }}>
                {c.name}
              </text>
            </g>;
      })}

        {/* pins (fixed size, reprojected to screen space) */}
        {results.map((r, i) => {
        const s = screen(r.lat, r.lng);
        if (!inView(s)) return null;
        const active = r.id === activeId;
        const hovered = r.id === hoveredId;
        const isPublic = r.access === 'public';
        const showTip = active || hovered;
        const ms = active ? 1.32 : hovered ? 1.14 : 1;
        const total = PIN_BASE * ms;
        const tipW = Math.min(230, Math.max(96, r.name.length * 6.6 + 20));
        const tipX = Math.max(6, Math.min(800 - tipW - 6, s.x - tipW / 2));
        const headY = -23.5 * PIN_BASE; // head center in viewBox units (tip at 0,0)
        return <g key={r.id} transform={`translate(${s.x} ${s.y})`} className="range-map-marker focus:outline-none" style={{
          cursor: 'pointer'
        }} onMouseDown={e => e.preventDefault()} onClick={() => {
            if (suppressClickRef.current) {
              suppressClickRef.current = false;
              return;
            }
            onSelect(r.id);
          }} onPointerEnter={() => onHover && onHover(r.id)} role="button" tabIndex={0} aria-label={r.name} aria-pressed={active} onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(r.id);
            }
          }}>
              {/* enlarged invisible hit target for touch */}
              <circle cx="0" cy={headY} r="26" fill="transparent" />

              {/* selection halo (pulses) */}
              {active && <circle cx="0" cy={headY} r="15" fill="#46586b" opacity="0.3" className="marker-pulse" pointerEvents="none" />}

              {/* hover/active tooltip */}
              {showTip && <g pointerEvents="none">
                  <rect x={tipX - s.x} y={headY - 26} width={tipW} height={20} rx={4} fill="#2a3647" />
                  <text x={tipX - s.x + tipW / 2} y={headY - 12} textAnchor="middle" fontSize="11" fontWeight="600" fill="#ffffff" fontFamily="'DM Sans', sans-serif">
                    {r.name.length > 30 ? `${r.name.slice(0, 29)}…` : r.name}
                  </text>
                </g>}

              {/* the pin itself — scales around its tip */}
              <g style={{
              transform: `translate(${-15 * total}px, ${-37 * total}px) scale(${total})`,
              transition: 'transform 170ms ease-out',
              filter: 'url(#markerShadow)'
            }}>
                <path d="M15 0C7.27 0 1 6.04 1 13.5 1 23.6 15 37 15 37s14-13.4 14-23.5C29 6.04 22.73 0 15 0z" fill={isPublic ? '#46586b' : '#2a3647'} stroke="#ffffff" strokeWidth="2" />
                <circle cx="15" cy="13.5" r="7.5" fill="#ffffff" />
                <text x="15" y="17.5" textAnchor="middle" fontSize="11" fontWeight="700" fill={isPublic ? '#46586b' : '#2a3647'} fontFamily="'DM Sans', sans-serif">
                  {i + 1}
                </text>
              </g>
            </g>;
      })}
      </svg>

      {/* Count badge (top-left) */}
      <div className="pointer-events-none absolute left-3 top-3 rounded bg-white/85 px-3 py-1.5 text-xs font-medium text-[#46586b] shadow-sm ring-1 ring-black/5 backdrop-blur-sm">
        DC · Maryland · Virginia — {results.length} range{results.length === 1 ? '' : 's'}
        {center && <span className="ml-1 text-[#8a968c]">· within {miles} mi</span>}
      </div>

      {/* Zoom controls (top-right) */}
      <div className="absolute right-3 top-3 flex flex-col gap-1.5">
        <button type="button" onClick={() => zoomByButton(1.3)} aria-label="Zoom in" className="flex h-10 w-10 items-center justify-center rounded bg-white/90 text-[#46586b] shadow-sm ring-1 ring-black/5 transition hover:bg-white active:scale-95">
          <Plus className="h-5 w-5" strokeWidth={2.25} />
        </button>
        <button type="button" onClick={() => zoomByButton(1 / 1.3)} aria-label="Zoom out" className="flex h-10 w-10 items-center justify-center rounded bg-white/90 text-[#46586b] shadow-sm ring-1 ring-black/5 transition hover:bg-white active:scale-95">
          <Minus className="h-5 w-5" strokeWidth={2.25} />
        </button>
        <button type="button" onClick={resetView} aria-label="Reset view" title="Reset view" className="flex h-10 w-10 items-center justify-center rounded bg-white/90 text-[#46586b] shadow-sm ring-1 ring-black/5 transition hover:bg-white active:scale-95">
          <RotateCcw className="h-4 w-4" strokeWidth={2.25} />
        </button>
      </div>

      {/* Drag hint (bottom-right, only when no range selected) */}
      {!activeRange && <div className="pointer-events-none absolute bottom-3 right-3 hidden rounded bg-white/80 px-2.5 py-1 text-[11px] font-medium text-[#8a968c] shadow-sm ring-1 ring-black/5 backdrop-blur-sm sm:block">
          Drag to pan · scroll to zoom
        </div>}

      {/* Selected range info panel (bottom) */}
      {activeRange && <div className="absolute inset-x-2 bottom-2 sm:inset-x-auto sm:right-3 sm:bottom-3 sm:max-w-sm">
          <div className="rounded-md bg-white p-3.5 shadow-lg ring-1 ring-black/10">
            <div className="flex items-start gap-3">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${activeRange.access === 'public' ? 'bg-[#4a6b66]' : 'bg-[#2f3b3a]'}`}>
                {results.findIndex(r => r.id === activeRange.id) + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-[15px] font-semibold text-[#2f3b3a]">{activeRange.name}</h3>
                  <span className="shrink-0 rounded-sm bg-[#eef3ee] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#4a6b66]">
                    {activeRange.type}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-[#5c6a58]">
                  {activeRange.address}, {activeRange.city}, {activeRange.state} {activeRange.zip}
                </p>
                {activeRange.distance != null && <p className="mt-0.5 text-xs font-medium text-[#4a6b66]">
                    {activeRange.distance.toFixed(1)} miles away
                  </p>}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${activeRange.name}, ${activeRange.address}, ${activeRange.city}, ${activeRange.state} ${activeRange.zip}`)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-sm bg-[#40554f] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#35473f]">
                <Navigation className="h-3.5 w-3.5" /> Directions
              </a>
              <Link to={`/ranges/${slugify(activeRange.name)}`} className="inline-flex items-center gap-1.5 rounded-sm border border-[#40554f] px-3 py-1.5 text-xs font-semibold text-[#40554f] transition hover:bg-[#40554f] hover:text-white">
                View details
              </Link>
              <button type="button" onClick={() => onShowInList(activeRange.id)} className="inline-flex items-center gap-1.5 rounded-sm border border-[#d5ddd5] px-3 py-1.5 text-xs font-semibold text-[#40554f] transition hover:border-[#40554f] hover:bg-[#eef3ee]">
                <List className="h-3.5 w-3.5" /> Show in list
              </button>
            </div>
          </div>
        </div>}
    </div>;
}
export default function HomePage() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [miles, setMiles] = useState(40);
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [amenities, setAmenities] = useState([]);
  const [applied, setApplied] = useState({
    type: 'all',
    amenities: []
  });
  const [expandedId, setExpandedId] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [view, setView] = useState('map');
  const [userLoc, setUserLoc] = useState(null);
  const [geoStatus, setGeoStatus] = useState('idle'); // idle | granted | denied | unavailable

  const requestLocation = () => {
    if (!('geolocation' in navigator)) {
      setGeoStatus('unavailable');
      return;
    }
    setGeoStatus('idle');
    navigator.geolocation.getCurrentPosition(pos => {
      setUserLoc([pos.coords.latitude, pos.coords.longitude]);
      setGeoStatus('granted');
      setSubmittedQuery('');
      setQuery('');
    }, () => setGeoStatus('denied'), {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 300000
    });
  };

  // Default to the customer's location on first load.
  useEffect(() => {
    requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const center = useMemo(() => userLoc || resolveSearchCenter(submittedQuery), [userLoc, submittedQuery]);
  const results = useMemo(() => {
    const q = submittedQuery.trim().toLowerCase();
    let list = RANGES.map(r => ({
      ...r,
      distance: center ? haversineMiles(center[0], center[1], r.lat, r.lng) : null
    }));
    if (center) {
      list = list.filter(r => r.distance <= miles).sort((a, b) => a.distance - b.distance);
    } else if (q) {
      list = list.filter(r => [r.name, r.address, r.city, r.state, r.zip].join(' ').toLowerCase().includes(q));
    } else {
      list = list.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (applied.type !== 'all') list = list.filter(r => r.type === applied.type);
    if (applied.amenities.length) {
      list = list.filter(r => applied.amenities.every(a => r.amenities.includes(a)));
    }
    return list;
  }, [submittedQuery, center, miles, applied]);
  const doSearch = () => {
    setUserLoc(null);
    setSubmittedQuery(query);
  };
  const toggleAmenity = a => setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  const applyFilters = () => setApplied({
    type: typeFilter,
    amenities
  });
  const clearAll = () => {
    setQuery('');
    setSubmittedQuery('');
    setUserLoc(null);
    setTypeFilter('all');
    setAmenities([]);
    setApplied({
      type: 'all',
      amenities: []
    });
    setMiles(40);
  };
  // Clicking a marker just highlights it + shows the on-map info panel.
  const selectFromMap = id => {
    setActiveId(id);
  };
  // "Show in list" jumps to the list view and scrolls to the matching card.
  const showInList = id => {
    setActiveId(id);
    setExpandedId(id);
    setView('list');
    window.setTimeout(() => {
      document.getElementById(`range-${id}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 70);
  };
  return <div className="min-h-screen bg-white text-[#2f3b3a]">
      <Helmet>
        <title>Shooting Ranges in Maryland, Virginia & DC | DMV Ranges</title>
        <meta name="description" content="Find shooting ranges in Maryland, Virginia, and Washington, DC. Compare locations, range types, services, hours, training, rentals, and visitor requirements." />
        <meta name="robots" content="index, follow" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://images.hostinger.com" />
      </Helmet>
      <Seo title="Shooting Ranges in Maryland, Virginia & DC" description="Discover shooting ranges, training facilities, memberships, rentals, and range services across the Mid-Atlantic." siteName="DMV Ranges" type="website" />

      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="#top" className="flex items-center gap-3">
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
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-white md:flex">
            <a href="#finder" className="transition hover:text-[#9fc3bd]">Find a Range</a>
            <a href="#mission" className="transition hover:text-[#9fc3bd]">Our Mission</a>
            <Link to="/firearms-law" className="transition hover:text-[#9fc3bd]">Firearms Law</Link>
            <span className="h-5 w-px bg-white/30" />
            <Link to="/list-your-range" className="rounded border border-white/60 px-4 py-2 transition hover:bg-white hover:text-[#2f3b3a]">
              List Your Range
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#3a4757]">
        <iframe src={YOUTUBE_HERO} title="DMV shooting ranges video" className="hero-video pointer-events-none" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/75" />
        <div className="relative z-10 mx-4 mt-10 bg-black/45 px-8 py-8 text-center backdrop-blur-[2px] sm:px-14">
          <h1 className="font-display text-3xl italic tracking-[0.12em] text-white sm:text-5xl">RANGES IN THE DMV</h1>
          <p className="font-display mt-3 text-xl italic tracking-[0.18em] text-white/90 sm:text-3xl"><span style={{
            fontSize: "21px",
            lineHeight: "normal"
          }}>Get your Pew Pew on</span></p>
        </div>
      </section>

      {/* Finder */}
      <main id="finder" className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Search bar */}
        <div className="relative z-20 -mt-12 rounded-sm bg-white p-5 shadow-xl ring-1 ring-black/5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a968c]" />
              <input type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && doSearch()} placeholder="search by zip, city, state" className="h-11 w-full rounded-sm border border-[#d5ddd5] bg-white pl-9 pr-3 text-sm outline-none transition focus:border-[#4a6b66] focus:ring-2 focus:ring-[#4a6b66]/20" aria-label="Search by zip, city, state" />
            </div>
            <button type="button" onClick={doSearch} className="h-11 rounded-sm bg-[#40554f] px-10 text-sm font-semibold tracking-wide text-white transition hover:bg-[#35473f] active:scale-[0.98]">
              Search
            </button>
            <button type="button" onClick={requestLocation} className="flex h-11 items-center justify-center gap-1.5 rounded-sm border border-[#d5ddd5] bg-white px-4 text-sm font-medium text-[#40554f] transition hover:border-[#40554f] hover:bg-[#eef3ee] active:scale-[0.98]" title="Use my location">
              <LocateFixed className="h-4 w-4" />
              {userLoc ? 'My Location' : 'Use my location'}
            </button>
            <div className="relative">
              <select value={miles} onChange={e => setMiles(Number(e.target.value))} className="h-11 w-full appearance-none rounded-sm border border-[#d5ddd5] bg-white pl-3 pr-9 text-sm outline-none focus:border-[#4a6b66] lg:w-44" aria-label="Distance">
                {MILES_OPTIONS.map(m => <option key={m} value={m}>Within {m} miles</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a968c]" />
            </div>
            <ul className="hidden gap-4 text-xs text-[#5c6a58] lg:flex">
              <li className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-[#4a6b66]" /> Open to Public
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-[#2f3b3a]" /> Members Only
              </li>
            </ul>
            <button type="button" onClick={() => setShowFilters(s => !s)} className="flex items-center gap-1.5 text-sm font-medium text-[#40554f] transition hover:text-[#2f3b3a]">
              <SlidersHorizontal className="h-4 w-4" />
              {showFilters ? 'Hide' : 'Show'} filters
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {geoStatus === 'denied' && <p className="mt-3 text-xs text-[#8a968c]">
              Location access was blocked. Enter a ZIP or city above, or re-enable location in your browser to center the map on you.
            </p>}
          {geoStatus === 'unavailable' && <p className="mt-3 text-xs text-[#8a968c]">
              Your browser doesn't support location detection — enter a ZIP or city to center the map.
            </p>}
          {userLoc && <p className="mt-3 text-xs font-medium text-[#4a6b66]">
              Map centered on your location. Adjust the distance to widen the area.
            </p>}

          {/* Extra filters */}
          {showFilters && <div className="mt-5 border-t border-[#e4eae4] pt-5">
              <div className="flex flex-col gap-5 md:flex-row md:items-start">
                <div className="flex gap-2">
                  {['indoor', 'outdoor'].map(t => <button key={t} type="button" onClick={() => setTypeFilter(cur => cur === t ? 'all' : t)} className={`h-10 rounded-sm border px-6 text-sm font-medium capitalize transition active:scale-[0.98] ${typeFilter === t ? 'border-[#40554f] bg-[#40554f] text-white' : 'border-[#d5ddd5] bg-white text-[#2f3b3a] hover:border-[#40554f]'}`}>
                      {t}
                    </button>)}
                </div>
                <p className="flex-1 text-xs leading-relaxed text-[#8a968c]">
                  Select range type — indoor or outdoor — then choose the options you'd like to
                  filter on. Click “Apply Filters” to view results. You may need to increase the
                  distance radius to see results.
                </p>
                <button type="button" onClick={applyFilters} className="h-10 rounded-sm bg-[#40554f] px-6 text-sm font-semibold text-white transition hover:bg-[#35473f] active:scale-[0.98]">
                  Apply Filters
                </button>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {AMENITY_FILTERS.map(a => <label key={a} className="flex cursor-pointer items-center gap-2 text-sm text-[#2f3b3a]">
                    <input type="checkbox" checked={amenities.includes(a)} onChange={() => toggleAmenity(a)} className="h-4 w-4 rounded-sm border-[#c3cec3] accent-[#40554f]" />
                    {a}
                  </label>)}
              </div>
            </div>}
        </div>

        {/* Results header + view toggle */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-sm ring-1 ring-black/5">
          <div className="flex items-center gap-1 rounded-sm bg-white p-1 shadow-sm ring-1 ring-black/5">
            <button type="button" onClick={() => setView('map')} className={`flex items-center gap-1.5 rounded-sm px-4 py-2 text-sm font-semibold transition ${view === 'map' ? 'bg-[#40554f] text-white' : 'text-[#40554f] hover:bg-[#eef3ee]'}`}>
              <MapIcon className="h-4 w-4" /> Map
            </button>
            <button type="button" onClick={() => setView('list')} className={`flex items-center gap-1.5 rounded-sm px-4 py-2 text-sm font-semibold transition ${view === 'list' ? 'bg-[#40554f] text-white' : 'text-[#40554f] hover:bg-[#eef3ee]'}`}>
              <List className="h-4 w-4" /> List
            </button>
          </div>
          <p className="text-sm text-[#5c6a58]">
            {results.length} range{results.length === 1 ? '' : 's'} found
          </p>
        </div>

        {/* Map on top (default) or list */}
        <div className="mt-3 overflow-hidden rounded-sm ring-1 ring-black/5">
          {view === 'map' ? <div className="relative">
              <RangeMap results={results} activeId={activeId} hoveredId={hoveredId} onSelect={selectFromMap} onHover={setHoveredId} onShowInList={showInList} center={center} miles={miles} />
              {results.length === 0 && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 p-10 text-center">
                  <Target className="h-10 w-10 text-[#9fc3bd]" strokeWidth={1.5} />
                  <p className="font-medium">No ranges match your search.</p>
                  <p className="text-sm text-[#8a968c]">
                    Try a larger radius, a different city or ZIP, or clear your filters.
                  </p>
                  <button type="button" onClick={clearAll} className="mt-2 rounded-sm border border-[#40554f] px-5 py-2 text-sm font-medium text-[#40554f] transition hover:bg-[#40554f] hover:text-white">
                    Clear search & filters
                  </button>
                </div>}
            </div> : <div className="max-h-[640px] overflow-y-auto bg-white">
              {results.length === 0 ? <div className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center">
                  <Target className="h-10 w-10 text-[#9fc3bd]" strokeWidth={1.5} />
                  <p className="font-medium">No ranges match your search.</p>
                  <p className="text-sm text-[#8a968c]">
                    Try a larger radius, a different city or ZIP, or clear your filters.
                  </p>
                  <button type="button" onClick={clearAll} className="mt-2 rounded-sm border border-[#40554f] px-5 py-2 text-sm font-medium text-[#40554f] transition hover:bg-[#40554f] hover:text-white">
                    Clear search & filters
                  </button>
                </div> : <ul className="divide-y divide-[#e4eae4]">
                  {results.map((r, i) => {
              const expanded = expandedId === r.id;
              const isActive = activeId === r.id;
              return <li key={r.id} id={`range-${r.id}`} onMouseEnter={() => setActiveId(r.id)} onFocus={() => setActiveId(r.id)}>
                        <button type="button" onClick={() => {
                  setExpandedId(expanded ? null : r.id);
                  setActiveId(r.id);
                }} className={`flex w-full items-start gap-4 p-5 text-left transition hover:bg-[#f4f7f3] ${isActive ? 'bg-[#eef3ee]' : ''}`}>
                          <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ring-2 transition ${r.access === 'public' ? 'bg-[#4a6b66]' : 'bg-[#2f3b3a]'} ${isActive ? 'ring-[#40554f]' : 'ring-transparent'}`}>
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
                              {r.distance != null && <span className="mt-0.5 block font-medium text-[#4a6b66]">
                                  {r.distance.toFixed(1)} miles away
                                </span>}
                            </span>
                          </span>
                          <ChevronDown className={`mt-2 h-4 w-4 shrink-0 text-[#8a968c] transition-transform ${expanded ? 'rotate-180' : ''}`} />
                        </button>
                        {expanded && <div className="border-t border-[#e4eae4] bg-[#f8faf7] px-5 py-4 pl-[4.5rem]">
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
                                <a href={r.website} target="_blank" rel="noreferrer" className="text-[#40554f] underline decoration-[#9fc3bd] underline-offset-2 hover:text-[#2f3b3a]">
                                  Visit website
                                </a>
                              </div>
                            </dl>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {r.amenities.map(a => <span key={a} className="rounded-sm bg-white px-2 py-0.5 text-[11px] font-medium text-[#5c6a58] ring-1 ring-[#d5ddd5]">
                                  {a}
                                </span>)}
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name}, ${r.address}, ${r.city}, ${r.state} ${r.zip}`)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-sm bg-[#40554f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#35473f]">
                                <MapPin className="h-3.5 w-3.5" /> Get Directions
                                <ExternalLink className="h-3 w-3" />
                              </a>
                              <button type="button" onClick={() => {
                      setActiveId(r.id);
                      setView('map');
                    }} className="inline-flex items-center gap-1.5 rounded-sm border border-[#40554f] px-4 py-2 text-xs font-semibold text-[#40554f] transition hover:bg-[#40554f] hover:text-white">
                                <MapIcon className="h-3.5 w-3.5" /> View on map
                              </button>
                              <Link to={`/ranges/${slugify(r.name)}`} className="inline-flex items-center gap-1.5 rounded-sm border border-[#40554f] px-4 py-2 text-xs font-semibold text-[#40554f] transition hover:bg-[#40554f] hover:text-white">
                                View details
                              </Link>
                            </div>
                          </div>}
                      </li>;
            })}
                </ul>}
            </div>}
        </div>

        <p className="mt-4 text-center text-xs text-[#8a968c]">
          Note: there are no public shooting ranges inside the District of Columbia itself — the
          closest options are in nearby Maryland and Northern Virginia.
        </p>
      </main>

      {/* Mission */}
      <section id="mission" className="mx-auto max-w-3xl px-6 py-24 text-center">
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-[#c3cec3]" />
          <h2 className="text-sm font-bold uppercase tracking-[0.35em] text-[#2f3b3a]">Our Mission</h2>
          <span className="h-px w-10 bg-[#c3cec3]" />
        </div>
        <p className="font-display mt-8 text-xl leading-relaxed text-[#2f3b3a] sm:text-2xl">
          Where to Shoot DMV is the region's most comprehensive directory of shooting ranges,
          covering Washington DC, Maryland, and Northern Virginia. The directory is updated
          frequently with range information across the region. If you own a shooting range or have
          recently changed locations, we encourage you to enter or update your range information
          free of charge.
        </p>
      </section>

      {/* Split CTA */}
      <section className="grid md:grid-cols-2">
        <div id="list-your-range" className="flex flex-col items-center justify-center bg-[#40554f] px-8 py-20 text-center text-white">
          <h2 className="font-display text-3xl italic sm:text-4xl">List Your Range</h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
            Own or manage a range in DC, Maryland, or Virginia? Add your listing and reach thousands
            of local shooters — free of charge.
          </p>
          <Link to="/list-your-range" className="mt-8 inline-flex items-center gap-2 rounded-sm bg-white/15 px-8 py-3 text-sm font-semibold tracking-wide ring-1 ring-white/50 transition hover:bg-white hover:text-[#40554f]">
            <Phone className="h-4 w-4" /> Get Listed — It's Free
          </Link>
        </div>
        <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden px-8 py-20 text-center">
          <img src={FIRST_SHOTS_IMG} alt="New shooters with an instructor at an indoor range" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/45" />
          <div className="relative z-10 text-white">
            <h2 className="font-display text-3xl italic sm:text-4xl">First Shots</h2>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-white/90">
              New to the shooting sports? Find a beginner class at a range near you.
            </p>
            <a href="#finder" className="mt-7 inline-block rounded-sm border border-white px-8 py-3 text-sm font-semibold tracking-wide transition hover:bg-white hover:text-[#2f3b3a]">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-5 text-xs font-semibold uppercase tracking-wider">
          <span className="text-white/90">Also of Interest:</span>
          <a href="https://dnr.maryland.gov" target="_blank" rel="noreferrer" className="text-white/60 transition hover:text-white">Maryland DNR</a>
          <a href="https://dwr.virginia.gov" target="_blank" rel="noreferrer" className="text-white/60 transition hover:text-white">Virginia DWR</a>
          <Link to="/maryland" className="text-white/60 transition hover:text-white">Maryland Ranges</Link>
          <Link to="/virginia" className="text-white/60 transition hover:text-white">Virginia Ranges</Link>
          <Link to="/washington-dc" className="text-white/60 transition hover:text-white">Washington DC Ranges</Link>
          <Link to="/firearms-law" className="text-white/60 transition hover:text-white">Firearms Law</Link>
          <a href="https://wheretoshoot.org" target="_blank" rel="noreferrer" className="text-white/60 transition hover:text-white">National Directory</a>
          <Link to="/list-your-range" className="text-white/60 transition hover:text-white">Edit Range</Link>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-4 text-xs text-white/50">
            <span>© {new Date().getFullYear()} DMV Ranges — Where to Shoot in DC, Maryland & Virginia.</span>
            <span>Always follow range rules and applicable local laws.</span>
          </div>
        </div>
      </footer>
    </div>;
}
