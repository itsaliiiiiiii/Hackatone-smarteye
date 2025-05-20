require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const authRoutes = require('./routes/auth');
const { Report, User, City, Agency } = require('./models');

const app = express();

// Middleware
// Configure CORS middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5000', 'http://127.0.0.1:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With'],
  exposedHeaders: ['Access-Control-Allow-Origin']
}));
app.use(express.json());

// Database connection
const sequelize = new Sequelize(process.env.DB_NAME || 'urban_issues', process.env.DB_USER || 'root', process.env.DB_PASS || '', {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql',
  logging: false
});

// Test database connection
sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Routes
app.use('/api/auth', authRoutes);

// Import middleware and routes
const authMiddleware = require('./middleware/auth');
const reportsRoutes = require('./routes/reports');

// Apply auth middleware to protected routes
app.use('/api/reports', authMiddleware);
// This line applies middleware to /api/report-issue
// Remove this line
// app.use('/api/report-issue', authMiddleware);

// Keep only one route definition
app.post('/api/report-issue', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const { description, location } = req.body;
    const files = req.files;
    const user = req.user;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    // Process each image through AI analysis
    const aiAnalysisResults = await Promise.all(files.map(async (file) => {
      try {
        const formData = new FormData();
        formData.append('image', fs.createReadStream(file.path));

        const aiResponse = await axios.post('http://127.0.0.1:5000/predictt', formData, {
          headers: formData.getHeaders()
        });
        return aiResponse.data.predictions; // Ensure this includes 'severity'
      } catch (error) {
        console.error('AI Analysis error:', error);
        return null;
      }
    }));

    // Extract problem type from AI analysis results
    let problemType = 'unknown';
    if (aiAnalysisResults && aiAnalysisResults.length > 0 && aiAnalysisResults[0] && aiAnalysisResults[0][0]) {
      problemType = aiAnalysisResults[0][0].class;
    }

    // Store image paths
    const imagePaths = files.map(file => file.path);

    // Create report in database
    const report = await Report.create({
      images: imagePaths,
      location: JSON.parse(location),
      UserId: user.id,
      CityId: user.CityId,
      status: 'pending',
      priority: 'medium',
      description: description || '',
      problemType: problemType || 'unknown'
    });

    console.log(report);
    
    // Include aiAnalysis and image_annotated in the response
    res.status(201).json({
      success: true,
      reportId: report.id,
      aiAnalysis: aiAnalysisResults,
      image_annotated: aiAnalysisResults[0]?.image_annotated || null,
      message: 'Report created successfully'
    });

  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

// Sync database and start server
const PORT = process.env.PORT || 3001;

sequelize.sync({ force: true })
  .then(() => {
    console.log('Database tables created successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error creating database tables:', err);
  });