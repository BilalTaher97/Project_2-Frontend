import React, { useEffect, useState } from "react";
import Header from "../components/header";
import "../styles/adminTask.css";
import profile from "../images/profile.png";

export default function AdminTaskManager() {
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    task: "",
    deadline: "",
    status: "in progress"
  });

  const [tasks, setTasks] = useState([
    { id: 1, name: "John Doe", task: "Developing frontend", deadline: "2026-5-12", status: "in progress" },
    { id: 2, name: "John Doe", task: "Fix backend issue", deadline: "2026-5-12", status: "late" },
    { id: 3, name: "John Doe", task: "Deploy website", deadline: "2026-5-12", status: "completed" }
  ]);

  const inProgressTasks = tasks.filter(t => t.status === "in progress");
  const lateTasks = tasks.filter(t => t.status === "late");
  const completedTasks = tasks.filter(t => t.status === "completed");
  

  useEffect(() => {
    document.body.classList.add("adminTaskManager-page");
    return () => document.body.classList.remove("adminTaskManager-page");
  }, []);

  const openForm = () => {
    setShowForm(true);
    setEditTask(null);
    setFormData({ name: "", task: "", deadline: "", status: "in progress" });
  };

  const handleUpdate = (task) => {
    setEditTask(task);
    setShowForm(true);
    setFormData({
      name: task.name,
      task: task.task,
      deadline: task.deadline,
      status: task.status
    });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Delete this task?");
    if (confirmDelete) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (editTask) {
      setTasks(
        tasks.map(t =>
          t.id === editTask.id ? { ...editTask, ...formData } : t
        )
      );
    } else {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          name: formData.name,
          task: formData.task,
          deadline: formData.deadline,
          status: formData.status
        }
      ]);
    }

    setShowForm(false);
    setEditTask(null);
    setFormData({ name: "", task: "", deadline: "", status: "in progress" });
  };

  return (
    <div>
      <Header />

      <div className="container col-lg-10">
        <div className="breadcrumb">
          <span>Admin</span> &gt; <span>Task Manager</span>
        </div>

        <div className="card">
          <div className="table-header">
            <h2>Task Manager</h2>
            <button className="create-btn" onClick={openForm}>
              Add New Task
            </button>
          </div>

          {showForm && (
            <form className="task-form" onSubmit={handleFormSubmit}>

              <h3>{editTask ? "Edit Task" : "Create New Task"}</h3>

              <input
                type="text"
                placeholder="Employee name"
                value={formData.name}
                required
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <input
                type="text"
                placeholder="Task description"
                value={formData.task}
                required
                onChange={(e) => setFormData({ ...formData, task: e.target.value })}
              />

              <input
                type="date"
                value={formData.deadline}
                required
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />

              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="in progress">In progress</option>
                <option value="late">Late</option>
                <option value="completed">Completed</option>
              </select>

              <div className="form-buttons">
                <button type="submit" className="save-btn">
                  {editTask ? "Save Changes" : "Add Task"}
                </button>

                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>

            </form>
          )}

          <div className="grid">

            {/* In Progress */}
            <div className="items in-progress-task">
              <h3>In progress</h3>
              {inProgressTasks.map((task) => (
                <div key={task.id} className="item card">
                  <div className="row">
                    <p>{task.task}</p>
                    <img src={profile} alt="profile" />
                  </div>

                  <div className="deadline">
                    <i className="fa-solid fa-calendar"></i> Deadline: {task.deadline}
                  </div>

                  <div className="name">{task.name}</div>

                  <div className="actions">
                    <button className="edit-btn" onClick={() => handleUpdate(task)}><i className="fa-solid fa-pen-to-square"></i></button>
                    <button className="delete-btn" onClick={() => handleDelete(task.id)}><i className="fa-solid fa-circle-xmark"></i></button>
                  </div>
                </div>
              ))}
            </div>

            {/* Late */}
            <div className="items late">
              <h3>Late</h3>
              {lateTasks.map((task) => (
                <div key={task.id} className="item card">
                  <div className="row">
                    <p>{task.task}</p>
                    <img src={profile} alt="profile" />
                  </div>

                  <div className="deadline">
                    <i className="fa-solid fa-calendar"></i> Deadline: {task.deadline}
                  </div>

                  <div className="name">{task.name}</div>

                  <div className="actions">
                    <button className="edit-btn" onClick={() => handleUpdate(task)}><i className="fa-solid fa-pen-to-square"></i></button>
                    <button className="delete-btn" onClick={() => handleDelete(task.id)}><i className="fa-solid fa-circle-xmark"></i></button>
                  </div>
                </div>
              ))}
            </div>

            {/* Completed */}
            <div className="items completed">
              <h3>Completed</h3>
              {completedTasks.map((task) => (
                <div key={task.id} className="item card">
                  <div className="row">
                    <p>{task.task}</p>
                    <img src={profile} alt="profile" />
                  </div>

                  <div className="deadline">
                    <i className="fa-solid fa-calendar"></i> Deadline: {task.deadline}
                  </div>

                  <div className="name">{task.name}</div>

                  <div className="actions">
                    <button className="edit-btn" onClick={() => handleUpdate(task)}><i className="fa-solid fa-pen-to-square"></i></button>
                    <button className="delete-btn" onClick={() => handleDelete(task.id)}><i className="fa-solid fa-circle-xmark"></i></button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
