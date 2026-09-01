from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from website.routes import dashboard, settings, reports

app = FastAPI()

app.include_router(dashboard.router, prefix="/api")
app.include_router(settings.router, prefix="/api")
app.include_router(reports.router, prefix="/api")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def root():
    return {"message": "Smart Water System API"}