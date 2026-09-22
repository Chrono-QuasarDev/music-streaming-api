import { Router } from "express";
import authRouter from "./auth/auth.route.js";
import userRouter from "./user/user.route.js";
import songRouter from "./songs/songs.route.js";
import playlistRouter from "./playlists/playlist.route.js";

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/songs', songRouter);
router.use('/playlists', playlistRouter);

export default router;