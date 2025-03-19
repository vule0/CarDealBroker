# import uvicorn
import os
from fastapi import FastAPI, BackgroundTasks, HTTPException, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import sendgrid
from sendgrid.helpers.mail import Mail, Email, To, Content
from backend.database import SessionLocal
from dotenv import load_dotenv
from typing import Optional, List
from sqlalchemy.orm import Session

# Import database modules
from database import get_db, init_db, LeaseFormSubmission, SellFormSubmission, ConsultationFormSubmission, Deal, Demo

load_dotenv()

app = FastAPI()

# Initialize database on startup
@app.on_event("startup")
async def startup_db_client():
    init_db()

origins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://cardealbroker.netlify.app',
    'https://cardealbroker.com',
    'https://www.cardealbroker.com',
    'https://api.cardealbroker.com',
    'https://8jjm75j2.up.railway.app',
    ]
app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

class EmailRequest(BaseModel):
    formType: str
    firstName: str
    lastName: str
    email: str
    phoneNumber: str
    vehicleMake: str
    vehicleModel: str
    zipCode: str
    milesPerYear: str
    creditScore: str
    vin: str
    miles: str
    payoff: str
    condition: str
    twoKeys: Optional[bool] = None
    majorDamage: Optional[bool] = None

class SuccessResponse(BaseModel):
    status: str = "success"
    message: str
    data: Optional[dict] = None

class ErrorResponse(BaseModel):
    status: str = "error"
    message: str
    error: Optional[str] = None

class LeaseFormResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone_number: str
    vehicle_make: str
    vehicle_model: str
    zip_code: str
    miles_per_year: str
    credit_score: str
    
    class Config:
        orm_mode = True

class SellFormResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone_number: str
    vin: str
    miles: str
    payoff: str
    condition: str
    two_keys: bool
    major_damage: bool
    
    class Config:
        orm_mode = True

class ConsultationFormResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone_number: str
    zip_code: str
    
    class Config:
        orm_mode = True

class DealResponse(BaseModel):
    id: int
    make: str
    model: str
    year: int
    image_url: str
    lease_price: float
    term: int
    down_payment: float
    mileage: int
    msrp: float
    savings: Optional[float] = None
    tags: Optional[list[str]] = None
    description: Optional[str] = None
    
    class Config:
        orm_mode = True

class DemoResponse(BaseModel):
    id: int
    make: str
    model: str
    year: int
    image_url: str
    lease_price: float
    term: int
    down_payment: float
    mileage: int
    msrp: float
    savings: Optional[float] = None
    tags: Optional[list[str]] = None
    description: Optional[str] = None
    
    class Config:
        orm_mode = True

def send_email_sendgrid(email_data: EmailRequest):
    sg = sendgrid.SendGridAPIClient(api_key=os.getenv("SENDGRID_API_KEY"))
    from_email = Email(os.getenv("SENDGRID_FROM_EMAIL"))
    to_email = To(os.getenv("RECEIVER_EMAIL")) 
    subject = f"New {email_data.formType} Submission - {email_data.firstName} {email_data.lastName}"
    
    email_body = f"""
    Name: {email_data.firstName} {email_data.lastName}
    Email: {email_data.email}
    Phone: {email_data.phoneNumber}
    
    Form Type: {email_data.formType}
    """
    
    if email_data.formType.lower() == "lease form":
        email_body += f"""
    Vehicle Make: {email_data.vehicleMake}
    Vehicle Model: {email_data.vehicleModel}
    Zip Code: {email_data.zipCode}
    Miles per Year: {email_data.milesPerYear}
    Credit Score: {email_data.creditScore}
    """

    if email_data.formType.lower() == "sell form":
        email_body += f"""
    VIN: {email_data.vin}
    Miles: {email_data.miles}
    Payoff Amount: {email_data.payoff}
    Condition: {email_data.condition}
    Two Keys: {'Yes' if email_data.twoKeys else 'No'}
    Major Damage: {'Yes' if email_data.majorDamage else 'No'}
    """
    
    if email_data.formType.lower() == "consultation form":
        email_body += f"""
    Zip Code: {email_data.zipCode}
    """
    
    content = Content("text/plain", email_body)

    mail = Mail(from_email, to_email, subject, content)

    try:
        response = sg.send(mail)
        if response.status_code == 202:
            print(f"Email sent successfully with status code {response.status_code}")
            return True
        else:
            print(f"Failed to send email with status code {response.status_code}")
            return False
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

# Save form data to database
def save_form_to_db(email_data: EmailRequest, db: Session):
    try:
        if email_data.formType.lower() == "lease form":
            db_submission = LeaseFormSubmission(
                first_name=email_data.firstName,
                last_name=email_data.lastName,
                email=email_data.email,
                phone_number=email_data.phoneNumber,
                vehicle_make=email_data.vehicleMake,
                vehicle_model=email_data.vehicleModel,
                zip_code=email_data.zipCode,
                miles_per_year=email_data.milesPerYear,
                credit_score=email_data.creditScore
            )
        elif email_data.formType.lower() == "sell form":
            db_submission = SellFormSubmission(
                first_name=email_data.firstName,
                last_name=email_data.lastName,
                email=email_data.email,
                phone_number=email_data.phoneNumber,
                vin=email_data.vin,
                miles=email_data.miles,
                payoff=email_data.payoff,
                condition=email_data.condition,
                two_keys=email_data.twoKeys if email_data.twoKeys is not None else False,
                major_damage=email_data.majorDamage if email_data.majorDamage is not None else False
            )
        elif email_data.formType.lower() == "consultation form":
            db_submission = ConsultationFormSubmission(
                first_name=email_data.firstName,
                last_name=email_data.lastName,
                email=email_data.email,
                phone_number=email_data.phoneNumber,
                zip_code=email_data.zipCode
            )
        else:
            return False
            
        db.add(db_submission)
        db.commit()
        db.refresh(db_submission)
        return True
    except Exception as e:
        print(f"Error saving to database: {e}")
        db.rollback()
        return False

@app.get("/")
async def root():
    return {"message": "CarDealBroker API is running", "cors_origins": origins}

@app.post("/submit_form/", response_model=SuccessResponse, responses={
    200: {"model": SuccessResponse},
    400: {"model": ErrorResponse},
    500: {"model": ErrorResponse}
})
async def submit_form(email_data: EmailRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    try:
        # Save to database
        db_success = save_form_to_db(email_data, db)
        
        # Send email
        # background_tasks.add_task(send_email_sendgrid, email_data)
        
        return SuccessResponse(
            message="Form submitted successfully. Data saved and email is being sent.",
            data={"formType": email_data.formType, "database_saved": db_success}
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )

# New endpoints to get form submissions
@app.get("/lease_submissions/", response_model=List[LeaseFormResponse])
async def get_lease_submissions(db: Session = Depends(get_db)):
    submissions = db.query(LeaseFormSubmission).all()
    return submissions

@app.get("/sell_submissions/", response_model=List[SellFormResponse])
async def get_sell_submissions(db: Session = Depends(get_db)):
    submissions = db.query(SellFormSubmission).all()
    return submissions

@app.get("/consultation_submissions/", response_model=List[ConsultationFormResponse])
async def get_consultation_submissions(db: Session = Depends(get_db)):
    submissions = db.query(ConsultationFormSubmission).all()
    return submissions

def process_tags(tags_string):
    """Convert comma-separated tags string to a list."""
    if not tags_string:
        return []
    return tags_string.split(',')

def deal_to_response(deal):
    """Convert Deal database model to DealResponse with tags processed."""
    deal_dict = {
        "id": deal.id,
        "make": deal.make,
        "model": deal.model,
        "year": deal.year,
        "image_url": deal.image_url,
        "lease_price": deal.lease_price,
        "term": deal.term,
        "down_payment": deal.down_payment,
        "mileage": deal.mileage,
        "msrp": deal.msrp,
        "savings": deal.savings,
        "tags": process_tags(deal.tags),
        "description": deal.description
    }
    return deal_dict

def demo_to_response(demo):
    """Convert Demo database model to DemoResponse with tags processed."""
    demo_dict = {
        "id": demo.id,
        "make": demo.make,
        "model": demo.model,
        "year": demo.year,
        "image_url": demo.image_url,
        "lease_price": demo.lease_price,
        "term": demo.term,
        "down_payment": demo.down_payment,
        "mileage": demo.mileage,
        "msrp": demo.msrp,
        "savings": demo.savings,
        "tags": process_tags(demo.tags),
        "description": demo.description
    }
    return demo_dict

@app.get("/deals/", response_model=List[DealResponse])
async def get_deals(db: Session = Depends(get_db)):
    deals = db.query(Deal).all()
    return [deal_to_response(deal) for deal in deals]

@app.get("/demos/", response_model=List[DemoResponse])
async def get_demos(db: Session = Depends(get_db)):
    demos = db.query(Demo).all()
    return [demo_to_response(demo) for demo in demos]