import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Task } from "../models/taskModel.js";
import { User } from "../models/userModel.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create a task
const createTask = asyncHandler(async (req, res) => {
  const { description, category, status, userId } = req.body;

  if (!description || !category) {
    throw new ApiError(400, "Description and category are required.");
  }

  const validStatuses = ['Pending', 'In Progress', 'Completed'];
  if (status && !validStatuses.includes(status)) {
    throw new ApiError(400, `Status must be one of the following: ${validStatuses.join(', ')}.`);
  }

  //check valid user
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

export { createTask };
