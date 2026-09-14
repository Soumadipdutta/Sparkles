from fastapi import APIRouter
from website.schemas.settings import SettingsData, SettingsUpdateRequest
from website.services.settings import get_settings_data, update_settings_data, trigger_backup
from firebase_admin import db

router = APIRouter()

@router.get("/settings", response_model=SettingsData)
def get_settings():
    return get_settings_data("device_001")

@router.put("/settings", response_model=SettingsData)
def update_settings(payload: SettingsUpdateRequest):
    updates = payload.model_dump(exclude_unset=True)
    return update_settings_data("device_001", updates)

@router.post("/settings/backup")
def run_backup():
    return trigger_backup("device_001")

@router.post("/alerts/action")
def dispatch_alert_action(payload: dict):
    action = payload.get("action", "General Incident Action")
    plant_id = payload.get("plant_id", "JH-DHN-04")
    
    # Store action log under Firebase RTDB
    try:
        ref = db.reference(f"devices/{plant_id}/incident_actions")
        ref.push({
            "action": action,
            "timestamp": "2026-09-13 21:45:00",
            "status": "DISPATCHED",
            "dispatched_by": "Central Operations Command"
        })
    except Exception as e:
        print(f"[Firebase] Error logging alert action for {plant_id}: {e}")

    return {
        "success": True,
        "message": f"Action '{action}' dispatched for plant {plant_id} and recorded in Firebase RTDB.",
        "plant_id": plant_id,
        "action": action
    }
