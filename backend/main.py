from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI, RateLimitError
import os
from dotenv import load_dotenv
import logging
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI(title="AI Assistant API")

# Get environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
logger.info(f"API Key loaded: {'Yes' if OPENAI_API_KEY else 'No'}")
logger.info(f"API Key length: {len(OPENAI_API_KEY) if OPENAI_API_KEY else 0}")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    avatar_url: str = "https://raw.githubusercontent.com/rahulraina7/ai-pitch-advisor/main/frontend/public/logo192.png"

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        logger.info(f"Received message: {request.message}")
        
        # Create chat completion
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an AI assistant, helping users with their questions."},
                    {"role": "user", "content": request.message}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            response_content = response.choices[0].message.content
            logger.info(f"Generated response: {response_content}")
            return ChatResponse(response=response_content)
            
        except RateLimitError as rate_limit_error:
            logger.error(f"Rate limit error: {str(rate_limit_error)}")
            return ChatResponse(
                response="I apologize, but I'm currently experiencing high traffic. Please try again in a few moments."
            )
        except Exception as openai_error:
            logger.error(f"OpenAI Error: {str(openai_error)}")
            return ChatResponse(
                response="I apologize, but I'm having trouble connecting to my brain right now. Please try again in a moment."
            )
            
    except Exception as e:
        logger.error(f"Server Error: {str(e)}")
        return ChatResponse(
            response="I apologize, but I'm experiencing some technical difficulties. Please try again in a moment."
        )

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port) 