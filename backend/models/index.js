import { sequelize } from '../config/database.js';
import { User } from './User.js';
import { Profile } from './Profile.js';
import { University } from './University.js';
import { Application } from './Application.js';

const models = {
  User,
  Profile,
  University,
  Application
};

// Run associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export { sequelize, User, Profile, University, Application };
export default models;
