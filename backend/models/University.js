import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

const University = sequelize.define('University', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  ranking: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  requirements: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },
  acceptanceRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  tableName: 'universities'
})

// Association with Profile (many-to-many through UserUniversity)
University.associate = function(models) {
  University.belongsToMany(models.Profile, {
    through: 'UserUniversities',
    foreignKey: 'universityId',
    as: 'profiles'
  })
}

export { University }