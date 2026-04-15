# Project Management System

## 🚀 Overview
A mini project management system to manage projects and tasks.

## 🛠️ Tech Stack
- Backend: Node.js + Express
- Database: MySQL
- Frontend: React

## 📦 Features
- Create, view, delete projects
- Add, update, delete tasks
- Task status (todo, in-progress, done)
- Task priority (low, medium, high)
- Due date support
- Filter tasks by status
- Sort tasks by due date

## ⚙️ Setup Instructions

### Backend
cd backend  
npm install  
npm start  

### Frontend
cd frontend  
npm install  
npm start  

## 📡 API Endpoints

### Projects
- POST /projects
- GET /projects
- GET /projects/:id
- DELETE /projects/:id

### Tasks
- POST /projects/:project_id/tasks
- GET /projects/:project_id/tasks
- PUT /tasks/:id
- DELETE /tasks/:id

## 📸 Screenshots
<img width="1092" height="598" alt="image" src="https://github.com/user-attachments/assets/fbf1a646-fdac-497c-917d-d167c71beefc" />

## 📡 API Documentation

### 🔹 Projects APIs

#### 1. Create Project
POST /projects

Body:
{
  "name": "Task Manager",
  "description": "Manage tasks"
}

---

#### 2. Get All Projects
GET /projects?page=1&limit=10

---

#### 3. Get Project by ID
GET /projects/:id

---

#### 4. Delete Project
DELETE /projects/:id

---

### 🔹 Tasks APIs

#### 1. Create Task
POST /projects/:project_id/tasks

Body:
{
  "title": "Design UI",
  "status": "todo",
  "priority": "high",
  "due_date": "2026-04-20"
}

---

#### 2. Get Tasks by Project
GET /projects/:project_id/tasks?status=todo&sort=due_date

---

#### 3. Update Task
PUT /tasks/:id

Body:
{
  "title": "Updated Task",
  "status": "done",
  "priority": "medium"
}

---

#### 4. Delete Task
DELETE /tasks/:id
