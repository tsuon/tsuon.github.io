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
  text: String,
});
const Question = mongoose.model('Question', questionSchema);

// API endpoints
app.get('/api/question/random', async (req, res) => {
  try {
    const count = await Question.countDocuments();
    const random = Math.floor(Math.random() * count);
    const question = await Question.findOne().skip(random);
    res.json({ success: true, question });
  } catch (error) {
    console.error(error);
    res.json({ success: false, error: 'Error fetching random question.' });
  }
});
app.use(express.static('public'));


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
