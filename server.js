import express from "express";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const app = express();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.use(express.json());

// Serve the chatbot homepage
app.get("/", (req, res) => {
  res.sendFile(new URL("./public/index.html", import.meta.url).pathname);
});

// Chat API
app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message?.trim();

    if (!message) {
      return res.status(400).json({
        error: "Please enter a message."
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: message,
      config: {
        systemInstruction:
          "You are a friendly multilingual AI chatbot. " +
          "Understand and respond naturally in Telugu, Hindi, Kannada, English, " +
          "and other languages. If the user writes in a particular language, " +
          "reply in that same language unless they ask for another language. " +
          "Keep answers clear, helpful and reasonably concise."
      }
    });

    res.json({
      reply: response.text
    });

  } catch (error) {
    console.error("Gemini error:", error);

    res.status(500).json({
      error: "Sorry, I couldn't process your message right now."
    });
  }
});

export default app;
