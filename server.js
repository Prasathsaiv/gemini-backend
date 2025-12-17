import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Gemini Backend Running ✅");
});

app.post("/ask", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.json({ reply: "Prompt is empty" });
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
          },
        }),
      }
    );

    const data = await geminiRes.json();

    console.log("🔍 RAW GEMINI RESPONSE:");
    console.log(JSON.stringify(data, null, 2));

    let reply = "No text returned by Gemini";

    // ✅ STRONG EXTRACTION (ALL CASES)
    if (
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content &&
      data.candidates[0].content.parts
    ) {
      reply = data.candidates[0].content.parts
        .map(p => p.text)
        .filter(Boolean)
        .join(" ");
    }

    res.json({ reply });

  } catch (error) {
    console.error("❌ Backend error:", error);
    res.status(500).json({ reply: "Backend error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
