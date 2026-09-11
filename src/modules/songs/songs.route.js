import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/authz.middleware.js";
import { songs, search, songInfo } from "./songs.controller.js";

const router = Router();
router.use(authenticate);

router.get('/', songs);
router.get('/search', search);
router.get('/:id', songInfo);

export default router;