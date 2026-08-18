import express from "express";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = process.env.PORT || 3000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.use(express.json());
app.use(express.static("public"));

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message?.trim();

    if (!message) {
      return res.status(400).json({
        error: "Please enter a message."
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction:
          "You are a friendly multilingual AI chatbot. " +
          "Understand and respond naturally in Telugu, Hindi, Kannada, English, " +
          "and other languages. If the user writes in a particular language, " +
          "prefer replying in that same language unless they ask for another language. " +
          "Keep answers clear and helpful."
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
