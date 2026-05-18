const axios = require('axios');

/**
 * Central function to call the OpenRouter AI API
 * Model: openai/gpt-3.5-turbo
 */
const generateOpenRouterResponse = async (prompt) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert HR analyst and AI-powered performance evaluation system. Always respond with valid, parseable JSON unless explicitly told otherwise. Be specific, data-driven, and actionable in your analysis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:5000',
          'X-Title': 'Employee Analytics System',
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter API Error:', error?.response?.data || error.message);
    throw new Error('Failed to generate AI response. Check your API key and quota.');
  }
};

module.exports = { generateOpenRouterResponse };
