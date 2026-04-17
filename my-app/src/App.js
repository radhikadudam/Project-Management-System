import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskStatus, setTaskStatus] = useState("todo");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [filterStatus, setFilterStatus] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);
const limit = 5; // or 10

  // FETCH PROJECTS
 const fetchProjects = async (pageNumber = 1) => {
  const res = await fetch(
    `http://localhost:5000/projects?page=${pageNumber}&limit=${limit}`
  );
  const data = await res.json();
  setProjects(data);
};

  // FETCH TASKS
 const fetchTasks = async (projectId, status = "", sort = "") => {
  let url = `http://localhost:5000/projects/${projectId}/tasks`;

  let params = [];

  if (status) params.push(`status=${status}`);
  if (sort) params.push(`sort=${sort}`);

  if (params.length) {
    url += `?${params.join("&")}`;
  }

  const res = await fetch(url);
  const data = await res.json();
  setTasks(data);
};

 useEffect(() => {
  fetchProjects(page);
}, [page]);

  // CREATE PROJECT
  const createProject = async () => {
    if (!name) return;

    await fetch("http://localhost:5000/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    setName("");
    fetchProjects();
  };

  // DELETE PROJECT
  const deleteProject = async (id) => {
    await fetch(`http://localhost:5000/projects/${id}`, {
      method: "DELETE",
    });

    fetchProjects();
    setSelectedProject(null);
  };

  // ADD TASK
  const handleAddTask = async () => {
    if (!taskTitle) return;

    await fetch(
      `http://localhost:5000/projects/${selectedProject.id}/tasks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  title: taskTitle,
  status: taskStatus,
  priority: taskPriority,
  due_date: dueDate, // ✅ ADD THIS
})
      }
    );

    setTaskTitle("");
    setDueDate("");
    fetchTasks(selectedProject.id);
  };

  // UPDATE TASK
  const handleUpdateTask = async () => {
  await fetch(`http://localhost:5000/${editingTask.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: editingTask.title,
      status: editingTask.status,
      priority: editingTask.priority,
      description: editingTask.description || "",
      due_date: editingTask.due_date || null,
    }),
  });

  setEditingTask(null);
  fetchTasks(selectedProject.id);
};

  return (
    <div className="container">
      <h1>📋 Project Manager</h1>

      {/* CREATE PROJECT */}
      <div className="card">
        <input
          placeholder="Enter project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={createProject}>+ Add Project</button>
      </div>

      {/* PROJECT LIST */}
      <div className="grid">
        {projects.map((p) => (
          <div className="project-card" key={p.id}>
            <h3>{p.name}</h3>

            <div className="actions">
              <button
                className="open"
                onClick={() => {
                  setSelectedProject(p);
                  fetchTasks(p.id);
                }}
              >
                Open
              </button>

              <button
                className="delete"
                onClick={() => deleteProject(p.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
{/* pagination */}
      <div style={{ marginTop: "20px" }}>
  <button onClick={() => setPage(page - 1)} disabled={page === 1}>
    Prev
  </button>

  <span style={{ margin: "0 10px" }}>Page {page}</span>

  <button
  onClick={() => setPage(page + 1)}
  disabled={projects.length < limit}
>
  Next
</button>
</div>

      {/* TASK SECTION */}
      {selectedProject && (
        <div className="task-section">
          <h2>📝 Tasks - {selectedProject.name}</h2>

          {/* ADD TASK */}
          <div className="task-form">
            <input
              placeholder="Task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />

            <select
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>

            <select
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
<input
  type="date"
  value={dueDate}
  onChange={(e) => setDueDate(e.target.value)}
/>
            <button onClick={handleAddTask}>+ Add Task</button>
          </div>

          {/* FILTER */}
          <select
  className="filter"
  onChange={(e) => {
    setFilterStatus(e.target.value);
    fetchTasks(selectedProject.id, e.target.value, sortBy);
  }}
>
            <option value="">All Tasks</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
{/* sort */}
<select
  className="filter"
  onChange={(e) => {
    setSortBy(e.target.value);
    fetchTasks(selectedProject.id, filterStatus, e.target.value);
  }}
>
  <option value="">Sort</option>
  <option value="due_date">Sort by Due Date</option>
</select>
          {/* TASK LIST */}
          {tasks.map((t) => (
  <div key={t.id}>
    <div className="task-card">
      <div>
        <h4>{t.title}</h4>
        <span className={`status ${t.status}`}>
          {t.status}
        </span>
        <p>Due: {t.due_date || "N/A"}</p>
      </div>

      <div className="task-actions">
        <span className="priority">{t.priority}</span>

        <button onClick={() => setEditingTask(t)}>Edit</button>
      </div>
    </div>

    {/* ✅ EDIT FORM BELOW SELECTED TASK */}
    {editingTask && editingTask.id === t.id && (
      <div className="edit-form">
        <input
          value={editingTask.title}
          onChange={(e) =>
            setEditingTask({
              ...editingTask,
              title: e.target.value,
            })
          }
        />

        <select
          value={editingTask.status}
          onChange={(e) =>
            setEditingTask({
              ...editingTask,
              status: e.target.value,
            })
          }
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <button onClick={handleUpdateTask}>Update</button>
      </div>
    )}
  </div>
))}

          
        </div>
      )}
    </div>
  );
}

export default App;