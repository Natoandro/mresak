import { Sequelize } from 'sequelize';
import adminModel from './admin';
import sessionsModel from './sessions';
import usersModel from './users';

const sequelize = new Sequelize(`sqlite:${process.env.SQLITE_DB}`);

const db = {
  sequelize,
  admin: adminModel(sequelize),
  users: usersModel(sequelize),
  sessions: sessionsModel(sequelize),
};

export default db;
