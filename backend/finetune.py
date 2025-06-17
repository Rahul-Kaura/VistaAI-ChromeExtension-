import os
import json
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def prepare_training_data(conversations):
    """
    Prepare conversations for fine-tuning.
    Each conversation should be a list of messages with 'role' and 'content'.
    """
    return [{"messages": [{"role": m["role"], "content": m["content"]} for m in conv]} for conv in conversations]

def create_fine_tuning_file(training_data, output_file="training_data.jsonl"):
    """
    Create a JSONL file for fine-tuning.
    """
    with open(output_file, 'w') as f:
        for item in training_data:
            f.write(json.dumps(item) + '\n')
    return output_file

def upload_file(file_path):
    """
    Upload the training file to OpenAI.
    """
    with open(file_path, 'rb') as f:
        return client.files.create(file=f, purpose='fine-tune').id

def create_fine_tuning_job(file_id, model="gpt-3.5-turbo"):
    """
    Create a fine-tuning job.
    """
    return client.fine_tuning.jobs.create(training_file=file_id, model=model).id

def check_fine_tuning_status(job_id):
    """
    Check the status of a fine-tuning job.
    """
    return client.fine_tuning.jobs.retrieve(job_id).status

# Example usage
if __name__ == "__main__":
    # Example conversations for fine-tuning
    example_conversations = [
        [
            {"role": "system", "content": "You are a helpful AI assistant."},
            {"role": "user", "content": "What is the weather like?"},
            {"role": "assistant", "content": "I don't have access to real-time weather data. Please check a weather service or app for current conditions."}
        ]
    ]

    # Create and upload training data
    training_data = prepare_training_data(example_conversations)
    file_path = create_fine_tuning_file(training_data)
    file_id = upload_file(file_path)
    
    # Start fine-tuning
    job_id = create_fine_tuning_job(file_id)
    print(f"Fine-tuning job created with ID: {job_id}") 