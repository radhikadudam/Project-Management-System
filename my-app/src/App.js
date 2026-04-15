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

  // FETCH PROJECTS
  const fetchProjects = async () => {
    const res = await fetch("http://localhost:5000/projects");
    const data = await res.json();
    setProjects(data);
  };

  // FETCH TASKS
  const fetchTasks = async (projectId, status = "") => {
    let url = `http://localhost:5000/projects/${projectId}/tasks`;

    if (status) {
      url += `?status=${status}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

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
        }),
      }
    );

    setTaskTitle("");
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

            <button onClick={handleAddTask}>+ Add Task</button>
          </div>

          {/* FILTER */}
          <select
            className="filter"
            onChange={(e) => {
              setFilterStatus(e.target.value);
              fetchTasks(selectedProject.id, e.target.value);
            }}
          >
            <option value="">All Tasks</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          {/* TASK LIST */}
          {tasks.map((t) => (
            <div className="task-card" key={t.id}>
              <div>
                <h4>{t.title}</h4>
                <span className={`status ${t.status}`}>
                  {t.status}
                </span>
              </div>

              <div className="task-actions">
                <span className="priority">{t.priority}</span>

                <button onClick={() => setEditingTask(t)}>Edit</button>
              </div>
            </div>
          ))}

          {/* EDIT FORM */}
          {editingTask && (
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
      )}
    </div>
  );
}

export default App;