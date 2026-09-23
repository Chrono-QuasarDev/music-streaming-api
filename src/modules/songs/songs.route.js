import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { songs, search, songInfo, stream, share } from "./songs.controller.js";

const router = Router();
router.use(authenticate);

router.get('/', songs);
router.get('/search', search);
router.get('/:id/stream', stream);
router.post('/:id/share', share);
router.get('/:id', songInfo);

export default router;