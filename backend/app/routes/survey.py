from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.logger import logger
from app.database import get_db
from app.models.patient import Patient
from app.models.survey import SurveyResponse
from app.schemas.survey import SurveyCreate, SurveyOut
from app.services.risk import predict_risk

router = APIRouter()


@router.post("", response_model=SurveyOut)
def create_survey(
    survey_in: SurveyCreate,
    db: Session = Depends(get_db),
):
    # Verify patient exists
    patient = db.query(Patient).filter(Patient.id == survey_in.patient_id).first()
    if not patient:
        logger.warning(
            f"Survey submission failed: Patient ID {survey_in.patient_id} not found",
        )
        raise HTTPException(status_code=404, detail="Patient not found")

    survey_data = survey_in.model_dump()
    risk_level = predict_risk(survey_data)

    survey = SurveyResponse(**survey_data, risk_level=risk_level)
    db.add(survey)
    db.commit()
    db.refresh(survey)

    logger.info(
        f"Survey submitted successfully for Patient ID {patient.id}. "
        f"Assigned Risk Level: {risk_level}",
    )
    return survey


@router.get("/patient/{patient_id}", response_model=List[SurveyOut])
def get_surveys_for_patient(
    patient_id: int,
    db: Session = Depends(get_db),
):
    """
    Return all survey responses for a given patient ordered from oldest to newest.
    This powers the doctor's patient detail charts.
    """
    surveys = (
        db.query(SurveyResponse)
        .filter(SurveyResponse.patient_id == patient_id)
        .order_by(SurveyResponse.created_at.asc())
        .all()
    )
    if not surveys:
        # 404 would be noisy in UI; return empty list instead
        logger.info(
            f"No survey history found for patient_id={patient_id}; returning empty list",
        )
    return surveys
