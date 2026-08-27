from fastapi import FastAPI
from website.routes import dashboard

app = FastAPI()

app.include_router(dashboard.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Smart Water System API"}