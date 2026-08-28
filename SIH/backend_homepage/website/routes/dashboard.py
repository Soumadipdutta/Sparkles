from fastapi import APIRouter
from website.services.dashboard import get_dashboard_data
from website.schemas.dashboard import DashboardResponse

router = APIRouter()

@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard():
    return get_dashboard_data("device_001")