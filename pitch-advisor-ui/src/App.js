import React, { useState, useEffect } from 'react';
import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import axios from 'axios';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    addResponseMessage('Welcome to the Pitch Strategy Assistant! I can help you with:\n\n' +
      '• Pitch selection and sequencing\n' +
      '• Batter analysis and tendencies\n' +
      '• Game situation strategy\n' +
      '• Pitch location recommendations\n\n' +
      'How can I assist you today?');
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
    <div className="App">
      <div className="header">
        <h1>Pitch Strategy Assistant</h1>
        <p>Your AI-powered assistant for baseball pitch strategy and analysis</p>
      </div>
      
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title="Pitch Strategy Assistant"
        subtitle="Ask me anything about pitch strategy"
        senderPlaceHolder="Type your question here..."
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
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 1000
            }}
          >
            💬
          </button>
        )}
      />
    </div>
  );
}

export default App;
