import json
import os
import firebase_admin
from firebase_admin import credentials, db

key_path = r"c:\Users\abhin\Downloads\Sparkles\SIH\integrated_backend\serviceAccountKey.json"
cred = credentials.Certificate(key_path)
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred, {
        "databaseURL": "https://smart-water-system-sih-default-rtdb.asia-southeast1.firebasedatabase.app/"
    })

with open(r"c:\Users\abhin\Downloads\Sparkles\SIH\integrated_backend\firebase_database_export.json", "r", encoding="utf-8") as f:
    full_data = json.load(f)

print("Pushing updated statewide_overview to live Firebase RTDB...")
db.reference("statewide_overview").set(full_data["statewide_overview"])
print("Pushed statewide_overview to RTDB!")
