# StockAI Assistant - Dual-Mode AI Chatbot

A sophisticated AI-powered application featuring a fine-tuned stock market advisor and general AI assistant with seamless mode switching capabilities.

## 🚀 Features

### Dual-Mode AI Assistant
- **📈 StockAI Assistant Mode**: Expert stock market advisor using fine-tuned GPT-3.5 model
  - Professional financial analysis and insights
  - Stock market trends and investment strategies
  - Real-time stock data integration
  - Specialized training on 300+ stocks and financial topics
- **🤖 General AI Mode**: Friendly conversational AI assistant
  - Natural language understanding
  - Helpful responses to any topic
  - Engaging dialogue capabilities

### 🎯 Mode Switching
- **Intuitive Toggle**: Mode switcher located in the top-right corner of the chat interface
- **Context-Aware**: Automatic welcome messages and responses based on selected mode
- **Visual Indicators**: Clear icons and labels for each mode (📈 Stock / 🤖 General)
- **Seamless Transition**: Instant switching between modes with preserved chat history

### 📊 Live Stock Market Features
- **Real-time Stock Updates**: Live price data for major stocks (AAPL, GOOGL, MSFT, AMZN, TSLA, META)
- **Interactive Widget**: Toggle stock updates widget (only available in Stock Mode)
- **Price Tracking**: Current price, change amount, and percentage change
- **Color-coded Display**: Green for gains, red for losses
- **Auto-refresh**: Updates every 30 seconds

### 🎨 Dynamic UI Features
- **Random Wallpaper Generator**: Generate new backgrounds with one click
- **Dark Theme**: Modern, professional dark interface
- **Responsive Design**: Works seamlessly on all screen sizes
- **Smooth Animations**: Polished transitions and loading indicators

### 💬 Chat Interface
- **Modern Design**: Clean, intuitive chat interface
- **Real-time Messaging**: Instant message updates
- **Loading States**: Visual feedback during AI processing
- **Auto-scroll**: Automatic scrolling to latest messages
- **Avatar Support**: User and AI avatars for better UX

## 🛠 Technical Architecture

### Frontend (React.js)
- **React 18** with modern hooks and functional components
- **Material-UI** for consistent, professional UI components
- **Axios** for API communication
- **Real-time Updates** with useEffect and intervals
- **Responsive Design** with CSS-in-JS styling

### Backend (Python/FastAPI)
- **FastAPI** for high-performance API endpoints
- **OpenAI Integration** with fine-tuned models
- **Context-Aware Routing** for different AI modes
- **Error Handling** with comprehensive logging
- **CORS Support** for cross-origin requests

### AI Models
- **Fine-tuned Stock Advisor**: Custom GPT-3.5 model trained on financial data
- **General AI**: Standard GPT-3.5-turbo for general queries
- **Context Switching**: Dynamic model selection based on user mode

### API Integrations
- **OpenAI API**: For AI responses and fine-tuned model access
- **Alpha Vantage API**: For real-time stock market data
- **Rate Limiting**: Built-in protection against API limits

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- OpenAI API key
- Alpha Vantage API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rahul-Kaura/ai-stock-advisor.git
   cd ai-stock-advisor
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   
   # Create .env file
   echo "OPENAI_API_KEY=your_openai_api_key" > .env
   echo "ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key" >> .env
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   python main.py
   ```
   Server runs on `http://localhost:8001`

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   Application opens at `http://localhost:3000`

## 📖 Usage Guide

### Switching Between Modes
1. **Open the Chat**: Click the AI Assistant icon on the main screen
2. **Locate Mode Switcher**: Find the toggle in the top-right corner of the chat
3. **Switch Modes**: Toggle between "Stock" and "General" modes
4. **Start Chatting**: The AI will respond based on the selected mode

### Stock Market Mode
- Ask about specific stocks: "Tell me about Apple stock"
- Get investment advice: "What are good investment strategies?"
- Market analysis: "What's happening in the tech sector?"
- Financial education: "Explain P/E ratios"

### General AI Mode
- General questions: "What's the weather like?"
- Help with tasks: "Help me plan a vacation"
- Learning: "Explain quantum physics"
- Casual conversation: "Tell me a joke"

### Stock Widget (Stock Mode Only)
- Click "Show Stock Updates" on the main screen
- View real-time prices for major stocks
- Monitor price changes and percentages
- Widget automatically hides when chat is open

### Background Customization
- Click "Generate Random Wallpaper" for new backgrounds
- Toggle between default and random backgrounds
- Smooth transitions between background changes

## 🔧 Configuration

### Environment Variables
```bash
# Backend (.env file)
OPENAI_API_KEY=your_openai_api_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
PORT=8001

# Frontend (.env file)
REACT_APP_API_URL=http://localhost:8001
```

### Customization Options
- **Stock Symbols**: Modify `STOCK_SYMBOLS` array in `frontend/src/App.js`
- **API Endpoints**: Update `API_ENDPOINT` in frontend configuration
- **UI Theme**: Customize colors in Material-UI theme configuration
- **Update Intervals**: Adjust stock refresh timing in the frontend

## 📈 Recent Updates

### Latest Features (v2.0)
- ✅ **Dual-Mode AI Assistant** with fine-tuned stock advisor
- ✅ **Intuitive Mode Switching** in chat interface
- ✅ **Live Stock Market Widget** with real-time updates
- ✅ **Dynamic Background Generation**
- ✅ **Enhanced Chat Interface** with modern design
- ✅ **Context-Aware Responses** based on selected mode
- ✅ **Professional Stock Analysis** with fine-tuned model
- ✅ **Responsive Design** for all devices

### Technical Improvements
- 🔧 **Fine-tuned Model Integration** for specialized stock advice
- 🔧 **Context-Aware API Routing** for different AI modes
- 🔧 **Real-time Stock Data** integration
- 🔧 **Error Handling** and rate limiting
- 🔧 **Performance Optimization** with efficient state management

## 🤝 Contributing

We welcome contributions! Please feel free to:
- Submit bug reports and feature requests
- Fork the repository and create pull requests
- Improve documentation and code quality
- Add new features and enhancements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rahul Kaura**
- GitHub: [@Rahul-Kaura](https://github.com/Rahul-Kaura)
- Project: [AI Stock Advisor](https://github.com/Rahul-Kaura/ai-stock-advisor)

---

**Built with ❤️ using React, Python, and OpenAI's fine-tuned models** 