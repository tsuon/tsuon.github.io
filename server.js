const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

// MongoDB connection
const uri = 'mongodb+srv://thatsuon:Sd4RdbKjT$Pkx_e@chatgptee.5k5az.mongodb.net/?retryWrites=true&w=majority&appName=ChatGPTEE';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));




// Question Schema
const questionSchema = new mongoose.Schema({
  question: { type: String, required: true }, // Text of the question
  expectedAnswer: { type: String }, // Expected answer
  chatGPTResponse: { type: String } // ChatGPT's response (can be null)
});

// Create the model
const Question = mongoose.model('Question', questionSchema);


  // Serve static files from the 'public' directory
app.use(express.static('public'));

// API endpoints
app.get('/api/question/random', async (req, res) => {
  try {
    const count = await Question.countDocuments();
    if (count === 0) {
      return res.json({ success: false, error: 'No questions in the database.' });
    }
    const random = Math.floor(Math.random() * count);
    const question = await Question.findOne().skip(random);
    res.json({ success: true, question });
  } catch (error) {
    console.error('Error fetching question:', error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



app.get('/api/question/next', async (req, res) => {
  // Logic for sequential question retrieval
  try {
    const questions = await Question.find();
    res.json({ success: true, question: questions[0] }); // Adjust logic as needed
  } catch (error) {
    console.error(error);
    res.json({ success: false, error: 'Error fetching next question.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
