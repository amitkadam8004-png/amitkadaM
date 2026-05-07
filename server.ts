import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import TelegramBot from "node-telegram-bot-api";

// Initialize AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- Telegram Bot Logic ---
  const token = process.env.TELEGRAM_BOT_TOKEN;
  let bot: TelegramBot | null = null;

  if (token) {
    bot = new TelegramBot(token, { polling: true });
    console.log("Telegram Bot started with polling...");

    bot.on("message", async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      if (!text) return;

      if (text === "/start") {
        bot?.sendMessage(chatId, "🚄 *Tatkal AI Agent Ready*\n\nPlease provide your booking details in this format:\n\n`Train: 12002, From: NDLS, To: BPL, Date: 24 May, Name: Amit, Age: 29, UPI: user@upi`", { parse_mode: 'Markdown' });
        return;
      }

      try {
        bot?.sendChatAction(chatId, "typing");
        
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Extract booking details from: "${text}". 
          Return ONLY JSON with fields: trainNumber, passengerName, age, from, to, travelDate, upiId. 
          If any field is missing, set to null.`,
          config: { responseMimeType: "application/json" }
        });

        const details = JSON.parse(response.text || "{}");
        const missing = [];
        if (!details.trainNumber) missing.push("Train Number");
        if (!details.from || !details.to) missing.push("Route (From/To)");
        if (!details.travelDate) missing.push("Travel Date");
        if (!details.passengerName) missing.push("Passenger Name");
        if (!details.upiId) missing.push("UPI ID (for quick pay)");

        if (missing.length > 0) {
          bot?.sendMessage(chatId, `⚠️ *Missing Information*:\nI need the following to proceed:\n\n- ${missing.join("\n- ")}\n\nPlease provide them to start the booking agent.`, { parse_mode: 'Markdown' });
        } else {
          bot?.sendMessage(chatId, `✅ *Booking Sequence Ready*\n\n🔹 *Train:* ${details.trainNumber}\n🔹 *Route:* ${details.from} ➔ ${details.to}\n🔹 *Date:* ${details.travelDate}\n🔹 *Passenger:* ${details.passengerName} (${details.age})\n🔹 *Payment:* ${details.upiId}\n\n*Agent is now on standby for the Tatkal window.*`, { parse_mode: 'Markdown' });
        }
      } catch (error) {
        bot?.sendMessage(chatId, "❌ Logic Error. Please use the format provided in /start");
      }
    });
  }

  // --- API Routes ---
  
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", botActive: !!token });
  });

  // Simulated Captcha Solver Endpoint
  app.post("/api/solve-captcha", async (req, res) => {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: "No image provided" });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { inlineData: { mimeType: "image/png", data: imageBase64 } },
          { text: "Read the captcha characters in this image. Return ONLY the text." }
        ]
      });
      res.json({ captchaText: response.text?.trim() });
    } catch (error) {
      res.status(500).json({ error: "AI OCR failed" });
    }
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
