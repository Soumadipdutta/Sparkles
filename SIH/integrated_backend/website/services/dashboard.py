from datetime import datetime
from website.services.firebase import get_device_data


def get_dashboard_data(device_id: str):
    data = get_device_data(device_id) or {}
    system_data = dict(data.get("system", {}))
    trends_data = data.get("trends", {})

    # Fix pH if raw data in DB has typo like 1400
    wq_purified = dict(data.get("current", {}).get("water_quality", {}).get("purified", {}))
    if wq_purified.get("ph", 7.2) > 14:
        wq_purified["ph"] = 7.2

    return {
        "system": system_data,
        "info": data.get("info", {}),
        "water_safety": data.get("current", {}).get("water_safety", {}),
        "water_quality": wq_purified,
        "contaminants": data.get("current", {}).get("contaminants", {}),
        "purification": data.get("purification", {}),
        "filters": data.get("filters", {}),
        "trends": {
            "last_24h": trends_data.get("24h", []),
            "last_7d": trends_data.get("7d", []),
            "last_30d": trends_data.get("30d", []),
        },
        "alerts": data.get("alerts", {}),
        "risk_awareness": data.get("risk_awareness", {}),
    }