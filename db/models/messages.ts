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
  NonAttribute,
  Op
} from 'sequelize';
import { NextSerializable, Writable } from '~/lib/types';
import ensureNumber from '~/lib/utils/ensureNumber';
import { Chat } from './chats';
import { User } from './users';

export interface MessageFilter {
  since: Date;
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
    delete (obj as any).updatedAt;
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

  static async findAllByUser(
    userId: number, { since }: MessageFilter
  ): Promise<MessageAttributes[]> {
    const sequelize = Chat.sequelize!;
    return (await Message.findAll({
      where: {
        senderId: { [Op.ne]: userId },
        createdAt: { [Op.gt]: since },
        [Op.and]: sequelize.where(
          //* this could be a simple inner join 
          sequelize.literal(`(
            SELECT COUNT(*) FROM ChatMembers
              WHERE ChatMembers.chatId = Message.ChatId AND userId = ${ensureNumber(userId)}
          )`), { [Op.eq]: 1 }
        )
      },
      order: ['createdAt']
    })).map((msg) => msg.toJSON());
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
