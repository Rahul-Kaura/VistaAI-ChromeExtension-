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
  const [isStockMode, setIsStockMode] = useState(false); // false for general AI (default), true for stock mode
  const messagesEndRef = useRef(null);
  const welcomeShown = useRef(false);
  const defaultAvatar = "./gpt_logo.png";
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [isTimelapseMode, setIsTimelapseMode] = useState(true);
  const [showStockWidget, setShowStockWidget] = useState(false);
  const [isVideoBackground, setIsVideoBackground] = useState(false);
  const [currentStocks, setCurrentStocks] = useState([]);
  
  // New personalization states
  const [userName, setUserName] = useState(() => {
    // Load name from localStorage on component mount
    return localStorage.getItem('ai-pitch-advisor-username') || '';
  });
  const [showNameInput, setShowNameInput] = useState(() => {
    // Only show name input if no name is stored
    return !localStorage.getItem('ai-pitch-advisor-username');
  });
  const [location] = useState('San Francisco, CA');
  const [showTodoDialog, setShowTodoDialog] = useState(false);
  const [todos, setTodos] = useState(() => {
    // Load todos from localStorage
    const savedTodos = localStorage.getItem('ai-pitch-advisor-todos');
    return savedTodos ? JSON.parse(savedTodos) : [
    { id: 1, text: 'Review stock portfolio', completed: false },
    { id: 2, text: 'Check market trends', completed: false },
    { id: 3, text: 'Update investment strategy', completed: false }
    ];
  });
  const [newTodo, setNewTodo] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [wallpaperLocation, setWallpaperLocation] = useState('Golden Gate Bridge, San Francisco');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Save userName to localStorage whenever it changes
  useEffect(() => {
    if (userName) {
      localStorage.setItem('ai-pitch-advisor-username', userName);
    }
  }, [userName]);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ai-pitch-advisor-todos', JSON.stringify(todos));
  }, [todos]);

  // Get user location and weather on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  // Get weather when location is available
  useEffect(() => {
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      getWeatherData(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation]);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  // Initialize timelapse wallpaper on component mount
  useEffect(() => {
    if (isTimelapseMode) {
      const timelapseUrl = getTimelapseWallpaper();
      console.log('Setting timelapse wallpaper:', timelapseUrl);
      setBackgroundUrl(timelapseUrl);
      setWallpaperLocation('Golden Gate Bridge, San Francisco');
    }
  }, [isTimelapseMode]);

  // Set up video timelapse on app start
  useEffect(() => {
    console.log('Setting up video timelapse...');
    setIsVideoBackground(true);
    setWallpaperLocation('Golden Gate Bridge, San Francisco');
  }, []);

  // Update timelapse wallpaper every hour
  useEffect(() => {
    if (isTimelapseMode) {
      const interval = setInterval(() => {
        setBackgroundUrl(getTimelapseWallpaper());
      }, 60 * 60 * 1000); // Update every hour

      return () => clearInterval(interval);
    }
  }, [isTimelapseMode]);

  const getTimelapseWallpaper = () => {
    // Return the local MP4 video file for timelapse mode
    return './13403997_1920_1080_24fps.mp4';
  };

  const generateRandomWallpaper = async () => {
    // Switch to manual wallpaper mode
    setIsTimelapseMode(false);
    setIsVideoBackground(false);
    
    // Use Lorem Picsum for reliable random wallpapers
    const randomId = Math.floor(Math.random() * 1000) + 1;
    const newWallpaperUrl = `https://picsum.photos/1920/1080?random=${randomId}`;
    
    setBackgroundUrl(newWallpaperUrl);
    
    // Set a random location for the wallpaper
    const locations = [
      'Tham Sa Koen, Thailand',
      'Santorini, Greece', 
      'Machu Picchu, Peru',
      'Bali, Indonesia',
      'Swiss Alps, Switzerland',
      'Patagonia, Argentina',
      'Iceland',
      'New Zealand',
      'Norway',
      'Japan'
    ];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    setWallpaperLocation(randomLocation);
  };

  const switchToTimelapse = () => {
    console.log('Switching to timelapse mode...');
    setIsTimelapseMode(true);
    setIsVideoBackground(true);
    setWallpaperLocation('Golden Gate Bridge, San Francisco');
  };

  const testGoldenGateBridge = () => {
    const testUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
    console.log('Testing Golden Gate Bridge URL:', testUrl);
    setBackgroundUrl(testUrl);
    setWallpaperLocation('Golden Gate Bridge, San Francisco');
  };

  const playMotivationalAudio = () => {
    if (isPlayingAudio) return;
    
    setIsPlayingAudio(true);
    
    // David Goggins actual voice clips from his motivational speeches
    const davidGogginsClips = [
      // These are actual David Goggins audio clips from his speeches
      // You would need to extract these from YouTube videos and host them
      'https://www.youtube.com/watch?v=vmFXe0gYnZE&t=30s', // "Stay hard!" clip
      'https://www.youtube.com/watch?v=vmFXe0gYnZE&t=45s', // "Who's gonna carry the boats?" clip
      'https://www.youtube.com/watch?v=vmFXe0gYnZE&t=60s', // "You don't know me son!" clip
      'https://www.youtube.com/watch?v=vmFXe0gYnZE&t=75s', // "40% rule" clip
      'https://www.youtube.com/watch?v=vmFXe0gYnZE&t=90s', // "Can't hurt me" clip
      'https://www.youtube.com/watch?v=vmFXe0gYnZE&t=105s', // "Mind is the strongest" clip
      'https://www.youtube.com/watch?v=vmFXe0gYnZE&t=120s', // "Push through pain" clip
      'https://www.youtube.com/watch?v=vmFXe0gYnZE&t=135s', // "Willing to die" clip
      'https://www.youtube.com/watch?v=vmFXe0gYnZE&t=150s', // "Show you capable" clip
      'https://www.youtube.com/watch?v=vmFXe0gYnZE&t=165s', // "Don't give up" clip
      // Alternative David Goggins clips from other videos
      'https://www.youtube.com/watch?v=vmFXe0gYnZE&t=180s', // "Never quit" clip
      'https://www.youtube.com/watch?v=vmFXe0gYnZE&t=195s', // "Stay focused" clip
      'https://www.youtube.com/watch?v=vmFXe0gYnZE&t=210s', // "You got this" clip
      'https://www.youtube.com/watch?v=vmFXe0gYnZE&t=225s', // "Believe in yourself" clip
      'https://www.youtube.com/watch?v=vmFXe0gYnZE&t=240s', // "Keep pushing" clip
      // Additional Goggins motivational clips
      'https://www.youtube.com/watch?v=vmFXe0gYnZE&t=255s', // "Stronger than you think" clip
      'https://www.youtube.com/watch?v=vmFXe0gYnZE&t=270s', // "Success is coming" clip
      'https://www.youtube.com/watch?v=vmFXe0gYnZE&t=285s', // "Almost there" clip
      'https://www.youtube.com/watch?v=vmFXe0gYnZE&t=300s', // "You're capable" clip
      'https://www.youtube.com/watch?v=vmFXe0gYnZE&t=315s'  // "Never surrender" clip
    ];
    
    const randomAudioUrl = davidGogginsClips[Math.floor(Math.random() * davidGogginsClips.length)];
    
    const audio = new Audio(randomAudioUrl);
    
    audio.onended = () => {
      setIsPlayingAudio(false);
    };
    
    audio.onerror = () => {
      console.error('David Goggins audio failed to load');
      setIsPlayingAudio(false);
      // Show David Goggins quote as fallback
      const gogginsQuotes = [
        "Stay hard! You don't know me son!",
        "Who's gonna carry the boats? Who's gonna carry the logs?",
        "When you think you're done, you're only 40% done!",
        "You can't hurt a guy who's willing to die!",
        "You don't know me son! You don't know what I'm capable of!",
        "Don't give up! Never give up!",
        "Stay focused! You're almost there!",
        "Push through the pain! You've got this!",
        "Never quit! Never surrender!",
        "You're capable of amazing things!"
      ];
      
      const randomQuote = gogginsQuotes[Math.floor(Math.random() * gogginsQuotes.length)];
      alert(`${randomQuote} 💪\n\n- David Goggins`);
    };
    
    audio.play().catch(error => {
      console.error('David Goggins audio play failed:', error);
      setIsPlayingAudio(false);
      // Show David Goggins quote as fallback
      const gogginsQuotes = [
        "Stay hard! You don't know me son!",
        "Who's gonna carry the boats?",
        "When you think you're done, you're only 40% done!",
        "You can't hurt a guy who's willing to die!",
        "You don't know me son!"
      ];
      
      const randomQuote = gogginsQuotes[Math.floor(Math.random() * gogginsQuotes.length)];
      alert(`${randomQuote} 💪\n\n- David Goggins`);
    });
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        
        // Get city name using reverse geocoding
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          setUserLocation(prev => ({
            ...prev,
            city: data.city || data.locality,
            country: data.countryName,
            region: data.principalSubdivision
          }));
        } catch (error) {
          console.error('Error getting location name:', error);
          setUserLocation(prev => ({
            ...prev,
            city: 'Unknown',
            country: 'Unknown'
          }));
        }
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsLoadingLocation(false);
        // Fallback to default location
        setUserLocation({
          latitude: 37.7749,
          longitude: -122.4194,
          city: 'San Francisco',
          country: 'United States',
          region: 'California'
        });
      }
    );
  };

  const getWeatherData = async (lat, lon) => {
    if (!lat || !lon) return;
    
    setIsLoadingWeather(true);
    try {
      // Try using a free weather API first (wttr.in)
      const response = await fetch(
        `https://wttr.in/${lat},${lon}?format=j1`
      );
      const data = await response.json();
      setWeather({
        temperature: Math.round(parseFloat(data.current_condition[0].temp_C)),
        description: data.current_condition[0].weatherDesc[0].value,
        icon: data.current_condition[0].weatherCode,
        humidity: parseInt(data.current_condition[0].humidity),
        windSpeed: parseInt(data.current_condition[0].windspeedKmph)
      });
    } catch (error) {
      console.error('Error fetching weather:', error);
      // Fallback weather data based on location
      const weatherOptions = [
        { temp: 25, desc: 'Sunny', icon: '01d' },
        { temp: 18, desc: 'Partly cloudy', icon: '02d' },
        { temp: 15, desc: 'Cloudy', icon: '03d' },
        { temp: 12, desc: 'Rainy', icon: '10d' },
        { temp: 8, desc: 'Foggy', icon: '50d' }
      ];
      const randomWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
      setWeather({
        temperature: randomWeather.temp,
        description: randomWeather.desc,
        icon: randomWeather.icon,
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 15) + 5
      });
    }
    setIsLoadingWeather(false);
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
      setIsAnimating(true);
      
      // Add a small delay for animation effect
      setTimeout(() => {
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
        setIsAnimating(false);
      }, 300);
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

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim() && !selectedImage) return;

    // Open chat if not already open
    if (!isOpen) {
      setIsOpen(true);
    }

    const userMessage = {
      text: searchQuery || (selectedImage ? '[Image attached]' : ''),
      sender: 'user',
      avatar: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
      image: selectedImage
    };

    setMessages((prev) => [...prev, userMessage]);
    setSearchQuery('');
    setSelectedImage(null);
    setImagePreview(null);
    setIsLoading(true);

    try {
      const response = await axios.post(
        API_ENDPOINT + '/chat',
        { 
          message: searchQuery || 'Please analyze this image',
          context: isStockMode ? 'stock_market' : 'general',
          image: selectedImage
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

  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setIsListening(true);

    recognition.onstart = () => {
      console.log('Voice recognition started');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
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
        paddingTop: isOpen ? '0' : '5vh',
        backgroundColor: 'rgb(52, 53, 65)',
        backgroundImage: !isVideoBackground && backgroundUrl ? `url(${backgroundUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Video Background for Timelapse */}
        {isVideoBackground && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            overflow: 'hidden'
          }}>
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'translate(-50%, -50%)',
                minWidth: '100%',
                minHeight: '100%'
              }}
              onError={(e) => {
                console.error('Video failed to load:', e);
                // Fallback to image if video fails
                setIsVideoBackground(false);
                setBackgroundUrl('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
              }}
            >
              <source src="./13403997_1920_1080_24fps.mp4" type="video/mp4" />
              <source src="/13403997_1920_1080_24fps.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* Location & Weather Display - Top Right */}
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          display: isOpen ? 'none' : 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '8px',
          zIndex: 1000
        }}>
          {/* Weather */}
          {weather && (
            <div style={{
              display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'white',
              fontSize: '0.9rem',
              fontWeight: '500',
              textAlign: 'right'
            }}>
              <span style={{ fontSize: '1.2rem' }}>{weather.temperature}°</span>
              <span style={{ 
                fontSize: '0.8rem', 
                opacity: 0.8,
                textTransform: 'capitalize'
              }}>
                {weather.description}
              </span>
        </div>
          )}

          {/* Location */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: 'white',
            fontSize: '0.85rem',
            fontWeight: '400',
            textAlign: 'right',
            opacity: 0.7,
            transition: 'opacity 0.3s ease-in-out'
          }}>
            <LocationOnIcon style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }} />
            <span>
              {isLoadingLocation ? 'Getting location...' : 
               userLocation?.city ? `${userLocation.city}` : 
               'Unknown Location'}
            </span>
          </div>

          {/* LOCK IN Button */}
          <button
            onClick={playMotivationalAudio}
            disabled={isPlayingAudio}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '8px 16px',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: isPlayingAudio ? 'not-allowed' : 'pointer',
              opacity: isPlayingAudio ? 0.5 : 0.8,
              transition: 'all 0.3s ease-in-out',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              minWidth: '80px',
              textAlign: 'center',
              backdropFilter: 'blur(5px)',
            }}
            onMouseEnter={(e) => {
              if (!isPlayingAudio) {
                e.target.style.opacity = '1';
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                e.target.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isPlayingAudio) {
                e.target.style.opacity = '0.8';
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                e.target.style.transform = 'scale(1)';
              }
            }}
          >
            {isPlayingAudio ? 'PLAYING...' : 'LOCK IN'}
          </button>
        </div>

        {/* Flip Clock - Center */}
        {!isOpen && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          marginBottom: '2rem',
          textAlign: 'center',
          }}>
            {/* Flip Clock Display */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'monospace',
              fontSize: '2.5rem',
          fontWeight: 'bold',
              color: 'white',
              textShadow: '0 4px 8px rgba(0,0,0,0.8)',
              opacity: backgroundUrl ? '0.9' : '1',
          transition: 'opacity 0.3s ease-in-out',
            }}>
              {/* Hours */}
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '8px 10px',
                minWidth: '50px',
                textAlign: 'center',
                backdropFilter: 'blur(5px)',
              }}>
                {(() => {
                  const hours = currentTime.getHours();
                  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
                  return displayHours.toString().padStart(2, '0');
                })()}
              </div>
              
              {/* Colon */}
              <div style={{
                color: 'rgba(255, 255, 255, 0.8)',
                animation: 'blink 2s infinite',
                fontSize: '2rem',
              }}>
                :
              </div>
              
              {/* Minutes */}
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '8px 10px',
                minWidth: '50px',
                textAlign: 'center',
                backdropFilter: 'blur(5px)',
              }}>
                {currentTime.getMinutes().toString().padStart(2, '0')}
              </div>
              
              {/* Colon */}
              <div style={{
                color: 'rgba(255, 255, 255, 0.8)',
                animation: 'blink 2s infinite',
                fontSize: '2rem',
              }}>
                :
              </div>
              
              {/* Seconds */}
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '8px 10px',
                minWidth: '50px',
                textAlign: 'center',
                backdropFilter: 'blur(5px)',
              }}>
                {currentTime.getSeconds().toString().padStart(2, '0')}
              </div>
              
              {/* AM/PM Indicator */}
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '8px 10px',
                minWidth: '40px',
                textAlign: 'center',
                backdropFilter: 'blur(5px)',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 4px 8px rgba(0,0,0,0.8)',
              }}>
                {currentTime.getHours() >= 12 ? 'PM' : 'AM'}
              </div>
            </div>

            {/* Date Display */}
            <div style={{
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '400',
              textShadow: '0 2px 4px rgba(0,0,0,0.7)',
              opacity: backgroundUrl ? '0.7' : '1',
              transition: 'opacity 0.3s ease-in-out',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}>
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'short',
                month: 'short', 
                day: 'numeric' 
              })}
            </div>

            {/* Welcome Back Greeting - Subtle */}
            {userName && (
              <div style={{
                color: 'white',
                fontSize: '0.85rem',
                fontWeight: '400',
                textShadow: '0 2px 4px rgba(0,0,0,0.7)',
                opacity: backgroundUrl ? '0.6' : '0.8',
                transition: 'opacity 0.3s ease-in-out',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}>
                Welcome back, {userName}.
              </div>
            )}
          </div>
        )}

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
            minWidth: '300px',
            animation: isAnimating ? 'fadeOut 0.3s ease-out forwards' : 'fadeIn 0.5s ease-in',
            transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
            transition: 'all 0.3s ease-in-out'
          }}>
            <Typography variant="h6" style={{ 
              color: 'white', 
              margin: 0,
              animation: 'pulse 2s infinite'
            }}>
              Welcome! What's your name? 👋
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
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#4CAF50',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4CAF50',
                    },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!userName.trim() || isAnimating}
                style={{ 
                  minWidth: '80px',
                  transition: 'all 0.3s ease',
                  transform: !userName.trim() ? 'scale(0.95)' : 'scale(1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {isAnimating ? (
                  <span style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '5px',
                    animation: 'pulse 1s infinite'
                  }}>
                    ✨ Processing...
                  </span>
                ) : (
                  'Start'
                )}
              </Button>
            </form>
          </div>
        )}

        {/* Search Bar - Bottom Left */}
        {!isOpen && (
          <div style={{
            position: 'fixed',
            bottom: '30px',
            left: '30px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            alignItems: 'flex-start'
          }}>
            {/* Mode Toggle */}
            <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
              padding: '8px 12px',
              borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            color: 'white',
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <SmartToyIcon style={{ fontSize: '0.9rem', color: '#f50057' }} />
                <span>General</span>
              </div>
              <Switch
                checked={isStockMode}
                onChange={handleModeToggle}
                color="primary"
              size="small"
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>Stock</span>
                <TrendingUpIcon style={{ fontSize: '0.9rem', color: '#4CAF50' }} />
              </div>
            </div>

            {/* Search Bar with Rainbow Border */}
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
              <div style={{
                position: 'relative',
                padding: '3px',
                borderRadius: '28px',
                background: 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)',
                backgroundSize: '400% 400%',
                animation: 'rainbowShift 3s ease infinite',
                boxShadow: isSearchFocused ? '0 0 25px rgba(255, 0, 255, 0.4)' : '0 4px 15px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  borderRadius: '25px',
                  padding: '12px 20px',
                  minWidth: '350px',
                  backdropFilter: 'blur(10px)',
                  border: 'none'
                }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder={isListening ? "Listening..." : "Ask anything..."}
              style={{ 
                    flex: 1,
                    background: 'transparent',
            border: 'none',
                    outline: 'none',
                color: 'white', 
                    fontSize: '1rem',
                    padding: '8px 0',
                    width: '100%'
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <IconButton
                    type="button"
                    onClick={startVoiceRecognition}
                    disabled={isListening}
                    style={{ 
                      color: isListening ? '#4CAF50' : 'white', 
                      padding: '4px',
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                    </svg>
                  </IconButton>
                  <IconButton
                    type="button"
                    component="label"
          style={{
            color: 'white',
                      padding: '4px',
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                  </IconButton>
                </div>
                </div>
              </div>
              
              {/* Image Preview */}
              {imagePreview && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '0',
                  right: '0',
                  marginTop: '10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  borderRadius: '15px',
                  padding: '15px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  zIndex: 1000
                }}>
                  <div style={{
                    display: 'flex',
            alignItems: 'center',
                    gap: '10px',
                    marginBottom: '10px'
                  }}>
                    <span style={{ color: 'white', fontSize: '0.9rem' }}>Image attached:</span>
                    <IconButton
                      onClick={removeImage}
                      size="small"
                      style={{ 
                        color: '#f44336', 
                        padding: '2px'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </IconButton>
                  </div>
                  <img
                    src={imagePreview}
                    alt="Preview"
            style={{ 
                      width: '100%',
                      maxWidth: '200px',
                      height: 'auto',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  />
                </div>
              )}
            </form>
          </div>
        )}

        {/* Wallpaper and Stock Controls - Top Left */}
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          display: isOpen ? 'none' : 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '8px',
          zIndex: '1000',
        }}>
          {/* Wallpaper Mode Flip Slider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '20px',
            padding: '3px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(5px)',
            minWidth: '180px',
            position: 'relative',
            opacity: 0.8
          }}>
            {/* Slider Background */}
            <div style={{
              position: 'absolute',
              top: '3px',
              left: isTimelapseMode ? '3px' : '50%',
              width: '50%',
              height: 'calc(100% - 6px)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '17px',
              transition: 'all 0.3s ease-in-out',
              zIndex: 1
            }} />
            
            {/* Timelapse Button */}
            <button
              onClick={switchToTimelapse}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                color: isTimelapseMode ? 'white' : 'rgba(255, 255, 255, 0.6)',
                border: 'none',
                borderRadius: '17px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '500',
                textAlign: 'center',
                transition: 'all 0.3s ease-in-out',
                zIndex: 2,
                position: 'relative'
              }}
            >
              Timelapse
            </button>
            
            {/* Random Button */}
            <button
              onClick={generateRandomWallpaper}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                color: !isTimelapseMode ? 'white' : 'rgba(255, 255, 255, 0.6)',
                border: 'none',
                borderRadius: '17px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '500',
                textAlign: 'center',
                transition: 'all 0.3s ease-in-out',
                zIndex: 2,
                position: 'relative'
              }}
            >
              Random
            </button>
          </div>
          
          {isStockMode && (
            <button
              onClick={toggleStockWidget}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                minWidth: '120px',
                textAlign: 'center',
                transition: 'all 0.3s ease-in-out',
                opacity: 0.9,
              }}
            >
              {showStockWidget ? 'Hide Stocks' : 'Show Stocks'}
            </button>
          )}
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

        {/* Bottom Center - Wallpaper Location & Quote */}
        <div style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: isOpen ? 'none' : 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          zIndex: '1000',
          padding: '20px',
        }}>
          
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
                    primary={
                      <div>
                        {message.text}
                        {message.image && (
                          <div style={{ marginTop: '10px' }}>
                            <img
                              src={message.image}
                              alt="User uploaded"
                              style={{
                                maxWidth: '200px',
                                maxHeight: '200px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.2)'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    }
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
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes fadeOut {
            from {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
            to {
              opacity: 0;
              transform: translateY(-20px) scale(0.95);
            }
          }
          
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes bounceIn {
            0% {
              opacity: 0;
              transform: scale(0.3);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
            }
            70% {
              transform: scale(0.9);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          @keyframes gradientShift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          
          @keyframes rainbowShift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.3; }
          }
          
          input::placeholder {
            color: #ccc !important;
            opacity: 0.8;
          }
          
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