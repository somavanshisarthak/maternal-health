from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base

class SurveyResponse(Base):
    __tablename__ = "survey_responses"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    weight = Column(String)  # stored as string to allow text ranges, or parse it to float if needed later
    blood_pressure = Column(String)
    sugar_level = Column(String)
    symptoms = Column(String) # JSON-like string
    risk_level = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
