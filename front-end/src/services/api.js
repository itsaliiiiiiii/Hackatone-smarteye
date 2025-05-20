import axios from 'axios';

// Configure axios base URL and default headers
axios.defaults.baseURL = 'http://localhost:3001';

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
    const response = await axios.post('/api/auth/login', { phoneNumber, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

// Function to handle user registration
export const register = async (userData) => {
  try {
    const response = await axios.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};

// Function to create a report
export const createReport = async (reportData) => {
  try {
    const formData = new FormData();
    
    // Append each image file to the FormData
    reportData.images.forEach((image) => {
      formData.append('images', image.file);
    });
    
    // Append other data
    formData.append('description', reportData.description);
    formData.append('location', JSON.stringify(reportData.location));
    
    const response = await axios.post('/api/report-issue', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // Ensure the response includes the base64 image data
    if (response.data.image_annotated) {
      response.data.image_annotated = `data:image/jpeg;base64,${response.data.image_annotated}`;
    }
    return {
      ...response.data,
      cityName: response.data.cityName,
      agencyName: response.data.agencyName
    };
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Report creation failed');
  }
};