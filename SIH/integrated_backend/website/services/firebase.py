import os
from pathlib import Path
import firebase_admin
from firebase_admin import credentials, db

# Find serviceAccountKey.json dynamically across candidate locations
BASE_DIR = Path(__file__).resolve().parent.parent # website directory

key_candidates = [
    Path.cwd() / "serviceAccountKey.json",
    BASE_DIR / "serviceAccountKey.json",
    BASE_DIR.parent / "serviceAccountKey.json",
    Path.cwd() / "website" / "serviceAccountKey.json",
]

key_path = next((p for p in key_candidates if p.exists()), None)
if not key_path:
    raise FileNotFoundError(f"serviceAccountKey.json not found in candidate paths: {[str(p) for p in key_candidates]}")

cred = credentials.Certificate(str(key_path))

# Initialize Firebase
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://smart-water-system-sih-default-rtdb.asia-southeast1.firebasedatabase.app/"
})


def get_device_data(device_id: str):
    try:
        ref = db.reference(f"devices/{device_id}")
        data = ref.get()
        if data and isinstance(data, dict) and len(data) > 0:
            return data
    except Exception as e:
        print(f"[Firebase] Error fetching live device {device_id}: {e}")

    # Fallback to local JSON export
    candidate_paths = [
        BASE_DIR.parent / "firebase_database_export.json",
        BASE_DIR / "data" / "firebase_database_export.json",
        Path.cwd() / "firebase_database_export.json",
    ]
    for json_path in candidate_paths:
        if json_path.exists():
            try:
                import json
                with open(json_path, "r", encoding="utf-8") as f:
                    full_json = json.load(f)
                    return full_json.get("devices", {}).get(device_id, {})
            except Exception as e:
                print(f"[Firebase] Error loading local device JSON {json_path}: {e}")
    return {}


def get_all_devices_data():
    try:
        ref = db.reference("devices")
        data = ref.get()
        if data and isinstance(data, dict) and len(data) > 0:
            return data
    except Exception as e:
        print(f"[Firebase] Error fetching live devices collection: {e}")

    # Fallback to local JSON export if Firebase fails
    candidate_paths = [
        BASE_DIR.parent / "firebase_database_export.json",
        BASE_DIR / "data" / "firebase_database_export.json",
        Path.cwd() / "firebase_database_export.json",
    ]
    for json_path in candidate_paths:
        if json_path.exists():
            try:
                import json
                with open(json_path, "r", encoding="utf-8") as f:
                    full_json = json.load(f)
                    devices = full_json.get("devices", {})
                    if devices:
                        return devices
            except Exception as e:
                print(f"[Firebase] Error loading local devices JSON {json_path}: {e}")

    return {}


def get_statewide_overview_data():
    try:
        ref = db.reference("statewide_overview")
        data = ref.get()
        if data and isinstance(data, dict) and len(data) > 0:
            return data
    except Exception as e:
        print(f"[Firebase] Error fetching live statewide_overview: {e}")

    # Fallback to local JSON export if Firebase fails
    candidate_paths = [
        BASE_DIR.parent / "firebase_database_export.json",
        BASE_DIR / "data" / "firebase_database_export.json",
        Path.cwd() / "firebase_database_export.json",
    ]
    for json_path in candidate_paths:
        if json_path.exists():
            try:
                import json
                with open(json_path, "r", encoding="utf-8") as f:
                    full_json = json.load(f)
                    if "statewide_overview" in full_json and isinstance(full_json["statewide_overview"], dict):
                        return full_json["statewide_overview"]
                    return full_json
            except Exception as e:
                print(f"[Firebase] Error loading local overview JSON {json_path}: {e}")

    return {}


def get_reports_and_analytics_data():
    try:
        ref = db.reference("reports_and_analytics")
        data = ref.get()
        if data and isinstance(data, dict) and len(data) > 0:
            return data
    except Exception as e:
        print(f"[Firebase] Error fetching live reports_and_analytics: {e}")

    candidate_paths = [
        BASE_DIR.parent / "firebase_database_export.json",
        BASE_DIR / "data" / "firebase_database_export.json",
        Path.cwd() / "firebase_database_export.json",
    ]
    for json_path in candidate_paths:
        if json_path.exists():
            try:
                import json
                with open(json_path, "r", encoding="utf-8") as f:
                    full_json = json.load(f)
                    if "reports_and_analytics" in full_json and isinstance(full_json["reports_and_analytics"], dict):
                        return full_json["reports_and_analytics"]
            except Exception as e:
                print(f"[Firebase] Error loading local reports_and_analytics JSON {json_path}: {e}")

    return {}

