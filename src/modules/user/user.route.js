import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { profile } from "./user.controller.js";

const router = Router();

router.get('/me', authenticate, profile);

export default router;