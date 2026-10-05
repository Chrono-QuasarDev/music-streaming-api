import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { profile, publicProfile, updateProfile } from "./user.controller.js";

const router = Router();

router.get('/me', authenticate, profile);
router.get('/:id/profile', authenticate, publicProfile);
router.put('/me', authenticate, updateProfile);

export default router;