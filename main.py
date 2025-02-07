from fastapi import FastAPI

app = FastAPI()

@app.get("/get_profile")
async def get_profile():
    return {
        "name": "John Doe",
        "age": 65,
        "blood_group": "O+",
        "conditions": "Diabetes, Hypertension",
        "blood_pressure": "130/85 mmHg",
        "blood_sugar": "110 mg/dL",
        "last_visit": "January 25, 2025",
        "medications": "Metformin, Lisinopril",
        "emergency_contact": "Jane Doe (+1234567890)",
        "doctor_contact": "Dr. Smith (+9876543210)"
    }
