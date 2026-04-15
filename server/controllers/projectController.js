const db = require("../config/db");

// CREATE PROJECT
exports.createProject = (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Project name is required" });
  }

  const sql = "INSERT INTO projects (name, description) VALUES (?, ?)";
  db.query(sql, [name, description], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Project created", id: result.insertId });
  });
};

// GET ALL PROJECTS (Pagination)
exports.getProjects = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const sql = "SELECT * FROM projects LIMIT ? OFFSET ?";
  db.query(sql, [limit, offset], (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
};

// GET SINGLE PROJECT
exports.getProjectById = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM projects WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};

// DELETE PROJECT
exports.deleteProject = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM projects WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Project deleted" });
  });
};