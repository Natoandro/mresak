import { Sequelize } from 'sequelize';
import adminModel from './admin';

const sequelize = new Sequelize('sequelize::memory:');

export const db = {
  sequelize,
  admin: adminModel(sequelize),
};
