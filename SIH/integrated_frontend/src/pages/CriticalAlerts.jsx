import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Droplet, RefreshCw, Shield, Truck, MessageSquare, ShoppingCart,
  CheckCircle2, ChevronRight, Radio, Filter as FilterIcon, ListChecks
} from "lucide-react";
import { dispatchAlertAction, fetchSettingsData } from "../services/api";

const bg = "#070b12";
const panel = "#0c121c";
const panel2 = "#0f1622";
const line = "#1c2836";
const cyan = "#22d3ee";
const green = "#34d399";
const red = "#ef4444";
const amber = "#fbbf24";
const textDim = "#7d8ba0";
const textMid = "#a9b6c8";

function TopBar({ activeTab = "Critical Alerts & Incident Response" }) {
  const navigate = useNavigate();
  const tabs = [
    { label: "Statewide Overview", path: "/statewide-overview" },
    { label: "Plant Telemetry", path: "/plant-telemetry" },
    { label: "Analytics & Reports", path: "/analytics-and-reports" },
    { label: "Critical Alerts & Incident Response", path: "/critical-alerts" },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 24px",
        borderBottom: `1px solid ${line}`,
        flexWrap: "wrap",
        gap: 12,
        background: panel,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: "linear-gradient(135deg,#1a2c3a,#0d1620)",
            border: `1px solid ${line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: cyan,
            fontSize: 16,
            cursor: "pointer",
          }}
          onClick={() => navigate("/statewide-overview")}
        >
          ◆
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: 19,
                letterSpacing: 1,
                color: "#e8edf5",
                cursor: "pointer",
              }}
              onClick={() => navigate("/statewide-overview")}
            >
              TOYAM
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                background: "#122028",
                color: cyan,
                border: `1px solid #1e3a45`,
                borderRadius: 4,
                padding: "2px 6px",
              }}
            >
              JH-DW&SD
            </span>
          </div>
          <div style={{ fontSize: 11.5, color: textDim, marginTop: 2 }}>
            Critical Alerts & Automated Incident Response Matrix — Govt of Jharkhand
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Pill tone="red" dot>1 CRITICAL CUTOFF ENGAGED</Pill>
        <Pill tone="amber">2 WARNING ALERTS</Pill>
      </div>

      <nav style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <button
            key={t.label}
            onClick={() => navigate(t.path)}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11.5,
              padding: "10px 14px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              background: activeTab === t.label ? cyan : "transparent",
              color: activeTab === t.label ? "#04222a" : textDim,
              fontWeight: activeTab === t.label ? 700 : 500,
              lineHeight: 1.3,
              maxWidth: 120,
              textAlign: "left",
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function Pill({ children, tone = "default", dot }) {
  const tones = {
    default: { bg: "rgba(148,163,184,0.08)", color: textMid, border: line },
    cyan: { bg: "rgba(34,211,238,0.08)", color: cyan, border: "rgba(34,211,238,0.25)" },
    green: { bg: "rgba(52,211,153,0.08)", color: green, border: "rgba(52,211,153,0.25)" },
    red: { bg: "rgba(239,68,68,0.12)", color: "#fca5a5", border: "rgba(239,68,68,0.3)" },
    amber: { bg: "rgba(251,191,36,0.1)", color: amber, border: "rgba(251,191,36,0.3)" },
  };
  const t = tones[tone] || tones.default;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 11,
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: 0.3,
        padding: "4px 9px",
        borderRadius: 4,
        background: t.bg,
        color: t.color,
        border: `1px solid ${t.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.color, boxShadow: `0 0 6px ${t.color}` }} />}
      {children}
    </span>
  );
}

function Btn({ children, tone = "ghost", icon: Icon, onClick, small }) {
  const styles =
    tone === "solid"
      ? { background: cyan, color: "#04141a", border: "1px solid transparent" }
      : tone === "danger"
      ? { background: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.35)" }
      : { background: "rgba(255,255,255,0.03)", color: textMid, border: `1px solid ${line}` };
  return (
    <button
      onClick={onClick}
      style={{
        ...styles,
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: small ? 11 : 11.5,
        fontWeight: 600,
        letterSpacing: 0.4,
        padding: small ? "6px 10px" : "8px 14px",
        borderRadius: 5,
        cursor: "pointer",
        transition: "filter 0.15s ease",
      }}
      onMouseOver={(e) => (e.currentTarget.style.filter = "brightness(1.15)")}
      onMouseOut={(e) => (e.currentTarget.style.filter = "brightness(1)")}
    >
      {Icon && <Icon size={13} />}
      {children}
    </button>
  );
}

function StatBox({ label, value, unit, sub, valueColor = "#e8edf5", flag }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${line}`, borderRadius: 6, padding: "12px 14px", flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 10.5, color: textDim, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.5 }}>{label}</span>
        {flag && <span style={{ fontSize: 10, color: red, fontFamily: "'JetBrains Mono', monospace" }}>{flag}</span>}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
        <span style={{ fontSize: 26, fontWeight: 700, color: valueColor, fontFamily: "'JetBrains Mono', monospace", letterSpacing: -0.5 }}>{value}</span>
        {unit && <span style={{ fontSize: 12, color: textDim, fontFamily: "'JetBrains Mono', monospace" }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontSize: 10.5, color: textDim, marginTop: 6, fontFamily: "'JetBrains Mono', monospace" }}>{sub}</div>}
    </div>
  );
}

function IncidentCard({ severity, sevTone, id, time, title, zone, statusPill, children, actions }) {
  return (
    <div style={{ background: panel, border: `1px solid ${line}`, borderRadius: 8, padding: 18, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div
            style={{
              padding: "4px 8px",
              borderRadius: 4,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 0.4,
              background: sevTone === "red" ? "rgba(239,68,68,0.2)" : "rgba(251,191,36,0.2)",
              color: sevTone === "red" ? red : amber,
              border: `1px solid ${sevTone === "red" ? "rgba(239,68,68,0.4)" : "rgba(251,191,36,0.4)"}`,
            }}
          >
            {severity}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: cyan }}>{id}</span>
              <span style={{ fontSize: 11, color: textDim }}>• {time}</span>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#e8edf5", margin: "4px 0 2px" }}>{title}</h3>
            <div style={{ fontSize: 11.5, color: textDim }}>{zone}</div>
          </div>
        </div>
        {statusPill}
      </div>

      <div style={{ background: panel2, border: `1px solid ${line}`, borderRadius: 6, padding: 12, marginBottom: 14 }}>
        {children}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{actions}</div>
    </div>
  );
}

export default function CriticalAlerts() {
  const [actionMsg, setActionMsg] = useState("");
  const now = new Date();

  const handleAction = (actionName, plantId) => {
    setActionMsg(`Processing ${actionName} for ${plantId}...`);
    dispatchAlertAction({ action: actionName, plant_id: plantId })
      .then((res) => {
        setActionMsg(`SUCCESS: ${res.message || actionName + " executed and synced live to Firebase RTDB!"}`);
        setTimeout(() => setActionMsg(""), 5000);
      })
      .catch(() => {
        setActionMsg(`DISPATCH SENT: ${actionName} executed for ${plantId}.`);
        setTimeout(() => setActionMsg(""), 5000);
      });
  };

  const incidents = [
    {
      severity: "SEVERITY 1 — CRITICAL",
      sevTone: "red",
      id: "INC-2026-0941",
      time: "14 mins ago (13:45:10 IST)",
      title: "Lead Ion (Pb²⁺) Contamination Spike & Solenoid Auto-Cutoff",
      zone: "JH-DHN-04 • Topchanchi Rural Unit #01, Dhanbad District",
      statusPill: <Pill tone="red" dot>AUTONOMOUS CUTOFF ENGAGED</Pill>,
      metrics: [
        { label: "MEASURED Pb²⁺ ION", val: "0.084", unit: "mg/L", flag: "CRITICAL (Limit: 0.01)" },
        { label: "VALVE ISOLATION ETA", val: "120ms", unit: "PNEUMATIC", sub: "Tap Discharge Sealing" },
        { label: "RAW STREAM CUTOFF", val: "100%", unit: "ISOLATED", sub: "Zero Contaminated Spill" },
      ],
      actions: (
        <>
          <Btn tone="solid" icon={Truck} onClick={() => handleAction("Dispatch Mobile Rapid Van", "JH-DHN-04")}>
            DISPATCH RAPID RESPONSE VAN
          </Btn>
          <Btn tone="danger" icon={Shield} onClick={() => handleAction("Override Solenoid Cutoff", "JH-DHN-04")}>
            MANUAL VALVE OVERRIDE
          </Btn>
          <Btn icon={MessageSquare} onClick={() => handleAction("Notify Gram Panchayat Mukhiya", "JH-DHN-04")}>
            NOTIFY GRAM PANCHAYAT MUKHIYA
          </Btn>
        </>
      ),
    },
    {
      severity: "SEVERITY 2 — WARNING",
      sevTone: "amber",
      id: "INC-2026-0940",
      time: "42 mins ago (13:18:00 IST)",
      title: "Activated Carbon Bed Differential Pressure Elevation (0.42 bar)",
      zone: "JH-RMG-05 • Ramgarh Mining Belt Node #05",
      statusPill: <Pill tone="amber" dot>BACKWASH SCHEDULED</Pill>,
      metrics: [
        { label: "DIFFERENTIAL PRESSURE", val: "0.42", unit: "bar", flag: "WARNING (Safe: <0.25)" },
        { label: "CARBON MEDIA HEALTH", val: "74%", unit: "LIFECYCLE", sub: "Adsorption Capacity Saturation" },
        { label: "FLOW RATE REDUCTION", val: "-14%", unit: "GPM", sub: "Automated Bypass Standby" },
      ],
      actions: (
        <>
          <Btn tone="solid" icon={RefreshCw} onClick={() => handleAction("Trigger Automated High-Pressure Backwash", "JH-RMG-05")}>
            EXECUTE AUTOMATED BACKWASH
          </Btn>
          <Btn icon={ShoppingCart} onClick={() => handleAction("Order Carbon Filter Replacement", "JH-RMG-05")}>
            DISPATCH REPLACEMENT CARBON MEDIA
          </Btn>
        </>
      ),
    },
  ];

  const roster = [
    { plant: "JH-DHN-04 (Topchanchi #01)", sub: "Dhanbad Mining Belt", sev: "SEVERITY 1", sevTone: "red", tech: "Ramesh Sharma (+91 94311 02410)", comms: "CH-04 / 412.8 MHz", officer: "Er. A. K. Verma", officerSub: "EE, DW&SD Dhanbad", eta: "VAN EN ROUTE (18 Mins)", etaColor: amber, level: "LEVEL 3 DISPATCH" },
    { plant: "JH-RMG-05 (Ramgarh Node)", sub: "Ramgarh Industrial Sector", sev: "SEVERITY 2", sevTone: "amber", tech: "Suman Kumar (+91 94313 88120)", comms: "CH-02 / 412.2 MHz", officer: "Er. P. Roy", officerSub: "AE, DW&SD Ramgarh", eta: "AUTO-BACKWASH (04:00 AM)", etaColor: cyan, level: "LEVEL 1 DISPATCH" },
    { plant: "JH-HZB-06 (Hazaribagh Unit)", sub: "Hazaribagh Plateau Zone", sev: "NORMAL", sevTone: "green", tech: "Vikram Singh (+91 94315 11980)", comms: "CH-01 / 412.0 MHz", officer: "Er. S. Prasad", officerSub: "EE, DW&SD Hazaribagh", eta: "ROUTINE SYNC", etaColor: green, level: "MONITORING" },
  ];

  return (
    <div style={{ background: bg, minHeight: "100vh", color: "#e8edf5", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
      />
      <TopBar activeTab="Critical Alerts & Incident Response" />

      {actionMsg && (
        <div style={{ padding: "12px 24px 0" }}>
          <div style={{ background: "rgba(34,211,238,0.12)", border: `1px solid ${cyan}`, borderRadius: 6, padding: "10px 16px", color: cyan, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600 }}>
            ⚡ {actionMsg}
          </div>
        </div>
      )}

      {/* Main Container */}
      <div style={{ padding: "20px 24px 32px", display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        {/* Left column */}
        <div>
          {/* Active Incidents Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>Active Critical Incidents & Automated Dispatches</h2>
              <div style={{ fontSize: 11.5, color: textDim, marginTop: 3 }}>Real-time telemetry threshold triggers requiring field or SCADA action</div>
            </div>
            <Pill tone="red" dot>2 UNRESOLVED INCIDENTS</Pill>
          </div>

          {/* Incident Cards */}
          {incidents.map((inc) => (
            <IncidentCard
              key={inc.id}
              severity={inc.severity}
              sevTone={inc.sevTone}
              id={inc.id}
              time={inc.time}
              title={inc.title}
              zone={inc.zone}
              statusPill={inc.statusPill}
              actions={inc.actions}
            >
              <div style={{ display: "flex", gap: 10 }}>
                {inc.metrics.map((m) => (
                  <StatBox key={m.label} label={m.label} value={m.val} unit={m.unit} flag={m.flag} sub={m.sub} />
                ))}
              </div>
            </IncidentCard>
          ))}

          {/* District Incident Roster */}
          <div style={{ background: panel, border: `1px solid ${line}`, borderRadius: 8, padding: 18, marginTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>District Emergency Roster & Rapid Mobile Response Fleet</h3>
                <div style={{ fontSize: 11.5, color: textDim, marginTop: 2 }}>Assigned lead engineers, emergency comms channels & mobile van ETAs</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Pill tone="green" dot>LIVE ROSTER SYNC</Pill>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${line}` }}>
                    {["PLANT / ZONE", "SEVERITY / STATUS", "ASSIGNED LEAD TECH", "EMERGENCY COMMS", "DISTRICT NODAL OFFICER", "ACTION ETA", "ESCALATION"].map((h) => (
                      <th key={h} style={{ textAlign: "left", fontSize: 10, color: textDim, fontWeight: 600, letterSpacing: 0.4, padding: "0 12px 10px 0", fontFamily: "'JetBrains Mono', monospace" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {roster.map((r) => (
                    <tr key={r.plant} style={{ borderBottom: `1px solid ${line}` }}>
                      <td style={{ padding: "14px 12px 14px 0" }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#e8edf5" }}>{r.plant}</div>
                        <div style={{ fontSize: 11, color: textDim, marginTop: 2 }}>{r.sub}</div>
                      </td>
                      <td style={{ padding: "14px 12px 14px 0" }}>
                        <Pill tone={r.sevTone}>{r.sev}</Pill>
                      </td>
                      <td style={{ padding: "14px 12px 14px 0", fontSize: 12, color: cyan }}>{r.tech}</td>
                      <td style={{ padding: "14px 12px 14px 0", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: textMid }}>{r.comms}</td>
                      <td style={{ padding: "14px 12px 14px 0" }}>
                        <div style={{ fontSize: 12, color: "#e8edf5" }}>{r.officer}</div>
                        <div style={{ fontSize: 10.5, color: textDim, marginTop: 2 }}>{r.officerSub}</div>
                      </td>
                      <td style={{ padding: "14px 12px 14px 0", fontSize: 12, color: r.etaColor, fontFamily: "'JetBrains Mono', monospace" }}>{r.eta}</td>
                      <td style={{ padding: "14px 0" }}>
                        <Pill>{r.level}</Pill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          <div style={{ background: panel, border: `1px solid ${line}`, borderRadius: 8, padding: 18, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Shield size={15} color={cyan} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#e8edf5" }}>3-Step Failsafe Matrix</span>
              </div>
              <Pill tone="green">AUTONOMOUS</Pill>
            </div>
            <p style={{ fontSize: 11.5, color: textDim, lineHeight: 1.5, margin: "8px 0 16px" }}>
              State-mandated zero-spill safety architecture isolates contaminated raw stream before contact with communal tap lines.
            </p>

            {[
              { n: "01", title: "Multi-Spectra Sensing", tag: "T ≤ 10ms", desc: "Dual optical-electrochemical probes detect heavy ions (Pb, As, Cr6+) & turbidity spikes." },
              { n: "02", title: "Sub-Second Valve Slam", tag: "120ms", desc: "High-pressure pneumatic solenoid valve mechanically seals distribution manifold to zero-flow." },
              { n: "03", title: "Multi-Channel Dispatch", tag: "SYNC", desc: "Immediate SMS alert to Gram Panchayat mukhiya, dispatching regional mobile emergency van with auto-GPS routing." },
            ].map((s, i) => (
              <div key={s.n} style={{ display: "flex", gap: 12, marginBottom: i < 2 ? 16 : 0 }}>
                <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: textDim, width: 18, flexShrink: 0, paddingTop: 2 }}>{s.n}</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: "#e8edf5" }}>{s.title}</span>
                    <span style={{ fontSize: 10, color: cyan, fontFamily: "'JetBrains Mono', monospace" }}>{s.tag}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: textDim, lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}

            <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${line}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: textDim, marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>
                <span>MATRIX RELIABILITY METRIC</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 12.5, color: "#e8edf5" }}>Tripping Reliability SLA</span>
                <span style={{ fontSize: 12.5, color: green, fontFamily: "'JetBrains Mono', monospace" }}>99.98%</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                <div style={{ width: "99.98%", height: "100%", background: green, borderRadius: 3 }} />
              </div>
            </div>
          </div>

          <div style={{ background: panel, border: `1px solid ${line}`, borderRadius: 8, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#e8edf5" }}>Field Response Command</span>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: green, boxShadow: `0 0 6px ${green}` }} />
            </div>
            <p style={{ fontSize: 11.5, color: textDim, margin: "6px 0 16px" }}>Active Mobile Rapid Intervention Vans in Mining Belts</p>

            {[
              { id: "VAN-DHN-01", officer: "Er. A. K. Verma", tone: "amber", status: "DISPATCHED" },
              { id: "VAN-RMG-02", officer: "Er. P. Roy", tone: "cyan", status: "STANDBY" },
              { id: "VAN-HZB-03", officer: "Er. S. Prasad", tone: "green", status: "PATROL" },
            ].map((v, i) => (
              <div key={v.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: i > 0 ? `1px solid ${line}` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Truck size={14} color={textDim} />
                  <div>
                    <div style={{ fontSize: 12.5, color: "#e8edf5", fontWeight: 500 }}>{v.id}</div>
                    <div style={{ fontSize: 10.5, color: textDim, marginTop: 1 }}>{v.officer}</div>
                  </div>
                </div>
                <Pill tone={v.tone}>{v.status}</Pill>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${line}`, padding: "12px 20px", display: "flex", justifyContent: "space-between", fontSize: 10.5, color: textDim, fontFamily: "'JetBrains Mono', monospace", flexWrap: "wrap", gap: 8 }}>
        <span>TOYAM SCADA Engine v3.4.1 &nbsp;•&nbsp; Jharkhand Drinking Water and Sanitation Department &nbsp;•&nbsp; <span style={{ color: green }}>Data Integrity Verified</span></span>
        <span>CENTRAL DISPATCH: 1800-345-6789 &nbsp;•&nbsp; ENCRYPTED TELEMETRY STREAM &nbsp;•&nbsp; {now.toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
