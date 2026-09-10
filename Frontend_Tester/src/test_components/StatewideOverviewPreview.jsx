import React, { useState, useMemo } from "react";
import {
  Droplet, Cog, ShieldCheck, ShieldAlert, Zap, Map as MapIcon, Server,
  BarChart3, Waves, Check, RefreshCw, Menu, X, Info, Wrench,
  AlertTriangle, CheckCircle2, FileDown,
} from "lucide-react";

/**
 * Self-contained preview build of the Statewide Overview dashboard.
 * Uses inline colors + lucide-react icons (no custom Tailwind config or
 * external font dependency) so it renders anywhere. For your actual app,
 * use StatewideOverview.js + tailwind.config.snippet.js instead — same
 * layout, wired to your project's design tokens and Material Symbols.
 */

const C = {
  bg: "#0b1326",
  surface: "#171f33",
  surfaceLow: "#131b2e",
  surfaceLowest: "#060e20",
  surfaceHigh: "#222a3d",
  surfaceHighest: "#2d3449",
  bright: "#31394d",
  outline: "#3d494c",
  onSurface: "#dae2fd",
  onSurfaceVariant: "#bcc9cd",
  primary: "#4cd7f6",
  onPrimary: "#003640",
  primaryContainer: "#06b6d4",
  onPrimaryContainer: "#00424f",
  secondary: "#7bd0ff",
  secondaryContainer: "#00a6e0",
  tertiary: "#4edea3",
  tertiaryContainer: "#1bbd85",
  error: "#ffb4ab",
  errorContainer: "#93000a",
  onError: "#690005",
};

const font = { fontFamily: "Inter, system-ui, sans-serif" };
const mono = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" };
const display = { fontFamily: "'Plus Jakarta Sans', Inter, system-ui, sans-serif" };

const NAV_LINKS = [
  { key: "statewide-overview", label: "Statewide Overview" },
  { key: "plant-telemetry", label: "Plant Telemetry" },
  { key: "analytics-and-reports", label: "Analytics & Reports" },
  { key: "critical-alerts", label: "Critical Alerts & Incident Response" },
];

const KPIS = [
  { key: "water", label: "Total Clean Water Dispensed", icon: Droplet, value: "1,482,900", unit: "L", tone: C.onSurface, footer: <span style={{ color: C.tertiary }}>+8.4% vs 30d baseline</span> },
  { key: "units", label: "Purification Units", icon: Cog, value: "42/45", unit: "ONLINE", tone: C.onSurface, footer: (
      <span style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ padding: "1px 6px", borderRadius: 3, background: C.errorContainer, color: "#ffdad6", fontSize: 10, fontWeight: 700 }}>3 IN MAINT</span>
        <span style={{ color: C.onSurfaceVariant }}>Dhanbad & Ramgarh</span>
      </span>
    ) },
  { key: "population", label: "Population Protected", icon: ShieldCheck, value: "384,200", unit: "SOULS", tone: C.onSurface, footer: <span style={{ color: C.onSurfaceVariant }}>14 Mining & Rural Districts</span> },
  { key: "compliance", label: "Overall Compliance", icon: ShieldAlert, value: "94.2", unit: "% INDEX", tone: C.tertiary, footer: <span style={{ color: C.onSurfaceVariant }}>BIS IS 10500 Compliant</span> },
  { key: "incursions", label: "Incursions Blocked", icon: Zap, value: "18", unit: "EVENTS", tone: C.error, footer: (
      <span style={{ padding: "1px 6px", borderRadius: 3, background: C.errorContainer, color: "#ffdad6", fontSize: 10, fontWeight: 700 }}>AUTO-CUTOFF ENGAGED</span>
    ) },
];

const PLANTS = [
  { id: "JH-DHN-04", name: "Jharia Colliery Sector 4", district: "Dhanbad Mining Belt", status: "cutoff", statusLabel: "CRITICAL CUTOFF", sideLabel: "AUTO-HALTED", tone: C.error, toneBg: "rgba(255,180,171,0.15)",
    metrics: [{ label: "Lead (Pb) Concentration", value: "0.042 ppm (Limit: 0.01)" }, { label: "Solenoid Gate Valve", value: "CLOSED (0 L/min)" }],
    pos: { x: 64, y: 62 }, spotlight: { pb: "0.042 ppm", ph: "5.8 pH", tds: "680 ppm" } },
  { id: "JH-ESB-12", name: "Ghatsila Mining Outpost", district: "East Singhbhum", status: "alert", statusLabel: "ELEVATED METALS", sideLabel: "WARNING", tone: C.secondary, toneBg: "rgba(123,208,255,0.15)",
    metrics: [{ label: "Iron (Fe)", value: "0.38 ppm" }, { label: "pH Value", value: "6.6 pH" }, { label: "Discharge", value: "390 L/hr" }],
    pos: { x: 83, y: 76 }, spotlight: { pb: "<0.001 ppm", ph: "6.6 pH", tds: "410 ppm" } },
  { id: "JH-BOK-02", name: "Bermo Coal Belt Plant #02", district: "Bokaro Industrial Zone", status: "normal", statusLabel: "OPTIMAL", sideLabel: "NORMAL", tone: C.tertiary, toneBg: "rgba(78,222,163,0.15)",
    metrics: [{ label: "pH Level", value: "7.1 pH" }, { label: "TDS Inflow", value: "220 ppm" }, { label: "Turbidity", value: "0.3 NTU" }],
    pos: { x: 58, y: 48 }, spotlight: { pb: "<0.001 ppm", ph: "7.1 pH", tds: "220 ppm" } },
  { id: "JH-DHN-01", name: "Topchanchi Rural Unit #01", district: "Dhanbad Rural", status: "normal", statusLabel: "UV DISINFECTION", sideLabel: "NORMAL", tone: C.tertiary, toneBg: "rgba(78,222,163,0.15)",
    metrics: [{ label: "pH Level", value: "7.0 pH" }, { label: "TDS Inflow", value: "190 ppm" }, { label: "Turbidity", value: "0.2 NTU" }],
    pos: { x: 60, y: 57 }, spotlight: { pb: "<0.001 ppm", ph: "7.0 pH", tds: "190 ppm" } },
  { id: "JH-RMG-05", name: "Patratu Basin Unit #05", district: "Ramgarh", status: "normal", statusLabel: "RO ACTIVE", sideLabel: "NORMAL", tone: C.tertiary, toneBg: "rgba(78,222,163,0.15)",
    metrics: [{ label: "pH Level", value: "7.3 pH" }, { label: "TDS Inflow", value: "175 ppm" }, { label: "Turbidity", value: "0.15 NTU" }],
    pos: { x: 47, y: 63 }, spotlight: { pb: "<0.001 ppm", ph: "7.3 pH", tds: "175 ppm" } },
];

const DECORATIVE_NODES = [
  { x: 20, y: 32 }, { x: 30, y: 24 }, { x: 36, y: 40 }, { x: 17, y: 55 },
  { x: 24, y: 68 }, { x: 33, y: 78 }, { x: 41, y: 30 }, { x: 45, y: 82 },
  { x: 52, y: 34 }, { x: 55, y: 76 }, { x: 63, y: 40 }, { x: 68, y: 30 },
  { x: 73, y: 48 }, { x: 77, y: 58 }, { x: 70, y: 66 }, { x: 62, y: 84 },
];

const DISTRICT_LABELS = [
  { label: "PALAMU", x: 20, y: 44 },
  { label: "BOKARO BASIN", x: 43, y: 38 },
  { label: "RANCHI VALLEY", x: 34, y: 62 },
  { label: "DHANBAD COAL BELT", x: 63, y: 51 },
  { label: "E. SINGHBHUM", x: 68, y: 78 },
];

const CONTAMINANTS = [
  { key: "pb", label: "LEAD (PB)", ceiling: 0.01, value: 0.018, axisMax: 0.025, tone: C.error, Icon: AlertTriangle, note: "+80% above safe limit" },
  { key: "as", label: "ARSENIC (AS)", ceiling: 0.01, value: 0.004, axisMax: 0.015, tone: C.tertiary, Icon: CheckCircle2, note: "Safe parameters" },
  { key: "f", label: "FLUORIDE (F-)", ceiling: 1.0, value: 0.82, axisMax: 1.25, tone: C.secondary, Icon: Info, note: "Elevated in Palamu belt" },
  { key: "cr", label: "CHROMIUM (CR+6)", ceiling: 0.05, value: 0.012, axisMax: 0.07, tone: C.tertiary, Icon: CheckCircle2, note: "Trace levels only" },
  { key: "fe", label: "IRON (FE)", ceiling: 0.3, value: 0.34, axisMax: 0.5, tone: C.secondary, Icon: Wrench, note: "Filtration backwash req." },
];

const STATUS_TABS = [
  { key: "all", label: "All", count: 45 },
  { key: "normal", label: "Normal", count: 40 },
  { key: "alert", label: "Alert", count: 2 },
  { key: "cutoff", label: "Cutoff", count: 3 },
];

function Pill({ bg, color, children, style }) {
  return (
    <span style={{ padding: "2px 8px", borderRadius: 4, background: bg, color, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap", ...mono, ...style }}>
      {children}
    </span>
  );
}

export default function StatewideOverviewPreview() {
  const [activeNav, setActiveNav] = useState("statewide-overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [metalFilters, setMetalFilters] = useState({ pb: true, as: true, fe: true });
  const [selectedPlantId, setSelectedPlantId] = useState(PLANTS[0].id);
  const [downloadState, setDownloadState] = useState("idle");

  const selectedPlant = useMemo(
    () => PLANTS.find((p) => p.id === selectedPlantId) || PLANTS[0],
    [selectedPlantId]
  );
  const filteredPlants = useMemo(
    () => (statusFilter === "all" ? PLANTS : PLANTS.filter((p) => p.status === statusFilter)),
    [statusFilter]
  );

  const toggleMetal = (key) => setMetalFilters((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleDownload = () => {
    if (downloadState !== "idle") return;
    setDownloadState("loading");
    setTimeout(() => {
      setDownloadState("done");
      setTimeout(() => setDownloadState("idle"), 1800);
    }, 1000);
  };

  const card = { background: C.surface, borderRadius: 14, boxShadow: "0 4px 16px rgba(0,0,0,0.35)" };
  const cardLow = { background: C.surfaceLow, borderRadius: 14, boxShadow: "0 4px 16px rgba(0,0,0,0.35)" };
  const label = { fontSize: 11, letterSpacing: "0.06em", color: C.onSurfaceVariant, textTransform: "uppercase", fontWeight: 600 };

  return (
    <div style={{ ...font, background: C.bg, color: C.onSurface, minHeight: "100vh", width: "100%" }}>
      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(6,14,32,0.92)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${C.outline}55` }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: C.surfaceHigh, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Droplet size={18} color={C.primary} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ ...display, color: C.primary, fontWeight: 700, letterSpacing: "0.05em", fontSize: 17 }}>TOYAM</span>
                <span style={{ padding: "1px 6px", borderRadius: 3, background: C.surfaceHigh, color: C.primary, fontSize: 10, fontWeight: 700, border: `1px solid ${C.outline}55` }}>JH-DW&SD</span>
              </div>
              <span style={{ fontSize: 11, color: C.onSurfaceVariant, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 340 }}>
                State Water Quality & Purification Monitoring Portal
              </span>
            </div>
          </div>

          <nav style={{ display: "none", alignItems: "center", gap: 4, background: `${C.surfaceLow}cc`, padding: 4, borderRadius: 10 }} className="sod-desktop-nav">
            {NAV_LINKS.map((l) => (
              <a key={l.key} href="#" onClick={(e) => { e.preventDefault(); setActiveNav(l.key); }}
                style={{
                  padding: "6px 12px", borderRadius: 6, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap",
                  background: activeNav === l.key ? C.primaryContainer : "transparent",
                  color: activeNav === l.key ? C.onPrimaryContainer : C.onSurfaceVariant,
                  fontWeight: activeNav === l.key ? 700 : 500,
                }}>
                {l.label}
              </a>
            ))}
          </nav>

          <button onClick={() => setMobileMenuOpen((v) => !v)} className="sod-mobile-toggle"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, background: C.surfaceHigh, border: `1px solid ${C.outline}55`, color: C.onSurface, cursor: "pointer" }}>
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <nav style={{ display: "flex", flexDirection: "column", gap: 4, padding: "0 16px 12px" }} className="sod-mobile-nav">
            {NAV_LINKS.map((l) => (
              <a key={l.key} href="#" onClick={(e) => { e.preventDefault(); setActiveNav(l.key); setMobileMenuOpen(false); }}
                style={{
                  padding: "8px 12px", borderRadius: 6, fontSize: 13, textDecoration: "none",
                  background: activeNav === l.key ? C.primaryContainer : "transparent",
                  color: activeNav === l.key ? C.onPrimaryContainer : C.onSurfaceVariant,
                  fontWeight: activeNav === l.key ? 700 : 500,
                }}>
                {l.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <style>{`
        @media (min-width: 1024px) {
          .sod-desktop-nav { display: flex !important; }
          .sod-mobile-toggle { display: none !important; }
        }
        .sod-scroll::-webkit-scrollbar { width: 6px; }
        .sod-scroll::-webkit-scrollbar-thumb { background: ${C.outline}; border-radius: 4px; }
      `}</style>

      <main style={{ padding: "0 16px 32px" }}>
        {/* Command strip */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "12px 0", borderBottom: `1px solid ${C.outline}33`, ...mono, fontSize: 11 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.onSurfaceVariant, flexWrap: "wrap" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.tertiary }} />
            <span style={{ color: C.onSurface }}>SCADA GEO-NODE CLUSTER // JH-EAST-CENTRAL</span>
            <span>•</span>
            <span>SYNC: 14:32:08 IST</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <Pill bg="rgba(123,208,255,0.15)" color={C.secondary}>MINING SECTOR RUNOFF SURVEILLANCE ACTIVE</Pill>
            <Pill bg="rgba(78,222,163,0.15)" color={C.tertiary}>IS-10500 AUTO-VALIDATED</Pill>
          </div>
        </div>

        {/* KPI strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12, padding: "16px 0" }}>
          {KPIS.map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.key} style={{ ...cardLow, padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={label}>{k.label}</span>
                  <Icon size={17} color={C.primary} />
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                  <span style={{ ...mono, fontSize: 26, fontWeight: 700, color: k.tone }}>{k.value}</span>
                  <span style={{ ...mono, fontSize: 11, color: C.onSurfaceVariant }}>{k.unit}</span>
                </div>
                <div style={{ fontSize: 12, ...mono }}>{k.footer}</div>
              </div>
            );
          })}
        </div>

        {/* Filter bar */}
        <div style={{ ...card, padding: 16, marginBottom: 16, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={label}>District:</span>
              <select style={{ background: C.surfaceLowest, color: C.onSurface, padding: "6px 10px", borderRadius: 6, border: `1px solid ${C.outline}55`, fontSize: 13 }}>
                <option>All Operational Districts (14)</option>
                <option>Dhanbad</option>
                <option>Bokaro</option>
                <option>Ramgarh</option>
                <option>West Singhbhum</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={label}>Status:</span>
              <div style={{ display: "flex", gap: 2, background: C.surfaceLowest, padding: 4, borderRadius: 8 }}>
                {STATUS_TABS.map((t) => (
                  <button key={t.key} onClick={() => setStatusFilter(t.key)}
                    style={{
                      padding: "5px 10px", borderRadius: 5, fontSize: 12, border: "none", cursor: "pointer",
                      background: statusFilter === t.key ? C.primaryContainer : "transparent",
                      color: statusFilter === t.key ? C.onPrimaryContainer : C.onSurfaceVariant,
                      fontWeight: statusFilter === t.key ? 700 : 500,
                    }}>
                    {t.label} ({t.count})
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={label}>Heavy Metal Surveillance:</span>
              {[{ key: "pb", l: "Pb (Lead)" }, { key: "as", l: "As (Arsenic)" }, { key: "fe", l: "Fe (Iron)" }].map((m) => (
                <label key={m.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                  <input type="checkbox" checked={metalFilters[m.key]} onChange={() => toggleMetal(m.key)} style={{ accentColor: C.primary, width: 15, height: 15 }} />
                  {m.l}
                </label>
              ))}
            </div>
          </div>

          <button onClick={handleDownload} disabled={downloadState !== "idle"}
            style={{
              width: "max-content", display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 8,
              background: C.primary, color: C.onPrimary, border: "none", cursor: downloadState === "idle" ? "pointer" : "default",
              fontWeight: 600, fontSize: 13, opacity: downloadState === "idle" ? 1 : 0.85,
            }}>
            {downloadState === "loading" ? <RefreshCw size={16} className="sod-spin" /> : downloadState === "done" ? <Check size={16} /> : <FileDown size={16} />}
            {downloadState === "loading" ? "Preparing Summary..." : downloadState === "done" ? "Summary Downloaded" : "Download State Executive Summary (PDF)"}
          </button>
        </div>
        <style>{`.sod-spin { animation: sod-spin 1s linear infinite; } @keyframes sod-spin { to { transform: rotate(360deg); } }`}</style>

        {/* Map + plant fleet */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginBottom: 16 }} className="sod-grid-main">
          <style>{`@media (min-width: 1024px) { .sod-grid-main { grid-template-columns: 2fr 1fr !important; } }`}</style>

          <div style={{ ...card, padding: 16 }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MapIcon size={18} color={C.primary} />
                <span style={{ ...display, fontSize: 16, fontWeight: 700 }}>Statewide Geographic IoT Telemetry Canvas</span>
                <Pill bg={C.bright} color={C.primary}>45 NODES ACTIVE</Pill>
              </div>
              <span style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 6, background: C.surfaceHigh, color: C.onSurfaceVariant, fontSize: 12 }}>
                <Waves size={14} /> Mining Runoff Overlay
              </span>
            </div>

            <div style={{ position: "relative", width: "100%", aspectRatio: "16/11", background: C.surfaceLowest, borderRadius: 10, overflow: "hidden", border: `1px solid ${C.outline}33` }}>
              <span style={{
                position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                ...display, fontSize: 26, fontWeight: 700, color: "rgba(218,226,253,0.05)", textTransform: "uppercase",
                letterSpacing: "0.1em", textAlign: "center", padding: "0 20px", pointerEvents: "none",
              }}>
                Jharkhand Telemetry Matrix
              </span>

              {DISTRICT_LABELS.map((d) => (
                <span key={d.label} style={{ position: "absolute", left: `${d.x}%`, top: `${d.y}%`, transform: "translate(-50%,-50%)", ...mono, fontSize: 9, color: "rgba(188,201,205,0.7)", whiteSpace: "nowrap", pointerEvents: "none" }}>
                  {d.label}
                </span>
              ))}

              {DECORATIVE_NODES.map((n, i) => (
                <span key={i} style={{ position: "absolute", left: `${n.x}%`, top: `${n.y}%`, transform: "translate(-50%,-50%)", width: 6, height: 6, borderRadius: "50%", background: `${C.tertiary}b3` }} />
              ))}

              {PLANTS.map((p) => (
                <button key={p.id} onClick={() => setSelectedPlantId(p.id)} aria-label={`Select ${p.name}`}
                  style={{ position: "absolute", left: `${p.pos.x}%`, top: `${p.pos.y}%`, transform: "translate(-50%,-50%)", background: "none", border: "none", padding: 8, cursor: "pointer" }}>
                  <span style={{
                    display: "block", borderRadius: "50%", background: p.tone,
                    width: p.id === selectedPlantId ? 16 : 10, height: p.id === selectedPlantId ? 16 : 10,
                    boxShadow: p.id === selectedPlantId ? `0 0 0 6px ${p.tone}22` : "none",
                  }} />
                </button>
              ))}

              <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(23,31,51,0.95)", borderRadius: 8, padding: 10, border: `1px solid ${C.outline}55`, minWidth: 150 }} className="sod-legend">
                <div style={{ ...label, marginBottom: 6 }}>Node Classification</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: C.tertiary }} />Safe Potability (40)</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: C.secondary }} />Warning / Heavy TDS (2)</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, color: C.error }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: C.error }} />Critical Contamination (3)</span>
                </div>
              </div>

              <div style={{ position: "absolute", bottom: 10, left: 10, right: 10, maxWidth: 300, background: "rgba(23,31,51,0.95)", borderRadius: 8, padding: 12, border: `1px solid ${C.outline}55`, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                  <span style={label}>Telemetry Probe Spotlight</span>
                  <Pill bg={selectedPlant.toneBg} color={selectedPlant.tone}>{selectedPlant.statusLabel}</Pill>
                </div>
                <div style={{ ...display, fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>{selectedPlant.name}</div>
                <div style={{ fontSize: 12, color: C.primary, marginBottom: 10 }}>{selectedPlant.district}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 9, color: C.onSurfaceVariant, textTransform: "uppercase" }}>Lead (Pb)</div>
                    <div style={{ ...mono, fontSize: 13, color: C.error, fontWeight: 700 }}>{selectedPlant.spotlight.pb}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: C.onSurfaceVariant, textTransform: "uppercase" }}>pH Level</div>
                    <div style={{ ...mono, fontSize: 13, fontWeight: 700 }}>{selectedPlant.spotlight.ph}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: C.onSurfaceVariant, textTransform: "uppercase" }}>TDS Inflow</div>
                    <div style={{ ...mono, fontSize: 13, fontWeight: 700 }}>{selectedPlant.spotlight.tds}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8, borderTop: `1px solid ${C.outline}44`, fontSize: 10, color: C.onSurfaceVariant, ...mono }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, color: C.error }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: C.error }} />Solenoid Shutoff Active</span>
                  <span>SCADA CH: 09</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 10, fontSize: 10, color: C.onSurfaceVariant, ...mono }}>
              <span>SATELLITE SYNC: INSAT-3DR WATER BODY REFLECTANCE VERIFIED</span>
              <span style={{ color: C.primary }}>LAT/LONG BOUNDS: 23.6102° N, 85.2799° E (JH-HQ)</span>
            </div>
          </div>

          <div style={{ ...card, padding: 16, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Server size={18} color={C.primary} />
                <span style={{ ...display, fontSize: 16, fontWeight: 700 }}>Plant Fleet Live Telemetry</span>
              </div>
              <span style={{ fontSize: 10, color: C.onSurfaceVariant, textTransform: "uppercase", ...mono }}>Sort: Severity</span>
            </div>

            <div className="sod-scroll" style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 560, overflowY: "auto", paddingRight: 4 }}>
              {filteredPlants.map((p) => (
                <button key={p.id} onClick={() => setSelectedPlantId(p.id)}
                  style={{
                    textAlign: "left", borderRadius: 10, border: "none", cursor: "pointer", padding: 0, overflow: "hidden",
                    background: p.id === selectedPlantId ? C.surfaceHigh : C.surfaceLow,
                    borderLeft: `4px solid ${p.tone}`,
                  }}>
                  <div style={{ padding: 10 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{p.name}</span>
                        <Pill bg={p.toneBg} color={p.tone} style={{ fontSize: 9 }}>{p.statusLabel}</Pill>
                      </div>
                      <span style={{ ...mono, fontSize: 10, fontWeight: 700, color: p.tone, whiteSpace: "nowrap" }}>{p.sideLabel}</span>
                    </div>
                    <div style={{ fontSize: 12, color: C.onSurfaceVariant, marginBottom: 6 }}>{p.district} • Plant UID: {p.id}</div>
                    <div style={{ display: "grid", gridTemplateColumns: `repeat(${p.metrics.length}, 1fr)`, gap: 6, ...mono, fontSize: 10 }}>
                      {p.metrics.map((m) => (
                        <div key={m.label}>
                          <div style={{ color: C.onSurfaceVariant, textTransform: "uppercase" }}>{m.label}</div>
                          <div style={{ fontWeight: 700 }}>{m.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
              {filteredPlants.length === 0 && (
                <div style={{ textAlign: "center", padding: "24px 0", color: C.onSurfaceVariant, fontSize: 13 }}>No plants match this status filter.</div>
              )}
            </div>
          </div>
        </div>

        {/* Contaminants */}
        <div style={{ ...card, padding: 16 }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10, marginBottom: 14 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <BarChart3 size={18} color={C.primary} />
                <span style={{ ...display, fontSize: 16, fontWeight: 700 }}>Heavy Metal & Critical Contaminant Concentrations vs BIS IS 10500</span>
              </div>
              <span style={{ fontSize: 12, color: C.onSurfaceVariant }}>Average district-level spectral absorption analysis across active sampling probes</span>
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 12, color: C.onSurfaceVariant, alignItems: "center" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: C.primary }} />Recorded Average</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: C.error }} />Permissible Ceiling</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 }}>
            {CONTAMINANTS.map((c) => {
              const dimmed = ["pb", "as", "fe"].includes(c.key) && !metalFilters[c.key];
              const fillPct = Math.min((c.value / c.axisMax) * 100, 100);
              const ceilingPct = Math.min((c.ceiling / c.axisMax) * 100, 100);
              const Icon = c.Icon;
              return (
                <div key={c.key} style={{ ...cardLow, padding: 12, opacity: dimmed ? 0.4 : 1, transition: "opacity 0.2s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ ...label, color: C.onSurface }}>{c.label}</span>
                  </div>
                  <div style={{ fontSize: 10, color: C.onSurfaceVariant, ...mono, marginBottom: 6 }}>Ceiling: {c.ceiling.toFixed(3)} ppm</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                    <span style={{ ...mono, fontSize: 20, fontWeight: 700, color: c.tone }}>{c.value.toFixed(3)}</span>
                    <span style={{ ...mono, fontSize: 11, color: C.onSurfaceVariant }}>ppm</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: c.tone, marginBottom: 10, ...mono }}>
                    <Icon size={12} /> {c.note}
                  </div>
                  <div style={{ position: "relative", width: "100%", height: 8, background: C.surfaceHighest, borderRadius: 4, overflow: "hidden", marginBottom: 6 }}>
                    <div style={{ width: `${fillPct}%`, height: "100%", background: c.tone, borderRadius: 4 }} />
                    <div style={{ position: "absolute", top: 0, bottom: 0, left: `${ceilingPct}%`, width: 2, background: C.error }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.onSurfaceVariant, ...mono }}>
                    <span>0.000</span>
                    <span>Max Safe: {c.ceiling.toFixed(3)}</span>
                    <span>{c.axisMax.toFixed(3)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <footer style={{ borderTop: `1px solid ${C.outline}33`, padding: "14px 16px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8, color: C.onSurfaceVariant, fontSize: 12 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, justifyContent: "center" }}>
          <span>TOYAM SCADA Engine v3.4.1</span>
          <span>|</span>
          <span>Jharkhand Drinking Water and Sanitation Department</span>
          <span>|</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, color: C.tertiary }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.tertiary }} /> Data Integrity Verified
          </span>
        </div>
        <div style={{ ...mono, fontSize: 11 }}>CENTRAL DISPATCH: 1800-345-6789 • ENCRYPTED TELEMETRY STREAM</div>
      </footer>
    </div>
  );
}
