import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { artist, follow } from "./artist.controller.js";

const router = Router();
router.use(authenticate);

router.get('/:id', artist);
router.post('/:id/follow', follow);

export default router;