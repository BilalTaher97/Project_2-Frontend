import { useState, useEffect } from 'react';
import Home from './Layan/Home';
import User from './Layan/User';
import Loading from './Layan/Loading';
import Login from './Layan/Login';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  // Show loading screen
  if (isLoading) {
    return <Loading />;
  }

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // Show main app after login
  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-brand">TechnoSoft</h1>
          <div className="nav-buttons">
            <button
              onClick={() => setCurrentPage('home')}
              className={currentPage === 'home' ? 'nav-button active' : 'nav-button'}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage('employees')}
              className={currentPage === 'employees' ? 'nav-button active' : 'nav-button'}
            >
              Employees
            </button>
            <button
              onClick={handleLogout}
              className="nav-button logout"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="pt-16">
        {currentPage === 'home' && <Home onNavigateToUsers={() => setCurrentPage('employees')} />}
        {currentPage === 'employees' && <User />}
      </div>
    </div>
  );
}

export default App;