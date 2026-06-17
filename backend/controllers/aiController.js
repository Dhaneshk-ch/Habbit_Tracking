// ─────────────────────────────────────────────
//  AI Controller  (Google Gemini)
//  POST /api/ai/weekly-report
//  POST /api/ai/suggest-habits
//  POST /api/ai/recovery-plan
//  POST /api/ai/chat
//  GET  /api/ai/morning
// ─────────────────────────────────────────────
import axios   from "axios";
import { format, subDays } from "date-fns";
import Log     from "../models/Log.js";
import Habit   from "../models/Habit.js";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// ── Call Gemini ──────────────────────────────
const gemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    // Return a placeholder if no key configured
    return "⚠️ AI features require a Gemini API key. Add `GEMINI_API_KEY` to your `.env` file. Get a free key at https://aistudio.google.com/";
  }

  const res = await axios.post(
    `${GEMINI_URL}?key=${apiKey}`,
    {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 600 },
    }
  );
  return res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
};

// ── Shared: build habit summary for prompts ──
const buildSummary = async (userId) => {
  const end     = format(new Date(), "yyyy-MM-dd");
  const start   = format(subDays(new Date(), 6), "yyyy-MM-dd");
  const habits  = await Habit.find({ userId, isArchived: false });
  const logs    = await Log.find({ userId, completedDate: { $gte: start, $lte: end } });

  return habits.map((h) => {
    const completions = logs.filter((l) => String(l.habitId) === String(h._id)).length;
    return `• ${h.icon} ${h.name} (${h.category}): ${completions}/7 days`;
  }).join("\n");
};

// POST /api/ai/weekly-report
export const weeklyReport = async (req, res) => {
  try {
    const summary = await buildSummary(req.user._id);
    const prompt  = `You are a supportive habit coach. Here is my habit completion data for the past 7 days:\n\n${summary}\n\nWrite a warm, encouraging weekly report in 3-4 short paragraphs. Highlight wins, gently note struggles, and give one specific actionable tip. Use markdown.`;
    const content = await gemini(prompt);
    res.json({ content });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/ai/suggest-habits
export const suggestHabits = async (req, res) => {
  try {
    const habits  = await Habit.find({ userId: req.user._id, isArchived: false });
    const names   = habits.map((h) => h.name).join(", ") || "none yet";
    const prompt  = `I currently track these habits: ${names}.\n\nSuggest 5 complementary habits I could add. For each provide: name, a single emoji icon, category (Health/Mindfulness/Learning/Productivity/Fitness/Other), and a one-sentence reason. Return as a JSON array: [{"name":"...","icon":"...","category":"...","reason":"..."}]. Only return the JSON, no extra text.`;
    const raw     = await gemini(prompt);
    let suggestions;
    try {
      const clean = raw.replace(/```json|```/g, "").trim();
      suggestions = JSON.parse(clean);
    } catch {
      suggestions = [];
    }
    res.json({ suggestions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/ai/recovery-plan
export const recoveryPlan = async (req, res) => {
  try {
    const { habitName, missedDays } = req.body;
    const prompt = `My habit "${habitName}" streak broke after missing ${missedDays || "a few"} days. Write a compassionate 3-day comeback plan with one small, specific action per day. Keep it short and encouraging. Use markdown with Day 1, Day 2, Day 3 headings.`;
    const content = await gemini(prompt);
    res.json({ content });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/ai/chat
export const chat = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ message: "question is required." });

    const summary = await buildSummary(req.user._id);
    const prompt  = `You are a friendly, data-driven habit coach. Here is the user's recent habit data:\n\n${summary}\n\nUser question: "${question}"\n\nAnswer concisely in 2-3 sentences, referencing their actual data where relevant. Use markdown.`;
    const content = await gemini(prompt);
    res.json({ content });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/ai/morning
export const morningMotivation = async (req, res) => {
  try {
    const habits  = await Habit.find({ userId: req.user._id, isArchived: false });
    const today   = format(new Date(), "EEEE, MMMM d");
    const names   = habits.slice(0, 3).map((h) => `${h.icon} ${h.name}`).join(", ") || "your habits";
    const prompt  = `Write a single short (2 sentences max) morning motivation message for ${today}. The user is tracking: ${names}. Be warm, energetic and specific. No hashtags.`;
    const content = await gemini(prompt);
    res.json({ content });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
