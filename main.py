from fastapi import FastAPI
app = FastAPI()

@app.post("/send_alert")
async def send_alert():
    # Logic to send alert to emergency contacts
    return {"message": "Emergency alert sent!"}
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
@app.get("/get_hospitals")
async def get_hospitals():
    return [
        {"name": "City Hospital", "contact": "+123456789"},
        {"name": "Metro Care Clinic", "contact": "+987654321"},
        {"name": "Green Valley Hospital", "contact": "+1122334455"},
        {"name": "Sunrise Medical Center", "contact": "+2233445566"},
    ]

@app.get("/get_medications")
async def get_medications():
    return [
        { "name": "Diabetes", "advice": "Maintain a healthy diet and regular exercise.", "medications": ["Metformin", "Insulin", "Glipizide"] },
        { "name": "Hypertension", "advice": "Reduce salt intake, exercise, and manage stress.", "medications": ["Lisinopril", "Amlodipine", "Losartan"] },
        { "name": "Flu", "advice": "Drink fluids, rest, and take antiviral medications if needed.", "medications": ["Oseltamivir", "Zanamivir", "Acetaminophen"] },
        { "name": "Asthma", "advice": "Avoid triggers and use inhalers as prescribed.", "medications": ["Albuterol", "Fluticasone", "Budesonide"] }
    ]
