import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [userQuery, setUserQuery] = useState('');
  const [botResponse, setBotResponse] = useState('');

  const handleInputChange = (e) => {
    setUserQuery(e.target.value);
  };

  const handleSendQuery = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/chat', { query: userQuery });
      setBotResponse(response.data.botResponse);
    } catch (error) {
      console.error('Error sending query:', error);
    }
  };

  return (
    <div>
      <h1>Chatbot App</h1>
      <div>
        <input type="text" value={userQuery} onChange={handleInputChange} />
        <button onClick={handleSendQuery}>Send</button>
      </div>
      <div>
        <strong>User:</strong> {userQuery}
      </div>
      <div>
        <strong>Bot:</strong> {botResponse}
      </div>
    </div>
  );
}

export default App;

