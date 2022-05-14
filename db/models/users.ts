import { DataTypes, Model, InferAttributes, InferCreationAttributes, Sequelize } from 'sequelize';

interface UserAttributes {
  id?: number;
  login: string;
  name: string;
  passwordHash: string;
  passwordResetRequired: boolean;
}

type RUserAttributes = Required<UserAttributes>;

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>>
  implements UserAttributes {
  declare id?: number;
  declare login: string;
  declare name: string;
  declare passwordHash: string;
  declare passwordResetRequired: boolean;
}

export default function usersModel(sequelize: Sequelize) {
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.STRING,
    },
    passwordResetRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  }, {
    sequelize,
  });
  return User;
}

export type { User, UserAttributes, RUserAttributes };
