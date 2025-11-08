from pydantic import BaseModel
from typing import Optional

class CandidiateCreate(BaseModel):
    fullName:str
    email:str
    password:str

class CandidiateLogin(BaseModel):
    email:str
    password:str
    keepLoggedIn: Optional[bool] = False

class EmployersCreate(BaseModel):
    companyName:str
    email:str
    password:str

class EmployersLogin(BaseModel):
    email:str
    password:str
    keepLoggedIn: Optional[bool] = False