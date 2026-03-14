
# Maternal Health Monitoring System

This project is a full-stack maternal healthcare monitoring system designed for rural healthcare environments with unreliable connectivity.

The system is built using a Progressive Web App (PWA) architecture so it works as both:

• A patient-side mobile application  
• A doctor monitoring dashboard  

The backend exposes a FastAPI REST API.

---

# System Architecture

React PWA  
↓  
FastAPI Backend  
↓  
SQLite Database  
↓  
Future ML Prediction Model

---

# Backend Stack

FastAPI  
SQLAlchemy ORM  
SQLite database  
Alembic migrations  
JWT Authentication (PyJWT)  
Passlib bcrypt hashing  
Pydantic schemas  

API routes are versioned under:

/api/v1/

Endpoints include:

POST /api/v1/auth/register  
POST /api/v1/auth/login  

GET /api/v1/patients  
GET /api/v1/patients/{id}

POST /api/v1/survey

---

# Backend Structure

backend/app

main.py – FastAPI entrypoint  
database.py – DB connection  

models/
Doctor  
Patient  
SurveyResponse

schemas/
Pydantic request/response models

routes/
auth.py  
patients.py  
survey.py

services/
risk.py – rule-based risk prediction

core/
config.py  
security.py  
logger.py

---

# Risk Prediction Logic

Risk levels returned by backend:

Green → normal vitals  
Yellow → moderate abnormalities  
Red → critical conditions

This rule engine will later be replaced with a Scikit-Learn model.

---

# Frontend Stack

React  
TypeScript  
Vite  
vite-plugin-pwa  
TailwindCSS  
React Query  
Axios  
Dexie (IndexedDB)

---

# PWA Features

Installable on Android devices  
Offline caching via Workbox  
IndexedDB queue for offline submissions

NetworkFirst caching for API calls.

---

# IndexedDB Offline Queue

Dexie schema:

surveys

Used when:

navigator.onLine === false

Survey submissions are stored locally and synced later.

---

# Frontend Routes

/login  
/patient-survey  
/doctor-dashboard  
/patient-details/:id

---

# Layouts

AppLayout – used for mobile pages like survey and login  
DashboardLayout – used for doctor dashboard

---

# Patient Survey

Implemented with:

React Hook Form  
Zod validation  

Features:

• Vital entry  
• Symptom selection  
• Offline fallback storage  
• Local risk evaluation

Risk feedback displayed immediately with:

Green / Yellow / Red result cards.

---

# Next Features To Implement

Doctor Dashboard functionality:

• Patient list view  
• Risk color indicators  
• Filters (date, risk level, village)  
• Patient details page  
• Charts for vitals history

Offline Sync Manager:

• Background syncing of IndexedDB queue
• Retry logic
• Connectivity detection

Future AI Integration:

• Replace rule-based risk engine with ML model
• Add maternal health chat