import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";

const chartData = [
  { day: "Day 01", dhanbad: 82, bokaro: 96, chaibasa: 98 },
  { day: "Day 04", dhanbad: 85, bokaro: 96.5, chaibasa: 98.2 },
  { day: "Day 07", dhanbad: 88, bokaro: 97, chaibasa: 98.4 },
  { day: "Day 10", dhanbad: 91, bokaro: 97.2, chaibasa: 98.6 },
  { day: "Day 14", dhanbad: 94, bokaro: 97.6, chaibasa: 98.8, spike: 94 },
  { day: "Day 17", dhanbad: 95, bokaro: 97.8, chaibasa: 99 },
  { day: "Day 21", dhanbad: 96.5, bokaro: 98.4, chaibasa: 99.1, spike2: 96.5 },
  { day: "Day 24", dhanbad: 97.5, bokaro: 98.9, chaibasa: 99.3 },
  { day: "Day 27", dhanbad: 98.5, bokaro: 99.3, chaibasa: 99.5 },
  { day: "Day 30", dhanbad: 99.4, bokaro: 99.6, chaibasa: 99.7 },
];

const rows = [
  {
    ts: "2024-10-15 13:45:10",
    plant: "Jharia Colliery RO Plant #2",
    district: "Dhanbad Coalfield",
    ph: "5.42",
    outPh: "7.18",
    turb: "0.82 NTU",
    tds: "284 ppm",
    pb: "0.016 ppm",
    as: "<0.002",
    cfu: "0",
    status: "spike",
    action: "isolated",
  },
  {
    ts: "2024-10-15 13:40:02",
    plant: "Chas Township WTP Plant #1",
    district: "Bokaro Steel Corridor",
    ph: "6.85",
    outPh: "7.42",
    turb: "0.45 NTU",
    tds: "195 ppm",
    pb: "<0.001",
    as: "<0.001",
    cfu: "0",
    status: "pass",
    action: "dispensed",
  },
  {
    ts: "2024-10-15 13:35:55",
    plant: "Gua Mining UF Unit #3",
    district: "West Singhbhum Basin",
    ph: "6.10",
    outPh: "7.05",
    turb: "0.61 NTU",
    tds: "310 ppm",
    pb: "<0.002",
    as: "<0.002",
    cfu: "0",
    status: "pass",
    action: "dispensed",
  },
  {
    ts: "2024-10-15 13:30:12",
    plant: "Bhurkunda Washery Purifier",
    district: "Ramgarh District",
    ph: "5.90",
    outPh: "6.72",
    turb: "3.80 NTU",
    tds: "420 ppm",
    pb: "0.004",
    as: "<0.001",
    cfu: "0",
    status: "warning",
    action: "backwash",
  },
  {
    ts: "2024-10-15 13:25:40",
    plant: "Katras Bhowra Deep Filtration #1",
    district: "Dhanbad Coalfield",
    ph: "6.40",
    outPh: "7.30",
    turb: "0.38 NTU",
    tds: "210 ppm",
    pb: "<0.001",
    as: "<0.001",
    cfu: "0",
    status: "pass",
    action: "dispensed",
  },
  {
    ts: "2024-10-15 13:20:18",
    plant: "Bermo Damodar Intake Unit",
    district: "Bokaro Industrial Zone",
    ph: "6.70",
    outPh: "7.22",
    turb: "0.52 NTU",
    tds: "240 ppm",
    pb: "<0.001",
    as: "<0.001",
    cfu: "0",
    status: "pass",
    action: "dispensed",
  },
];

const statusStyle = {
  pass: { bg: "rgba(46,204,113,0.12)", fg: "#4ade80", label: "BIS pass" },
  warning: { bg: "rgba(251,191,36,0.12)", fg: "#fbbf24", label: "Warning" },
  spike: { bg: "rgba(248,113,113,0.14)", fg: "#f87171", label: "Spike detect" },
};

const actionStyle = {
  dispensed: { fg: "#4ade80", label: "Dispensed" },
  backwash: { fg: "#fbbf24", label: "Backwash triggered" },
  isolated: { fg: "#f87171", label: "Isolated + halted" },
};

function StatCard({ label, value, unit, sub, subColor, icon }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statTop}>
        <span style={styles.statLabel}>{label}</span>
        <span style={{ color: "#5b7a91", fontSize: 15 }}>{icon}</span>
      </div>
      <div style={styles.statValueRow}>
        <span style={styles.statValue}>{value}</span>
        {unit && <span style={styles.statUnit}>{unit}</span>}
      </div>
      {sub && <div style={{ ...styles.statSub, color: subColor || "#6b8299" }}>{sub}</div>}
    </div>
  );
}

function NavItem({ label, sub, active }) {
  return (
    <div
      style={{
        ...styles.navItem,
        background: active ? "#12b3c9" : "transparent",
        color: active ? "#04262b" : "#bcd4e0",
      }}
    >
      <div style={{ fontWeight: 500, fontSize: 12.5, lineHeight: 1.3 }}>{label}</div>
      {sub && <div style={{ fontSize: 10.5, opacity: 0.85 }}>{sub}</div>}
    </div>
  );
}

export default function ToyamDashboard() {
  const [page, setPage] = useState(1);

  return (
    <div style={styles.page}>
      {/* Top header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logoMark}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0014 0c0-4.5-7-13-7-13z" stroke="#12b3c9" strokeWidth="1.6" />
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 500, fontSize: 17, color: "#e8f4f8", letterSpacing: 0.5 }}>
              TOYAM <span style={styles.badgeSmall}>JH-DWSD</span>
            </div>
            <div style={{ fontSize: 10.5, color: "#6b8299" }}>
              State Water Quality &amp; Purification Monitoring Portal · Govt of Jharkhand
            </div>
          </div>
        </div>

        <div style={styles.headerCenter}>
          <div style={styles.pillOk}>
            <span style={styles.dotGreen} /> 42/45 plants online
          </div>
          <div style={styles.pillOk}>
            <span style={styles.dotGreen} /> Live telemetry active
          </div>
        </div>

        <nav style={styles.headerNav}>
          <NavItem label="Statewide" sub="Overview" />
          <NavItem label="Plant" sub="Telemetry" />
          <NavItem label="Analytics" sub="&amp; Reports" active />
          <NavItem label="Critical Alerts" sub="&amp; Incident Response" />
        </nav>
      </header>

      {/* Sub-header / title bar */}
      <div style={styles.subbar}>
        <div style={styles.subbarTags}>
          <span style={styles.tagGhost}>Regulatory audit suite</span>
          <span style={styles.tagGhost}>Module — DWSD-REP-2024-Q4</span>
          <span style={styles.tagGreen}>BIS 10500:2012 compliant runtime</span>
        </div>
        <div style={styles.hashRow}>
          <span style={{ color: "#4ade80" }}>&#10003;</span> Secure audit chain hash:&nbsp;
          <span style={{ color: "#7fb8cc" }}>0x9A4C...B871</span>
        </div>
      </div>

      <div style={styles.titleRow}>
        <div>
          <h1 style={styles.title}>Compliance analytics &amp; quality logs</h1>
          <div style={styles.subtitle}>
            Jharkhand Drinking Water and Sanitation Department · Mining Belt SCADA observability
          </div>
        </div>
        <div style={styles.titleActions}>
          <button style={styles.btnGhost}>Export raw logs (CSV/XLSX)</button>
          <button style={styles.btnPrimary}>Download govt sealed PDF · NIC/PHED</button>
        </div>
      </div>

      {/* Filter bar */}
      <div style={styles.filterBar}>
        <div style={styles.filterRow}>
          <span style={styles.filterLabel}>Range:</span>
          <span style={styles.chip}>Last 24 hours</span>
          <span style={styles.chip}>Last 7 days</span>
          <span style={styles.chip}>Monthly shift log</span>
          <span style={styles.chipActive}>Custom: 01 Oct 2024 – 15 Oct 2024</span>
          <span style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <span style={styles.chip}>BIS 10500:2012</span>
            <span style={styles.chip}>WHO standard</span>
          </span>
        </div>
        <div style={styles.filterRow}>
          <span style={styles.filterLabel}>Shift cycle:</span>
          <span style={styles.chipActive}>Morning 06–14</span>
          <span style={styles.chip}>Evening 14–22</span>
          <span style={styles.chip}>Night 22–06</span>
          <span style={{ ...styles.filterLabel, marginLeft: 16 }}>Mining belts:</span>
          <span style={styles.chip}>All 4 selected (Dhanbad 3, Bokaro 4, Ramgarh 2, W. Singhbhum 3) ▾</span>
          <button style={{ ...styles.btnGhost, marginLeft: "auto", fontSize: 12 }}>
            ⟲ Re-compute compliance vector
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div style={styles.statGrid}>
        <StatCard
          label="Total sample ingests"
          value="184,320"
          unit="readings"
          sub="↗ +12.4% vs last period · 12 plants online"
          icon="◌"
        />
        <StatCard
          label="Compliance pass rate"
          value="96.8%"
          sub="Target: >95.0% · nominal stability"
          subColor="#4ade80"
          icon="✓"
        />
        <StatCard
          label="Heavy metal spikes intercepted"
          value="14"
          unit="spikes diverted"
          sub="100% isolated via Pb/As mining cutoff"
          icon="⛨"
        />
        <StatCard
          label="Safe litres dispensed (MTD)"
          value="10.42"
          unit="million L"
          sub="Serving ~480k residents · zero residual cyanide"
          icon="◉"
        />
      </div>

      {/* Chart + sign-off */}
      <div style={styles.midGrid}>
        <div style={styles.panel}>
          <div style={styles.panelHeadRow}>
            <div>
              <div style={styles.panelTitle}>30-day heavy metal removal efficiency &amp; TDS attenuation</div>
              <div style={styles.panelSub}>
                Cross-district comparison of coagulant-flocculant adsorption in high-sulfide coal/ore discharge zones
              </div>
            </div>
            <span style={styles.tagGhost}>Historical</span>
          </div>

          <div style={styles.legendRow}>
            <span style={styles.legendItem}><i style={{ background: "#f0997b" }} /> Dhanbad colliery</span>
            <span style={styles.legendItem}><i style={{ background: "#5dcaa5" }} /> Bokaro slag basin</span>
            <span style={styles.legendItem}><i style={{ background: "#378add" }} /> Chaibasa iron ore belt</span>
          </div>

          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#1c3648" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#5b7a91", fontSize: 10 }} axisLine={{ stroke: "#1c3648" }} tickLine={false} />
                <YAxis
                  domain={[70, 100]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fill: "#5b7a91", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Line type="monotone" dataKey="dhanbad" stroke="#f0997b" dot={false} strokeWidth={1.8} />
                <Line type="monotone" dataKey="bokaro" stroke="#5dcaa5" dot={false} strokeWidth={1.8} />
                <Line type="monotone" dataKey="chaibasa" stroke="#378add" dot={false} strokeWidth={1.8} strokeDasharray="4 3" />
                <ReferenceDot x="Day 14" y={94} r={4} fill="#f87171" stroke="none" />
                <ReferenceDot x="Day 21" y={96.5} r={4} fill="#f0997b" stroke="none" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.chartFoot}>
            <span>
              <span style={{ color: "#f87171" }}>● </span>
              Red point: incursion interception event at Dhanbad Jharia plant #2 (arsenic spike 0.048 ppm).
            </span>
            <span style={{ color: "#4ade80" }}>Overall removal delta: +18.2%</span>
          </div>
        </div>

        <div style={styles.panel}>
          <div style={styles.panelHeadRow}>
            <div style={styles.panelTitle}>State validation sign-off</div>
            <span style={styles.tagGreen}>Sealed</span>
          </div>
          <p style={styles.signoffText}>
            Telemetry recorded across rural RO/UF nodes is validated in real-time by the Public Health Engineering
            Department (PHED) and Jharkhand State Pollution Control Board (JSPCB) cryptographic notary.
          </p>

          <div style={styles.officerCard}>
            <div style={styles.officerAvatar}>RM</div>
            <div>
              <div style={{ fontWeight: 500, fontSize: 13, color: "#e8f4f8" }}>Er. R. K. Mahato, M.Tech</div>
              <div style={{ fontSize: 11.5, color: "#6b8299" }}>Chief executive engineer, PHED Ranchi HQ</div>
              <div style={{ fontSize: 11, color: "#12b3c9" }}>Digital token: JSPCB-CERT-2024-88410</div>
            </div>
          </div>

          <div style={styles.algoRow}>
            <span style={{ color: "#6b8299" }}>Algorithm: SHA-256 / RSA-4096</span>
            <span style={{ color: "#4ade80" }}>■ Validated</span>
          </div>

          <button style={styles.btnGhostFull}>⛨ View public health audit certificate</button>
          <div style={styles.timestampNote}>Timestamped: 2024-10-15 14:02:18 IST</div>
        </div>
      </div>

      {/* Table */}
      <div style={styles.panel}>
        <div style={styles.tableTopRow}>
          <input style={styles.searchInput} placeholder="Search by plant, district, lead/arsenic spike, or action…" />
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "#6b8299" }}>
            <span>Filtered: <span style={{ color: "#12b3c9" }}>12 records</span> of 184,320</span>
            <span style={styles.chip}>Columns (11)</span>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                {["Timestamp (IST)", "Plant / mining district", "Raw pH", "Out pH", "Turbidity", "TDS", "Lead (Pb)", "Arsenic (As)", "CFU/100mL", "BIS status", "Automated action"].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.ts} style={styles.tr}>
                  <td style={{ ...styles.td, color: "#12b3c9" }}>{r.ts}</td>
                  <td style={styles.td}>
                    <div style={{ color: "#e8f4f8", fontWeight: 500 }}>{r.plant}</div>
                    <div style={{ color: "#6b8299", fontSize: 11 }}>{r.district}</div>
                  </td>
                  <td style={styles.td}>{r.ph}</td>
                  <td style={{ ...styles.td, color: "#4ade80" }}>{r.outPh}</td>
                  <td style={styles.td}>{r.turb}</td>
                  <td style={styles.td}>{r.tds}</td>
                  <td style={{ ...styles.td, color: r.status === "spike" ? "#f87171" : "#e8f4f8" }}>{r.pb}</td>
                  <td style={styles.td}>{r.as}</td>
                  <td style={styles.td}>{r.cfu}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.statusPill, background: statusStyle[r.status].bg, color: statusStyle[r.status].fg }}>
                      ● {statusStyle[r.status].label}
                    </span>
                  </td>
                  <td style={{ ...styles.td, color: actionStyle[r.action].fg }}>
                    ✓ {actionStyle[r.action].label}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={styles.paginationRow}>
          <span style={{ color: "#6b8299", fontSize: 12 }}>Showing rows 1–6 of 184,320 · per page: 50 ▾</span>
          <div style={{ display: "flex", gap: 6 }}>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                style={{ ...styles.pageBtn, ...(page === n ? styles.pageBtnActive : {}) }}
              >
                {n}
              </button>
            ))}
            <span style={{ color: "#6b8299", padding: "0 4px" }}>…</span>
            <button style={styles.pageBtn}>3686</button>
          </div>
        </div>
      </div>

      {/* Field observation gallery */}
      <div style={styles.panel}>
        <div style={styles.panelHeadRow}>
          <div>
            <div style={styles.panelTitle}>Field observation &amp; sensor calibrations</div>
            <div style={styles.panelSub}>Live telemetry cross-referenced with IoT spectrophotometer diagnostic stations in colliery areas</div>
          </div>
          <span style={{ ...styles.hashRow, fontSize: 11 }}>
            <span style={styles.dotGreen} /> Station cameras online
          </span>
        </div>

        <div style={styles.galleryGrid}>
          {[
            { title: "Multi-stage membrane block", tag: "Plant ND0F 02 · Jharia", status: "Active intake" },
            { title: "Heavy metal ion detector", tag: "Sensor array · Bokaro", status: "Calibrated" },
            { title: "Village dispensing stand #4", tag: "Distribution · Chaibasa", status: "Potable BIS" },
          ].map((g) => (
            <div key={g.title} style={styles.galleryCard}>
              <div style={styles.galleryImg}>
                <span style={{ color: "#2c4a5e", fontSize: 12 }}>Field photo</span>
              </div>
              <div style={styles.galleryCaption}>
                <div>
                  <div style={{ fontSize: 10.5, color: "#6b8299" }}>{g.tag}</div>
                  <div style={{ fontSize: 12.5, color: "#e8f4f8", fontWeight: 500 }}>{g.title}</div>
                </div>
                <span style={{ fontSize: 10.5, color: "#4ade80" }}>{g.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer style={styles.footer}>
        <span>TOYAM SCADA engine v3.4.1 · Jharkhand Drinking Water and Sanitation Department · <span style={{ color: "#4ade80" }}>● data integrity verified</span></span>
        <span>Central dispatch: 1800-345-6789 · Encrypted telemetry stream</span>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    background: "#0a1a24",
    color: "#cfe3ec",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    minHeight: "100vh",
    padding: "16px",
    fontSize: 13,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #16303e",
    paddingBottom: 14,
    marginBottom: 14,
    flexWrap: "wrap",
    gap: 12,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 10 },
  logoMark: {
    width: 38,
    height: 38,
    borderRadius: 8,
    background: "#0f2836",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  badgeSmall: {
    fontSize: 9,
    background: "#12b3c9",
    color: "#04262b",
    borderRadius: 4,
    padding: "1px 5px",
    marginLeft: 6,
    fontWeight: 600,
    verticalAlign: "middle",
  },
  headerCenter: { display: "flex", gap: 10, flexWrap: "wrap" },
  pillOk: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11,
    color: "#9fc9d8",
    background: "#0f2836",
    border: "1px solid #16303e",
    borderRadius: 6,
    padding: "5px 10px",
  },
  dotGreen: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#4ade80",
    display: "inline-block",
  },
  headerNav: { display: "flex", gap: 4, flexWrap: "wrap" },
  navItem: {
    borderRadius: 6,
    padding: "6px 12px",
    textAlign: "center",
    minWidth: 76,
  },
  subbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  subbarTags: { display: "flex", gap: 8, flexWrap: "wrap" },
  tagGhost: {
    fontSize: 10.5,
    color: "#7fa2b8",
    border: "1px solid #1c3648",
    borderRadius: 4,
    padding: "3px 8px",
    letterSpacing: 0.3,
  },
  tagGreen: {
    fontSize: 10.5,
    color: "#4ade80",
    background: "rgba(74,222,128,0.1)",
    border: "1px solid rgba(74,222,128,0.25)",
    borderRadius: 4,
    padding: "3px 8px",
    letterSpacing: 0.3,
  },
  hashRow: { fontSize: 11, color: "#6b8299", display: "flex", alignItems: "center", gap: 4 },
  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  title: { fontSize: 26, fontWeight: 500, color: "#f2f8fa", margin: "4px 0 4px" },
  subtitle: { fontSize: 12.5, color: "#6b8299" },
  titleActions: { display: "flex", gap: 8, flexWrap: "wrap" },
  btnGhost: {
    background: "transparent",
    border: "1px solid #1c3648",
    color: "#9fc9d8",
    borderRadius: 6,
    padding: "9px 14px",
    fontSize: 12.5,
    cursor: "pointer",
  },
  btnPrimary: {
    background: "#12b3c9",
    border: "1px solid #12b3c9",
    color: "#04262b",
    borderRadius: 6,
    padding: "9px 14px",
    fontSize: 12.5,
    fontWeight: 500,
    cursor: "pointer",
  },
  filterBar: {
    background: "#0d2029",
    border: "1px solid #16303e",
    borderRadius: 10,
    padding: "12px 14px",
    marginBottom: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  filterRow: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  filterLabel: { fontSize: 11, color: "#5b7a91", letterSpacing: 0.4 },
  chip: {
    fontSize: 11.5,
    color: "#9fc9d8",
    border: "1px solid #1c3648",
    borderRadius: 6,
    padding: "5px 10px",
    whiteSpace: "nowrap",
  },
  chipActive: {
    fontSize: 11.5,
    color: "#04262b",
    background: "#12b3c9",
    borderRadius: 6,
    padding: "5px 10px",
    whiteSpace: "nowrap",
    fontWeight: 500,
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    background: "#0d2029",
    border: "1px solid #16303e",
    borderRadius: 10,
    padding: "14px 16px",
  },
  statTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  statLabel: { fontSize: 10.5, color: "#5b7a91", letterSpacing: 0.3, textTransform: "uppercase" },
  statValueRow: { display: "flex", alignItems: "baseline", gap: 6 },
  statValue: { fontSize: 26, fontWeight: 500, color: "#f2f8fa" },
  statUnit: { fontSize: 11, color: "#5b7a91" },
  statSub: { fontSize: 10.5, marginTop: 6 },
  midGrid: {
    display: "grid",
    gridTemplateColumns: "1.6fr 1fr",
    gap: 12,
    marginBottom: 16,
  },
  panel: {
    background: "#0d2029",
    border: "1px solid #16303e",
    borderRadius: 10,
    padding: "16px 18px",
    marginBottom: 16,
  },
  panelHeadRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
  panelTitle: { fontSize: 14.5, fontWeight: 500, color: "#f2f8fa" },
  panelSub: { fontSize: 11.5, color: "#6b8299", marginTop: 3 },
  legendRow: { display: "flex", gap: 16, marginBottom: 6, flexWrap: "wrap" },
  legendItem: { display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#9fc9d8" },
  chartFoot: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 11,
    color: "#6b8299",
    marginTop: 8,
    flexWrap: "wrap",
    gap: 6,
    borderTop: "1px solid #16303e",
    paddingTop: 10,
  },
  signoffText: { fontSize: 12, color: "#9fc9d8", lineHeight: 1.6, margin: "0 0 14px" },
  officerCard: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    background: "#0a1a24",
    border: "1px solid #16303e",
    borderRadius: 8,
    padding: "10px 12px",
    marginBottom: 12,
  },
  officerAvatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#12b3c9",
    color: "#04262b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 600,
    flexShrink: 0,
  },
  algoRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 11.5,
    marginBottom: 14,
  },
  btnGhostFull: {
    width: "100%",
    background: "transparent",
    border: "1px solid #1c3648",
    color: "#9fc9d8",
    borderRadius: 6,
    padding: "9px 0",
    fontSize: 12,
    cursor: "pointer",
    marginBottom: 8,
  },
  timestampNote: { fontSize: 10.5, color: "#5b7a91", textAlign: "center" },
  tableTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    minWidth: 200,
    background: "#0a1a24",
    border: "1px solid #16303e",
    borderRadius: 6,
    padding: "8px 12px",
    color: "#cfe3ec",
    fontSize: 12.5,
  },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 900 },
  th: {
    textAlign: "left",
    fontSize: 10.5,
    color: "#5b7a91",
    letterSpacing: 0.3,
    textTransform: "uppercase",
    padding: "8px 10px",
    borderBottom: "1px solid #16303e",
    whiteSpace: "nowrap",
  },
  tr: { borderBottom: "1px solid #12242e" },
  td: { padding: "10px 10px", fontSize: 12, color: "#b7cdd9", whiteSpace: "nowrap" },
  statusPill: {
    fontSize: 11,
    borderRadius: 5,
    padding: "3px 8px",
    whiteSpace: "nowrap",
  },
  paginationRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },
  pageBtn: {
    background: "transparent",
    border: "1px solid #1c3648",
    color: "#9fc9d8",
    borderRadius: 6,
    padding: "5px 10px",
    fontSize: 12,
    cursor: "pointer",
  },
  pageBtnActive: { background: "#12b3c9", color: "#04262b", borderColor: "#12b3c9", fontWeight: 500 },
  galleryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    marginTop: 8,
  },
  galleryCard: {
    background: "#0a1a24",
    border: "1px solid #16303e",
    borderRadius: 8,
    overflow: "hidden",
  },
  galleryImg: {
    height: 110,
    background: "#0f2836",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  galleryCaption: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 12px",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
    fontSize: 11,
    color: "#5b7a91",
    borderTop: "1px solid #16303e",
    paddingTop: 14,
  },
};
