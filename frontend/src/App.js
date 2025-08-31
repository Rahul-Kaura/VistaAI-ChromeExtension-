import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, TextField, IconButton, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, Switch, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import EditIcon from '@mui/icons-material/Edit';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4CAF50',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const ALPHA_VANTAGE_API_KEY = 'OOPIZLORS9B08GN4';
const STOCK_SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META'];
const API_ENDPOINT = process.env.REACT_APP_API_URL || 'http://localhost:8001';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isStockMode, setIsStockMode] = useState(true); // true for stock mode, false for general AI
  const messagesEndRef = useRef(null);
  const welcomeShown = useRef(false);
  const defaultAvatar = "./gpt_logo.png";
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [showStockWidget, setShowStockWidget] = useState(false);
  const [currentStocks, setCurrentStocks] = useState([]);
  
  // New personalization states
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [location] = useState('San Francisco, CA');
  const [showTodoDialog, setShowTodoDialog] = useState(false);
  const [todos, setTodos] = useState([
    { id: 1, text: 'Review stock portfolio', completed: false },
    { id: 2, text: 'Check market trends', completed: false },
    { id: 3, text: 'Update investment strategy', completed: false }
  ]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    if (!welcomeShown.current) {
      const welcomeMessage = isStockMode 
        ? `Welcome ${userName ? userName + '!' : 'to StockAI Assistant!'} I'm your expert stock market advisor. Ask me about stocks, investing strategies, market analysis, or any financial topics. How can I help you today?`
        : `Welcome ${userName ? userName + '!' : 'to General AI Assistant!'} I'm here to help with any questions you might have. What would you like to know?`;
      
      setMessages([{
        text: welcomeMessage,
        sender: 'ai',
        avatar: defaultAvatar
      }]);
      welcomeShown.current = true;
    }
    // Fetch real stock prices initially and then every 30 seconds
    generateStockPrices();
    const interval = setInterval(generateStockPrices, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [isStockMode, userName]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateRandomWallpaper = () => {
    // Using Lorem Picsum for random images without an API key
    setBackgroundUrl(`https://picsum.photos/1920/1080?random=${Math.random()}`);
  };

  const generateStockPrices = async () => {
    try {
      const stocks = await Promise.all(
        STOCK_SYMBOLS.map(async (symbol) => {
          const response = await axios.get(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
          );
          const data = response.data['Global Quote'];
          return {
            ticker: symbol,
            price: parseFloat(data['05. price']).toFixed(2),
            change: parseFloat(data['09. change']).toFixed(2),
            changePercent: data['10. change percent'].replace('%', '')
          };
        })
      );
      setCurrentStocks(stocks);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      // Fallback to mock data if API fails
      const mockStocks = STOCK_SYMBOLS.map(ticker => ({
        ticker: ticker,
        price: (Math.random() * (500 - 100) + 100).toFixed(2),
        change: (Math.random() * (10 - (-5)) + (-5)).toFixed(2),
        changePercent: (Math.random() * (5 - (-2)) + (-2)).toFixed(2)
      }));
      setCurrentStocks(mockStocks);
    }
  };

  // New personalization functions
  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      setShowNameInput(false);
      // Update welcome message with new name
      const welcomeMessage = isStockMode 
        ? `Welcome ${userName}! I'm your expert stock market advisor. Ask me about stocks, investing strategies, market analysis, or any financial topics. How can I help you today?`
        : `Welcome ${userName}! I'm here to help with any questions you might have. What would you like to know?`;
      
      setMessages([{
        text: welcomeMessage,
        sender: 'ai',
        avatar: defaultAvatar
      }]);
      welcomeShown.current = true;
    }
  };

  const handleEditName = () => {
    setShowNameInput(true);
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo.trim(), completed: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      text: inputMessage,
      sender: 'user',
      avatar: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        API_ENDPOINT + '/chat',
        { 
          message: inputMessage,
          context: isStockMode ? 'stock_market' : 'general'
        }
      );

      const aiMessage = { 
        text: response.data.response, 
        sender: 'ai', 
        avatar: defaultAvatar 
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        text: 'Sorry, I encountered an error. Please try again.', 
        sender: 'ai', 
        avatar: defaultAvatar 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeToggle = () => {
    setIsStockMode(!isStockMode);
    // Clear messages and show new welcome message
    const welcomeMessage = !isStockMode 
      ? `Welcome ${userName ? userName + '!' : 'to StockAI Assistant!'} I'm your expert stock market advisor. Ask me about stocks, investing strategies, market analysis, or any financial topics. How can I help you today?`
      : `Welcome ${userName ? userName + '!' : 'to General AI Assistant!'} I'm here to help with any questions you might have. What would you like to know?`;
    
    setMessages([{
      text: welcomeMessage,
      sender: 'ai',
      avatar: defaultAvatar
    }]);
    welcomeShown.current = true;
  };

  const toggleStockWidget = () => {
    setShowStockWidget(!showStockWidget);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && !welcomeShown.current && userName) {
      // Show personalized welcome message when opening chat for the first time
      const welcomeMessage = isStockMode 
        ? `Welcome ${userName}! I'm your expert stock market advisor. Ask me about stocks, investing strategies, market analysis, or any financial topics. How can I help you today?`
        : `Welcome ${userName}! I'm here to help with any questions you might have. What would you like to know?`;
      
      setMessages([{
        text: welcomeMessage,
        sender: 'ai',
        avatar: defaultAvatar
      }]);
      welcomeShown.current = true;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App" style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: isOpen ? '0' : '10vh',
        backgroundColor: 'rgb(52, 53, 65)',
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Location Display - Top Left */}
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          padding: '10px 15px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 1000
        }}>
          <LocationOnIcon style={{ fontSize: '1.2rem', color: '#4CAF50' }} />
          <span style={{ fontSize: '1rem', fontWeight: '500' }}>{location}</span>
        </div>

        <h1 style={{
          color: 'rgb(236, 236, 241)',
          marginBottom: '2rem',
          textAlign: 'center',
          fontSize: '3.5rem',
          fontWeight: 'bold',
          opacity: backgroundUrl ? '0.6' : '1',
          transition: 'opacity 0.3s ease-in-out',
          display: isOpen ? 'none' : 'block',
        }}>
          {isStockMode ? 'StockAI Assistant' : 'AI Assistant'}
        </h1>

        {/* Name Input Section - Center */}
        {showNameInput && !isOpen && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '2rem',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            padding: '20px',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            minWidth: '300px'
          }}>
            <Typography variant="h6" style={{ color: 'white', margin: 0 }}>
              Welcome! What's your name?
            </Typography>
            <form onSubmit={handleNameSubmit} style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <TextField
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                variant="outlined"
                size="small"
                style={{ flex: 1 }}
                InputProps={{
                  style: { 
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px'
                  }
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!userName.trim()}
                style={{ minWidth: '80px' }}
              >
                Start
              </Button>
            </form>
          </div>
        )}

        {/* Welcome Message with Name - Center */}
        {!showNameInput && !isOpen && userName && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '2rem',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            padding: '20px',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            minWidth: '300px'
          }}>
            <Typography variant="h5" style={{ color: 'white', margin: 0, textAlign: 'center' }}>
              Welcome back, {userName}! 👋
            </Typography>
            <Button
              onClick={handleEditName}
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              style={{ 
                color: 'white', 
                borderColor: 'rgba(255, 255, 255, 0.3)',
                fontSize: '0.8rem'
              }}
            >
              Change Name
            </Button>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '220px',
            height: '220px',
            cursor: 'pointer',
            boxShadow: 'none',
            display: isOpen ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            marginBottom: '0.5rem',
            padding: 0,
            opacity: backgroundUrl ? '0.3' : '1',
            transition: 'opacity 0.3s ease-in-out'
          }}
        >
          <img
            src={defaultAvatar}
            alt="Chat"
            style={{ 
              width: '140px', 
              height: '140px',
              objectFit: 'cover',
              clipPath: 'circle(50% at 50% 50%)'
            }}
          />
        </button>
        <div style={{
          color: 'white',
          fontSize: '1.2rem',
          marginBottom: '2rem',
          opacity: '1',
          fontWeight: '500'
        }}>
          (Personal Chatbot V1)
        </div>

        {/* To-Do Button - Bottom Right */}
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          display: isOpen ? 'none' : 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          zIndex: '1000',
        }}>
          <Button
            onClick={() => setShowTodoDialog(true)}
            variant="contained"
            color="secondary"
            startIcon={<CheckBoxIcon />}
            style={{
              backgroundColor: 'rgba(156, 39, 176, 0.8)',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: 'bold',
              minWidth: '140px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
            }}
          >
            To-Do List
          </Button>
          <Typography variant="caption" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
            {todos.filter(t => !t.completed).length} tasks pending
          </Typography>
        </div>

        <div style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: isOpen ? 'none' : 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px',
          zIndex: '1000',
          padding: '20px',
        }}>
          <button
            onClick={backgroundUrl ? () => setBackgroundUrl(null) : generateRandomWallpaper}
            style={{
              backgroundColor: backgroundUrl ? 'rgba(0, 0, 0, 0.7)' : 'transparent',
              color: 'white',
              border: backgroundUrl ? '1px solid rgba(0, 0, 0, 0.7)' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '5px',
              padding: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              boxShadow: 'none',
              minWidth: '200px',
              textAlign: 'center',
              transition: 'all 0.3s ease-in-out',
              opacity: backgroundUrl ? '0.3' : '1',
            }}
          >
            {backgroundUrl ? 'Hide Random Wallpaper' : 'Generate Random Wallpaper'}
          </button>
          {isStockMode && (
            <button
              onClick={toggleStockWidget}
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '5px',
                padding: '10px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                boxShadow: 'none',
                minWidth: '200px',
                textAlign: 'center',
                opacity: backgroundUrl ? '0.3' : '1',
              }}
            >
              {showStockWidget ? 'Hide Stock Updates' : 'Show Stock Updates'}
            </button>
          )}
          <div style={{
            backgroundColor: 'transparent',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '1.2rem',
            opacity: '1',
            transition: 'none',
            fontWeight: '500'
          }}>
            By: Rahul Kaura
          </div>
        </div>

        {isOpen && (
          <Paper
            elevation={3}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'rgb(52, 53, 65)',
              borderRadius: '0',
              overflow: 'hidden',
              zIndex: 1000
            }}
          >
            <Box
              style={{
                padding: '10px',
                backgroundColor: 'rgb(64, 65, 79)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Typography variant="h6" style={{ color: 'white' }}>
                  {isStockMode ? 'StockAI Assistant' : 'AI Assistant'}
                </Typography>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '5px',
                  fontSize: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.7)'
                }}>
                  {isStockMode ? (
                    <>
                      <TrendingUpIcon style={{ fontSize: '1rem', color: '#4CAF50' }} />
                      <span>Stock Mode</span>
                    </>
                  ) : (
                    <>
                      <SmartToyIcon style={{ fontSize: '1rem', color: '#f50057' }} />
                      <span>General AI</span>
                    </>
                  )}
                </div>
                {isLoading && (
                  <Typography variant="body2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    AI is typing...
                  </Typography>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'white',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUpIcon style={{ fontSize: '0.9rem', color: '#4CAF50' }} />
                    <span>Stock</span>
                  </div>
                  <Switch
                    checked={!isStockMode}
                    onChange={handleModeToggle}
                    color="primary"
                    size="small"
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>General</span>
                    <SmartToyIcon style={{ fontSize: '0.9rem', color: '#f50057' }} />
                  </div>
                </div>
                <IconButton onClick={() => setIsOpen(false)} size="small">
                  <CloseIcon style={{ color: 'white' }} />
                </IconButton>
              </div>
            </Box>

            <List
              style={{
                flex: 1,
                overflow: 'auto',
                padding: '10px',
                backgroundColor: 'rgb(52, 53, 65)',
              }}
            >
              {messages.map((message, index) => (
                <ListItem
                  key={index}
                  style={{
                    flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                    padding: '8px',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={message.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={message.text}
                    style={{
                      backgroundColor: message.sender === 'user' ? 'rgb(64, 65, 79)' : 'rgb(68, 70, 84)',
                      padding: '10px',
                      borderRadius: '10px',
                      maxWidth: '80%',
                      margin: message.sender === 'user' ? '0 10px 0 0' : '0 0 0 10px',
                    }}
                  />
                </ListItem>
              ))}
              <div ref={messagesEndRef} />
            </List>

            <Box
              component="form"
              onSubmit={handleSubmit}
              style={{
                padding: '10px',
                backgroundColor: 'rgb(64, 65, 79)',
                display: 'flex',
                gap: '10px',
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isLoading}
                style={{
                  backgroundColor: 'rgb(52, 53, 65)',
                  borderRadius: '5px',
                }}
                InputProps={{
                  style: { color: 'white' },
                }}
              />
              <IconButton
                type="submit"
                color="primary"
                disabled={isLoading || !inputMessage.trim()}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Paper>
        )}
        {showStockWidget && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: 'rgba(52, 53, 65, 0.9)',
            padding: '15px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            minWidth: '250px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ 
              margin: '0 0 10px 0', 
              color: 'white',
              fontSize: '1.1rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '5px'
            }}>
              Live Stock Updates
            </h3>
            {currentStocks.map((stock) => (
              <div key={stock.ticker} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
                padding: '5px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <span style={{ color: 'white', fontWeight: 'bold' }}>{stock.ticker}</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'white' }}>${stock.price}</div>
                  <div style={{ 
                    color: parseFloat(stock.change) >= 0 ? '#4CAF50' : '#f44336',
                    fontSize: '0.9rem'
                  }}>
                    {parseFloat(stock.change) >= 0 ? '+' : ''}{stock.change} ({stock.changePercent}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* To-Do Dialog */}
        <Dialog 
          open={showTodoDialog} 
          onClose={() => setShowTodoDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            style: {
              backgroundColor: 'rgb(52, 53, 65)',
              color: 'white',
              borderRadius: '15px'
            }
          }}
        >
          <DialogTitle style={{ 
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>📋 To-Do List</span>
            <IconButton 
              onClick={() => setShowTodoDialog(false)}
              style={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent style={{ paddingTop: '20px' }}>
            {/* Add New Todo */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <TextField
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new task..."
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  style: { 
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px'
                  }
                }}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              />
              <Button
                onClick={addTodo}
                variant="contained"
                color="primary"
                disabled={!newTodo.trim()}
                style={{ minWidth: '80px' }}
              >
                Add
              </Button>
            </div>

            {/* Todo List */}
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {todos.length === 0 ? (
                <Typography style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)', fontStyle: 'italic' }}>
                  No tasks yet. Add one above!
                </Typography>
              ) : (
                todos.map((todo) => (
                  <div key={todo.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px',
                    marginBottom: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <CheckBoxIcon 
                      onClick={() => toggleTodo(todo.id)}
                      style={{ 
                        cursor: 'pointer',
                        color: todo.completed ? '#4CAF50' : 'rgba(255, 255, 255, 0.6)',
                        fontSize: '1.2rem'
                      }}
                    />
                    <span style={{
                      flex: 1,
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed ? 'rgba(255, 255, 255, 0.6)' : 'white',
                      fontSize: '0.9rem'
                    }}>
                      {todo.text}
                    </span>
                    <IconButton
                      onClick={() => deleteTodo(todo.id)}
                      size="small"
                      style={{ 
                        color: '#f44336',
                        padding: '4px'
                      }}
                    >
                      <CloseIcon style={{ fontSize: '1rem' }} />
                    </IconButton>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
          
          <DialogActions style={{ 
            padding: '15px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Button 
              onClick={() => setShowTodoDialog(false)}
              variant="outlined"
              style={{ 
                color: 'white', 
                borderColor: 'rgba(255, 255, 255, 0.3)'
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <style jsx>{`
          .rcw-widget-container {
            background-color: rgb(52, 53, 65) !important;
            box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2) !important;
            border-radius: 0 !important;
            height: 100vh !important;
            width: 400px !important;
            right: 0 !important;
            left: auto !important;
          }
          .rcw-conversation-container {
            background-color: rgb(52, 53, 65) !important;
          }
          .rcw-header {
            background-color: rgb(52, 53, 65) !important;
            padding: 15px !important;
          }
          .rcw-title {
            color: white !important;
          }
          .rcw-subtitle {
            color: rgba(255, 255, 255, 0.7) !important;
          }
          .rcw-message {
            margin: 10px 0 !important;
          }
          .rcw-client {
            background-color: #4CAF50 !important;
            color: white !important;
          }
          .rcw-response {
            background-color: rgb(68, 70, 84) !important;
            color: white !important;
          }
          .rcw-sender {
            color: rgba(255, 255, 255, 0.7) !important;
          }
          .rcw-new-message {
            background-color: rgb(52, 53, 65) !important;
            border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
          }
          .rcw-input {
            background-color: rgb(68, 70, 84) !important;
            color: white !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
          }
          .rcw-send-button {
            background-color: #4CAF50 !important;
          }
          .rcw-close-button {
            color: white !important;
          }
        `}</style>
      </div>
    </ThemeProvider>
  );
}

export default App;