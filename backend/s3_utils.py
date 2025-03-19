import os
import uuid
import boto3
from dotenv import load_dotenv
from botocore.exceptions import ClientError

# Load environment variables
load_dotenv()

# AWS S3 configuration
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
AWS_REGION = os.getenv("AWS_REGION", "us-east-2")  # Default to us-east-1

# Initialize S3 client
def get_s3_client():
    """Get and return an S3 client using the environment credentials."""
    if not all([AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_BUCKET_NAME]):
        raise ValueError("Missing required AWS environment variables")
    
    s3_client = boto3.client(
        's3',
        aws_access_key_id=AWS_ACCESS_KEY,
        aws_secret_access_key=AWS_SECRET_KEY,
        region_name=AWS_REGION
    )
    
    return s3_client

def upload_file_to_s3(file, folder="uploads"):
    """
    Upload a file to S3 bucket and return the public URL.
    
    Args:
        file: File object from FastAPI (UploadFile)
        folder: Folder name within the bucket (default: "uploads")
        
    Returns:
        str: Public URL of the uploaded file
    """
    try:
        # Generate a unique filename
        file_extension = file.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
        
        # Create the full file path in the bucket
        file_path = f"{folder}/{unique_filename}"
        
        # Get the S3 client
        s3_client = get_s3_client()
        
        # Upload the file
        s3_client.upload_fileobj(
            file.file, 
            AWS_BUCKET_NAME, 
            file_path,
            ExtraArgs={
                "ContentType": file.content_type,
                "ACL": "public-read"  # Make the file publicly accessible
            }
        )
        
        # Generate and return the public URL
        file_url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{file_path}"
        return file_url
        
    except ClientError as e:
        print(f"Error uploading to S3: {e}")
        raise
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise
    finally:
        # Reset file cursor position
        file.file.seek(0) 