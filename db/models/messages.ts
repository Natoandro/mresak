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

export type MessageAttributes = Attributes<Message>;
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
      allowNull: false,
    }
  });

  Message.belongsTo(User, { as: 'sender' });
  User.hasMany(Message, {
    foreignKey: {
      allowNull: false,
    }
  });

  return Message;
}
