import { useState } from 'react';
import { Search, Filter, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import './User.css';

function User() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  
  const [employees] = useState([
    {
      id: 1,
      name: "Sarah Ahmed",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      department: "Frontend Developer",
      tasksCompleted: 8,
      totalTasks: 10,
      status: "Active",
      tasks: [
        { name: "Design Homepage", status: "completed", progress: 100 },
        { name: "Build Dashboard", status: "completed", progress: 100 },
        { name: "User Authentication UI", status: "in-progress", progress: 65 },
        { name: "Responsive Design", status: "pending", progress: 0 }
      ]
    },
    {
      id: 2,
      name: "Mohammad Ali",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      department: "Backend Developer",
      tasksCompleted: 6,
      totalTasks: 8,
      status: "Active",
      tasks: [
        { name: "API Development", status: "completed", progress: 100 },
        { name: "Database Setup", status: "completed", progress: 100 },
        { name: "Authentication Logic", status: "in-progress", progress: 50 },
        { name: "Testing APIs", status: "delayed", progress: 20 }
      ]
    },
    {
      id: 3,
      name: "Layla Hassan",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      department: "UI/UX Designer",
      tasksCompleted: 5,
      totalTasks: 6,
      status: "Active",
      tasks: [
        { name: "Wireframe Design", status: "completed", progress: 100 },
        { name: "Prototype Creation", status: "completed", progress: 100 },
        { name: "User Testing", status: "in-progress", progress: 70 }
      ]
    },
    {
      id: 4,
      name: "Ahmed Khalil",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      department: "Frontend Developer",
      tasksCompleted: 7,
      totalTasks: 9,
      status: "Busy",
      tasks: [
        { name: "Component Library", status: "completed", progress: 100 },
        { name: "Responsive Design", status: "in-progress", progress: 80 },
        { name: "Testing", status: "pending", progress: 0 }
      ]
    },
    {
      id: 5,
      name: "Noor Ibrahim",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      department: "Backend Developer",
      tasksCompleted: 4,
      totalTasks: 7,
      status: "Active",
      tasks: [
        { name: "Server Configuration", status: "completed", progress: 100 },
        { name: "API Endpoints", status: "in-progress", progress: 60 },
        { name: "Database Optimization", status: "pending", progress: 0 },
        { name: "Security Implementation", status: "delayed", progress: 15 }
      ]
    },
    {
      id: 6,
      name: "Omar Fadi",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
      department: "UI/UX Designer",
      tasksCompleted: 6,
      totalTasks: 6,
      status: "Active",
      tasks: [
        { name: "Style Guide", status: "completed", progress: 100 },
        { name: "Icon Design", status: "completed", progress: 100 },
        { name: "Brand Guidelines", status: "completed", progress: 100 }
      ]
    }
  ]);

  // Filter and search logic
  const filteredEmployees = employees
    .filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = filterDepartment === 'All' || emp.department === filterDepartment;
      return matchesSearch && matchesDepartment;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'progress') return (b.tasksCompleted / b.totalTasks) - (a.tasksCompleted / a.totalTasks);
      return 0;
    });

  // Calculate statistics
  const totalEmployees = employees.length;
  const totalTasksAll = employees.reduce((sum, emp) => sum + emp.totalTasks, 0);
  const completedTasksAll = employees.reduce((sum, emp) => sum + emp.tasksCompleted, 0);
  const inProgressTasks = employees.reduce((sum, emp) => 
    sum + emp.tasks.filter(t => t.status === 'in-progress').length, 0);
  const delayedTasks = employees.reduce((sum, emp) => 
    sum + emp.tasks.filter(t => t.status === 'delayed').length, 0);
  const overallProgress = Math.round((completedTasksAll / totalTasksAll) * 100);

  const getStatusBadge = (status) => {
    const badgeClasses = {
      'completed': 'task-badge badge-completed',
      'in-progress': 'task-badge badge-progress',
      'pending': 'task-badge badge-pending',
      'delayed': 'task-badge badge-delayed'
    };
    
    const labels = {
      'completed': 'Completed',
      'in-progress': 'In Progress',
      'pending': 'Pending',
      'delayed': 'Delayed'
    };

    return <span className={badgeClasses[status]}>{labels[status]}</span>;
  };

  const getTaskDotClass = (status) => {
    const classes = {
      'completed': 'task-dot task-dot-completed',
      'in-progress': 'task-dot task-dot-progress',
      'pending': 'task-dot task-dot-pending',
      'delayed': 'task-dot task-dot-delayed'
    };
    return classes[status] || 'task-dot task-dot-pending';
  };

  const getProgressBarClass = (status) => {
    const classes = {
      'completed': 'task-progress-bar progress-completed',
      'in-progress': 'task-progress-bar progress-in-progress',
      'delayed': 'task-progress-bar progress-delayed',
      'pending': 'task-progress-bar progress-pending'
    };
    return classes[status] || 'task-progress-bar progress-pending';
  };

  return (
    <div className="user-page">
      {/* Header */}
      <header className="user-header">
        <div className="header-container">
          <div className="header-top">
            <div className="header-left">
              <div className="logo-section">
                <div className="logo-glow-effect"></div>
                {/* Replaced SVG with Image */}
                <img 
                  src={require('../img/logoTechnosoft.jpeg')} 
                  alt="TechnoSoft Logo" 
                  className="header-logo"
                />
              </div>
              <div>
                <h1 className="header-title">TechnoSoft Team</h1>
                <p className="header-subtitle">Employee Management Dashboard</p>
              </div>
            </div>
            <div className="employee-count-badge">
              {totalEmployees} Employees
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-content">
                <Users className="stat-icon" color="#FACC15" size={28} />
                <div>
                  <p className="stat-label">Total Tasks</p>
                  <p className="stat-number">{totalTasksAll}</p>
                </div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-content">
                <CheckCircle className="stat-icon" color="#86efac" size={28} />
                <div>
                  <p className="stat-label">Completed</p>
                  <p className="stat-number">{completedTasksAll}</p>
                </div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-content">
                <Clock className="stat-icon" color="#93c5fd" size={28} />
                <div>
                  <p className="stat-label">In Progress</p>
                  <p className="stat-number">{inProgressTasks}</p>
                </div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-content">
                <AlertCircle className="stat-icon" color="#fca5a5" size={28} />
                <div>
                  <p className="stat-label">Delayed</p>
                  <p className="stat-number">{delayedTasks}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="overall-progress">
            <div className="progress-header">
              <span className="progress-label">Overall Team Progress</span>
              <span className="progress-value">{overallProgress}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar" style={{width: `${overallProgress}%`}}></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Search and Filter Bar */}
        <div className="search-filter-bar">
          <div className="filter-grid">
            <div className="input-wrapper">
              <Search className="input-icon" size={20} />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="input-wrapper">
              <Filter className="input-icon" size={20} />
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="filter-select"
              >
                <option value="All">All Departments</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name">Sort by Name</option>
              <option value="progress">Sort by Progress</option>
            </select>
          </div>
        </div>

        {/* Employee Cards Grid */}
        <div className="employees-grid">
          {filteredEmployees.map((employee) => {
            const progress = Math.round((employee.tasksCompleted / employee.totalTasks) * 100);
            
            return (
              <div key={employee.id} className="employee-card">
                {/* Card Header */}
                <div className="card-header">
                  <span className={`status-badge ${employee.status === 'Active' ? 'status-active' : 'status-busy'}`}>
                    {employee.status}
                  </span>
                  
                  <div className="employee-photo-wrapper">
                    <div className="photo-glow"></div>
                    <img src={employee.photo} alt={employee.name} className="employee-photo" />
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-body">
                  <h2 className="employee-name">{employee.name}</h2>
                  <p className="employee-department">{employee.department}</p>

                  {/* Task Status Summary */}
                  <div className="task-status-section">
                    <p className="section-title">Assigned Tasks ({employee.totalTasks})</p>
                    <div className="task-list">
                      {employee.tasks.map((task, idx) => (
                        <div key={idx} className="task-item">
                          <div className="task-info">
                            <div className={getTaskDotClass(task.status)}></div>
                            <span className="task-name">{task.name}</span>
                          </div>
                          {getStatusBadge(task.status)}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Individual Task Progress Bars */}
                  <div className="task-progress-section">
                    <p className="section-title">Task Progress</p>
                    {employee.tasks.map((task, idx) => (
                      <div key={idx} className="task-progress-item">
                        <div className="task-progress-header">
                          <span className="task-progress-name">{task.name}</span>
                          <span className="task-progress-percent">{task.progress}%</span>
                        </div>
                        <div className="task-progress-bar-bg">
                          <div 
                            className={getProgressBarClass(task.status)}
                            style={{width: `${task.progress}%`}}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Overall Progress */}
                  <div className="overall-progress-section">
                    <div className="overall-progress-header">
                      <span className="overall-progress-label">Overall Progress</span>
                      <span className="overall-progress-value">
                        {employee.tasksCompleted} / {employee.totalTasks}
                      </span>
                    </div>
                    
                    <div className="overall-progress-bar-bg">
                      <div className="overall-progress-bar" style={{width: `${progress}%`}}></div>
                    </div>
                    
                    <p className="overall-progress-percent">{progress}% Complete</p>
                  </div>

                  <button className="view-details-button">
                    View Full Details →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results Message */}
        {filteredEmployees.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <p className="no-results-text">No employees found matching your criteria.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="user-footer">
        <div className="footer-content">
          <p className="footer-text">© 2025 TechnoSoft Team Management System - All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}

export default User;