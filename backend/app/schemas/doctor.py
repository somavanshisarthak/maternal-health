from pydantic import BaseModel, EmailStr

class DoctorBase(BaseModel):
    name: str
    email: EmailStr

class DoctorCreate(DoctorBase):
    password: str

class DoctorLogin(BaseModel):
    email: EmailStr
    password: str

class DoctorOut(DoctorBase):
    id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
