import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorize } from "../../shared/middleware/authz.middleware.js";
import { songs, search } from "./songs.controller.js";

const router = Router();
router.use(authenticate);

router.get('/', authorize(['admin', 'artist', 'listener']), songs);
router.get('/search', authorize(['admin', 'artist', 'listener']), search);

export default router;