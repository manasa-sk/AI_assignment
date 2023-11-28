import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [userQuery, setUserQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleInputChange = (e) => {
    setUserQuery(e.target.value);
  };

  const handleSendQuery = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/chat', { query: userQuery });
      const botResponse = response.data.botResponse;

      // Update chat history with the new message
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: 'user', content: userQuery },
        { role: 'bot', content: botResponse },
      ]);

      // Clear the input field after sending the query
      setUserQuery('');
    } catch (error) {
      console.error('Error sending query:', error);
    }
  };

  return (
    <div>
      <h1>Chatbot App</h1>
      <div>
        <div>
          {chatHistory.map((message, index) => (
            <div key={index}>
              <strong>{message.role.charAt(0).toUpperCase() + message.role.slice(1)}:</strong> {message.content}
            </div>
          ))}
        </div>
        <div>
          <input type="text" value={userQuery} onChange={handleInputChange} />
          <button onClick={handleSendQuery}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;

