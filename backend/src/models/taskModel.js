import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {

  },
  {
    timestamps: true,
  }
);

export const Task = mongoose.model("Task", taskSchema);
