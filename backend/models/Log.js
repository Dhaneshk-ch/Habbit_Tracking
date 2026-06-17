// ─────────────────────────────────────────────
//  Log Model  — one doc per habit per day
// ─────────────────────────────────────────────
import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    userId:        { type: mongoose.Schema.Types.ObjectId, ref: "User",  required: true, index: true },
    habitId:       { type: mongoose.Schema.Types.ObjectId, ref: "Habit", required: true, index: true },
    completedDate: { type: String, required: true }, // "yyyy-MM-dd"
  },
  { timestamps: true }
);

// Prevent duplicate log for same habit on same day
logSchema.index({ userId: 1, habitId: 1, completedDate: 1 }, { unique: true });

export default mongoose.model("Log", logSchema);
