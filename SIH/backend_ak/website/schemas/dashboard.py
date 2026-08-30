from pydantic import BaseModel
from typing import List


# device details:

class SystemInfo(BaseModel):
    online: bool
    last_updated: str
    quick_status: str

class DeviceInfo(BaseModel):
    name: str
    village: str
    water_source: str          # could be groundwater or surface_water


# pH, turbidity, tds, temp:

class WaterSafety(BaseModel):
    score: float
    status: str
    change_from_yesterday: float

class WaterQuality(BaseModel):
    ph: float
    turbidity: float
    tds: float
    temperature: float


# contaminants:

class Contaminant(BaseModel):
    value: float
    unit: str | None = None
    status: str
    reference_limit: float | None = None

class Contaminants(BaseModel):
    arsenic: Contaminant
    lead: Contaminant
    iron: Contaminant
    manganese: Contaminant
    chromium: Contaminant
    heavy_metal_index: Contaminant


# filters:

class FilterStatus(BaseModel):
    health: float
    status: str

class Filters(BaseModel):
    sediment: FilterStatus
    carbon: FilterStatus
    uf_ro: FilterStatus


# purification:

class PurificationStage(BaseModel):
    status: str

class PurificationStages(BaseModel):
    source: PurificationStage
    sediment: PurificationStage
    carbon: PurificationStage
    uf_ro: PurificationStage
    uv: PurificationStage
    clean_water: PurificationStage

class Purification(BaseModel):
    stages: PurificationStages


# graphs and trends:

class TrendPoint(BaseModel):
    timestamp: str
    ph: float
    turbidity: float
    tds: float
    temperature: float

class Trends(BaseModel):
    last_24h: List[TrendPoint]
    last_7d: List[TrendPoint]
    last_30d: List[TrendPoint]


# alerts:

class Alert(BaseModel):
    title: str
    timestamp: str
    type: str
    status: str

class Alerts(BaseModel):
    recent: List[Alert]


# water risk awareness (just the low / high):

class RiskFinding(BaseModel):
    name: str
    status: str

class RiskAwareness(BaseModel):
    risk_level: str
    summary: str
    key_findings: List[RiskFinding]


# full dashboard response:

class DashboardResponse(BaseModel):
    system: SystemInfo
    info: DeviceInfo
    water_safety: WaterSafety
    water_quality: WaterQuality
    contaminants: Contaminants
    purification: Purification
    filters: Filters
    trends: Trends
    alerts: Alerts
    risk_awareness: RiskAwareness