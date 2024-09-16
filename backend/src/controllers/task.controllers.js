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

//update task by user
const updateTaskByUser = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { description, category, status } = req.body;
    const { user } = req; // The logged-in user
  
    const task = await Task.findById(taskId);
  
    if (!task) {
      throw new ApiError(404, "Task not found.");
    }
  
    if (task.userId.toString() !== user._id.toString()) {
      throw new ApiError(403, "You do not have permission to update this task.");
    }
  
    // Validate and update task details
    if (description) task.description = description;
    if (category) task.category = category;
  
    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (status && validStatuses.includes(status)) {
      task.status = status;
    } else if (status) {
      throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
  
    const updatedTask = await task.save();
  
    return res
      .status(200)
      .json(new ApiResponse(200, updatedTask, "Task updated successfully."));
  });

// get tasks by category
const getTasksByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  if (!category) {
    throw new ApiError(400, "Category is required.");
  }

  const tasks = await Task.find({ category }).populate('userId'); // Populate userId to get user details

  if (!tasks.length) {
    throw new ApiError(404, "No tasks found for the specified category.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks retrieved successfully."));
});

//mark task as completed
const markTaskAsCompleted = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { user } = req; 
  
    const task = await Task.findById(taskId);
  
    if (!task) {
      throw new ApiError(404, "Task not found.");
    }
  
    if (task.userId.toString() !== user._id.toString()) {
      throw new ApiError(403, "You do not have permission to update this task.");
    }
  
    task.status = 'Completed';
    await task.save();
  
    return res
      .status(200)
      .json(new ApiResponse(200, task, "Task marked as completed successfully."));
  });
  
//   ADMIN
//admin create task for any user
const createTaskForUserByAdmin = asyncHandler(async (req, res) => {
    const { description, category, status, userId } = req.body;
  
    if (!description || !category || !userId) {
      throw new ApiError(400, "Description , category and userId are required.");
    }
  
    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (status && !validStatuses.includes(status)) {
      throw new ApiError(400, `Status must be one of: ${validStatuses.join(', ')}`);
    }
  
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found.");
    }
  
    // Create the task for the user
    const task = await Task.create({
      description,
      category,
      status: status || 'Pending',
      userId: user._id // Assign task to the specified user
    });
  
    return res.status(201).json(new ApiResponse(201, task, "Task created for the user successfully."));
  });
export { 
    createTask,
    deleteTaskByUser,
    updateTaskByUser,
    getTasksByCategory,
    markTaskAsCompleted,
    createTaskForUserByAdmin
 };
