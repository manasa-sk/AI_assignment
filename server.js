const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/chat', (req, res) => {
  const userQuery = req.body.query;
  const botResponse = generateRandomResponse();
  res.json({ botResponse });
});

function generateRandomResponse() {
  const responses = [
    'Hello! How can I help you?',
    'I am just a random response generator.',
    'Ask me anything!',
  ];
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
