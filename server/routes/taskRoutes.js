const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.post("/projects/:project_id/tasks", createTask);
router.get("/projects/:project_id/tasks", getTasksByProject);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;