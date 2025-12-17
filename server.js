import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/ask", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    if (!prompt) {
      return res.json({ reply: "Prompt is missing" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

    const data = await response.json();

    console.log("Gemini raw response:", JSON.stringify(data, null, 2));

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.json({
        reply: "❌ Gemini returned no text",
        raw: data,
      });
    }

    res.json({ reply: text });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ reply: "❌ Gemini API failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
