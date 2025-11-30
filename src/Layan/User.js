import { useState, useRef, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, Edit2, Save, X, Upload, User as UserIcon } from 'lucide-react';
import './User.css';
import Login from "../Layan/Login";
import { useNavigate } from "react-router-dom";
import { getAllTasks, updateTaskProgress, logout, isAuthenticated, getUserProfile, updateUserProfile } from './api';

function User() {
  const [currentPage, setCurrentPage] = useState('profile');
  const [editingProfile, setEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [tempProgress, setTempProgress] = useState({});

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Check authentication and fetch data on mount
  useEffect(() => {
    const initializePage = async () => {
      if (isAuthenticated()) {
        setIsLoggedIn(true);
        await fetchUserData();
      } else {
        setIsLoggedIn(false);
      }
    };

    initializePage();
  }, []);

  // Fetch user tasks and profile from API
  const fetchUserData = async () => {
    try {
      // Fetch tasks
      const tasksResponse = await getAllTasks();
      if (tasksResponse.success) {
        setTasks(tasksResponse.tasks);
        // Initialize temp progress with current values
        const progressMap = {};
        tasksResponse.tasks.forEach(task => {
          progressMap[task.id] = task.progress;
        });
        setTempProgress(progressMap);
      }

      // Fetch user profile
      try {
        const profileResponse = await getUserProfile();
        if (profileResponse.success) {
          setUserProfile(profileResponse.profile);
          setEditedProfile(profileResponse.profile);
        }
      } catch (err) {
        console.log('Profile fetch failed:', err);
        // Create a default profile with empty photo placeholder
        const defaultProfile = {
          id: 1,
          name: "John Doe",
          photo: "",
          department: "Frontend Developer",
          email: "john.doe@technosoft.com",
          role_id: 2,
          isactive: true
        };
        setUserProfile(defaultProfile);
        setEditedProfile(defaultProfile);
      }

    } catch (err) {
      console.error('Error fetching user data:', err);
      // If unauthorized, redirect to login
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        handleLogout();
      }
    }
  };

  // Handle temporary progress change (while dragging slider)
  const handleProgressChange = (taskId, newProgress) => {
    setTempProgress(prev => ({
      ...prev,
      [taskId]: newProgress
    }));
  };

  // Handle task progress update (when slider is released)
  const handleTaskProgressUpdate = async (taskId, newProgress) => {
    try {
      await updateTaskProgress(taskId, newProgress);
      
      // Refresh tasks after update
      await fetchUserData();
      
      alert('Progress updated successfully!');
    } catch (err) {
      console.error('Error updating progress:', err);
      alert('Failed to update progress: ' + err.message);
      // Reset to previous value on error
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        setTempProgress(prev => ({
          ...prev,
          [taskId]: task.progress
        }));
      }
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setCurrentPage('login');
    navigate('/');
  };

  // Edit profile handlers
  const handleEditProfile = () => {
    setEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setEditingProfile(false);
    setEditedProfile(userProfile);
  };

  const handleSaveProfile = async () => {
    try {
      // Call API to update profile
      const response = await updateUserProfile({
        name: editedProfile.name,
        email: editedProfile.email,
        department: editedProfile.department,
        photo: editedProfile.photo
      });

      if (response.success) {
        setUserProfile(editedProfile);
        setEditingProfile(false);
        alert('Profile updated successfully!');
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile: ' + err.message);
    }
  };

  const updateProfileField = (field, value) => {
    setEditedProfile({...editedProfile, [field]: value});
  };

  // Image upload handler
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
        setEditedProfile({
          ...editedProfile,
          photo: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Calculate statistics from user's tasks
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const delayedTasks = tasks.filter(t => t.status === 'delayed').length;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Show login page if not logged in
  if (!isLoggedIn) {
     return <Login />;
  }

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

  // Function to get role display name
  const getRoleDisplayName = (roleId) => {
    switch (roleId) {
      case 1:
        return 'User';
      case 2:
        return 'Team Member';
      default:
        return 'Guest';
    }
  };

  // Function to get profile photo source
  const getProfilePhoto = (profile) => {
    if (profile?.photo) {
      return profile.photo;
    }
    // Return a default avatar with the user's initials
    const name = profile?.name || 'User';
    const initials = getUserInitials(name);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=facc15&color=1e293b&bold=true&size=128`;
  };

  // Function to get user initials for placeholder
  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
              onClick={() => setCurrentPage('profile')}
              className={currentPage === 'profile' ? 'nav-button active' : 'nav-button'}
            >
              My Profile
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
        {/* Header - Personal Profile */}
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
                  <h1 className="header-title">My Profile</h1>
                  <p className="header-subtitle">Welcome back, {userProfile?.name}</p>
                </div>
              </div>
              <div className="employee-count-badge">
                <UserIcon size={20} />
                Team Member
              </div>
            </div>

            {/* Personal Statistics Cards */}
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-content">
                  <CheckCircle className="stat-icon" color="#86efac" size={28} />
                  <div>
                    <p className="stat-label">My Total Tasks</p>
                    <p className="stat-number">{totalTasks}</p>
                  </div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-content">
                  <CheckCircle className="stat-icon" color="#22C55E" size={28} />
                  <div>
                    <p className="stat-label">Completed</p>
                    <p className="stat-number">{completedTasks}</p>
                  </div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-content">
                  <Clock className="stat-icon" color="#3B82F6" size={28} />
                  <div>
                    <p className="stat-label">In Progress</p>
                    <p className="stat-number">{inProgressTasks}</p>
                  </div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-content">
                  <AlertCircle className="stat-icon" color="#F59E0B" size={28} />
                  <div>
                    <p className="stat-label">Pending</p>
                    <p className="stat-number">{pendingTasks}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Progress Bar */}
            <div className="overall-progress">
              <div className="progress-header">
                <span className="progress-label">My Overall Progress</span>
                <span className="progress-value">{overallProgress}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar" style={{width: `${overallProgress}%`}}></div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Personal Profile and Tasks */}
        <main className="main-content">
          <div className="profile-content">
            {/* Profile Card */}
            <div className="profile-card">
              <div className="card-header">
                <span className={`status-badge ${userProfile?.isactive ? 'status-active' : 'status-busy'}`}>
                  {userProfile?.isactive ? 'Active' : 'Inactive'}
                </span>
                
                <div className="employee-photo-wrapper">
                  <div className="photo-glow"></div>
                  <img 
                    src={getProfilePhoto(editingProfile ? editedProfile : userProfile)} 
                    alt={(editingProfile ? editedProfile : userProfile)?.name} 
                    className="employee-photo" 
                  />
                  
                  {editingProfile && (
                    <div className="photo-upload-overlay">
                      <button 
                        type="button"
                        onClick={triggerFileInput}
                        className="upload-photo-button"
                      >
                        <Upload size={20} />
                        {getProfilePhoto(editedProfile) ? 'Change Photo' : 'Upload Photo'}
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

              <div className="card-body">
                {editingProfile ? (
                  <input
                    type="text"
                    value={editedProfile?.name || ''}
                    onChange={(e) => updateProfileField('name', e.target.value)}
                    className="edit-name-input"
                  />
                ) : (
                  <h2 className="employee-name">{userProfile?.name}</h2>
                )}
                
                {editingProfile ? (
                  <select
                    value={editedProfile?.department || ''}
                    onChange={(e) => updateProfileField('department', e.target.value)}
                    className="edit-department-select"
                  >
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Project Manager">Project Manager</option>
                  </select>
                ) : (
                  <p className="employee-department">{userProfile?.department}</p>
                )}

                <div className="profile-details">
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    {editingProfile ? (
                      <input
                        type="email"
                        value={editedProfile?.email || ''}
                        onChange={(e) => updateProfileField('email', e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      <span className="detail-value">{userProfile?.email}</span>
                    )}
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Employee ID:</span>
                    <span className="detail-value">{userProfile?.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Role:</span>
                    <span className="detail-value">
                      {getRoleDisplayName(userProfile?.role_id)}
                    </span>
                  </div>
                </div>

                {editingProfile ? (
                  <div className="action-buttons">
                    <button onClick={handleSaveProfile} className="save-button">
                      <Save size={18} />
                      Save Changes
                    </button>
                    <button onClick={handleCancelEdit} className="cancel-button">
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={handleEditProfile} className="edit-button">
                    <Edit2 size={18} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* My Tasks Section */}
            <div className="tasks-section">
              <div className="section-header">
                <h3 className="section-title">My Tasks ({tasks.length})</h3>
                <p className="section-subtitle">Manage and update your task progress</p>
              </div>

              {tasks.length === 0 ? (
                <div className="no-tasks">
                  <p>No tasks assigned to you yet.</p>
                </div>
              ) : (
                <div className="tasks-list">
                  {tasks.map((task) => (
                    <div key={task.id} className="task-card">
                      <div className="task-header">
                        <h4 className="task-name">{task.task_name}</h4>
                        {getStatusBadge(task.status)}
                      </div>
                      
                      <div className="task-progress-item">
                        <div className="task-progress-header">
                          <span className="task-progress-name">Progress</span>
                          <span className="task-progress-percent">{tempProgress[task.id] || task.progress}%</span>
                        </div>
                        <div className="task-progress-bar-bg">
                          <div 
                            className={getProgressBarClass(task.status)}
                            style={{width: `${tempProgress[task.id] || task.progress}%`}}
                          ></div>
                        </div>
                      </div>

                      <div className="task-actions">
                        <label className="progress-update-label">
                          Update Progress:
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={tempProgress[task.id] || task.progress}
                            onChange={(e) => handleProgressChange(task.id, parseInt(e.target.value))}
                            onMouseUp={(e) => handleTaskProgressUpdate(task.id, parseInt(e.target.value))}
                            onTouchEnd={(e) => handleTaskProgressUpdate(task.id, parseInt(e.target.value))}
                            className="progress-slider"
                          />
                          <span className="progress-value">{tempProgress[task.id] || task.progress}%</span>
                        </label>
                      </div>

                      {task.due_date && (
                        <div className="task-due-date">
                          <span className="due-label">Due Date:</span>
                          <span className="due-value">
                            {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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