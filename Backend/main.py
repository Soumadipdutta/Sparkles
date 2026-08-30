from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from risk_services.health_risks import check_health_risk
from services.sms_service import send_sms
from services.report_service import (get_report_summary, get_contaminants, get_trends, get_heatmap, get_recent_reports)
from fastapi.responses import StreamingResponse
from services.report_download_service import generate_water_quality_report
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HealthParameter(BaseModel):
    parameter: str
    value: float

class AwarenessRequest(BaseModel):
    phone_number: str
    parameter: str
    value: float

@app.post("/api/health-risk")
def health_risk(data: HealthParameter):
    return check_health_risk(data.parameter, data.value)


@app.post("/api/awareness/send")
def send_awareness(data: AwarenessRequest):

    # First check the health risk
    risk_result = check_health_risk(
        data.parameter,
        data.value
    )

    # Don't send SMS if there is no alert
    if not risk_result["alert"]:
        return {
            "success": True,
            "sms_sent": False,
            "message": "No health risk detected. SMS was not sent."
        }

    # Create awareness message
    message = (
        f"Health Alert: {data.parameter.upper()} has crossed "
        f"the safe threshold.\n\n"
        f"Current value: {data.value} {risk_result['unit']}\n"
        f"Safe threshold: {risk_result['safe_threshold']} "
        f"{risk_result['unit']}\n\n"
        f"Please take necessary precautions."
    )

    # Send SMS
    sms_result = send_sms(
        data.phone_number,
        message
    )

    return {
        "success": True,
        "sms_sent": sms_result["success"],
        "risk": risk_result,
        "sms": sms_result
    }

@app.get("/api/reports/summary")
def report_summary():
    return get_report_summary()


@app.get("/api/reports/contaminants")
def report_contaminants():
    return get_contaminants()


@app.get("/api/reports/trends")
def report_trends():
    return get_trends()


@app.get("/api/reports/heatmap")
def report_heatmap():
    return get_heatmap()

@app.get("/api/reports/download")
def download_report(
    report_type: str = "Water Quality Summary",
    time_range: str = "Last 7 Days",
    start_date: str = "",
    end_date: str = "",
    data_source: str = "All Sources"
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
            "Content-Disposition":
                "attachment; filename=toyam_water_quality_report.pdf"
        },
    )

@app.get("/api/reports/recent")
def recent_reports():
    return {
        "success": True,
        "data": get_recent_reports()
    }