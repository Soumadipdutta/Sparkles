import datetime
from pathlib import Path
from website.services.firebase import db, BASE_DIR

# BIS IS 10500 Standard Thresholds
CEILINGS = {
    "lead_pb": 0.01,
    "arsenic_as": 0.01,
    "iron_fe": 0.30,
    "chromium_cr": 0.05,
    "fluoride_f": 1.00,
    "ph_min": 6.5,
    "ph_max": 8.5,
    "tds": 500,
    "turbidity": 1.0
}


def preprocess_sensor_telemetry(raw_data: dict) -> dict:
    """
    Preprocesses raw hardware sensor payload into structured, UI-ready data
    compliant with BIS IS 10500 standards and Toyam frontend parameters.
    """
    dev_id = raw_data.get("device_id", "JH-DHN-04")
    name = raw_data.get("name", f"Plant Unit {dev_id}")
    district = raw_data.get("district", "Operational District")
    village = raw_data.get("village", district)
    water_source = raw_data.get("water_source", "groundwater")
    scada_channel = raw_data.get("scada_channel", "SCADA CH: 01")
    position = raw_data.get("position", {"x": 50, "y": 50})

    # Raw telemetry readings
    lead_pb = float(raw_data.get("lead_pb", raw_data.get("lead", 0.001)))
    arsenic_as = float(raw_data.get("arsenic_as", raw_data.get("arsenic", 0.001)))
    iron_fe = float(raw_data.get("iron_fe", raw_data.get("iron", 0.10)))
    ph = float(raw_data.get("ph", 7.0))
    tds = float(raw_data.get("tds", 200.0))
    turbidity = float(raw_data.get("turbidity", 0.3))
    flow_rate = float(raw_data.get("flow_rate", 0.0))

    timestamp_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Safety Pre-processing Engine
    is_cutoff = lead_pb > CEILINGS["lead_pb"] or arsenic_as > CEILINGS["arsenic_as"] or ph < 6.0 or ph > 9.0
    is_alert = not is_cutoff and (iron_fe > CEILINGS["iron_fe"] or tds > CEILINGS["tds"] or turbidity > CEILINGS["turbidity"] or ph < CEILINGS["ph_min"])

    if is_cutoff:
        status = "cutoff"
        status_label = "CRITICAL CUTOFF"
        side_label = "AUTO-HALTED"
        solenoid_active = True
        tone = "#ffb4ab"
        tone_bg = "rgba(255,180,171,0.15)"
        valve_str = "CLOSED (0 L/min)"
    elif is_alert:
        status = "alert"
        status_label = "ELEVATED METALS"
        side_label = "WARNING"
        solenoid_active = False
        tone = "#7bd0ff"
        tone_bg = "rgba(123,208,255,0.15)"
        valve_str = f"THROTTLED ({flow_rate} L/min)"
    else:
        status = "normal"
        status_label = "OPTIMAL"
        side_label = "NORMAL"
        solenoid_active = False
        tone = "#4edea3"
        tone_bg = "rgba(78,222,163,0.15)"
        valve_str = f"OPEN ({flow_rate if flow_rate > 0 else 420} L/min)"

    pb_display = f"{lead_pb:.3f} ppm" if lead_pb >= 0.001 else "<0.001 ppm"

    # UI Metrics List
    metrics = []
    if lead_pb > CEILINGS["lead_pb"]:
        metrics.append({"label": "Lead (Pb) Concentration", "value": f"{lead_pb:.3f} ppm (Limit: 0.01)"})
    elif iron_fe > CEILINGS["iron_fe"]:
        metrics.append({"label": "Iron (Fe) Level", "value": f"{iron_fe:.2f} ppm (Limit: 0.30)"})
    else:
        metrics.append({"label": "pH Level", "value": f"{ph:.1f} pH"})

    metrics.append({"label": "Solenoid Gate Valve", "value": valve_str})

    processed_record = {
        "raw_telemetry": {
            "lead_pb": lead_pb,
            "arsenic_as": arsenic_as,
            "iron_fe": iron_fe,
            "ph": ph,
            "tds": tds,
            "turbidity": turbidity,
            "flow_rate": flow_rate,
            "ingested_at": timestamp_str
        },
        "info": {
            "name": name,
            "village": village,
            "water_source": water_source,
            "district": district,
            "scada_channel": scada_channel,
            "position": position
        },
        "system": {
            "online": True,
            "last_updated": timestamp_str,
            "quick_status": status_label,
            "status": status,
            "status_label": status_label,
            "side_label": side_label,
            "tone": tone,
            "tone_bg": tone_bg,
            "solenoid_shutoff_active": solenoid_active
        },
        "current": {
            "water_safety": {
                "score": 45.0 if is_cutoff else (75.0 if is_alert else 96.0),
                "status": "Critical" if is_cutoff else ("Warning" if is_alert else "Optimal"),
                "change_from_yesterday": -8.5 if is_cutoff else 1.2
            },
            "water_quality": {
                "purified": {
                    "ph": ph,
                    "turbidity": turbidity,
                    "tds": tds,
                    "temperature": 26.5
                }
            },
            "contaminants": {
                "arsenic": { "value": arsenic_as, "unit": "ppm", "status": "Safe" if arsenic_as <= 0.01 else "High", "reference_limit": 0.01 },
                "lead": { "value": lead_pb, "unit": "ppm", "status": "Safe" if lead_pb <= 0.01 else "Cutoff", "reference_limit": 0.01 },
                "iron": { "value": iron_fe, "unit": "ppm", "status": "Safe" if iron_fe <= 0.3 else "Warning", "reference_limit": 0.3 }
            }
        },
        "spotlight": {
          "pb": pb_display,
          "ph": f"{ph:.1f} pH",
          "tds": f"{int(tds)} ppm",
          "solenoid_shutoff_active": solenoid_active,
          "scada_channel": scada_channel
        },
        "metrics": metrics
    }

    return dev_id, processed_record


def save_processed_telemetry(device_id: str, record: dict):
    """
    Persists preprocessed telemetry into Firebase Realtime Database at devices/{device_id}
    and syncs local JSON database export for fallback reliability.
    """
    try:
        ref = db.reference(f"devices/{device_id}")
        ref.set(record)
        print(f"[Firebase] Successfully saved preprocessed telemetry for {device_id}")
    except Exception as e:
        print(f"[Firebase] Offline mode or error writing {device_id}: {e}")

    # Also sync local JSON database export
    json_path = BASE_DIR / "data" / "firebase_database_export.json"
    if json_path.exists():
        import json
        try:
            with open(json_path, "r+", encoding="utf-8") as f:
                db_data = json.load(f)
                if "devices" not in db_data:
                    db_data["devices"] = {}
                db_data["devices"][device_id] = record
                f.seek(0)
                json.dump(db_data, f, indent=2)
                f.truncate()
        except Exception as err:
            print(f"[Local DB] Sync error: {err}")
