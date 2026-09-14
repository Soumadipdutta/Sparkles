from fastapi import APIRouter
from website.services.dashboard import (
    get_dashboard_data,
    get_statewide_dashboard_data,
    get_analytics_summary_data,
    get_telemetry_logs_data,
    get_reports_and_analytics_full_data,
)
from website.services.telemetry_processor import preprocess_sensor_telemetry, save_processed_telemetry
from firebase_admin import db

router = APIRouter()

@router.get("/dashboard")
def get_dashboard(device_id: str = "JH-DHN-04"):
    return get_dashboard_data(device_id)


@router.get("/statewide-overview")
def get_statewide_overview():
    return get_statewide_dashboard_data()


@router.get("/reports-and-analytics")
def get_reports_and_analytics():
    return get_reports_and_analytics_full_data()


@router.post("/telemetry/ingest")
def ingest_telemetry(payload: dict):
    dev_id, processed_record = preprocess_sensor_telemetry(payload)
    save_processed_telemetry(dev_id, processed_record)
    return {
        "success": True,
        "message": f"Raw sensor telemetry preprocessed and stored for device {dev_id}",
        "device_id": dev_id,
        "processed_record": processed_record
    }


@router.post("/telemetry/log")
def append_telemetry_log(payload: dict):
    dev_id = payload.get("device_id", "JH-DHN-04")
    event = payload.get("event", "Manual Technician Log Entry")
    status = payload.get("status", "RECORDED")
    try:
        ref = db.reference(f"devices/{dev_id}/telemetry_logs")
        ref.push({
            "event": event,
            "status": status,
            "timestamp": "2026-09-13 21:45:00"
        })
    except Exception as e:
        print(f"[Firebase] Error pushing telemetry log: {e}")

    return {
        "success": True,
        "message": f"Log entry recorded for device {dev_id}",
        "event": event
    }


@router.get("/dashboard/summary")
def get_analytics_summary():
    return get_analytics_summary_data()


@router.get("/dashboard/removal-efficiency")
def get_removal_efficiency():
    return {
        "success": True,
        "data": [
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
        ]
    }


@router.get("/logs/")
def get_telemetry_logs(page: int = 1, limit: int = 100):
    return get_telemetry_logs_data(page=page, limit=limit)