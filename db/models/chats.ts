import {
  Association,
  Attributes,
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Op,
  Sequelize,
} from 'sequelize';
import Messages from '~/components/chats/Messages';
import { NextSerializable, Writable } from '~/lib/types';
import ensureNumber from '~/lib/utils/ensureNumber';
import { ChatMembers, ChatMembersAttributes } from './chatMembers';
import { Message } from './messages';
import { User, UserAsChatMemberAttributes, UserAttributes } from './users';


export interface ChatAttributes extends NextSerializable<Attributes<Chat>> {
  readonly members?: UserAsChatMemberAttributes[];
}

export class Chat
  extends Model<InferAttributes<Chat>, InferCreationAttributes<Chat>>
{
  declare readonly id: CreationOptional<number>;
  declare title: CreationOptional<string | null>;
  declare readonly createdAt: CreationOptional<Date>;

  declare readonly members?: NonAttribute<User[]>;

  declare getMembers: HasManyGetAssociationsMixin<User>;
  declare addMember: HasManyAddAssociationMixin<User, number>;

  public toJSON(): ChatAttributes {
    const obj = super.toJSON() as unknown as Writable<ChatAttributes>;
    obj.createdAt = String(obj.createdAt);
    delete (obj as any).updatedAt;
    if (this.members) {
      obj.members = this.members.map(m => m.toJsonAsChatMember());
    }
    return obj;
  }

  public static async createWithMembers(title: string | undefined, memberIds: number[]): Promise<Chat> {
    return Chat.sequelize!.transaction(async (transaction) => {
      const chat = await Chat.create({ title }, { transaction });
      for (const memberId of memberIds) {
        await chat.addMember(memberId, { transaction });
      }
      await chat.reload({ transaction, include: [Chat.associations.members] });
      return chat;
    });
  }

  public static async findAllByMember(memberId: number): Promise<Chat[]> {
    ensureNumber(memberId);  //* ensures that user it is a number!!
    if (Number.isNaN(memberId)) throw new Error('invalid member id');
    return Chat.findAll({
      where: {
        id: {
          [Op.in]: Chat.sequelize!.literal(`(
            SELECT chatId
              FROM ChatMembers
              WHERE userId = ${memberId}
              GROUP BY chatId
          )`)
        }
      },
      include: {
        model: User,
        as: 'members',
      }
    });
    // TODO: order
  }

  public static async findLatestByMember(memberId: number): Promise<Chat | null> {
    return Chat.findOne({
      include: [
        {
          model: User,
          as: 'members',
          where: { id: memberId },
        },
        {
          model: Message,
          order: ['createdAt'],
          limit: 1,
        }
      ],
      // order: [[Message, 'createdAt', 'DESC']],
    });
  }

  public static associations: {
    members: Association<Chat, User>;
    messages: Association<Chat, Message>;
  };
}


export default function chatsModel(sequelize: Sequelize) {
  Chat.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: DataTypes.STRING,
    createdAt: DataTypes.DATE,
  }, { sequelize });

  Chat.belongsToMany(User, { through: ChatMembers, as: 'members' });
  User.belongsToMany(Chat, { through: ChatMembers });

  return Chat;
}
