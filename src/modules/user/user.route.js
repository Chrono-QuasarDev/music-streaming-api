import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { profile, publicProfile } from "./user.controller.js";

const router = Router();

router.get('/me', authenticate, profile);
router.get('/:id/profile', authenticate, publicProfile);

export default router;