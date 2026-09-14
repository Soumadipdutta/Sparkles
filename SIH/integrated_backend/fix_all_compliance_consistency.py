import json
import os
import firebase_admin
from firebase_admin import credentials, db

target_files = [
    r"c:\Users\abhin\Downloads\Sparkles\SIH\integrated_backend\firebase_database_export.json",
    r"c:\Users\abhin\Downloads\Sparkles\SIH\integrated_backend\website\data\firebase_database_export.json"
]

for file_path in target_files:
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Fix statewide_overview kpis
        if "statewide_overview" in data and "kpis" in data["statewide_overview"]:
            kpis = data["statewide_overview"]["kpis"]
            if isinstance(kpis, list):
                for k in kpis:
                    if isinstance(k, dict) and k.get("key") == "compliance":
                        k["value"] = "94.2"
            elif isinstance(kpis, dict):
                if "compliance" in kpis:
                    kpis["compliance"]["value"] = "94.2"

        # Fix reports_and_analytics summary
        if "reports_and_analytics" in data and "summary" in data["reports_and_analytics"]:
            data["reports_and_analytics"]["summary"]["compliance_percentage"] = 94.2

        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        print(f"Fixed compliance consistency in {file_path}")

key_path = r"c:\Users\abhin\Downloads\Sparkles\SIH\integrated_backend\serviceAccountKey.json"
if os.path.exists(key_path):
    cred = credentials.Certificate(key_path)
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred, {
            "databaseURL": "https://smart-water-system-sih-default-rtdb.asia-southeast1.firebasedatabase.app/"
        })

    # Read live statewide_overview/kpis and update compliance item
    ref_so = db.reference("statewide_overview/kpis")
    live_kpis = ref_so.get()
    if isinstance(live_kpis, list):
        for k in live_kpis:
            if isinstance(k, dict) and k.get("key") == "compliance":
                k["value"] = "94.2"
        ref_so.set(live_kpis)
    elif isinstance(live_kpis, dict):
        db.reference("statewide_overview/kpis/compliance/value").set("94.2")

    # Update reports_and_analytics summary
    db.reference("reports_and_analytics/summary/compliance_percentage").set(94.2)
    print("Successfully synchronized 94.2% compliance index across live Firebase RTDB!")
