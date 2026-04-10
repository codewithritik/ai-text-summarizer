// Background service worker for handling API calls

import { GoogleGenerativeAI } from "@google/generative-ai";

// API key will be injected during build from config.js
// Make sure to set API_KEY in config.js before building
// This placeholder will be replaced by the build process
const API_KEY = '{{API_KEY_PLACEHOLDER}}';

const genAI = new GoogleGenerativeAI(API_KEY);

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'summarize') {
    summarizeText(request.text)
      .then(summary => {
        sendResponse({ summary });
      })
      .catch(error => {
        console.error('Summarization error:', error);
        sendResponse({ error: error.message || 'Failed to summarize text' });
      });
    
    // Return true to indicate we will send a response asynchronously
    return true;
  }
});

// Function to call Google AI API using SDK
async function summarizeText(text) {
  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    throw new Error('API key not configured. Please add your Google AI API key in config.js');
  }

  if (!text || text.trim().length === 0) {
    throw new Error('No text provided to summarize');
  }

  try {
    const prompt = `Summarize the following text into short bullet points:\n\n${text}\n\nFormat the summary as a bulleted list.`;

    // Get the generative model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);
    const summary = result.response.text();
    return summary.trim();
  } catch (error) {
    console.error('API call failed:', error);
    throw new Error(error.message || 'Failed to generate summary');
  }
}

