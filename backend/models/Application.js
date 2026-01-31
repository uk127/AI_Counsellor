import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  profileId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'profiles',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  universityId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'universities',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  isLocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  applicationStatus: {
    type: DataTypes.ENUM('Not Started', 'In Progress', 'Submitted', 'Accepted', 'Rejected', 'Waitlisted'),
    defaultValue: 'Not Started'
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  documents: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  tasks: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  }
}, {
  timestamps: true,
  tableName: 'applications'
})

// Associations
Application.associate = function(models) {
  Application.belongsTo(models.Profile, {
    foreignKey: 'profileId',
    as: 'profile'
  })
  
  Application.belongsTo(models.University, {
    foreignKey: 'universityId',
    as: 'university'
  })
}

export { Application }