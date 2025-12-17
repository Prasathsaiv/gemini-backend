import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Gemini backend is running ✅");
});

app.post("/ask", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY missing" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

console.log("Gemini raw response:", JSON.stringify(data, null, 2));

const text =
  data?.candidates?.[0]?.content?.parts?.[0]?.text ||
  data?.promptFeedback?.blockReason ||
  "No response from Gemini";

res.json({ reply: text });
);
});

