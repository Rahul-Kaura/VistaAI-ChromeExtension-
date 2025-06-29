from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI, RateLimitError, APIError
import os
from dotenv import load_dotenv
import logging
import json
from typing import List, Optional
import openai

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI(title="AI Assistant API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize OpenAI client
client = OpenAI(api_key=openai.api_key)

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = "stock_market"  # Default to stock market mode

class ChatResponse(BaseModel):
    response: str
    avatar_url: str = "https://raw.githubusercontent.com/rahulraina7/ai-pitch-advisor/main/frontend/public/logo192.png"

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        logger.info(f"Received message: {request.message} with context: {request.context}")
        
        # Determine which model and system message to use based on context
        if request.context == "stock_market":
            model = "ft:gpt-3.5-turbo-0125:personal:stock-advisor:BjVreaRO"  # Fine-tuned stock advisor
            system_message = "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."
        else:
            model = "gpt-3.5-turbo"  # General AI model
            system_message = "You are a helpful AI assistant. Provide accurate and helpful information on any topic while being friendly and engaging."
        
        # Create chat completion
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": request.message}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            response_content = response.choices[0].message.content
            logger.info(f"Generated response: {response_content}")
            return ChatResponse(response=response_content)
            
        except RateLimitError as rate_limit_error:
            error_message = str(rate_limit_error)
            logger.error(f"Rate limit error: {error_message}")
            
            if "insufficient_quota" in error_message.lower():
                return ChatResponse(
                    response="I apologize, but my service quota has been exceeded. Please contact the administrator to resolve this issue."
                )
            else:
                return ChatResponse(
                    response="I apologize, but I'm currently experiencing high traffic. Please try again in a few moments."
                )
                
        except APIError as api_error:
            logger.error(f"OpenAI API Error: {str(api_error)}")
            return ChatResponse(
                response="I apologize, but I'm having trouble connecting to my brain right now. Please try again in a moment."
            )
            
        except Exception as openai_error:
            logger.error(f"OpenAI Error: {str(openai_error)}")
            return ChatResponse(
                response="I apologize, but I'm having trouble processing your request. Please try again in a moment."
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
    port = int(os.getenv("PORT", "8001"))
    uvicorn.run(app, host="0.0.0.0", port=port) 