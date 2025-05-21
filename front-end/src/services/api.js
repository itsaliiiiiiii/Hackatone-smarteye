import axios from 'axios';

// Configure axios base URL and default headers
axios.defaults.baseURL = 'http://127.0.0.1:5000';

// Add a request interceptor to include the token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to handle user login
export const login = async (phoneNumber, password) => {
  try {
    const response = await axios.post('/login', { phoneNumber, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

// Function to handle user registration
export const register = async (userData) => {
  try {
    const response = await axios.post('/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};

// Function to create a report
export const createReport = async (reportData) => {
  try {
    const formData = new FormData();
    
    // Append the first image file to the FormData (backend expects a single image)
    if (reportData.images && reportData.images.length > 0) {
      formData.append('image', reportData.images[0].file);
    }
    
    // Append other data
    formData.append('problemType', reportData.description); // Changed key to problemType
    formData.append('location', JSON.stringify(reportData.location));
    
    const response = await axios.post('/reports', formData, { // Changed endpoint to /reports
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // Ensure the response includes the base64 image data
    if (response.data.image) {
      response.data.image = `data:image/jpeg;base64,${response.data.image}`;
    }
    return {
      ...response.data,
      cityName: response.data.agence,
      agencyName: response.data.agence
    };
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Report creation failed');
  }
};