import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/authz.middleware.js";
import { uploadAudio } from "../../shared/middleware/multer.middleware.js";
import { songs, search, songInfo, stream, share, addSong } from "./songs.controller.js";

const router = Router();
router.use(authenticate);

router.get('/', songs);
router.get('/search', search);
router.get('/:id/stream', stream);
router.post('/:id/share', share);
router.get('/:id', songInfo);
router.post('/upload', authorize(['admin', 'artist']), uploadAudio, addSong);

export default router;