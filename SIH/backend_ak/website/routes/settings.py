from fastapi import APIRouter
from website.schemas.settings import SettingsData, SettingsUpdateRequest
from website.services.settings import get_settings_data, update_settings_data, trigger_backup

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
