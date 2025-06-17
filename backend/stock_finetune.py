import os
import json
from dotenv import load_dotenv
from openai import OpenAI
from expanded_stock_data import EXPANDED_STOCK_TRAINING_CONVERSATIONS

# Load environment variables
load_dotenv()

def prepare_stock_training_data(conversations):
    """
    Prepare conversations for fine-tuning.
    Each conversation should be a list of messages with 'role' and 'content'.
    """
    return [{"messages": [{"role": m["role"], "content": m["content"]} for m in conv["messages"]]} for conv in conversations]

def create_stock_fine_tuning_file(training_data, output_file="stock_training_data.jsonl"):
    """
    Create a JSONL file for fine-tuning.
    """
    with open(output_file, 'w') as f:
        for item in training_data:
            f.write(json.dumps(item) + '\n')
    return output_file

def upload_stock_file(file_path):
    """Upload the stock training file to OpenAI."""
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    with open(file_path, 'rb') as f:
        file = client.files.create(
            file=f,
            purpose='fine-tune'
        )
    return file.id

def create_stock_fine_tuning_job(file_id, model="gpt-3.5-turbo"):
    """Create a fine-tuning job for stock market analysis."""
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    job = client.fine_tuning.jobs.create(
        training_file=file_id,
        model=model,
        suffix="stock-advisor"
    )
    return job.id

def check_stock_fine_tuning_status(job_id):
    """Check the status of a fine-tuning job."""
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    return client.fine_tuning.jobs.retrieve(job_id).status

if __name__ == "__main__":
    # Verify API key is set
    if not os.getenv('OPENAI_API_KEY'):
        print("Error: OPENAI_API_KEY not found in environment variables")
        print("Please create a .env file with your API key")
        exit(1)
        
    # Prepare the training data
    training_data = prepare_stock_training_data(EXPANDED_STOCK_TRAINING_CONVERSATIONS)
    
    # Create the fine-tuning file
    training_file = create_stock_fine_tuning_file(training_data)
    print(f"Created training file: {training_file}")
    
    # Upload the file
    file_id = upload_stock_file(training_file)
    print(f"File uploaded with ID: {file_id}")
    
    # Create the fine-tuning job
    job_id = create_stock_fine_tuning_job(file_id)
    print(f"Fine-tuning job created with ID: {job_id}")
    print(f"Check status with: check_stock_fine_tuning_status('{job_id}')") 