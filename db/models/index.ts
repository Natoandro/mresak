import { Sequelize } from 'sequelize';
import adminModel from './admin';
import chatMembersModel from './chatMembers';
import chatsModel from './chats';
import messagesModel from './messages';
import sessionsModel from './sessions';
import usersModel from './users';

const sequelize = new Sequelize(`sqlite:${process.env.SQLITE_DB}`);

//* Order is important: init dependencies
const db = {
  sequelize,
  admin: adminModel(sequelize),
  users: usersModel(sequelize),
  sessions: sessionsModel(sequelize),
  chatMembers: chatMembersModel(sequelize),
  chats: chatsModel(sequelize),
  messages: messagesModel(sequelize),
};

export default db;
