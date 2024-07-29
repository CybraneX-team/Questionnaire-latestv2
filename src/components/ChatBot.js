import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const API_URL = "http://localhost:5000";

const ChatBot = ({ isPdfOpen }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== "") {
      const userMessage = { text: inputMessage, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputMessage("");

      try {
        const response = await axios.post(`${API_URL}/chat`, {
          question: inputMessage,
          chat_history: chatHistory,
        });

        const botMessage = { text: response.data.answer, sender: "bot" };
        setMessages((prevMessages) => [...prevMessages, botMessage]);

        // Update chat history
        setChatHistory((prevHistory) => [
          ...prevHistory,
          [inputMessage, response.data.answer],
        ]);
      } catch (error) {
        console.error("Error sending message to API:", error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Error data:", error.response.data);
          console.error("Error status:", error.response.status);
          console.error("Error headers:", error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Error request:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error message:", error.message);
        }
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Sorry, I couldn't process your request.", sender: "bot" },
        ]);
      }
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) => file.type === "application/pdf");

    if (validFiles.length !== files.length) {
      setMessages((prev) => [
        ...prev,
        { text: "Only PDF files are allowed.", sender: "system" },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { text: `${validFiles.length} file(s) uploaded`, sender: "user" },
      ]);

      const formData = new FormData();
      validFiles.forEach((file) => formData.append("files", file));

      try {
        // First, clear existing documents
        await axios.post(`${API_URL}/clear`);

        // Then, upload new documents (you need to implement this endpoint in your Flask app)
        const response = await axios.post(`${API_URL}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setMessages((prev) => [
          ...prev,
          { text: response.data.message, sender: "bot" },
        ]);
      } catch (error) {
        console.error("Error uploading files:", error);
        setMessages((prev) => [
          ...prev,
          { text: "Sorry, I couldn't upload the files.", sender: "bot" },
        ]);
      }
    }
  };

  if (!isPdfOpen) return null;

  return (
    <Paper
      elevation={3}
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        backgroundColor: "white",
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        style={{
          color: "#333",
          borderBottom: "1px solid #e5fffc",
          paddingBottom: "8px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ChatBot Assistant
      </Typography>
      <List
        style={{
          flexGrow: 1,
          overflow: "auto",
          marginBottom: "16px",
          padding: "0px",
        }}
      >
        {messages.map((message, index) => (
          <ListItem
            key={index}
            style={{
              justifyContent:
                message.sender === "user" ? "flex-end" : "flex-start",
              wordWrap: "break-word",
              marginBottom: "8px",
            }}
          >
            <Paper
              elevation={1}
              style={{
                padding: "8px 12px",
                maxWidth: "70%",
                backgroundColor:
                  message.sender === "user"
                    ? "#e3f2fd"
                    : message.sender === "bot"
                    ? "#fff"
                    : "#f0f0f0",
                borderRadius:
                  message.sender === "user"
                    ? "20px 20px 0 20px"
                    : "20px 20px 20px 0",
              }}
            >
              <ListItemText
                primary={message.text}
                style={{
                  color: message.sender === "system" ? "#666" : "#333",
                  fontStyle: message.sender === "system" ? "italic" : "normal",
                }}
              />
            </Paper>
          </ListItem>
        ))}
        <div ref={messagesEndRef} />
      </List>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#e5fffc",
          borderRadius: "20px",
          padding: "8px",
          marginBottom: "55px",
        }}
      >
        <TextField
          fullWidth
          variant="standard"
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          InputProps={{ disableUnderline: true }}
          style={{ marginLeft: "8px" }}
        />
        <Button
          color="primary"
          onClick={handleSendMessage}
          style={{
            minWidth: "40px",
            height: "40px",
            borderRadius: "50%",
            color: "#449082",
          }}
        >
          <SendIcon />
        </Button>
        <input
          type="file"
          multiple
          accept=".pdf,.csv"
          onChange={handleFileUpload}
          style={{ display: "none" }}
          ref={fileInputRef}
        />
        <Button
          color="secondary"
          onClick={() => fileInputRef.current.click()}
          style={{
            minWidth: "40px",
            height: "40px",
            borderRadius: "50%",
            marginLeft: "8px",
            color: "#295b52",
          }}
        >
          <AttachFileIcon />
        </Button>
      </div>
    </Paper>
  );
};

export default ChatBot;
