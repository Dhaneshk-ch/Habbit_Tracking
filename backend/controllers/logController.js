// ─────────────────────────────────────────────
//  Log Controller
//  POST   /api/logs           — mark complete
//  DELETE /api/logs           — unmark
//  GET    /api/logs/today     — today's completions
//  GET    /api/logs/range     — date range
//  GET    /api/logs/heatmap   — 90-day heatmap
//  GET    /api/logs/stats     — per-habit stats (30d)
//  GET    /api/logs/stats/:id — single habit stats
// ─────────────────────────────────────────────
import { format, subDays, eachDayOfInterval, parseISO } from "date-fns";
import Log   from "../models/Log.js";
import Habit from "../models/Habit.js";

const todayKey = () => format(new Date(), "yyyy-MM-dd");

// ── Streak helper ────────────────────────────
const calcStreak = (completedDates) => {
  if (!completedDates.length) return { current: 0, longest: 0 };

  const sorted = [...new Set(completedDates)].sort();
  const set    = new Set(sorted);
  const today  = todayKey();
  const yest   = format(subDays(new Date(), 1), "yyyy-MM-dd");

  // Current streak
  let current = 0;
  let cursor  = new Date();
  if (!set.has(today) && !set.has(yest)) {
    current = 0;
  } else {
    if (!set.has(today)) cursor = subDays(cursor, 1);
    while (set.has(format(cursor, "yyyy-MM-dd"))) {
      current += 1;
      cursor   = subDays(cursor, 1);
    }
  }

  // Longest streak
  let longest = 0;
  let run     = 0;
  let prev    = null;
  for (const k of sorted) {
    if (prev) {
      const diff = Math.round(
        (new Date(k) - new Date(prev)) / (1000 * 60 * 60 * 24)
      );
      run = diff === 1 ? run + 1 : 1;
    } else {
      run = 1;
    }
    if (run > longest) longest = run;
    prev = k;
  }

  return { current, longest };
};

// POST /api/logs  — mark habit complete for a date
export const markComplete = async (req, res) => {
  try {
    const { habitId, date } = req.body;
    if (!habitId) return res.status(400).json({ message: "habitId is required." });

    const completedDate = date || todayKey();

    // Verify habit belongs to user
    const habit = await Habit.findOne({ _id: habitId, userId: req.user._id });
    if (!habit) return res.status(404).json({ message: "Habit not found." });

    // Upsert — ignore duplicate
    const log = await Log.findOneAndUpdate(
      { userId: req.user._id, habitId, completedDate },
      { userId: req.user._id, habitId, completedDate },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/logs  — unmark habit for a date
export const unmarkComplete = async (req, res) => {
  try {
    const { habitId, date } = req.body;
    if (!habitId) return res.status(400).json({ message: "habitId is required." });

    const completedDate = date || todayKey();
    await Log.deleteOne({ userId: req.user._id, habitId, completedDate });
    res.json({ message: "Unmarked." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/logs/today
export const getToday = async (req, res) => {
  try {
    const logs = await Log.find({
      userId: req.user._id,
      completedDate: todayKey(),
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/logs/range?start=yyyy-MM-dd&end=yyyy-MM-dd
export const getRange = async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: "start and end query params required." });
    }
    const logs = await Log.find({
      userId: req.user._id,
      completedDate: { $gte: start, $lte: end },
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/logs/heatmap  — last 90 days
export const getHeatmap = async (req, res) => {
  try {
    const endDate   = new Date();
    const startDate = subDays(endDate, 89);
    const start     = format(startDate, "yyyy-MM-dd");
    const end       = format(endDate,   "yyyy-MM-dd");

    const logs = await Log.find({
      userId: req.user._id,
      completedDate: { $gte: start, $lte: end },
    });

    // Build a map of date → count
    const countMap = {};
    logs.forEach((l) => {
      countMap[l.completedDate] = (countMap[l.completedDate] || 0) + 1;
    });

    // Fill every day
    const days = eachDayOfInterval({ start: startDate, end: endDate }).map((d) => {
      const key = format(d, "yyyy-MM-dd");
      return { date: key, count: countMap[key] || 0 };
    });

    res.json(days);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/logs/stats  — all habits, last 30 days
export const getStats = async (req, res) => {
  try {
    const end   = format(new Date(), "yyyy-MM-dd");
    const start = format(subDays(new Date(), 29), "yyyy-MM-dd");

    const habits = await Habit.find({ userId: req.user._id, isArchived: false });
    const logs   = await Log.find({
      userId: req.user._id,
      completedDate: { $gte: start, $lte: end },
    });

    const perHabit = habits.map((h) => {
      const hLogs = logs.filter((l) => String(l.habitId) === String(h._id));
      const dates  = hLogs.map((l) => l.completedDate);
      const { current, longest } = calcStreak(dates);
      return {
        habitId:        h._id,
        name:           h.name,
        icon:           h.icon,
        color:          h.color,
        category:       h.category,
        completions30d: hLogs.length,
        currentStreak:  current,
        longestStreak:  longest,
      };
    });

    // Build array of days in range
    const days = eachDayOfInterval({
      start: parseISO(start),
      end:   parseISO(end),
    }).map((d) => format(d, "yyyy-MM-dd"));

    res.json({ perHabit, days });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/logs/stats/:habitId  — single habit detail
export const getHabitStats = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.habitId,
      userId: req.user._id,
    });
    if (!habit) return res.status(404).json({ message: "Habit not found." });

    const logs = await Log.find({
      userId: req.user._id,
      habitId: req.params.habitId,
    }).sort({ completedDate: -1 });

    const dates = logs.map((l) => l.completedDate);
    const { current, longest } = calcStreak(dates);

    // Monthly breakdown
    const monthly = {};
    dates.forEach((d) => {
      const month = d.slice(0, 7); // "yyyy-MM"
      monthly[month] = (monthly[month] || 0) + 1;
    });

    // Completion rate (last 30 days vs target)
    const last30Start = format(subDays(new Date(), 29), "yyyy-MM-dd");
    const last30Count = dates.filter((d) => d >= last30Start).length;
    const completionRate = Math.round((last30Count / (habit.targetDays || 7)) * 100);

    res.json({
      habit,
      totalCompletions: logs.length,
      currentStreak:    current,
      longestStreak:    longest,
      completionRate:   Math.min(completionRate, 100),
      monthly,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
