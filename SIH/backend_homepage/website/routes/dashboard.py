from fastapi import APIRouter
from website.services.dashboard import get_dashboard_data

router = APIRouter()


@router.get("/dashboard")
def get_dashboard():
    return get_dashboard_data("device_001")