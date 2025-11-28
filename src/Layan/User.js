import { useState, useRef, useEffect } from 'react';
import { Search, Filter, Users, CheckCircle, Clock, AlertCircle, Edit2, Save, X, Plus, Trash2, Upload } from 'lucide-react';
import './User.css';
import Login from "../Layan/Login";
import { useNavigate } from "react-router-dom";
import { getAllTasks, updateTaskProgress, logout, isAuthenticated, getUserProfile } from './api';

function User() {
  const [currentPage, setCurrentPage] = useState('employees');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [editingId, setEditingId] = useState(null);
  const [editedEmployee, setEditedEmployee] = useState(null);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
    department: "Frontend Developer",
    status: "Active",
    tasks: [
      { id: Date.now(), name: "New Task", status: "pending", progress: 0 }
    ],
    tasksCompleted: 0,
    totalTasks: 1
  });

  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const newEmployeeFileInputRef = useRef(null);

  // Check authentication and fetch data on mount
  useEffect(() => {
    const initializePage = async () => {
      if (isAuthenticated()) {
        setIsLoggedIn(true);
        await fetchUserData();
      } else {
        setIsLoggedIn(false);
        setLoading(false);
      }
    };

    initializePage();
  }, []);

  // Fetch user tasks and profile from API
  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch tasks
      const tasksResponse = await getAllTasks();
      if (tasksResponse.success) {
        setTasks(tasksResponse.tasks);
      }

      // Fetch user profile
      try {
        const profileResponse = await getUserProfile();
        if (profileResponse.success) {
          setUserProfile(profileResponse.profile);
        }
      } catch (err) {
        console.log('Profile fetch failed:', err);
      }

    } catch (err) {
      console.error('Error fetching user data:', err);
      // If unauthorized, redirect to login
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle task progress update
  const handleTaskProgressUpdate = async (taskId, newProgress) => {
    try {
      await updateTaskProgress(taskId, newProgress);
      
      // Refresh tasks after update
      await fetchUserData();
      
      alert('Progress updated successfully!');
    } catch (err) {
      console.error('Error updating progress:', err);
      alert('Failed to update progress: ' + err.message);
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setCurrentPage('login');
    navigate('/');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('home');
  };

  // Mock employees state (you can replace this with API data if you have an employees endpoint)
  const [employees, setEmployees] = useState([]);
  
  // Show login page if not logged in
  if (!isLoggedIn) {
     return <Login />;
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
        <div className="user-page">
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <h2>Loading...</h2>
          </div>
        </div>
      </div>
    );
  }
  
  // Delete employee handler
  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(emp => emp.id !== employeeId));
      if (editingId === employeeId) {
        setEditingId(null);
        setEditedEmployee(null);
      }
    }
  };

  // Edit handlers
  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setEditedEmployee(JSON.parse(JSON.stringify(employee)));
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedEmployee(null);
  };

  const handleSave = () => {
    setEmployees(employees.map(emp => 
      emp.id === editingId ? editedEmployee : emp
    ));
    setEditingId(null);
    setEditedEmployee(null);
  };

  // Add new employee handlers
  const handleAddEmployee = () => {
    setShowAddEmployee(true);
  };

  const handleSaveNewEmployee = () => {
    const employeeToAdd = {
      ...newEmployee,
      id: Date.now(),
      tasksCompleted: newEmployee.tasks.filter(t => t.status === 'completed').length,
      totalTasks: newEmployee.tasks.length
    };

    setEmployees([...employees, employeeToAdd]);
    setShowAddEmployee(false);
    resetNewEmployee();
  };

  const handleCancelNewEmployee = () => {
    setShowAddEmployee(false);
    resetNewEmployee();
  };

  const resetNewEmployee = () => {
    setNewEmployee({
      name: "",
      photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
      department: "Frontend Developer",
      status: "Active",
      tasks: [
        { id: Date.now(), name: "New Task", status: "pending", progress: 0 }
      ],
      tasksCompleted: 0,
      totalTasks: 1
    });
  };

  const updateNewEmployeeField = (field, value) => {
    setNewEmployee({...newEmployee, [field]: value});
  };

  const updateNewEmployeeTask = (taskIndex, field, value) => {
    const updatedTasks = [...newEmployee.tasks];
    updatedTasks[taskIndex] = {...updatedTasks[taskIndex], [field]: value};
    
    if (field === 'status') {
      if (value === 'completed') updatedTasks[taskIndex].progress = 100;
      else if (value === 'pending') updatedTasks[taskIndex].progress = 0;
    }
    
    setNewEmployee({
      ...newEmployee, 
      tasks: updatedTasks
    });
  };

  const addNewTask = () => {
    const newTask = {
      id: Date.now(),
      name: "New Task",
      status: "pending",
      progress: 0
    };
    
    setNewEmployee({
      ...newEmployee,
      tasks: [...newEmployee.tasks, newTask]
    });
  };

  const removeNewTask = (taskIndex) => {
    const updatedTasks = newEmployee.tasks.filter((_, idx) => idx !== taskIndex);
    setNewEmployee({
      ...newEmployee,
      tasks: updatedTasks
    });
  };

  const updateEmployeeField = (field, value) => {
    setEditedEmployee({...editedEmployee, [field]: value});
  };

  const updateTask = (taskIndex, field, value) => {
    const updatedTasks = [...editedEmployee.tasks];
    updatedTasks[taskIndex] = {...updatedTasks[taskIndex], [field]: value};
    
    if (field === 'status') {
      if (value === 'completed') updatedTasks[taskIndex].progress = 100;
      else if (value === 'pending') updatedTasks[taskIndex].progress = 0;
    }
    
    const completed = updatedTasks.filter(t => t.status === 'completed').length;
    
    setEditedEmployee({
      ...editedEmployee, 
      tasks: updatedTasks,
      tasksCompleted: completed,
      totalTasks: updatedTasks.length
    });
  };

  const addTask = () => {
    const newTask = {
      id: Date.now(),
      name: "New Task",
      status: "pending",
      progress: 0
    };
    
    const updatedTasks = [...editedEmployee.tasks, newTask];
    const completed = updatedTasks.filter(t => t.status === 'completed').length;
    
    setEditedEmployee({
      ...editedEmployee,
      tasks: updatedTasks,
      totalTasks: updatedTasks.length,
      tasksCompleted: completed
    });
  };

  const removeTask = (taskIndex) => {
    const updatedTasks = editedEmployee.tasks.filter((_, idx) => idx !== taskIndex);
    const completed = updatedTasks.filter(t => t.status === 'completed').length;
    
    setEditedEmployee({
      ...editedEmployee,
      tasks: updatedTasks,
      totalTasks: updatedTasks.length,
      tasksCompleted: completed
    });
  };

  // Image upload handlers
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setEditedEmployee({
          ...editedEmployee,
          photo: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewEmployeeImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setNewEmployee({
          ...newEmployee,
          photo: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerNewEmployeeFileInput = () => {
    newEmployeeFileInputRef.current?.click();
  };

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

// Calculate statistics from API data
const totalEmployees = employees.length;
const totalTasksAll = tasks.length;
const completedTasksAll = tasks.filter(t => t.status === 'completed').length;
const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
const pendingTasks = tasks.filter(t => t.status === 'pending').length;
const delayedTasks = tasks.filter(t => t.status === 'delayed').length;  // Add this line
const overallProgress = totalTasksAll > 0 ? Math.round((completedTasksAll / totalTasksAll) * 100) : 0;

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

  const newEmployeeProgress = Math.round((newEmployee.tasks.filter(t => t.status === 'completed').length / newEmployee.tasks.length) * 100);

  return (
     <div className="App">
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-brand">TechnoSoft</h1>
          <div className="nav-buttons">
            <button
              onClick={() => navigate('/home')}
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
    <div className="user-page">
      {/* Header */}
      <header className="user-header">
        <div className="header-container">
          <div className="header-top">
            <div className="header-left">
              <div className="logo-section">
                <div className="logo-glow-effect"></div>
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

            <button 
              onClick={handleAddEmployee}
              className="add-employee-button"
            >
              <Plus size={20} />
              Add Employee
            </button>
          </div>
        </div>

        {/* Employee Cards Grid */}
        <div className="employees-grid">
          {/* Add New Employee Card */}
          {showAddEmployee && (
            <div className="employee-card adding">
              {/* Card Header */}
              <div className="card-header">
                <select 
                  value={newEmployee.status}
                  onChange={(e) => updateNewEmployeeField('status', e.target.value)}
                  className="edit-status-select"
                >
                  <option value="Active">Active</option>
                  <option value="Busy">Busy</option>
                </select>
                
                <div className="employee-photo-wrapper">
                  <div className="photo-glow"></div>
                  <img src={newEmployee.photo} alt="New Employee" className="employee-photo" />
                  
                  <div className="photo-upload-overlay">
                    <button 
                      type="button"
                      onClick={triggerNewEmployeeFileInput}
                      className="upload-photo-button"
                    >
                      <Upload size={20} />
                      Change Photo
                    </button>
                    <input
                      type="file"
                      ref={newEmployeeFileInputRef}
                      onChange={handleNewEmployeeImageUpload}
                      accept="image/*"
                      className="photo-file-input"
                    />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="card-body">
                <input
                  type="text"
                  value={newEmployee.name}
                  onChange={(e) => updateNewEmployeeField('name', e.target.value)}
                  className="edit-name-input"
                  placeholder="Enter employee name"
                />
                
                <select
                  value={newEmployee.department}
                  onChange={(e) => updateNewEmployeeField('department', e.target.value)}
                  className="edit-department-select"
                >
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                </select>

                {/* Task Status Summary */}
                <div className="task-status-section">
                  <div className="task-management">
                    <p className="section-title">Assigned Tasks ({newEmployee.tasks.length})</p>
                    <button onClick={addNewTask} className="add-task-button">
                      <Plus size={14} />
                      Add Task
                    </button>
                  </div>
                  <div className="task-list">
                    {newEmployee.tasks.map((task, idx) => (
                      <div key={task.id} className="edit-task-item">
                        <div className="task-info">
                          <div className={getTaskDotClass(task.status)}></div>
                          <input
                            type="text"
                            value={task.name}
                            onChange={(e) => updateNewEmployeeTask(idx, 'name', e.target.value)}
                            className="edit-task-name-input"
                            placeholder="Task name"
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <select
                            value={task.status}
                            onChange={(e) => updateNewEmployeeTask(idx, 'status', e.target.value)}
                            className="edit-task-status-select"
                          >
                            <option value="completed">Completed</option>
                            <option value="in-progress">In Progress</option>
                            <option value="pending">Pending</option>
                            <option value="delayed">Delayed</option>
                          </select>
                          <button 
                            onClick={() => removeNewTask(idx)} 
                            className="remove-task-button"
                            title="Remove Task"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Individual Task Progress Bars */}
                <div className="task-progress-section">
                  <p className="section-title">Task Progress</p>
                  {newEmployee.tasks.map((task, idx) => (
                    <div key={task.id} className="task-progress-item">
                      <div className="task-progress-header">
                        <span className="task-progress-name">{task.name}</span>
                        <span className="task-progress-percent">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={task.progress}
                            onChange={(e) => updateNewEmployeeTask(idx, 'progress', parseInt(e.target.value) || 0)}
                            className="edit-progress-input"
                          />
                        </span>
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
                      {newEmployee.tasks.filter(t => t.status === 'completed').length} / {newEmployee.tasks.length}
                    </span>
                  </div>
                  
                  <div className="overall-progress-bar-bg">
                    <div className="overall-progress-bar" style={{width: `${newEmployeeProgress}%`}}></div>
                  </div>
                  
                  <p className="overall-progress-percent">{newEmployeeProgress}% Complete</p>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                  <button onClick={handleSaveNewEmployee} className="save-button">
                    <Save size={18} />
                    Add Employee
                  </button>
                  <button onClick={handleCancelNewEmployee} className="cancel-button">
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Existing Employee Cards */}
          {filteredEmployees.map((employee) => {
            const isEditing = editingId === employee.id;
            const displayEmployee = isEditing ? editedEmployee : employee;
            const progress = Math.round((displayEmployee.tasksCompleted / displayEmployee.totalTasks) * 100);
            
            return (
              <div key={employee.id} className={`employee-card ${isEditing ? 'editing' : ''}`}>
                {/* Card Header */}
                <div className="card-header">
                  {isEditing ? (
                    <select 
                      value={displayEmployee.status}
                      onChange={(e) => updateEmployeeField('status', e.target.value)}
                      className="edit-status-select"
                    >
                      <option value="Active">Active</option>
                      <option value="Busy">Busy</option>
                    </select>
                  ) : (
                    <span className={`status-badge ${employee.status === 'Active' ? 'status-active' : 'status-busy'}`}>
                      {employee.status}
                    </span>
                  )}
                  
                  {/* Delete Button - Only show when not editing */}
                  {!isEditing && (
                    <button 
                      onClick={() => handleDeleteEmployee(employee.id)}
                      className="delete-employee-button"
                      title="Delete Employee"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  
                  <div className="employee-photo-wrapper">
                    <div className="photo-glow"></div>
                    <img src={displayEmployee.photo} alt={displayEmployee.name} className="employee-photo" />
                    
                    {isEditing && (
                      <div className="photo-upload-overlay">
                        <button 
                          type="button"
                          onClick={triggerFileInput}
                          className="upload-photo-button"
                        >
                          <Upload size={20} />
                          Change Photo
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="photo-file-input"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-body">
                  {isEditing ? (
                    <input
                      type="text"
                      value={displayEmployee.name}
                      onChange={(e) => updateEmployeeField('name', e.target.value)}
                      className="edit-name-input"
                    />
                  ) : (
                    <h2 className="employee-name">{displayEmployee.name}</h2>
                  )}
                  
                  {isEditing ? (
                    <select
                      value={displayEmployee.department}
                      onChange={(e) => updateEmployeeField('department', e.target.value)}
                      className="edit-department-select"
                    >
                      <option value="Frontend Developer">Frontend Developer</option>
                      <option value="Backend Developer">Backend Developer</option>
                      <option value="UI/UX Designer">UI/UX Designer</option>
                    </select>
                  ) : (
                    <p className="employee-department">{displayEmployee.department}</p>
                  )}

                  {/* Task Status Summary */}
                  <div className="task-status-section">
                    <div className="task-management">
                      <p className="section-title">Assigned Tasks ({displayEmployee.totalTasks})</p>
                      {isEditing && (
                        <button onClick={addTask} className="add-task-button">
                          <Plus size={14} />
                          Add Task
                        </button>
                      )}
                    </div>
                    <div className="task-list">
                      {displayEmployee.tasks.map((task, idx) => (
                        <div key={task.id} className={isEditing ? "edit-task-item" : "task-item"}>
                          <div className="task-info">
                            <div className={getTaskDotClass(task.status)}></div>
                            {isEditing ? (
                              <input
                                type="text"
                                value={task.name}
                                onChange={(e) => updateTask(idx, 'name', e.target.value)}
                                className="edit-task-name-input"
                              />
                            ) : (
                              <span className="task-name">{task.name}</span>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            {isEditing ? (
                              <>
                                <select
                                  value={task.status}
                                  onChange={(e) => updateTask(idx, 'status', e.target.value)}
                                  className="edit-task-status-select"
                                >
                                  <option value="completed">Completed</option>
                                  <option value="in-progress">In Progress</option>
                                  <option value="pending">Pending</option>
                                  <option value="delayed">Delayed</option>
                                </select>
                                <button 
                                  onClick={() => removeTask(idx)} 
                                  className="remove-task-button"
                                  title="Remove Task"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            ) : (
                              getStatusBadge(task.status)
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Individual Task Progress Bars */}
                  <div className="task-progress-section">
                    <p className="section-title">Task Progress</p>
                    {displayEmployee.tasks.map((task, idx) => (
                      <div key={task.id} className="task-progress-item">
                        <div className="task-progress-header">
                          <span className="task-progress-name">{task.name}</span>
                          <span className="task-progress-percent">
                            {isEditing ? (
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={task.progress}
                                onChange={(e) => updateTask(idx, 'progress', parseInt(e.target.value) || 0)}
                                className="edit-progress-input"
                              />
                            ) : (
                              `${task.progress}%`
                            )}
                          </span>
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
                        {displayEmployee.tasksCompleted} / {displayEmployee.totalTasks}
                      </span>
                    </div>
                    
                    <div className="overall-progress-bar-bg">
                      <div className="overall-progress-bar" style={{width: `${progress}%`}}></div>
                    </div>
                    
                    <p className="overall-progress-percent">{progress}% Complete</p>
                  </div>

                  {/* Action Buttons */}
                  {isEditing ? (
                    <div className="action-buttons">
                      <button onClick={handleSave} className="save-button">
                        <Save size={18} />
                        Save
                      </button>
                      <button onClick={handleCancel} className="cancel-button">
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => handleEdit(employee)} className="edit-button">
                      <Edit2 size={18} />
                      Edit Employee
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results Message */}
        {filteredEmployees.length === 0 && !showAddEmployee && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <p className="no-results-text">No employees found.</p>
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
    </div>
  );
}

export default User;
