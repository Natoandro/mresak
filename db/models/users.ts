import {
  DataTypes,
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from 'sequelize';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare login: string;
  declare name: string;
  declare passwordHash: string;
  declare passwordResetRequired: boolean;

  // prevent Next.js error (Date is not serializable)
  public toJSON(): InferAttributes<User> {
    const obj = super.toJSON();
    delete (obj as any).createdAt;
    delete (obj as any).updatedAt;
    return obj;
  }
}

export type UserAttributes = InferAttributes<User>;
export type UserCreationAttributes = InferCreationAttributes<User>;

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
