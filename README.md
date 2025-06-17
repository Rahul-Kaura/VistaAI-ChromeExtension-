# AI Pitch Advisor

A sophisticated AI-powered application that combines stock market analysis with general AI assistance capabilities.

## Features

### Dual-Mode AI Assistant
- **Stock Market Mode**: Specialized in providing professional financial analysis and stock market insights
- **General AI Mode**: Friendly, conversational AI assistant for general queries and assistance

### Live Stock Market Ticker
- Real-time stock price updates for 50 major companies
- Displays 9 stocks at a time with automatic cycling every 10 seconds
- Shows current price, change, and percentage change
- Color-coded indicators for positive (green) and negative (red) changes
- Updates prices every 30 seconds
- Automatically hides when chat is open

### Dynamic Background
- Random wallpaper generation feature
- Toggle between default and random backgrounds
- Smooth transitions between backgrounds

### Chat Interface
- Clean, modern chat interface
- Real-time message updates
- Loading indicators for AI responses
- Easy mode switching between Stock and General AI
- Automatic welcome messages based on selected mode

### Stock Market Analysis Features
- Professional financial analysis
- Market trends and insights
- Investment strategies
- Stock-specific metrics and analysis
- Sector-wise market analysis

### General AI Assistant Features
- Friendly, conversational tone
- Natural language understanding
- Context-aware responses
- Helpful suggestions and recommendations
- Engaging dialogue capabilities

## Technical Details

### Frontend
- Built with React.js
- Material-UI components
- Real-time stock data integration with Alpha Vantage API
- Responsive design for all screen sizes

### Backend
- Python-based backend
- OpenAI API integration
- Fine-tuned models for both stock market and general assistance
- Efficient data caching and management

### API Integration
- Alpha Vantage API for real-time stock data
- OpenAI API for AI responses
- Rate limiting and error handling

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt

   # Frontend
   cd frontend
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the backend directory
   - Add your API keys:
     ```
     OPENAI_API_KEY=your_openai_api_key
     ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
     ```
4. Start the application:
   ```bash
   # Backend
   cd backend
   python main.py

   # Frontend
   cd frontend
   npm start
   ```

## Usage

1. **Stock Market Mode**
   - Click "Stock Market Mode" to access financial analysis
   - Ask questions about stocks, market trends, or investment strategies
   - View real-time stock updates in the ticker

2. **General AI Mode**
   - Click "General AI Mode" for general assistance
   - Engage in natural conversation
   - Get helpful responses to various queries

3. **Stock Ticker**
   - Click "Show Stock Updates" to view the live ticker
   - Watch as it cycles through different stocks
   - Monitor price changes in real-time

4. **Background**
   - Click "Generate Random Wallpaper" for a new background
   - Toggle between default and random backgrounds

## Recent Updates

- Added dual-mode AI assistant functionality
- Implemented live stock market ticker with cycling display
- Added dynamic background generation
- Enhanced chat interface with mode switching
- Improved stock market analysis capabilities
- Added friendly, conversational general AI mode
- Implemented automatic hiding of stock ticker when chat is open
- Added real-time price updates for stocks
- Enhanced UI/UX with smooth transitions and loading indicators

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details. 