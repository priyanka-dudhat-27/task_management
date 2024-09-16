import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlware.js";
import { createTask } from "../controllers/task.controllers.js";
const router = Router();

router.route("/createTask").post(verifyJWT(['User']),createTask)

export default router;
