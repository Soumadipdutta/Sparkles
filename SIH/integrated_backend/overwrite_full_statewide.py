import json
import os
import firebase_admin
from firebase_admin import credentials, db

key_path = r"c:\Users\abhin\Downloads\Sparkles\SIH\integrated_backend\serviceAccountKey.json"
if os.path.exists(key_path):
    cred = credentials.Certificate(key_path)
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred, {
            "databaseURL": "https://smart-water-system-sih-default-rtdb.asia-southeast1.firebasedatabase.app/"
        })

statewide_overview_dict = {
    "system_status": {
        "scada_cluster": "JH-EAST-CENTRAL",
        "sync_timestamp": "14:32:08 IST",
        "surveillance_status": "MINING SECTOR RUNOFF SURVEILLANCE ACTIVE",
        "validation_status": "IS-10500 AUTO-VALIDATED",
        "department": "Jharkhand Drinking Water and Sanitation Department",
        "central_dispatch_phone": "1800-345-6789",
        "scada_engine_version": "v3.4.1"
    },
    "kpis": {
        "water": {"key": "water", "label": "Total Clean Water Dispensed", "value": "1,482,900", "unit": "L", "baseline_comparison": "+8.4% vs 30d baseline"},
        "units": {"key": "units", "label": "Purification Units", "value": "42/45", "unit": "ONLINE", "in_maintenance_count": 3, "maintenance_districts": ["Dhanbad Mining Belt", "Ramgarh", "Hazaribagh"]},
        "population": {"key": "population", "label": "Population Protected", "value": "384,200", "unit": "SOULS", "districts_count": 14, "district_types": "Mining & Rural Districts"},
        "compliance": {"key": "compliance", "label": "Overall Compliance", "value": "94.2", "unit": "% INDEX", "compliance_standard": "BIS IS 10500 Compliant"},
        "incursions": {"key": "incursions", "label": "Incursions Blocked", "value": "18", "unit": "EVENTS", "status_badge": "AUTO-CUTOFF ENGAGED"}
    },
    "status_counts": {
        "all": 45,
        "normal": 40,
        "alert": 2,
        "cutoff": 3
    },
    "heavy_metal_contaminants": {
        "pb": {"key": "pb", "label": "LEAD (PB)", "ceiling": 0.01, "value": 0.018, "axisMax": 0.025, "tone": "#ffb4ab", "icon_name": "AlertTriangle", "note": "+80% above safe limit"},
        "as": {"key": "as", "label": "ARSENIC (AS)", "ceiling": 0.01, "value": 0.004, "axisMax": 0.015, "tone": "#4edea3", "icon_name": "CheckCircle2", "note": "Safe parameters"},
        "f": {"key": "f", "label": "FLUORIDE (F-)", "ceiling": 1.0, "value": 0.82, "axisMax": 1.25, "tone": "#7bd0ff", "icon_name": "Info", "note": "Elevated in Palamu belt"},
        "cr": {"key": "cr", "label": "CHROMIUM (CR+6)", "ceiling": 0.05, "value": 0.012, "axisMax": 0.07, "tone": "#4edea3", "icon_name": "CheckCircle2", "note": "Trace levels only"},
        "fe": {"key": "fe", "label": "IRON (FE)", "ceiling": 0.3, "value": 0.34, "axisMax": 0.5, "tone": "#7bd0ff", "icon_name": "Wrench", "note": "Filtration backwash req."}
    }
}

print("Setting statewide_overview/kpis in Firebase RTDB...")
db.reference("statewide_overview/kpis").set(statewide_overview_dict["kpis"])
print("Successfully set statewide_overview kpis!")
