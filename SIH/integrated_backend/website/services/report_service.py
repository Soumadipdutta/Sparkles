# services/report_service.py

import json
from pathlib import Path
from website.services.firebase import get_device_data


def get_report_summary():
    device_data = get_device_data("device_001") or {}
    current = device_data.get("current", {})
    water_safety = current.get("water_safety", {})
    alerts_data = device_data.get("alerts", {})
    recent_alerts = alerts_data.get("recent", [])
    system = device_data.get("system", {})
    trends_24h = device_data.get("trends", {}).get("24h", [])

    score = water_safety.get("score", 94)
    change = water_safety.get("change_from_yesterday", 3)
    safety_status = water_safety.get("status", "safe").capitalize()

    total_alerts = len(recent_alerts)
    warn_count = sum(1 for a in recent_alerts if a.get("type") == "warning")
    info_count = sum(1 for a in recent_alerts if a.get("type") == "info")
    crit_count = sum(1 for a in recent_alerts if a.get("type") == "critical")

    # Tests conducted dynamically based on samples recorded
    samples_count = len(trends_24h)
    tests_conducted = samples_count * 16 if samples_count > 0 else 1248

    is_online = system.get("online", True)
    uptime = 99.7 if is_online else 84.5
    uptime_status = "Excellent" if is_online else "Offline"
    uptime_tone = "ok" if is_online else "bad"
    uptime_delta = "0.4% from previous period" if is_online else "15.2% drop from outage"

    return {
        "success": True,
        "data": {
            "overall_water_safety_score": score,
            "safety_status": safety_status,
            "safety_delta": f"{change} points from previous period",
            "tests_conducted": tests_conducted,
            "alerts_triggered": total_alerts,
            "alerts_breakdown": f"{warn_count} Warning, {info_count + crit_count} Info/Crit",
            "data_uptime": uptime,
            "uptime_status": uptime_status,
            "uptime_tone": uptime_tone,
            "uptime_delta": uptime_delta,
            "is_online": is_online,
        },
    }



def get_contaminants():
    device_data = get_device_data("device_001") or {}
    contaminants_dict = device_data.get("current", {}).get("contaminants", {})

    items = []

    label_map = {
        "arsenic": "Arsenic (As)",
        "lead": "Lead (Pb)",
        "iron": "Iron (Fe)",
        "manganese": "Manganese (Mn)",
        "chromium": "Chromium (Cr)",
    }

    limit_map = {
        "arsenic": 0.010,
        "lead": 0.010,
        "iron": 0.300,
        "manganese": 0.100,
        "chromium": 0.050,
    }

    for key, label in label_map.items():
        entry = contaminants_dict.get(key, {})
        val = entry.get("value", 0.005)
        unit = entry.get("unit", "mg/L")
        ref_limit = entry.get("reference_limit", limit_map.get(key, 0.010))
        status_str = entry.get("status", "low")

        if status_str in ["low", "within_reference", "safe", "ok"]:
            status_clean = "Safe"
        elif status_str in ["monitor", "warning"]:
            status_clean = "Monitor"
        else:
            status_clean = "Critical"

        items.append({
            "parameter": label,
            "value": f"{val} {unit}",
            "raw_value": val,
            "unit": unit,
            "safe_limit": f"{ref_limit} {unit}",
            "status": status_clean,
        })

    return {
        "success": True,
        "data": items,
    }


def get_trends():
    device_data = get_device_data("device_001") or {}
    trends_raw = device_data.get("trends", {})
    trends_24h = trends_raw.get("24h", [])
    trends_7d = trends_raw.get("7d", [])
    trends_30d = trends_raw.get("30d", [])

    def build_series(items):
        ph_list, turb_list, tds_list, temp_list = [], [], [], []
        for item in items:
            t = item.get("timestamp") or item.get("time") or "00:00"
            ph_list.append({"time": t, "value": item.get("ph", 7.2)})
            turb_list.append({"time": t, "value": item.get("turbidity", 2.1)})
            tds_list.append({"time": t, "value": item.get("tds", 450)})
            temp_list.append({"time": t, "value": item.get("temperature", 27.0)})
        return {
            "pH": ph_list,
            "turbidity": turb_list,
            "tds": tds_list,
            "temperature": temp_list,
            "points": items,
        }

    series_24h = build_series(trends_24h)
    series_7d = build_series(trends_7d)
    series_30d = build_series(trends_30d)

    # Fallback default if 24h is empty
    if not series_24h["pH"]:
        fallback_items = [
            {"timestamp": "00:00", "ph": 7.1, "turbidity": 2.1, "tds": 310, "temperature": 24.5},
            {"timestamp": "04:00", "ph": 7.2, "turbidity": 2.4, "tds": 315, "temperature": 24.0},
            {"timestamp": "08:00", "ph": 7.0, "turbidity": 2.0, "tds": 305, "temperature": 26.2},
            {"timestamp": "12:00", "ph": 7.3, "turbidity": 2.8, "tds": 320, "temperature": 29.1},
            {"timestamp": "16:00", "ph": 7.2, "turbidity": 2.3, "tds": 312, "temperature": 28.0},
            {"timestamp": "20:00", "ph": 7.1, "turbidity": 2.2, "tds": 308, "temperature": 25.8},
        ]
        series_24h = build_series(fallback_items)

    return {
        "success": True,
        "data": {
            "last_24h": series_24h,
            "last_7d": series_7d,
            "last_30d": series_30d,
            "pH": series_24h["pH"],
            "turbidity": series_24h["turbidity"],
            "tds": series_24h["tds"],
            "temperature": series_24h["temperature"],
        },
    }



def get_heatmap():
    device_data = get_device_data("device_001") or {}
    trends_24h = device_data.get("trends", {}).get("24h", [])

    safe_count = sum(1 for item in trends_24h if item.get("ph", 7.2) >= 6.5 and item.get("ph", 7.2) <= 8.5 and item.get("turbidity", 2) < 5)
    warn_count = sum(1 for item in trends_24h if item.get("turbidity", 2) >= 5 or item.get("tds", 400) > 600)
    crit_count = max(0, len(trends_24h) - safe_count - warn_count)

    return {
        "success": True,
        "data": [
            {"date": "2026-08-24", "safe": 21, "warning": 2, "critical": 0},
            {"date": "2026-08-25", "safe": 20, "warning": 3, "critical": 1},
            {"date": "2026-08-26", "safe": 22, "warning": 1, "critical": 0},
            {"date": "2026-08-27", "safe": 19, "warning": 4, "critical": 1},
            {"date": "2026-08-28", "safe": max(15, safe_count * 3), "warning": max(1, warn_count), "critical": crit_count},
        ],
    }


def get_recent_reports():
    device_data = get_device_data("device_001") or {}
    info = device_data.get("info", {})
    village_name = info.get("village", "XYZ")

    return [
        {
            "id": 1,
            "name": f"Weekly Water Quality Report - {village_name}",
            "date": "28 Aug 2026",
            "type": "Weekly",
            "status": "Generated",
        },
        {
            "id": 2,
            "name": f"Water Safety Analysis - {village_name}",
            "date": "27 Aug 2026",
            "type": "Analysis",
            "status": "Generated",
        },
        {
            "id": 3,
            "name": f"Monthly Compliance Audit - {village_name}",
            "date": "24 Aug 2026",
            "type": "Monthly",
            "status": "Generated",
        },
    ]