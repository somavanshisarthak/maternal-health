from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import get_current_doctor
from app.core.logger import logger
from app.database import get_db
from app.models.patient import Patient
from app.models.survey import SurveyResponse
from app.schemas.patient import PatientCreate, PatientOut, PatientWithLatestRisk

router = APIRouter()


@router.post("", response_model=PatientOut)
def create_patient(
    patient_in: PatientCreate,
    db: Session = Depends(get_db),
    current_doctor=Depends(get_current_doctor),
):
    patient = Patient(**patient_in.model_dump())
    db.add(patient)
    db.commit()
    db.refresh(patient)
    logger.info(
        f"New patient created: ID {patient.id} ({patient.name}) "
        f"by Doctor ID {current_doctor.id}",
    )
    return patient


@router.get("", response_model=List[PatientOut])
def get_patients(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_doctor=Depends(get_current_doctor),
):
    patients = db.query(Patient).offset(skip).limit(limit).all()
    return patients


@router.get("/with-latest", response_model=List[PatientWithLatestRisk])
def get_patients_with_latest_risk(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_doctor=Depends(get_current_doctor),
):
    """
    Return patients along with their latest survey risk snapshot.

    This is optimized for the doctor dashboard grid to show:
    - latest_risk_level
    - latest_survey_at
    - latest_blood_pressure
    - latest_sugar_level
    """
    # Subquery to get the latest survey timestamp per patient
    latest_subq = (
        db.query(
            SurveyResponse.patient_id.label("patient_id"),
            func.max(SurveyResponse.created_at).label("max_created_at"),
        )
        .group_by(SurveyResponse.patient_id)
        .subquery()
    )

    # Join patients with their latest survey record, if any
    query = (
        db.query(Patient, SurveyResponse)
        .outerjoin(
            latest_subq,
            Patient.id == latest_subq.c.patient_id,
        )
        .outerjoin(
            SurveyResponse,
            (SurveyResponse.patient_id == latest_subq.c.patient_id)
            & (SurveyResponse.created_at == latest_subq.c.max_created_at),
        )
        .offset(skip)
        .limit(limit)
    )

    results: List[PatientWithLatestRisk] = []
    for patient, survey in query.all():
        results.append(
            PatientWithLatestRisk(
                id=patient.id,
                name=patient.name,
                age=patient.age,
                pregnancy_week=patient.pregnancy_week,
                village=patient.village,
                latest_risk_level=getattr(survey, "risk_level", None),
                latest_survey_at=getattr(survey, "created_at", None),
                latest_blood_pressure=getattr(survey, "blood_pressure", None),
                latest_sugar_level=getattr(survey, "sugar_level", None),
            ),
        )

    return results


@router.get("/{patient_id}", response_model=PatientOut)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_doctor=Depends(get_current_doctor),
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient
