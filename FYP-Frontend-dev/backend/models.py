from sqlalchemy import Column ,Integer,String
from .database import Base

class Candidiate(Base):
    __tablename__="candidiates"

    id=Column(Integer,primary_key=True,index=True)
    fullName=Column(String)
    email=Column(String,unique=True,index=True)
    password=Column(String)

class Employers(Base):
    __tablename__="employers"

    id=Column(Integer,primary_key=True,index=True)
    companyName=Column(String)
    email=Column(String,unique=True,index=True)
    password=Column(String)