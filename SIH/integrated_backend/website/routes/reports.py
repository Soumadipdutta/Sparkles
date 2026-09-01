from fastapi import APIRouter
from pydantic import BaseModel
from fastapi.responses import StreamingResponse

from website.risk_services.health_risks import check_health_risk
from website.services.sms_service import send_sms
from website.services.report_service import (
    get_report_summary,
    get_contaminants,
    get_trends,
    get_heatmap,
    get_recent_reports,
)
from website.services.report_download_service import generate_water_quality_report

router = APIRouter()


class HealthParameter(BaseModel):
    parameter: str
    value: float


class AwarenessRequest(BaseModel):
    phone_number: str
    parameter: str
    value: float


@router.post("/health-risk")
def health_risk(data: HealthParameter):
    return check_health_risk(data.parameter, data.value)


@router.post("/awareness/send")
def send_awareness(data: AwarenessRequest):
    risk_result = check_health_risk(data.parameter, data.value)

    if not risk_result.get("alert"):
        return {
            "success": True,
            "sms_sent": False,
            "message": "No health risk detected. SMS was not sent.",
        }

    message = (
        f"Health Alert: {data.parameter.upper()} has crossed the safe threshold.\n\n"
        f"Current value: {data.value} {risk_result['unit']}\n"
        f"Safe threshold: {risk_result['safe_threshold']} {risk_result['unit']}\n\n"
        f"Please take necessary precautions."
    )

    sms_result = send_sms(data.phone_number, message)

    return {
        "success": True,
        "sms_sent": sms_result["success"],
        "risk": risk_result,
        "sms": sms_result,
    }


@router.get("/reports/summary")
def report_summary():
    return get_report_summary()


@router.get("/reports/contaminants")
def report_contaminants():
    return get_contaminants()


@router.get("/reports/trends")
def report_trends():
    return get_trends()


@router.get("/reports/heatmap")
def report_heatmap():
    return get_heatmap()


@router.get("/reports/download")
def download_report(
    report_type: str = "Water Quality Summary",
    time_range: str = "Last 7 Days",
    start_date: str = "",
    end_date: str = "",
    data_source: str = "All Sources",
):
    summary_result = get_report_summary()
    contaminants_result = get_contaminants()
    trends_result = get_trends()
    heatmap_result = get_heatmap()

    pdf = generate_water_quality_report(
        summary=summary_result["data"],
        contaminants=contaminants_result["data"],
        trends=trends_result["data"],
        heatmap=heatmap_result["data"],
        report_type=report_type,
        time_range=time_range,
        start_date=start_date,
        end_date=end_date,
        data_source=data_source,
    )

    return StreamingResponse(
        pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "attachment; filename=toyam_water_quality_report.pdf"
        },
    )


@router.get("/reports/recent")
def recent_reports():
    return {
        "success": True,
        "data": get_recent_reports(),
    }
