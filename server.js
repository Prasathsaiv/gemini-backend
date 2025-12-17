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

    if (!prompt) {
      return res.json({ reply: "Prompt is empty" });
    }

    const response = await fetch(
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
        }),
      }
    );

    const data = await response.json();

    console.log("🔍 RAW GEMINI RESPONSE:");
    console.log(JSON.stringify(data, null, 2));

    // ✅ SAFE TEXT EXTRACTION (WORKS FOR ALL CURRENT GEMINI RESPONSES)
    let reply =
      data?.candidates?.[0]?.content?.parts
        ?.map(p => p.text)
        .join("") ||
      data?.candidates?.[0]?.content?.text ||
      "No text returned by Gemini";

    res.json({ reply });

  } catch (err) {
    console.error("❌ Gemini error:", err);
    res.status(500).json({ reply: "Backend error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
