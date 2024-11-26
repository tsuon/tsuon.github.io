const fetch = require('node-fetch'); // Make sure to install node-fetch v2: npm install node-fetch@2

const apiKey = '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'; // Replace with your actual API key
const apiUrl = 'https://api.openai.com/v1/completions';

const testChatGPTAPI = async () => {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: 'Say hello!',
        max_tokens: 5,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('API Response:', data.choices[0].text.trim());
    } else {
      console.error('API Error:', await response.text());
    }
  } catch (error) {
    console.error('Connection Error:', error);
  }
};

testChatGPTAPI();
