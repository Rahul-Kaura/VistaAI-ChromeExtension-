import pandas as pd
import json
import os

def prepare_training_data(input_csv, output_jsonl):
    """
    Convert pitch sequence data from CSV to JSONL format for fine-tuning.
    
    Args:
        input_csv (str): Path to input CSV file
        output_jsonl (str): Path to output JSONL file
    """
    # Read the CSV file
    df = pd.read_csv(input_csv)
    
    # Create training examples
    training_examples = []
    
    for _, row in df.iterrows():
        # Create prompt
        prompt = f"What pitch should follow {row['pitch_sequence']} with count {row['count']}?"
        
        # Create completion
        completion = f" {row['result']}"
        
        # Create training example
        example = {
            "prompt": prompt,
            "completion": completion
        }
        
        training_examples.append(example)
    
    # Write to JSONL file
    with open(output_jsonl, 'w') as f:
        for example in training_examples:
            f.write(json.dumps(example) + '\n')
    
    print(f"Created {len(training_examples)} training examples")
    print(f"Output written to {output_jsonl}")

if __name__ == "__main__":
    # Example usage
    input_csv = "pitch_data.csv"  # Replace with your input CSV file
    output_jsonl = "training_data.jsonl"
    
    if not os.path.exists(input_csv):
        print(f"Error: Input file {input_csv} not found")
        exit(1)
    
    prepare_training_data(input_csv, output_jsonl) 