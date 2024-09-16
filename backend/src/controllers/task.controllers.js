import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Task } from "../models/taskModel.js";
import { User } from "../models/userModel.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create a task
const createTask = asyncHandler(async (req, res) => {
    const { description, category, status } = req.body;
    const userId=req.user;
  
    if (!description || !category) {
      throw new ApiError(400, "Description and category are required.");
    }
  
    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (status && !validStatuses.includes(status)) {
      throw new ApiError(400, `Status must be one of the following: ${validStatuses.join(', ')}.`);
    }
  
    // Check if the user exists
    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(404, "User not found.");
      }
    }
  
    const task = await Task.create({
      description,
      category,
      status: status || 'Pending',
      userId
    });
  
    return res
      .status(201)
      .json(new ApiResponse(200, task, "Task created successfully."));
  });
  


// User deletes their own task
const deleteTaskByUser = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { user } = req;
  
    console.log('User:', user); // Debug: Check if user is populated
    console.log('Task ID:', taskId);
  
    if (!user || !user._id) {
      throw new ApiError(401, 'User not authenticated or user ID is missing.');
    }
  
    const task = await Task.findById(taskId);
  
    if (!task) {
      throw new ApiError(404, 'Task not found.');
    }
  
    console.log('Task:', task); // Debug: Check if task is found
    if (!task.userId) {
      throw new ApiError(404, 'Task owner information missing.');
    }
  
    if (task.userId.toString() !== user._id.toString()) {
      throw new ApiError(403, 'You do not have permission to delete this task.');
    }
  
    await Task.findByIdAndDelete(taskId);
  
    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Task deleted successfully.'));
  });
  

export { 
    createTask,
    deleteTaskByUser
 };
