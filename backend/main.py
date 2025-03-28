# import uvicorn
import os
from fastapi import FastAPI, BackgroundTasks, HTTPException, Depends, UploadFile, File, Form
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import sendgrid
from sendgrid.helpers.mail import Mail, Email, To, Content
from dotenv import load_dotenv
from typing import Optional, List
from sqlalchemy.orm import Session
import datetime

# Import database modules
from database import get_db, init_db, LeaseFormSubmission, SellFormSubmission, ConsultationFormSubmission, Deal, Demo, DealInquirySubmission, DemoInquirySubmission
from s3_utils import upload_file_to_s3

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

# Admin authentication endpoint
class AdminLoginRequest(BaseModel):
    password: str

class AdminLoginResponse(BaseModel):
    authenticated: bool
    message: str

@app.post("/admin/login", response_model=AdminLoginResponse)
async def admin_login(login_data: AdminLoginRequest):
    # Get admin password from environment variables
    admin_password = os.getenv("ADMIN_PASSWORD")
    
    # Check if password matches
    if login_data.password == admin_password:
        return AdminLoginResponse(authenticated=True, message="Login successful")
    else:
        return AdminLoginResponse(authenticated=False, message="Invalid password")

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

# New model for vehicle inquiries from deal and demo pages
class VehicleInquiryRequest(BaseModel):
    firstName: str
    lastName: str
    email: str
    phoneNumber: str
    vehicleType: str  # 'deal' or 'demo'
    vehicleId: int
    vehicleYear: int
    vehicleMake: str
    vehicleModel: str
    leasePrice: float
    term: int
    downPayment: float
    mileage: int
    msrp: float
    savings: Optional[float] = None
    tags: Optional[List[str]] = None
    description: Optional[str] = None

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

class DealInquiryResponse(BaseModel):
    id: int
    created_at: datetime.datetime
    first_name: str
    last_name: str
    email: str
    phone_number: str
    deal_id: int
    vehicle_year: int
    vehicle_make: str
    vehicle_model: str
    lease_price: float
    term: int
    down_payment: float
    mileage: int
    msrp: float
    savings: Optional[float] = None
    
    class Config:
        orm_mode = True

class DemoInquiryResponse(BaseModel):
    id: int
    created_at: datetime.datetime
    first_name: str
    last_name: str
    email: str
    phone_number: str
    demo_id: int
    vehicle_year: int
    vehicle_make: str
    vehicle_model: str
    lease_price: float
    term: int
    down_payment: float
    mileage: int
    msrp: float
    savings: Optional[float] = None
    
    class Config:
        orm_mode = True

def send_email_sendgrid(email_data: EmailRequest):
    sg = sendgrid.SendGridAPIClient(api_key=os.getenv("SENDGRID_API_KEY"))
    from_email = Email(os.getenv("SENDGRID_FROM_EMAIL"))
    to_email = To(os.getenv("RECEIVER_EMAIL")) 
    subject = f"New {email_data.formType} Submission - {email_data.firstName} {email_data.lastName}"
    
    email_body = f"""
    Customer Information:
    --------------------
    Name: {email_data.firstName} {email_data.lastName}
    Email: {email_data.email}
    Phone: {email_data.phoneNumber}
    Form Type: {email_data.formType}
    """
    
    if email_data.formType.lower() == "lease form":
        email_body += f"""
    Vehicle Information:
    -------------------
    Make: {email_data.vehicleMake}
    Model: {email_data.vehicleModel}
    
    Lease Details:
    -------------
    Zip Code: {email_data.zipCode}
    Miles per Year: {email_data.milesPerYear}
    Credit Score: {email_data.creditScore}
    """

    if email_data.formType.lower() == "sell form":
        email_body += f"""
    Vehicle Information:
    -------------------
    VIN: {email_data.vin}
    Miles: {email_data.miles}
    
    Sell Details:
    ------------
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
        background_tasks.add_task(send_email_sendgrid, email_data)
        
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

# Models for creating/updating deals and demos
class DealCreateRequest(BaseModel):
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
    tags: Optional[str] = None
    description: Optional[str] = None
    
class DemoCreateRequest(BaseModel):
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
    tags: Optional[str] = None
    description: Optional[str] = None

# Image upload endpoints
@app.post("/upload/deal-image/", response_model=dict)
async def upload_deal_image(file: UploadFile = File(...)):
    """Upload an image for a deal to S3 and return the URL."""
    try:
        # Verify file is an image
        content_type = file.content_type
        if not content_type or not content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Enforce file size limit (5MB)
        file_size_limit = 5 * 1024 * 1024  # 5MB
        file.file.seek(0, 2)  # Seek to the end of the file
        file_size = file.file.tell()  # Get current position (file size)
        file.file.seek(0)  # Reset to the beginning
        
        if file_size > file_size_limit:
            raise HTTPException(status_code=400, detail=f"File size exceeds the 5MB limit")
        
        # Upload to S3 with 'deals' folder
        image_url = upload_file_to_s3(file, folder="deals")
        return {"status": "success", "image_url": image_url}
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error in upload_deal_image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")

@app.post("/upload/demo-image/", response_model=dict)
async def upload_demo_image(file: UploadFile = File(...)):
    """Upload an image for a demo to S3 and return the URL."""
    try:
        # Verify file is an image
        content_type = file.content_type
        if not content_type or not content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Enforce file size limit (5MB)
        file_size_limit = 5 * 1024 * 1024  # 5MB
        file.file.seek(0, 2)  # Seek to the end of the file
        file_size = file.file.tell()  # Get current position (file size)
        file.file.seek(0)  # Reset to the beginning
        
        if file_size > file_size_limit:
            raise HTTPException(status_code=400, detail=f"File size exceeds the 5MB limit")
        
        # Upload to S3 with 'demos' folder
        image_url = upload_file_to_s3(file, folder="demos")
        return {"status": "success", "image_url": image_url}
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error in upload_demo_image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")

# CRUD endpoints for deals
@app.post("/deals/", response_model=DealResponse)
async def create_deal(
    deal_data: DealCreateRequest,
    db: Session = Depends(get_db)
):
    """Create a new deal with the provided data and image URL."""
    try:
        # Create new Deal object
        new_deal = Deal(
            make=deal_data.make,
            model=deal_data.model,
            year=deal_data.year,
            image_url=deal_data.image_url,  # Now expecting image_url in the request body
            lease_price=deal_data.lease_price,
            term=deal_data.term,
            down_payment=deal_data.down_payment,
            mileage=deal_data.mileage,
            msrp=deal_data.msrp,
            savings=deal_data.savings,
            tags=deal_data.tags,
            description=deal_data.description
        )
        
        # Add to database
        db.add(new_deal)
        db.commit()
        db.refresh(new_deal)
        
        return deal_to_response(new_deal)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create deal: {str(e)}")

@app.put("/deals/{deal_id}", response_model=DealResponse)
async def update_deal(
    deal_id: int,
    deal_data: DealCreateRequest,
    db: Session = Depends(get_db)
):
    """Update an existing deal by ID."""
    # Find the deal
    deal = db.query(Deal).filter(Deal.id == deal_id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    try:
        # Update deal attributes
        deal.make = deal_data.make
        deal.model = deal_data.model
        deal.year = deal_data.year
        deal.image_url = deal_data.image_url
        deal.lease_price = deal_data.lease_price
        deal.term = deal_data.term
        deal.down_payment = deal_data.down_payment
        deal.mileage = deal_data.mileage
        deal.msrp = deal_data.msrp
        deal.savings = deal_data.savings
        deal.tags = deal_data.tags
        deal.description = deal_data.description
        
        # Commit changes
        db.commit()
        db.refresh(deal)
        
        return deal_to_response(deal)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update deal: {str(e)}")

@app.delete("/deals/{deal_id}", response_model=dict)
async def delete_deal(deal_id: int, db: Session = Depends(get_db)):
    """Delete a deal by ID."""
    deal = db.query(Deal).filter(Deal.id == deal_id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    try:
        db.delete(deal)
        db.commit()
        return {"status": "success", "message": f"Deal {deal_id} deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete deal: {str(e)}")

# CRUD endpoints for demos
@app.post("/demos/", response_model=DemoResponse)
async def create_demo(
    demo_data: DemoCreateRequest,
    db: Session = Depends(get_db)
):
    """Create a new demo with the provided data and image URL."""
    try:
        # Create new Demo object
        new_demo = Demo(
            make=demo_data.make,
            model=demo_data.model,
            year=demo_data.year,
            image_url=demo_data.image_url,  # Now expecting image_url in the request body
            lease_price=demo_data.lease_price,
            term=demo_data.term,
            down_payment=demo_data.down_payment,
            mileage=demo_data.mileage,
            msrp=demo_data.msrp,
            savings=demo_data.savings,
            tags=demo_data.tags,
            description=demo_data.description
        )
        
        # Add to database
        db.add(new_demo)
        db.commit()
        db.refresh(new_demo)
        
        return demo_to_response(new_demo)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create demo: {str(e)}")

@app.put("/demos/{demo_id}", response_model=DemoResponse)
async def update_demo(
    demo_id: int,
    demo_data: DemoCreateRequest,
    db: Session = Depends(get_db)
):
    """Update an existing demo by ID."""
    # Find the demo
    demo = db.query(Demo).filter(Demo.id == demo_id).first()
    if not demo:
        raise HTTPException(status_code=404, detail="Demo not found")
    
    try:
        # Update demo attributes
        demo.make = demo_data.make
        demo.model = demo_data.model
        demo.year = demo_data.year
        demo.image_url = demo_data.image_url
        demo.lease_price = demo_data.lease_price
        demo.term = demo_data.term
        demo.down_payment = demo_data.down_payment
        demo.mileage = demo_data.mileage
        demo.msrp = demo_data.msrp
        demo.savings = demo_data.savings
        demo.tags = demo_data.tags
        demo.description = demo_data.description
        
        # Commit changes
        db.commit()
        db.refresh(demo)
        
        return demo_to_response(demo)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update demo: {str(e)}")

@app.delete("/demos/{demo_id}", response_model=dict)
async def delete_demo(demo_id: int, db: Session = Depends(get_db)):
    """Delete a demo by ID."""
    demo = db.query(Demo).filter(Demo.id == demo_id).first()
    if not demo:
        raise HTTPException(status_code=404, detail="Demo not found")
    
    try:
        db.delete(demo)
        db.commit()
        return {"status": "success", "message": f"Demo {demo_id} deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete demo: {str(e)}")

def save_vehicle_inquiry_to_db(inquiry_data: VehicleInquiryRequest, db: Session):
    """Save vehicle inquiry to the appropriate database table"""
    try:
        if inquiry_data.vehicleType.lower() == "deal":
            # Create a new deal inquiry submission
            db_submission = DealInquirySubmission(
                first_name=inquiry_data.firstName,
                last_name=inquiry_data.lastName,
                email=inquiry_data.email,
                phone_number=inquiry_data.phoneNumber,
                deal_id=inquiry_data.vehicleId,
                vehicle_year=inquiry_data.vehicleYear,
                vehicle_make=inquiry_data.vehicleMake,
                vehicle_model=inquiry_data.vehicleModel,
                lease_price=inquiry_data.leasePrice,
                term=inquiry_data.term,
                down_payment=inquiry_data.downPayment,
                mileage=inquiry_data.mileage,
                msrp=inquiry_data.msrp,
                savings=inquiry_data.savings
            )
        elif inquiry_data.vehicleType.lower() == "demo":
            # Create a new demo inquiry submission
            db_submission = DemoInquirySubmission(
                first_name=inquiry_data.firstName,
                last_name=inquiry_data.lastName,
                email=inquiry_data.email,
                phone_number=inquiry_data.phoneNumber,
                demo_id=inquiry_data.vehicleId,
                vehicle_year=inquiry_data.vehicleYear,
                vehicle_make=inquiry_data.vehicleMake,
                vehicle_model=inquiry_data.vehicleModel,
                lease_price=inquiry_data.leasePrice,
                term=inquiry_data.term,
                down_payment=inquiry_data.downPayment,
                mileage=inquiry_data.mileage,
                msrp=inquiry_data.msrp,
                savings=inquiry_data.savings
            )
        else:
            # Invalid vehicle type
            print(f"Invalid vehicle type: {inquiry_data.vehicleType}")
            return False
            
        db.add(db_submission)
        db.commit()
        db.refresh(db_submission)
        return True
    except Exception as e:
        print(f"Error saving vehicle inquiry to database: {e}")
        db.rollback()
        return False

def send_vehicle_inquiry_email(inquiry_data: VehicleInquiryRequest):
    """Send email for vehicle inquiry (deal or demo)"""
    sg = sendgrid.SendGridAPIClient(api_key=os.getenv("SENDGRID_API_KEY"))
    from_email = Email(os.getenv("SENDGRID_FROM_EMAIL"))
    to_email = To(os.getenv("RECEIVER_EMAIL"))
    
    vehicle_type = inquiry_data.vehicleType.capitalize()
    subject = f"New {vehicle_type} Inquiry - {inquiry_data.vehicleYear} {inquiry_data.vehicleMake} {inquiry_data.vehicleModel}"
    
    # Format tags as comma-separated string if presentt
    tags_str = ", ".join(inquiry_data.tags) if inquiry_data.tags else "None"
    
    # Format the savings with commas if present
    savings_str = f"${inquiry_data.savings:,.2f}" if inquiry_data.savings else "N/A"
    
    email_body = f"""
    Customer Information:
    --------------------
    Name: {inquiry_data.firstName} {inquiry_data.lastName}
    Email: {inquiry_data.email}
    Phone: {inquiry_data.phoneNumber}
    Inquiry Type: {vehicle_type}
    
    Vehicle Information:
    -------------------
    ID: {inquiry_data.vehicleId}
    Year: {inquiry_data.vehicleYear}
    Make: {inquiry_data.vehicleMake}
    Model: {inquiry_data.vehicleModel}
    
    Lease Details:
    -------------
    Monthly Payment: ${inquiry_data.leasePrice:,.2f}
    Term: {inquiry_data.term} months
    Down Payment: ${inquiry_data.downPayment:,.2f}
    Mileage: {inquiry_data.mileage:,}/year
    MSRP: ${inquiry_data.msrp:,.2f}
    Savings: {savings_str}
    
    Features: {tags_str}
    """
    
    if inquiry_data.description:
        email_body += f"""
    Description:
    -----------
    {inquiry_data.description}
    """
    
    content = Content("text/plain", email_body)
    mail = Mail(from_email, to_email, subject, content)

    try:
        response = sg.send(mail)
        if response.status_code == 202:
            print(f"Vehicle inquiry email sent successfully with status code {response.status_code}")
            return True
        else:
            print(f"Failed to send vehicle inquiry email with status code {response.status_code}")
            return False
    except Exception as e:
        print(f"Error sending vehicle inquiry email: {e}")
        return False

@app.post("/vehicle_inquiry/", response_model=SuccessResponse, responses={
    200: {"model": SuccessResponse},
    400: {"model": ErrorResponse},
    500: {"model": ErrorResponse}
})
async def submit_vehicle_inquiry(inquiry_data: VehicleInquiryRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Handle vehicle inquiries from the deals and demos pages
    """
    try:
        # Save to database
        db_success = save_vehicle_inquiry_to_db(inquiry_data, db)
        
        # Send email in the background
        background_tasks.add_task(send_vehicle_inquiry_email, inquiry_data)
        
        return SuccessResponse(
            message=f"{inquiry_data.vehicleType.capitalize()} inquiry submitted successfully. An email will be sent to our team.",
            data={"vehicleType": inquiry_data.vehicleType, "vehicleId": inquiry_data.vehicleId, "database_saved": db_success}
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )

@app.get("/deal_inquiries/", response_model=List[DealInquiryResponse])
async def get_deal_inquiries(db: Session = Depends(get_db)):
    """Get all deal inquiry submissions"""
    inquiries = db.query(DealInquirySubmission).all()
    return inquiries

@app.get("/deal_inquiries/{inquiry_id}", response_model=DealInquiryResponse)
async def get_deal_inquiry(inquiry_id: int, db: Session = Depends(get_db)):
    """Get a specific deal inquiry submission by ID"""
    inquiry = db.query(DealInquirySubmission).filter(DealInquirySubmission.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Deal inquiry not found")
    return inquiry

@app.get("/demo_inquiries/", response_model=List[DemoInquiryResponse])
async def get_demo_inquiries(db: Session = Depends(get_db)):
    """Get all demo inquiry submissions"""
    inquiries = db.query(DemoInquirySubmission).all()
    return inquiries

@app.get("/demo_inquiries/{inquiry_id}", response_model=DemoInquiryResponse)
async def get_demo_inquiry(inquiry_id: int, db: Session = Depends(get_db)):
    """Get a specific demo inquiry submission by ID"""
    inquiry = db.query(DemoInquirySubmission).filter(DemoInquirySubmission.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Demo inquiry not found")
    return inquiry