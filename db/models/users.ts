import {
  DataTypes,
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Attributes,
  CreationAttributes,
  NonAttribute
} from 'sequelize';
import { NextSerializable } from '~/lib/types';
import { ChatMembers, ChatMembersAttributes } from './chatMembers';

export interface UserAttributes extends NextSerializable<Attributes<User>> { }
export interface UserCreationAttributes extends CreationAttributes<User> { }

export interface UserAsChatMemberAttributes extends UserAttributes {
  ChatMembers: ChatMembersAttributes;
}

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare login: string;
  declare name: string;
  declare passwordHash: string;
  declare passwordResetRequired: boolean;

  declare ChatMembers?: NonAttribute<ChatMembers>;

  // prevent Next.js error (Date is not serializable)
  public toJSON(): Attributes<User> {
    const obj = super.toJSON();
    delete (obj as any).createdAt;
    delete (obj as any).updatedAt;
    obj.passwordHash = 'hashed password';
    return obj;
  }

  public toJsonAsChatMember(): UserAsChatMemberAttributes {
    const obj = this.toJSON() as UserAsChatMemberAttributes;
    obj.ChatMembers = this.ChatMembers!.toJSON();
    return obj;
  };

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
