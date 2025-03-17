import uvicorn
import os
from main import app

if __name__ == "__main__":
    # Get the port from the environment variable or use 8080 as default
    port = int(os.environ.get("PORT", 8080))
    
    # Run the server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False
    ) 