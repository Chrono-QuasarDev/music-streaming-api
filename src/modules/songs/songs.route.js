import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { songs, search, songInfo, stream } from "./songs.controller.js";

const router = Router();
// router.use(authenticate);

router.get('/', songs);
router.get('/search', search);
router.get('/:id', songInfo);
router.get('/:id/stream', stream);

export default router;