import { useState, useEffect } from 'react';
import { Users, CheckCircle, TrendingUp, FolderOpen } from 'lucide-react';
import './Home.css';
import Login from "../Layan/Login";
import { useNavigate } from "react-router-dom";
import { getDashboard, logout, isAuthenticated } from './api';

function Home() {
  const [currentPage, setCurrentPage] = useState('home');
  const [animationComplete, setAnimationComplete] = useState(false); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        setIsLoggedIn(true);
        await fetchDashboardData();
      } else {
        setIsLoggedIn(false);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getDashboard();
      
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError('Failed to load dashboard data');
      // If unauthorized, redirect to login
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setCurrentPage('login');
    navigate('/');
  };

  useEffect(() => {
    setTimeout(() => setAnimationComplete(true), 100);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('home');
  };
  
  // Show login page if not logged in
  if (!isLoggedIn) {
    return <Login/>;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="App">
        <nav className="navbar">
          <div className="navbar-container">
            <h1 className="navbar-brand">TechnoSoft</h1>
          </div>
        </nav>
        <div className="home-container">
          <div className="home-content">
            <div className="welcome-section">
              <h1 className="welcome-title">Loading...</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics from API data or use defaults
  const totalTasks = dashboardData?.status?.total || 0;
  const completedTasks = dashboardData?.status?.completed || 0;
  const pendingTasks = dashboardData?.status?.pending || 0;
  const inProgressTasks = dashboardData?.status?.in_progress || 0;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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
              onClick={() => navigate('/employees')}
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
       <div className="home-container">
      <div className="home-content">
        
        {/* Animated Logo */}
        <div className={`logo-wrapper ${animationComplete ? 'animate-in' : 'animate-out'}`}>
          <div className="logo-container">
            <div className="logo-glow"></div>
            
            <img 
              src={require('../img/logoTechnosoft.jpeg')}
              alt="TechnoSoft Logo" 
              className="logo-image"
            />
          </div>
        </div>

        {/* Welcome Text */}
        <div className={`welcome-section ${animationComplete ? 'animate-in' : 'animate-out'}`}>
          <h1 className="welcome-title">
            Welcome to <span className="welcome-highlight">TechnoSoft</span>
          </h1>
          
          <p className="welcome-subtitle">
            Team Management Dashboard
          </p>

          {/* Error Message */}
          {error && (
            <div style={{ color: 'red', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          {/* Stats Cards - Using Real Data from API */}
          <div className="stats-grid">
            
            <div 
              className={`stat-card ${animationComplete ? 'animate-in' : 'animate-out'}`}
              style={{ transitionDelay: '800ms' }}
            >
              <div className="stat-icon">
                <Users size={32} color="#FACC15" />
              </div>
              <p className="stat-number">{totalTasks}</p>
              <p className="stat-label">Total Tasks</p>
            </div>

            <div 
              className={`stat-card ${animationComplete ? 'animate-in' : 'animate-out'}`}
              style={{ transitionDelay: '900ms' }}
            >
              <div className="stat-icon">
                <CheckCircle size={32} color="#22C55E" />
              </div>
              <p className="stat-number">{completedTasks}/{totalTasks}</p>
              <p className="stat-label">Tasks Completed</p>
            </div>

            <div 
              className={`stat-card ${animationComplete ? 'animate-in' : 'animate-out'}`}
              style={{ transitionDelay: '1000ms' }}
            >
              <div className="stat-icon">
                <TrendingUp size={32} color="#3B82F6" />
              </div>
              <p className="stat-number">{overallProgress}%</p>
              <p className="stat-label">Overall Progress</p>
            </div>

            <div 
              className={`stat-card ${animationComplete ? 'animate-in' : 'animate-out'}`}
              style={{ transitionDelay: '1100ms' }}
            >
              <div className="stat-icon">
                <FolderOpen size={32} color="#8B5CF6" />
              </div>
              <p className="stat-number">{inProgressTasks}</p>
              <p className="stat-label">In Progress</p>
            </div>

          </div>

          {/* Progress Overview */}
          <div className="progress-overview">
            <h2 className="progress-title">Team Progress</h2>
            <div className="progress-bar-container">
              <div 
                className={`progress-bar-fill ${animationComplete ? 'animate-in' : 'animate-out'}`}
                style={{ width: `${overallProgress}%` }}
              >
                <span className="progress-percentage">{overallProgress}%</span>
              </div>
            </div>
          </div>

          {/* Recent Tasks from API */}
          {dashboardData?.tasks && dashboardData.tasks.length > 0 && (
            <div className="progress-overview">
              <h2 className="progress-title">Recent Tasks</h2>
              <div style={{ marginTop: '1rem' }}>
                {dashboardData.tasks.slice(0, 3).map((task) => (
                  <div key={task.id} style={{ 
                    padding: '0.75rem', 
                    marginBottom: '0.5rem', 
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>{task.task_name}</span>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      background: task.status === 'completed' ? '#22C55E' : 
                                 task.status === 'in-progress' ? '#3B82F6' : '#FACC15'
                    }}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Button */}
          <div className={`cta-container ${animationComplete ? 'animate-in' : 'animate-out'}`}>
            <button className="cta-button" onClick={() => navigate("/employees")}>
              View Team Dashboard →
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
  );
}

export default Home;