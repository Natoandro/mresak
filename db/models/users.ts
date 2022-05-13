import { DataTypes, Model, InferAttributes, InferCreationAttributes, Sequelize } from 'sequelize';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare login: string;
  declare name: string;
}

export default function adminModel(sequelize: Sequelize) {
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
    freezeTableName: true,
  });
  return User;
}

export type { User };
