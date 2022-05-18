import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
  DataTypes,
  ForeignKey,
  CreationOptional,
  Attributes,
  CreationAttributes,
  NonAttribute
} from 'sequelize';
import { NextSerializable, Writable } from '~/lib/types';
import { Chat } from './chats';
import { User } from './users';

export interface MessageFilter {
  priorTo?: Date;
}

export class Message
  extends Model<InferAttributes<Message>, InferCreationAttributes<Message>>
{
  declare readonly id: CreationOptional<number>;
  declare readonly chatId: ForeignKey<number>;
  declare readonly senderId: ForeignKey<number>;
  declare readonly text: string;
  declare readonly createdAt: CreationOptional<Date>;

  public toJSON(): MessageAttributes {
    const obj = super.toJSON() as unknown as Writable<MessageAttributes>;
    obj.createdAt = Number(obj.createdAt);
    return obj;
  }

  static findInChat(
    chatId: number, filter: MessageFilter, count = 20
  ): NonAttribute<Promise<Message[]>> {
    // TODO: apply filter, limit...
    return Message.findAll({
      where: {
        chatId
      },
      order: [['createdAt', 'ASC']],
    });
  }
}

export type MessageAttributes = NextSerializable<Attributes<Message>>;
export type MessageCreationAttributes = CreationAttributes<Message>;

export default function messagesModel(sequelize: Sequelize) {
  Message.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
  }, {
    sequelize,
    indexes: [
      { fields: ['chatId', 'createdAt'] }
    ]
  });

  Message.belongsTo(Chat);
  Chat.hasMany(Message, {
    foreignKey: {
      name: 'chatId',
      allowNull: false,
    },
    as: 'messages',
  });

  Message.belongsTo(User, { as: 'sender' });
  User.hasMany(Message, {
    foreignKey: {
      name: 'senderId',
      allowNull: false,
    }
  });

  return Message;
}
