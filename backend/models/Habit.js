// ─────────────────────────────────────────────
//  Habit Model
// ─────────────────────────────────────────────
import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name:        { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category:    { type: String, default: "Other" },
    frequency:   { type: String, enum: ["daily", "weekly"], default: "daily" },
    targetDays:  { type: Number, default: 7 },
    color:       { type: String, default: "#6c6ff3" },
    icon:        { type: String, default: "🎯" },
    isArchived:  { type: Boolean, default: false, index: true },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Habit", habitSchema);
