from website.services.firebase import get_device_data


def get_dashboard_data(device_id: str):
    data = get_device_data(device_id)

    return {
        "system": data["system"],
        "info": data["info"],
        "water_safety": data["current"]["water_safety"],
        "water_quality": data["current"]["water_quality"]["purified"],
        "contaminants": data["current"]["contaminants"],
        "purification": data["purification"],
        "filters": data["filters"],
        "trends": {
            "last_24h": data["trends"]["24h"],
            "last_7d": [],                      # we'd have enough data to fill this later
            "last_30d": []                      # we'd have enough data to fill this later
        },
        "alerts": data["alerts"],
        "risk_awareness": data["risk_awareness"]
    }