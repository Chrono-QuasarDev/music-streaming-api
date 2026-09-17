import Router from "express";
import { playlist, getPlaylist, allPlaylists, updatePlaylist } from "./playlist.controller.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorizePlaylistOwner } from "../../shared/middleware/authz.middleware.js";

const router = Router();
router.use(authenticate);

router.post('/', playlist);
router.get('/', allPlaylists);
router.get('/:id', getPlaylist);
router.put('/:id', authorizePlaylistOwner, updatePlaylist);

export default router;