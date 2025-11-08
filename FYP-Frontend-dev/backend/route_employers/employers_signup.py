from backend.database import get_db
from backend.models import Employers
from fastapi import HTTPException,Depends,APIRouter
from backend import schemas,models
from sqlalchemy.orm import Session

router=APIRouter(
    prefix="/employer",tags=["Employers"]
    )

@router.post("/signup")
def signup(employer:schemas.EmployersCreate,db:Session=Depends(get_db)):
    existingEmployers=db.query(models.Employers).filter(models.Employers.email==employer.email).first()
    if existingEmployers:
        raise HTTPException(status_code=400,detail="Email already exist")
    
    newEmployers=models.Employers(
    companyName=employer.companyName,
    email=employer.email,
    password=employer.password
    )
    db.add(newEmployers)
    db.commit()
    db.refresh(newEmployers)
    return {"message":"Employer Signup Successful","employer_id":"employer.id"}

@router.post("/login")
def login(employer:schemas.EmployersLogin,db:Session =Depends(get_db)):
    loginemployer=db.query(models.Employers).filter(models.Employers.email==employer.email).first()

    if not loginemployer:
        raise HTTPException(status_code=404, detail="Employer not Exist")
    
    if loginemployer.password!=employer.password:
        raise HTTPException(status_code=401,detail="Invalid Password")
    
    return {"message":"Login Successful","employer_id":loginemployer.id,"Company Name":loginemployer.companyName}