import firebase_admin
from firebase_admin import credentials, db

key_path = r"c:\Users\abhin\Downloads\Sparkles\SIH\integrated_backend\serviceAccountKey.json"
cred = credentials.Certificate(key_path)
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred, {
        "databaseURL": "https://smart-water-system-sih-default-rtdb.asia-southeast1.firebasedatabase.app/"
    })

db.reference("statewide_overview/kpis/0/value").set("94.2")
print("Set statewide_overview/kpis/0/value to 94.2 in live RTDB!")
