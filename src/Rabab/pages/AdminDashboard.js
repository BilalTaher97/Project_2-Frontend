import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import Header from "../components/header";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalTasks: 0,
    taskStatistics: { completed: 0, in_progress: 0, overdue: 0 }
  });

useEffect(() => {
  document.body.classList.add("dashboard-page");

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found");
        return;
      }

      const res = await fetch("http://localhost:5000/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchData();

  return () => document.body.classList.remove("dashboard-page");
}, []);


  const pieData = {
    labels: ["Completed", "overdue", "In Progress"],
    datasets: [
      {
        data: [stats.taskStatistics.completed, stats.taskStatistics.overdue, stats.taskStatistics.in_progress],
        backgroundColor: ["#17c45e", "#f34c52", "#FACC15"],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ["All","Completed"],
    datasets: [
      {
        label: "Number of Tasks",
        data: [stats.totalTasks , stats.taskStatistics.completed , 20],
        backgroundColor: '#1E293B',
        barPercentage: 0.4
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: { legend: { position: "top" } },
    scales: { x: { stacked: true }, y: { stacked: true } },
  };

  return (
    <div className="dashboard-wrapper">
      <Header />
      <div className="admin-dashboard">
        <h2>Dashboard</h2>
        <div className="stats-cards">
          <div className="card">
            <div className="row">
              <i className="fa-solid fa-users"></i>
              <div className="column">
                <p>Total Employees</p>
                <h2>{stats.totalEmployees}<span>Employee</span></h2>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="row">
              <i className="fa-solid fa-calendar-days"></i>
              <div className="column">
                <p>Total Tasks</p>
                <h2>{stats.totalTasks}<span>Task</span></h2>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="row">
              <i className="fa-solid fa-list-check"></i>
              <div className="column">
                <p>Completed Tasks</p>
                <h2>{stats.taskStatistics.completed}<span>Task</span></h2>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="row">
              <i className="fa-solid fa-bars-progress"></i>
              <div className="column">
                <p>In Progress Tasks</p>
                <h2>{stats.taskStatistics.in_progress}<span>Task</span></h2>
              </div>
            </div>
          </div>
        </div>

        <div className="card-view">
          <div className="card">
            <h2>Task Status</h2>
            <div className="chart-container" style={{ width: "250px", margin: "50px auto" }}>
              <Pie data={pieData} />
            </div>
          </div>
          <div className="card">
            <h2>Tasks Progress</h2>
            <div className="chart-container" style={{ width: "600px", margin: "50px auto" }}>
              <Bar data={barData} options={options} height={100}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
