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
      const collectionName = req.query.collection; // Get the collection name from query parameter

      if (!collectionName || !['computer_security', 'prehistory', 'social_science'].includes(collectionName)) {
          return res.json({ success: false, error: 'Invalid or missing collection name.' });
      }

      const Question = mongoose.model(collectionName, questionSchema, collectionName); // Dynamically select the collection
      const count = await Question.countDocuments();
      if (count === 0) return res.json({ success: false, error: 'No questions in the database.' });

      const random = Math.floor(Math.random() * count);
      const question = await Question.findOne().skip(random);

      res.json({ success: true, question });
  } catch (error) {
      console.error('Error fetching question:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});





app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

