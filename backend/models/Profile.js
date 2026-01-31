import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  educationLevel: {
    type: DataTypes.ENUM('High School', 'Undergraduate', 'Graduate', 'Postgraduate'),
    allowNull: false
  },
  degree: {
    type: DataTypes.STRING,
    allowNull: false
  },
  major: {
    type: DataTypes.STRING,
    allowNull: false
  },
  graduationYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 2000,
      max: 2030
    }
  },
  gpa: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 4.0
    }
  },
  intendedDegree: {
    type: DataTypes.ENUM('Bachelor', 'Master', 'MBA', 'PhD'),
    allowNull: false
  },
  fieldOfStudy: {
    type: DataTypes.STRING,
    allowNull: false
  },
  targetIntake: {
    type: DataTypes.STRING,
    allowNull: false
  },
  preferredCountries: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  fundingPlan: {
    type: DataTypes.ENUM('Self-funded', 'Scholarship', 'Loan', 'Mixed'),
    allowNull: false
  },
  ielts: {
    type: DataTypes.DECIMAL(3, 1),
    allowNull: true,
    validate: {
      min: 0,
      max: 9.0
    }
  },
  toefl: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 120
    }
  },
  gre: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 260,
      max: 340
    }
  },
  gmat: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 200,
      max: 800
    }
  },
  sopStatus: {
    type: DataTypes.ENUM('Not started', 'Draft', 'Ready'),
    defaultValue: 'Not started'
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  stage: {
    type: DataTypes.ENUM('Building Profile', 'Discovering Universities', 'Finalizing Universities', 'Preparing Applications'),
    defaultValue: 'Building Profile'
  }
}, {
  timestamps: true,
  tableName: 'profiles'
})

// Associations
Profile.associate = function(models) {
  Profile.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  })
}

export { Profile }