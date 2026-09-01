from pydantic import BaseModel
from typing import List, Optional

class SystemInfoSettings(BaseModel):
    system_name: str
    village: str
    system_id: str
    firmware_version: str
    last_maintenance: str

class DisplayPreferences(BaseModel):
    language: str
    theme: str
    date_format: str
    time_format: str
    refresh_interval: str

class MeasurementUnits(BaseModel):
    ph: str
    turbidity: str
    tds: str
    arsenic_metals: str
    temperature: str

class AlertSettings(BaseModel):
    critical_alerts: bool
    warning_alerts: bool
    info_alerts: bool
    maintenance_alerts: bool

class ThresholdItem(BaseModel):
    id: str
    param: str
    safe: str
    warn: str
    crit: str
    unit: str

class UserProfile(BaseModel):
    name: str
    email: str
    role: str
    phone: str

class BackupInfo(BaseModel):
    last_backup: str
    status: str

class SettingsData(BaseModel):
    system_info: SystemInfoSettings
    display_preferences: DisplayPreferences
    measurement_units: MeasurementUnits
    alert_settings: AlertSettings
    thresholds: List[ThresholdItem]
    user_profile: UserProfile
    backup_info: BackupInfo

class SettingsUpdateRequest(BaseModel):
    display_preferences: Optional[DisplayPreferences] = None
    measurement_units: Optional[MeasurementUnits] = None
    alert_settings: Optional[AlertSettings] = None
    thresholds: Optional[List[ThresholdItem]] = None
    user_profile: Optional[UserProfile] = None
