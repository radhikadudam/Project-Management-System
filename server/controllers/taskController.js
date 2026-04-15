const db = require("../config/db");

// CREATE TASK
exports.createTask = (req, res) => {
  const { project_id } = req.params;
  const { title, description, status, priority, due_date } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const sql = `
    INSERT INTO tasks (project_id, title, description, status, priority, due_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [project_id, title, description, status, priority, due_date],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Task created", id: result.insertId });
    }
  );
};

// Get Tasks (Filtering + Sorting)
exports.getTasksByProject = (req, res) => {
  const { project_id } = req.params;
  const { status, sort } = req.query;

  let sql = "SELECT * FROM tasks WHERE project_id = ?";
  let params = [project_id];

  // FILTER
  if (status) {
    sql += " AND status = ?";
    params.push(status);
  }

  // SORT
  if (sort === "due_date") {
    sql += " ORDER BY due_date ASC";
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
};


// Update Task
exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, due_date } = req.body;

  const sql = `
    UPDATE tasks 
    SET 
      title = ?, 
      description = ?, 
      status = ?, 
      priority = ?, 
      due_date = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      title || "",
      description || "",
      status || "todo",
      priority || "medium",
      due_date || null,
      id,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      res.json({ message: "Task updated successfully" });
    }
  );
};

// delete task
exports.deleteTask = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM tasks WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Task deleted" });
  });
};