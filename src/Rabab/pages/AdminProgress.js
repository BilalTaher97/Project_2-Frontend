import React, { useEffect, useState } from "react";
import Header from "../components/header";
import "../styles/progress.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AdminEmployee() {
  const [overview, setOverview] = useState({
    totalEmployees: 0,
    totalTasks: 0,
    taskStatistics: { completed: 0, in_progress: 0, overdue: 0 },
  });

  const [progressData, setProgressData] = useState([]);
  const token = localStorage.getItem("authToken");

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    if (mm < 10) mm = "0" + mm;
    if (dd < 10) dd = "0" + dd;
    return `${yyyy}-${mm}-${dd}`;
  };

  const formatTaskName = (name, maxLength = 20) => {
    if (name.length <= maxLength) return name;
    return name.slice(0, maxLength) + "...";
  };

  useEffect(() => {
    document.body.classList.add("adminProgress-page");

    const fetchOverview = async () => {
      try {
        const res = await fetch("http://localhost:5000/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch overview");
        const data = await res.json();
        setOverview(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchProgress = async () => {
      try {
        const res = await fetch("http://localhost:5000/admin/progress", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch progress data");
        const data = await res.json();
        setProgressData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOverview();
    fetchProgress();

    return () => document.body.classList.remove("adminProgress-page");
  }, [token]);

  const barData = {
    labels: progressData.map((task) => formatTaskName(task.task_name)),
    datasets: [
      {
        label: "Progress (%)",
        data: progressData.map((task) => task.progress_percentage),
        backgroundColor: "#FACC15",
        borderRadius: 4,
        barPercentage: 0.4,
        categoryPercentage: 0.8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, max: 100 },
    },
  };

  return (
    <div>
      <Header />
      <div className="col-9 overview-container card">
        <div className="ribbon">Overview</div>
        <div className="grid">
          <div className="col-4 cell">
            <p>Total Tasks</p>
            <h3>{overview.totalTasks}</h3>
          </div>
          <div className="col-4 cell">
            <p>Completed</p>
            <h3>{overview.taskStatistics.completed}</h3>
          </div>
          <div className="col-4 cell">
            <p>In Progress</p>
            <h3>{overview.taskStatistics.in_progress}</h3>
          </div>
          <div className="col-4 cell">
            <p>Overdue</p>
            <h3>{overview.taskStatistics.overdue}</h3>
          </div>
        </div>
      </div>

      <div className="row col-9">
        <div className="col-12 card">
          <h3>Progress Bar Chart</h3>
          <Bar data={barData} options={barOptions} />
        </div>

        <div className="col-12 card">
          <h3>Progress Details</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Task</th>
                <th>Updated At</th>
                <th>Progress (%)</th>
              </tr>
            </thead>
            <tbody>
              {progressData.map((task, index) => (
                <tr key={index}>
                  <td>{task.employee}</td>
                  <td>{task.task_name}</td>
                  <td>{formatDate(task.updated_at)}</td>
                  <td>{task.progress_percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
