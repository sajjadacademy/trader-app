from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, admin, trade
from database import engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Private Practice Trading App")

# CORS
origins = [
    "*", # Allow all for production/mobile simplicity
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(admin.router)
app.include_router(trade.router)

@app.get("/")
def read_root():
    return {"message": "Private Practice Trading API is running"}
