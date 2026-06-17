// ─────────────────────────────────────
//  AI Routes
// ─────────────────────────────────────
import { Router } from "express";
import {
  weeklyReport, suggestHabits,
  recoveryPlan, chat, morningMotivation,
} from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.post("/weekly-report",  weeklyReport);
router.post("/suggest-habits", suggestHabits);
router.post("/recovery-plan",  recoveryPlan);
router.post("/chat",           chat);
router.get("/morning",         morningMotivation);

export default router;
