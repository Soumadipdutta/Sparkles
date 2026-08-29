import os
from pathlib import Path
import firebase_admin
from firebase_admin import credentials, db

# Find serviceAccountKey.json dynamically across candidate locations
BASE_DIR = Path(__file__).resolve().parent.parent # website directory

key_candidates = [
    Path.cwd() / "serviceAccountKey.json",
    BASE_DIR / "serviceAccountKey.json",
    BASE_DIR.parent / "serviceAccountKey.json",
    Path.cwd() / "website" / "serviceAccountKey.json",
]

key_path = next((p for p in key_candidates if p.exists()), None)
if not key_path:
    raise FileNotFoundError(f"serviceAccountKey.json not found in candidate paths: {[str(p) for p in key_candidates]}")

cred = credentials.Certificate(str(key_path))

# Initialize Firebase
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://smart-water-system-sih-default-rtdb.asia-southeast1.firebasedatabase.app/"
})


def get_device_data(device_id: str):
    ref = db.reference(f"devices/{device_id}")
    return ref.get()