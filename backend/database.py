import os
from sqlalchemy import create_engine, Column, Integer, String, Text, Boolean, DateTime, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import datetime
import re

load_dotenv()

# Get database URL from environment variables
DATABASE_URL = os.getenv("DATABASE_URL")

# For local development, we'll use SQLite as a fallback
if not DATABASE_URL:
    print("Warning: DATABASE_URL environment variable not set. Using SQLite as fallback.")
    DATABASE_URL = "sqlite:///./test.db"

# Railway provides MySQL URLs in standard format (mysql://user:pass@host:port/db)
# SQLAlchemy with PyMySQL needs the format mysql+pymysql://user:pass@host:port/db
if DATABASE_URL and DATABASE_URL.startswith('mysql:'):
    # Convert from mysql:// to mysql+pymysql://
    if not DATABASE_URL.startswith('mysql+pymysql:'):
        DATABASE_URL = DATABASE_URL.replace('mysql:', 'mysql+pymysql:', 1)
    
    # Create engine with explicit charset
    engine = create_engine(
        DATABASE_URL, 
        connect_args={"charset": "utf8mb4"},
        pool_recycle=300  # Reconnect after 5 minutes of inactivity
    )
    print(f"Connected to MySQL database")
else:
    # SQLite or other database
    engine = create_engine(DATABASE_URL)
    print(f"Connected to SQLite or other database")

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create declarative base
Base = declarative_base()

# Define models
class LeaseFormSubmission(Base):
    __tablename__ = "lease_form_submissions"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    first_name = Column(String(100))
    last_name = Column(String(100))
    email = Column(String(100))
    phone_number = Column(String(20))
    vehicle_make = Column(String(50))
    vehicle_model = Column(String(50))
    zip_code = Column(String(20))
    miles_per_year = Column(String(20))
    credit_score = Column(String(20))

class SellFormSubmission(Base):
    __tablename__ = "sell_form_submissions"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    first_name = Column(String(100))
    last_name = Column(String(100))
    email = Column(String(100))
    phone_number = Column(String(20))
    vin = Column(String(20))
    miles = Column(String(20))
    payoff = Column(String(20))
    condition = Column(String(20))
    two_keys = Column(Boolean, default=False)
    major_damage = Column(Boolean, default=False)

# Function to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Function to initialize database
def init_db():
    Base.metadata.create_all(bind=engine)