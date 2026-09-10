import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from "recharts";
import {
  Droplet, Download, Lock, Radio, Shield, Search, ChevronDown, Filter,
  CheckCircle2, AlertTriangle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Camera, ExternalLink, Gauge, FlaskConical, Activity, Waves,
} from "lucide-react";

const bg = "#070b12";
const panel = "#0c121c";
const line = "#1c2836";
const cyan = "#22d3ee";
const green = "#34d399";
const red = "#ef4444";
const amber = "#fbbf24";
const textDim = "#7d8ba0";
const textMid = "#a9b6c8";
const mono = "'JetBrains Mono', monospace";

function Pill({ children, tone = "default", dot, small }) {
  const tones = {
    default: { bg: "rgba(148,163,184,0.08)", color: textMid, border: line },
    cyan: { bg: "rgba(34,211,238,0.08)", color: cyan, border: "rgba(34,211,238,0.25)" },
    green: { bg: "rgba(52,211,153,0.08)", color: green, border: "rgba(52,211,153,0.25)" },
    red: { bg: "rgba(239,68,68,0.12)", color: "#fca5a5", border: "rgba(239,68,68,0.3)" },
    amber: { bg: "rgba(251,191,36,0.1)", color: amber, border: "rgba(251,191,36,0.3)" },
  };
  const t = tones[tone];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: small ? 10 : 11, fontFamily: mono, letterSpacing: 0.3, padding: small ? "3px 7px" : "4px 9px", borderRadius: 4, background: t.bg, color: t.color, border: `1px solid ${t.border}`, whiteSpace: "nowrap" }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.color, boxShadow: `0 0 6px ${t.color}` }} />}
      {children}
    </span>
  );
}

function Btn({ children, tone = "ghost", icon: Icon, small, active }) {
  const styles =
    tone === "solid"
      ? { background: cyan, color: "#04141a", border: "1px solid transparent" }
      : active
      ? { background: "rgba(34,211,238,0.1)", color: cyan, border: `1px solid ${cyan}` }
      : { background: "rgba(255,255,255,0.03)", color: textMid, border: `1px solid ${line}` };
  return (
    <button style={{ ...styles, display: "inline-flex", alignItems: "center", gap: 7, fontFamily: mono, fontSize: small ? 10.5 : 11.5, fontWeight: 600, letterSpacing: 0.3, padding: small ? "6px 10px" : "8px 14px", borderRadius: 5, cursor: "pointer" }}>
      {Icon && <Icon size={12} />}
      {children}
    </button>
  );
}

function StatCard({ icon: Icon, label, value, unit, sub, subColor = textDim, valueColor = "#e8edf5", progress, progressColor }) {
  return (
    <div style={{ background: panel, border: `1px solid ${line}`, borderRadius: 8, padding: "14px 16px", flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 10.5, color: textDim, fontFamily: mono, letterSpacing: 0.4 }}>{label}</span>
        <Icon size={13} color={textDim} />
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontSize: 25, fontWeight: 700, color: valueColor, fontFamily: mono, letterSpacing: -0.5 }}>{value}</span>
        {unit && <span style={{ fontSize: 11.5, color: textDim, fontFamily: mono }}>{unit}</span>}
      </div>
      {progress !== undefined && (
        <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", marginTop: 10, marginBottom: 6, overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: progressColor || green, borderRadius: 2 }} />
        </div>
      )}
      {sub && <div style={{ fontSize: 10.5, color: subColor, marginTop: progress !== undefined ? 0 : 8, fontFamily: mono }}>{sub}</div>}
    </div>
  );
}

const chartData = [
  { day: "Day 01 (Oct 01)", dhanbad: 82, bokaro: 78, chaibasa: 97.4 },
  { day: "Day 04", dhanbad: 85, bokaro: 82, chaibasa: 97.6 },
  { day: "Day 07", dhanbad: 88, bokaro: 86, chaibasa: 97.7 },
  { day: "Day 10", dhanbad: 91, bokaro: 89, chaibasa: 97.8 },
  { day: "Day 14", dhanbad: 96, bokaro: 92, chaibasa: 98, spike: true },
  { day: "Day 17", dhanbad: 93, bokaro: 94, chaibasa: 98.1 },
  { day: "Day 21", dhanbad: 95, bokaro: 96, chaibasa: 98.3 },
  { day: "Day 24", dhanbad: 97, bokaro: 97.5, chaibasa: 98.5 },
  { day: "Day 27", dhanbad: 98.5, bokaro: 98.6, chaibasa: 98.7 },
  { day: "Day 30 (Oct 30)", dhanbad: 99.4, bokaro: 99.2, chaibasa: 99 },
];

const logRows = [
  { ts: "2024-10-15 13:45:10", plant: "Jharia Colliery RO Plant #2", dist: "Dhanbad Coalfield Block", rawPh: "5.42", outPh: "7.18", turb: "0.82", tds: "284", pb: "0.016", pbFlag: true, as: "<0.002", cfu: "0", bis: "SPIKE DETECT", bisTone: "red", action: "SOLENOID TRIPPED", actionTone: "red" },
  { ts: "2024-10-15 13:40:02", plant: "Chas Township WTP #1", dist: "Bokaro Steel Corridor", rawPh: "6.85", outPh: "7.42", turb: "0.45", tds: "195", pb: "<0.001", as: "<0.001", cfu: "0", bis: "BIS PASS", bisTone: "green", action: "DISPENSED", actionTone: "green" },
  { ts: "2024-10-15 13:35:55", plant: "Gua Mining UF Unit #3", dist: "West Singhbhum Basin", rawPh: "6.10", outPh: "7.05", turb: "0.61", tds: "310", pb: "<0.002", as: "<0.002", cfu: "0", bis: "BIS PASS", bisTone: "green", action: "DISPENSED", actionTone: "green" },
  { ts: "2024-10-15 13:30:12", plant: "Bhurkunda Washery Purifier", dist: "Ramgarh District", rawPh: "5.90", outPh: "6.72", turb: "3.80", tds: "428", pb: "0.004", as: "<0.001", cfu: "0", bis: "WARNING", bisTone: "amber", action: "BACKWASH TRIGGERED", actionTone: "amber" },
  { ts: "2024-10-15 13:25:40", plant: "Katras Bhowra Deep Filtration #1", dist: "Dhanbad Coalfield", rawPh: "6.40", outPh: "7.30", turb: "0.38", tds: "210", pb: "<0.001", as: "<0.001", cfu: "0", bis: "BIS PASS", bisTone: "green", action: "DISPENSED", actionTone: "green" },
  { ts: "2024-10-15 13:20:18", plant: "Bermo Damodar Intake Unit", dist: "Bokaro Industrial Zone", rawPh: "6.70", outPh: "7.22", turb: "0.52", tds: "240", pb: "<0.001", as: "<0.001", cfu: "0", bis: "BIS PASS", bisTone: "green", action: "DISPENSED", actionTone: "green" },
];

const obsCards = [
  { icon: Waves, tag: "PLANT NODE 02 • JHARIA", title: "Multi-Stage Membrane Block", status: "ACTIVE INTAKE", tone: "cyan" },
  { icon: Activity, tag: "SENSOR ARRAY • BOKARO", title: "Heavy Metal Ion Detector", status: "CALIBRATED", tone: "green" },
  { icon: FlaskConical, tag: "DISTRIBUTION • CHAIBASA", title: "Village Dispensing Stand #4", status: "POTABLE BIS", tone: "green" },
];

function TableHeadCell({ children }) {
  return (
    <th style={{ textAlign: "left", fontSize: 9.5, color: textDim, fontWeight: 600, letterSpacing: 0.3, padding: "0 14px 10px 0", fontFamily: mono, whiteSpace: "nowrap" }}>
      {children}
    </th>
  );
}

export default function ComplianceAnalytics() {
  const [shift, setShift] = useState("morning");
  const [page, setPage] = useState(1);

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textMid, fontFamily: "'Inter', -apple-system, sans-serif", fontSize: 13 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        table { border-collapse: collapse; }
        tbody tr:hover { background: rgba(255,255,255,0.015); }
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
              <span style={{ fontSize: 9.5, fontFamily: mono, background: "rgba(34,211,238,0.12)", color: cyan, padding: "2px 6px", borderRadius: 3 }}>JH-DW&SD</span>
            </div>
            <div style={{ fontSize: 10.5, color: textDim, marginTop: 1 }}>State Water Quality &amp; Purification Monitoring Portal — Govt of Jharkhand</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Pill tone="green" dot>42/45 PLANTS ONLINE</Pill>
          <Pill tone="cyan" dot>LIVE TELEMETRY ACTIVE</Pill>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: textDim, padding: "8px 6px" }}>Statewide Overview</span>
          <span style={{ fontSize: 12, color: textDim, padding: "8px 6px" }}>Plant Telemetry</span>
          <div style={{ background: "rgba(34,211,238,0.14)", border: `1px solid ${cyan}`, color: cyan, fontSize: 12, fontWeight: 600, padding: "8px 12px", borderRadius: 6 }}>Analytics &amp; Reports</div>
          <span style={{ fontSize: 12, color: textDim, padding: "8px 6px" }}>Critical Alerts &amp; Incident Response</span>
        </div>
      </div>

      {/* Sub-header strip */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 20px", borderBottom: `1px solid ${line}`, fontSize: 10.5, fontFamily: mono, color: textDim, flexWrap: "wrap" }}>
        <span>REGULATORY AUDIT SUITE</span>
        <span>—</span>
        <span>MODULE // DWSD-REP-2024-Q4</span>
        <Pill tone="green" small>BIS 10500:2012 COMPLIANT RUNTIME</Pill>
        <div style={{ flex: 1 }} />
        <span>SECURE AUDIT CHAIN HASH: 0x9c4C...8871</span>
      </div>

      {/* Title row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "18px 20px", flexWrap: "wrap", gap: 14 }}>
        <div>
          <h1 style={{ fontSize: 27, fontWeight: 700, color: "#f2f5fa", margin: 0, letterSpacing: -0.3 }}>Compliance Analytics &amp; Quality Logs</h1>
          <div style={{ fontSize: 12, color: textDim, marginTop: 6 }}>Jharkhand Drinking Water and Sanitation Department • Mining Belt SCADA Observability</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn icon={Download}>Export Raw Logs (CSV/XLSX)</Btn>
          <Btn tone="solid" icon={Lock}>Download Govt Sealed PDF <span style={{ opacity: 0.7, marginLeft: 4 }}>NIC/PHED</span></Btn>
        </div>
      </div>

      {/* Filters */}
      <div style={{ margin: "0 20px 18px", background: panel, border: `1px solid ${line}`, borderRadius: 8, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10.5, color: textDim, fontFamily: mono }}>RANGE:</span>
          {["Last 24 Hours", "Last 7 Days", "Monthly Shift Log"].map((r) => (
            <Btn key={r} small>{r}</Btn>
          ))}
          <Btn small active>Custom: 01 Oct 2024 – 15 Oct 2024</Btn>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 10.5, color: textDim, fontFamily: mono }}>BENCHMARK:</span>
          <Pill small>BIS IS 10500:2012</Pill>
          <Pill small>WHO Standard</Pill>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10.5, color: textDim, fontFamily: mono }}>SHIFT CYCLE:</span>
          <Btn small active={shift === "morning"}>Morning <span style={{ opacity: 0.6, marginLeft: 4 }}>06–14</span></Btn>
          <Btn small active={shift === "evening"}>Evening <span style={{ opacity: 0.6, marginLeft: 4 }}>14–22</span></Btn>
          <Btn small active={shift === "night"}>Night <span style={{ opacity: 0.6, marginLeft: 4 }}>22–06</span></Btn>
          <span style={{ fontSize: 10.5, color: textDim, fontFamily: mono, marginLeft: 8 }}>MINING BELTS:</span>
          <Btn small icon={ChevronDown}>All 4 Selected (Dhanbad 3, Bokaro 4, Ramgarh 2, W. Singhbhum 3)</Btn>
          <div style={{ flex: 1 }} />
          <Btn small icon={Filter}>Re-compute Compliance Vector</Btn>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "flex", gap: 14, padding: "0 20px 18px", flexWrap: "wrap" }}>
        <StatCard icon={Radio} label="TOTAL SAMPLE INGESTS" value="184,320" unit="READINGS" sub="↗ +12.4% vs last period" subColor={green} />
        <StatCard icon={CheckCircle2} label="COMPLIANCE PASS RATE" value="96.8" unit="% BIS MET" valueColor={green} progress={96.8} sub="Target: >95.0%   NOMINAL STABILITY" />
        <StatCard icon={Lock} label="HEAVY METAL SPIKES INTERCEPTED" value="14" unit="SPIKES DIVERTED" valueColor="#fca5a5" sub="100% Isolated via Pb/As Mining Cutoff" />
        <StatCard icon={Droplet} label="SAFE LITRES DISPENSED (MTD)" value="10.42" unit="MILLION L" valueColor={cyan} sub="Serving ~480k Residents · Zero Residual Cyanide" />
      </div>

      {/* Chart + Validation */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, padding: "0 20px 18px", alignItems: "start" }}>
        <div style={{ background: panel, border: `1px solid ${line}`, borderRadius: 8, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 14.5, fontWeight: 600, color: "#e8edf5" }}>30-Day Heavy Metal Removal Efficiency &amp; TDS Attenuation</span>
            <Pill small>HISTORICAL</Pill>
          </div>
          <div style={{ fontSize: 11.5, color: textDim, marginBottom: 6 }}>Cross-district comparison of coagulant-flocculant adsorption in high-sulfide coal/ore discharge zones</div>
          <div style={{ display: "flex", gap: 16, fontSize: 11, marginBottom: 10 }}>
            <span style={{ color: cyan }}>— Dhanbad Colliery</span>
            <span style={{ color: green }}>— Bokaro Slag Basin</span>
            <span style={{ color: "#94a3b8" }}>— Chaibasa Iron Ore Belt</span>
          </div>

          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke={line} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: textDim, fontSize: 9.5, fontFamily: mono }} tickLine={false} axisLine={{ stroke: line }} interval={1} />
                <YAxis domain={[70, 100]} tick={{ fill: textDim, fontSize: 9.5, fontFamily: mono }} tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#0c121c", border: `1px solid ${line}`, borderRadius: 6, fontSize: 11, fontFamily: mono }} labelStyle={{ color: textMid }} />
                <Line type="monotone" dataKey="dhanbad" stroke={cyan} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="bokaro" stroke={green} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="chaibasa" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
                <ReferenceDot x="Day 14" y={96} r={5} fill={red} stroke="none" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ fontSize: 11, color: textDim, marginTop: 6 }}>
            <span style={{ color: red }}>●</span> Red Point: Incursion Interception Event at Dhanbad Jharia Plant #2 (Arsenic Spike 0.048 ppm).
          </div>
          <div style={{ fontSize: 11.5, color: green, marginTop: 4, fontFamily: mono }}>Overall Removal Delta: +18.2%</div>
        </div>

        <div style={{ background: panel, border: `1px solid ${line}`, borderRadius: 8, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Shield size={15} color={cyan} />
              <span style={{ fontSize: 14, fontWeight: 600, color: "#e8edf5" }}>State Validation Sign-off</span>
            </div>
            <Pill tone="green" small>SEALED</Pill>
          </div>
          <p style={{ fontSize: 11.5, color: textDim, lineHeight: 1.55, margin: "0 0 16px" }}>
            Telemetry recorded across rural RO/UF nodes is validated in real-time by the Public Health Engineering Department (PHED) and Jharkhand State Pollution Control Board (JSPCB) Cryptographic Notary.
          </p>

          <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${line}`, borderRadius: 6, padding: "12px 14px", display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
            <div style={{ width: 34, height: 34, borderRadius: 6, background: "rgba(34,211,238,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 14 }}>🖋️</span>
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "#e8edf5" }}>Er. R. K. Mahato, M.Tech</div>
              <div style={{ fontSize: 10.5, color: textDim, marginTop: 2 }}>Chief Executive Engineer, PHED Ranchi HQ</div>
              <div style={{ fontSize: 10, color: cyan, marginTop: 4, fontFamily: mono }}>Digital Token: JSPCB-C6HT-2024-88410</div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 16 }}>
            <span style={{ color: textDim, fontFamily: mono }}>ALGORITHM: SHA-256 / RSA-4096</span>
            <Pill tone="green" small>VALIDATED</Pill>
          </div>

          <Btn>🛡 View Public Health Audit Certificate</Btn>
          <div style={{ fontSize: 10, color: textDim, marginTop: 10, fontFamily: mono }}>TIMESTAMPED: 2024-10-15 14:02:10 IST</div>
        </div>
      </div>

      {/* Table */}
      <div style={{ margin: "0 20px 18px", background: panel, border: `1px solid ${line}`, borderRadius: 8, padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220, display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.02)", border: `1px solid ${line}`, borderRadius: 6, padding: "8px 12px" }}>
            <Search size={13} color={textDim} />
            <span style={{ fontSize: 11.5, color: textDim, fontFamily: mono }}>Search by Plant, District, Lead/Arsenic spike, or Action...</span>
          </div>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: textDim, fontFamily: mono }}>
            FILTERED: <span style={{ color: cyan }}>12 RECORDS</span> OF 184,320
          </span>
          <Btn small>▦ Columns (11)</Btn>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 980 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${line}` }}>
                <TableHeadCell>TIMESTAMP (IST)</TableHeadCell>
                <TableHeadCell>PLANT / MINING DISTRICT</TableHeadCell>
                <TableHeadCell>RAW PH</TableHeadCell>
                <TableHeadCell>OUT PH</TableHeadCell>
                <TableHeadCell>TURBIDITY</TableHeadCell>
                <TableHeadCell>TDS</TableHeadCell>
                <TableHeadCell>LEAD (PB)</TableHeadCell>
                <TableHeadCell>ARSENIC (AS)</TableHeadCell>
                <TableHeadCell>CFU / 100ML</TableHeadCell>
                <TableHeadCell>BIS STATUS</TableHeadCell>
                <TableHeadCell>AUTOMATED ACTION</TableHeadCell>
              </tr>
            </thead>
            <tbody>
              {logRows.map((r) => (
                <tr key={r.ts} style={{ borderBottom: `1px solid ${line}` }}>
                  <td style={{ padding: "12px 14px 12px 0", fontSize: 11.5, fontFamily: mono, color: cyan }}>{r.ts}</td>
                  <td style={{ padding: "12px 14px 12px 0" }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: "#e8edf5" }}>{r.plant}</div>
                    <div style={{ fontSize: 10.5, color: textDim, marginTop: 2 }}>{r.dist}</div>
                  </td>
                  <td style={{ padding: "12px 14px 12px 0", fontSize: 11.5, fontFamily: mono }}>{r.rawPh}</td>
                  <td style={{ padding: "12px 14px 12px 0", fontSize: 11.5, fontFamily: mono, color: cyan }}>{r.outPh}</td>
                  <td style={{ padding: "12px 14px 12px 0", fontSize: 11.5, fontFamily: mono }}>{r.turb} NTU</td>
                  <td style={{ padding: "12px 14px 12px 0", fontSize: 11.5, fontFamily: mono }}>{r.tds} ppm</td>
                  <td style={{ padding: "12px 14px 12px 0", fontSize: 11.5, fontFamily: mono, color: r.pbFlag ? red : textMid }}>{r.pb}{r.pbFlag && " ppm"}</td>
                  <td style={{ padding: "12px 14px 12px 0", fontSize: 11.5, fontFamily: mono }}>{r.as}</td>
                  <td style={{ padding: "12px 14px 12px 0", fontSize: 11.5, fontFamily: mono }}>{r.cfu}</td>
                  <td style={{ padding: "12px 14px 12px 0" }}><Pill tone={r.bisTone} small dot>{r.bis}</Pill></td>
                  <td style={{ padding: "12px 0" }}>
                    <span style={{ fontSize: 10.5, fontFamily: mono, color: r.actionTone === "red" ? "#fca5a5" : r.actionTone === "amber" ? amber : green, display: "inline-flex", alignItems: "center", gap: 5 }}>
                      {r.actionTone === "red" ? <AlertTriangle size={11} /> : <CheckCircle2 size={11} />}
                      {r.action}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, flexWrap: "wrap", gap: 10 }}>
          <span style={{ fontSize: 11, color: textDim, fontFamily: mono }}>Showing rows 1 – 6 of 184,320</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: textDim, fontFamily: mono }}>PER PAGE:</span>
            <Btn small icon={ChevronDown}>50</Btn>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <button style={{ background: "transparent", border: `1px solid ${line}`, borderRadius: 4, padding: 5, color: textDim, cursor: "pointer" }}><ChevronsLeft size={13} /></button>
            <button style={{ background: "transparent", border: `1px solid ${line}`, borderRadius: 4, padding: 5, color: textDim, cursor: "pointer" }}><ChevronLeft size={13} /></button>
            {[1, 2, 3].map((n) => (
              <button key={n} onClick={() => setPage(n)} style={{ background: page === n ? cyan : "transparent", color: page === n ? "#04141a" : textMid, border: `1px solid ${page === n ? cyan : line}`, borderRadius: 4, padding: "5px 10px", fontSize: 11, fontFamily: mono, cursor: "pointer", fontWeight: 600 }}>{n}</button>
            ))}
            <span style={{ color: textDim, fontSize: 11, padding: "0 4px" }}>...</span>
            <button style={{ background: "transparent", color: textMid, border: `1px solid ${line}`, borderRadius: 4, padding: "5px 10px", fontSize: 11, fontFamily: mono, cursor: "pointer" }}>3686</button>
            <button style={{ background: "transparent", border: `1px solid ${line}`, borderRadius: 4, padding: 5, color: textDim, cursor: "pointer" }}><ChevronRight size={13} /></button>
            <button style={{ background: "transparent", border: `1px solid ${line}`, borderRadius: 4, padding: 5, color: textDim, cursor: "pointer" }}><ChevronsRight size={13} /></button>
          </div>
        </div>
      </div>

      {/* Field observation */}
      <div style={{ margin: "0 20px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#e8edf5" }}>Field Observation &amp; Sensor Calibrations</div>
            <div style={{ fontSize: 11, color: textDim, marginTop: 3 }}>Live telemetry cross-referenced with IoT spectrophotometer diagnostic stations in colliery areas</div>
          </div>
          <Pill tone="green" dot>STATION CAMERAS ONLINE</Pill>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {obsCards.map((c) => (
            <div key={c.title} style={{ background: panel, border: `1px solid ${line}`, borderRadius: 8, overflow: "hidden" }}>
              <div style={{ height: 140, background: "linear-gradient(135deg, #0e1b28, #10202e)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <c.icon size={34} color={cyan} strokeWidth={1.3} style={{ opacity: 0.7 }} />
                <div style={{ position: "absolute", top: 10, left: 10, display: "flex", alignItems: "center", gap: 5, background: "rgba(0,0,0,0.5)", borderRadius: 4, padding: "3px 8px" }}>
                  <Camera size={11} color={textDim} />
                  <span style={{ fontSize: 9.5, color: textDim, fontFamily: mono }}>{c.tag}</span>
                </div>
                <div style={{ position: "absolute", bottom: 10, right: 10 }}>
                  <Pill tone={c.tone} small dot>{c.status}</Pill>
                </div>
              </div>
              <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: "#e8edf5" }}>{c.title}</span>
                <ExternalLink size={12} color={textDim} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${line}`, padding: "12px 20px", display: "flex", justifyContent: "space-between", fontSize: 10.5, color: textDim, fontFamily: mono, flexWrap: "wrap", gap: 8 }}>
        <span>TOYAM SCADA Engine v3.4.1 &nbsp;•&nbsp; Jharkhand Drinking Water and Sanitation Department &nbsp;•&nbsp; <span style={{ color: green }}>Data Integrity Verified</span></span>
        <span>CENTRAL DISPATCH: 1800-345-6789 &nbsp;•&nbsp; ENCRYPTED TELEMETRY STREAM</span>
      </div>
    </div>
  );
}
