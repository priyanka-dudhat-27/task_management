import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlware.js";
import { createTask , deleteTaskByUser } from "../controllers/task.controllers.js";
const router = Router();

router.route("/createTask").post(verifyJWT(['User']),createTask)
router.route("/deleteTask/:taskId").delete(verifyJWT(['User']), deleteTaskByUser);
 
export default router;
