import { Router } from "express";
import authRouter from "./auth/auth.route.js";
import userRouter from "./user/user.route.js";
import songRouter from "./songs/songs.route.js";

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/songs', songRouter);

export default router;