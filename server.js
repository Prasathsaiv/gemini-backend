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
      return res.json({ reply: "Prompt missing" });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("Gemini RAW:", JSON.stringify(data, null, 2));

    // ✅ SAFE TEXT EXTRACTION
    let text =
      data?.candidates?.[0]?.content?.parts
        ?.map(p => p.text)
        ?.join(" ");

    if (!text) {
      return res.json({
        reply: "No text returned by Gemini",
        raw: data
      });
    }

    res.json({ reply: text });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Gemini API error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
