from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class PatientBase(BaseModel):
    name: str
    age: int
    pregnancy_week: int
    village: str


class PatientCreate(PatientBase):
    pass


class PatientOut(PatientBase):
    id: int

    class Config:
        from_attributes = True


class PatientWithLatestRisk(PatientOut):
    latest_risk_level: Optional[str] = None
    latest_survey_at: Optional[datetime] = None
    latest_blood_pressure: Optional[str] = None
    latest_sugar_level: Optional[str] = None
