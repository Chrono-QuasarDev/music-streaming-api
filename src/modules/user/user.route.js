import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/authz.middleware.js";
import { profile } from "./user.controller.js";

const router = Router();

router.get('/me', authenticate, authorize(['listener', 'admin']), profile);

export default router;