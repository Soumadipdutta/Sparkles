import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchDashboardData,
  fetchStatewideOverviewData,
  appendTelemetryLog,
  dispatchAlertAction
} from "../services/api";

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

function TopBar({ activeTab = "Plant Telemetry" }) {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  const tabs = [
    { label: "Statewide Overview", path: "/statewide-overview", altPath: "/toyam/statewide" },
    { label: "Plant Telemetry", path: "/plant-telemetry", altPath: "/toyam/plant" },
    { label: "Analytics & Reports", path: "/analytics-and-reports", altPath: "/toyam/analytics" },
    { label: "Critical Alerts & Incident Response", path: "/critical-alerts", altPath: "/toyam/alerts" },
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
            State Water Quality & Purification Monitoring Portal — Govt of Jharkhand
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <StatusPill dot={c.mint} text="42/45 PLANTS ONLINE" />
        <StatusPill dot={c.cyan} text="LIVE TELEMETRY ACTIVE" />
      </div>

      <nav style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {tabs.map((tab) => {
          const active = currentPath === tab.path || currentPath === tab.altPath || activeTab === tab.label;

          return (
            <button
              key={tab.label}
              onClick={() => navigate(tab.path)}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11.5,
                padding: "10px 14px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                background: active ? c.cyan : "transparent",
                color: active ? "#04222a" : c.sub,
                fontWeight: active ? 700 : 500,
                lineHeight: 1.3,
                maxWidth: 120,
                textAlign: "left",
              }}
            >
              {tab.label}
            </button>
          );
        })}
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

function HeaderPanel({ deviceId, setDeviceId, allPlants, data }) {
  const [overrideActive, setOverrideActive] = useState(false);
  const [operationStatus, setOperationStatus] = useState("");

  const plantInfo = data?.info || {};
  const systemInfo = data?.system || {};

  const unitTitle = plantInfo.name || `Toyam Unit #${deviceId.split("-").pop() || "04"} — Jharia Colliery Sector, Dhanbad District`;
  const unitDistrict = plantInfo.sub_basin || "Coal Belt Sub-basin Remediation Node • High-Metal Contamination Threat Sector B-12";
  const geoCoords = plantInfo.coordinates || "Geo: 23.7428° N, 86.4116° E";

  const handleManualOverride = async () => {
    const nextState = !overrideActive;
    setOverrideActive(nextState);
    const msg = nextState ? "MANUAL OVERRIDE ENABLED" : "MANUAL OVERRIDE DISABLED";
    setOperationStatus(msg);
    try {
      await dispatchAlertAction({ action: "manual_override", device_id: deviceId, override: nextState });
    } catch (e) {
      console.error(e);
    }
  };

  const handleFlush = async () => {
    setOperationStatus("FLUSH CHAMBER COMMAND SENT");
    try {
      await dispatchAlertAction({ action: "flush_chamber", device_id: deviceId });
    } catch (e) {
      console.error(e);
    }
  };

  const handleRecalibrate = async () => {
    setOperationStatus("SENSOR ARRAY RECALIBRATION STARTED");
    try {
      await dispatchAlertAction({ action: "recalibrate", device_id: deviceId });
    } catch (e) {
      console.error(e);
    }
  };

  const handleExport = () => {
    const logs = [
      ["TIMESTAMP", "SUBSYSTEM", "EVENT DESCRIPTION", "PARAMETER VALUE", "ACTION STATE"],
      ["14:26:08", "VALVE #SV-04", "Automated isolation: Pb limit breach", "0.042 mg/L", "SHUTDOWN"],
      ["14:25:52", "SPECTRO-XRF", "Spike detected in raw mine intake bed", "0.038 mg/L", "ALERT LEVEL 2"],
      ["14:10:00", "PRE-SEDIMENT", "Automatic bottom sludge drain purge completed", "45 Liters", "SUCCESS"],
      ["13:45:12", "UV-REACTOR", "Quartz sleeve mechanical wiper sweep finished", "100% Trans.", "NOMINAL"],
      ["12:00:00", "SYSTEM-CLK", "Periodic state telemetry synchronization to Ranchi HQ", "Ping: 34ms", "SYNCED"],
    ];

    const csv = logs
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `toyam-${deviceId.toLowerCase()}-incident-log.csv`;
    link.click();
    URL.revokeObjectURL(url);

    setOperationStatus("TELEMETRY LOG EXPORTED");
  };

  return (
    <div style={{ width: "100%", padding: "20px 24px 0" }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div style={{ flex: "1 1 600px" }}>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginBottom: 10,
              flexWrap: "wrap",
            }}
          >
            {/* Plant Switcher Dropdown */}
            {allPlants && allPlants.length > 0 ? (
              <select
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                style={{
                  background: "#0c2530",
                  color: c.cyan,
                  border: "1px solid #1e3a45",
                  borderRadius: 4,
                  padding: "3px 8px",
                  fontSize: 11,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                {allPlants.map((p) => (
                  <option key={p.id} value={p.id}>
                    UNIT-{p.id} ({p.name})
                  </option>
                ))}
              </select>
            ) : (
              <Badge tone="cyan">UNIT-{deviceId}</Badge>
            )}

            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: c.sub,
              }}
            >
              {geoCoords}
            </span>

            <Badge tone="mint">Solar-Hybrid (88% Bat)</Badge>
          </div>

          <div style={{ marginBottom: 10 }}>
            <Badge tone={systemInfo.status === "cutoff" || overrideActive ? "red" : "mint"}>
              ● {overrideActive ? "MANUAL OVERRIDE ENGAGED" : systemInfo.statusLabel || "SHUTOFF VALVE ENGAGED"}
            </Badge>
          </div>

          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 30,
              fontWeight: 600,
              margin: "0 0 6px",
              color: c.text,
              maxWidth: 800,
              lineHeight: 1.1,
            }}
          >
            {unitTitle}
          </h1>

          <div style={{ color: c.sub, fontSize: 13.5 }}>{unitDistrict}</div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            flex: "0 0 auto",
          }}
        >
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <ActionBtn
              label={overrideActive ? "DISABLE OVERRIDE" : "MANUAL OVERRIDE"}
              icon="🔒"
              danger={!overrideActive}
              onClick={handleManualOverride}
            />
            <ActionBtn label="FLUSH CHAMBER" icon="📷" onClick={handleFlush} />
            <ActionBtn label="RECALIBRATE ARRAY" icon="⚙" onClick={handleRecalibrate} />
          </div>

          <ActionBtn label="EXPORT LOGS" icon="⬇" full outline onClick={handleExport} />
          {operationStatus && (
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10.5,
                color: overrideActive ? c.red : c.mint,
                textAlign: "right",
                marginTop: 2,
              }}
            >
              ● {operationStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ label, icon, danger, outline, full, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11.5,
        fontWeight: 700,
        letterSpacing: 0.3,
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "10px 14px",
        borderRadius: 6,
        cursor: "pointer",
        width: full ? "100%" : "auto",
        justifyContent: "center",
        background: danger ? "#7a2020" : outline ? "transparent" : "#0d2530",
        color: danger ? "#ffdcd6" : c.cyan,
        border: danger
          ? "1px solid #a33030"
          : outline
          ? `1px solid ${c.cyan}55`
          : `1px solid #1a3a45`,
      }}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}

function AlertBanner({ data }) {
  const spotlight = data?.spotlight || {};
  const pbVal = spotlight.pb || "0.042 mg/L";

  return (
    <div style={{ padding: "18px 24px 0" }}>
      <div
        style={{
          background: c.redBg2,
          border: `1px solid ${c.borderRed}`,
          borderLeft: `4px solid ${c.red}`,
          borderRadius: 8,
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 7,
              background: "#5a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            ⚠
          </div>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  fontSize: 15,
                  color: "#ffb3ab",
                  letterSpacing: 0.3,
                }}
              >
                LEAD (Pb) SURGE DETECTED ({pbVal})
              </span>
              <Badge tone="red">4.2X WHO LIMIT</Badge>
            </div>
            <div style={{ color: "#c99a96", fontSize: 12.5, marginTop: 4 }}>
              Solenoid Isolation Valve #SV-04 triggered at 14:26:08 IST. Clean
              effluent outflow suspended. Drinking reservoir sealed.
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 20,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11.5,
            color: c.sub,
            alignItems: "center",
          }}
        >
          <span>
            ISOLATION DURATION:{" "}
            <strong style={{ color: c.text }}>01h 14m 22s</strong>
          </span>
          <StatusPill dot={c.mint} text="GRID CONTAINED" />
        </div>
      </div>
    </div>
  );
}

function SensorCard({ label, badge, tone, value, unit, sub, extra, bar }) {
  return (
    <div
      style={{
        background: c.panel,
        border: `1px solid ${c.border}`,
        borderRadius: 8,
        padding: "14px 16px",
        flex: "1 1 200px",
        minWidth: 170,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10.5,
            color: c.sub,
            letterSpacing: 0.3,
          }}
        >
          {label}
        </span>
        <Badge tone={tone}>{badge}</Badge>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 27,
            fontWeight: 700,
            color: tone === "red" ? c.red : c.text,
          }}
        >
          {value}
        </span>
        <span style={{ fontSize: 12, color: c.sub, fontWeight: 600 }}>
          {unit}
        </span>
      </div>
      {bar && (
        <div
          style={{
            height: 4,
            borderRadius: 2,
            background: "#1a2230",
            margin: "8px 0",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: bar,
              height: "100%",
              background:
                tone === "red"
                  ? c.red
                  : `linear-gradient(90deg, ${c.mint}, ${c.cyan})`,
            }}
          />
        </div>
      )}
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10.5,
          color: c.sub,
          lineHeight: 1.6,
        }}
      >
        {sub}
        {extra && <div>{extra}</div>}
      </div>
    </div>
  );
}

function SensorGrid({ data }) {
  const spotlight = data?.spotlight || {};

  return (
    <div
      style={{
        padding: "18px 24px 0",
        display: "flex",
        gap: 14,
        flexWrap: "wrap",
      }}
    >
      <SensorCard
        label="PH SENSOR #01"
        badge="OPTIMAL"
        tone="mint"
        value={spotlight.ph ? spotlight.ph.replace(" pH", "") : "6.84"}
        unit="pH"
        bar="55%"
        sub="Range: 6.5 – 8.5   Δ +0.02/h"
      />
      <SensorCard
        label="TURBIDITY IN-LINE"
        badge="ELEVATED"
        tone="amber"
        value="1.40"
        unit="NTU"
        bar="80%"
        sub="Threshold ≤ 1.0 NTU"
        extra="Pre-filter active"
      />
      <SensorCard
        label="TOTAL SOLIDS (TDS)"
        badge="SAFE"
        tone="mint"
        value={spotlight.tds ? spotlight.tds.replace(" ppm", "") : "312"}
        unit="PPM"
        bar="40%"
        sub="Limit < 500 PPM BIS IS 10500"
      />
      <SensorCard
        label="CORE TEMP"
        badge="NOMINAL"
        tone="cyan"
        value="24.2"
        unit="°C"
        bar="50%"
        sub="Operational 15–32°C Δ +0.1°C"
      />
      <SensorCard
        label="PATHOGEN / E. COLI"
        badge="STERILE"
        tone="mint"
        value="0.0"
        unit="CFU/100ml"
        bar="100%"
        sub="UV-C Active: 254nm"
        extra="100% Inactivation"
      />
      <SensorCard
        label="HEAVY METALS (XRF)"
        badge="BREACH"
        tone="red"
        value={spotlight.pb ? spotlight.pb.replace(" ppm", "") : "0.042"}
        unit="Pb mg/L"
        bar="95%"
        sub="Fe: 0.62   As: 0.004   F: 0.80 ↑"
      />
    </div>
  );
}

function StageCard({ n, tag, tone, title, sub, rows, locked }) {
  const isLocked = !!locked;
  return (
    <div
      style={{
        background: isLocked ? c.redBg2 : c.panel,
        border: `1px solid ${isLocked ? c.borderRed : c.border}`,
        borderRadius: 8,
        padding: "14px 16px",
        flex: "1 1 170px",
        minWidth: 165,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: c.sub,
            letterSpacing: 0.3,
          }}
        >
          STAGE {n}
        </span>
        <Badge tone={isLocked ? "red" : tone}>{tag}</Badge>
      </div>
      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 600,
          fontSize: 15,
          color: c.text,
          marginBottom: 2,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 11,
          color: c.sub,
          marginBottom: 12,
          lineHeight: 1.4,
        }}
      >
        {sub}
      </div>
      <div style={{ flex: 1 }}>
        {rows.map(([k, v]) => (
          <div
            key={k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              padding: "3px 0",
              color: c.sub,
            }}
          >
            <span>{k}</span>
            <span style={{ color: isLocked ? "#ffb3ab" : c.text, fontWeight: 600 }}>
              {v}
            </span>
          </div>
        ))}
      </div>
      <div
        style={{
          height: 3,
          borderRadius: 2,
          marginTop: 12,
          background: isLocked
            ? c.red
            : `linear-gradient(90deg, ${c.mint}, ${c.cyan})`,
        }}
      />
    </div>
  );
}

function RemediationTrain() {
  return (
    <div style={{ padding: "26px 24px 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10.5,
              color: c.cyan,
              letterSpacing: 0.5,
              marginBottom: 4,
            }}
          >
            SCADA FLOW LINE &amp; CHAMBER TELEMETRY
          </div>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 21,
              fontWeight: 600,
              margin: 0,
              color: c.text,
            }}
          >
            6-Stage In-Situ Remediation Train
          </h2>
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: c.sub,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          TRAIN STATUS:
          <span style={{ color: c.sub }}>●</span>
          <span style={{ color: c.text }}>
            DISPATCH ISOLATED (AUTO-SHUTOFF TRIP)
          </span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <StageCard
          n="01"
          tag="INTAKE"
          tone="cyan"
          title="Mine Runoff Sump"
          sub="Pithead Drainage Collector"
          rows={[
            ["Turbidity:", "48.2 NTU"],
            ["Raw TDS:", "890 PPM"],
            ["Intake Flow:", "1,240 L/h"],
          ]}
        />
        <StageCard
          n="02"
          tag="SEDIMENT"
          tone="mint"
          title="Lamella Settler Tank"
          sub="Alum & Polyelectrolyte Dosing"
          rows={[
            ["Particulate:", "92% Removed"],
            ["Line Pressure:", "3.2 Bar"],
            ["Sludge Valve:", "AUTO-CYCLING"],
          ]}
        />
        <StageCard
          n="03"
          tag="ADSORPTION"
          tone="cyan"
          title="GAC & Chelating Resin"
          sub="Heavy Metal Ion Trapping"
          rows={[
            ["Resin Saturation:", "88.4%"],
            ["Bed Life:", "68% Remaining"],
            ["Chelate Status:", "RECOVERY PEAK"],
          ]}
        />
        <StageCard
          n="04"
          tag="MEMBRANE"
          tone="mint"
          title="UF & RO Skid #2"
          sub="Cross-Flow Desalination"
          rows={[
            ["Permeate Flux:", "420 L/h"],
            ["Salt Rejection:", "98.4%"],
            ["Differential P:", "1.8 Bar"],
          ]}
        />
        <StageCard
          n="05"
          tag="IRRADIATION"
          tone="mint"
          title="UV-C Germicidal Rig"
          sub="Dual In-Line Quartz Sleeves"
          rows={[
            ["UV Intensity:", "42 mJ/cm²"],
            ["Lamp Runtime:", "1,420 / 8,000h"],
            ["Optical Sensor:", "CLEAN (100%)"],
          ]}
        />
        <StageCard
          n="06 · OUTLET"
          tag="LOCKED"
          locked
          title="Cutoff Solenoid #SV-04"
          sub="Automated Isolation Safeguard"
          rows={[
            ["Valve State:", "CLOSED (TRIPPED)"],
            ["Hold Pressure:", "4.8 Bar Sealed"],
            ["Safe Reservoir:", "PROTECTED"],
          ]}
        />
      </div>
    </div>
  );
}

function TelemetryChart() {
  const w = 640;
  const h = 230;
  const padL = 40;
  const padB = 24;
  const plotW = w - padL - 10;
  const plotH = h - padB - 10;

  const xForHour = (hr) => padL + (hr / 24) * plotW;
  const yFor = (v, max) => 10 + plotH - (v / max) * plotH;

  const leadPts = [
    [0, 2], [4, 2], [8, 3], [12, 4], [13.5, 5], [14.2, 8], [14.43, 100],
    [14.6, 42], [15.2, 62], [16, 78], [16.6, 60], [17.2, 38], [18, 22],
  ];
  const turbPts = [
    [0, 8], [4, 8], [8, 9], [12, 10], [13.5, 11], [14.2, 14], [14.43, 46],
    [15, 40], [15.6, 30], [16.3, 22], [17, 16], [18, 12],
  ];
  const phPts = [
    [0, 14], [4, 14.5], [8, 15], [12, 15], [14, 15.5], [14.43, 16],
    [15, 15.5], [16, 15], [17, 14.5], [18, 14.5],
  ];

  const toPath = (pts, max) =>
    pts
      .map(([hr, v], i) => `${i === 0 ? "M" : "L"} ${xForHour(hr)} ${yFor(v, max)}`)
      .join(" ");

  const leadMax = 105;
  const turbMax = 55;
  const phMax = 20;

  const spikeX = xForHour(14.43);

  return (
    <div
      style={{
        background: c.panel,
        border: `1px solid ${c.border}`,
        borderRadius: 8,
        padding: 18,
        flex: "2 1 480px",
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10.5,
          color: c.cyan,
          letterSpacing: 0.5,
          marginBottom: 4,
        }}
      >
        TEMPORAL TELEMETRY STREAM
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          flexWrap: "wrap",
          marginBottom: 10,
        }}
      >
        <h3
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 18,
            fontWeight: 600,
            margin: 0,
            color: c.text,
          }}
        >
          24-Hour Continuous Parameter Dynamics
        </h3>
        <div style={{ display: "flex", gap: 14, fontSize: 11 }}>
          <Legend color={c.mint} label="pH (x10)" />
          <Legend color={c.cyan} label="Turbidity (NTU)" />
          <Legend color={c.red} label="TDS (PPM)" />
        </div>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto" }}>
        {[0, 4, 8, 12, 16, 20, 24].map((hr) => (
          <line
            key={hr}
            x1={xForHour(hr)}
            y1={10}
            x2={xForHour(hr)}
            y2={10 + plotH}
            stroke="#182230"
            strokeWidth="1"
          />
        ))}
        <line
          x1={padL}
          x2={w - 10}
          y1={yFor(10, leadMax)}
          y2={yFor(10, leadMax)}
          stroke="#4a3a2a"
          strokeDasharray="4 4"
          strokeWidth="1"
        />
        <text x={padL + 4} y={yFor(10, leadMax) - 5} fill={c.sub} fontSize="9" fontFamily="'JetBrains Mono', monospace">
          TDS SAFETY THRESHOLD: 500 PPM
        </text>

        <rect
          x={xForHour(14.26)}
          y={10}
          width={plotW + padL - xForHour(14.26)}
          height={plotH}
          fill="#3a121866"
        />

        <path d={toPath(phPts, phMax)} fill="none" stroke={c.mint} strokeWidth="2" />
        <path d={toPath(turbPts, turbMax)} fill="none" stroke={c.cyan} strokeWidth="2" />
        <path d={toPath(leadPts, leadMax)} fill="none" stroke={c.red} strokeWidth="2.2" />

        <line
          x1={spikeX}
          x2={spikeX}
          y1={10}
          y2={10 + plotH}
          stroke="#5a2a2a"
          strokeWidth="1"
        />
        <circle cx={spikeX} cy={yFor(100, leadMax)} r="4" fill={c.red} />

        <g>
          <rect x={spikeX + 8} y={20} width={190} height={40} fill="#180a0c" stroke={c.borderRed} rx="4" />
          <text x={spikeX + 16} y={34} fill="#ffb3ab" fontSize="9.5" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
            14:26:08 MINE FLUSH SPIKE
          </text>
          <text x={spikeX + 16} y={48} fill={c.sub} fontSize="8.5" fontFamily="'JetBrains Mono', monospace">
            Solenoid Isolated • Safe Outflow Stopped
          </text>
        </g>

        {[
          [0, "00:00"],
          [4, "04:00"],
          [8, "08:00"],
          [12, "12:00"],
          [14.43, "14:26 [NOW]"],
          [18, "18:00 (EST)"],
        ].map(([hr, label]) => (
          <text
            key={label}
            x={xForHour(hr)}
            y={h - 6}
            fill={hr === 14.43 ? c.red : c.sub}
            fontSize="9.5"
            fontFamily="'JetBrains Mono', monospace"
            textAnchor="middle"
          >
            {label}
          </text>
        ))}
      </svg>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10.5,
          color: c.sub,
          marginTop: 8,
          flexWrap: "wrap",
          gap: 6,
        }}
      >
        <span>
          Sampling Interval: 1.0s continuous stream • Electro-optical & Absorption Spectrophotometry
        </span>
        <span style={{ color: c.mint }}>99.98% Telemetry Packet Delivery</span>
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, color: c.sub, fontFamily: "'JetBrains Mono', monospace" }}>
      <span style={{ width: 10, height: 2, background: color, display: "inline-block" }} />
      {label}
    </div>
  );
}

function OpticalDiagnostics() {
  return (
    <div
      style={{
        background: c.panel,
        border: `1px solid ${c.border}`,
        borderRadius: 8,
        padding: 18,
        flex: "1 1 320px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 4,
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10.5,
            color: c.cyan,
            letterSpacing: 0.5,
          }}
        >
          OPTICAL DIAGNOSTICS
        </span>
        <StatusPill dot={c.red} text="CAM-02 (LIVE)" />
      </div>
      <h3
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 18,
          fontWeight: 600,
          margin: "6px 0 12px",
          color: c.text,
        }}
      >
        Intake Sump Observation
      </h3>

      <div
        style={{
          position: "relative",
          borderRadius: 6,
          overflow: "hidden",
          border: `1px solid ${c.border}`,
          height: 200,
          background: "linear-gradient(180deg,#16202c 0%,#0d1520 55%,#0a1018 100%)",
        }}
      >
        <svg viewBox="0 0 400 200" style={{ width: "100%", height: "100%" }}>
          <polygon points="0,140 90,90 200,110 300,80 400,120 400,200 0,200" fill="#141d28" />
          <rect x="60" y="95" width="220" height="75" rx="4" fill="#1a2735" stroke="#233247" />
          <rect x="75" y="108" width="24" height="24" fill="#3fd0e880" />
          <rect x="110" y="108" width="24" height="24" fill="#4de8c480" />
          <rect x="145" y="108" width="60" height="14" fill="#0d1620" stroke="#2a3a4a" />
          <circle cx="330" cy="60" r="16" fill="#f0d98a" opacity="0.85" />
          <rect x="230" y="60" width="50" height="30" fill="#101a24" stroke="#2a3a4a" />
        </svg>
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            display: "flex",
            gap: 6,
            alignItems: "center",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9.5,
            color: "#ffb3ab",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.red }} />
          REC • FEED-04B
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9.5,
            color: c.mint,
            background: "#0008",
            padding: "2px 6px",
            borderRadius: 3,
          }}
        >
          SOLAR PV: 3.4 kW GEN
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        {[
          ["Intake Sump Depth:", "3.82 m (78% Cap)"],
          ["Backwash Waste Drain:", "Direct to Tailings Pond"],
          ["Distribution Reservoir:", "14,200 L Reserve Safe"],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11.5,
              padding: "5px 0",
              color: c.sub,
            }}
          >
            <span>{k}</span>
            <span style={{ color: c.cyan, fontWeight: 600 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConsumablesPanel() {
  const [dispatchRequested, setDispatchRequested] = useState(false);

  const handleDispatch = () => {
    setDispatchRequested(true);
  };

  const items = [
    {
      name: "Resin Chelating Bed (Pb/Fe Scavenger)",
      right: "312h until regen",
      pct: 68,
      color: c.cyan,
      meta: [
        ["Installed:", "12-Jan-2025"],
        ["Capacity:", "68% remaining"],
      ],
    },
    {
      name: "Spiral-Wound RO Membrane Skid",
      right: "Optimal Flux",
      pct: 82,
      color: c.mint,
      meta: [
        ["Fouling Index (SDI):", "2.1"],
        ["", "82% Clean Surface"],
      ],
    },
    {
      name: "Liquid Alum Coagulant Reservoir",
      right: "42 Liters",
      pct: 35,
      color: c.cyan,
      meta: [
        ["Dosing rate:", "12 mL/min"],
        ["Est. Runtime:", "58 hrs"],
      ],
    },
  ];

  return (
    <div
      style={{
        background: c.panel,
        border: `1px solid ${c.border}`,
        borderRadius: 8,
        padding: 18,
        flex: "1 1 400px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 4,
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10.5,
            color: c.cyan,
            letterSpacing: 0.5,
          }}
        >
          CONSUMABLES LIFECYCLE
        </span>
        <button
          onClick={handleDispatch}
          style={{
            background: "none",
            border: "none",
            color: c.cyan,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10.5,
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          {dispatchRequested ? "DISPATCH REQUESTED ✓" : "REQUEST DISPATCH"}
        </button>
      </div>
      <h3
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 18,
          fontWeight: 600,
          margin: "6px 0 18px",
          color: c.text,
        }}
      >
        Filter & Chemical Stocks
      </h3>

      {items.map((it) => (
        <div key={it.name} style={{ marginBottom: 18 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
              fontSize: 12.5,
              flexWrap: "wrap",
              gap: 4,
            }}
          >
            <span style={{ color: c.text, fontWeight: 600 }}>{it.name}</span>
            <span style={{ color: it.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 11.5 }}>
              {it.right}
            </span>
          </div>
          <div
            style={{
              height: 5,
              borderRadius: 3,
              background: "#1a2230",
              overflow: "hidden",
              marginBottom: 6,
            }}
          >
            <div
              style={{
                width: `${it.pct}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${it.color}, ${c.mint})`,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10.5,
              color: c.sub,
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            {it.meta.map(([k, v], i) => (
              <span key={i}>
                {k} <span style={{ color: c.sub }}>{v}</span>
              </span>
            ))}
          </div>
        </div>
      ))}

      <div
        style={{
          borderTop: `1px solid ${c.border}`,
          paddingTop: 12,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: c.sub,
          flexWrap: "wrap",
          gap: 6,
        }}
      >
        <span>Next Preventive Maintenance:</span>
        <span style={{ color: c.cyan, fontWeight: 700 }}>
          24-Feb-2025 (District Team Alpha)
        </span>
      </div>
    </div>
  );
}

function IncidentLog({ deviceId }) {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  const rows = [
    {
      t: "14:26:08",
      sub: "VALVE #SV-04",
      desc: "Automated isolation: Pb limit breach",
      val: "0.042 mg/L",
      state: "SHUTDOWN",
      tone: "red",
      row: true,
    },
    {
      t: "14:25:52",
      sub: "SPECTRO-XRF",
      desc: "Spike detected in raw mine intake bed",
      val: "0.038 mg/L",
      state: "ALERT LEVEL 2",
      tone: "amber",
    },
    {
      t: "14:10:00",
      sub: "PRE-SEDIMENT",
      desc: "Automatic bottom sludge drain purge completed",
      val: "45 Liters",
      state: "SUCCESS",
      tone: "mint",
    },
    {
      t: "13:45:12",
      sub: "UV-REACTOR",
      desc: "Quartz sleeve mechanical wiper sweep finished",
      val: "100% Trans.",
      state: "NOMINAL",
      tone: "cyan",
    },
    {
      t: "12:00:00",
      sub: "SYSTEM-CLK",
      desc: "Periodic state telemetry synchronization to Ranchi HQ",
      val: "Ping: 34ms",
      state: "SYNCED",
      tone: "mint",
    },
  ];

  const handleAppendLog = async () => {
    if (!note.trim()) return;
    const text = note.trim();
    setNotes((prev) => [...prev, text]);
    setNote("");

    try {
      await appendTelemetryLog({
        device_id: deviceId,
        event: `Technician Field Note: ${text}`,
        status: "RECORDED",
      });
    } catch (e) {
      console.error("Error appending log to Firebase:", e);
    }
  };

  return (
    <div
      style={{
        background: c.panel,
        border: `1px solid ${c.border}`,
        borderRadius: 8,
        padding: 18,
        flex: "1.6 1 500px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 4,
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10.5,
            color: c.cyan,
            letterSpacing: 0.5,
          }}
        >
          TELEMETRY AUDIT TRAIL
        </span>
        <StatusPill dot={c.mint} text="LIVE LOGGING" />
      </div>
      <h3
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 18,
          fontWeight: 600,
          margin: "6px 0 14px",
          color: c.text,
        }}
      >
        Automated SCADA Incident Log
      </h3>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
          <thead>
            <tr>
              {["TIMESTAMP", "SUBSYSTEM", "EVENT DESCRIPTION", "PARAMETER VALUE", "ACTION STATE"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9.5,
                      color: c.sub,
                      padding: "0 8px 8px 0",
                      fontWeight: 600,
                      letterSpacing: 0.3,
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                style={{
                  background: r.row ? c.redBg2 : "transparent",
                  borderBottom: `1px solid ${c.border}`,
                }}
              >
                <td style={{ padding: "10px 8px 10px 0", fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: c.text, whiteSpace: "nowrap" }}>
                  {r.t}
                </td>
                <td style={{ padding: "10px 8px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: c.cyan, whiteSpace: "nowrap" }}>
                  {r.sub}
                </td>
                <td style={{ padding: "10px 8px", fontSize: 12, color: c.text, minWidth: 200 }}>
                  {r.desc}
                </td>
                <td style={{ padding: "10px 8px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: c.sub, whiteSpace: "nowrap" }}>
                  {r.val}
                </td>
                <td style={{ padding: "10px 0" }}>
                  <Badge tone={r.tone}>{r.state}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: 14,
          display: "flex",
          gap: 10,
          alignItems: "center",
          border: `1px solid ${c.border}`,
          borderRadius: 6,
          padding: "8px 12px",
        }}
      >
        <span style={{ color: c.sub }}>📝</span>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAppendLog();
          }}
          placeholder="Add field technician observation note for Unit #04..."
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: c.text,
            fontSize: 12.5,
          }}
        />
        <button
          onClick={handleAppendLog}
          style={{
            background: c.cyan,
            border: "none",
            color: "#04222a",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            fontSize: 10.5,
            padding: "7px 12px",
            borderRadius: 5,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          APPEND LOG
        </button>
      </div>

      {notes.map((n, index) => (
        <div
          key={index}
          style={{
            marginTop: 8,
            padding: "8px 10px",
            border: `1px solid ${c.border}`,
            borderRadius: 5,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10.5,
            color: c.text,
          }}
        >
          <span style={{ color: c.cyan }}>TECH NOTE:</span> {n}
        </div>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <div
      style={{
        borderTop: `1px solid ${c.border}`,
        marginTop: 28,
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
  );
}

export default function PlantTelemetryPreview() {
  const [deviceId, setDeviceId] = useState("JH-DHN-04");
  const [data, setData] = useState(null);
  const [allPlants, setAllPlants] = useState([]);

  useEffect(() => {
    fetchDashboardData(deviceId)
      .then((res) => setData(res))
      .catch((err) => console.error("Error loading device telemetry:", err));
  }, [deviceId]);

  useEffect(() => {
    fetchStatewideOverviewData()
      .then((res) => {
        if (res?.plants && res.plants.length > 0) {
          setAllPlants(res.plants);
        }
      })
      .catch((err) => console.error("Error loading plants list:", err));
  }, []);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: c.bg,
        color: c.text,
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
      />
      <TopBar />
      <HeaderPanel deviceId={deviceId} setDeviceId={setDeviceId} allPlants={allPlants} data={data} />
      <AlertBanner data={data} />
      <SensorGrid data={data} />
      <RemediationTrain />

      <div style={{ padding: "22px 24px 0", display: "flex", gap: 18, flexWrap: "wrap" }}>
        <TelemetryChart />
        <OpticalDiagnostics />
      </div>

      <div style={{ padding: "18px 24px 0", display: "flex", gap: 18, flexWrap: "wrap" }}>
        <ConsumablesPanel />
        <IncidentLog deviceId={deviceId} />
      </div>

      <Footer />
    </div>
  );
}
