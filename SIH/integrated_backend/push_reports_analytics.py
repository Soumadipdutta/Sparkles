import json
import os
from pathlib import Path
import firebase_admin
from firebase_admin import credentials, db

reports_and_analytics_dict = {
    "summary": {
        "total_samples": 184320,
        "compliance_percentage": 94.2,
        "heavy_metal_spikes": 18,
        "safe_litres_dispensed": "1,482,900 L",
        "online_plants": "42/45",
        "total_plants": 45,
        "normal_plants": 42
    },
    "removal_efficiency": [
        { "day": "Day 01", "dhanbad": 82, "bokaro": 96, "chaibasa": 98 },
        { "day": "Day 04", "dhanbad": 85, "bokaro": 96.5, "chaibasa": 98.2 },
        { "day": "Day 07", "dhanbad": 88, "bokaro": 97, "chaibasa": 98.4 },
        { "day": "Day 10", "dhanbad": 91, "bokaro": 97.2, "chaibasa": 98.6 },
        { "day": "Day 14", "dhanbad": 94, "bokaro": 97.6, "chaibasa": 98.8, "spike": 94 },
        { "day": "Day 17", "dhanbad": 95, "bokaro": 97.8, "chaibasa": 99 },
        { "day": "Day 21", "dhanbad": 96.5, "bokaro": 98.4, "chaibasa": 99.1, "spike2": 96.5 },
        { "day": "Day 24", "dhanbad": 97.5, "bokaro": 98.9, "chaibasa": 99.3 },
        { "day": "Day 27", "dhanbad": 98.5, "bokaro": 99.3, "chaibasa": 99.5 },
        { "day": "Day 30", "dhanbad": 99.4, "bokaro": 99.6, "chaibasa": 99.7 }
    ],
    "audit_meta": {
        "scada_engine": "v3.4.1",
        "algorithm": "SHA-256 / RSA-4096",
        "digital_token": "JSPCB-CERT-2026-88410",
        "module": "DWSD-REP-2026-Q3",
        "officer": {
            "name": "Er. R. K. Mahato, M.Tech",
            "title": "Chief executive engineer, PHED Ranchi HQ",
            "initials": "RM"
        }
    },
    "standards": {
        "bis": {
            "code": "BIS 10500:2012",
            "label": "BIS 10500:2012 compliant runtime",
            "lead_cutoff": 0.010
        },
        "who": {
            "code": "WHO 2017 Guidelines",
            "label": "WHO Guidelines 2017 compliant runtime",
            "lead_cutoff": 0.010
        }
    }
}

target_files = [
    r"c:\Users\abhin\Downloads\Sparkles\SIH\integrated_backend\firebase_database_export.json",
    r"c:\Users\abhin\Downloads\Sparkles\SIH\integrated_backend\website\data\firebase_database_export.json"
]

for file_path in target_files:
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        data["reports_and_analytics"] = reports_and_analytics_dict

        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        print(f"Updated local file {file_path} with reports_and_analytics node.")

key_path = r"c:\Users\abhin\Downloads\Sparkles\SIH\integrated_backend\serviceAccountKey.json"
if os.path.exists(key_path):
    cred = credentials.Certificate(key_path)
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred, {
            "databaseURL": "https://smart-water-system-sih-default-rtdb.asia-southeast1.firebasedatabase.app/"
        })

    print("Pushing reports_and_analytics to live Firebase RTDB...")
    db.reference("reports_and_analytics").set(reports_and_analytics_dict)
    print("Successfully synchronized reports_and_analytics across local JSON exports & live Firebase RTDB!")
