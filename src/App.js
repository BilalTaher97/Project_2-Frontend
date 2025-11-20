import AdminDashoard from "./Rabab/pages/AdminDashboard";
import Admin from "./Rabab/Admin";
import AdminEmployee from "./Rabab/pages/AdminEmployee";
import AdminProgress from "./Rabab/pages/AdminProgress";
import AdminTaskManger from "./Rabab/pages/AdminTaskManager.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState, useEffect } from 'react';
import Home from './Layan/Home';
import User from './Layan/User';
import Loading from './Layan/Loading';
import Login from './Layan/Login';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  // Show loading screen
  if (isLoading) {
    return <Loading />;
  }

  return (
      <Router>
       <Routes> 
         <Route path="/" element={<Login />}/>
         <Route path="/home" element={<Home />} /> 
         <Route path="/employees" element={<User />} />
         <Route path="/adminDashoard" element={<AdminDashoard />} />
         <Route path="/Admin" element={<Admin />} />
         <Route path="/AdminEmployees" element={<AdminEmployee />} />
         <Route path="/AdminProgress" element={<AdminProgress />} />
         <Route path="/AdminTaskManger" element={<AdminTaskManger />} />
      </Routes>
    </Router>

  );
}

export default App;