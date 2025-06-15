# AI Assistant - Standalone Chat Application

A modern, full-screen chat interface powered by OpenAI's GPT model.

## Features
- Clean, modern UI with full-screen chat interface
- Real-time chat with AI assistant
- Responsive design
- Customizable appearance
- Background wallpaper option

## Local Development Setup

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     .\venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Create a `.env` file in the backend directory with:
   ```
   OPENAI_API_KEY=your_api_key_here
   CORS_ORIGINS=http://localhost:3000
   ```

6. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will run on http://localhost:8000

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The frontend will run on http://localhost:3000

## Usage
1. Open http://localhost:3000 in your browser
2. Type your message in the input field
3. Press Enter or click the send button to get AI responses

## API Endpoints
- `POST /chat`: Send messages to the AI
- `GET /health`: Check API health status

## Deployment Instructions

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8 or higher
- OpenAI API key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

5. Start the backend server:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```
   REACT_APP_BACKEND_URL=http://localhost:8000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

### Deployment Options

#### Option 1: Deploy to Vercel (Frontend) + Railway (Backend)
1. Frontend (Vercel):
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy

2. Backend (Railway):
   - Push your code to GitHub
   - Connect your repository to Railway
   - Set environment variables in Railway dashboard
   - Deploy

#### Option 2: Deploy to Netlify (Frontend) + Heroku (Backend)
1. Frontend (Netlify):
   - Push your code to GitHub
   - Connect your repository to Netlify
   - Set environment variables in Netlify dashboard
   - Deploy

2. Backend (Heroku):
   - Create a new Heroku app
   - Push your code to Heroku
   - Set environment variables in Heroku dashboard
   - Deploy

## Environment Variables

### Backend (.env)
```
OPENAI_API_KEY=your_api_key_here
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=your_backend_url_here
```

## Development
- Frontend runs on port 3000
- Backend runs on port 8000
- CORS is configured to allow all origins in development

## Production
- Update CORS settings in backend/main.py to only allow your frontend domain
- Set appropriate environment variables
- Enable HTTPS
- Configure proper error handling and logging

## License
MIT License 