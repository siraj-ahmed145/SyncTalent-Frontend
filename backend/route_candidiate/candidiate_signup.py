from backend.models import Candidiate 
from backend.database import Base,engine,get_db
from fastapi import APIRouter,FastAPI,HTTPException,Depends
from backend import schemas,models
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/candidiate",
    tags=["Candidate"]
)
@router.post("/signup")
def signup(candidiate:schemas.CandidiateCreate,db: Session = Depends(get_db)):
    existingcandidiate=db.query(models.Candidiate).filter(models.Candidiate.email==candidiate.email).first()
    if existingcandidiate:
        raise HTTPException(status_code=400,detail="Email already exist")
    
    new_Candidiate=models.Candidiate(
        fullName=candidiate.fullName,
        email=candidiate.email,
        password=candidiate.password
    )

    db.add(new_Candidiate)
    db.commit()
    db.refresh(new_Candidiate)
    return {"message": "Candiddiate Signup Successful","candidiate_id":new_Candidiate.id}

@router.post("/login")
def login(candidiate:schemas.CandidiateLogin,db: Session = Depends(get_db)):
    logincandidiate=db.query(models.Candidiate).filter(models.Candidiate.email==candidiate.email).first()
    if not logincandidiate:
        raise HTTPException(status_code=404,detail="Candidiate not Found")

    if logincandidiate.password!=candidiate.password:
        raise HTTPException(status_code=401,detail="Invalid Password")
    
    return {"message":"Login Successful","candidiate_id":logincandidiate.id,"fullName":logincandidiate.fullName}