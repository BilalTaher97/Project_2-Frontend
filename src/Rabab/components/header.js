import React , { useState }  from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/header.css";
import logo from "../images/logo.png";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const links = [
    { name: "Dashboard", path: "/Admin" },
    { name: "Employees", path: "/adminEmployees" },
    { name: "Tasks", path: "/AdminTaskManger" },
    { name: "Progress", path: "/AdminProgress" },
  ];

    const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-inverse navbar-fixed-top header">
      <div onClick={() => navigate("/Admin")} style={{ cursor: "pointer" }}>
        <div className="logo-containerA">
          <img src={logo} width={'50px'} alt="logo"/>
        <h3>technosoft</h3>
        </div>
      </div>
     <div className="menu-btn" onClick={() => setOpen(!open)}>
        ☰
      </div>
           <ul className={`links ${open ? "show" : ""}`}>
        {links.map((link) => (
          <li
            key={link.name}
            className={`link ${location.pathname === link.path ? "active" : ""}`}
            onClick={() => {
              navigate(link.path);
              setOpen(false);
            }}
          >
            {link.name}
          </li>
        ))}
        <button
              onClick={handleLogout}
              className="nav-button logout"
            >
              Logout
            </button>
      </ul>
    </nav>
  );
}
