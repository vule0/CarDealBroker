# import uvicorn
import os
from fastapi import FastAPI, BackgroundTasks, HTTPException, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import sendgrid
from sendgrid.helpers.mail import Mail, Email, To, Content
from dotenv import load_dotenv
from typing import Optional, List
from sqlalchemy.orm import Session

# Import database modules
from database import get_db, init_db, LeaseFormSubmission, SellFormSubmission, ConsultationFormSubmission, Deal, Demo

load_dotenv()

# Sample deal data to seed the database
sample_deals = [
    {
        "make": "Tesla",
        "model": "Model 3",
        "year": 2023,
        "image_url": "/assets/deals/teslamodel3.webp",
        "lease_price": 499,
        "term": 36,
        "down_payment": 3000,
        "mileage": 10000,
        "msrp": 53990,
        "savings": None,
        "tags": "Electric,Sedan,Featured",
        "description": "Experience the future of driving with the Tesla Model 3. This all-electric sedan offers incredible range, performance, and advanced safety features."
    },
    {
        "make": "BMW",
        "model": "X5",
        "year": 2024,
        "image_url": "/assets/deals/2024 bmw xdrive m60i.png",
        "lease_price": 699,
        "term": 36,
        "down_payment": 5000,
        "mileage": 12000,
        "msrp": 67900,
        "savings": None,
        "tags": "Luxury,SUV,Limited",
        "description": "Luxury meets performance in the new BMW X5. With its powerful engine, premium interior, and advanced technology, this SUV delivers the ultimate driving experience."
    },
    {
        "make": "Honda",
        "model": "Accord Hybrid",
        "year": 2023,
        "image_url": "/assets/deals/accord_hybrid.png",
        "lease_price": 329,
        "term": 36,
        "down_payment": 2500,
        "mileage": 12000,
        "msrp": 33990,
        "savings": 3000,
        "tags": "Hybrid,Sedan,Eco-friendly",
        "description": "The perfect balance of efficiency and performance. The Honda Accord Hybrid delivers exceptional fuel economy without sacrificing the comfort and reliability you expect."
    },
    {
        "make": "Mercedes-Benz",
        "model": "GLE",
        "year": 2024,
        "image_url": "/assets/deals/2024-mercedes-benz-gle.png",
        "lease_price": 799,
        "term": 36,
        "down_payment": 6000,
        "mileage": 10000,
        "msrp": 79900,
        "savings": 7200,
        "tags": "Luxury,SUV,Premium",
        "description": "Experience unmatched luxury and cutting-edge technology with the Mercedes-Benz GLE. This premium SUV offers superior comfort, exceptional performance, and distinctive styling."
    },
    {
        "make": "Toyota",
        "model": "RAV4 Prime",
        "year": 2023,
        "image_url": "/assets/deals/2022-toyota-rav4-prime-xse.avif",
        "lease_price": 389,
        "term": 36,
        "down_payment": 3500,
        "mileage": 10000,
        "msrp": 41800,
        "savings": 3800,
        "tags": "Hybrid,SUV,Popular",
        "description": "The best of both worlds with the Toyota RAV4 Prime. This plug-in hybrid SUV offers excellent electric range, powerful performance, and Toyota's legendary reliability."
    },
    {
        "make": "Audi",
        "model": "Q7",
        "year": 2024,
        "image_url": "/assets/deals/24-Audi-Q7.png",
        "lease_price": 749,
        "term": 36,
        "down_payment": 5500,
        "mileage": 10000,
        "msrp": 72000,
        "savings": 6300,
        "tags": "Luxury,SUV,Family",
        "description": "Experience the perfect blend of luxury and practicality with the Audi Q7. This three-row luxury SUV offers sophisticated design, cutting-edge technology, and impressive performance."
    }
]

# Sample demo data to seed the database
sample_demos = [
    {
        "make": "Tesla",
        "model": "Model Y",
        "year": 2024,
        "image_url": "/assets/demos/teslamodelY.webp",
        "lease_price": 549,
        "term": 36,
        "down_payment": 3500,
        "mileage": 10000,
        "msrp": 56990,
        "savings": 5000,
        "tags": "Electric,SUV,Featured",
        "description": "Experience the future of driving with the Tesla Model Y. This all-electric SUV offers incredible range, performance, and advanced autopilot features."
    },
    {
        "make": "BMW",
        "model": "i7",
        "year": 2024,
        "image_url": "/assets/demos/2024bmwi7.avif",
        "lease_price": 899,
        "term": 36,
        "down_payment": 6000,
        "mileage": 12000,
        "msrp": 105700,
        "savings": 7500,
        "tags": "Luxury,Electric,Limited",
        "description": "Luxury meets sustainability in the all-electric BMW i7. Experience cutting-edge technology, premium interior, and impressive performance in BMW's flagship electric sedan."
    },
    {
        "make": "Honda",
        "model": "CR-V Hybrid",
        "year": 2024,
        "image_url": "/assets/demos/2024-Honda-CR-V-hybrid.avif",
        "lease_price": 389,
        "term": 36,
        "down_payment": 2800,
        "mileage": 12000,
        "msrp": 37990,
        "savings": 3200,
        "tags": "Hybrid,SUV,Eco-friendly",
        "description": "Experience efficient SUV driving with the Honda CR-V Hybrid. Perfect for families, this spacious hybrid offers excellent fuel economy without sacrificing comfort or utility."
    },
    {
        "make": "Mercedes-Benz",
        "model": "EQS",
        "year": 2024,
        "image_url": "/assets/demos/2024 benz eqs.png",
        "lease_price": 999,
        "term": 36,
        "down_payment": 7000,
        "mileage": 10000,
        "msrp": 104400,
        "savings": 8000,
        "tags": "Luxury,Electric,Premium",
        "description": "Discover the pinnacle of electric luxury with the Mercedes-Benz EQS. This flagship electric sedan offers unmatched comfort, impressive range, and revolutionary technology."
    },
    {
        "make": "Toyota",
        "model": "Prius Prime",
        "year": 2024,
        "image_url": "/assets/demos/2024 prius prime.jpg",
        "lease_price": 349,
        "term": 36,
        "down_payment": 2500,
        "mileage": 10000,
        "msrp": 35700,
        "savings": 2800,
        "tags": "Hybrid,Sedan,Eco-friendly",
        "description": "Experience the most efficient Prius ever with the Toyota Prius Prime. This plug-in hybrid offers exceptional electric range combined with Toyota's renowned reliability."
    },
    {
        "make": "Audi",
        "model": "e-tron GT",
        "year": 2023,
        "image_url": "/assets/demos/2023-audi-e-tron-gt-rs-4wd-sedan-angular-front.avif",
        "lease_price": 899,
        "term": 36,
        "down_payment": 6000,
        "mileage": 10000,
        "msrp": 106500,
        "savings": 7800,
        "tags": "Luxury,Electric,Sports",
        "description": "Experience Audi's vision of electric performance with the e-tron GT. This electric grand tourer combines stunning design with exhilarating acceleration and precise handling."
    }
]

def seed_deals_if_empty(db: Session):
    """Check if deals table is empty and seed with initial data if needed"""
    deals_count = db.query(Deal).count()
    if deals_count == 0:
        print("Seeding deals table with initial data...")
        for deal_data in sample_deals:
            deal = Deal(**deal_data)
            db.add(deal)
        db.commit()
        print(f"Added {len(sample_deals)} deals to database")

def seed_demos_if_empty(db: Session):
    """Check if demos table is empty and seed with initial data if needed"""
    demos_count = db.query(Demo).count()
    if demos_count == 0:
        print("Seeding demos table with initial data...")
        for demo_data in sample_demos:
            demo = Demo(**demo_data)
            db.add(demo)
        db.commit()
        print(f"Added {len(sample_demos)} demos to database")

app = FastAPI()

# Initialize database on startup
@app.on_event("startup")
async def startup_db_client():
    init_db()
    # Seed initial data
    db = SessionLocal()
    try:
        seed_deals_if_empty(db)
        seed_demos_if_empty(db)
    finally:
        db.close()

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