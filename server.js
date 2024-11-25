const mongoose = require('mongoose');
const express = require('express');
const app = express();
const PORT = 3000;

// MongoDB connection string
const uri = 'mongodb+srv://thatsuon:Sd4RdbKjT$Pkx_e@chatgptee.5k5az.mongodb.net/?retryWrites=true&w=majority&appName=ChatGPTEE';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define the Question Schema
const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  expectedAnswer: { type: String },
  chatGPTResponse: { type: String }
});

// Dynamically create models for each collection
const collections = {
  prehistory: mongoose.model('prehistory', questionSchema, 'prehistory'),
  computer_security: mongoose.model('computer_security', questionSchema, 'computer_security'),
  social_science: mongoose.model('social_science', questionSchema, 'social_science')
};

// Seed data into collections
const seedData = async () => {
  try {
    // Insert sample data into the 'prehistory' collection
    await collections.prehistory.create({
      question: "What is the significance of fire in human evolution?",
      expectedAnswer: "Fire allowed early humans to cook food and stay warm.",
      chatGPTResponse: null
    });

    // Insert sample data into the 'computer_security' collection
    await collections.computer_security.create({
      question: "What is Diffie-Hellman?",
      expectedAnswer: "It is a key exchange algorithm.",
      chatGPTResponse: null
    });

    // Insert sample data into the 'social_science' collection
    await collections.social_science.create({
      question: "What is a democracy?",
      expectedAnswer: "A form of government where the people have the power.",
      chatGPTResponse: null
    });

    console.log('Sample questions inserted into collections.');
  } catch (error) {
    console.error('Error inserting data:', error);
  }
};

// Call seedData() to insert the documents
seedData();
