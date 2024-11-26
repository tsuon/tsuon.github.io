const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // Import node-fetch for API requests.

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection
const uri = 'mongodb+srv://thatsuon:Sd4RdbKjT$Pkx_e@chatgptee.5k5az.mongodb.net/?retryWrites=true&w=majority&appName=ChatGPTEE';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Schema and Models
const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  expectedAnswer: { type: String },
  chatGPTResponse: { type: String },
});

const Question = mongoose.model('Question', questionSchema);

// Fetch random question API
app.get('/api/question/random', async (req, res) => {
  try {
    const randomQuestion = await Question.aggregate([{ $sample: { size: 1 } }]);
    if (randomQuestion.length > 0) {
      res.json({ success: true, question: randomQuestion[0] });
    } else {
      res.json({ success: false, error: 'No questions found.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
});

// ChatGPT API Key
const apiKey = 'sk-OqemR8KRPQPzuw2V28Mo-MUivgwbmm_j9Qt4oF787ST3BlbkFJeS8H9aLvWGoKCtQDXgDAoZe8Kk1Aafl5Zz9TgQdtAA';

// Validate ChatGPT response API
app.post('/api/validate', async (req, res) => {
  const { question, expectedAnswer } = req.body;

  try {
    // Call OpenAI's API
    const chatGPTResponse = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: question,
        max_tokens: 150,
      }),
    });
    
    const chatGPTData = await chatGPTResponse.json();
    const answer = chatGPTData.choices[0]?.text.trim();

    // Validation
    const isValid = answer.toLowerCase() === expectedAnswer.toLowerCase();
    res.json({ success: true, chatGPTResponse: answer, isValid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Validation failed.' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
app.get('/api/question/random', async (req, res) => {
  try {
    const randomQuestion = await Question.aggregate([{ $sample: { size: 1 } }]);
    if (randomQuestion.length > 0) {
      console.log("Fetched question:", randomQuestion[0]);
      res.json({ success: true, question: randomQuestion[0] });
    } else {
      console.log("No questions found in the database.");
      res.json({ success: false, error: 'No questions found.' });
    }
  } catch (err) {
    console.error("Error fetching question:", err);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
});