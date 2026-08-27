from website.services.firebase import get_device_data


def get_dashboard_data(device_id: str):
    return get_device_data(device_id)