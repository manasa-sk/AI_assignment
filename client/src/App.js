import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [userQuery, setUserQuery] = useState('');
  const [botResponse, setBotResponse] = useState('');
  const [file, setFile] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  const handleInputChange = (e) => {
    setUserQuery(e.target.value);
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleSendQuery = async () => {
    try {
      if (file) {
        // If a PDF file is uploaded, learn from it and then respond to user queries
        await learnFromPDF(file);

        // Reset the file state to null after learning
        setFile(null);
      }

      // Send user query to the server
      const response = await axios.post('http://localhost:3001/api/chat', { query: userQuery });

      // Update chat history with the user query and bot response
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: 'user', content: userQuery },
        { role: 'bot', content: response.data.botResponse },
      ]);

      // Update bot response in the state
      setBotResponse(response.data.botResponse);
      setUserQuery('');

    } catch (error) {
      console.error('Error sending query:', error);
    }
  };

  const learnFromPDF = async (pdfFile) => {
    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);

      // Send the PDF file to the server for learning
      await axios.post('http://localhost:3001/api/learn', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Pdf sent : ', pdfFile);
    } catch (error) {
      console.error('Error learning from PDF:', error);
    }
  };

  return (
    <div>
      <div>
        <input type="file" onChange={handleFileChange} />
      </div>
      <div>
        <input type="text" value={userQuery} onChange={handleInputChange} />
        <button onClick={handleSendQuery}>Send</button>
      </div>
      <div>
        {chatHistory.map((message, index) => (
          <div key={index}>
            <strong>{message.role}:</strong> {message.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;