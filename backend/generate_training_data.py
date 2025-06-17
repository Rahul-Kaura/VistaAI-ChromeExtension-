import random
from typing import List, Dict
from expanded_stock_data import POPULAR_STOCKS, EXPANDED_TRAINING_CONVERSATIONS, MARKET_ANALYSIS_SCENARIOS

def generate_stock_specific_questions(stock: Dict) -> List[Dict]:
    """Generate stock-specific questions and answers."""
    questions = [
        {
            "messages": [
                {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
                {"role": "user", "content": f"What are the key metrics to watch for {stock['name']} ({stock['symbol']})?"},
                {"role": "assistant", "content": f"For {stock['name']} ({stock['symbol']}), key metrics include:\n1. P/E Ratio: Currently {stock['key_metrics']['pe_ratio']}\n2. Dividend Yield: {stock['key_metrics']['dividend_yield']}%\n3. Beta: {stock['key_metrics']['beta']}\n4. 52-Week Range: ${stock['key_metrics']['52_week_low']} - ${stock['key_metrics']['52_week_high']}\n\nConsider:\n- Industry-specific metrics\n- Growth rates\n- Market share\n- Competitive position\n\nRemember: This is general information, not financial advice."}
            ]
        },
        {
            "messages": [
                {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
                {"role": "user", "content": f"How does {stock['name']} ({stock['symbol']}) compare to its industry peers?"},
                {"role": "assistant", "content": f"{stock['name']} ({stock['symbol']}) in the {stock['industry']} industry:\n1. Market Position: {stock['market_cap']} company\n2. Sector: {stock['sector']}\n3. Business Focus: {stock['description']}\n\nConsider:\n- Industry trends\n- Competitive advantages\n- Market share\n- Growth potential\n\nNote: This is general information, not investment advice."}
            ]
        }
    ]
    return questions

def generate_sector_analysis_questions(sector: str) -> List[Dict]:
    """Generate sector-specific analysis questions."""
    sector_stocks = [stock for stock in POPULAR_STOCKS if stock['sector'] == sector]
    if not sector_stocks:
        return []
    
    return [
        {
            "messages": [
                {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
                {"role": "user", "content": f"What are the key trends in the {sector} sector?"},
                {"role": "assistant", "content": f"The {sector} sector shows several important trends:\n1. Market Leaders: {', '.join(stock['symbol'] for stock in sector_stocks[:3])}\n2. Industry Dynamics: {sector_stocks[0]['industry']}\n3. Growth Factors: Technology adoption, regulatory changes, market demand\n4. Risk Factors: Competition, regulation, economic cycles\n\nConsider:\n- Sector-specific metrics\n- Regulatory environment\n- Technological disruption\n- Market cycles\n\nRemember: This is general information, not financial advice."}
            ]
        }
    ]

def generate_market_scenario_questions(scenario: Dict) -> List[Dict]:
    """Generate questions based on market scenarios."""
    return [
        {
            "messages": [
                {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
                {"role": "user", "content": question},
                {"role": "assistant", "content": f"Regarding {scenario['scenario']}:\n1. Key Considerations: Market conditions, economic factors, sector performance\n2. Analysis Methods: Technical and fundamental indicators\n3. Risk Factors: Market volatility, economic cycles, sector rotation\n4. Opportunities: Potential market inefficiencies, sector trends\n\nRemember: This is general information, not financial advice."}
            ]
        }
        for question in scenario['questions']
    ]

def generate_training_data() -> List[Dict]:
    """Generate comprehensive training data by combining all sources."""
    training_data = []
    
    # Add existing conversations
    training_data.extend(EXPANDED_TRAINING_CONVERSATIONS)
    
    # Generate stock-specific questions
    for stock in POPULAR_STOCKS:
        training_data.extend(generate_stock_specific_questions(stock))
    
    # Generate sector analysis questions
    sectors = set(stock['sector'] for stock in POPULAR_STOCKS)
    for sector in sectors:
        training_data.extend(generate_sector_analysis_questions(sector))
    
    # Generate market scenario questions
    for scenario in MARKET_ANALYSIS_SCENARIOS:
        training_data.extend(generate_market_scenario_questions(scenario))
    
    return training_data

if __name__ == "__main__":
    # Generate training data
    training_data = generate_training_data()
    
    # Print statistics
    print(f"Generated {len(training_data)} training examples")
    print(f"Covering {len(POPULAR_STOCKS)} stocks")
    print(f"Across {len(set(stock['sector'] for stock in POPULAR_STOCKS))} sectors")
    print(f"With {len(MARKET_ANALYSIS_SCENARIOS)} market scenarios") 