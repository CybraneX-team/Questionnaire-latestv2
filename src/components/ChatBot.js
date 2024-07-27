import React, { useState, useRef } from 'react';
import { Button, TextField, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const ChatBot = ({ isPdfOpen }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(scrollToBottom, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      setMessages([...messages, { text: inputMessage, sender: 'user' }]);
      setInputMessage('');
      // Here we would call our API to get the chatbot's response
      // For now, we'll just simulate a response
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "I'm a chatbot. How can I help you?", sender: 'bot' }]);
      }, 1000);
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => file.type === 'application/pdf' || file.type === 'text/csv');
    
    if (validFiles.length !== files.length) {
      setMessages(prev => [...prev, { text: "Only PDF and CSV files are allowed.", sender: 'system' }]);
    } else {
      console.log('Files uploaded:', validFiles);
      // Display a message in the chat about the uploaded files as if sent by the user
      setMessages(prev => [...prev, { text: `${validFiles.length} file(s) uploaded`, sender: 'user' }]);
    }
  };

  if (!isPdfOpen) return null;

  return (
    <Paper elevation={3} style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', padding: '16px', backgroundColor: 'white' }}>
      <Typography variant="h6" gutterBottom style={{ color: '#333', borderBottom: '1px solid #e5fffc', paddingBottom: '8px', alignItems: 'center', justifyContent: 'center', }}>
        ChatBot Assistant
      </Typography>
      <List style={{ flexGrow: 1, overflow: 'auto', marginBottom: '16px', padding: '0px' }}>
        {messages.map((message, index) => (
          <ListItem key={index} style={{ 
            justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
            wordWrap: 'break-word',
            marginBottom: '8px'
          }}>
            <Paper elevation={1} style={{ 
              padding: '8px 12px', 
              maxWidth: '70%',
              backgroundColor: message.sender === 'user' ? '#e3f2fd' : message.sender === 'bot' ? '#fff' : '#f0f0f0',
              borderRadius: message.sender === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0'
            }}>
              <ListItemText 
                primary={message.text} 
                style={{ 
                  color: message.sender === 'system' ? '#666' : '#333',
                  fontStyle: message.sender === 'system' ? 'italic' : 'normal'
                }}
              />
            </Paper>
          </ListItem>
        ))}
        <div ref={messagesEndRef} />
      </List>
      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#e5fffc', borderRadius: '20px', padding: '8px', marginBottom: '55px' }}>
        <TextField
          fullWidth
          variant="standard"
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          InputProps={{ disableUnderline: true }}
          style={{ marginLeft: '8px',  }}
        />
        <Button
          color="primary"
          onClick={handleSendMessage}
          style={{ minWidth: '40px', height: '40px', borderRadius: '50%', color: "#449082" }}
        >
          <SendIcon />
        </Button>
        <input
          type="file"
          multiple
          accept=".pdf,.csv"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />
        <Button
          color="secondary"
          onClick={() => fileInputRef.current.click()}
          style={{ minWidth: '40px', height: '40px', borderRadius: '50%', marginLeft: '8px', color:"#295b52" }}
        >
          <AttachFileIcon />
        </Button>
      </div>
    </Paper>
  );
};

export default ChatBot;
