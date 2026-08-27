from fastapi import FastAPI
from pydantic import BaseModel

from risk_services.health_risks import check_health_risk
from services.sms_service import send_sms

app = FastAPI()


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
