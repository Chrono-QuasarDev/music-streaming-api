import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { newReleases } from "./discovery.controller.js";

const router = Router();
router.use(authenticate);

router.get('/new-releases', newReleases);

export default router;