const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const openai = require('openai');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiClient = new openai.OpenAI({ apiKey: openaiApiKey });

app.post('/api/chat', async (req, res) => {
  const userQuery = req.body.query;

  try {
    const botResponse = await generateOpenAIResponse(userQuery);
    res.json({ botResponse });
  } catch (error) {
    console.error('Error generating OpenAI response:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function generateOpenAIResponse(userQuery) {
  const prompt = `User: ${userQuery}\nChatGPT:`;
  const response = await openaiClient.chat.completions.create({
    messages: [{"role": "user", "content": prompt}],
    model: "gpt-3.5-turbo",
  });

  return response.choices[0].message.content;
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

