import { Sequelize } from 'sequelize';
import adminModel from './admin';

const sequelize = new Sequelize(`sqlite:${process.env.SQLITE_DB}`);

const db = {
  sequelize,
  admin: adminModel(sequelize),
};

export default db;
