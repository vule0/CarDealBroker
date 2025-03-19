import os
from sqlalchemy import create_engine, Column, Integer, String, Text, Boolean, DateTime, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import datetime

load_dotenv()

# Get database URL from environment variables
DATABASE_URL = os.getenv("DATABASE_URL")

# Create SQLAlchemy engine with a default SQLite URL if DATABASE_URL is not set
# For local development, we'll use SQLite as a fallback
if not DATABASE_URL:
    print("Warning: DATABASE_URL environment variable not set. Using SQLite as fallback.")
    DATABASE_URL = "sqlite:///./test.db"

# Create SQLAlchemy engine - explicitly use pymysql for MySQL
if DATABASE_URL and DATABASE_URL.startswith('mysql'):
    engine = create_engine(DATABASE_URL, connect_args={"charset": "utf8mb4"})
else:
    engine = create_engine(DATABASE_URL)

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