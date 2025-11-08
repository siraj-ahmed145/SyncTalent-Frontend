from backend.models import Candidiate 
from backend.database import Base,engine,get_db
from fastapi import FastAPI,HTTPException,Depends
from backend import schemas,models
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from backend.route_candidiate.candidiate_signup import router as candidiate_router
from backend.route_employers.employers_signup import router as employers_router
app = FastAPI()

origins=[
    "http://localhost:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
Base.metadata.create_all(bind=engine)
app.include_router(candidiate_router)
app.include_router(employers_router)