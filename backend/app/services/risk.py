from core.logger import logger

def predict_risk(patient_data: dict) -> str:
    """
    ML-ready function for evaluating patient risk.
    Currently uses rule-based logic but can be swapped for a joblib scikit-learn model.
    Expected dict structure matching patient vitals.
    
    Returns:
    - "Green": normal vitals
    - "Yellow": moderate abnormal values
    - "Red": critical values
    """
    symptoms_str = patient_data.get("symptoms", "")
    blood_pressure = patient_data.get("blood_pressure", "")
    
    symptoms_list = [s.strip().lower() for s in symptoms_str.split(",")] if symptoms_str else []
    
    critical_symptoms = ["severe headache", "blurred vision", "heavy bleeding"]
    moderate_symptoms = ["fever", "mild swelling", "nausea"]
    
    logger.info(f"Evaluating risk for patient data: BP={blood_pressure}, Symptoms={symptoms_list}")
    
    # Check for Red condition
    if any(s in symptoms_list for s in critical_symptoms):
        logger.info("Risk Level Evaluated: Red (Critical Symptoms Detected)")
        return "Red"
        
    # Check Blood Pressure
    try:
        if "/" in blood_pressure:
            sys, dia = map(int, blood_pressure.split("/"))
            if sys >= 160 or dia >= 110:
                logger.info("Risk Level Evaluated: Red (Critical BP Detected)")
                return "Red"
            elif sys >= 140 or dia >= 90:
                logger.info("Risk Level Evaluated: Yellow (Elevated BP Detected)")
                return "Yellow"
    except Exception as e:
        logger.warning(f"Failed to parse blood pressure '{blood_pressure}': {e}")
        
    if any(s in symptoms_list for s in moderate_symptoms):
        logger.info("Risk Level Evaluated: Yellow (Moderate Symptoms Detected)")
        return "Yellow"
        
    logger.info("Risk Level Evaluated: Green (Normal Vitals)")
    return "Green"

