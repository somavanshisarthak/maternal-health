from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.doctor import DoctorCreate, DoctorOut, Token
from app.models.doctor import Doctor
from app.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.logger import logger

router = APIRouter()

@router.post("/register", response_model=DoctorOut)
def register_doctor(doctor_in: DoctorCreate, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.email == doctor_in.email).first()
    if doctor:
        logger.warning(f"Registration failed: Email already registered ({doctor_in.email})")
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_pwd = get_password_hash(doctor_in.password)
    new_doctor = Doctor(
        name=doctor_in.name,
        email=doctor_in.email,
        password_hash=hashed_pwd
    )
    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)
    logger.info(f"Doctor registered successfully: {new_doctor.email}")
    return new_doctor

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.email == form_data.username).first()
    if not doctor or not verify_password(form_data.password, doctor.password_hash):
        logger.warning(f"Failed login attempt for: {form_data.username}")
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        
    access_token = create_access_token(subject=doctor.id)
    logger.info(f"Doctor logged in successfully: {form_data.username}")
    return {"access_token": access_token, "token_type": "bearer"}
