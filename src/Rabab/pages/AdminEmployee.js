import React, { useEffect, useState } from "react";
import Header from "../components/header";
import "../styles/Aemployees.css";
import profile from "../images/profile.png";

export default function AdminEmployee() {
  const [showForm, setShowForm] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);

  useEffect(() => {
    document.body.classList.add("adminEmployees-page");
    return () => document.body.classList.remove("adminEmployees-page");
  }, []);

  const [employees, setEmployees] = useState([
    { id: 1, name: "John Doe", img: profile, department: "IT", email: "john@example.com" },
    { id: 2, name: "Jane Smith", img: profile, department: "HR", email: "jane@example.com" },
    { id: 3, name: "Mike Johnson", img: profile, department: "Finance", email: "mike@example.com" },
  ]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const empData = {
      id: editEmployee ? editEmployee.id : employees.length + 1,
      name: form.name.value,
      img: profile,
      department: form.department.value,
      email: form.email.value,
    };

    if (editEmployee) {
      // Update existing employee
      setEmployees(employees.map(emp => emp.id === editEmployee.id ? empData : emp));
      setEditEmployee(null);
    } else {
      // Create new employee
      setEmployees([...employees, empData]);
    }

    form.reset();
    setShowForm(false);
  };

  const handleUpdate = (emp) => {
    setEditEmployee(emp);
    setShowForm(true);
  };

 const handleDelete = (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
  if (confirmDelete) {
    setEmployees(employees.filter(emp => emp.id !== id));
  }
};

  return (
    <div>
      <Header />
      <div className="container">
        <div className="breadcrumb">
          <span>Admin</span> &gt; <span>Employees</span>
        </div>

        <div className="table-header">
          <h2>Employees</h2>
          <button className="create-btn" onClick={() => { setShowForm(!showForm); setEditEmployee(null); }}>
            {showForm && !editEmployee ? "Cancel" : "Create Employee"}
          </button>
        </div>

        {showForm && (
          <div className="create-form">
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                defaultValue={editEmployee ? editEmployee.name : ""}
                required
              />
              <input
                type="text"
                name="department"
                placeholder="Department"
                defaultValue={editEmployee ? editEmployee.department : ""}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                defaultValue={editEmployee ? editEmployee.email : ""}
                required
              />
              <button type="submit" className="save-btn">{editEmployee ? "Update Employee" : "Add Employee"}</button>
            </form>
          </div>
        )}

        <div className="card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Image</th>
                <th>Department</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.name}</td>
                  <td><img src={emp.img} alt={emp.name} style={{ width: 40, height: 40, borderRadius: "50%" }} /></td>
                  <td>{emp.department}</td>
                  <td>{emp.email}</td>
                  <td>
                    <button className="update-btn" onClick={() => handleUpdate(emp)}>Update</button>
                    <button className="delete-btn" onClick={() => handleDelete(emp.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
