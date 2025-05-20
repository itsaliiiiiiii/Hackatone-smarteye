const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { Report, Agency, AgencyProblemTypes, City } = require('../models');

router.post('/report-issue', upload.array('images', 5), async (req, res) => {
  try {
    const { description, location } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    // Process each image through AI analysis
    const aiAnalysisResults = await Promise.all(files.map(async (file) => {
      const formData = new FormData();
      formData.append('image', fs.createReadStream(file.path));

      try {
        const aiResponse = await axios.post('http://127.0.0.1:5000/predictt', formData, {
          headers: formData.getHeaders()
        });
        return {
          predictions: aiResponse.data.predictions,
          image_annotated: aiResponse.data.image_annotated
        };
      } catch (error) {
        console.error('AI Analysis error:', error);
        return null;
      }
    }));

    // Extract problem type from AI analysis results
    let problemType = 'unknown';
    if (aiAnalysisResults && aiAnalysisResults.length > 0 && aiAnalysisResults[0] && aiAnalysisResults[0][0]) {
      // Extract the class from the first prediction
      problemType = aiAnalysisResults[0][0].class;
    }

    // Find appropriate agency based on problem type and city
    const agency = await Agency.findOne({
      include: [{
        model: AgencyProblemTypes,
        where: { problemType }
      }],
      where: { CityId: req.user.CityId }
    });

    // Get city name
    const city = await City.findByPk(req.user.CityId);

    // Save to database with AI analysis results and problem type
    const report = await Report.create({
      description,
      location: JSON.parse(location),
      aiAnalysis: aiAnalysisResults,
      images: files.map(file => file.path),
      status: 'pending',
      priority: 'medium',
      problemType,
      UserId: req.user.id,
      CityId: req.user.CityId,
      AgencyId: agency?.id || null
    });

    res.json({
      success: true,
      reportId: report.id,
      aiAnalysis: aiAnalysisResults,
      image_annotated: aiAnalysisResults[0]?.image_annotated,
      cityName: city?.name || 'Unknown',
      agencyName: agency?.name || 'Not assigned'
    });
  } catch (error) {
    console.error('Error saving report:', error);
    res.status(500).json({ error: 'Failed to save report' });
  }
});

module.exports = router;