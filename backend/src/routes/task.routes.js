import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlware.js";
import { createTask , deleteTaskByUser , getTasksByCategory , markTaskAsCompleted} from "../controllers/task.controllers.js";
const router = Router();

router.route("/createTask").post(verifyJWT(['User']),createTask)
router.route("/deleteTask/:taskId").delete(verifyJWT(['User']), deleteTaskByUser);
router.route("/taskByCategory/:category").get(verifyJWT(['User']), getTasksByCategory);
router.route("/taskAsCompleted/:taskId").patch(verifyJWT(['User']), markTaskAsCompleted);

 
export default router;
