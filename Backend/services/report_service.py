# services/report_service.py

import json
from pathlib import Path

DATA_FILE = Path("data/mock_water_data.json")


def load_data():
    with open(DATA_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def get_report_summary():
    return {
        "success": True,
        "data": {
            "overall_water_safety_score": 94,
            "tests_conducted": 1248,
            "alerts_triggered": 23,
            "data_uptime": 99.7
        }
    }


def get_contaminants():
    return {
        "success": True,
        "data": [
            {
                "parameter": "Arsenic",
                "value": 0.006,
                "unit": "mg/L",
                "safe_limit": 0.01,
                "status": "Safe"
            },
            {
                "parameter": "Lead",
                "value": 0.004,
                "unit": "mg/L",
                "safe_limit": 0.01,
                "status": "Safe"
            },
            {
                "parameter": "Iron",
                "value": 0.18,
                "unit": "mg/L",
                "safe_limit": 0.30,
                "status": "Safe"
            },
            {
                "parameter": "Manganese",
                "value": 0.08,
                "unit": "mg/L",
                "safe_limit": 0.10,
                "status": "Safe"
            },
            {
                "parameter": "Chromium",
                "value": 0.03,
                "unit": "mg/L",
                "safe_limit": 0.05,
                "status": "Safe"
            }
        ]
    }


def get_trends():
    return {
        "success": True,
        "data": {
            "pH": [
                {"time": "00:00", "value": 7.1},
                {"time": "04:00", "value": 7.2},
                {"time": "08:00", "value": 7.0},
                {"time": "12:00", "value": 7.3},
                {"time": "16:00", "value": 7.2},
                {"time": "20:00", "value": 7.1}
            ],
            "turbidity": [
                {"time": "00:00", "value": 2.1},
                {"time": "04:00", "value": 2.4},
                {"time": "08:00", "value": 2.0},
                {"time": "12:00", "value": 2.8},
                {"time": "16:00", "value": 2.3},
                {"time": "20:00", "value": 2.2}
            ],
            "tds": [
                {"time": "00:00", "value": 310},
                {"time": "04:00", "value": 315},
                {"time": "08:00", "value": 305},
                {"time": "12:00", "value": 320},
                {"time": "16:00", "value": 312},
                {"time": "20:00", "value": 308}
            ],
            "temperature": [
                {"time": "00:00", "value": 24.5},
                {"time": "04:00", "value": 24.0},
                {"time": "08:00", "value": 26.2},
                {"time": "12:00", "value": 29.1},
                {"time": "16:00", "value": 28.0},
                {"time": "20:00", "value": 25.8}
            ]
        }
    }


def get_heatmap():
    return {
        "success": True,
        "data": [
            {
                "date": "2026-08-24",
                "safe": 21,
                "warning": 2,
                "critical": 0
            },
            {
                "date": "2026-08-25",
                "safe": 20,
                "warning": 3,
                "critical": 1
            },
            {
                "date": "2026-08-26",
                "safe": 22,
                "warning": 1,
                "critical": 0
            },
            {
                "date": "2026-08-27",
                "safe": 19,
                "warning": 4,
                "critical": 1
            },
            {
                "date": "2026-08-28",
                "safe": 23,
                "warning": 0,
                "critical": 0
            }
        ]
    }


def get_recent_reports():
    return [
        {
            "id": 1,
            "name": "Weekly Water Quality Report",
            "date": "28 Aug 2026",
            "type": "Weekly",
            "status": "Generated"
        },
        {
            "id": 2,
            "name": "Water Safety Analysis",
            "date": "27 Aug 2026",
            "type": "Analysis",
            "status": "Generated"
        },
        {
            "id": 3,
            "name": "Monthly Water Quality Report",
            "date": "24 Aug 2026",
            "type": "Monthly",
            "status": "Generated"
        }
    ]