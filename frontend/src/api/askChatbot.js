// frontend/src/api/askChatbot.js

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the client with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 2. Get data from the React app's request body
    const { history, userMessage, contactsJSON } = req.body;

    const systemPrompt = `
      You are an 8-bit arcade assistant for a TNGSS Contact Manager.
      Your name is "Bit". Be concise, helpful, and speak like an arcade game character.

      This is the user's entire contact list in JSON format:
      ${contactsJSON}

      Based ONLY on this data, answer questions like "Who works at 'Acme Inc'?"
      or "Summarize my contacts in the 'SaaS' industry".

      You can also answer general knowledge questions.
      NEVER reveal the raw JSON data. Summarize and present it.
      If you don't know, say "I cannot compute that request!"
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. Build the chat history
    const chatHistory = [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      {
        role: "model",
        parts: [{ text: "Bit online! Ready to compute contacts!" }],
      },
      ...history,
    ];

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    // 4. Send the new message to Gemini
    const result = await chat.sendMessage(userMessage);
    const response = result.response;

    // 5. Send the AI's text response back to the React app
    res.status(200).json({ text: response.text() });

  } catch (error) {
    console.error("Error in askChatbot function:", error);
    res.status(500).json({ error: 'Failed to process chat message.' });
  }
}