import Router from "express";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { authorizePlaylistOwner } from "../../shared/middleware/authz.middleware.js";
import { 
  playlist, 
  getPlaylist, 
  allPlaylists, 
  updatePlaylist, 
  deletePlaylist, 
  addSongToPlaylist, 
  removeSongFromPlaylist 
} from "./playlist.controller.js";

const router = Router();
router.use(authenticate);

router.post('/', playlist);
router.get('/', allPlaylists);
router.get('/:id', getPlaylist);
router.put('/:id', authorizePlaylistOwner, updatePlaylist);
router.delete('/:id', authorizePlaylistOwner, deletePlaylist);
router.post('/:id/songs', authorizePlaylistOwner, addSongToPlaylist);
router.delete('/:id/songs/:songId', authorizePlaylistOwner, removeSongFromPlaylist);

export default router;