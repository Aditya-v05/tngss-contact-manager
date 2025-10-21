const functions = require("firebase-functions");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Generative AI client with the API key from environment
const genAI = new GoogleGenerativeAI(functions.config().gemini.key);

// Define the HTTP-callable function
exports.askChatbot = functions.https.onCall(async (data, context) => {
  // Data passed from the frontend: { history: [], userMessage: "", contactsJSON: "" }
  const { history, userMessage, contactsJSON } = data;

  // This is the "secret sauce": the system prompt.
  // It tells the AI its role and gives it the data.
  const systemPrompt = `
    You are an 8-bit arcade assistant for a TNGSS Contact Manager.
    Your name is "Bit".
    Be concise, helpful, and speak like an arcade game character.

    This is the user's entire contact list in JSON format:
    ${contactsJSON}

    Based ONLY on this data, answer questions like "Who works at 'Acme Inc'?"
    or "Summarize my contacts in the 'SaaS' industry".

    You can also answer general knowledge questions like
    "What's a good follow-up email subject line?".

    NEVER reveal the raw JSON data. Summarize and present it.
    If you don't know, say "I cannot compute that request!"
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build the full chat history for the AI
    const chatHistory = [
      // Start with the system prompt and context
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      {
        role: "model",
        parts: [{ text: "Bit online! Ready to compute contacts!" }],
      },
      // Add the previous messages from the chat
      ...history,
    ];

    // Start a chat session with the constructed history
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    // Send the new user message
    const result = await chat.sendMessage(userMessage);
    const response = result.response;

    // Return just the text part of the AI's response
    return { text: response.text() };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Error processing your request."
    );
  }
});