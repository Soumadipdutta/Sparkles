import json
import os
import firebase_admin
from firebase_admin import credentials, db

kpis_array = [
    {"key": "water", "label": "Total Clean Water Dispensed", "value": "1,482,900", "unit": "L", "baseline_comparison": "+8.4% vs 30d baseline"},
    {"key": "units", "label": "Purification Units", "value": "42/45", "unit": "ONLINE", "in_maintenance_count": 3, "maintenance_districts": ["Dhanbad Mining Belt", "Ramgarh", "Hazaribagh"]},
    {"key": "population", "label": "Population Protected", "value": "384,200", "unit": "SOULS", "districts_count": 14, "district_types": "Mining & Rural Districts"},
    {"key": "compliance", "label": "Overall Compliance", "value": "94.2", "unit": "% INDEX", "compliance_standard": "BIS IS 10500 Compliant"},
    {"key": "incursions", "label": "Incursions Blocked", "value": "18", "unit": "EVENTS", "status_badge": "AUTO-CUTOFF ENGAGED"}
]

target_files = [
    r"c:\Users\abhin\Downloads\Sparkles\SIH\integrated_backend\firebase_database_export.json",
    r"c:\Users\abhin\Downloads\Sparkles\SIH\integrated_backend\website\data\firebase_database_export.json"
]

for file_path in target_files:
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        if "statewide_overview" in data:
            data["statewide_overview"]["kpis"] = kpis_array

        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        print(f"Updated kpis array in {file_path}")

key_path = r"c:\Users\abhin\Downloads\Sparkles\SIH\integrated_backend\serviceAccountKey.json"
if os.path.exists(key_path):
    cred = credentials.Certificate(key_path)
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred, {
            "databaseURL": "https://smart-water-system-sih-default-rtdb.asia-southeast1.firebasedatabase.app/"
        })

    db.reference("statewide_overview/kpis").set(kpis_array)
    print("Successfully set statewide_overview/kpis array in live Firebase RTDB!")
