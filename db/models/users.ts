import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

export interface UserAttributes {
  id: number;
  login: string;
  name: string;
  passwordHash: string;
  passwordResetRequired: boolean;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

export class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public login!: string;
  public name!: string;
  public passwordHash!: string;
  public passwordResetRequired!: boolean;

  // prevent Next.js error (Date is not serializable)
  public toJSON(): UserAttributes {
    const obj = super.toJSON();
    delete (obj as any).createdAt;
    delete (obj as any).updatedAt;
    return obj;
  }
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
