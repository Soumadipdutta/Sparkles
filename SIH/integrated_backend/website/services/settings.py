from datetime import datetime
from website.services.firebase import db, get_device_data

DEFAULT_SETTINGS = {
    "system_info": {
        "system_name": "Toyam Water Monitoring System",
        "village": "XYZ",
        "system_id": "TYM-XYZ-2025-0047",
        "firmware_version": "v2.1.3 (Latest)",
        "last_maintenance": "02 May 2025, 09:30 AM"
    },
    "display_preferences": {
        "language": "English",
        "theme": "Light",
        "date_format": "DD-MM-YYYY",

        "time_format": "12-Hour (AM/PM)",
        "refresh_interval": "1 Minute"
    },
    "measurement_units": {
        "ph": "pH",
        "turbidity": "NTU",
        "tds": "ppm",
        "arsenic_metals": "mg/L",
        "temperature": "°C"
    },
    "alert_settings": {
        "critical_alerts": True,
        "warning_alerts": True,
        "info_alerts": True,
        "maintenance_alerts": True
    },
    "thresholds": [
        { "id": "ph", "param": "pH", "safe": "6.5 – 8.5", "warn": "6.0 – 6.4 / 8.6 – 9.0", "crit": "< 6.0 or > 9.0", "unit": "pH" },
        { "id": "turbidity", "param": "Turbidity", "safe": "< 5", "warn": "5 – 10", "crit": "> 10", "unit": "NTU" },
        { "id": "tds", "param": "TDS", "safe": "< 600", "warn": "600 – 1000", "crit": "> 1000", "unit": "ppm" },
        { "id": "arsenic", "param": "Arsenic (As)", "safe": "< 0.010", "warn": "0.010 – 0.020", "crit": "> 0.020", "unit": "mg/L" },
        { "id": "lead", "param": "Lead (Pb)", "safe": "< 0.010", "warn": "0.010 – 0.020", "crit": "> 0.020", "unit": "mg/L" },
        { "id": "iron", "param": "Iron (Fe)", "safe": "< 0.30", "warn": "0.30 – 1.00", "crit": "> 1.00", "unit": "mg/L" }
    ],
    "user_profile": {
        "name": "Admin User",
        "email": "admin@toyam.in",
        "role": "System Administrator",
        "phone": "+91 98765 43210"
    },
    "backup_info": {
        "last_backup": "12 May 2025, 02:15 AM",
        "status": "Successful"
    }
}

def get_settings_data(device_id: str):
    device_data = get_device_data(device_id) or {}
    
    # Read existing settings or merge default settings without mutating existing DB keys
    settings = device_data.get("settings")
    if not settings:
        settings = DEFAULT_SETTINGS
        db.reference(f"devices/{device_id}/settings").set(DEFAULT_SETTINGS)

    info = device_data.get("info", {})
    system = device_data.get("system", {})

    system_info = {
        "system_name": info.get("name", settings["system_info"]["system_name"]),
        "village": info.get("village", settings["system_info"]["village"]),
        "system_id": system.get("system_id", settings["system_info"]["system_id"]),
        "firmware_version": system.get("firmware_version", settings["system_info"]["firmware_version"]),
        "last_maintenance": system.get("last_maintenance", settings["system_info"]["last_maintenance"]),
    }

    return {
        "system_info": system_info,
        "display_preferences": settings.get("display_preferences", DEFAULT_SETTINGS["display_preferences"]),
        "measurement_units": settings.get("measurement_units", DEFAULT_SETTINGS["measurement_units"]),
        "alert_settings": settings.get("alert_settings", DEFAULT_SETTINGS["alert_settings"]),
        "thresholds": settings.get("thresholds", DEFAULT_SETTINGS["thresholds"]),
        "user_profile": settings.get("user_profile", DEFAULT_SETTINGS["user_profile"]),
        "backup_info": settings.get("backup_info", DEFAULT_SETTINGS["backup_info"]),
    }

def update_settings_data(device_id: str, updates: dict):
    clean_updates = {k: v for k, v in updates.items() if v is not None}
    if clean_updates:
        db.reference(f"devices/{device_id}/settings").update(clean_updates)
    return get_settings_data(device_id)

def trigger_backup(device_id: str):
    now_str = datetime.now().strftime("%d %b %Y, %I:%M %p")
    backup_data = {
        "last_backup": now_str,
        "status": "Successful"
    }
    db.reference(f"devices/{device_id}/settings/backup_info").set(backup_data)
    return backup_data
