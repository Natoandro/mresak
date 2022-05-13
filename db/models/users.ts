import { DataTypes, Model, InferAttributes, InferCreationAttributes, Sequelize } from 'sequelize';

interface UserAttributes {
  login: string;
  name: string;
}

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>>
  implements UserAttributes {
  declare login: string;
  declare name: string;
}

export default function usersModel(sequelize: Sequelize) {
  User.init({
    login: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
  });
  return User;
}

export type { User, UserAttributes };
