const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Region, City } = require('../models');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { fullName, phoneNumber, password, cin, region, city } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { phoneNumber } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Find or create region
    const [regionRecord] = await Region.findOrCreate({
      where: { name: region }
    });

    // Find or create city
    const [cityRecord] = await City.findOrCreate({
      where: { name: city, RegionId: regionRecord.id }
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      fullName,
      phoneNumber,
      password: hashedPassword,
      cin,
      RegionId: regionRecord.id,
      CityId: cityRecord.id
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        cin: user.cin
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Find user
    const user = await User.findOne({
      where: { phoneNumber },
      include: [
        { model: Region },
        { model: City }
      ]
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Modify the login response to include cityId
    res.json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        cin: user.cin,
        region: user.Region.name,
        city: user.City.name,
        cityId: user.CityId  // Add this line
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;