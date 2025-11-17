import { useState, useEffect } from 'react';
import { Users, CheckCircle, TrendingUp, FolderOpen } from 'lucide-react';
import './Home.css';

function Home({ onNavigateToUsers }) {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimationComplete(true), 100);
  }, []);

  return (
    <div className="home-container">
      <div className="home-content">
        
        {/* Animated Logo - Updated to use Image */}
        <div className={`logo-wrapper ${animationComplete ? 'animate-in' : 'animate-out'}`}>
          <div className="logo-container">
            <div className="logo-glow"></div>
            
            {/* Replaced SVG with Image */}
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

          {/* Stats Cards */}
          <div className="stats-grid">
            
            <div 
              className={`stat-card ${animationComplete ? 'animate-in' : 'animate-out'}`}
              style={{ transitionDelay: '800ms' }}
            >
              <div className="stat-icon">
                <Users size={32} color="#FACC15" />
              </div>
              <p className="stat-number">6</p>
              <p className="stat-label">Total Employees</p>
            </div>

            <div 
              className={`stat-card ${animationComplete ? 'animate-in' : 'animate-out'}`}
              style={{ transitionDelay: '900ms' }}
            >
              <div className="stat-icon">
                <CheckCircle size={32} color="#22C55E" />
              </div>
              <p className="stat-number">36/46</p>
              <p className="stat-label">Tasks Completed</p>
            </div>

            <div 
              className={`stat-card ${animationComplete ? 'animate-in' : 'animate-out'}`}
              style={{ transitionDelay: '1000ms' }}
            >
              <div className="stat-icon">
                <TrendingUp size={32} color="#3B82F6" />
              </div>
              <p className="stat-number">78%</p>
              <p className="stat-label">Overall Progress</p>
            </div>

            <div 
              className={`stat-card ${animationComplete ? 'animate-in' : 'animate-out'}`}
              style={{ transitionDelay: '1100ms' }}
            >
              <div className="stat-icon">
                <FolderOpen size={32} color="#8B5CF6" />
              </div>
              <p className="stat-number">4</p>
              <p className="stat-label">Active Projects</p>
            </div>

          </div>

          {/* Progress Overview */}
          <div className="progress-overview">
            <h2 className="progress-title">Team Progress</h2>
            <div className="progress-bar-container">
              <div 
                className={`progress-bar-fill ${animationComplete ? 'animate-in' : 'animate-out'}`}
              >
                <span className="progress-percentage">78%</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className={`cta-container ${animationComplete ? 'animate-in' : 'animate-out'}`}>
            <button className="cta-button" onClick={onNavigateToUsers}>
              View Team Dashboard →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;