import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { artist } from "./artist.controller.js";

const router = Router();
router.use(authenticate);

router.get('/:id', artist);

export default router;