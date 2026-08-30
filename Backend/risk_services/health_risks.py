import json
from pathlib import Path

# Get the path to health_risks.json
DATA_PATH = Path(__file__).parent.parent / "data" / "health_risks.json"

with open(DATA_PATH, "r", encoding="utf-8") as file:
    HEALTH_DATA = json.load(file)


def check_health_risk(parameter, value):
    parameter = parameter.lower()

    # Check whether parameter exists
    if parameter not in HEALTH_DATA:
        return {
            "success": False,
            "message": f"Unknown parameter: {parameter}"
        }

    data = HEALTH_DATA[parameter]
    threshold = data["safe_threshold"]

    # Safe condition
    if value <= threshold:
        return {
            "success": True,
            "alert": False,
            "parameter": parameter,
            "value": value,
            "unit": data["unit"],
            "safe_threshold": threshold,
            "message": "Parameter is within the safe range."
        }

    # Threshold crossed
    return {
        "success": True,
        "alert": True,
        "parameter": parameter,
        "value": value,
        "unit": data["unit"],
        "safe_threshold": threshold,
        "message": "Parameter has crossed the safe threshold."
    }