// ─────────────────────────────────────────────
//  Habit Controller
//  GET    /api/habits
//  POST   /api/habits
//  PUT    /api/habits/:id
//  DELETE /api/habits/:id
//  PUT    /api/habits/:id/archive
//  PUT    /api/habits/reorder
// ─────────────────────────────────────────────
import Habit from "../models/Habit.js";
import Log   from "../models/Log.js";

// GET /api/habits
export const getHabits = async (req, res) => {
  try {
    const { includeArchived } = req.query;
    const filter = { userId: req.user._id };
    if (includeArchived !== "true") filter.isArchived = false;

    const habits = await Habit.find(filter).sort({ order: 1, createdAt: 1 });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/habits
export const createHabit = async (req, res) => {
  try {
    const { name, description, category, frequency, targetDays, color, icon } = req.body;

    if (!name) return res.status(400).json({ message: "Habit name is required." });

    const count = await Habit.countDocuments({ userId: req.user._id });
    const habit = await Habit.create({
      userId: req.user._id,
      name: name.trim(),
      description: description || "",
      category:    category    || "Other",
      frequency:   frequency   || "daily",
      targetDays:  targetDays  || 7,
      color:       color       || "#6c6ff3",
      icon:        icon        || "🎯",
      order:       count,
    });

    res.status(201).json(habit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/habits/:id
export const updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });
    if (!habit) return res.status(404).json({ message: "Habit not found." });

    const allowed = ["name","description","category","frequency","targetDays","color","icon","order"];
    allowed.forEach((k) => { if (req.body[k] !== undefined) habit[k] = req.body[k]; });

    await habit.save();
    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/habits/:id
export const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!habit) return res.status(404).json({ message: "Habit not found." });

    // Remove all logs for this habit
    await Log.deleteMany({ habitId: req.params.id, userId: req.user._id });
    res.json({ message: "Habit deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/habits/:id/archive
export const toggleArchive = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });
    if (!habit) return res.status(404).json({ message: "Habit not found." });

    habit.isArchived = !habit.isArchived;
    await habit.save();
    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/habits/reorder
export const reorderHabits = async (req, res) => {
  try {
    const { orderedIds } = req.body; // array of habit IDs in new order
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: "orderedIds must be an array." });
    }

    await Promise.all(
      orderedIds.map((id, idx) =>
        Habit.updateOne({ _id: id, userId: req.user._id }, { order: idx })
      )
    );
    res.json({ message: "Reordered." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
