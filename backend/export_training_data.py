import json
from generate_training_data import generate_training_data

def export_training_data(output_file: str = "training_data.jsonl"):
    """Export training data in JSONL format for fine-tuning."""
    # Generate training data
    training_data = generate_training_data()
    
    # Export to JSONL file
    with open(output_file, 'w') as f:
        for example in training_data:
            f.write(json.dumps(example) + '\n')
    
    print(f"Exported {len(training_data)} training examples to {output_file}")

def validate_training_data(data_file: str = "training_data.jsonl"):
    """Validate the exported training data."""
    try:
        with open(data_file, 'r') as f:
            examples = [json.loads(line) for line in f]
        
        # Basic validation
        valid_examples = 0
        for example in examples:
            if (
                isinstance(example, dict) and
                'messages' in example and
                isinstance(example['messages'], list) and
                len(example['messages']) >= 2 and
                all('role' in msg and 'content' in msg for msg in example['messages'])
            ):
                valid_examples += 1
        
        print(f"Validation results:")
        print(f"Total examples: {len(examples)}")
        print(f"Valid examples: {valid_examples}")
        print(f"Invalid examples: {len(examples) - valid_examples}")
        
        return valid_examples == len(examples)
    
    except Exception as e:
        print(f"Error validating training data: {str(e)}")
        return False

if __name__ == "__main__":
    # Export training data
    export_training_data()
    
    # Validate the exported data
    if validate_training_data():
        print("Training data validation successful!")
    else:
        print("Training data validation failed. Please check the data format.") 