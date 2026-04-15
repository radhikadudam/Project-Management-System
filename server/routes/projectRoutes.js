const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
} = require("../controllers/projectController");

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.delete("/:id", deleteProject);

module.exports = router;