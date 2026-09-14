import React, { useState, useEffect } from "react";
import { Droplet, RefreshCw, Shield, Truck, MessageSquare, ShoppingCart, CheckCircle2, ChevronRight, Radio, Filter as FilterIcon, ListChecks } from "lucide-react";

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

function Pill({ children, tone = "default", dot }) {
  const tones = {
    default: { bg: "rgba(148,163,184,0.08)", color: textMid, border: line },
    cyan: { bg: "rgba(34,211,238,0.08)", color: cyan, border: "rgba(34,211,238,0.25)" },
    green: { bg: "rgba(52,211,153,0.08)", color: green, border: "rgba(52,211,153,0.25)" },
    red: { bg: "rgba(239,68,68,0.12)", color: "#fca5a5", border: "rgba(239,68,68,0.3)" },
    amber: { bg: "rgba(251,191,36,0.1)", color: amber, border: "rgba(251,191,36,0.3)" },
  };
  const t = tones[tone];
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

function Btn({ children, tone = "ghost", icon: Icon, small }) {
  const styles =
    tone === "solid"
      ? { background: cyan, color: "#04141a", border: "1px solid transparent" }
      : tone === "danger"
      ? { background: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.35)" }
      : { background: "rgba(255,255,255,0.03)", color: textMid, border: `1px solid ${line}` };
  return (
    <button
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
              width: 34,
              height: 34,
              borderRadius: 7,
              background: sevTone === "red" ? "rgba(239,68,68,0.12)" : "rgba(251,191,36,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            {severity.includes("1") ? (
              <span style={{ color: sevTone === "red" ? red : amber, fontSize: 16 }}>⇄</span>
            ) : (
              <FilterIcon size={16} color={sevTone === "red" ? red : amber} />
            )}
          </div>
          <div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
              <Pill tone={sevTone}>{severity}</Pill>
              <span style={{ fontSize: 11, color: textDim, fontFamily: "'JetBrains Mono', monospace" }}>{id}</span>
              <span style={{ fontSize: 11, color: textDim }}>•</span>
              <span style={{ fontSize: 11, color: textDim, fontFamily: "'JetBrains Mono', monospace" }}>{time}</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#e8edf5", marginBottom: 4, lineHeight: 1.3 }}>{title}</div>
            <div style={{ fontSize: 12, color: textDim }}>{zone}</div>
          </div>
        </div>
        <div style={{ flexShrink: 0 }}>{statusPill}</div>
      </div>
      {children}
      {actions && <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>{actions}</div>}
    </div>
  );
}

export default function ToyamDashboard() {
  const [pressure, setPressure] = useState(4.8);
  const [turbidity, setTurbidity] = useState(140.4);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => {
      setPressure((p) => +(p + (Math.random() - 0.5) * 0.06).toFixed(1));
      setTurbidity((t) => +(t + (Math.random() - 0.5) * 1.2).toFixed(1));
      setNow(new Date());
    }, 2500);
    return () => clearInterval(t);
  }, []);

  const vans = [
    { id: "Van #04 - Dhanbad", officer: "Officer: R. Soren", status: "IN TRANSIT", tone: "cyan" },
    { id: "Van #02 - Bokaro", officer: "Officer: M. P. Singh", status: "ON SITE", tone: "green" },
    { id: "Van #07 - Ranchi Base", officer: "Officer: K. Murmu", status: "STANDBY", tone: "default" },
  ];

  const roster = [
    { plant: "Dhanbad Unit #04", sub: "Jharia Deep Well Node", sev: "SEV 1 - ACTIVE", sevTone: "red", tech: "R. Soren (Badge #DH-412)", comms: "+91 94311 82841", officer: "Er. S. Bhattacharya", officerSub: "Executive Engineer (DW&SD)", eta: "24 mins (Transit)", etaColor: cyan, level: "LEVEL 3 (HQ)" },
    { plant: "Bokaro Unit #02", sub: "Chandrapura Plant", sev: "SEV 1 - BACKWASH", sevTone: "red", tech: "M. P. Singh (Badge #BK-108)", comms: "+91 94301 98452", officer: "Dr. A. Verma", officerSub: "Chief Chemist, Bokaro", eta: "On Site (Evaluating)", etaColor: green, level: "LEVEL 2 (DIST)" },
    { plant: "West Singhbhum Unit #01", sub: "Chaibasa South Intake", sev: "SEV 2 - WARNING", sevTone: "amber", tech: "A. K. Tigga (Badge #WS-205)", comms: "+91 98350 44102", officer: "Er. Rajesh Tirkey", officerSub: "Superintending Eng., Chaibasa", eta: "48h (Scheduled)", etaColor: textMid, level: "LEVEL 1 (UNIT)" },
    { plant: "Ramgarh Unit #03", sub: "Patratu Dam Runoff", sev: "RESOLVED", sevTone: "default", tech: "S. Mahato (Badge #RM-091)", comms: "+91 94315 77299", officer: "Er. N. Kumar", officerSub: "Sub-Divisional Officer, Ramgarh", eta: "Closed (10:15 IST)", etaColor: green, level: "CLEARED" },
  ];

  return (
    <div
      style={{
        background: bg,
        minHeight: "100vh",
        color: textMid,
        fontFamily: "'Inter', -apple-system, sans-serif",
        fontSize: 13,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::selection { background: rgba(34,211,238,0.3); }
      `}</style>

      {/* Top bar */}
      <div style={{ borderBottom: `1px solid ${line}`, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 7, background: "linear-gradient(135deg,#0891b2,#0e7490)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Droplet size={16} color="#e0fbff" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#e8edf5", letterSpacing: 0.5 }}>TOYAM</span>
              <span style={{ fontSize: 9.5, fontFamily: "'JetBrains Mono', monospace", background: "rgba(34,211,238,0.12)", color: cyan, padding: "2px 6px", borderRadius: 3 }}>JH-DW&SD</span>
            </div>
            <div style={{ fontSize: 10.5, color: textDim, marginTop: 1 }}>State Water Quality &amp; Purification Monitoring Portal — Govt of Jharkhand</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Pill tone="green" dot>42/45 PLANTS ONLINE</Pill>
          <Pill tone="cyan" dot>LIVE TELEMETRY ACTIVE</Pill>
        </div>

        <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
          {["Statewide Overview", "Plant Telemetry", "Analytics & Reports"].map((n) => (
            <span key={n} style={{ fontSize: 12, color: textDim, cursor: "pointer" }}>
              {n}
            </span>
          ))}
          <div style={{ background: "rgba(34,211,238,0.1)", border: `1px solid ${cyan}`, color: cyan, fontSize: 12, fontWeight: 600, padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}>
            Critical Alerts &amp; Incident Response
          </div>
        </div>
      </div>

      {/* Defcon + ticker */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 20px", borderBottom: `1px solid ${line}`, background: "rgba(239,68,68,0.04)", flexWrap: "wrap" }}>
        <Pill tone="red" dot>DEFCON LEVEL 2</Pill>
        <span style={{ fontSize: 11.5, fontFamily: "'JetBrains Mono', monospace", color: textMid }}>
          INCIDENT TICKER: <span style={{ color: "#fca5a5", fontWeight: 700 }}>Active Critical: 2</span> / Under Containment: 1 / Resolved Today: 5
        </span>
        <div style={{ flex: 1 }} />
        <Btn tone="danger" small>⚠ ACTIVATE STATE HEAVY-METAL PROTOCOL</Btn>
        <Btn tone="ghost" small icon={RefreshCw}>Export Audit Packet</Btn>
      </div>

      <div style={{ padding: "10px 20px", borderBottom: `1px solid ${line}` }}>
        <Pill tone="green" dot>Automated Protection Matrix: ACTIVE (0 Contaminated Liters Released)</Pill>
      </div>

      {/* filter row */}
      <div style={{ display: "flex", alignItems: "center", padding: "0 20px", borderBottom: `1px solid ${line}`, overflowX: "auto" }}>
        {[
          { label: "ALL INCIDENTS", count: 12, tone: textDim },
          { label: "CRITICAL - IMMEDIATE CUTOFF", count: 2, tone: red },
          { label: "WARNING - DRIFT DETECTED", count: 4, tone: amber },
          { label: "MAINTENANCE & CONSUMABLE", count: 6, tone: textDim },
        ].map((f, i) => (
          <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 18px", borderRight: i < 3 ? `1px solid ${line}` : "none", whiteSpace: "nowrap" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: f.tone }} />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: "#e8edf5" }}>{f.label}</span>
            <span style={{ fontSize: 11, color: textDim, fontFamily: "'JetBrains Mono', monospace" }}>{f.count}</span>
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 18, padding: "14px 10px", fontSize: 11, color: textDim, fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap" }}>
          <span>BROKER: SCADA-BROKER-RANCHI-01</span>
          <span>LATENCY: 14ms</span>
        </div>
      </div>

      {/* main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18, padding: 20, alignItems: "start" }}>
        <div>
          {/* Incident 1 */}
          <IncidentCard
            severity="SEVERITY 1 // CRITICAL"
            sevTone="red"
            id="#INC-2026-0894"
            time="Today, 14:22:10 IST (8 mins ago)"
            title="Severe Lead (Pb) Intrusion Detected — Dhanbad Unit #04"
            zone="Zone: Jharia Coal Belt Aquifer Node 4B | District: Dhanbad"
            statusPill={<Pill tone="cyan"><RefreshCw size={11} /> ISOLATED BY SCADA</Pill>}
            actions={
              <>
                <Btn tone="solid">🔒 CONFIRM SOLENOID LOCK</Btn>
                <Btn icon={MessageSquare}>SEND EMERGENCY SMS/AUDIO</Btn>
                <Btn icon={Radio}>LIVE SENSOR FEED</Btn>
              </>
            }
          >
            <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
              <StatBox label="SENSED CONCENTRATION" value="0.042" unit="mg/L" valueColor="#fca5a5" sub="BIS Safe Limit: < 0.010 mg/L" />
              <StatBox label="AUTOMATED CONTAINMENT" value="120" unit="ms trip" sub="Diverted 1,200 L to Slurry Tank" />
              <StatBox label="PUBLIC HEALTH SHIELD" value="0" unit="Citizens Exposed" valueColor={green} sub="Reservoir Quality: 0.002 mg/L (Pristine)" />
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${line}`, borderRadius: 6, padding: "10px 14px", display: "flex", gap: 24, flexWrap: "wrap", fontSize: 12 }}>
              <span style={{ color: textMid }}>
                <Truck size={13} style={{ display: "inline", marginRight: 6, verticalAlign: -2 }} />
                Field Response Active — Team Bravo (Lead Tech: <b style={{ color: "#e8edf5" }}>R. Soren</b>) Dispatched • ETA: <span style={{ color: cyan }}>24 mins</span>
              </span>
              <span style={{ color: green }}>
                <CheckCircle2 size={13} style={{ display: "inline", marginRight: 6, verticalAlign: -2 }} />
                Mukhiya Notification Broadcast: ACKNOWLEDGED
              </span>
            </div>
          </IncidentCard>

          {/* Incident 2 */}
          <IncidentCard
            severity="SEVERITY 1 // CRITICAL"
            sevTone="red"
            id="#INC-2026-0892"
            time="Today, 13:45:00 IST (45 mins ago)"
            title="Turbidity & Suspended Solids Surge post-Mine Blasting — Bokaro Unit #02"
            zone="Zone: Chandrapura Catchment | District: Bokaro"
            statusPill={<Pill tone="amber"><RefreshCw size={11} /> BACKWASH RUNNING</Pill>}
            actions={
              <>
                <Btn tone="solid" icon={ShoppingCart}>APPROVE FILTER REPLACEMENT ORDER</Btn>
                <Btn>ACKNOWLEDGE ALERT</Btn>
              </>
            }
          >
            <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
              <StatBox label="RAW WATER TURBIDITY" value={turbidity} unit="NTU" valueColor="#fca5a5" flag="⚠ +420%" sub="Safe threshold: < 5.0 NTU (Immediate Sand Filter Load)" />
              <StatBox label="PRE-FILTER ΔP (DIFFERENTIAL PRESSURE)" value={pressure} unit="BAR" valueColor={amber} flag="CRITICAL DROP" sub="Auto Action: RO Bypass engaged; 35m pneumatic backwash loop triggered" />
            </div>
            <div style={{ background: "rgba(52,211,153,0.05)", border: `1px solid rgba(52,211,153,0.2)`, borderRadius: 6, padding: "10px 14px", fontSize: 12, color: green, display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle2 size={13} />
              Discharge port gated. 0 NTU clean effluent stored in Buffer Tank B.
            </div>
          </IncidentCard>

          {/* Incident 3 */}
          <IncidentCard
            severity="SEVERITY 2 // WARNING"
            sevTone="amber"
            id="#INC-2026-0879"
            time="Today, 11:18:22 IST (3 hrs ago)"
            title="Ion Exchange Resin Bed Saturation Warning — West Singhbhum Unit #01"
            zone="Zone: Chaibasa Industrial Runoff • Plant Node IX-01"
            statusPill={<Pill tone="amber">CAPACITY AT 88%</Pill>}
          >
            <div style={{ marginTop: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: textDim, marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>
                <span>HEAVY METAL ADSORPTION CAPACITY</span>
                <span style={{ color: amber }}>88.4% EXHAUSTED</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                <div style={{ width: "88.4%", height: "100%", background: `linear-gradient(90deg, ${cyan}, ${amber})`, borderRadius: 4 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11.5 }}>
                <span style={{ color: textDim }}>Scheduled automated brine regeneration in 48 hours</span>
                <span style={{ color: cyan, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                  FAST-TRACK REGEN CYCLE <ChevronRight size={13} />
                </span>
              </div>
            </div>
          </IncidentCard>

          {/* Roster table */}
          <div style={{ background: panel, border: `1px solid ${line}`, borderRadius: 8, padding: 18, marginTop: 4 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <ListChecks size={16} color={cyan} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#e8edf5" }}>Incident Escalation &amp; Technician Roster</div>
                  <div style={{ fontSize: 11, color: textDim, marginTop: 2 }}>Direct nodal escalation ladder and live field assignment audit</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11, color: textDim, fontFamily: "'JetBrains Mono', monospace" }}>DISTRICT NODAL SYNC:</span>
                <Pill tone="green" dot>LIVE</Pill>
                <Btn small icon={RefreshCw}>REFRESH ROSTER</Btn>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${line}` }}>
                    {["PLANT / ZONE", "SEVERITY / STATUS", "ASSIGNED LEAD TECH", "EMERGENCY COMMS", "DISTRICT NODAL OFFICER", "ACTION ETA", "ESCALATION LEVEL"].map((h) => (
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

            {vans.map((v, i) => (
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
