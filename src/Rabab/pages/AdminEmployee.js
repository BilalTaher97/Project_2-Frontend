import React, { useEffect, useState } from "react";
import Header from "../components/header";
import "../styles/Aemployees.css";
import profile from "../images/profile.png";

export default function AdminEmployee() {
  const [showForm, setShowForm] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    document.body.classList.add("adminEmployees-page");
    fetchEmployees();

    return () => document.body.classList.remove("adminEmployees-page");
  }, []);

  // fetch all employees
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/admin/employees", {
        headers: { "Content-Type": "application/json",
          Authorization: `Bearer ${token}` }
      });

      if (!res.ok) return;

      const data = await res.json();
   console.log(data);
      setEmployees(
        data.map((e) => ({
          id: e.id,
          name: e.name,
          img: e.photo || profile,
          department: e.department,
          email: e.email
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };

  // create employee
  const createEmployee = async (empData) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/admin/employees", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(empData)
      });

      const data = await res.json();

      if (!res.ok) return;

      setEmployees((prev) => [
        ...prev,
        {
          id: data.user.id,
          name: data.user.name,
          img: empData.photo || profile,
          department: empData.department,
          email: empData.email
        }
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  // update employee
  const updateEmployee = async (id, empData) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/admin/employees/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(empData)
      });

      const data = await res.json();

      if (!res.ok) return;

      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === id
            ? {
                id: data.id,
                name: data.name,
                department: data.department,
                email: data.email,
                img: data.photo || profile
              }
            : emp
          )
      );
      
    } catch (err) {
      console.log(err);
    }
  };

  // delete employee
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/admin/employees/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) return;

      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // handle form submit
 const handleFormSubmit = (e) => {
  e.preventDefault();
  const form = e.target;

  // Base employee data
  const empData = {
    name: form.name.value,
    department: form.department.value,
    photo: profile
  };

  if (!editEmployee) {
    // Only include email and password when creating a new employee
    empData.email = form.email.value;
    empData.password = form.password.value;
    createEmployee(empData);
  } else {
    // Update only name, department, photo
    updateEmployee(editEmployee.id, empData);
    setEditEmployee(null);
  }

  form.reset();
  setShowForm(false);
};



  // handle update click
  const handleUpdate = (emp) => {
    setEditEmployee(emp);
    setShowForm(true);
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
          <button
            className="create-btn"
            onClick={() => {
              setShowForm(!showForm);
              setEditEmployee(null);
            }}
          >
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
  {!editEmployee && (
    <>
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
      />
    </>
  )}

  <button type="submit" className="save-btn">
    {editEmployee ? "Update Employee" : "Add Employee"}
  </button>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.name}</td>
                  <td>
                    <img
                      src={emp.img}
                      alt={emp.name}
                      style={{ width: 40, height: 40, borderRadius: "50%" }}
                    />
                  </td>
                  <td>{emp.department}</td>
                  <td>
                    <button className="update-btn" onClick={() => handleUpdate(emp)}>
                      Update
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(emp.id)}>
                      Delete
                    </button>
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
