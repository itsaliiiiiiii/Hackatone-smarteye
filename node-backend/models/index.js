const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME || 'urban_issues', process.env.DB_USER || 'root', process.env.DB_PASS || '', {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql'
});

const Region = sequelize.define('Region', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

const City = sequelize.define('City', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cin: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

const Agency = sequelize.define('Agency', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  legalInfo: {
    type: DataTypes.JSON,
    allowNull: false
  },
  workDomain: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

const AgencyProblemTypes = sequelize.define('AgencyProblemTypes', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  problemType: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dangerType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  problemType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  images: {
    type: DataTypes.JSON,
    allowNull: false
  },
  location: {
    type: DataTypes.JSON,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'resolved'),
    defaultValue: 'pending'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  }
});

// Define relationships
Region.hasMany(City);
City.belongsTo(Region);

City.hasMany(User);
User.belongsTo(City);

User.belongsTo(Region);
Region.hasMany(User);

City.hasMany(Agency);
Agency.belongsTo(City);

User.hasMany(Report);
Report.belongsTo(User);

City.hasMany(Report);
Report.belongsTo(City);

Agency.hasMany(Report);
Report.belongsTo(Agency);

Agency.hasMany(AgencyProblemTypes);
AgencyProblemTypes.belongsTo(Agency);

module.exports = {
  sequelize,
  Region,
  City,
  User,
  Agency,
  Report,
  AgencyProblemTypes
};

// Set up associations
User.belongsTo(City);
User.belongsTo(Region);
City.belongsTo(Region);
Region.hasMany(City);
City.hasMany(User);
Region.hasMany(User);