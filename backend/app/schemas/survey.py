from pydantic import BaseModel
from datetime import datetime

class SurveyCreate(BaseModel):
    patient_id: int
    weight: str
    blood_pressure: str
    sugar_level: str
    symptoms: str

class SurveyOut(SurveyCreate):
    id: int
    risk_level: str
    created_at: datetime

    class Config:
        from_attributes = True
