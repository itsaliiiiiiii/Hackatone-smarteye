const jwt = require('jsonwebtoken');
const { User, City, Region } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    console.log('Auth middleware triggered'); // Debug log
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No auth header found'); // Debug log
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token found:', token); // Debug log

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Decoded token:', decoded); // Debug log

    const user = await User.findByPk(decoded.userId, {
      include: [
        { model: City, attributes: ['id', 'name'] },
        { model: Region, attributes: ['id', 'name'] }
      ]
    });

    if (!user) {
      console.log('User not found in database'); // Debug log
      return res.status(401).json({ error: 'User not found' });
    }

    // Ensure we have the required user data
    if (!user.City || !user.City.id) {
      console.log('Missing city data for user:', user.id); // Debug log
      return res.status(401).json({ error: 'Incomplete user data' });
    }

    // Attach complete user data to request
    req.user = {
      id: user.id,
      CityId: user.City.id,
      ...user.toJSON()
    };

    console.log('User authenticated successfully:', req.user.id); // Debug log
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ 
      error: 'Authentication failed',
      details: error.message 
    });
  }
};

module.exports = authMiddleware;