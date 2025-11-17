import { useState, useEffect } from 'react';
import Home from './Layan/Home';
import User from './Layan/User';
import Loading from './Layan/Loading';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

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