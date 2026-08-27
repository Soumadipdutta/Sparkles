import firebase_admin
from firebase_admin import credentials, db


# Load Firebase service account credentials
cred = credentials.Certificate("serviceAccountKey.json")

# Initialize Firebase
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://smart-water-system-sih-default-rtdb.asia-southeast1.firebasedatabase.app/"
})


def get_device_data(device_id: str):
    ref = db.reference(f"devices/{device_id}")
    return ref.get()