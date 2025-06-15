import React, { useState, useEffect } from 'react';
import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, Container } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    addResponseMessage('Welcome to the Pitch Strategy Assistant! How can I help you today?');
  }, []);

  const handleNewUserMessage = async (newMessage) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/chat', {
        message: newMessage
      });
      addResponseMessage(response.data.response);
    } catch (error) {
      addResponseMessage('Sorry, I encountered an error. Please try again.');
      console.error('Error:', error);
    }
    setIsLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f5f5f5',
            py: 4
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              color: 'primary.main',
              mb: 4,
              textAlign: 'center',
              fontWeight: 'bold'
            }}
          >
            Pitch Strategy Assistant
          </Typography>
          
          <Typography
            variant="h5"
            component="h2"
            sx={{
              color: 'text.secondary',
              mb: 6,
              textAlign: 'center',
              maxWidth: '600px'
            }}
          >
            Your AI-powered assistant for baseball pitch strategy and analysis
          </Typography>

          <Widget
            handleNewUserMessage={handleNewUserMessage}
            title="Pitch Strategy Assistant"
            subtitle="Powered by GPT"
            senderPlaceHolder="Ask about pitch strategy..."
            showCloseButton={false}
            fullScreenMode={false}
            autofocus={true}
            profileAvatar="https://via.placeholder.com/150"
            isLoading={isLoading}
            launcher={(handleToggle) => (
              <button
                onClick={handleToggle}
                style={{
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  transition: 'transform 0.2s ease-in-out',
                  ':hover': {
                    transform: 'scale(1.1)'
                  }
                }}
              >
                💬
              </button>
            )}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
