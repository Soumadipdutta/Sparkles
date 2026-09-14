import json
import os

target_files = [
    r"c:\Users\abhin\Downloads\Sparkles\SIH\integrated_backend\firebase_database_export.json",
    r"c:\Users\abhin\Downloads\Sparkles\SIH\integrated_backend\website\data\firebase_database_export.json"
]

for file_path in target_files:
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Fix statewide_overview kpis
        so = data.get("statewide_overview", {})
        kpis = so.get("kpis", [])
        if isinstance(kpis, list):
            for k in kpis:
                if isinstance(k, dict) and (k.get("key") == "compliance" or k.get("label") == "Overall Compliance"):
                    k["value"] = "94.2"
        elif isinstance(kpis, dict):
            for k_name, k_val in kpis.items():
                if isinstance(k_val, dict) and (k_val.get("key") == "compliance" or k_val.get("label") == "Overall Compliance"):
                    k_val["value"] = "94.2"

        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        print(f"Directly updated {file_path}")
