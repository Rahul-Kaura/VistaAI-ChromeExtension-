# AI Pitch Advisor Backend

This backend service provides an AI-powered chat interface for both stock market advice and pitch deck consulting.

## Features

- Stock market advice using a fine-tuned GPT-3.5 model
- Pitch deck consulting using a fine-tuned GPT-3.5 model
- RESTful API endpoints for chat interactions
- Error handling and logging

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file with your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

3. Run the application:
```bash
python3 main.py
```

## API Usage

### Chat Endpoint

```http
POST /chat
Content-Type: application/json

{
    "message": "Your question here",
    "context": "stock"  // or "pitch"
}
```

Response:
```json
{
    "response": "AI response here",
    "avatar_url": "https://raw.githubusercontent.com/rahulraina7/ai-pitch-advisor/main/frontend/public/logo192.png"
}
```

## Fine-tuning Process

The application uses two fine-tuned models:

1. Stock Market Advisor (ID: ft:gpt-3.5-turbo-0125:personal:stock-advisor:BjVreaRO)
2. Pitch Deck Advisor (ID: Will be available after fine-tuning completes)

To create new fine-tuned models:

1. For stock market advice:
```bash
python3 stock_finetune.py
```

2. For pitch deck advice:
```bash
python3 pitch_finetune.py
```

The fine-tuning process will:
1. Prepare the training data
2. Create a JSONL file
3. Upload the file to OpenAI
4. Create a fine-tuning job
5. Provide a job ID for status checking

To check fine-tuning status:
```python
from stock_finetune import check_stock_fine_tuning_status
# or
from pitch_finetune import check_pitch_fine_tuning_status

status = check_stock_fine_tuning_status('your_job_id')
# or
status = check_pitch_fine_tuning_status('your_job_id')
```

Once fine-tuning is complete, update the model ID in `main.py` with the new fine-tuned model ID. 