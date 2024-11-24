const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files like your index.html

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/chatgpt_evaluation';
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schema & Model
const QuestionSchema = new mongoose.Schema({
  text: String,
  response: String,
});
const Question = mongoose.model('Question', QuestionSchema);

// API Endpoints
// Fetch a random question
app.get('/sk-OqemR8KRPQPzuw2V28Mo-MUivgwbmm_j9Qt4oF787ST3BlbkFJeS8H9aLvWGoKCtQDXgDAoZe8Kk1Aafl5Zz9TgQdtAA/question/random', async (req, res) => {
  try {
    const count = await Question.countDocuments();
    const random = Math.floor(Math.random() * count);
    const question = await Question.findOne().skip(random);
    res.json({ success: true, question });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch the next question
app.get('/api/question/next', async (req, res) => {
  try {
    const question = await Question.findOne(); // Simplified for example
    res.json({ success: true, question });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Submit a question
app.post('/api/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ success: false, message: 'Question is required' });

  try {
    // Simulate ChatGPT response
    const response = `Simulated response for: ${question}`;
    const savedQuestion = await Question.create({ text: question, response });
    res.json({ success: true, question: savedQuestion.text, response: savedQuestion.response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
