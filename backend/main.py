# import uvicorn
import os
from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import sendgrid
from sendgrid.helpers.mail import Mail, Email, To, Content
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

app = FastAPI()

origins = [
    'http://localhost:5173'
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
    
def send_email_sendgrid(email_data: EmailRequest):
    # Initialize SendGrid client with API key from environment variables
    sg = sendgrid.SendGridAPIClient(api_key=os.getenv("SENDGRID_API_KEY"))
    from_email = Email(os.getenv("SENDGRID_FROM_EMAIL"))
    to_email = To("vule2003@yahoo.com")  # Change to the recipient's email address
    subject = f"New {email_data.formType} Submission"
    
    # Construct the email content
    content = Content("text/plain", f"""
    Name: {email_data.firstName} {email_data.lastName}
    Email: {email_data.email}
    Phone: {email_data.phoneNumber}
    
    Form Type: {email_data.formType}
    
    Vehicle Make: {email_data.vehicleMake}
    Vehicle Model: {email_data.vehicleModel}
    Zip Code: {email_data.zipCode}
    Miles per Year: {email_data.milesPerYear}
    Credit Score: {email_data.creditScore}
    
    VIN: {email_data.vin}
    Miles: {email_data.miles}
    Payoff Amount: {email_data.payoff}
    Condition: {email_data.condition}
    
    Two Keys: {'Yes' if email_data.twoKeys else 'No'}
    Major Damage: {'Yes' if email_data.majorDamage else 'No'}
    """)
    
    # Create the mail object
    mail = Mail(from_email, to_email, subject, content)

    try:
        # Send the email using SendGrid
        response = sg.send(mail)
        print(f"Email sent with status code {response.status_code}")
    except Exception as e:
        print(f"Error sending email: {e}")
        raise Exception("Failed to send email")

@app.post("/submit_form/")
async def submit_form(email_data: EmailRequest, background_tasks: BackgroundTasks):
    print(email_data)
    background_tasks.add_task(send_email_sendgrid, email_data)
    return {"message": "Form submitted successfully. Email is being sent."}