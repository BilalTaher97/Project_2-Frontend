// API connection (api.js)

const API_BASE_URL = 'http://localhost:5000';

const getAuthToken = () => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      // Handle unauthorized - token expired or invalid
      if (response.status === 401) {
        logout();
        window.location.href = '/';
      }
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ==================== API FUNCTIONS ====================

// Get all tasks
export const getAllTasks = async () => {
  return await apiCall('/user/tasks');
};

// Get single task by ID
export const getTaskById = async (taskId) => {
  return await apiCall(`/user/tasks/${taskId}`);
};

// Get user profile
export const getUserProfile = async () => {
  return await apiCall('/user/profile');
};

// Get dashboard overview
export const getDashboard = async () => {
  return await apiCall('/user/dashboard');
};

// Update task progress
export const updateTaskProgress = async (taskId, progress) => {
  return await apiCall(`/user/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify({ progress }),
  });
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  return await apiCall('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
};

// ==================== AUTH HELPERS ====================

// Save token after login (supports "Remember Me" feature)
export const saveAuthToken = (token, rememberMe = false) => {
  // if (rememberMe) {
    localStorage.setItem('authToken', token);
  // } else {
  //   sessionStorage.setItem('authToken', token);
  // }
};

// Save user info (supports "Remember Me" feature)
export const saveUserInfo = (user, rememberMe = false) => {
  const userJson = JSON.stringify(user);
  if (rememberMe) {
    localStorage.setItem('user', userJson);
  } else {
    sessionStorage.setItem('user', userJson);
  }
};

// Get user info
export const getUserInfo = () => {
  const userJson = localStorage.getItem('user') || sessionStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
};

// Get current token
export const getToken = () => {
  return getAuthToken();
};

// Check if user is logged in
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Logout - clear token and user info from both storages
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('user');
};

// ================= LOGIN API ====================

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    return data;
  } catch (error) {
    console.error('Login Error:', error);
    throw error;
  }
}