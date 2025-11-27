import React, { useEffect, useState } from "react";
import Header from "../components/header";
import "../styles/adminTask.css";

export default function AdminTaskManager() {
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [formData, setFormData] = useState({
    status: "in_progress",
    progress_percentage: 0
  });
  const [tasks, setTasks] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    document.body.classList.add("adminTaskManager-page");
    fetchTasks();
    return () => document.body.classList.remove("adminTaskManager-page");
  }, []);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/tasks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Add a new task
  const createTask = async (taskData) => {
    try {
      const res = await fetch("http://localhost:5000/admin/tasks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(taskData)
      });
      if (!res.ok) throw new Error("Failed to add task");
      const data = await res.json();
      setTasks((prev) => [...prev, { ...data.task, assigned_employee: taskData.assigned_employee, progress_percentage: 0 }]);
    } catch (err) {
      console.error(err);
    }
  };

  // Update task (only status and progress)
  const updateTask = async (id, status, progress_percentage) => {
    try {
      const res = await fetch(`http://localhost:5000/admin/tasks/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status, progress_percentage })
      });
      if (!res.ok) throw new Error("Failed to update task");
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status, progress_percentage } : t
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      const res = await fetch(`http://localhost:5000/admin/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete task");
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    if (mm < 10) mm = "0" + mm;
    if (dd < 10) dd = "0" + dd;
    return `${yyyy}-${mm}-${dd}`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "red";
      case "medium": return "orange";
      case "low": return "green";
      default: return "gray";
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editTask) {
      updateTask(editTask.id, formData.status, formData.progress_percentage);
      setEditTask(null);
    } else {
      createTask(formData);
    }
    setFormData({ status: "in_progress" });
    setShowForm(false);
  };

  const handleUpdateClick = (task) => {
    setEditTask(task);
    setShowForm(true);
    setFormData({
      status: task.status,
      progress_percentage: task.progress_percentage || 0
    });
  };

  // Separate tasks by status
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
  const lateTasks = tasks.filter((t) => t.status === "pending");
  const completedTasks = tasks.filter((t) => t.status === "completed");

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
            <button className="create-btn" onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancel" : "Add Task"}
            </button>
          </div>

          {showForm && (
            <form className="task-form" onSubmit={handleFormSubmit}>
              <h3>{editTask ? "Edit Task" : "Add New Task"}</h3>

              {editTask ? (
                <>
                  <label>Status:</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="in_progress">In progress</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>

                  <label>Progress (%):</label>
                  <input
                    type="text"
                    min="0"
                    max="100"
                    value={formData.progress_percentage}
                    onChange={(e) =>
                      setFormData({ ...formData, progress_percentage: Number(e.target.value) })
                    }
                  />
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Task name"
                    value={formData.task_name || ""}
                    required
                    onChange={(e) => setFormData({ ...formData, task_name: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Task Description"
                    value={formData.description || ""}
                    required
                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  <input
                    type="number"
                    placeholder="Employee id"
                    value={formData.assigned_employee || ""}
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, assigned_employee: e.target.value })
                    }
                  />
                  <input
                    type="date"
                    value={formData.due_date || ""}
                    required
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  />
                  <select
                    value={formData.priority || "medium"}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <select
                    value={formData.status || "in_progress"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="in_progress">In progress</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </>
              )}

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
            {["In progress", "Pending", "Completed"].map((statusTitle) => {
              const taskList =
                statusTitle === "In progress"
                  ? inProgressTasks
                  : statusTitle === "Pending"
                  ? lateTasks
                  : completedTasks;

              return (
                <div key={statusTitle} className="items">
                  <h3>{statusTitle}</h3>
                  {taskList.map((task) => (
                    <div key={task.id} className={`item card ${
    task.status === "in_progress" ? "in_progress" :
    task.status === "pending" ? "pending" :
    task.status === "completed" ? "completed" : ""
  }`}>
                      <div className="row">
                        <p>{task.task_name}</p>
                        <div
  style={{
    width: 30,
    height: 30,
    borderRadius: "50%",
    backgroundColor: getPriorityColor(task.priority),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "10px",
    fontWeight: "bold",
    textTransform: "capitalize"
  }}
  title={`Priority: ${task.priority}`}
>
  {task.priority[0]}
</div>
                      </div>
                      <div className="deadline">
                        <i className="fa-solid fa-calendar"></i> Deadline:{" "}
                        {formatDate(task.due_date)}
                      </div>
                      <div className="name">{task.assigned_employee}</div>
                      <div className="actions">
                        <button className="edit-btn" onClick={() => handleUpdateClick(task)}>
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(task.id)}>
                          <i className="fa-solid fa-circle-xmark"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
