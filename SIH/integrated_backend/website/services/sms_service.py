def send_sms(phone_number: str, message: str):
    """
    Mock SMS service.
    This will later be replaced with MSG91.
    """

    print("\n========== SMS ==========")
    print(f"To: {phone_number}")
    print(f"Message:\n{message}")
    print("=========================\n")

    return {
        "success": True,
        "message": "SMS notification triggered successfully.",
        "recipient": phone_number
    }