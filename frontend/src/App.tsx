import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Box, 
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      
      // Add AI response
      const aiMessage: Message = { text: data.response, sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Add error message
      const errorMessage: Message = { 
        text: 'Sorry, I encountered an error. Please try again.', 
        sender: 'ai' 
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <Container maxWidth="md" sx={{ height: '100vh', py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          p: 2
        }}
      >
        <Typography variant="h4" gutterBottom>
          AI Pitch Advisor
        </Typography>
        
        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          mb: 2,
          backgroundColor: '#f5f5f5',
          borderRadius: 1,
          p: 2
        }}>
          <List>
            {messages.map((message, index) => (
              <React.Fragment key={index}>
                <ListItem 
                  sx={{ 
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <Paper 
                    elevation={1}
                    sx={{ 
                      p: 2,
                      maxWidth: '70%',
                      backgroundColor: message.sender === 'user' ? '#e3f2fd' : '#fff'
                    }}
                  >
                    <ListItemText primary={message.text} />
                  </Paper>
                </ListItem>
                {index < messages.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button 
            variant="contained" 
            endIcon={<SendIcon />}
            onClick={handleSend}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default App; 