const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const openai = require('openai');
const pdfParse = require('pdf-parse');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiClient = new openai.OpenAI({ apiKey: openaiApiKey });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let knowledgeBaseEmbeddings = null;
let pdfText = null;
let isFileUploaded = false;

app.post('/api/chat', async (req, res) => {
  const userQuery = req.body.query;

  try {
    let botResponse = '';

    if (isFileUploaded) {
      botResponse = await answerQueryWithEmbeddings(userQuery, knowledgeBaseEmbeddings, pdfText);
    } else {
      botResponse = await generateResponseWithOpenAI(userQuery);
    }

    res.json({ botResponse });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/learn', upload.single('pdf'), async (req, res) => {
  console.log('Hit learn');
  try {
    console.log(req.body);
    if (req.file) {
      const pdfBuffer = req.file.buffer;
      pdfText = await extractTextFromPDF(pdfBuffer);
      knowledgeBaseEmbeddings = await generateEmbeddings(pdfText);
      isFileUploaded = true;
      console.log(isFileUploaded);
    }
    res.status(200).json({ message: 'Generated Embeddings' });
  } catch (error) {
    console.error('Error generating embeddings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function extractTextFromPDF(pdfBuffer) {
  const data = await pdfParse(pdfBuffer);
  console.log('Extracted text from pdf');
  return data.text;
}

async function generateEmbeddings(text) {
  const embedding = await openaiClient.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });
  return embedding.data[0].embedding;
}

async function answerQueryWithEmbeddings(userQuery, knowledgeBaseEmbeddings, pdfText) {
  const prompt = `Context: ${pdfText} - Question: ${userQuery}`;
  console.log(prompt);
  const response = await openaiClient.completions.create({
    model: 'text-davinci-003',
    prompt: prompt,
    max_tokens: 200,
  });
  console.log(knowledgeBaseEmbeddings);
  return response.choices[0].text.trim();
}

async function generateResponseWithOpenAI(userQuery) {
  const response = await openaiClient.completions.create({
    model: 'text-davinci-003',
    prompt: userQuery,
    max_tokens: 200,
  });
  return response.choices[0].text.trim();
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
