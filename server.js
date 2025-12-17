import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route (optional – to check backend is alive)
app.get("/", (req, res) => {
  res.send("Gemini Backend is Running ✅");
});

// MAIN GEMINI ROUTE
app.post("/ask", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.json({ reply: "Prompt is empty" });
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await geminiResponse.json();

    // 🔍 LOG FULL RESPONSE (VERY IMPORTANT FOR DEBUGGING)
    console.log("RAW GEMINI RESPONSE:");
    console.log(JSON.stringify(data, null, 2));

    // ✅ CORRECT TEXT EXTRACTION
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Gemini responded but text was not found";

    res.json({ reply });

  } catch (error) {
    console.error("❌ Gemini Backend Error:", error);
    res.status(500).json({ reply: "Backend crashed" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
