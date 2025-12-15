const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ask", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    res.json({
      reply: data.candidates[0].content.parts[0].text
    });

  } catch (error) {
    res.status(500).json({ error: "Gemini API error" });
  }
});

app.listen(3000, () => {
  console.log("✅ Backend running on http://localhost:3000");
});
