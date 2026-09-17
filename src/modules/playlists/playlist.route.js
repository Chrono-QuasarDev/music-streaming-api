import Router from "express";
import { playlist, getPlaylist, allPlaylists } from "./playlist.controller.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";

const router = Router();
router.use(authenticate);

router.post('/', playlist);
router.get('/', allPlaylists);
router.get('/:id', getPlaylist);

export default router;