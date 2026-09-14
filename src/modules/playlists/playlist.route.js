import Router from "express";
import { playlist } from "./playlist.controller.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";

const router = Router();
router.use(authenticate);

router.post('/', playlist);

export default router;