// ─────────────────────────────────────
//  Habit Routes
// ─────────────────────────────────────
import { Router } from "express";
import {
  getHabits, createHabit, updateHabit,
  deleteHabit, toggleArchive, reorderHabits,
} from "../controllers/habitController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/",           getHabits);
router.post("/",          createHabit);
router.put("/reorder",    reorderHabits);
router.put("/:id",        updateHabit);
router.delete("/:id",     deleteHabit);
router.put("/:id/archive", toggleArchive);

export default router;
