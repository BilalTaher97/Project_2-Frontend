import React, { useEffect } from "react";
import "../styles/dashboard.css";
import Header from "../components/header";
import {Chart as ChartJS, ArcElement,  Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Pie,Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AdminDashboard() {
 const barData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Frontend",
        data: [10, 30, 80, 60, 25, 75, 40],
        backgroundColor: '#1E293B'
      },
      {
        label: "Backend",
        data: [30, 50, 50, 20, 90, 30, 90],
        backgroundColor: "#FACC15",
      },
    ],
  };

  const options = {
    indexAxis: "y", // horizontal bars
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
  };

  const data = {
    labels: ["Completed", "Late", "In Progress"],
    datasets: [
      {
        data: [60, 25, 15],
        backgroundColor: ["#17c45e", "#f34c52ff ", "#FACC15"],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    document.body.classList.add("dashboard-page");
    return () => document.body.classList.remove("dashboard-page");
  }, []);

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
            <h2>
              34<span>Employee</span>
            </h2>
            </div>
            </div>
          </div>

          <div className="card">
            <div className="row">
               <i className="fa-solid fa-calendar-days"></i>
              <div className="column">
            <p>Total Tasks</p>
            <h2>
              120<span>Task</span>
            </h2>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="row">
                <i className="fa-solid fa-list-check"></i>
              <div className="column">
            <p>Completed Tasks</p>
            <h2>
              80<span>Task</span>
            </h2>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="row">
            <i className="fa-solid fa-bars-progress"></i>
            <div className="column">
            <p>In Progress Tasks</p>
            <h2>
              40<span>Task</span>
            </h2>
          </div>
          </div>
          </div>
        </div>

        <div className="card-view">
            <div className="card">
              <h2>Task Status</h2>
              <div className="chart-container" style={{ width: "250px", margin: "50px auto" }}>
                <Pie data={data} />
              </div>
            </div>
            <div className="card">
               <h2>Monthly Progress</h2>
               <div className="chart-container" style={{ width: "600px", margin: "50px auto" }}>
               <Bar data={barData} options={options} />
               </div>
            </div>
        </div>
      </div>
    </div>
  );
}
