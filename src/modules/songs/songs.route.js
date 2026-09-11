import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/authz.middleware.js";
import { songs } from "./songs.controller.js";

const router = Router();
router.use(authenticate);

router.get('/', authorize(['admin', 'artist', 'listener']), songs);

export default router;