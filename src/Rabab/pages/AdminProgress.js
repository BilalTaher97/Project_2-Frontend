import React, { useEffect, useState } from "react";
import Header from "../components/header";
import "../styles/progress.css";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);


const barData = {
  labels: ["Task 1", "Task 2", "Task 3", "Task 4"],
  datasets: [
    {
      label: "Progress (%)",
      data: [80, 50, 70, 90],
      backgroundColor: "#FACC15",
      borderRadius: 4, // rounded edges
      barPercentage: 0.4, // width of each bar (0-1)
      categoryPercentage: 0.8, // spacing between bars (0-1)
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      max: 100,
    },
  },
};

const getStatusClass = (status) => {
  const s = status.toLowerCase();

  if (s === "in progress") return "status-gold";
  if (s === "completed") return "status-green";
  if (s === "pending" || s === "late") return "status-red";

  return "";
};


export default function AdminEmployee() {

    const [tasks, setTasks] = useState([
    {  id:1,name: "John Doe", task: "Developing frontend of the technosoft website", deadline: "12/5/2026",status:"in progress"},
    {  id:2, name: "John Doe", task: "Developing frontend of the technosoft website", deadline: "12/5/2026",status:"late"},
    {  id:3, name: "John Doe", task: "Developing frontend of the technosoft website", deadline: "12/5/2026",status:"completed"},
    {  id:4, name: "John Doe", task: "Developing frontend of the technosoft website", deadline: "12/5/2026",status:"in progress"},
    {  id:5, name: "John Doe", task: "Developing frontend of the technosoft website", deadline: "12/5/2026",status:"in progress"},
  ]);

  useEffect(() => {
    document.body.classList.add("adminProgress-page");
    return () => document.body.classList.remove("adminProgress-page");
  }, []);

  return (
    <div>
        <Header />
        <div className="col-9 overview-container card">
       <div className="ribbon">Overview</div>
           <div className="grid">
             <div className="col-4 cell">
                <p>
                    Total Tasks
                </p>
                <h3>150</h3>
             </div>
             <div className="col-4 cell">
                <p>
                    completed
                </p>
                <h3>21</h3>
             </div>
             <div className="col-4 cell">
                <p>
                    in progress
                </p>
                <h3>2</h3>
             </div>
             <div className="col-4 cell">
                <p>
                    late
                </p>
                <h3>20</h3>
             </div>
           </div>
        </div>
        <div className="row col-9">
            <div className="col-5 card">
      <h3>Progress Bar Chart</h3>
      <Bar data={barData} options={options}/>
    </div>
    <div className="col-7 card">
      <h3>Progress Details</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Task</th>
                <th>Deadline</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.name}</td>
                  <td>{task.task}</td>
                  <td>{task.deadline}</td>
                  <td className={getStatusClass(task.status)}>{task.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
    </div>
  );
}
