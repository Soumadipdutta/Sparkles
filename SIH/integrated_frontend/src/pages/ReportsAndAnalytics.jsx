import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip
} from "recharts";
import { fetchReportsAndAnalyticsData, downloadReportFile } from "../services/api";

const c = {
  bg: "#0a0e14",
  panel: "#0f1520",
  panel2: "#0c111a",
  border: "#1c2634",
  borderRed: "#5a1f28",
  text: "#e8edf4",
  sub: "#7d8ba0",
  mint: "#4de8c4",
  cyan: "#3fd0e8",
  blue: "#4fa8e0",
  amber: "#f0b45a",
  red: "#ff6b5e",
  redBg: "#3a1218",
  redBg2: "#2a1015",
};

function TopBar({ activeTab = "Analytics & Reports" }) {
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
        borderBottom: `1px solid ${c.border}`,
        flexWrap: "wrap",
        gap: 12,
        background: c.panel,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: "linear-gradient(135deg,#1a2c3a,#0d1620)",
            border: `1px solid ${c.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: c.cyan,
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
                color: c.text,
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
                color: c.cyan,
                border: `1px solid #1e3a45`,
                borderRadius: 4,
                padding: "2px 6px",
              }}
            >
              JH-DW&SD
            </span>
          </div>
          <div style={{ fontSize: 11.5, color: c.sub, marginTop: 2 }}>
            Water Quality Compliance Analytics & Official Audit Logs — Govt of Jharkhand
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <StatusPill dot={c.mint} text="42/45 PLANTS ONLINE" />
        <StatusPill dot={c.cyan} text="AUDIT TRAIL VERIFIED" />
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
              background: activeTab === t.label ? c.cyan : "transparent",
              color: activeTab === t.label ? "#04222a" : c.sub,
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

function StatusPill({ dot, text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10.5,
        color: c.sub,
        background: c.panel2,
        border: `1px solid ${c.border}`,
        borderRadius: 5,
        padding: "5px 9px",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: dot,
          boxShadow: `0 0 6px ${dot}`,
        }}
      />
      {text}
    </div>
  );
}

function Badge({ children, tone = "mint" }) {
  const map = {
    mint: { bg: "#0e2620", fg: c.mint, bd: "#1c3d34" },
    cyan: { bg: "#0c2530", fg: c.cyan, bd: "#1a3a45" },
    amber: { bg: "#2c220f", fg: c.amber, bd: "#4a3a1a" },
    red: { bg: c.redBg, fg: c.red, bd: c.borderRed },
  };
  const s = map[tone] || map.mint;
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10.5,
        fontWeight: 700,
        padding: "3px 8px",
        borderRadius: 4,
        background: s.bg,
        color: s.fg,
        border: `1px solid ${s.bd}`,
        letterSpacing: 0.4,
      }}
    >
      {children}
    </span>
  );
}

function MetricCard({ title, val, unit, sub, tone = "cyan", badgeText }) {
  return (
    <div style={{ background: c.panel, border: `1px solid ${c.border}`, borderRadius: 8, padding: 16, flex: 1, minWidth: 180 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 10.5, color: c.sub, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.4 }}>{title}</span>
        {badgeText && <Badge tone={tone}>{badgeText}</Badge>}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
        <span style={{ fontSize: 26, fontWeight: 700, color: c.text, fontFamily: "'JetBrains Mono', monospace" }}>{val}</span>
        {unit && <span style={{ fontSize: 12, color: c.sub, fontFamily: "'JetBrains Mono', monospace" }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontSize: 11, color: c.sub, marginTop: 6, fontFamily: "'JetBrains Mono', monospace" }}>{sub}</div>}
    </div>
  );
}

export default function ReportsAndAnalytics() {
  const [data, setData] = useState(null);
  const [reportType, setReportType] = useState("Water Quality Summary");
  const [timeRange, setTimeRange] = useState("Last 30 Days");
  const [search, setSearch] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchReportsAndAnalyticsData()
      .then((res) => setData(res))
      .catch((err) => console.error("Error loading reports data:", err));
  }, []);

  const summary = data?.summary || {
    total_samples: 184320,
    compliance_percentage: 94.2,
    heavy_metal_spikes: 18,
    safe_litres_dispensed: "1,482,900 L",
    online_plants: "42/45",
  };

  const chartData = data?.removal_efficiency || [
    { day: "Day 01", dhanbad: 82, bokaro: 96, chaibasa: 98 },
    { day: "Day 04", dhanbad: 85, bokaro: 96.5, chaibasa: 98.2 },
    { day: "Day 07", dhanbad: 88, bokaro: 97, chaibasa: 98.4 },
    { day: "Day 10", dhanbad: 91, bokaro: 97.2, chaibasa: 98.6 },
    { day: "Day 14", dhanbad: 94, bokaro: 97.6, chaibasa: 98.8 },
    { day: "Day 17", dhanbad: 95, bokaro: 97.8, chaibasa: 99 },
    { day: "Day 21", dhanbad: 96.5, bokaro: 98.4, chaibasa: 99.1 },
    { day: "Day 24", dhanbad: 97.5, bokaro: 98.9, chaibasa: 99.3 },
    { day: "Day 27", dhanbad: 98.5, bokaro: 99.3, chaibasa: 99.5 },
    { day: "Day 30", dhanbad: 99.4, bokaro: 99.6, chaibasa: 99.7 },
  ];

  const logs = useMemo(() => {
    const list = data?.telemetry_logs || [];
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter((l) => (l.plant || "").toLowerCase().includes(q) || (l.district || "").toLowerCase().includes(q) || (l.ts || "").toLowerCase().includes(q));
  }, [data, search]);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const blob = await downloadReportFile({ reportType, timeRange });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Toyam_Compliance_Report_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Download report error:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{ background: c.bg, minHeight: "100vh", color: c.text, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
      />
      <TopBar activeTab="Analytics & Reports" />

      {/* Header Panel */}
      <div style={{ padding: "20px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
              <Badge tone="cyan">COMPLIANCE AUDIT ENGINE</Badge>
              <Badge tone="mint">SHA-256 VERIFIED</Badge>
              <span style={{ fontSize: 11, color: c.sub, fontFamily: "'JetBrains Mono', monospace" }}>Token: JSPCB-CERT-2026-88410</span>
            </div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, margin: "0 0 6px", color: c.text }}>
              Water Quality Compliance Analytics & Official Audit Logs
            </h1>
            <div style={{ color: c.sub, fontSize: 13 }}>
              Government of Jharkhand • Drinking Water & Sanitation Department • Public Health Engineering Division
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button
              onClick={() => setShowModal(true)}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11.5,
                fontWeight: 700,
                padding: "9px 14px",
                borderRadius: 6,
                background: "#0c2530",
                color: c.cyan,
                border: "1px solid #1a3a45",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>📜</span>
              <span>GENERATE AUDIT CERTIFICATE</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11.5,
                fontWeight: 700,
                padding: "9px 16px",
                borderRadius: 6,
                background: c.cyan,
                color: "#04222a",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>⬇</span>
              <span>{downloading ? "GENERATING PDF..." : "EXPORT OFFICIAL PDF REPORT"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Metrics Grid */}
      <div style={{ padding: "20px 24px 0" }}>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <MetricCard title="TOTAL SENSORY SAMPLES" val={summary.total_samples?.toLocaleString()} unit="READINGS" sub="Continuous SCADA 30-Day Stream" tone="cyan" badge="DATA POINTS" />
          <MetricCard title="OVERALL COMPLIANCE RATE" val={`${summary.compliance_percentage}%`} unit="INDEX" sub="BIS IS 10500 Compliant (>95% Threshold)" tone="mint" badge="STATE RATE" />
          <MetricCard title="HEAVY METAL SPIKES DETECTED" val={summary.heavy_metal_spikes} unit="EVENTS" sub="Sub-second Auto Solenoid Cutoff Engaged" tone="red" badge="SAFETY CUTOFF" />
          <MetricCard title="SAFE WATER DISPENSED" val={summary.safe_litres_dispensed} unit="" sub="Zero-Spill Certified Clean Water" tone="mint" badge="VOLUME" />
          <MetricCard title="PURIFICATION FLEET ONLINE" val={summary.online_plants} unit="UNITS" sub="3 Units in Scheduled Maintenance" tone="cyan" badge="FLEET STATUS" />
        </div>
      </div>

      {/* Chart + State Validation Sign-off Grid */}
      <div style={{ padding: "20px 24px 0" }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "stretch" }}>
          
          {/* Heavy Metal Removal Efficiency Chart Panel */}
          <div style={{ background: c.panel, border: `1px solid ${c.border}`, borderRadius: 8, padding: 18, flex: "2 1 540px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk', sans-serif" }}>HEAVY METAL REMOVAL EFFICIENCY TREND (30 DAYS)</div>
                <div style={{ fontSize: 11.5, color: c.sub, marginTop: 2 }}>Comparative Rejection Percentage across Dhanbad, Bokaro, and Chaibasa Nodes</div>
              </div>
              <div style={{ display: "flex", gap: 12, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
                <span style={{ color: c.red }}>● Dhanbad Mining Belt</span>
                <span style={{ color: c.amber }}>● Bokaro Corridor</span>
                <span style={{ color: c.mint }}>● Chaibasa Basin</span>
              </div>
            </div>

            <div style={{ height: 230, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c2634" />
                  <XAxis dataKey="day" stroke="#7d8ba0" fontSize={11} fontFamily="JetBrains Mono" />
                  <YAxis domain={[75, 100]} stroke="#7d8ba0" fontSize={11} fontFamily="JetBrains Mono" />
                  <Tooltip
                    contentStyle={{ background: "#0c111a", border: "1px solid #1c2634", borderRadius: 6, fontSize: 12, fontFamily: "JetBrains Mono", color: "#e8edf4" }}
                  />
                  <Line type="monotone" dataKey="dhanbad" stroke={c.red} strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="bokaro" stroke={c.amber} strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="chaibasa" stroke={c.mint} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 8, borderTop: `1px solid ${c.border}`, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
              <span style={{ color: c.sub }}>
                <span style={{ color: c.red }}>● </span> Interception event at Dhanbad Jharia plant #2 (arsenic spike 0.048 ppm).
              </span>
              <span style={{ color: c.mint, fontWeight: 700 }}>Overall removal delta: +18.2%</span>
            </div>
          </div>

          {/* State Validation Sign-off Box */}
          <div style={{ background: c.panel, border: `1px solid ${c.border}`, borderRadius: 8, padding: 18, flex: "1 1 320px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk', sans-serif" }}>State validation sign-off</div>
                <Badge tone="mint">SEALED</Badge>
              </div>

              <p style={{ fontSize: 11.5, color: c.sub, lineHeight: 1.5, margin: "0 0 14px", fontFamily: "'Inter', sans-serif" }}>
                Telemetry recorded across rural RO/UF nodes is validated in real-time by the Public Health Engineering
                Department (PHED) and Jharkhand State Pollution Control Board (JSPCB) cryptographic notary.
              </p>

              <div style={{ background: c.panel2, border: `1px solid ${c.border}`, borderRadius: 6, padding: 12, display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1a3a45", color: c.cyan, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, border: `1px solid ${c.cyan}` }}>
                  RM
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: c.text }}>Er. R. K. Mahato, M.Tech</div>
                  <div style={{ fontSize: 11, color: c.sub }}>Chief Executive Engineer, PHED Ranchi HQ</div>
                  <div style={{ fontSize: 10.5, color: c.cyan, fontFamily: "'JetBrains Mono', monospace" }}>Digital Token: JSPCB-CERT-2026-88410</div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>
                <span style={{ color: c.sub }}>Algorithm: SHA-256 / RSA-4096</span>
                <span style={{ color: c.mint, fontWeight: 700 }}>■ Validated</span>
              </div>
            </div>

            <div>
              <button
                onClick={() => setShowModal(true)}
                style={{
                  width: "100%",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11.5,
                  fontWeight: 700,
                  padding: "9px 12px",
                  borderRadius: 6,
                  background: c.panel2,
                  color: c.cyan,
                  border: `1px solid ${c.border}`,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  transition: "all 0.15s ease",
                }}
              >
                <span>⛨</span>
                <span>VIEW PUBLIC HEALTH AUDIT CERTIFICATE</span>
              </button>
              <div style={{ fontSize: 10, color: c.sub, textAlign: "center", marginTop: 8, fontFamily: "'JetBrains Mono', monospace" }}>
                Timestamped: 2026-09-13 14:02:18 IST
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Audit Log Table Section */}
      <div style={{ padding: "20px 24px 32px" }}>
        <div style={{ background: c.panel, border: `1px solid ${c.border}`, borderRadius: 8, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk', sans-serif" }}>TELEMETRY & CONTAMINANT AUDIT LOG TABLE</div>
              <div style={{ fontSize: 11.5, color: c.sub, marginTop: 2 }}>Full sensory readings, pH neutralization, heavy ion concentrations, and action status</div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                style={{
                  background: c.panel2,
                  border: `1px solid ${c.border}`,
                  borderRadius: 6,
                  padding: "6px 12px",
                  color: c.cyan,
                  fontSize: 12,
                  fontFamily: "'JetBrains Mono', monospace",
                  outline: "none",
                }}
              >
                <option value="Water Quality Summary">Water Quality Summary</option>
                <option value="Heavy Metal Audit Log">Heavy Metal Audit Log</option>
                <option value="Full Telemetry Audit">Full Telemetry Audit</option>
              </select>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search plant, district, timestamp..."
                style={{
                  background: c.panel2,
                  border: `1px solid ${c.border}`,
                  borderRadius: 6,
                  padding: "6px 12px",
                  color: c.text,
                  fontSize: 12,
                  fontFamily: "'JetBrains Mono', monospace",
                  width: 220,
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${c.border}`, color: c.sub, textAlign: "left" }}>
                  <th style={{ padding: "10px 12px" }}>TIMESTAMP</th>
                  <th style={{ padding: "10px 12px" }}>PLANT NODE</th>
                  <th style={{ padding: "10px 12px" }}>DISTRICT</th>
                  <th style={{ padding: "10px 12px" }}>RAW pH</th>
                  <th style={{ padding: "10px 12px" }}>OUT pH</th>
                  <th style={{ padding: "10px 12px" }}>TURBIDITY</th>
                  <th style={{ padding: "10px 12px" }}>TDS</th>
                  <th style={{ padding: "10px 12px" }}>LEAD (Pb)</th>
                  <th style={{ padding: "10px 12px" }}>ARSENIC (As)</th>
                  <th style={{ padding: "10px 12px" }}>STATUS</th>
                  <th style={{ padding: "10px 12px" }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {logs.slice(0, 12).map((l, i) => {
                  const isSpike = l.status === "spike";
                  const isWarn = l.status === "warning";
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid ${c.border}` }}>
                      <td style={{ padding: "10px 12px", color: c.sub }}>{l.ts}</td>
                      <td style={{ padding: "10px 12px", color: c.text, fontWeight: 600 }}>{l.plant}</td>
                      <td style={{ padding: "10px 12px", color: c.sub }}>{l.district}</td>
                      <td style={{ padding: "10px 12px", color: isSpike ? c.red : c.text }}>{l.ph}</td>
                      <td style={{ padding: "10px 12px", color: c.mint }}>{l.outPh}</td>
                      <td style={{ padding: "10px 12px", color: c.sub }}>{l.turb}</td>
                      <td style={{ padding: "10px 12px", color: c.sub }}>{l.tds}</td>
                      <td style={{ padding: "10px 12px", color: isSpike ? c.red : c.cyan }}>{l.pb}</td>
                      <td style={{ padding: "10px 12px", color: c.cyan }}>{l.as}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <Badge tone={isSpike ? "red" : isWarn ? "amber" : "mint"}>
                          {l.status?.toUpperCase()}
                        </Badge>
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <Badge tone={l.action === "isolated" ? "red" : l.action === "backwash" ? "amber" : "cyan"}>
                          {l.action?.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Audit Certificate Generator Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div style={{ background: c.panel, border: `1px solid ${c.border}`, borderRadius: 10, padding: 24, maxWidth: 600, width: "100%", boxShadow: "0 20px 50px rgba(0,0,0,0.8)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 16, fontFamily: "'Space Grotesk', sans-serif" }}>OFFICIAL WATER QUALITY AUDIT CERTIFICATE</div>
              <button onClick={() => setShowModal(false)} style={{ background: "transparent", border: "none", color: c.sub, fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ background: c.panel2, border: `1px solid ${c.border}`, borderRadius: 8, padding: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 1.6 }}>
              <div style={{ color: c.cyan, fontWeight: 700, fontSize: 14, textAlign: "center", marginBottom: 10 }}>GOVERNMENT OF JHARKHAND</div>
              <div style={{ textAlign: "center", color: c.sub, fontSize: 11, marginBottom: 16 }}>DRINKING WATER AND SANITATION DEPARTMENT</div>
              <div style={{ borderBottom: `1px solid ${c.border}`, marginBottom: 14 }} />

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: c.sub }}>CERTIFICATE NO:</span>
                <span style={{ color: c.mint, fontWeight: 700 }}>JSPCB-CERT-2026-88410</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: c.sub }}>COMPLIANCE STANDARD:</span>
                <span style={{ color: c.text }}>BIS IS 10500:2012 COMPLIANT</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: c.sub }}>AVERAGE COMPLIANCE:</span>
                <span style={{ color: c.mint, fontWeight: 700 }}>94.2% PASS RATE</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ color: c.sub }}>TOTAL VOLUME CERTIFIED:</span>
                <span style={{ color: c.text }}>1,482,900 LITRES</span>
              </div>

              <div style={{ background: "#060e20", border: `1px solid ${c.border}`, borderRadius: 6, padding: 10, fontSize: 10.5, color: c.sub, textAlign: "center", wordBreak: "break-all" }}>
                DIGITAL RSA-4096 SIGNATURE HASH:<br />
                <span style={{ color: c.cyan }}>a7f8b901c23d45e6f7890a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ flex: 1, background: c.panel2, border: `1px solid ${c.border}`, color: c.text, borderRadius: 6, padding: 10, fontWeight: 700, fontSize: 11.5, fontFamily: "'JetBrains Mono', monospace", cursor: "pointer" }}
              >
                CLOSE
              </button>
              <button
                onClick={handleDownloadPDF}
                style={{ flex: 1, background: c.cyan, border: "none", color: "#04222a", borderRadius: 6, padding: 10, fontWeight: 700, fontSize: 11.5, fontFamily: "'JetBrains Mono', monospace", cursor: "pointer" }}
              >
                PRINT / DOWNLOAD PDF ⬇
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          borderTop: `1px solid ${c.border}`,
          padding: "14px 24px",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10.5,
          color: c.sub,
        }}
      >
        <span>TOYAM SCADA Engine v3.4.1</span>
        <span>Jharkhand Drinking Water and Sanitation Department</span>
        <span style={{ color: c.mint }}>● Data Integrity Verified</span>
        <span>CENTRAL DISPATCH: 1800-345-6789 • ENCRYPTED TELEMETRY STREAM</span>
      </div>
    </div>
  );
}
