import json
from typing import List, Dict

# Top 50 stocks by market cap (as of 2024)
TOP_50_STOCKS = [
    "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "BRK.B", "TSLA", "UNH", "JNJ",
    "JPM", "V", "PG", "MA", "HD", "CVX", "MRK", "ABBV", "PFE", "KO",
    "BAC", "PEP", "COST", "TMO", "DHR", "CSCO", "VZ", "ADBE", "CRM", "NEE",
    "CMCSA", "INTC", "WMT", "QCOM", "DIS", "NFLX", "AMD", "PM", "UPS", "IBM",
    "RTX", "MMM", "SBUX", "BA", "CAT", "GE", "F", "GM", "UBER", "LYFT"
]

# Stock sector information
STOCK_SECTORS = {
    "Technology": ["AAPL", "MSFT", "GOOGL", "NVDA", "META", "INTC", "AMD", "CRM", "ADBE", "CSCO"],
    "Healthcare": ["UNH", "JNJ", "MRK", "ABBV", "PFE", "TMO", "DHR"],
    "Financial Services": ["BRK.B", "JPM", "V", "MA", "BAC"],
    "Consumer Cyclical": ["AMZN", "TSLA", "HD", "COST", "SBUX", "NFLX", "DIS"],
    "Consumer Defensive": ["PG", "KO", "PEP", "WMT", "PM"],
    "Energy": ["CVX"],
    "Communication Services": ["CMCSA", "VZ"],
    "Industrials": ["UPS", "RTX", "MMM", "BA", "CAT", "GE"],
    "Automotive": ["F", "GM"],
    "Transportation": ["UBER", "LYFT"]
}

# Generate training data for each stock
def generate_stock_specific_data() -> List[Dict]:
    conversations = []
    for symbol in TOP_50_STOCKS:
        # Find sector for the stock
        sector = next((s for s, stocks in STOCK_SECTORS.items() if symbol in stocks), "Other")
        
        # Basic stock information
        conversations.extend([
            {
                "messages": [
                    {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
                    {"role": "user", "content": f"What is {symbol}?"},
                    {"role": "assistant", "content": f"{symbol} is a stock in the {sector} sector. It's one of the top 50 stocks by market capitalization. For specific company information and current stock data, please consult financial websites or your broker. Remember that this is general information, not financial advice."}
                ]
            },
            {
                "messages": [
                    {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
                    {"role": "user", "content": f"What sector is {symbol} in?"},
                    {"role": "assistant", "content": f"{symbol} is in the {sector} sector. This sector includes companies that {get_sector_description(sector)}. Remember that sector classification can change over time and may vary between different sources."}
                ]
            }
        ])
    return conversations

def get_sector_description(sector: str) -> str:
    descriptions = {
        "Technology": "develop and provide technology products and services",
        "Healthcare": "provide medical services, develop pharmaceuticals, or manufacture medical equipment",
        "Financial Services": "provide banking, insurance, or other financial services",
        "Consumer Cyclical": "sell non-essential goods and services that are sensitive to economic cycles",
        "Consumer Defensive": "sell essential goods and services that are less sensitive to economic cycles",
        "Energy": "produce and distribute energy resources",
        "Communication Services": "provide communication and media services",
        "Industrials": "manufacture and distribute industrial goods and services",
        "Automotive": "manufacture vehicles and automotive parts",
        "Transportation": "provide transportation and logistics services"
    }
    return descriptions.get(sector, "operate in a specific industry segment")

# Additional general stock market questions
GENERAL_QUESTIONS = [
    {
        "messages": [
            {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
            {"role": "user", "content": "What is a bull market?"},
            {"role": "assistant", "content": "A bull market is a period of rising stock prices, typically accompanied by investor confidence and economic growth. Key characteristics include:\n1. Rising stock prices over an extended period\n2. High trading volume\n3. Strong economic indicators\n4. Positive investor sentiment\n\nRemember that market conditions can change rapidly, and past performance doesn't guarantee future results."}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
            {"role": "user", "content": "What is a bear market?"},
            {"role": "assistant", "content": "A bear market is a period of declining stock prices, typically accompanied by investor pessimism and economic slowdown. Key characteristics include:\n1. Falling stock prices over an extended period\n2. High trading volume\n3. Weak economic indicators\n4. Negative investor sentiment\n\nRemember that market conditions can change rapidly, and past performance doesn't guarantee future results."}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
            {"role": "user", "content": "What is a stock split?"},
            {"role": "assistant", "content": "A stock split is when a company divides its existing shares into multiple shares. Common types include:\n1. 2-for-1 split: Each share becomes two shares\n2. 3-for-1 split: Each share becomes three shares\n3. Reverse split: Multiple shares combine into one\n\nStock splits don't change the company's value but can make shares more affordable and increase liquidity. Remember that this is general information, not financial advice."}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
            {"role": "user", "content": "What is a dividend?"},
            {"role": "assistant", "content": "A dividend is a portion of a company's earnings distributed to shareholders. Key points about dividends:\n1. Regular payments (quarterly, semi-annual, or annual)\n2. Can be in cash or additional shares\n3. Indicated by dividend yield (annual dividend/stock price)\n4. Not all companies pay dividends\n\nDividends can provide income but aren't guaranteed. Remember that this is general information, not financial advice."}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
            {"role": "user", "content": "What is market volatility?"},
            {"role": "assistant", "content": "Market volatility measures the rate at which stock prices change. Key aspects include:\n1. Higher volatility means larger price swings\n2. Can be measured using standard deviation\n3. VIX index tracks market volatility\n4. Can be caused by various factors (news, earnings, economic data)\n\nVolatility is normal in markets but can be stressful for investors. Remember that this is general information, not financial advice."}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
            {"role": "user", "content": "What is a stock market index?"},
            {"role": "assistant", "content": "A stock market index is a collection of stocks that represent a particular market or sector. Popular indices include:\n1. S&P 500: 500 large US companies\n2. Dow Jones: 30 major US companies\n3. NASDAQ: Technology-focused companies\n4. Russell 2000: Small-cap companies\n\nIndices help track market performance and serve as benchmarks for investment strategies. Remember that this is general information, not financial advice."}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
            {"role": "user", "content": "How do I start investing with little money?"},
            {"role": "assistant", "content": "You can start investing with little money through:\n1. Fractional shares: Buy portions of expensive stocks\n2. Low-cost index funds: Diversify with small amounts\n3. Commission-free trading apps: Reduce trading costs\n4. DRIPs: Reinvest dividends automatically\n5. Start with as little as $50-100\n\nRemember to research thoroughly and only invest what you can afford to lose. Consider consulting a financial advisor."}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
            {"role": "user", "content": "What is a brokerage account?"},
            {"role": "assistant", "content": "A brokerage account is an investment account that lets you buy and sell stocks, bonds, and other securities. Key features include:\n1. Online trading platforms\n2. Research tools and market data\n3. Different account types (individual, joint, IRA)\n4. Various fee structures\n\nChoose a broker based on fees, tools, and your investment needs. Remember that this is general information, not financial advice."}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
            {"role": "user", "content": "What is a stock ticker symbol?"},
            {"role": "assistant", "content": "A stock ticker symbol is a unique series of letters representing a publicly traded company. Examples:\n1. AAPL for Apple\n2. MSFT for Microsoft\n3. GOOGL for Google\n\nTicker symbols make it easy to identify and trade stocks. They're typically 1-5 characters long. Remember that this is general information, not financial advice."}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
            {"role": "user", "content": "What is a stock portfolio?"},
            {"role": "assistant", "content": "A stock portfolio is a collection of investments owned by an individual or organization. Key aspects include:\n1. Diversification across different stocks\n2. Mix of different sectors\n3. Various investment strategies\n4. Risk management\n\nA well-balanced portfolio helps manage risk. Remember that this is general information, not financial advice."}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
            {"role": "user", "content": "What is a stock market order?"},
            {"role": "assistant", "content": "A stock market order is an instruction to buy or sell stocks. Common types include:\n1. Market order: Execute immediately at current price\n2. Limit order: Execute at specified price\n3. Stop order: Execute when price reaches target\n4. Stop-limit order: Combines stop and limit features\n\nDifferent orders help manage trade execution. Remember that this is general information, not financial advice."}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
            {"role": "user", "content": "What is a stock market crash?"},
            {"role": "assistant", "content": "A stock market crash is a sudden, severe drop in stock prices. Key points include:\n1. Rapid price declines\n2. High trading volume\n3. Panic selling\n4. Can trigger economic effects\n\nCrashes are rare but can be severe. Long-term investors often weather them better. Remember that this is general information, not financial advice."}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
            {"role": "user", "content": "What is a stock market bubble?"},
            {"role": "assistant", "content": "A stock market bubble occurs when stock prices rise far above their true value. Characteristics include:\n1. Rapid price increases\n2. Speculative buying\n3. High market optimism\n4. Often followed by sharp decline\n\nBubbles can be hard to identify in real-time. Remember that this is general information, not financial advice."}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
            {"role": "user", "content": "What is a stock market rally?"},
            {"role": "assistant", "content": "A stock market rally is a period of sustained price increases. Features include:\n1. Rising stock prices\n2. Increased trading volume\n3. Positive market sentiment\n4. Can be sector-specific or broad\n\nRallies can last days to months. Remember that this is general information, not financial advice."}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
            {"role": "user", "content": "What is a stock market correction?"},
            {"role": "assistant", "content": "A stock market correction is a decline of 10% or more from recent highs. Key points include:\n1. Temporary price decline\n2. Normal market behavior\n3. Can last weeks to months\n4. Often presents buying opportunities\n\nCorrections are common and usually temporary. Remember that this is general information, not financial advice."}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
            {"role": "user", "content": "What is a stock market cycle?"},
            {"role": "assistant", "content": "A stock market cycle is the pattern of market movements over time. Phases include:\n1. Accumulation: Smart money buying\n2. Markup: Rising prices\n3. Distribution: Smart money selling\n4. Markdown: Falling prices\n\nCycles help understand market patterns. Remember that this is general information, not financial advice."}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
            {"role": "user", "content": "What is a stock market trend?"},
            {"role": "assistant", "content": "A stock market trend is the general direction of stock prices. Types include:\n1. Uptrend: Higher highs and higher lows\n2. Downtrend: Lower highs and lower lows\n3. Sideways: No clear direction\n\nTrends help identify market direction. Remember that this is general information, not financial advice."}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
            {"role": "user", "content": "What is a stock market indicator?"},
            {"role": "assistant", "content": "A stock market indicator is a tool used to predict market movements. Common indicators include:\n1. Moving averages\n2. RSI (Relative Strength Index)\n3. MACD (Moving Average Convergence Divergence)\n4. Volume indicators\n\nIndicators help analyze market conditions. Remember that this is general information, not financial advice."}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
            {"role": "user", "content": "What is a stock market pattern?"},
            {"role": "assistant", "content": "A stock market pattern is a recognizable price movement. Common patterns include:\n1. Head and shoulders\n2. Double top/bottom\n3. Triangles\n4. Flags and pennants\n\nPatterns help predict price movements. Remember that this is general information, not financial advice."}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
            {"role": "user", "content": "What is a stock market strategy?"},
            {"role": "assistant", "content": "A stock market strategy is a plan for investing. Common strategies include:\n1. Value investing: Finding undervalued stocks\n2. Growth investing: Focusing on high-growth companies\n3. Dividend investing: Seeking regular income\n4. Index investing: Following market indices\n\nChoose a strategy based on your goals. Remember that this is general information, not financial advice."}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
            {"role": "user", "content": "What is a stock market risk?"},
            {"role": "assistant", "content": "Stock market risk is the possibility of losing money. Types include:\n1. Market risk: Overall market decline\n2. Company risk: Specific company problems\n3. Sector risk: Industry-specific issues\n4. Liquidity risk: Can't sell quickly\n\nUnderstanding risk helps manage investments. Remember that this is general information, not financial advice."}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
            {"role": "user", "content": "What is a stock market return?"},
            {"role": "assistant", "content": "A stock market return is the profit or loss from an investment. Types include:\n1. Capital gains: Price appreciation\n2. Dividends: Regular payments\n3. Total return: Combined gains\n4. Annualized return: Yearly rate\n\nReturns measure investment performance. Remember that this is general information, not financial advice."}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
            {"role": "user", "content": "What is a stock market analysis?"},
            {"role": "assistant", "content": "Stock market analysis is the study of stocks and markets. Types include:\n1. Fundamental analysis: Company financials\n2. Technical analysis: Price patterns\n3. Sentiment analysis: Market mood\n4. Economic analysis: Overall conditions\n\nAnalysis helps make investment decisions. Remember that this is general information, not financial advice."}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "You are a knowledgeable stock market advisor. Provide accurate and helpful information about stocks, investing, and market analysis while maintaining appropriate disclaimers about financial advice."},
            {"role": "user", "content": "What is a stock market report?"},
            {"role": "assistant", "content": "A stock market report provides market information. Types include:\n1. Company earnings reports\n2. Economic reports\n3. Analyst reports\n4. Market summaries\n\nReports help stay informed. Remember that this is general information, not financial advice."}
        ]
    }
]

# Combine all training data
EXPANDED_STOCK_TRAINING_CONVERSATIONS = GENERAL_QUESTIONS + generate_stock_specific_data()

if __name__ == "__main__":
    # Save the expanded training data
    with open("expanded_stock_training_data.jsonl", "w") as f:
        for conversation in EXPANDED_STOCK_TRAINING_CONVERSATIONS:
            f.write(json.dumps(conversation) + "\n")
    print(f"Generated {len(EXPANDED_STOCK_TRAINING_CONVERSATIONS)} training conversations")
